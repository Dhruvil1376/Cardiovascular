import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const initialForm = {
  age_years: "",
  gender: 2,
  height_cm: "",
  weight_kg: "",
  ap_hi: "",
  ap_lo: "",
  cholesterol: 1,
  gluc: 1,
  smoke: 0,
  alco: 0,
  active: 1,
};

const CHOLESTEROL_LEVELS = [
  { value: 1, label: "Normal" },
  { value: 2, label: "Above normal" },
  { value: 3, label: "Well above normal" },
];

const GLUCOSE_LEVELS = [
  { value: 1, label: "Normal" },
  { value: 2, label: "Above normal" },
  { value: 3, label: "Well above normal" },
];

const RISK_COPY = {
  low: {
    title: "Low estimated risk",
    body: "Your inputs align with the model's lower-risk cluster. Keep up regular checkups — a single screening isn't a diagnosis.",
  },
  moderate: {
    title: "Moderate estimated risk",
    body: "A few of your values sit in a range the model associates with elevated risk. Worth discussing with a clinician.",
  },
  high: {
    title: "High estimated risk",
    body: "The model places these inputs in its higher-risk range. Please treat this as a prompt to consult a healthcare professional, not a diagnosis.",
  },
};

function ToggleChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`chip ${active ? "chip--active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Gauge({ probability, band }) {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, probability));
  const offset = circumference * (1 - pct);

  return (
    <svg className="gauge" viewBox="0 0 200 200">
      <circle
        cx="100"
        cy="100"
        r={radius}
        className="gauge-track"
        fill="none"
        strokeWidth="14"
      />
      <circle
        cx="100"
        cy="100"
        r={radius}
        className={`gauge-value gauge-value--${band}`}
        fill="none"
        strokeWidth="14"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 100 100)"
      />
      <text x="100" y="94" textAnchor="middle" className="gauge-number">
        {Math.round(pct * 100)}%
      </text>
      <text x="100" y="118" textAnchor="middle" className="gauge-caption">
        estimated risk
      </text>
    </svg>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleNumberChange = (key) => (e) => update(key, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const payload = {
      age_years: Number(form.age_years),
      gender: Number(form.gender),
      height_cm: Number(form.height_cm),
      weight_kg: Number(form.weight_kg),
      ap_hi: Number(form.ap_hi),
      ap_lo: Number(form.ap_lo),
      cholesterol: Number(form.cholesterol),
      gluc: Number(form.gluc),
      smoke: Number(form.smoke),
      alco: Number(form.alco),
      active: Number(form.active),
    };

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.detail || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <svg className="pulse" viewBox="0 0 600 80" preserveAspectRatio="none">
          <path
            d="M0 40 H160 L185 40 L200 10 L220 70 L240 40 L260 40 L275 25 L290 40 H600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
        </svg>
        <div className="hero-text">
          <p className="eyebrow">Screening tool</p>
          <h1>CardioCheck</h1>
          <p className="lede">
            Enter a few vitals and a trained RandomForest model estimates your
            cardiovascular risk in seconds. Built for learning and awareness —
            not a substitute for medical advice.
          </p>
        </div>
      </header>

      <main className="layout">
        <form className="panel form" onSubmit={handleSubmit}>
          <section className="field-group">
            <h2>About you</h2>
            <div className="field-row">
              <label className="field">
                <span>Age (years)</span>
                <input
                  type="number"
                  min="1"
                  max="119"
                  required
                  value={form.age_years}
                  onChange={handleNumberChange("age_years")}
                  placeholder="52"
                />
              </label>
              <div className="field">
                <span>Gender</span>
                <div className="segmented">
                  <ToggleChip active={form.gender === 2} onClick={() => update("gender", 2)}>
                    Male
                  </ToggleChip>
                  <ToggleChip active={form.gender === 1} onClick={() => update("gender", 1)}>
                    Female
                  </ToggleChip>
                </div>
              </div>
            </div>

            <div className="field-row">
              <label className="field">
                <span>Height (cm)</span>
                <input
                  type="number"
                  min="100"
                  max="230"
                  required
                  value={form.height_cm}
                  onChange={handleNumberChange("height_cm")}
                  placeholder="172"
                />
              </label>
              <label className="field">
                <span>Weight (kg)</span>
                <input
                  type="number"
                  min="20"
                  max="250"
                  required
                  value={form.weight_kg}
                  onChange={handleNumberChange("weight_kg")}
                  placeholder="78"
                />
              </label>
            </div>
          </section>

          <section className="field-group">
            <h2>Vitals</h2>
            <div className="field-row">
              <label className="field">
                <span>Systolic BP (ap hi)</span>
                <input
                  type="number"
                  min="60"
                  max="260"
                  required
                  value={form.ap_hi}
                  onChange={handleNumberChange("ap_hi")}
                  placeholder="130"
                />
              </label>
              <label className="field">
                <span>Diastolic BP (ap lo)</span>
                <input
                  type="number"
                  min="40"
                  max="200"
                  required
                  value={form.ap_lo}
                  onChange={handleNumberChange("ap_lo")}
                  placeholder="85"
                />
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                <span>Cholesterol</span>
                <select
                  value={form.cholesterol}
                  onChange={(e) => update("cholesterol", Number(e.target.value))}
                >
                  {CHOLESTEROL_LEVELS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Glucose</span>
                <select
                  value={form.gluc}
                  onChange={(e) => update("gluc", Number(e.target.value))}
                >
                  {GLUCOSE_LEVELS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="field-group">
            <h2>Lifestyle</h2>
            <div className="field-row field-row--triple">
              <div className="field">
                <span>Smokes</span>
                <div className="segmented">
                  <ToggleChip active={form.smoke === 1} onClick={() => update("smoke", 1)}>Yes</ToggleChip>
                  <ToggleChip active={form.smoke === 0} onClick={() => update("smoke", 0)}>No</ToggleChip>
                </div>
              </div>
              <div className="field">
                <span>Drinks alcohol</span>
                <div className="segmented">
                  <ToggleChip active={form.alco === 1} onClick={() => update("alco", 1)}>Yes</ToggleChip>
                  <ToggleChip active={form.alco === 0} onClick={() => update("alco", 0)}>No</ToggleChip>
                </div>
              </div>
              <div className="field">
                <span>Physically active</span>
                <div className="segmented">
                  <ToggleChip active={form.active === 1} onClick={() => update("active", 1)}>Yes</ToggleChip>
                  <ToggleChip active={form.active === 0} onClick={() => update("active", 0)}>No</ToggleChip>
                </div>
              </div>
            </div>
          </section>

          <button type="submit" className="submit" disabled={loading}>
            {loading ? "Checking…" : "Check my risk"}
          </button>

          {error && <p className="error">{error}</p>}
        </form>

        <aside className="panel result">
          {!result && !loading && (
            <div className="result-empty">
              <p className="eyebrow">Result</p>
              <p>Fill in the form and submit to see your estimated risk here.</p>
            </div>
          )}
          {loading && (
            <div className="result-empty">
              <p className="eyebrow">Result</p>
              <p>Running the model…</p>
            </div>
          )}
          {result && (
            <div className="result-content">
              <p className="eyebrow">Result</p>
              <Gauge probability={result.probability} band={result.risk_band} />
              <h3 className={`risk-title risk-title--${result.risk_band}`}>
                {RISK_COPY[result.risk_band].title}
              </h3>
              <p className="risk-body">{RISK_COPY[result.risk_band].body}</p>
              <dl className="result-meta">
                <div>
                  <dt>Model output</dt>
                  <dd>{result.label}</dd>
                </div>
                <div>
                  <dt>Probability</dt>
                  <dd>{(result.probability * 100).toFixed(1)}%</dd>
                </div>
              </dl>
            </div>
          )}
        </aside>
      </main>

      <footer className="footer">
        <p>
          Estimate only — generated by a machine-learning model, not a medical
          professional. Always consult a doctor for real health decisions.
        </p>
      </footer>
    </div>
  );
}
