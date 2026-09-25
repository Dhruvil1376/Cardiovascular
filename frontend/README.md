# Cardiovascular Disease Prediction System - React Frontend

A simple, modern, responsive frontend application for predicting cardiovascular disease risk based on patient clinical parameters from the `cardio_train.csv` dataset. Built specifically for machine learning college coursework.

---

## 🌟 Key Features

1. **Home Page**: Interactive landing page with title, health graphics, workflow breakdown (`Enter Data → Submit → ML Prediction → View Result`), and dataset summary.
2. **Prediction Form & Validation**:
   - **Personal Info**: Age (in Years), Gender (Female/Male), Height (cm), Weight (kg).
   - **Blood Pressure**: Systolic BP (`ap_hi`), Diastolic BP (`ap_lo`).
   - **Health Indicators**: Cholesterol (Normal / Above Normal / High), Glucose (Normal / Above Normal / High), Smoking (Yes/No), Alcohol Intake (Yes/No), Physical Activity (Yes/No).
   - **Validation**: Client-side validation ensuring positive ranges and `ap_hi > ap_lo` logic.
3. **Prediction Result UI**:
   - Clear risk badge: **HIGH RISK** or **LOW RISK**.
   - Estimated probability percentage score (e.g. `78.5%`).
   - Actionable health recommendations & medical disclaimer banner.
4. **Dataset Dashboard**:
   - Overview metrics: Total dataset size (70,000), Positive count, Negative count, Average Age, Height, Weight.
   - Interactive charts using **Recharts**: Cardiovascular risk outcome distribution, Gender distribution, Cholesterol breakdown, and Glucose breakdown.
5. **Dataset Table & Explorer**:
   - Paginated record viewer with page navigation and items per page selector.
   - Search bar (by ID, Age, Height, Weight, BP).
   - Filter dropdowns (by Cardio status or Gender).
6. **Robust API Integration & Offline Fallback**:
   - Single central API configuration in `src/services/api.js`.
   - Sends formatted JSON payload to `http://localhost:5000/api/prediction`.
   - Converts Age from years to days (`age * 365.25`) automatically to match ML models trained on raw `cardio_train.csv`.
   - Includes graceful offline fallback simulation so the application works seamlessly even if the backend is offline.

---

## 🚀 How to Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- `npm` (comes with Node.js)

### Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 🔌 API Endpoint & Format

### Endpoint Configuration
The backend endpoint is configured in `src/services/api.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  PREDICTION_ENDPOINT: '/prediction',
  SEND_AGE_IN_DAYS: true, // Converts age from years to days
};
```

### Request Payload Structure (`POST /api/prediction`)
```json
{
  "age": 16436,
  "gender": 1,
  "height": 170,
  "weight": 70,
  "ap_hi": 120,
  "ap_lo": 80,
  "cholesterol": 1,
  "gluc": 1,
  "smoke": 0,
  "alco": 0,
  "active": 1
}
```

### Expected Response Payload Structure
```json
{
  "prediction": 1,
  "probability": 78.5,
  "risk_level": "HIGH RISK"
}
```

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── Navbar.jsx         # Responsive Navigation Header
│   ├── PredictionForm.jsx # Input form with full validation
│   ├── ResultCard.jsx     # Result badge, percentage & recommendations
│   ├── StatCard.jsx       # Reusable dashboard metric card
│   └── Footer.jsx         # Clean project footer
│
├── pages/
│   ├── Home.jsx           # Landing page & system workflow
│   ├── Prediction.jsx     # Prediction flow controller
│   ├── Dashboard.jsx      # Analytics cards & Recharts graphs
│   └── Dataset.jsx        # Paginated dataset table with search & filter
│
├── services/
│   ├── api.js             # Central Axios API client & age formatting
│   └── datasetService.js  # Dataset statistics & table querying service
│
├── App.jsx                # React Router setup & global layout
├── main.jsx               # React DOM root entrypoint
└── index.css              # Custom Healthcare CSS Design System
```

---

## 📊 Dataset Encoding Reference

| Feature | Dataset Column | Encoding Values |
|---|---|---|
| Age | `age` | Input in **Years** on UI $\rightarrow$ Converted to **Days** for model |
| Gender | `gender` | `1`: Female, `2`: Male |
| Height | `height` | Centimeters (cm) |
| Weight | `weight` | Kilograms (kg) |
| Systolic BP | `ap_hi` | mmHg |
| Diastolic BP | `ap_lo` | mmHg |
| Cholesterol | `cholesterol` | `1`: Normal, `2`: Above Normal, `3`: High |
| Glucose | `gluc` | `1`: Normal, `2`: Above Normal, `3`: High |
| Smoke | `smoke` | `0`: No, `1`: Yes |
| Alcohol | `alco` | `0`: No, `1`: Yes |
| Physical Activity | `active` | `0`: No, `1`: Yes |
| Cardio (Target) | `cardio` | `0`: Low Risk, `1`: High Risk |
