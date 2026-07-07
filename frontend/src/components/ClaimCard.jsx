import { useState } from "react";
import "./ClaimCard.css";

export default function ClaimCard({ claim, index, config }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = config[claim.verdict] || config["Unverifiable"];

  return (
    <div className={`claim-card ${expanded ? "is-expanded" : ""}`}>
      <button className="claim-row" onClick={() => setExpanded(!expanded)}>
        {/* Verdict indicator */}
        <div className="verdict-dot" style={{ background: cfg.color }} />

        {/* Claim text */}
        <span className="claim-text">{claim.claim}</span>

        {/* Verdict pill */}
        <span
          className="verdict-pill"
          style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
        >
          {cfg.label}
        </span>

        {/* Chevron */}
        <div className={`chevron ${expanded ? "rotated" : ""}`}>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 4l4 4 4-4"/>
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="claim-detail">
          {/* Index */}
          <div className="detail-row">
            <span className="detail-label">Claim</span>
            <span className="detail-mono">#{index}</span>
          </div>

          {claim.context && (
            <div className="detail-row">
              <span className="detail-label">In document</span>
              <p className="detail-quote">"{claim.context}"</p>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Assessment</span>
            <p className="detail-value">{claim.explanation}</p>
          </div>

          {claim.correction && (
            <div className="detail-row correction-row">
              <span className="detail-label correction-label">Correction</span>
              <p className="detail-value correction-value">{claim.correction}</p>
            </div>
          )}

          {claim.sources && claim.sources.length > 0 && (
            <div className="detail-row">
              <span className="detail-label">Sources</span>
              <div className="sources-list">
                {claim.sources.map((src, i) => (
                  <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="source-link">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 1h4v4M11 1L5 7"/>
                      <path d="M5 3H2a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V8"/>
                    </svg>
                    {src.replace(/^https?:\/\//, "").slice(0, 60)}{src.length > 60 ? "…" : ""}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
