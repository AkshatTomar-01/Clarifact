import { useState } from "react";
import UploadSection from "./components/UploadSection";
import ResultsDashboard from "./components/ResultsDashboard";
import LoadingState from "./components/LoadingState";
import "./App.css";

export default function App() {
  const [status, setStatus] = useState("idle");
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleUpload(file) {
    setStatus("loading");
    setResults(null);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/fact-check`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error. Please try again.");
      setResults(data);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setResults(null);
    setErrorMsg("");
  }

  return (
    <div className="app">
      {/* Nav */}
      <nav className="app-nav">
        <div className="nav-inner">
          <a className="nav-brand" href="/">
            <div className="nav-logo-mark">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="7" r="5"/>
                <path d="M12 12l2.5 2.5"/>
                <path d="M5 7h4M7 5v4"/>
              </svg>
            </div>
            <span className="nav-brand-name">FactCheck</span>
          </a>
          <span className="nav-pill">AI-Powered</span>
        </div>
      </nav>

      <main className="app-main">
        {status === "idle"    && <UploadSection onUpload={handleUpload} />}
        {status === "loading" && <LoadingState />}
        {status === "error"   && (
          <div className="error-state">
            <div className="error-state-icon">
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M9 3l7 12H2L9 3z"/>
                <path d="M9 8v3M9 13h.01"/>
              </svg>
            </div>
            <h3>Analysis failed</h3>
            <p>{errorMsg}</p>
            <button className="btn-primary" onClick={handleReset}>Try again</button>
          </div>
        )}
        {status === "done" && results && (
          <ResultsDashboard results={results} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
