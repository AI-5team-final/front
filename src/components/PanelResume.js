import React, { useRef, useState, useEffect } from 'react';
import { FaCloudArrowUp } from "react-icons/fa6";
import { GrDocumentPdf } from 'react-icons/gr';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/fonts.css';
import '../styles/PanelResume.css';
import useToken from '../hooks/useToken';
import { useNavigate } from 'react-router-dom';
import fetchClient from '../utils/fetchClient';

const PanelResume = () => {
    const [resumes, setResumes] = useState([]);
    const [fileState, setFileState] = useState({ name: '', file: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { token, removeToken } = useToken();
    const fileInputRef = useRef();
    const navigate = useNavigate();

    const handleAuthError = () => {
        toast.error('로그인이 필요한 서비스입니다.');
        removeToken();
        navigate('/login');
    };

    const handleError = (error) => {
        console.error('에러 발생:', error);
        if (error instanceof Error) {
            toast.error(error.message);
        } else if (typeof error === 'object') {
            toast.error(JSON.stringify(error, null, 2));
        } else {
            toast.error(String(error));
        }
    };

    const validateFile = (file) => {
        if (!file) return false;
        if (file.type !== 'application/pdf') {
            toast.error('PDF 파일만 업로드 가능합니다.');
            return false;
        }
        return true;
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (validateFile(file)) {
            setFileState({ name: file.name, file });
            setIsModalOpen(true);
        }
    };

    const handleConfirmUpload = async () => {
        if (!fileState.file) {
            toast.error('PDF 파일을 선택해주세요.');
            return;
        }

        if (!token) {
            handleAuthError();
            return;
        }

        const formData = new FormData();
        formData.append('file', fileState.file);

        try {
            const response = await fetchClient('/pdf/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '파일 업로드에 실패했습니다.');
            }

            toast.success('이력서가 성공적으로 업로드되었습니다.');
            setFileState({ name: '', file: null });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setIsModalOpen(false);
            fetchResumes();
        } catch (error) {
            handleError(error);
        }
    };

    const handleDeleteRequest = (resume) => {
        setDeleteTarget(resume);
    };

    const handleConfirmDelete = async () => {
        if (!token) {
            handleAuthError();
            return;
        }

        try {
            const response = await fetchClient('/pdf/delete', {
                method: 'POST',
                body: JSON.stringify({ pdfId: deleteTarget.id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '삭제에 실패했습니다.');
            }

            toast.success('이력서가 삭제되었습니다.');
            setResumes(prev => prev.filter(r => r.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchResumes = async () => {
        if (!token) {
            handleAuthError();
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetchClient('/pdf/list');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '이력서 목록을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setResumes(Array.isArray(data.pdfs) ? data.pdfs : []);
        } catch (error) {
            handleError(error);
            setResumes([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchResumes();
        }
    }, [token]);

    return (
        <>
            <section className="hero-section">
                <div className="hero-image-container">
                    <div className="hero-text">
                        <h1 className="title">이력서 관리</h1>
                        <p className="subtitle">나의 이력서를 한눈에 관리하고, 더 나은 기회를 준비하세요.</p>
                    </div>
                    <img
                        src="/images/Applicant_Resume.png"
                        alt="이력서 등록하기"
                        className="hero-img"
                    />
                </div>
            </section>

            <div className="container">
                <div className="upload-card">
                    <div
                        className="upload-area"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <FaCloudArrowUp className="icon" />
                        <h2 className="upload-title">이력서 등록하기</h2>
                        <p className="upload-paragraph">PDF 형식의 이력서를 등록할 수 있습니다.</p>
                        <p className="upload-paragraph">원하지 않는 이력서는 언제든 삭제할 수 있어요.</p>
                        <p className="upload-note">*이미지는 인식되지 않을 수 있습니다.</p>
                        <input
                            type="file"
                            accept="application/pdf"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="resume-list">
                    {isLoading ? (
                        <div className="loading">
                            이력서 목록을 불러오는 중...
                        </div>
                    ) : !Array.isArray(resumes) || resumes.length === 0 ? (
                        <div className="empty-state">
                            등록된 이력서가 없습니다.
                        </div>
                    ) : (
                        resumes.map((resume) => (
                            <div key={resume.id} className="resume-item">
                                <div className="resume-info">
                                    <GrDocumentPdf size={40} color="#6B7280" />
                                    <div style={{ marginLeft: '10px' }}>
                                        <a
                                            className="resume-link"
                                            href={resume.pdfUri}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {resume.pdfFileName}
                                        </a>
                                        <p className="resume-date">
                                            등록일: {new Date(resume.uploadedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteRequest(resume)}
                                >
                                    삭제하기
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <p>이 이력서를 업로드하시겠습니까?</p>
                        <p className="modal-file-name">{fileState.name}</p>
                        <div className="modal-buttons">
                            <button onClick={handleConfirmUpload}>확인</button>
                            <button onClick={() => setIsModalOpen(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <p>정말 이 이력서를 삭제하시겠습니까?</p>
                        <p className="modal-file-name">{deleteTarget.pdfFileName}</p>
                        <div className="modal-buttons">
                            <button onClick={handleConfirmDelete}>삭제</button>
                            <button onClick={() => setDeleteTarget(null)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PanelResume;
