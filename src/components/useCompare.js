import { useState } from "react";
import { toast } from "react-toastify";
import fetchClient from "../utils/fetchClient";

export default function useAgentAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [totalScore, setTotalScore] = useState(null);
  const [gptAnswer, setGptAnswer] = useState("");
  const [agentFeedback, setAgentFeedback] = useState("");

  const compareResumeAndPosting = async (resumeFile, postingFile) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("posting", postingFile);

    try {
      setLoading(true);
      const res = await fetchClient("/pdf/reEpo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("GPT 평가 실패");

      const data = await res.json();
      const result = Array.isArray(data) ? data[0] : data;

      setSummary(result.summary);
      setGptAnswer(result.gpt_answer);
      setTotalScore(result.total_score);

      console.log(" GPT 평가 응답:", result);
      toast.success("GPT 평가 완료!");
    } catch (err) {
      console.error(err);
      toast.error("GPT 분석 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const analyzeWithAgent = async () => {
    if (!gptAnswer) return toast.error("GPT 분석 결과가 없습니다.");

    try {
      setLoading(true);
      const res = await fetchClient("/pdf/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gpt_answer: gptAnswer }),
      });

      if (!res.ok) throw new Error("Agent 분석 실패");

      const feedback = await res.text();

      setAgentFeedback(feedback);
      toast.success("Agent 분석 완료!");
    } catch (err) {
      console.error(" Agent 호출 오류:", err);
      toast.error("Agent 분석 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    summary,
    totalScore,
    gptAnswer,
    agentFeedback,
    compareResumeAndPosting,
    analyzeWithAgent,
  };
}
