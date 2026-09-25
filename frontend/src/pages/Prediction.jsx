import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';
import { predictCardioRisk } from '../services/api';
import { AlertCircle, Info } from 'lucide-react';

export const Prediction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmitPrediction = async (formData) => {
    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const apiResult = await predictCardioRisk(formData);
      setResult(apiResult);
    } catch (err) {
      setErrorMsg('Failed to process prediction request. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="prediction-page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Cardiovascular Disease Risk Prediction</h2>
        <p style={{ color: '#64748b', marginTop: '0.4rem' }}>
          Enter patient clinical metrics to calculate cardiovascular risk using Machine Learning.
        </p>
      </div>

      {/* Backend Mode Banner */}
      {result?.isDemoMode && (
        <div className="demo-banner">
          <Info size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>API Status Note:</strong> Render FastAPI server is connecting or offline. Displaying prediction result using built-in high-accuracy clinical risk algorithm.
          </div>
        </div>
      )}

      {/* Error Message Box */}
      {errorMsg && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main View Toggle: Result Card or Prediction Form */}
      {result ? (
        <ResultCard result={result} onReset={handleReset} />
      ) : (
        <PredictionForm onSubmit={handleSubmitPrediction} isLoading={isLoading} />
      )}
    </div>
  );
};

export default Prediction;
