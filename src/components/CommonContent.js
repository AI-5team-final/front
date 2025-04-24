import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiCopperCoinLine } from "react-icons/ri";
import { MdKeyboardArrowRight } from "react-icons/md";
import { GrDocumentDownload, GrDocumentPdf } from "react-icons/gr";
import fetchClient from "../utils/fetchClient";
import DonutChart from "./DonutChart";
import MarkdownResult from "./MarkdownResult";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading";
import { handleClientError } from "../utils/handleClientError";


const CommonContent = ({matchResult, role, isMock = false}) => {
    // const { userInfo, updateCredit } = useUser();
    const { userInfo, updateCredit } = useAuth();
    // pdf에서 가져온 이름
    const [name] = useState("");
	const [comment, setComment] = useState("");
	const [agentFeedback, setAgentFeedback] = useState("");
	const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isOneToOneMatch = localStorage.getItem("isOneToOneMatch")==="false"? false : true;
    const oneResumeFile = localStorage.getItem("oneResumeFile") ?? null;
    const oneJobPostFile = localStorage.getItem("oneJobPostFile") ?? null;

    const summaryItems = matchResult?.summary.split("/").map((item) => item.trim()).sort((a, b) =>
		a.startsWith("종합 의견") ? -1 : b.startsWith("종합 의견") ? 1 : 0 
	);

    console.log("matchResult",matchResult)

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

    if(!matchResult){
		console.warn("매칭 결과가 없습니다.")
		return <Navigate to="/"/>;
	}

    const handleDownload = async () => {
        if (isMock) {
            toast.info("튜토리얼에서는 다운로드가 비활성화되어 있습니다.");
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsLoading(true);
            const element = document.getElementById("pdf-content");
            
            if (!element) {
                console.error("캡처 대상 요소를 찾을 수 없습니다.");
                return;
            }

            const canvas = await html2canvas(element, {
                useCORS: true,
                scale: 2,
                logging: true,
                removeContainer: true
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");        
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            if (!imgData || !imgData.startsWith("data:image/png")) {
                throw new Error("이미지 데이터가 올바르지 않음");
            }

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const ratio = pdfWidth / imgWidth;
            const scaledHeight = imgHeight * ratio;

            let position = 0;
            while (position < scaledHeight) {
                pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, scaledHeight);
                if (position + pdfHeight < scaledHeight) pdf.addPage();
                position += pdfHeight;
            }

            const pdfName = matchResult.name
            ? `${matchResult.name}_매칭결과.pdf`
            : `1대1_매칭결과.pdf`;
        
            pdf.save(pdfName);    
        }catch(error){
            console.error('[PDF 다운로드 오류]', error);
            toast.error(error.message);
        }finally {
            setIsLoading(false);
        }
        
    }

    const handleAnalyzeWithAgent = async () => {
        if (isMock) {
            toast.info("튜토리얼에서는 Fit Advisor 기능이 비활성화되어 있습니다.");
            return;
        }

        if(userInfo?.credit < 500){
            toast.error("크레딧이 부족합니다.\n결제 후에 이용하실 수 있습니다.");
            return;
        }

        try {	
            // 1. 크레딧 차감 요청 (500원 차감)
            const res1 = await fetchClient('/payments/credit', {
                method: 'POST',
            });

            if (!res1.ok) {
                const errData = await res1.json();
                const err = new Error(errData.message || '크레딧 차감 실패');
                handleClientError({
                    error: err,
                    toastMessage: '크레딧 차감에 실패했습니다.',
                    contextUrl: '/payments/credit'
                });
                throw err;
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
                body: JSON.stringify({
                    resume_eval: matchResult.eval_resume,
                    selfintro_eval: matchResult.eval_selfintro,
                    resume_score: matchResult.resume_score,
                    selfintro_score: matchResult.selfintro_score,
                    resume_text: matchResult.resume_text,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                const err = new Error(errData.message || 'Agent 분석 실패');
                handleClientError({
                    error: err,
                    toastMessage: 'Agent 분석에 실패했습니다.',
                    contextUrl: '/pdf/agent'
                })
                throw err;
            }

            
            const feedback = await res.json();

            setAgentFeedback(feedback);
            toast.success("Fit Advisor 분석 완료! 크레딧이 차감되었습니다.");
        } catch (err) {
            handleClientError({
                error: err,
                toastMessage: "Agent 분석 중 오류가 발생했습니다. 크레딧 차감을 취소합니다.",
                url: '/pdf/agent'
            });

            // 오류 발생 시 크레딧 차감 롤백
            const rollbackRes = await fetchClient('/payments/rollback', {
                method: 'POST',
            });

            if (rollbackRes.ok) {
                toast.success('크레딧 차감을 취소하였습니다.');
                const data = await rollbackRes.json();
                updateCredit(data.balance);
            } else {
                const rollbackData = await rollbackRes.json();
                const rollbackError = new Error(rollbackData.message || '크레딧 차감 취소 실패 (catch)');
                handleClientError({
                    error: rollbackError,
                    toastMessage: "크레딧 차감 취소를 실패했습니다.",
                    url: '/payments/rollback'
                });
                throw rollbackError;
            }
        } finally {
            setLoading(false);
        }        
    };

    const gapList = agentFeedback ? agentFeedback.gapText.split(/(?=\d\.)/) : [];

    const plan = agentFeedback ? agentFeedback.planText ? JSON.parse(agentFeedback.planText)
    : null : null;

    return (
        isLoading ? (
            <Loading text={"리포트를 다운로드 중입니다."}/>
        ) : 
        (
            <main className="l-view">
                <section className="section section-report" id="pdf-content">
                    <div className="inner">
                        <h2 className="sub-tit">
                            {isOneToOneMatch ? "1대 1 " : (<span>{userInfo?.name} - {matchResult.name}</span>)} Ai매칭 결과
                        </h2>
                        <h3 className="tit-line">Ai MATCHING REPORT</h3>
                        <div className="icon-area">
                            {!isMock && isOneToOneMatch ? (
                                <>
                                    <a href={oneResumeFile} className="btn btn-download" target="_blank" rel="noreferrer">
                                        <GrDocumentPdf />
                                        <span>이력서<br /> 미리보기</span>
                                    </a>
                                    <span></span>
                                    <a href={oneJobPostFile} className="btn btn-download" target="_blank" rel="noreferrer">
                                        <GrDocumentPdf />
                                        <span>채용공고<br /> 미리보기</span>
                                    </a>
                                </>
                            ) : !isMock ? (
                                <a href={matchResult.uri} className="btn btn-download" target="_blank" rel="noreferrer">
                                    <GrDocumentPdf />
                                    <span>{role === "HR" ? "이력서" : "채용공고"}<br /> 미리보기</span>
                                </a>
                            ) : (
                                <div className="btn btn-download disabled">
                                    <GrDocumentPdf />
                                    <span>미리보기<br /> (비활성화)</span>
                                </div>
                            )}

                            <span></span>

                            <button
                                type="button"
                                className="btn btn-report-download"
                                onClick={handleDownload}
                                disabled={isMock}
                            >
                                <GrDocumentDownload />
                                <span>매칭결과<br />다운로드</span>
                            </button>
                        </div>

                        <div className="round-box">
                            <p>
                                {role === "HR"
                                    ? "채용공고와 지원자가 얼마나 일치하는지"
                                    : "나와 공고가 얼마나 일치하는지"}{" "}
                                <strong>
                                    Ai 매칭률과
                                    <br />
                                    함께 추천사유
                                </strong>
                                를 속시원히 알려드립니다.
                            </p>
                        </div>
                        <small>
                            {role === "HR" ? "" : "*등록하신 이력서를 분석한 결과로, 실제 결과와 다를 수 있습니다."}
                        </small>

                        <div className="cont">
                            <h4>총평</h4>
                            <div className="chart-donut-wrapper">
                                <DonutChart matchResult={matchResult} />
                            </div>
                            <p className="total-summary">{matchResult.summary}</p>
                        </div>

                        <div className="cont">
                            <h4>항목별 평가</h4>
                            <div className="box">
                                <div className="resume-eval">
                                    <p className="key">이력서 - <strong>{matchResult.resume_score}점</strong></p>
                                    <p className="value">{matchResult.eval_resume}</p>
                                </div>
                                <div className="selfintro-eval">
                                    <p className="key">자기소개서 - <strong>{matchResult.selfintro_score}점</strong></p>
                                    <p className="value">{matchResult.eval_selfintro}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {role !== "HR" && (
                        <div className="bg">
                            <div className="inner">
                                {loading ? (
                                    <Loading text={"결과를 분석중입니다."} />
                                ) : !agentFeedback ? (
                                    <>
                                        <button
                                            type="button"
                                            className="btn-advisor"
                                            onClick={handleAnalyzeWithAgent}
                                            disabled={isMock}
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
                                            Fit Advisor는 AI가 매칭 결과를 분석해, 앞으로의 성장 방향을
                                            제안해주는 프리미엄 기능입니다.
                                        </small><br />
                                        <small>※ 결제 후 페이지를 벗어나면 다시 결제가 필요합니다.</small>
                                    </>
                                ) : (
                                    <div style={{ marginTop: "2rem" }}>
                                        <h3 className="tit-line">Fit Advisor의 분석 결과</h3>
                                        <p className="caution">※ 이 페이지에서만 로드맵을 확인할 수 있으며, 새로고침하거나 나가면 다시 결제가 필요합니다.</p>
                                        {/* <MarkdownResult markdownText={agentFeedback} /> */}
                                        <p className="agent-message">{agentFeedback.message}</p>
                                        <div className="cont">
                                            <h4>개선 포인트</h4>
                                            <ol className="agent-ol">
                                                {gapList.map((item, idx) => <li key={idx}>{item.trim()}</li>)}
                                            </ol>
                                        </div>
                                        <div className="cont">
                                            {plan && (
                                                <>
                                                    <h4>학습 로드맵</h4>
                                                    <div className="roadmap-modern">
                                                        <div className="timeline-line" />
                                                            {plan.weeks.map((weekItem, idx) => (
                                                                <div key={idx} className="timeline-block">
                                                                    <div className="timeline-dot" />
                                                                    <div className="timeline-card">
                                                                        <div className="timeline-header">
                                                                            <span className="timeline-week">{weekItem.week}</span>
                                                                            <h3 className="timeline-focus">{weekItem.focus}</h3>
                                                                        </div>
                                                                        <ul className="timeline-tasks">
                                                                            {weekItem.tasks.map((task, i) => (
                                                                            <li key={i} className="timeline-task">{task}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    {agentFeedback?.selfIntroFeedback && (
                                        <div className="cont">
                                            <h4>자기소개서 피드백</h4>
                                            <div className="feedback-list">
                                                {agentFeedback.selfIntroFeedback.split(/\n{2,}/).map((block, idx) => {
                                                    const lines = block.split("\n").filter(Boolean);
                                                    const [original, reason, suggestion] = lines;
                                                    return (
                                                        <div key={idx} className="feedback-block">
                                                            <h6>💡 피드백{idx+1}</h6>
                                                            <p className="original">{original?.replace(/^(\d+)\.\s?원문:\s?/, "")}</p>
                                                            <p className="suggestion">→ {suggestion?.replace(/^[-\s]*개선 제안:\s*/, "")}</p>
                                                            <p className="reason">⚠ {reason?.replace(/^[-\s]*감점 사유:\s*/, "")}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        )
        // gpt
        // <main className="l-view">
        //     <section className="section section-report">
        //         <div className="inner">
        //             <h2 className="sub-tit">{userInfo?.name}님의 Ai매칭 결과</h2>
        //             <h3 className="tit-line">Ai MATCHING REPORT</h3>
        //             <div className="round-box">
        //                 {role === "HR" ? (
        //                     <p>
        //                         채용공고와 지원자가 얼마나 일치하는지{" "}
        //                         <strong>
        //                         Ai 매칭률과
        //                         <br />
        //                         함께 추천사유
        //                         </strong>
        //                         를 속시원히 알려드립니다.
        //                     </p>
        //                     ) : (
        //                     <p>
        //                         나와 공고가 얼마나 일치하는지{" "}
        //                         <strong>
        //                         Ai 매칭률과
        //                         <br />
        //                         함께 추천사유
        //                         </strong>
        //                         를 속시원히 알려드립니다.
        //                     </p>
        //                 )}
        //             </div>
        //             <small>
        //                     *등록하신 이력서를 분석한 결과로, 실제 결과와 다를 수 있습니다.
        //             </small>
        //             <div className="cont">
        //                 <h4>총평</h4>
        //                 <DonutChart matchResult={matchResult} />
        //                 <p className="comment">
        //                     <span>종합의견&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        //                     <strong>{comment}</strong>
        //                 </p>
        //                 <p className="total-summary">{matchResult.gpt_answer}</p>
        //             </div>

        //             <div className="cont">
        //                     <h4>기본평가</h4>
        //                     <div className="box">
        //                     {summaryItems.map((item, index) => {
        //                             const [key, value] = item.split(":");
        //                             if (!key || !value) return null;

        //                             if (key.trim() === "종합 의견") {
        //                             if (!comment) setComment(value.trim());
        //                             return null;
        //                             }


        //                     return (
        //                         <div key={index}>
        //                             <p className="key">{key.trim()}</p>
        //                             <p className="value">{value.trim()}</p>
        //                         </div>
        //                     );
        //                 })}
        //                 </div>
        //             </div>
        //         </div>
        //         { role === "HR" ? "":
        //         (<div className="bg">
        //             <div className="inner">
        //                 {loading ? (
        //                     <div className="loading-spinner">
        //                             <LoadingSpinner/>
        //                             <p className="loading-spinner__text">
        //                                     결과를 분석중입니다.<br />잠시만 기다려주세요...
        //                             </p>
        //                     </div>
        //                 ) : !agentFeedback ? (
        //                     // 버튼 + 안내
        //                     <>
        //                             <button
        //                                 type="button"
        //                                 className="btn-advisor"
        //                                 onClick={handleAnalyzeWithAgent}
        //                                 disabled={loading || agentFeedback}
        //                             >
        //                                 <div>
        //                                     <strong>Fit Advisor - AI 맞춤 로드맵 받기</strong>
        //                                     <span>
        //                                         첫 2회 무료 제공 중! ✨ 회당 <RiCopperCoinLine /> 500
        //                                     </span>
        //                                 </div>
        //                                 <MdKeyboardArrowRight className="icon-arrow" />
        //                             </button>
        //                             <small>
        //                                 *Fit Advisor는 AI가 매칭 결과를 분석해, 앞으로의 성장 방향을
        //                                 제안해주는 프리미엄 기능입니다.
        //                             </small>
        //                     </>
        //                 ) : (
        //                     // 분석 결과
        //                     <div style={{ marginTop: "2rem" }}>
        //                             <h3 className="tit-line">Fit Advisor의 분석 결과</h3>
        //                             <MarkdownResult markdownText={agentFeedback}/>
        //                     </div>
        //                 )}
        //             </div>
        //         </div>)
        //         }
        //     </section>
        // </main>
    );
}

export default CommonContent;