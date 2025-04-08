import { useRef, useState } from 'react';
import { FaPlusCircle, FaCloudDownloadAlt } from 'react-icons/fa';
import { TbHeartHandshake } from 'react-icons/tb';
import { GrDocumentPdf } from 'react-icons/gr';
import { RiRobot2Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import fetchClient from '../utils/fetchClient';
import '../styles/ContentApplicant.scss';

const ContentApplicant = () => {
    const [fileState, setFileState] = useState({ name: '', file: null });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
    const [matchingFiles, setMatchingFiles] = useState({ resume: null, jobPost: null });
    const [selectedId, setSelectedId] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef();
    const navigate = useNavigate();

    const validateFile = (file) => {
        if (!file) return false;
        if (file.type !== 'application/pdf') {
            toast.error('PDF 파일만 업로드 가능합니다.');
            return false;
        }
        return true;
    };

    const handleError = (error) => {
        toast.error('파일 업로드 중 오류가 발생했습니다.');
    };

    const handleAuthError = () => {
        toast.error('로그인이 필요한 서비스입니다.');
        localStorage.removeItem('accessToken');
        navigate('/login');
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
            toast.error('PDF 파일을 선택해주세요.');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            handleAuthError();
            return;
        }

        const formData = new FormData();
        formData.append('file', fileState.file);

        try {
            const response = await fetchClient('/pdf/EtoC', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('업로드 실패');
            }

            const data = await response.json();

            setFileState({ name: '', file: null });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setIsUploadModalOpen(false);
            
            // 매칭 결과와 업로드된 PDF 정보를 함께 전달
            navigate('/list', { 
                state: { 
                    results: data  // 전체 매칭 결과만 전달
                } 
            });
        } catch (error) {
            console.error('PDF 업로드 에러:', error);
            if (error.response?.status === 401) {
                handleAuthError();
                return;
            }
            handleError(error);
        }
    };

    const fetchResumes = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            handleAuthError();
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetchClient('/pdf/list');
            if (response.status === 401) {
                handleAuthError();
                return;
            }

            if (!response.ok) {
                throw new Error('이력서 목록을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setResumes(data.pdfs || []);
        } catch (error) {
            if (error.response?.status === 401) {
                handleAuthError();
                return;
            }
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadConfirm = async () => {
        if (!selectedId) {
            toast.error('이력서를 선택해주세요.');
            return;
        }
        const selectedResume = resumes.find(resume => resume.id === selectedId);
        if (selectedResume) {
            try {
                const response = await fetch(selectedResume.pdfUri);
                console.log('response', response);
                if (!response.ok) {
                    throw new Error('이력서를 불러오는데 실패했습니다.');
                }
                const blob = await response.blob();
                const file = new File([blob], selectedResume.pdfFileName, { type: 'application/pdf' });
                setFileState({ 
                    name: selectedResume.pdfFileName, 
                    file: file 
                });
                setIsLoadModalOpen(false);
                setIsUploadModalOpen(true);
            } catch (error) {
                toast.error('저장소에서 이력서를 불러오는데 실패했습니다.');
            }
        }
    };

    const handleLoadModalOpen = () => {
        setIsLoadModalOpen(true);
        fetchResumes();
    };

    return (
        <main>
            <section className="hero">
                <div className='inner'>
                    <div className="hero-content">
                        <h1 className="hero-title">
                            AI 매칭으로 취업 성공까지<br />
                            한 걸음 더
                        </h1>
                        <p className="hero-subtitle">
                            내게 맞는 채용공고만 정확히 추천해드려요 <br />
                            이력서 첨부하고 나에게 딱 맞는 채용공고 매칭 받으세요
                        </p>
                    </div>
                    <div className="hero-image">
                        <img 
                            src="/images/Applicant_MainContent_none.png" 
                            alt="AI 매칭 서비스" 
                            className="hero-img"
                        />
                    </div>
                </div>
            </section>
            <section className="service">
                <div className='inner'>
                    <div className="service-section">
                        <div className="upload-container">
                            <div
                                className="upload-area"
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <FaPlusCircle className="icon" />
                                <span className="upload-text">PDF로 이력서 매칭하기</span>
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
                                onClick={handleLoadModalOpen}
                                className="button active"
                            >
                                <FaCloudDownloadAlt className="cloud-icon" />
                                <span>내 이력서<br/>불러오기</span>
                            </button>
                        
                            <button 
                                type="button"
                                onClick={() => setIsMatchingModalOpen(true)}
                                className="button active"
                            >
                                <TbHeartHandshake className="cloud-icon" />
                                <p>
                                    Fit Advisor로 <br/>
                                    1대1 매칭하기
                                </p>
                            </button>
                        </div>
                        <p className="file-note">*등록가능한 파일 형식 및 확장자: PDF</p>
                        <p className="file-note">**불필요한 개인정보가 포함되지 않도록 확인 후 첨부하세요</p>
                    </div>
                </div>
            </section>

            {/* 이력서 업로드 확인 모달 */}
            {isUploadModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <p>이 이력서를 업로드하시겠습니까?</p>
                        <p className="modal-filename">{fileState.name}</p>
                        <div className="modal-buttons">
                            <button onClick={handleSubmit}>확인</button>
                            <button onClick={() => setIsUploadModalOpen(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 이력서 불러오기 모달 */}
            {isLoadModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-title">내 이력서 불러오기</div>
                        <p className="resume-list-header">불러올 이력서를 선택해주세요</p>
                        <div className="divider" />
                        {isLoading ? (
                            <div className="loading">이력서 목록을 불러오는 중...</div>
                        ) : resumes.length === 0 ? (
                            <div className="empty-state">등록된 이력서가 없습니다.</div>
                        ) : (
                            resumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    className={`resume-list-item ${selectedId === resume.id ? 'selected-resume-item' : ''}`}
                                    onClick={() => setSelectedId(prev => prev === resume.id ? null : resume.id)}
                                >
                                    <GrDocumentPdf size={20} color="#6B7280" />
                                    <span>{resume.pdfFileName} ({new Date(resume.uploadedAt).toLocaleString()})</span>
                                </div>
                            ))
                        )}
                        <div className="modal-buttons">
                            <button
                                className="modal-button"
                                onClick={handleLoadConfirm}
                            >
                                선택하기
                            </button>
                            <button
                                className="modal-button cancel-button"
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
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-title">
                            <RiRobot2Line size={24} color="#013A72" />
                            <span>Fit Advisor</span>
                        </div>
                        <div className="modal-subtitle">
                            AI agent "Fit Advisor"는 당신이 가고 싶은 회사에 맞는 로드맵을 만들어줘요
                        </div>
                        <div className="divider" />
                        <p className="resume-list-header">이력서 PDF 업로드</p>
                        <div className="upload-section">
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
                                className="load-button"
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
                            <p className="modal-filename">{matchingFiles.resume.name}</p>
                        )}
                        <div className="divider" />
                        <p className="resume-list-header">공고 PDF 업로드</p>
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
                            <p className="modal-filename">{matchingFiles.jobPost.name}</p>
                        )}
                        <div className="modal-buttons">
                            <button
                                className="modal-button"
                                onClick={() => {
                                    if (!matchingFiles.resume || !matchingFiles.jobPost) {
                                        toast.error('이력서와 공고 파일 모두 등록해주세요.');
                                        return;
                                    }
                                    toast.success('매칭 요청 완료!');
                                    setMatchingFiles({ resume: null, jobPost: null });
                                    setIsMatchingModalOpen(false);
                                }}
                            >
                                매칭 요청
                            </button>
                            <button
                                className="modal-button cancel-button"
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
