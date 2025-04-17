
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import useAuth from '../hooks/useAuth';


const ListHR = () => {
    const { userInfo } = useAuth();
    const { matchResults } = useMatch();
    const navigate = useNavigate();
    

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

    const handleViewDetail = (index) => {
        navigate(`/view/${index}`);
    };
    

    return (
        <div className="l-list-hr l-list-common">
            <div className='inner'>
                <h1 className="sub-tit">핵심인재 확보, Ai매치</h1>
                <p className="subtitle">{userInfo?.name}에 높은 확률로 매칭된 지원자입니다!</p>
                <p className="subtitle-note">카드를 클릭하면 세부 정보를 확인할 수 있습니다</p>
                
                <div className="list-applicant">
                    {matchResults && matchResults.length > 0 ? (
                        matchResults.map((result, index) => (
                            <div 
                                key={`${result.name}-${index}`}
                                className="card"
                                onClick={() => handleViewDetail(index)}
                            >
                                <div className="card-header">
                                    <h3 className="card-company-heading">{result.name}</h3>
                                </div>
                                <div className="card-score">
                                    <span className={`card-match-rate ${getScoreClass(result.total_score)}`}>
                                        AI매칭 {result.total_score}점
                                    </span>
                                </div>
                                <div className="card-summary">
                                    <p>{result.opinion1}</p>
                                </div>
                                <button type="button" className="card-button">매칭결과 보기</button>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">매칭된 이력서가 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListHR;
