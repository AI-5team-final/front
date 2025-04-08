import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/ListApplicant.scss';


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
            
                <div className="list-applicant">
                    {matchResults && matchResults.length > 0 ? (
                        matchResults.map((result, index) => (
                            <div 
                                key={`${result.title}-${index}`}
                                onClick={() => handleViewDetail(result, index)}
                                className="card"
                            >
                                <div className="card-header">
                                    <h3 className="card-company-heading">{result.title}</h3>
                                    <span className="card-match-rate">AI매칭 {result.total_score}점</span>
                                </div>
                                <p className="card-summary">{result.summary}</p>
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
