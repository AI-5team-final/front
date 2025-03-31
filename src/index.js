import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { reportError } from './utils/reportError';
import ErrorBoundary from './components/ErrorBondary';

// 전역 에러 핸들러 등록
window.onerror = (message, source, lineno, colno, error) => {
  reportError(error || message);
};

window.onunhandledrejection = (event) => {
  reportError(event.reason);
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
  // </React.StrictMode>
);