import { useRef, useState } from 'react';
import { FaPlusCircle, FaCloudDownloadAlt } from 'react-icons/fa';
import { TbHeartHandshake } from 'react-icons/tb';
import '../styles/fonts.css';

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
    }
};

const ContentApplicant = () => {
    const [fileState, setFileState] = useState({ name: '', file: null });
    const [isModalOpen, setIsModalOpen] = useState(false); // 제출 확인 모달
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false); // 불러오기 모달
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
            setIsModalOpen(true); // 바로 제출 모달 열기
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (validateFile(file)) {
            setFileState({ name: file.name, file });
            setIsModalOpen(true); // 바로 제출 모달 열기
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
            const response = await fetch('/api/upload', {
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
            setIsModalOpen(false);
        } catch (error) {
            handleError(error);
        }
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
                            onClick={() => setIsLoadModalOpen(true)}
                            style={styles.button(true)}
                        >
                            <TbHeartHandshake style={styles.cloudIcon} />
                            <span>1대1 매칭하기</span>
                        </button>
                    </div>
                    <p style={styles.fileNote}>*등록가능한 파일 형식 및 확장자: PDF</p>
                    <p style={styles.fileNote}>**불필요한 개인정보가 포함되지 않도록 확인 후 첨부하세요</p>
                </section>

                {/* 제출 확인 모달 */}
                {isModalOpen && (
                    <div style={styles.modalBackdrop}>
                        <div style={styles.modal}>
                            <p>이 이력서를 업로드하시겠습니까?</p>
                            <p style={styles.modalFileName}>{fileState.name}</p>
                            <div style={styles.modalButtons}>
                                <button onClick={handleSubmit}>확인</button>
                                <button onClick={() => setIsModalOpen(false)}>취소</button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* 불러오기 모달 */}
                {isLoadModalOpen && (
                    <div style={styles.modalBackdrop}>
                        <div style={styles.modal}>
                            <p>불러오기 모달입니다. (임시)</p>
                            <button
                                onClick={() => {
                                    setIsLoadModalOpen(false);
                                    setIsModalOpen(true);
                                }}
                                style={{ marginTop: '20px' }}
                            >
                                넘어가기
                            </button>
                        </div>
                    </div>
                )}
        </main>
    );
};

export default ContentApplicant;
