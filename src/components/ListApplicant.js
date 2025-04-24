import { useNavigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import useAuth from '../hooks/useAuth';

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

const ListApplicant = ({ matchResults: propsResults, userInfo: propsUserInfo, isMock = false }) => {
    const authUser = useAuth()?.userInfo;
    const contextResults = useMatch()?.matchResults;
    const navigate = useNavigate();

    const userInfo = isMock ? propsUserInfo : authUser;
    const matchResults = isMock ? propsResults : contextResults;

    const handleViewDetail = (index) => {
        if (!isMock) {
            navigate(`/view/${index}`);
        } else {
            alert('튜토리얼에서는 상세 페이지 이동이 비활성화되어 있습니다.');
        }
    };

    return (
        // gpt
        // <div className="l-list-applicant l-list-common">
        //     <div className='inner'>
        //         <h1 className="sub-tit">취업 성공 기원, Ai매치</h1>
        //         <p className="subtitle">{userInfo?.name}님의 이력서와 높은 확률로 매칭된 공고들입니다!</p>
        //         <p className="subtitle-note">카드를 클릭하면 세부 정보를 확인할 수 있습니다</p>

        //         <div className="list-applicant">
        //             {matchResults && matchResults.length > 0 ? (
        //                 matchResults.map((result, index) => (
        //                     <div
        //                         key={`${result.title}-${index}`}
        //                         className="card"
        //                         onClick={() => handleViewDetail(index)}
        //                     >
        //                         <div className="card-header">
        //                             <h3 className="card-company-heading">{result.title}</h3>
        //                         </div>
        //                         <div className="card-score">
        //                             <span className={`card-match-rate ${getScoreClass(result.total_score)}`}>
        //                                 AI매칭 {result.total_score}점
        //                             </span>
        //                         </div>
        //                         <div className="card-summary">
        //                             {result.summary?.split('/').map((section, idx) => {
        //                                 if (!section?.trim()) return null;

        //                                 const splitIndex = section.indexOf(':');
        //                                 if (splitIndex === -1) return null;

        //                                 const title = section.slice(0, splitIndex).trim();
        //                                 const content = section.slice(splitIndex + 1).trim();

        //                                 // 종합 의견은 한 줄로 표시
        //                                 if (title === '종합 의견') {
        //                                     return (
        //                                         <div key={idx} className="summary-section">
        //                                             <strong className="summary-title">
        //                                                 <span className="title-icon">{getIcon(title)}</span>
        //                                                 {title}
        //                                             </strong>
        //                                             <span className="summary-content">{content}</span>
        //                                         </div>
        //                                     );
        //                                 }

        //                                 // 나머지는 상세 내용을 줄바꿈하여 표시
        //                                 return (
        //                                     <div key={idx} className="summary-section">
        //                                         <strong className="summary-title">
        //                                             <span className="title-icon">{getIcon(title)}</span>
        //                                             {title}
        //                                         </strong>
        //                                         <div className="summary-content">
        //                                             {content.split('/').filter(Boolean).map((line, lineIdx) => (
        //                                                 <p key={lineIdx} className="content-line">
        //                                                     {line.trim()}
        //                                                 </p>
        //                                             ))}
        //                                         </div>
        //                                     </div>
        //                                 );
        //                             })}
        //                         </div>
        //                     </div>
        //                 ))
        //             ) : (
        //                 <div className="no-results">매칭된 공고가 없습니다.</div>
        //             )}
        //         </div>
        //     </div>
        // </div>
        <div className="l-list-applicant l-list-common">
            <div className='inner'>
                <h1 className="sub-tit">취업 성공 기원, Ai매치</h1>
                <p className="subtitle">{userInfo?.name}님의 이력서와 높은 확률로 매칭된 공고들입니다!</p>
                <p className="subtitle-note">카드를 클릭하면 세부 정보를 확인할 수 있습니다</p>

                <div className="list-applicant">
                    {matchResults && matchResults.length > 0 ? (
                        matchResults.map((result, index) => (
                            <div
                                key={`${result.title}-${index}`}
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
                                <div className='card-date'>
                                    {result.endDay ? <p>~ {result.endDay}</p> : <p>상시채용</p>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">매칭된 공고가 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListApplicant;
