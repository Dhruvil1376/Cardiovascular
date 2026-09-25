import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, ArrowRight, ShieldCheck, Database, Sliders, FileText } from 'lucide-react';

export const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div>
          <h1 className="hero-title">
            Cardiovascular Disease <span>Prediction System</span>
          </h1>
          <p className="hero-subtitle">
            An intelligent machine-learning application designed to evaluate individual health metrics 
            and predict potential cardiovascular disease risk with high accuracy.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/prediction" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <span>Start Prediction</span>
              <ArrowRight size={20} />
            </Link>
            
            <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <span>View Analytics</span>
            </Link>
          </div>
        </div>

        <div className="hero-graphic">
          <Heart size={84} fill="#e11d48" color="#e11d48" className="hero-heart-pulse" />
          <h3 style={{ marginTop: '1rem', color: '#0f172a' }}>AI Heart Risk Screening</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem', maxWidth: '320px' }}>
            Trained on 70,000 anonymized clinical patient records with key blood pressure, cholesterol, and lifestyle parameters.
          </p>
        </div>
      </section>

      {/* How It Works Workflow Section */}
      <section className="workflow-steps">
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2rem' }}>
          <h2>How The System Works</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            Follow four simple steps to get an instant cardiovascular disease risk assessment.
          </p>
        </div>

        <div className="workflow-grid">
          {/* Step 1 */}
          <div className="step-card">
            <div className="step-number">1</div>
            <Sliders size={28} style={{ color: '#2563eb', margin: '0 auto 0.75rem', display: 'block' }} />
            <h4 style={{ marginBottom: '0.4rem' }}>Enter Health Information</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Input age, gender, height, weight, blood pressure, cholesterol &amp; glucose levels.
            </p>
          </div>

          {/* Step 2 */}
          <div className="step-card">
            <div className="step-number">2</div>
            <Activity size={28} style={{ color: '#d97706', margin: '0 auto 0.75rem', display: 'block' }} />
            <h4 style={{ marginBottom: '0.4rem' }}>Submit Form</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Our validation layer formats metrics (e.g. age conversion) and dispatches request via Axios.
            </p>
          </div>

          {/* Step 3 */}
          <div className="step-card">
            <div className="step-number">3</div>
            <Heart size={28} style={{ color: '#e11d48', margin: '0 auto 0.75rem', display: 'block' }} />
            <h4 style={{ marginBottom: '0.4rem' }}>ML Prediction</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              The trained machine learning model evaluates risk probability across all features.
            </p>
          </div>

          {/* Step 4 */}
          <div className="step-card">
            <div className="step-number">4</div>
            <ShieldCheck size={28} style={{ color: '#059669', margin: '0 auto 0.75rem', display: 'block' }} />
            <h4 style={{ marginBottom: '0.4rem' }}>View Result</h4>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Receive a clear High Risk or Low Risk prediction score with percentage probability.
            </p>
          </div>
        </div>
      </section>

      {/* Dataset & System Info Banner */}
      <section style={{ marginTop: '4rem' }}>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Database size={22} style={{ color: '#2563eb' }} />
              <h3>Dataset Overview</h3>
            </div>
            <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.6 }}>
              Based on the standard <strong>cardio_train.csv</strong> dataset containing 70,000 subject evaluations with 12 distinct health attributes including physical traits, blood pressure readings, and lifestyle habits.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <FileText size={22} style={{ color: '#059669' }} />
              <h3>Academic Project Scope</h3>
            </div>
            <p style={{ fontSize: '0.925rem', color: '#64748b', lineHeight: 1.6 }}>
              Designed cleanly for machine learning coursework demonstrating React frontend architecture, RESTful API integration, responsive layouts, data parsing, and user form validation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
