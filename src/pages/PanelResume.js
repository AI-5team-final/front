import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudArrowUp } from "react-icons/fa6";
import { GrDocumentPdf } from 'react-icons/gr';
import { toast } from 'react-toastify';
import fetchClient from '../utils/fetchClient';
import UploadCheckModal from '../modal/UploadCheckModal';
import DeleteModal from '../modal/DeleteModal';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Panel.scss';
import useAuth from '../hooks/useAuth';

const PanelResume = () => {
    const [resumes, setResumes] = useState([]);
    const [fileState, setFileState] = useState({ name: '', file: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { userInfo } = useAuth();
    const role = userInfo?.role;
    const fileInputRef = useRef();
    const navigate = useNavigate();


    useEffect(() => {
        fetchResumes();
    }, []);

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


        const formData = new FormData();
        formData.append('file', fileState.file);
        setIsLoading(true);
        setIsModalOpen(false);

        try {
            const response = await fetchClient('/pdf/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                const err =  new Error(errorData.message || '파일 업로드에 실패했습니다.');
                reportError({
                    err,
                    url: '/pdf/upload'
                });
                throw err;
            }
            
            toast.success('이력서가 성공적으로 업로드되었습니다.');
            setFileState({ name: '', file: null });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchResumes();
            setIsLoading(false)
        } catch (error) {
            handleError(error);
            reportError({
                error,
                url: '/pdf/upload'
            });
        }
    };

    const handleDeleteRequest = (resume) => {
        setDeleteTarget(resume);
    };

    const handleConfirmDelete = async () => {

        setDeleteTarget(null);

        try {
            const response = await fetchClient('/pdf/delete', {
                method: 'POST',
                body: JSON.stringify({ pdfId: deleteTarget.id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const err = new Error(errorData.message || '삭제에 실패했습니다.');
                reportError({
                    err,
                    url: '/pdf/delete'
                });
                throw err;
            }
            
            setResumes(prev => prev.filter(r => r.id !== deleteTarget.id));
            toast.success('이력서가 삭제되었습니다.');
            
        } catch (error) {
            handleError(error);
            reportError({
                error,
                url: '/pdf/delete'
            });
        }
    };

    const fetchResumes = async () => {
       
        try {
            setIsLoading(true);
            const response = await fetchClient('/pdf/list');

            if (!response.ok) {
                throw new Error('이력서 목록을 불러오는데 실패했습니다.');
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

    

    const closeUploadModal = () => setIsModalOpen(prev=>!prev);
    const closeDeleteModal = () => setDeleteTarget(null);


    return (
        <main className="l-panel l-panel-resume">
            <section className="hero-section">
                <div className="inner">
                    <div className="hero-text">
                        <h2 className="title">이력서 관리</h2>
                        <p className="subtitle">나의 이력서를 한눈에 관리하고, 더 나은 기회를 준비하세요.</p>
                    </div>
                    <img
                        src="/images/Applicant_Resume.png"
                        alt="이력서 등록하기"
                        className="hero-img"
                    />
                </div>
            </section>

            <section className="section section-upload">
                <div className="inner">
                    <div className="upload-card">
                        <div
                            className="upload-area"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <FaCloudArrowUp className="icon" />
                            <h2 className="upload-title">이력서 등록하기</h2>
                            <p className="upload-paragraph">PDF 형식의 이력서를 등록할 수 있습니다.</p>
                            <p className="upload-paragraph">원하지 않는 이력서는 언제든 삭제할 수 있어요.</p>
                            <p className="upload-note">*이미지는 인식되지 않습니다.</p>
                            <input
                                type="file"
                                accept="application/pdf"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    
                </div>
            </section>
            <section className="section section-list">
                <div className='inner'>
                    <div className="list">
                        {isLoading ? (
                            <div style={{padding: "20px 0"}}>
                                <LoadingSpinner/>
                                <div className="loading">
                                    이력서 목록을 불러오는 중...
                                </div>
                            </div>
                        ) : !Array.isArray(resumes) || resumes.length === 0 ? ( 
                            <div className="empty-state">
                                등록된 이력서가 없습니다.
                            </div>
                        ) : (
                            resumes.map((resume) => (
                                <div key={resume.id} className="item">
                                    <div className="info">
                                        <GrDocumentPdf size={40} color="#6B7280" />
                                        <div>
                                            <a
                                                className="link"
                                                href={resume.presignedUrl}
                                                // download
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {resume.pdfFileName}
                                            </a>
                                            <p className="date">
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
            </section>

            {/* 이력서 업로드 확인 모달 */}
            <UploadCheckModal isOpen={isModalOpen} onRequestClose={closeUploadModal} fileState={fileState} handleSubmit={handleConfirmUpload} fileType={"이력서"}/>

            {/* 삭제 모달 */}
            <DeleteModal isOpen={deleteTarget} onRequestClose={closeDeleteModal} deleteTarget={deleteTarget} handleConfirmDelete={handleConfirmDelete} fileType={"이력서"}/>
        </main>
    );
};

export default PanelResume;
