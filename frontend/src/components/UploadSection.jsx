import { useState, useRef } from "react";
import "./UploadSection.css";

export default function UploadSection({ onUpload }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef();

  function handleFile(file) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setSelectedFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div className="upload-page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Automated fact verification
        </div>
        <h1 className="hero-title">
          Is your document<br />telling the truth?
        </h1>
        <p className="hero-sub">
          Upload any PDF and our system extracts every factual claim,
          cross-references it against live web sources, and flags what's wrong.
        </p>
      </div>

      {/* Upload card */}
      <div className="upload-card">
        {!selectedFile ? (
          <div
            className={`dropzone ${dragOver ? "dragover" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => handleFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <div className="dz-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <p className="dz-title">Drop PDF here</p>
            <p className="dz-sub">or <span className="dz-link">click to browse</span> — up to 20 MB</p>
          </div>
        ) : (
          <div className="file-ready">
            <div className="file-row">
              <div className="file-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div className="file-meta">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">{(selectedFile.size / 1024).toFixed(0)} KB · PDF</span>
              </div>
              <button
                className="file-remove"
                onClick={() => setSelectedFile(null)}
                aria-label="Remove file"
              >
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                  <path d="M2 2l10 10M12 2L2 12"/>
                </svg>
              </button>
            </div>

            <button className="btn-analyze" onClick={() => onUpload(selectedFile)}>
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="5.5"/>
                <path d="M14 14l2.5 2.5"/>
              </svg>
              Analyze document
            </button>
          </div>
        )}
      </div>

      {/* Process steps */}
      <div className="process-row">
        {[
          {
            n: "01",
            title: "Extract",
            body: "AI scans for statistics, dates, named figures, and verifiable claims.",
            icon: (
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="14" height="14" rx="2"/>
                <line x1="6" y1="6" x2="12" y2="6"/>
                <line x1="6" y1="9" x2="10" y2="9"/>
                <line x1="6" y1="12" x2="8" y2="12"/>
              </svg>
            ),
          },
          {
            n: "02",
            title: "Verify",
            body: "Each claim is searched against live web sources in real time.",
            icon: (
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8.5" cy="8.5" r="5.5"/>
                <path d="M15.5 15.5l-2-2"/>
                <path d="M6.5 8.5h4M8.5 6.5v4"/>
              </svg>
            ),
          },
          {
            n: "03",
            title: "Report",
            body: "Every claim is labeled Verified, Inaccurate, or False with corrections.",
            icon: (
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3,10 6,13 15,4"/>
              </svg>
            ),
          },
        ].map((s) => (
          <div className="process-step" key={s.n}>
            <div className="step-icon">{s.icon}</div>
            <div className="step-body">
              <div className="step-header">
                <span className="step-num">{s.n}</span>
                <span className="step-title">{s.title}</span>
              </div>
              <p className="step-text">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
