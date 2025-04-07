import { useState } from 'react';
import { useUser } from '../context/UserContext'; 
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styles/ViewContent.scss';

const ViewContent = ({role, id}) => {

    const { userInfo, setUserInfo } = useUser();
    const [name, setName] = useState(userInfo? userInfo.name : '');

    const location = useLocation();
    const navigate = useNavigate();
    const { matchResult, uploadedPdf } = location.state || {};

    if (!matchResult) {
        navigate('/');
        return null;
    }

    return (
        <main className="l-view">
            <div className="inner">

            <button 
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← 목록으로 돌아가기
            </button>

            <h1 className="title">매칭 상세 결과 #{id}</h1>
            
            <div className="match-info">
                <div className="pdf-info">
                    <h3>매칭된 이력서 정보</h3>
                    <p>파일명: {uploadedPdf?.fileName}</p>
                    <p>업로드 시간: {uploadedPdf ? new Date(uploadedPdf.uploadedAt).toLocaleString() : '-'}</p>
                </div>

                <div className="company-info">
                    <h2>{matchResult.title}</h2>
                    <div className="match-score">
                        <span className="score-label">AI 매칭 점수</span>
                        <span className="score-value">{matchResult.total_score}점</span>
                    </div>
                </div>

                <div className="match-detail">
                    <div className="summary-section">
                        <h3>매칭 결과 요약</h3>
                        <p>{matchResult.summary}</p>
                    </div>

                    <div className="analysis-section">
                        <h3>상세 분석</h3>
                        <div className="gpt-analysis">
                            {matchResult.gpt_answer.split('/').map((item, index) => {
                                const trimmedItem = item.trim();
                                if (!trimmedItem) return null;
                                
                                // 점수 항목 강조 표시
                                if (trimmedItem.includes('점')) {
                                    const [category, score] = trimmedItem.split(':');
                                    return (
                                        <div key={index} className="score-item">
                                            <span className="category">{category}:</span>
                                            <span className="score">{score}</span>
                                        </div>
                                    );
                                }
                                
                                return <p key={index}>{trimmedItem}</p>;
                            })}
                        </div>
                    </div>
                </div>
            </div>


                {/* ✅ 공통 영역 */}
                <h2 className='sub-tit'>{name}님의 Ai매칭 결과</h2>
                <h3>Ai MATCHING REPORT</h3>
                <div className="round-box">
                    {role === 'HR' ? (
                        <p>
                            채용공고와 지원자가 얼마나 일치하는지 <strong>Ai 매칭률과
                            함께 추천사유</strong>를 속시원히 알려드립니다.
                        </p>
                    ) : (
                        <p>
                            나와 공고가 얼마나 일치하는지 <strong>Ai 매칭률과
                            함께 추천사유</strong>를 속시원히 알려드립니다.
                        </p>
                    )}
                </div>
                <small>*등록하신 이력서를 분석한 결과로, 실제 결과와 다를 수 있습니다.</small>
                <h4>총평</h4>


                {/* <p>{score}</p>
                <p>요약: {summary}</p> */}
                <p>게시물 ID: {id}</p>
            </div>
        </main>
    );
};

export default ViewContent;