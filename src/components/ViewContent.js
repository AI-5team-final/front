import { useState } from 'react';
import { useUser } from '../context/UserContext'; 
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ViewContent.css';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiCopperCoinLine } from 'react-icons/ri';
import DonutChart from './DonutChart';

const ViewContent = ({role, id}) => {

    const { userInfo, setUserInfo } = useUser();
    const [name, setName] = useState(userInfo? userInfo.name : '');
    const [comment, setComment] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    
    const { matchResult } = location.state || {};
    // const matchResult = {
    //     "title": "블록체인글로벌 백엔드",
    //     "summary": "핵심 강점: JAVA 및 Kotlin 경험, AWS 및 Docker 사용 경험 / 보완점: 금융 IT 경험 부족 / 종합 의견: 추천",
    //     "total_score": 85.0,
    //     "gpt_answer": "각 항목별 점수는 다음과 같습니다: 필수 자격요건 충족도 30점, 기술 스택 일치도 20점, 업무 경험 연관성 15점, 직무 적합성 10점, 기업 문화 및 가치관 적합성 10점으로 총 85점을 부여했습니다.",
    // }


    if (!matchResult) {
        navigate('/');
        return null;
    }

    const summaryItems = matchResult.summary.split('/').map(item => item.trim());
    summaryItems.sort((a, b) => {
        return a.startsWith("종합 의견") ? -1 : b.startsWith("종합 의견") ? 1 : 0;
    });


    return (
        <main className="l-view">
            <section className='section section-report'>
                <div className='inner'>
                    <h2 className='sub-tit'>{name}님의 Ai매칭 결과</h2>
                    <h3>Ai MATCHING REPORT</h3>
                    <div className="round-box">
                        {role === 'HR' ? (
                            <p>
                                채용공고와 지원자가 얼마나 일치하는지 <strong>Ai 매칭률과<br/>
                                함께 추천사유</strong>를 속시원히 알려드립니다.
                            </p>
                        ) : (
                            <p>
                                나와 공고가 얼마나 일치하는지 <strong>Ai 매칭률과<br/>
                                함께 추천사유</strong>를 속시원히 알려드립니다.
                            </p>
                        )}
                    </div>
                    <small>*등록하신 이력서를 분석한 결과로, 실제 결과와 다를 수 있습니다.</small>
                    <div className='cont'>
                        <h4>총평</h4>
                        <DonutChart matchResult={matchResult}/>
                        <p className='comment'><span>종합의견&nbsp;&nbsp;|&nbsp;&nbsp;</span><strong>{comment}</strong></p>
                        <p className='gpt-answer'>{matchResult.gpt_answer}</p>
                    </div>
                    
                    <div className='cont'>
                        <h4>기본평가</h4>
                        <div className="box">
                            {summaryItems.map((item, index) => {
                                const [key, value] = item.split(':');
                                if (!key || !value) return null;

                                if (key.trim() === "종합 의견") {
                                    // 종합 의견은 별도로 comment로 저장하고 렌더링 안 함
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
                    <div className='inner'>
                    <button type='button' className='btn-advisor'>
                        <div>
                            <strong>Fit Advisor - AI 맞춤 로드맵 받기</strong>
                            <span>지금은 첫 1회 무료 제공 중! ✨ 회당 <RiCopperCoinLine /> 500</span>
                        </div>
                        <MdKeyboardArrowRight className='icon-arrow' />
                    </button>
                    <small>*Fit Advisor는 AI가 매칭 결과를 분석해, 앞으로의 성장 방향을 제안해주는 프리미엄 기능입니다.</small>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ViewContent;