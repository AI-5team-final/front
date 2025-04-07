import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/fonts.css';
import '../styles/ListApplicant.scss';
import { useUser } from '../context/UserContext';

const getScoreClass = (score) => {
    if (score >= 90) return 'score-excellent';
    if (score >= 80) return 'score-good';
    if (score >= 70) return 'score-fair';
    return 'score-poor';
};

const getIcon = (title) => {
    switch (title) {
        case '핵심 강점':
            return '✅';
        case '보완점':
            return '⚠️';
        case '종합 의견':
            return '💡';
        default:
            return '•';
    }
};

const ListApplicant = () => {
    const { userInfo } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const [matchResults, setMatchResults] = useState([]);

    useEffect(() => {
        console.log('Location state:', location.state);
        if (location.state?.results) {
            setMatchResults(location.state.results);
        } else {
            // 매칭 결과가 없으면 홈으로 리다이렉트
            navigate('/');
        }
    }, [location.state, navigate]);

    const handleViewDetail = (result, index) => {
        navigate(`/view/${index}`, { 
            state: { 
                matchResult: result
            } 
        });
    };

    return (
        <div className="l-list-applicant">
            <main className="container">
                <h1 className="title">취업 성공 기원, Ai매치</h1>
                <p className="subtitle">{userInfo?.name}님의 이력서와 높은 확률로 매칭된 공고들입니다!</p>
                <p className="subtitle">카드를 클릭하면 세부 정보를 확인할 수 있습니다</p>

                <div className="list-applicant">
                    {matchResults && matchResults.length > 0 ? (
                        matchResults.map((result, index) => (
                            <div 
                                key={`${result.title}-${index}`}
                                className="card"
                                onClick={() => handleViewDetail(result, index)}
                            >
                                <div className="card-header">
                                    <h3 className="card-company-heading">{result.title}</h3>
                                </div>
                                <div className="card-score">
                                    <span className={`card-match-rate ${getScoreClass(result.total_score)}`}>
                                        AI매칭 {result.total_score}점
                                    </span>
                                </div>
                                <div className="card-summary">
                                    {result.summary?.split('/').map((section, idx) => {
                                        if (!section?.trim()) return null;
                                        
                                        const splitIndex = section.indexOf(':');
                                        if (splitIndex === -1) return null;
                                        
                                        const title = section.slice(0, splitIndex).trim();
                                        const content = section.slice(splitIndex + 1).trim();
                                        
                                        // 종합 의견은 한 줄로 표시
                                        if (title === '종합 의견') {
                                            return (
                                                <div key={idx} className="summary-section">
                                                    <strong className="summary-title">
                                                        <span className="title-icon">{getIcon(title)}</span>
                                                        {title}
                                                    </strong>
                                                    <span className="summary-content">{content}</span>
                                                </div>
                                            );
                                        }

                                        // 나머지는 상세 내용을 줄바꿈하여 표시
                                        return (
                                            <div key={idx} className="summary-section">
                                                <strong className="summary-title">
                                                    <span className="title-icon">{getIcon(title)}</span>
                                                    {title}
                                                </strong>
                                                <div className="summary-content">
                                                    {content.split('/').filter(Boolean).map((line, lineIdx) => (
                                                        <p key={lineIdx} className="content-line">
                                                            {line.trim()}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">매칭된 공고가 없습니다.</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ListApplicant;
