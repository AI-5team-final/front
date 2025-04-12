import React from "react";
import { reportError } from "../utils/reportError"; 

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error);

    reportError({
      error,
      stack: errorInfo?.componentStack,
      url: window.location.href,
    });
  }

  handleReload = () => window.location.reload();
  handleGoHome = () => (window.location.href = "/");

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>문제가 발생했습니다. 잠시 후 다시 시도해주세요</h2>
          <p style={{ color: "gray", fontSize: "0.9rem", marginTop: "1rem" }}>
            {this.state.error?.message || "알 수 없는 오류입니다."}
          </p>
          <div style={{ marginTop: "1.5rem" }}>
            <button onClick={this.handleReload} style={{ marginRight: "1rem", cursor: "pointer" }}>
              다시 시도
            </button>
            <button onClick={this.handleGoHome} style={{ cursor: "pointer" }}>홈으로 이동</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
