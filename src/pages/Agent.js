import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAgentAnalyzer from "../components/useCompare"; // hooks 디렉토리에 있으면 ../hooks/...

const Agent = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { resumeFile, jobPostFile } = state || {};

  const {
    summary,
    totalScore,
    gptAnswer,
    agentFeedback,
    loading,
    compareResumeAndPosting,
    analyzeWithAgent,
  } = useAgentAnalyzer();

  useEffect(() => {
    if (!resumeFile || !jobPostFile) {
      toast.error("파일 정보가 유효하지 않습니다.");
      navigate("/"); // 잘못된 접근 시 홈으로
      return;
    }

    compareResumeAndPosting(resumeFile, jobPostFile);
  }, [resumeFile, jobPostFile]);

  return (
    <div className="agent-page">
      <div className="analyzer-result">
        <h2> GPT 평가 결과</h2>

        {loading && <p>분석 중입니다...</p>}

        {!loading && summary ? (
          <>
            <p>
              <strong>총점:</strong> {totalScore}
            </p>
            <p>{summary}</p>
          </>
        ) : (
          <p>GPT 분석 결과가 없습니다.</p>
        )}

        {!loading && !agentFeedback && summary && (
          <button onClick={analyzeWithAgent} disabled={loading}>
            {loading ? "Agent 분석 중..." : "Agent 분석 시작"}
          </button>
        )}

        {agentFeedback && (
          <>
            <h2>AI Agent 피드백</h2>
            <pre>{agentFeedback}</pre>
          </>
        )}
      </div>
    </div>
  );
};

export default Agent;
