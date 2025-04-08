import React, { useState } from 'react';
import '../styles/ListHR.scss';

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
            <div className="top-cards">
                {topFour.map((user) => (
                    <div 
                        key={user.id} 
                        onClick={() => setSelectedApplicant(user)}
                        className="card"
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
            <ul className="list-container">
                {pagedApplicants.map((user) => (
                    <li key={user.id} className="list-item">
                        <div>
                            <strong>{user.name}</strong> - {user.position} - {user.date} - 매칭률: {user.matchRate}%
                        </div>
                        <button 
                            onClick={() => setSelectedApplicant(user)} 
                            className="button"
                        >
                            더보기
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

            {/* 상세 정보 모달 */}
            {selectedApplicant && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedApplicant(null)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>{selectedApplicant.name}</h3>
                        <p>{selectedApplicant.position}</p>
                        <p>{selectedApplicant.description}</p>
                        <p>지원일: {selectedApplicant.date}</p>
                        <p className="highlight">AI 매칭률: {selectedApplicant.matchRate}%</p>
                        <button
                            onClick={() => setSelectedApplicant(null)}
                            className="close-button"
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
