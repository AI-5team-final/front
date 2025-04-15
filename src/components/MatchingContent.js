import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useMatch } from "../context/MatchContext";
import { MdKeyboardArrowRight } from "react-icons/md";
import { RiCopperCoinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import fetchClient from "../utils/fetchClient";
import DonutChart from "./DonutChart";
import LoadingSpinner from "./LoadingSpinner";
import MarkdownResult from "./MarkdownResult";
import "../styles/ViewContent.scss";


const MatchingContent = ({ role }) => {
	const { userInfo } = useUser();
	const { matchResults } = useMatch();
	const [name] = useState(userInfo?.name || "");
	const [comment, setComment] = useState("");
	const [agentFeedback, setAgentFeedback] = useState("");
	const [loading, setLoading] = useState(false);
	const { updateCredit } = useUser();

	const navigate = useNavigate();
	const matchResult = matchResults? matchResults[0] : [];

	const summaryItems = matchResult?.summary.split("/").map((item) => item.trim()).sort((a, b) =>
		a.startsWith("종합 의견") ? -1 : b.startsWith("종합 의견") ? 1 : 0
	);
	

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);


	if(!matchResult){
		console.warn("매칭 결과가 없습니다.")
		return <Navigate to="/"/>;
	}
	
	const handleAnalyzeWithAgent = async () => {

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
			// const feedback = "## Task by Gap Analyzer\n1. 필수 자격요건 충족도 향상: 관련 자격증 취득 필요  \n2. 기술 스택 일치도 개선: 최신 기술 및 도구에 대한 교육 및 경험 필요  \n3. 업무 경험 연관성 강화: 관련 분야에서의 경력 추가 필요  \n4. 직무 적합성 증대: 해당 직무에 대한 심화 학습 및 프로젝트 경험 필요  \n5. 기업 문화 및 가치관 적합성 향상: 기업의 가치관에 대한 이해 및 관련 경험 필요\n\n## Task by Learning Coach\n### 2~4주 학습 계획 및 추천 리소스\n\n#### 1주차: 필수 자격요건 충족도 향상\n- **목표**: 관련 자격증 취득을 위한 기초 지식 습득\n- **추천 리소스**:\n  - **온라인 강의**: Coursera, Udemy에서 제공하는 자격증 관련 기초 강의 수강\n  - **도서**: \"자격증 취득을 위한 기초 가이드\" (해당 분야의 자격증 관련 서적)\n- **학습 활동**: 매일 1시간씩 강의 수강 및 주요 개념 정리\n\n#### 2주차: 기술 스택 일치도 개선\n- **목표**: 최신 기술 및 도구에 대한 이해 증진\n- **추천 리소스**:\n  - **온라인 강의**: Pluralsight, edX에서 제공하는 최신 기술 관련 강의\n  - **실습**: GitHub에서 오픈소스 프로젝트 참여\n- **학습 활동**: 매일 1시간씩 강의 수강 후 1시간 실습 진행\n\n#### 3주차: 업무 경험 연관성 강화\n- **목표**: 관련 분야에서의 경력 추가를 위한 경험 쌓기\n- **추천 리소스**:\n  - **인턴십/프로젝트**: 관련 분야의 인턴십 또는 자원봉사 기회 탐색\n  - **네트워킹**: LinkedIn을 통해 관련 분야 전문가와의 연결 및 멘토링 요청\n- **학습 활동**: 주 2회 관련 분야의 네트워킹 행사 참석 및 인턴십 지원\n\n#### 4주차: 직무 적합성 증대 및 기업 문화 이해\n- **목표**: 해당 직무에 대한 심화 학습 및 기업 문화 이해\n- **추천 리소스**:\n  - **온라인 강의**: LinkedIn Learning에서 제공하는 직무 관련 심화 강의\n  - **기업 문화 관련 서적**: \"기업 문화의 힘\" (기업 문화에 대한 이해를 돕는 서적)\n- **학습 활동**: 매일 1시간씩 심화 강의 수강 후 30분 독서 및 기업 문화 분석\n\n### 최종 목표\n4주 후, 자격증 취득을 위한 기초 지식과 최신 기술에 대한 이해를 바탕으로 관련 분야에서의 경험을 쌓고, 직무 적합성을 높이며 기업 문화에 대한 이해를 통해 취업 준비를 완료하는 것입니다.\n;"

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
						<h3 className="tit-line">Ai MATCHING REPORT</h3>
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
						{loading ? (
							<div className="loading-spinner">
									<LoadingSpinner/>
									<p className="loading-spinner__text">
											결과를 분석중입니다.<br />잠시만 기다려주세요...
									</p>
							</div>
						) : !agentFeedback ? (
							// 버튼 + 안내
							<>
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
							</>
						) : (
							// 분석 결과
							<div style={{ marginTop: "2rem" }}>
									<h3 className="tit-line">Fit Advisor의 분석 결과</h3>
									<MarkdownResult markdownText={agentFeedback}/>
							</div>
						)}
					</div>
				</div>
			</section>
		</main>
	);

	
};

export default MatchingContent;
