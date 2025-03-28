import React, { useState } from 'react';

const ListApplicant = () => {
    // 더미 공고 22개 생성
    const jobData = Array.from({ length: 22 }, (_, i) => {
        const id = i + 1;
        const companies = ["네이버", "카카오", "배달의민족", "토스", "쿠팡", "라인", "우아한형제들", "당근마켓", "야놀자", "리디북스"];
        const positions = ["프론트엔드 개발자", "백엔드 개발자", "AI 엔지니어", "모바일 앱 개발자", "데이터 분석가", "DevOps 엔지니어", "iOS 개발자"];
        const descriptions = [
            "React를 활용한 웹 서비스 개발",
            "Spring Boot 기반 API 서버 개발",
            "배달 추천 시스템 모델링",
            "Flutter 기반 하이브리드 앱 개발",
            "사용자 행동 분석 및 리포팅",
            "CI/CD 환경 구축 및 운영",
            "전자책 리더 앱 개발"
        ];

        return {
            id,
            company: companies[i % companies.length],
            position: positions[i % positions.length],
            description: descriptions[i % descriptions.length],
            date: `2025-03-${String(28 - i).padStart(2, '0')}`,
            matchRate: Math.floor(Math.random() * 21) + 80  // 80~100%
        };
    });

    const topFour = jobData.slice(0, 4);
    const PAGE_SIZE = 6;
    const [page, setPage] = useState(0);

    const pagedJobs = jobData.slice(4 + page * PAGE_SIZE, 4 + (page + 1) * PAGE_SIZE);
    const maxPage = Math.floor((jobData.length - 4) / PAGE_SIZE);

    const [selectedJob, setSelectedJob] = useState(null);

    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setPage((prev) => Math.min(prev + 1, maxPage));
    };

    return (
        <div className="list-applicant">
            <h2>취업 성공 기원, Ai매치</h2>
            <p>홍길동님과 높은 확률로 매칭된 공고입니다!</p>
            <div className="top-cards" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
                {topFour.map((job) => (
                    <div 
                        key={job.id} 
                        onClick={() => setSelectedJob(job)}
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
                        <h3>{job.company}</h3>
                        <p>{job.position}</p>
                        <p>{job.description}</p>
                        <p>공고일: {job.date}</p>
                        <p>AI 매칭률: {job.matchRate}%</p>
                    </div>
                ))}
            </div>

            <h2>전체 채용 공고</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {pagedJobs.map((job) => (
                    <li key={job.id} style={{
                        borderBottom: '1px solid #ddd',
                        padding: '15px 0'
                    }}>
                        <strong>{job.company}</strong> - {job.position} - {job.date} - 매칭률: {job.matchRate}%
                        <button 
                            onClick={() => setSelectedJob(job)} 
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
            {selectedJob && (
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
                    onClick={() => setSelectedJob(null)}
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
                        <h3 style={{ color: '#013A72', fontSize: '1.5rem', marginBottom: '15px' }}>{selectedJob.company}</h3>
                        <p style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '10px' }}>{selectedJob.position}</p>
                        <p style={{ color: '#666', marginBottom: '15px' }}>{selectedJob.description}</p>
                        <p style={{ color: '#444' }}>공고일: {selectedJob.date}</p>
                        <p style={{ color: '#013A72', fontWeight: '600' }}>AI 매칭률: {selectedJob.matchRate}%</p>
                        <button
                            onClick={() => setSelectedJob(null)}
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

export default ListApplicant;
