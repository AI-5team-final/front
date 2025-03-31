import React from 'react';
import '../styles/fonts.css'; // Pretendard 폰트 적용

const resumes = [
  { id: 1, name: '이력서_홍길동.pdf', date: '2025-03-28' },
  { id: 2, name: '이력서_홍길동.pdf', date: '2025-03-25' },
  { id: 3, name: '이력서_홍길동.pdf', date: '2025-03-25' },
  { id: 4, name: '이력서_홍길동.pdf', date: '2025-03-28' },
  { id: 5, name: '이력서_홍길동.pdf', date: '2025-03-28' },
];

const styles = {
    container: {
        fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
        padding: '40px 20px',
        backgroundColor: '#ffffff',
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    titleContainer: {
        textAlign: 'left',       // 👈 중앙 정렬에서 왼쪽 정렬로 변경
        marginBottom: '40px',
        width: '80%',            // 등록 카드와 리스트와 정렬 맞추기 위해 너비 설정
        maxWidth: '900px'
    },
    title: {
        fontSize: '2.5rem',
        color: '#000000',
        marginBottom: '15px',
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#455A64'
    },
    registerCard: {
        display: 'flex',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '40px',
        width: '80%',
        maxWidth: '900px'
    },
    registerImage: {
        width: '50%',
        height: '200px',
        backgroundColor: '#ccc',
        borderRadius: '8px',
        marginRight: '20px'
    },
    registerText: {
        width: '50%'
    },
    resumeList: {
        borderTop: '1px solid #ddd',
        borderBottom: '1px solid #ddd',
        padding: '15px 0',
        width: '80%',
        maxWidth: '900px'
    },
    resumeItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #ddd'
    },
    deleteButton: {
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '5px 10px',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        transition: 'background-color 0.2s',
    },
    deleteButtonHover: {
        backgroundColor: '#f0f0f0'
    }
};

const PanelResume = () => {
    return (
        <div style={styles.container}>
            {/* 제목 */}
            <div style={styles.titleContainer}>
                <h1 style={styles.title}>이력서 관리</h1>
                <p style={styles.subtitle}>나의 이력서를 한눈에 관리하고, 더 나은 기회를 준비하세요.</p>
            </div>

            {/* 등록 카드 */}
            <div style={styles.registerCard}>
                <div style={styles.registerImage} />
                <div style={styles.registerText}>
                    <h2 className="text-xl font-semibold mb-2">이력서 등록하기</h2>
                    <p className="text-gray-600 mb-1">PDF 형식의 이력서를 등록할 수 있습니다.</p>
                    <p className="text-gray-400 text-sm">원하지 않는 이력서는 언제든 삭제할 수 있어요.</p>
                    <p className="text-gray-400 text-xs mt-1">*이미지는 인식되지 않을 수 있습니다.</p>
                </div>
            </div>

            {/* 리스트 */}
            <div style={styles.resumeList}>
                {resumes.map((resume) => (
                    <div key={resume.id} style={styles.resumeItem}>
                        <div className="flex items-center gap-4">
                            <div className="text-2xl text-gray-400">📄</div>
                            <div>
                                <p className="font-medium">{resume.name}</p>
                                <p className="text-sm text-gray-500">등록일: {resume.date}</p>
                            </div>
                        </div>
                        <button 
                            style={styles.deleteButton}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.deleteButtonHover.backgroundColor}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                            삭제하기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PanelResume;