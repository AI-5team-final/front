import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useMatch } from "../context/MatchContext";
import { MdKeyboardArrowRight } from "react-icons/md";
import { RiCopperCoinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import fetchClient from "../utils/fetchClient";
import DonutChart from "./DonutChart";
import "../styles/ViewContent.scss";
import LoadingSpinner from "./LoadingSpinner";
import MarkdownResult from "./MarkdownResult";


const ViewContent = ({ role }) => {
  const { userInfo } = useUser();
  const { matchResults } = useMatch();
  const [name] = useState(userInfo?.name || "");
  const [comment, setComment] = useState("");
  const [agentFeedback, setAgentFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { updateCredit } = useUser();

    //   const location = useLocation();
    const navigate = useNavigate();
    const matchResult = matchResults[parseInt(id)];

    if (!matchResult) {
        navigate('/list');
        return null;
    }

    if (!matchResult) {
        navigate("/");
        return null;
    }

    const summaryItems = matchResult.summary
        .split("/")
        .map((item) => item.trim())
        .sort((a, b) =>
        a.startsWith("종합 의견") ? -1 : b.startsWith("종합 의견") ? 1 : 0
        );

  const handleAnalyzeWithAgent = async () => {
    
    try {
      // 1. 크레딧 차감 요청 (500원 차감)
      const res1 = await fetchClient('/payments/credit', {
        method: 'POST',
      });

      if (!res1.ok) {
        throw new Error('크레딧 차감 실패');
      }
      const data = await res1.json();
      toast.success("크레딧 차감 후 분석을 시작합니다.");
      updateCredit(data.balance);

      // 2. 에이전트 분석 요청
      console.log("에이전트 요청")
      setLoading(true);
      const res = await fetchClient("/pdf/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gpt_answer: matchResult.gpt_answer }),
      });

        if (!res.ok) throw new Error("Agent 분석 실패");
        const feedback = await res.text();

      setAgentFeedback(feedback);
      toast.success("Fit Advisor 분석 완료! 크레딧이 차감되었습니다.");
    } catch (err) {
      console.error("Agent 호출 오류:", err);
      toast.error("Agent 분석 중 오류가 발생했습니다. 크레딧 차감을 취소합니다.");
      // 오류 발생 시 크레딧 차감 롤백
      const rollbackRes = await fetchClient('/payments/rollback', {
        method: 'POST',
      });

      if (rollbackRes.ok) {
        toast.success('크레딧 차감을 취소하였습니다.');
        const data = await rollbackRes.json();
        updateCredit(data.balance);
      } else {
        toast.error('크레딧 차감 취소를 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

    return (
        <main className="l-view">
        <section className="section section-report">
            <div className="inner">
            <h2 className="sub-tit">{name}님의 Ai매칭 결과</h2>
            <h3>Ai MATCHING REPORT</h3>
            <div className="round-box">
                {role === "HR" ? (
                <p>
                    채용공고와 지원자가 얼마나 일치하는지{" "}
                    <strong>
                    Ai 매칭률과
                    <br />
                    함께 추천사유
                    </strong>
                    를 속시원히 알려드립니다.
                </p>
                ) : (
                <p>
                    나와 공고가 얼마나 일치하는지{" "}
                    <strong>
                    Ai 매칭률과
                    <br />
                    함께 추천사유
                    </strong>
                    를 속시원히 알려드립니다.
                </p>
                )}
            </div>
            <small>
                *등록하신 이력서를 분석한 결과로, 실제 결과와 다를 수 있습니다.
            </small>
            <div className="cont">
                <h4>총평</h4>
                <DonutChart matchResult={matchResult} />
                <p className="comment">
                <span>종합의견&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <strong>{comment}</strong>
                </p>
                <p className="gpt-answer">{matchResult.gpt_answer}</p>
            </div>


            <div className="cont">
                <h4>기본평가</h4>
                <div className="box">
                {summaryItems.map((item, index) => {
                    const [key, value] = item.split(":");
                    if (!key || !value) return null;

                    if (key.trim() === "종합 의견") {
                    if (!comment) setComment(value.trim());
                    return null;
                    }


                return (
                  <div key={index}>
                    <p className="key">{key.trim()}</p>
                    <p className="value">{value.trim()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="bg">
          <div className="inner">
            <button
              type="button"
              className="btn-advisor"
              onClick={handleAnalyzeWithAgent}
              disabled={loading || agentFeedback}
            >
              <div>
                <strong>Fit Advisor - AI 맞춤 로드맵 받기</strong>
                <span>
                  첫 2회 무료 제공 중! ✨ 회당 <RiCopperCoinLine /> 500
                </span>
              </div>
              <MdKeyboardArrowRight className="icon-arrow" />
            </button>
            <small>
              *Fit Advisor는 AI가 매칭 결과를 분석해, 앞으로의 성장 방향을
              제안해주는 프리미엄 기능입니다.
            </small>
          </div>
        </div>

            </section>
        </main>
    );
};

export default ViewContent;
