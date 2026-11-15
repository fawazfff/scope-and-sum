import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("Scope & Sum render error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: "100vh", padding: "48px 24px", background: "#f3f1eb", color: "#29372e", fontFamily: "Arial, sans-serif" }}>
          <div style={{ maxWidth: 680, margin: "8vh auto", padding: 32, background: "#fbfaf6", border: "1px solid #e4e2d9" }}>
            <div style={{ color: "#b56d50", fontSize: 12, letterSpacing: 2, marginBottom: 16 }}>SCOPE & SUM</div>
            <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>The workspace hit a rendering error.</h1>
            <p style={{ lineHeight: 1.6, color: "#687267" }}>The page loaded, but one part of the app failed to start. This diagnostic message will help us fix it.</p>
            <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", padding: 16, background: "#f3eee8", color: "#8a4938", fontSize: 13 }}>{String(this.state.error?.stack || this.state.error)}</pre>
            <button onClick={() => window.location.reload()} style={{ border: 0, padding: "12px 18px", background: "#315842", color: "white", cursor: "pointer" }}>Reload workspace</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AppErrorBoundary><App /></AppErrorBoundary>
    </React.StrictMode>
  );
} else {
  document.body.innerHTML = "<main style='padding:40px;font:16px Arial'>Scope &amp; Sum could not find its app mount point.</main>";
}
