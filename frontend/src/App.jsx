import { useState, useRef, useCallback } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

const QUESTION_COLORS = {
  conceptual:  { border: "#6C63FF", badge: "#6C63FF", label: "Conceptual" },
  factual:     { border: "#00C9A7", badge: "#00C9A7", label: "Factual" },
  application: { border: "#F5A623", badge: "#F5A623", label: "Application" },
};

export default function App() {
  const [file, setFile]               = useState(null);
  const [dragging, setDragging]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState("");
  const [activeTab, setActiveTab]     = useState("questions");
  const [revealedHints, setRevealedHints] = useState({});
  const [copied, setCopied]           = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") {
      setFile(f); setError(""); setResult(null);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const analyze = async () => {
    if (!file) return;
    setLoading(true); setError(""); setResult(null); setRevealedHints({});
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res  = await fetch(`${API_URL}/analyze`, { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Something went wrong");
      setResult(json.data);
      setActiveTab("questions");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleHint = (id) =>
    setRevealedHints((prev) => ({ ...prev, [id]: !prev[id] }));

  const copyNotes = () => {
    if (!result) return;
    const text = result.notes
      .map((n) => `## ${n.topic}\n${n.points.map((p) => `• ${p}`).join("\n")}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => { setResult(null); setFile(null); setError(""); };

  return (
    <div className="app">
      {/* ── HEADER ── */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">StudyAI</span>
        </div>
        <p className="logo-sub">Turn any PDF into a complete study guide</p>
      </header>

      <main className="main">

        {/* ── UPLOAD ── */}
        {!result && (
          <section className="upload-section">
            <div
              className={`drop-zone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onClick={() => inputRef.current.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {file ? (
                <div className="file-info">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              ) : (
                <>
                  <span className="drop-icon">☁️</span>
                  <p className="drop-title">Drop your PDF here</p>
                  <p className="drop-sub">or click to browse files</p>
                </>
              )}
            </div>

            {error && <p className="error-msg">⚠️ {error}</p>}

            <button
              className="analyze-btn"
              onClick={analyze}
              disabled={!file || loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" /> Analyzing PDF...
                </span>
              ) : "✨ Generate Study Guide"}
            </button>

            {loading && (
              <div className="loading-steps">
                <p className="step">📖 Reading your PDF...</p>
                <p className="step">🤖 AI is analyzing content...</p>
                <p className="step">📝 Generating questions & notes...</p>
              </div>
            )}
          </section>
        )}

        {/* ── RESULTS ── */}
        {result && (
          <section className="results">

            {/* Summary */}
            <div className="summary-card">
              <span className="summary-icon">🎯</span>
              <div>
                <p className="summary-label">Document Summary</p>
                <p className="summary-text">{result.summary}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              {[
                { key: "questions", label: `❓ Questions (${result.questions?.length ?? 0})` },
                { key: "notes",     label: "📚 Study Notes" },
                { key: "terms",     label: "🔑 Key Terms" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`tab ${activeTab === key ? "active" : ""}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Questions */}
            {activeTab === "questions" && (
              <div className="tab-content">
                {result.questions?.map((q) => {
                  const color = QUESTION_COLORS[q.type] ?? QUESTION_COLORS.conceptual;
                  return (
                    <div
                      key={q.id}
                      className="question-card"
                      style={{ borderLeftColor: color.border }}
                    >
                      <div className="q-header">
                        <span className="q-num">Q{q.id}</span>
                        <span
                          className="q-badge"
                          style={{ background: color.badge + "28", color: color.badge }}
                        >
                          {color.label}
                        </span>
                      </div>
                      <p className="q-text">{q.question}</p>
                      <button className="hint-btn" onClick={() => toggleHint(q.id)}>
                        {revealedHints[q.id] ? "🙈 Hide Hint" : "💡 Show Hint"}
                      </button>
                      {revealedHints[q.id] && (
                        <div className="hint-box">💡 {q.answer_hint}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Notes */}
            {activeTab === "notes" && (
              <div className="tab-content">
                <button className="copy-btn" onClick={copyNotes}>
                  {copied ? "✅ Copied!" : "📋 Copy All Notes"}
                </button>
                {result.notes?.map((n, i) => (
                  <div key={i} className="note-card">
                    <h3 className="note-topic">{n.topic}</h3>
                    <ul className="note-list">
                      {n.points?.map((p, j) => (
                        <li key={j} className="note-point">{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Terms */}
            {activeTab === "terms" && (
              <div className="tab-content terms-grid">
                {result.key_terms?.map((t, i) => (
                  <div key={i} className="term-card">
                    <p className="term-word">{t.term}</p>
                    <p className="term-def">{t.definition}</p>
                  </div>
                ))}
              </div>
            )}

            <button className="reset-btn" onClick={reset}>
              ↩ Analyze Another PDF
            </button>
          </section>
        )}
      </main>

      <footer className="footer">
        Built with ❤️ using React + FastAPI + Groq AI
      </footer>
    </div>
  );
}