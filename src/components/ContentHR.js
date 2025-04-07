import React, { useRef, useState } from 'react';
import { FaPlusCircle, FaCloudDownloadAlt } from 'react-icons/fa';
import '../styles/fonts.css';
import '../styles/ContentHR.scss';
import fetchClient from '../utils/fetchClient';

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
        <main className="container">
            <div className="inner">
                <section className="hero">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            AI 매칭으로 인재 채용까지<br />
                            한 걸음 더
                        </h1>
                        <p className="hero-subtitle">
                            우리 회사에 맞는 인재를 정확히 추천해드려요.
                        </p>
                    </div>
                    <div className="hero-image">
                        <img 
                            src="/images/HR_MainContent_none.png" 
                            alt="AI 매칭 서비스" 
                            className="hero-img"
                        />
                    </div>
                </section>

                <section className="service-section">
                    <h2 className="service-title">AI 매칭 서비스</h2>
                    <div className="upload-container">
                        <div
                            className="upload-area"
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <FaPlusCircle className="icon" />
                            <span className="upload-text">채용공고 등록하기</span>
                            {fileState.name && (
                                <p className="selected-file">{fileState.name}</p>
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
                            className="button"
                        >
                            <FaCloudDownloadAlt className="icon" />
                            <span>채용공고<br/>불러오기</span>
                        </button>
                    </div>
                    <p className="file-note">*등록가능한 파일 형식 및 확장자: PDF</p>
                </section>
            </div>
        </main>
    );
}

export default ContentHR; 