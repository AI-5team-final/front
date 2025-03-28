import React, { useState } from 'react';

const ListHR = () => {
    // 지원자 더미 데이터 22명 생성
    const applicantData = Array.from({ length: 22 }, (_, i) => {
        const id = i + 1;
        const names = ["김지훈", "박서준", "이수민", "정하늘", "최민석", "윤예린", "장동건", "한소희", "조인성", "서지혜"];
        const positions = ["프론트엔드 개발자", "백엔드 개발자", "AI 엔지니어", "디자이너", "PM", "데이터 분석가"];
        return {
            id,
            name: names[i % names.length],
            position: positions[i % positions.length],
            description: `${names[i % names.length]}님은 ${positions[i % positions.length]} 포지션에 지원했습니다.`,
            date: `2025-03-${String(28 - i).padStart(2, '0')}`,
            matchRate: Math.floor(Math.random() * 21) + 80  // 80~100%
        };
    });

    const topFour = applicantData.slice(0, 4);
    const PAGE_SIZE = 6;
    const [page, setPage] = useState(0);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const pagedApplicants = applicantData.slice(4 + page * PAGE_SIZE, 4 + (page + 1) * PAGE_SIZE);
    const maxPage = Math.floor((applicantData.length - 4) / PAGE_SIZE);

    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setPage((prev) => Math.min(prev + 1, maxPage));
    };

    return (
        <div className="list-hr">
            <h2>추천 지원자</h2>
            <div className="top-cards" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
                {topFour.map((user) => (
                    <div 
                        key={user.id} 
                        onClick={() => setSelectedApplicant(user)}
                        style={{
                            flex: '1 1 200px',
                            border: '1px solid #ccc',
                            borderRadius: '12px',
                            padding: '20px',
                            backgroundColor: '#f9f9f9',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <h3>{user.name}</h3>
                        <p>{user.position}</p>
                        <p>{user.description}</p>
                        <p>지원일: {user.date}</p>
                        <p>AI 매칭률: {user.matchRate}%</p>
                    </div>
                ))}
            </div>

            <h2>전체 지원자</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {pagedApplicants.map((user) => (
                    <li key={user.id} style={{
                        borderBottom: '1px solid #ddd',
                        padding: '15px 0'
                    }}>
                        <strong>{user.name}</strong> - {user.position} - {user.date} - 매칭률: {user.matchRate}%
                        <button 
                            onClick={() => setSelectedApplicant(user)} 
                            style={{ 
                                marginLeft: '10px', 
                                padding: '5px 10px', 
                                border: '1px solid #ccc', 
                                borderRadius: '6px', 
                                cursor: 'pointer',
                                backgroundColor: '#013A72',
                                color: 'white',
                                border: 'none'
                            }}
                        >
                            더보기
                        </button>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: '40px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button
                    onClick={handlePrev}
                    disabled={page === 0}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: page === 0 ? '#ccc' : '#013A72',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: page === 0 ? 'default' : 'pointer'
                    }}
                >
                    ◀ 이전
                </button>

                <button
                    onClick={handleNext}
                    disabled={page === maxPage}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: page === maxPage ? '#ccc' : '#013A72',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: page === maxPage ? 'default' : 'pointer'
                    }}
                >
                    다음 ▶
                </button>
            </div>

            {/* 상세 정보 모달 */}
            {selectedApplicant && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setSelectedApplicant(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            padding: '30px',
                            borderRadius: '12px',
                            width: '400px',
                            maxWidth: '90%',
                            textAlign: 'left'
                        }}
                    >
                        <h3 style={{ color: '#013A72', fontSize: '1.5rem', marginBottom: '15px' }}>{selectedApplicant.name}</h3>
                        <p style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '10px' }}>{selectedApplicant.position}</p>
                        <p style={{ color: '#666', marginBottom: '15px' }}>{selectedApplicant.description}</p>
                        <p style={{ color: '#444' }}>지원일: {selectedApplicant.date}</p>
                        <p style={{ color: '#013A72', fontWeight: '600' }}>AI 매칭률: {selectedApplicant.matchRate}%</p>
                        <button
                            onClick={() => setSelectedApplicant(null)}
                            style={{
                                marginTop: '20px',
                                padding: '8px 16px',
                                border: 'none',
                                background: '#013A72',
                                color: 'white',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListHR;
