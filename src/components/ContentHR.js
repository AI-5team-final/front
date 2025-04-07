import React, { useRef, useState } from 'react';
import { FaPlusCircle, FaCloudDownloadAlt } from 'react-icons/fa';
import '../styles/fonts.css';
import fetchClient from '../utils/fetchClient';

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
        alignItems: 'center',
        marginBottom: '60px',
        gap: '40px',
    },
    heroContent: {
        flex: '1',
    },
    heroTitle: {
        fontSize: '2.5rem',
        color: '#1A237E',
        marginBottom: '20px',
        lineHeight: '1.4',
    },
    heroSubtitle: {
        fontSize: '1.1rem',
        color: '#455A64',
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
        color: '#1A237E',
        marginBottom: '30px',
    },
    uploadContainer: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
    },
    uploadArea: {
        flex: '1',
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
            borderColor: '#007bff',
            backgroundColor: '#f1f8ff',
        },
    },
    icon: {
        fontSize: '40px',
        color: '#007bff',
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        opacity: isSelected ? 1 : 0.5,
        cursor: isSelected ? 'pointer' : 'not-allowed',
        padding: '20px',
        backgroundColor: isSelected ? '#007bff' : '#ccc',
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
};

const ContentHR = () => {
    const [fileState, setFileState] = useState({
        name: '',
        file: null
    });
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
            setFileState({
                name: file.name,
                file: file
            });
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (validateFile(file)) {
            setFileState({
                name: file.name,
                file: file
            });
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
            const response = await fetchClient('/api/upload', {
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
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <main style={styles.container}>
            <div style={styles.inner}>
                <section style={styles.hero}>
                    <div style={styles.heroContent}>
                        <h1 style={styles.heroTitle}>
                            AI 매칭으로 인재 채용까지<br />
                            한 걸음 더
                        </h1>
                        <p style={styles.heroSubtitle}>
                            우리 회사에 맞는 인재를 정확히 추천해드려요.
                        </p>
                    </div>
                    <div style={styles.heroImage}>
                        <img 
                            src="/images/HR_MainContent_none.png" 
                            alt="AI 매칭 서비스" 
                            style={styles.heroImg}
                        />
                    </div>
                </section>

                <section style={styles.serviceSection}>
                    <h2 style={styles.serviceTitle}>AI 매칭 서비스</h2>
                    <div style={styles.uploadContainer}>
                        <div
                            style={styles.uploadArea}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <FaPlusCircle style={styles.icon} />
                            <span style={styles.uploadText}>채용공고 등록하기</span>
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
                            onClick={handleSubmit}
                            disabled={!fileState.file}
                            style={styles.button(!!fileState.file)}
                        >
                            <FaCloudDownloadAlt style={styles.icon} />
                            <span>채용공고<br/>불러오기</span>
                        </button>
                    </div>
                    <p style={styles.fileNote}>*등록가능한 파일 형식 및 확장자: PDF</p>
                </section>
            </div>
        </main>
    );
}

export default ContentHR; 