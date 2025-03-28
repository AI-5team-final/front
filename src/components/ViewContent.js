const ViewContent = ({role, id}) => {
    if (role === 'HR') {
        return (
            <div>
                <h2>인사담당자용 상세 페이지</h2>
                <p>게시물 ID: {id}</p>
                <p>최종 리포트</p>
            </div>
        );
    }
    
    return (
        <main className="l-view">
            <div className="inner">
                <h2>취준생용 상세 페이지</h2>
                <p>게시물 ID: {id}</p>
                <p>최종 리포트</p>
            </div>
        </main>
    );

}

export default ViewContent;