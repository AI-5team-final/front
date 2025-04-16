import React from "react";
import { reportError } from "../utils/reportError"; 
import "../styles/ErrorBoundary.scss";

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
        <div className="error-boundary">
          <h2>문제가 발생했습니다. 잠시 후 다시 시도해주세요</h2>
          <p>
            {this.state.error?.message || "알 수 없는 오류입니다."}
          </p>
          <div>
            <button onClick={this.handleReload} style={{ marginRight: "1rem"}}>
              다시 시도
            </button>
            <button onClick={this.handleGoHome}>홈으로 이동</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
