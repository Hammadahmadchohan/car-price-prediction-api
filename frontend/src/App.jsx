
import { useState, useEffect, useRef } from "react";
import CarForm from "./components/CarForm";
import { predictCarPrice } from "./services/api";
import "./App.css";

const messages = [
  "Reading your vehicle details",
  "Analyzing engine and performance",
  "Evaluating vehicle specifications",
  "Running Random Forest prediction",
  "Preparing your estimated price",
];

function AILoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((previous) => (previous + 1) % messages.length);
    }, 2300);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="ai-loader" role="status" aria-live="polite">
      <div className="loader-orbit">
        <div className="loader-core">✦</div>
        <span className="orbit-dot dot-one" />
        <span className="orbit-dot dot-two" />
      </div>

      <div className="loader-label">AI ENGINE PROCESSING</div>
      <h2>Finding your car's estimated value</h2>
      <p className="loader-message" key={index}>
        {messages[index]}...
      </p>

      <div className="loader-bars" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>

      <p className="loader-hint">
        Please wait. Our cloud server may take a moment to respond.
      </p>
    </section>
  );
}

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasPredicted, setHasPredicted] = useState(false);
  const resultRef = useRef(null);

  async function handlePredict(carData) {
    setLoading(true);
    setResult(null);
    setError("");
    setHasPredicted(true);

    try {
      const response = await predictCarPrice(carData);

      if (
        !response ||
        !Number.isFinite(Number(response.predicted_price))
      ) {
        throw new Error("Invalid prediction received from server.");
      }

      setResult(response);
    } catch (err) {
      setError(
        err.message || "Unable to predict the price. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetPrediction() {
    setResult(null);
    setError("");
    setHasPredicted(false);
  }

  useEffect(() => {
    if (hasPredicted && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [hasPredicted, loading]);

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">HA</div>

          <div className="brand-text">
            <strong>
              Auto<span className="brand-accent">Value</span> AI
            </strong>
            <small>BY HAMMAD AHMAD</small>
          </div>
        </div>

        <div className="nav-status">
          <span className="status-dot" />
          AI Valuation Engine
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="eyebrow">
            ✦ INTELLIGENT VEHICLE VALUATION
          </div>

          <h1>
            Discover Your Car's
            <span> True Market Value.</span>
          </h1>

          <p>
            Experience smart vehicle valuation powered by machine
            learning. Just three simple steps to your price estimate.
          </p>

          <div className="hero-features">
            <span>✧ Machine Learning</span>
            <span>✧ Quick Estimates</span>
            <span>✧ Easy to Use</span>
          </div>

<div className="hero-car-photo">
  <img src="/hero-car.jpg" alt="Luxury sports car" />
  <div className="photo-overlay">
    <span>✦ POWERED BY MACHINE LEARNING</span>
    <strong>Discover your vehicle's value</strong>
  </div>
</div>

        </section>

        <CarForm
          onPredict={handlePredict}
          loading={loading}
          onChange={resetPrediction}
        />

        <div ref={resultRef} className="feedback-area">
          {loading && <AILoader />}

          {!loading && error && (
            <div className="error-box" role="alert">
              <strong>Prediction unavailable</strong>
              <p>{error}</p>
              <span>Please check your connection and try again.</span>
            </div>
          )}

          {!loading && hasPredicted && result && (
            <section className="result-card" role="status">
              <div className="result-check">✓</div>

              <div className="result-label">
                ✦ YOUR AI VALUATION IS READY
              </div>

              <p>Estimated Selling Price</p>

              <h2>
  PKR{" "}
  {Number(result.predicted_price).toLocaleString(
    "en-PK",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}
</h2>

             <div className="result-note">
  Currency: Pakistani Rupees (PKR). This is an AI estimate,
  not a guaranteed selling price.
</div>

              <button
                type="button"
                className="reset-btn"
                onClick={resetPrediction}
              >
                ✦ Clear Result
              </button>
            </section>
          )}
        </div>
      </main>

      <footer className="footer">
        <span>© 2026 Hammad Ahmad</span>
        <span>Designed & Developed by Hammad Ahmad</span>
      </footer>
    </div>
    
  );
  
}
