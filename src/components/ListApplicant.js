import React, { useState } from 'react';
import useToken from '../hooks/useToken';
import '../styles/fonts.css';

const styles = {
    container: {
        fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
        padding: '40px 20px'
    },
    title: {
        fontSize: '2.5rem',
        color: '#000000',
        marginBottom: '15px',
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#455A64',
        marginBottom: '40px'
    },
    topCardsContainer: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        marginBottom: '40px'
    },
    card: {
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
    },
    cardCompanyHeading: {
        margin: 0,
        fontWeight: 'bold',
        fontSize: '1.2rem' // (선택) 더 강조하고 싶을 때
    },
    cardMatchRate: {
        color: '#013A72',         // 글자색 (가독성 있는 색상으로)
        backgroundColor: '#ffffff', // 하얀 배경
        fontWeight: '600',
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' // 선택 사항
    },
    listItem: {
        borderBottom: '1px solid #ddd',
        padding: '15px 0'
    },
    button: {
        marginLeft: '10px',
        padding: '5px 10px',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: '#013A72',
        color: 'white',
        border: 'none'
    },
    paginationContainer: {
        marginTop: '40px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
    },
    paginationButton: (isDisabled) => ({
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: isDisabled ? '#ccc' : '#013A72',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: isDisabled ? 'default' : 'pointer'
    }),
    modalBackdrop: {
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
    },
    modalContent: {
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '400px',
        maxWidth: '90%',
        textAlign: 'left'
    },
    modalTitle: {
        color: '#013A72',
        fontSize: '1.5rem',
        marginBottom: '15px'
    },
    modalPosition: {
        fontSize: '1.2rem',
        fontWeight: '500',
        marginBottom: '10px'
    },
    modalDescription: {
        color: '#666',
        marginBottom: '15px'
    },
    modalDate: {
        color: '#444'
    },
    modalMatchRate: {
        color: '#013A72',
        fontWeight: '600'
    },
    modalButton: {
        marginTop: '20px',
        padding: '8px 16px',
        border: 'none',
        background: '#013A72',
        color: 'white',
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%'
    }
};

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

    const { name } = useToken();

    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setPage((prev) => Math.min(prev + 1, maxPage));
    };

    return (
        <main style={styles.container}>
            <h1 style={styles.title}>취업 성공 기원, Ai매치</h1>
            <p style={styles.subtitle}>{name}님의 이력서와 높은 확률로 매칭된 공고들입니다!</p>
        
            <div className="list-applicant">
                <div className="top-cards" style={styles.topCardsContainer}>
                    {topFour.map((job) => (
                        <div 
                            key={job.id} 
                            onClick={() => setSelectedJob(job)}
                            style={styles.card}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h3 style={styles.cardCompanyHeading}>{job.company}</h3>
                                <span style={styles.cardMatchRate}>AI매칭  {job.matchRate}점</span>
                            </div>
                            <p>{job.position}</p>
                            <p>{job.description}</p>
                            <p>공고일: {job.date}</p>
                        </div>
                    ))}
                </div>

                <ul
                    style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        borderTop: '1px solid #ddd',
                        borderBottom: '1px solid #ddd',
                    }}
                >
                {pagedJobs.map((job) => (
                    <li
                        key={job.id}
                        style={{
                        borderTop: '1px solid #ddd',
                        borderBottom: '1px solid #ddd',
                        padding: '15px 0',
                        marginBottom: '-1px' // 👈 겹침 방지
                        }}
                    >
                        <strong>{job.company}</strong> - {job.position} - {job.date} - 매칭률: {job.matchRate}%
                        <button
                        onClick={() => setSelectedJob(job)}
                        style={styles.button}
                        >
                        매칭 결과보기
                        </button>
                    </li>
                    ))}
                </ul>

                <div style={styles.paginationContainer}>
                    <button
                        onClick={handlePrev}
                        disabled={page === 0}
                        style={styles.paginationButton(page === 0)}
                    >
                        ◀ 이전
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={page === maxPage}
                        style={styles.paginationButton(page === maxPage)}
                    >
                        다음 ▶
                    </button>
                </div>

                {selectedJob && (
                    <div style={styles.modalBackdrop} onClick={() => setSelectedJob(null)}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={styles.modalContent}
                        >
                            <h3 style={styles.modalTitle}>{selectedJob.company}</h3>
                            <p style={styles.modalPosition}>{selectedJob.position}</p>
                            <p style={styles.modalDescription}>{selectedJob.description}</p>
                            <p style={styles.modalDate}>공고일: {selectedJob.date}</p>
                            <p style={styles.modalMatchRate}>AI 매칭률: {selectedJob.matchRate}%</p>
                            <button
                                onClick={() => setSelectedJob(null)}
                                style={styles.modalButton}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ListApplicant;
