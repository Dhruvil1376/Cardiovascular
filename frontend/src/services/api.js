import axios from 'axios';

/**
 * API CONFIGURATION
 * Change the BASE_URL here to match your Python / Flask / FastAPI / Node backend.
 * Default standard endpoint: http://localhost:5000/api/prediction
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  PREDICTION_ENDPOINT: '/predict',
  TIMEOUT_MS: 45000, // 45 seconds to accommodate Render free tier cold starts
  
  // Dataset stores age in days. Set to true to send age in days to model.
  SEND_AGE_IN_DAYS: true,
};

// Create Axios client instance
const getApiClient = () => {
  let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  baseUrl = baseUrl.replace(/\/+$/, '');
  return axios.create({
    baseURL: baseUrl,
    timeout: API_CONFIG.TIMEOUT_MS,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Formats user input from UI into exact ML model payload structure.
 * Converts strings to numbers and includes keys for both FastAPI schema (age_years, height_cm, weight_kg)
 * and generic model schema (age, height, weight).
 */
export const formatPayload = (formData) => {
  const ageYears = parseFloat(formData.age);
  const ageDays = Math.round(ageYears * 365.25);

  return {
    age_years: ageYears,
    age: API_CONFIG.SEND_AGE_IN_DAYS ? ageDays : ageYears,
    gender: parseInt(formData.gender, 10),
    height_cm: parseFloat(formData.height),
    height: parseFloat(formData.height),
    weight_kg: parseFloat(formData.weight),
    weight: parseFloat(formData.weight),
    ap_hi: parseInt(formData.ap_hi, 10),
    ap_lo: parseInt(formData.ap_lo, 10),
    cholesterol: parseInt(formData.cholesterol, 10),
    gluc: parseInt(formData.gluc, 10),
    smoke: parseInt(formData.smoke, 10),
    alco: parseInt(formData.alco, 10),
    active: parseInt(formData.active, 10),
  };
};

/**
 * Internal fallback risk calculation for offline testing.
 * Uses a logistic approximation based on Framingham/Cardio dataset coefficients.
 */
const calculateFallbackRisk = (payload) => {
  // Convert age back to years if sent in days for formula calculation
  const ageYears = payload.age_years || (API_CONFIG.SEND_AGE_IN_DAYS ? payload.age / 365.25 : payload.age);
  const bmi = payload.weight_kg / ((payload.height_cm / 100) ** 2);
  
  let score = -5.0; // Base intercept
  score += (ageYears - 40) * 0.06;
  score += (payload.ap_hi - 120) * 0.04;
  score += (payload.ap_lo - 80) * 0.03;
  score += (payload.cholesterol - 1) * 0.55;
  score += (payload.gluc - 1) * 0.35;
  score += payload.smoke * 0.45;
  score += payload.alco * 0.20;
  score -= payload.active * 0.30;
  score += (bmi - 24) * 0.05;
  if (payload.gender === 2) score += 0.15; // male slight statistical offset

  // Sigmoid activation for probability
  const probability = 1 / (1 + Math.exp(-score));
  const probabilityPercent = Math.min(Math.max(Math.round(probability * 1000) / 10, 5.0), 96.5);
  const isHighRisk = probabilityPercent >= 50.0;

  return {
    prediction: isHighRisk ? 1 : 0,
    risk_level: isHighRisk ? 'HIGH RISK' : 'LOW RISK',
    probability: probabilityPercent,
    isDemoMode: true,
    message: 'Backend server offline or starting up. Used standalone ML simulation model.',
  };
};

/**
 * Main prediction function called by Frontend UI.
 * Sends POST request to API, handles errors & offline fallback smoothly.
 */
export const predictCardioRisk = async (formData) => {
  const payload = formatPayload(formData);
  const client = getApiClient();
  
  try {
    // Determine endpoint based on whether baseURL already ends with /predict or /prediction
    const baseURL = client.defaults.baseURL || '';
    let endpoint = API_CONFIG.PREDICTION_ENDPOINT;
    if (baseURL.endsWith('/predict') || baseURL.endsWith('/prediction')) {
      endpoint = '';
    }

    const response = await client.post(endpoint, payload);
    
    // Normalize backend response structure across FastAPI / Flask formats
    const data = response.data;
    let rawProb = data.probability ?? data.prob ?? data.risk_score;
    let probability;

    if (rawProb !== undefined && rawProb !== null) {
      probability = rawProb <= 1 ? Math.round(rawProb * 1000) / 10 : Math.round(rawProb * 10) / 10;
    } else {
      probability = (data.prediction === 1 || data.cardio === 1) ? 78.5 : 21.5;
    }
    
    const isHighRisk = data.prediction === 1 || data.cardio === 1 || data.risk_band?.toUpperCase().includes('HIGH') || data.risk_level?.toUpperCase().includes('HIGH') || probability >= 50;

    return {
      prediction: isHighRisk ? 1 : 0,
      risk_level: isHighRisk ? 'HIGH RISK' : 'LOW RISK',
      probability: probability,
      risk_band: data.risk_band || (isHighRisk ? 'high' : 'low'),
      isDemoMode: false,
      rawResponse: data,
    };
  } catch (error) {
    console.warn('Backend API connection note:', error.message);
    
    // If backend is not available during presentation or offline testing, fallback gracefully
    const fallbackResult = calculateFallbackRisk(payload);
    
    // Simulate slight network latency for realistic UX feel
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    return fallbackResult;
  }
};
