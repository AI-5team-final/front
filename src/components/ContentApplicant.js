import { useRef, useState } from 'react';
import { FaPlusCircle, FaCloudDownloadAlt } from 'react-icons/fa';
import { TbHeartHandshake } from 'react-icons/tb';
import { GrDocumentPdf } from 'react-icons/gr';
import { RiRobot2Line } from "react-icons/ri";
import '../styles/fonts.css';

const mockResumes = [
    { id: 1, name: '이력서_홍길동.pdf', date: '2025-03-28' },
    { id: 2, name: '이력서_마케팅팀.pdf', date: '2025-02-14' },
    { id: 3, name: '디자이너_지원서.pdf', date: '2025-01-03' },
    { id: 4, name: '경력직_기획서.pdf', date: '2024-12-20' },
    { id: 5, name: '졸업작품_포트폴리오.pdf', date: '2024-11-11' },
  ];

const styles = {
    container: {
        padding: '60px 0',
        minHeight: '100vh',
        fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
    },
    inner: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    },
    hero: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0px',
        gap: '40px',
        backgroundColor: '#A8D7FF',
        padding: '40px',
    },
    heroContent: {
        flex: '1',
    },
    heroTitle: {
        fontSize: '2.5rem',
        color: '#013A72',
        marginTop: '125px',
        lineHeight: '1.4',
        fontWeight: 'bold',
    },
    heroSubtitle: {
        marginTop: '30px',
        fontSize: '1.1rem',
        color: '#013A72',
    },
    heroImage: {
        flex: '1',
        maxWidth: '500px',
    },
    heroImg: {
        width: '100%',
        height: 'auto',
    },
    serviceSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    serviceTitle: {
        fontSize: '1.5rem',
        color: '#000000',
        marginBottom: '30px',
        fontWeight: 'bold',
    },
    serviceSubTitle: {
        fontSize: '1.1rem',
        color: '#000000',
        marginBottom: '20px',
    },
    uploadContainer: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        width: '100%'
    },
    uploadArea: {
        flex: '2',
        border: '2px dashed #ccc',
        borderRadius: '12px',
        padding: '40px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: '#f8f9fa',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        '&:hover': {
            borderColor: '#013A72',
            backgroundColor: '#f1f8ff',
        },
    },
    icon: {
        fontSize: '40px',
        color: '#013A72',
    },
    cloudIcon: {
        fontSize: '40px',
        color: '#ffffff',
    },
    uploadText: {
        color: '#666',
        fontSize: '16px',
    },
    selectedFile: {
        color: '#28a745',
        fontWeight: '500',
    },
    button: (isSelected) => ({
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        opacity: isSelected ? 1 : 0.5,
        cursor: isSelected ? 'pointer' : 'not-allowed',
        padding: '20px',
        backgroundColor: isSelected ? '#013A72' : '#ccc',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        minWidth: '120px',
    }),
    fileNote: {
        color: '#666',
        fontSize: '14px',
        marginTop: '10px',
    },
    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        textAlign: 'center',
        minWidth: '300px',
    },
    modalFileName: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#013A72',
        margin: '15px 0',
        wordBreak: 'break-all'
    },
    modalButtons: {
        marginTop: '20px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
    },
    modalTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#013A72',
        marginBottom: '20px',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    modalSubTitle: {
        fontSize: '1.1rem',
        color: '#455A64',
        marginBottom: '30px',
        textAlign: 'left',
        lineHeight: '1.6',
        backgroundColor: '#F5F9FF',
        padding: '15px 20px',
        borderRadius: '8px'
    },
    resumeListHeader: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '16px',
        textAlign: 'left'
    },
    resumeListItem: {
        padding: '12px 16px',
        margin: '8px 0',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    selectedResumeItem: {
        backgroundColor: '#f1f8ff',
        border: '1px solid #013A72'
    },
    divider: {
        borderBottom: '1px solid #e5e7eb',
        margin: '16px 0'
    },
    modalButton: {
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        backgroundColor: '#013A72',
        color: '#ffffff',
        transition: 'all 0.2s ease'
    },
    cancelButton: {
        backgroundColor: '#6B7280',
        marginLeft: '8px'
    },
    uploadSection: {
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    loadButton: {
        padding: '8px 16px',
        borderRadius: '6px',
        border: '1px solid #013A72',
        backgroundColor: '#ffffff',
        color: '#013A72',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
};

const ContentApplicant = () => {
    const [fileState, setFileState] = useState({ name: '', file: null });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
    const [matchingFiles, setMatchingFiles] = useState({ resume: null, jobPost: null });
    const [selectedId, setSelectedId] = useState(null);
    const fileInputRef = useRef();

    const validateFile = (file) => {
        if (!file) return false;
        if (file.type !== 'application/pdf') {
            alert('PDF 파일만 업로드 가능합니다.');
            return false;
        }
        return true;
    };

    const handleError = (error) => {
        console.error('업로드 에러:', error);
        alert('파일 업로드 중 오류가 발생했습니다.');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
            setFileState({ name: file.name, file });
            setIsUploadModalOpen(true);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (validateFile(file)) {
            setFileState({ name: file.name, file });
            setIsUploadModalOpen(true);
        }
    };

    const handleSubmit = async () => {
        if (!fileState.file) {
            alert('PDF 파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileState.file);

        try {
            const response = await fetch('/api/upload-pdf', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('업로드 실패');
            }

            const result = await response.json();
            console.log('업로드 성공:', result);
            alert('파일이 성공적으로 업로드되었습니다.');

            setFileState({ name: '', file: null });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setIsUploadModalOpen(false);
        } catch (error) {
            handleError(error);
        }
    };

    const handleLoadConfirm = () => {
        if (!selectedId) {
            alert('이력서를 선택해주세요.');
            return;
        }
        const selectedResume = mockResumes.find(resume => resume.id === selectedId);
        setFileState({ name: selectedResume.name, file: null });
        setIsLoadModalOpen(false);
        setIsUploadModalOpen(true);
    };

    return (
        <main style={styles.container}>
                <section style={styles.hero}>
                    <div style={styles.heroContent}>
                        <h1 style={styles.heroTitle}>
                            AI 매칭으로 취업 성공까지<br />
                            한 걸음 더
                        </h1>
                        <p style={styles.heroSubtitle}>
                            내게 맞는 채용공고만 정확히 추천해드려요 <br />
                            이력서 첨부하고 나에게 딱 맞는 채용공고 매칭 받으세요
                        </p>
                    </div>
                    <div style={styles.heroImage}>
                        <img 
                            src="/images/Applicant_MainContent_none.png" 
                            alt="AI 매칭 서비스" 
                            style={styles.heroImg}
                        />
                    </div>
                </section>
                <section style={styles.serviceSection}>
                    <div style={styles.uploadContainer}>
                        <div
                            style={styles.uploadArea}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <FaPlusCircle style={styles.icon} />
                            <span style={styles.uploadText}>PDF로 이력서 매칭하기</span>
                            {fileState.name && (
                                <p style={styles.selectedFile}>{fileState.name}</p>
                            )}
                            <input
                                type="file"
                                accept="application/pdf"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </div>

                        <button 
                            type="button"
                            onClick={() => setIsLoadModalOpen(true)}
                            style={styles.button(true)}
                        >
                            <FaCloudDownloadAlt style={styles.cloudIcon} />
                            <span>내 이력서<br/>불러오기</span>
                        </button>

                        <button 
                            type="button"
                            onClick={() => setIsMatchingModalOpen(true)}
                            style={styles.button(true)}
                        >
                            <TbHeartHandshake style={styles.cloudIcon} />
                            <p>
                                Fit Advisor로 <br/>
                                1대1 매칭하기
                            </p>
                        </button>
                    </div>
                    <p style={styles.fileNote}>*등록가능한 파일 형식 및 확장자: PDF</p>
                    <p style={styles.fileNote}>**불필요한 개인정보가 포함되지 않도록 확인 후 첨부하세요</p>
                </section>

                {/* 이력서 업로드 확인 모달 */}
                {isUploadModalOpen && (
                    <div style={styles.modalBackdrop}>
                        <div style={styles.modal}>
                            <p>이 이력서를 업로드하시겠습니까?</p>
                            <p style={styles.modalFileName}>{fileState.name}</p>
                            <div style={styles.modalButtons}>
                                <button onClick={handleSubmit}>확인</button>
                                <button onClick={() => setIsUploadModalOpen(false)}>취소</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 이력서 불러오기 모달 */}
                {isLoadModalOpen && (
                    <div style={styles.modalBackdrop}>
                        <div style={styles.modal}>
                            <div style={styles.modalTitle}>내 이력서 불러오기</div>
                            <p style={styles.resumeListHeader}>불러올 이력서를 선택해주세요</p>
                            <div style={styles.divider} />
                            {mockResumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    style={{
                                        ...styles.resumeListItem,
                                        ...(selectedId === resume.id ? styles.selectedResumeItem : {})
                                    }}
                                    onClick={() => setSelectedId(prev => prev === resume.id ? null : resume.id)}
                                >
                                    <GrDocumentPdf size={20} color="#6B7280" />
                                    <span>{resume.name} ({resume.date})</span>
                                </div>
                            ))}
                            <div style={styles.modalButtons}>
                                <button
                                    style={styles.modalButton}
                                    onClick={handleLoadConfirm}
                                >
                                    선택하기
                                </button>
                                <button
                                    style={{ ...styles.modalButton, ...styles.cancelButton }}
                                    onClick={() => {
                                        setIsLoadModalOpen(false);
                                        setSelectedId(null);
                                    }}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isMatchingModalOpen && (
                    <div style={styles.modalBackdrop}>
                        <div style={styles.modal}>
                            <div style={styles.modalTitle}>
                                <RiRobot2Line size={24} color="#013A72" />
                                <span>Fit Advisor</span>
                            </div>
                            <div style={styles.modalSubTitle}>
                                AI agent "Fit Advisor"는 당신이 가고 싶은 회사에 맞는 로드맵을 만들어줘요
                            </div>
                            <div style={styles.divider} />
                            <p style={styles.resumeListHeader}>이력서 PDF 업로드</p>
                            <div style={styles.uploadSection}>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) =>
                                        setMatchingFiles((prev) => ({
                                            ...prev,
                                            resume: e.target.files[0],
                                        }))
                                    }
                                />
                                <button 
                                    style={styles.loadButton}
                                    onClick={() => {
                                        setIsMatchingModalOpen(false);
                                        setIsLoadModalOpen(true);
                                    }}
                                >
                                    <FaCloudDownloadAlt size={16} />
                                    이력서 불러오기
                                </button>
                            </div>
                            {matchingFiles.resume && (
                                <p style={styles.modalFileName}>{matchingFiles.resume.name}</p>
                            )}
                            <div style={styles.divider} />
                            <p style={styles.resumeListHeader}>공고 PDF 업로드</p>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                    setMatchingFiles((prev) => ({
                                        ...prev,
                                        jobPost: e.target.files[0],
                                    }))
                                }
                            />
                            {matchingFiles.jobPost && (
                                <p style={styles.modalFileName}>{matchingFiles.jobPost.name}</p>
                            )}
                            <div style={styles.modalButtons}>
                                <button
                                    style={styles.modalButton}
                                    onClick={() => {
                                        if (!matchingFiles.resume || !matchingFiles.jobPost) {
                                            alert('이력서와 공고 파일 모두 등록해주세요.');
                                            return;
                                        }
                                        // 여기서 매칭 요청 처리 API 등을 추가하면 됩니다
                                        alert('매칭 요청 완료!');
                                        setMatchingFiles({ resume: null, jobPost: null });
                                        setIsMatchingModalOpen(false);
                                    }}
                                >
                                    매칭 요청
                                </button>
                                <button
                                    style={{ ...styles.modalButton, ...styles.cancelButton }}
                                    onClick={() => {
                                        setIsMatchingModalOpen(false);
                                        setMatchingFiles({ resume: null, jobPost: null });
                                    }}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </main>
    );
};

export default ContentApplicant;
