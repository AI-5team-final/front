import React, { useState } from 'react';
import useToken from '../hooks/useToken';
import { useNavigate } from 'react-router-dom';
import '../styles/fonts.css';
import '../styles/ListApplicant.scss';

// 더미 데이터 상수
const COMPANIES = ["네이버", "카카오", "배달의민족", "토스", "쿠팡", "라인", "우아한형제들", "당근마켓", "야놀자", "리디북스"];
const POSITIONS = ["프론트엔드 개발자", "백엔드 개발자", "AI 엔지니어", "모바일 앱 개발자", "데이터 분석가", "DevOps 엔지니어", "iOS 개발자"];
const DESCRIPTIONS = [
    "React를 활용한 웹 서비스 개발",
    "Spring Boot 기반 API 서버 개발",
    "배달 추천 시스템 모델링",
    "Flutter 기반 하이브리드 앱 개발",
    "사용자 행동 분석 및 리포팅",
    "CI/CD 환경 구축 및 운영",
    "전자책 리더 앱 개발"
];

const ListApplicant = () => {
    const PAGE_SIZE = 6;
    const [page, setPage] = useState(0);
    const { name } = useToken();
    const navigate = useNavigate();

    // 더미 공고 22개 생성
    const jobData = Array.from({ length: 22 }, (_, i) => ({
        id: i + 1,
        company: COMPANIES[i % COMPANIES.length],
        position: POSITIONS[i % POSITIONS.length],
        description: DESCRIPTIONS[i % DESCRIPTIONS.length],
        date: `2025-03-${String(28 - i).padStart(2, '0')}`,
        matchRate: Math.floor(Math.random() * 21) + 80
    }));

    const topFour = jobData.slice(0, 4);
    const pagedJobs = jobData.slice(4 + page * PAGE_SIZE, 4 + (page + 1) * PAGE_SIZE);
    const maxPage = Math.floor((jobData.length - 4) / PAGE_SIZE);

    const handleViewDetail = (jobId) => {
        navigate(`/view/${jobId}`);
    };

    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setPage((prev) => Math.min(prev + 1, maxPage));
    };

    return (
        <main className="container">
            <h1 className="title">취업 성공 기원, Ai매치</h1>
            <p className="subtitle">{name}님의 이력서와 높은 확률로 매칭된 공고들입니다!</p>
        
            <div className="list-applicant">
                <div className="top-cards">
                    {topFour.map((job) => (
                        <div 
                            key={job.id} 
                            onClick={() => handleViewDetail(job.id)}
                            className="card"
                        >
                            <div className="card-header">
                                <h3 className="card-company-heading">{job.company}</h3>
                                <span className="card-match-rate">AI매칭 {job.matchRate}점</span>
                            </div>
                            <p>{job.position}</p>
                            <p>{job.description}</p>
                            <p>공고일: {job.date}</p>
                        </div>
                    ))}
                </div>

                <ul className="list-container">
                    {pagedJobs.map((job) => (
                        <li key={job.id} className="list-item">
                            <strong>{job.company}</strong> - {job.position} - {job.date} - 매칭률: {job.matchRate}%
                            <button 
                                onClick={() => handleViewDetail(job.id)}
                                className="button"
                            >
                                매칭 결과보기
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="pagination-container">
                    <button
                        onClick={handlePrev}
                        disabled={page === 0}
                        className="pagination-button"
                    >
                        ◀ 이전
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={page === maxPage}
                        className="pagination-button"
                    >
                        다음 ▶
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ListApplicant;
