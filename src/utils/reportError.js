import fetchClient from "./fetchClient";

export const reportError = async ({ error, stack, url }) => {
    let message = "알 수 없는 오류";
  
    if (typeof error === "string") {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      try {
        message = JSON.stringify(error);
      } catch (jsonErr) {
        message = error.toString();
      }
    }
  
    const payload = {
      message,
      stack,
      url,
      userAgent: navigator.userAgent,
      time: new Date().toISOString(),
    };
  
    try {
      await fetchClient("/front-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (sendErr) {
      console.warn("❌ 에러 리포트 전송 실패:", sendErr);
    }
  };
  