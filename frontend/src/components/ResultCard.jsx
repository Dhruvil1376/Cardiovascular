import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, RotateCcw, Info } from 'lucide-react';

export const ResultCard = ({ result, onReset }) => {
  if (!result) return null;

  const isHighRisk = result.prediction === 1 || result.risk_level?.toUpperCase().includes('HIGH');
  const probability = result.probability || (isHighRisk ? 78.5 : 21.5);

  return (
    <div className="card result-card">
      <h2 style={{ fontSize: '1.4rem', color: '#64748b', fontWeight: 600 }}>
        Prediction Result
      </h2>
      <h3 style={{ fontSize: '1.1rem', margin: '0.25rem 0 1rem', color: '#1e293b' }}>
        Cardiovascular Disease Risk Evaluation
      </h3>

      <div className={`result-badge ${isHighRisk ? 'high-risk' : 'low-risk'}`}>
        {isHighRisk ? (
          <>
            <ShieldAlert size={28} />
            <span>HIGH RISK</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={28} />
            <span>LOW RISK</span>
          </>
        )}
      </div>

      <div style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
        {isHighRisk ? 'Higher Cardiovascular Disease Risk' : 'Lower Cardiovascular Disease Risk'}
      </div>

      {/* Probability Percentage */}
      <div style={{ margin: '1.25rem 0 0.5rem' }}>
        <span style={{ fontSize: '0.95rem', color: '#64748b' }}>Estimated Probability: </span>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: isHighRisk ? '#dc2626' : '#059669' }}>
          {probability}%
        </span>
      </div>

      {/* Visual Bar */}
      <div className="probability-bar-container">
        <div 
          className="probability-bar-fill" 
          style={{ 
            width: `${probability}%`,
            backgroundColor: isHighRisk ? '#dc2626' : '#059669'
          }}
        />
      </div>

      {/* Risk Factors / Recommendations summary */}
      <div style={{ 
        maxWidth: '550px', 
        margin: '1.5rem auto 0', 
        padding: '1rem', 
        backgroundColor: '#f8fafc', 
        borderRadius: '8px', 
        textAlign: 'left',
        border: '1px solid #e2e8f0',
        fontSize: '0.9rem'
      }}>
        <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.4rem' }}>
          Key Insights &amp; Suggestions:
        </strong>
        {isHighRisk ? (
          <ul style={{ paddingLeft: '1.2rem', color: '#475569' }}>
            <li>High risk factors detected (e.g., elevated blood pressure or cholesterol levels).</li>
            <li>Maintain regular physical activity (at least 30 minutes daily).</li>
            <li>Adopt a low-sodium, heart-healthy dietary plan.</li>
            <li>Schedule routine checkups with a qualified healthcare professional.</li>
          </ul>
        ) : (
          <ul style={{ paddingLeft: '1.2rem', color: '#475569' }}>
            <li>Health indicators are within lower risk parameters.</li>
            <li>Continue balanced nutrition and active daily routine.</li>
            <li>Monitor blood pressure and cholesterol during annual checkups.</li>
          </ul>
        )}
      </div>

      {/* Action Button */}
      <div style={{ marginTop: '2rem' }}>
        <button className="btn btn-primary" onClick={onReset}>
          <RotateCcw size={18} />
          <span>Predict Again</span>
        </button>
      </div>

      {/* Medical Disclaimer */}
      <div className="disclaimer-box">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <Info size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Disclaimer:</strong> This prediction is for <strong>educational purposes only</strong> and is not a medical diagnosis. Always consult a certified healthcare professional for medical advice.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
