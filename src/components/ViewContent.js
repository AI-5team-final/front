import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/ViewContent.scss';

const ViewContent = () => {
    const { userInfo } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();  // URL에서 id 파라미터 가져오기
    const { matchResult, uploadedPdf } = location.state || {};

    if (!matchResult) {
        navigate('/');
        return null;
    }

    return (
        <main className="view-container">
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
        </main>
    );
};

export default ViewContent;