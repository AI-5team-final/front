const ViewContent = ({ role, id, title, score, summary }) => {
    return (
        <main className="l-view">
            <div className="inner">
                {/* ✅ 공통 영역 */}
                <h2>{title}</h2>
                <p>매칭 점수: {score}</p>
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