import useAuth from "../hooks/useAuth";
import fetchClient from "./fetchClient";
import classifyErrorLevel from './classifyErrorLevel';

export const reportError = async ({ error, stack, url, level = 'CRITICAL' }) => {
    // 자동 레벨 분류
    const finalLevel = level || classifyErrorLevel(error);

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
  
    const buildUserInfoPayload = () => {
      const { userInfo } = useAuth.getState?.() ?? {};
      if (!userInfo) return null;
    
      const mask = (email) => {
        if (!email || !email.includes('@')) return email;
        const [local, domain] = email.split('@');
        return `${local[0]}***@${domain}`;
      };
    
      return {
        email: mask(userInfo.email),
        role: userInfo.role,
      };
    };

    const payload = {
      message,
      url,
      stack,
      level: finalLevel,
      userAgent: navigator.userAgent,
      time: new Date().toISOString(),
      user: buildUserInfoPayload(),
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
  