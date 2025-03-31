// components/ErrorBoundary.js
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error);
    reportError({
      error,
      stack: errorInfo?.componentStack,
      url: window.location.href,
    });
  }

  handleReload = () => {
    // 현재 페이지 새로고침
    window.location.reload();
  };

  handleGoHome = () => {
    // 홈으로 이동
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>문제가 발생했습니다. 잠시 후 다시 시도해주세요 🙏</h2>
          <div style={{ marginTop: "1rem" }}>
            <button onClick={this.handleReload} style={{ marginRight: "1rem" }}>
              🔄 다시 시도
            </button>
            <button onClick={this.handleGoHome}>🏠 홈으로 이동</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
