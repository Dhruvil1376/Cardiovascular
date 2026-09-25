import React, { useState } from 'react';
import { User, Activity, HeartPulse, RefreshCw, AlertCircle, Check } from 'lucide-react';

const INITIAL_FORM_STATE = {
  age: '50',
  gender: '1', // 1: Female, 2: Male
  height: '165',
  weight: '70',
  ap_hi: '120',
  ap_lo: '80',
  cholesterol: '1', // 1: Normal, 2: Above Normal, 3: High
  gluc: '1',        // 1: Normal, 2: Above Normal, 3: High
  smoke: '0',       // 0: No, 1: Yes
  alco: '0',        // 0: No, 1: Yes
  active: '1',      // 0: No, 1: Yes
};

export const PredictionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for edited field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleToggleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: String(value) }));
  };

  const validate = () => {
    const newErrors = {};

    // Age validation
    const ageVal = parseFloat(formData.age);
    if (!formData.age || isNaN(ageVal)) {
      newErrors.age = 'Age is required';
    } else if (ageVal <= 0 || ageVal > 120) {
      newErrors.age = 'Please enter a valid age (1 - 120 years)';
    }

    // Height validation
    const heightVal = parseFloat(formData.height);
    if (!formData.height || isNaN(heightVal)) {
      newErrors.height = 'Height is required';
    } else if (heightVal < 50 || heightVal > 250) {
      newErrors.height = 'Please enter a realistic height (50 - 250 cm)';
    }

    // Weight validation
    const weightVal = parseFloat(formData.weight);
    if (!formData.weight || isNaN(weightVal)) {
      newErrors.weight = 'Weight is required';
    } else if (weightVal < 20 || weightVal > 300) {
      newErrors.weight = 'Please enter a realistic weight (20 - 300 kg)';
    }

    // Systolic BP (ap_hi)
    const apHiVal = parseInt(formData.ap_hi, 10);
    if (!formData.ap_hi || isNaN(apHiVal)) {
      newErrors.ap_hi = 'Systolic BP is required';
    } else if (apHiVal < 60 || apHiVal > 260) {
      newErrors.ap_hi = 'Systolic BP should be between 60 and 260 mmHg';
    }

    // Diastolic BP (ap_lo)
    const apLoVal = parseInt(formData.ap_lo, 10);
    if (!formData.ap_lo || isNaN(apLoVal)) {
      newErrors.ap_lo = 'Diastolic BP is required';
    } else if (apLoVal < 40 || apLoVal > 200) {
      newErrors.ap_lo = 'Diastolic BP should be between 40 and 200 mmHg';
    }

    // BP relationship check
    if (apHiVal && apLoVal && apHiVal <= apLoVal) {
      newErrors.ap_hi = 'Systolic BP (ap_hi) must be greater than Diastolic BP (ap_lo)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Cardiovascular Health Predictor</h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
        Fill in the personal and clinical metrics below to estimate cardiovascular disease risk.
      </p>

      {/* SECTION 1: Personal Information */}
      <div className="form-section">
        <h3 className="form-section-title">
          <User size={20} className="brand-icon" style={{ color: '#2563eb' }} />
          <span>Personal Information</span>
        </h3>

        <div className="form-grid">
          {/* Age */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-age">Age (in Years)</label>
            <input
              id="input-age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 45"
              className={`form-input ${errors.age ? 'error' : ''}`}
              min="1"
              max="120"
            />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-gender">Gender</label>
            <select
              id="input-gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value="1">Female (1)</option>
              <option value="2">Male (2)</option>
            </select>
          </div>

          {/* Height */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-height">Height (cm)</label>
            <input
              id="input-height"
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="e.g. 168"
              className={`form-input ${errors.height ? 'error' : ''}`}
            />
            {errors.height && <span className="error-text">{errors.height}</span>}
          </div>

          {/* Weight */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-weight">Weight (kg)</label>
            <input
              id="input-weight"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g. 70"
              className={`form-input ${errors.weight ? 'error' : ''}`}
            />
            {errors.weight && <span className="error-text">{errors.weight}</span>}
          </div>
        </div>
      </div>

      {/* SECTION 2: Blood Pressure */}
      <div className="form-section">
        <h3 className="form-section-title">
          <HeartPulse size={20} style={{ color: '#e11d48' }} />
          <span>Blood Pressure Metrics</span>
        </h3>

        <div className="form-grid">
          {/* Systolic BP */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-ap_hi">
              Systolic BP (ap_hi - mmHg)
            </label>
            <input
              id="input-ap_hi"
              type="number"
              name="ap_hi"
              value={formData.ap_hi}
              onChange={handleChange}
              placeholder="e.g. 120"
              className={`form-input ${errors.ap_hi ? 'error' : ''}`}
            />
            {errors.ap_hi && <span className="error-text">{errors.ap_hi}</span>}
          </div>

          {/* Diastolic BP */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-ap_lo">
              Diastolic BP (ap_lo - mmHg)
            </label>
            <input
              id="input-ap_lo"
              type="number"
              name="ap_lo"
              value={formData.ap_lo}
              onChange={handleChange}
              placeholder="e.g. 80"
              className={`form-input ${errors.ap_lo ? 'error' : ''}`}
            />
            {errors.ap_lo && <span className="error-text">{errors.ap_lo}</span>}
          </div>
        </div>
      </div>

      {/* SECTION 3: Clinical Health & Lifestyle */}
      <div className="form-section">
        <h3 className="form-section-title">
          <Activity size={20} style={{ color: '#059669' }} />
          <span>Health Indicators &amp; Lifestyle</span>
        </h3>

        <div className="form-grid">
          {/* Cholesterol */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-cholesterol">Cholesterol Level</label>
            <select
              id="input-cholesterol"
              name="cholesterol"
              value={formData.cholesterol}
              onChange={handleChange}
              className="form-select"
            >
              <option value="1">Normal (1)</option>
              <option value="2">Above Normal (2)</option>
              <option value="3">Well Above Normal / High (3)</option>
            </select>
          </div>

          {/* Glucose */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-gluc">Glucose Level</label>
            <select
              id="input-gluc"
              name="gluc"
              value={formData.gluc}
              onChange={handleChange}
              className="form-select"
            >
              <option value="1">Normal (1)</option>
              <option value="2">Above Normal (2)</option>
              <option value="3">Well Above Normal / High (3)</option>
            </select>
          </div>
        </div>

        {/* Binary Lifestyle Switches */}
        <div className="form-grid" style={{ marginTop: '1.25rem' }}>
          {/* Smoking */}
          <div className="form-group">
            <label className="form-label">Smoking Habit</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-option ${formData.smoke === '0' ? 'active' : ''}`}
                onClick={() => handleToggleChange('smoke', 0)}
              >
                No
              </button>
              <button
                type="button"
                className={`toggle-option ${formData.smoke === '1' ? 'active' : ''}`}
                onClick={() => handleToggleChange('smoke', 1)}
              >
                Yes
              </button>
            </div>
          </div>

          {/* Alcohol */}
          <div className="form-group">
            <label className="form-label">Alcohol Intake</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-option ${formData.alco === '0' ? 'active' : ''}`}
                onClick={() => handleToggleChange('alco', 0)}
              >
                No
              </button>
              <button
                type="button"
                className={`toggle-option ${formData.alco === '1' ? 'active' : ''}`}
                onClick={() => handleToggleChange('alco', 1)}
              >
                Yes
              </button>
            </div>
          </div>

          {/* Physical Activity */}
          <div className="form-group">
            <label className="form-label">Physical Activity</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-option ${formData.active === '0' ? 'active' : ''}`}
                onClick={() => handleToggleChange('active', 0)}
              >
                No
              </button>
              <button
                type="button"
                className={`toggle-option ${formData.active === '1' ? 'active' : ''}`}
                onClick={() => handleToggleChange('active', 1)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FORM ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ flex: 2, minWidth: '220px' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Predicting...</span>
            </>
          ) : (
            <>
              <HeartPulse size={18} />
              <span>Predict Cardiovascular Risk</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ flex: 1, minWidth: '130px' }}
          onClick={handleReset}
          disabled={isLoading}
        >
          <RefreshCw size={18} />
          <span>Reset Form</span>
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
};

export default PredictionForm;
