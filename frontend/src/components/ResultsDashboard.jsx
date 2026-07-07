import ClaimCard from "./ClaimCard";
import "./ResultsDashboard.css";

export const VERDICT_CONFIG = {
  Verified:     { color: "var(--green)", bg: "var(--green-bg)", border: "rgba(34,197,94,0.18)",  label: "Verified" },
  Inaccurate:   { color: "var(--amber)", bg: "var(--amber-bg)", border: "rgba(245,158,11,0.18)", label: "Inaccurate" },
  False:        { color: "var(--red)",   bg: "var(--red-bg)",   border: "rgba(239,68,68,0.18)",  label: "False" },
  Unverifiable: { color: "var(--slate)", bg: "var(--slate-bg)", border: "rgba(113,113,122,0.18)",label: "Unverifiable" },
};

function ScoreRing({ score }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? "var(--green)" : score >= 40 ? "var(--amber)" : "var(--red)";

  return (
    <div className="score-ring-wrap">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--border)" strokeWidth="5"/>
        <circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="score-center">
        <span className="score-pct" style={{ color }}>{score}</span>
        <span className="score-sym" style={{ color }}>%</span>
      </div>
    </div>
  );
}

export default function ResultsDashboard({ results, onReset }) {
  const { total_claims, summary, claims, message } = results;
  const score = total_claims > 0 ? Math.round((summary.verified / total_claims) * 100) : 0;

  return (
    <div className="results-page">
      {/* Header */}
      <div className="results-header">
        <div className="results-header-left">
          <h1 className="results-title">Fact-check report</h1>
          <p className="results-sub">
            {total_claims} claim{total_claims !== 1 ? "s" : ""} found and analyzed
          </p>
        </div>
        <button className="btn-new" onClick={onReset}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7h10M7 2l5 5-5 5"/>
          </svg>
          New document
        </button>
      </div>

      {/* Summary strip */}
      {total_claims > 0 && (
        <div className="summary-strip">
          <div className="summary-score-block">
            <ScoreRing score={score} />
            <div>
              <p className="summary-score-label">Accuracy score</p>
              <p className="summary-score-desc">
                {score >= 70 ? "Mostly accurate" : score >= 40 ? "Contains errors" : "Significant issues found"}
              </p>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-stats">
            {Object.entries(summary).map(([key, count]) => {
              const cfg = VERDICT_CONFIG[key.charAt(0).toUpperCase() + key.slice(1)];
              if (!cfg) return null;
              return (
                <div className="stat-item" key={key}>
                  <span className="stat-count" style={{ color: cfg.color }}>{count}</span>
                  <span className="stat-label">{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No claims */}
      {total_claims === 0 && (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="13" x2="12" y2="13"/>
          </svg>
          <p>{message || "No verifiable claims were found in this document."}</p>
        </div>
      )}

      {/* Claims */}
      {claims && claims.length > 0 && (
        <div className="claims-section">
          <div className="claims-section-header">
            <span className="claims-section-title">Claims</span>
            <span className="claims-count">{claims.length}</span>
          </div>
          <div className="claims-list">
            {claims.map((claim, i) => (
              <ClaimCard key={i} claim={claim} index={i + 1} config={VERDICT_CONFIG} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
