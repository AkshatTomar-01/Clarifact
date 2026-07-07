import { useEffect, useState } from "react";
import "./LoadingState.css";

const STEPS = [
  { text: "Extracting text from PDF" },
  { text: "Identifying verifiable claims" },
  { text: "Searching live web sources" },
  { text: "Evaluating claim accuracy" },
  { text: "Compiling report" },
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentStep((p) => (p < STEPS.length - 1 ? p + 1 : p));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="loading-page">
      <div className="loading-inner">
        <div className="loading-indicator">
          <div className="loading-bar" />
        </div>
        <h2 className="loading-title">Analyzing document</h2>
        <p className="loading-sub">This takes 30–60 seconds. Do not close this tab.</p>

        <div className="step-list">
          {STEPS.map((s, i) => {
            const state = i < currentStep ? "done" : i === currentStep ? "active" : "pending";
            return (
              <div className={`step-item step-${state}`} key={i}>
                <div className="step-indicator">
                  {state === "done" ? (
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2,6 5,9 10,3"/>
                    </svg>
                  ) : state === "active" ? (
                    <div className="dot-spinner" />
                  ) : (
                    <div className="dot-idle" />
                  )}
                </div>
                <span className="step-label">{s.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
