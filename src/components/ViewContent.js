import { useState } from 'react';
import { useUser } from '../context/UserContext'; 

const ViewContent = ({ role, id, score, summary }) => {
    const { userInfo, setUserInfo } = useUser();
    const [name, setName] = useState(userInfo? userInfo.name : '');

    return (
        <main className="l-view">
            <div className="inner">
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


                <p>{score}</p>
                <p>요약: {summary}</p>
                <p>게시물 ID: {id}</p>

                {/* ✅ 역할별 내용 분기 */}
                {role === 'HR' ? (
                    <section>
                        <h3>인사담당자용 상세 내용</h3>
                        <p>최종 리포트</p>
                        {/* 추가적으로 HR 전용 데이터 렌더링 가능 */}
                    </section>
                ) : (
                    <section>
                        <h3>취준생용 상세 내용</h3>
                        <p>최종 리포트</p>
                        {/* 지원자 전용 기능 표시 가능 */}
                    </section>
                )}
            </div>
        </main>
    );
};

export default ViewContent;