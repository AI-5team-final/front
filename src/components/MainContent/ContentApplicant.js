import { useRef, useState } from 'react';
import { FaPlusCircle, FaCloudDownloadAlt } from 'react-icons/fa';
import { TbHeartHandshake } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../../context/MatchContext';
import fetchClient from '../../utils/fetchClient';
import UploadCheckModal from '../../modal/UploadCheckModal';
import LoadModal from '../../modal/LoadModal';
import MatchingModal from '../../modal/MatchingModal';
import { handleAuthError, handleFileNotSelectedError, handleFileLoadError, handleListLoadingError, handleNetworkError, handleNoFileError } from './ErrorHandler';
import { validateFile } from './FileValidation';
import TutorialManager from '../Tutorial/TutorialManager';
import TutorialButton from '../Tutorial/TutorialButton';
import { APPLICANT_PAGE_STEPS } from '../Tutorial/ApplicantTutorialSteps';
import '../../styles/ContentApplicant.scss';


const ContentApplicant = () => {
    const [fileState, setFileState] = useState({ name: '', file: null });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
    const [matchingFiles, setMatchingFiles] = useState({ resume: null, jobPost: null });
    const [selectedId, setSelectedId] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMatching, setIsMatching] = useState(false);
    const fileInputRef = useRef();
    const navigate = useNavigate();
    const { setResumeFile } = useMatch();
    const [showTutorial, setShowTutorial] = useState(false);

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
            handleNoFileError();
            setIsUploadModalOpen(false);
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            handleAuthError(null, navigate);
            return;
        }

        localStorage.setItem('resumeFileUploaded', 'true');
        setResumeFile(fileState.file);

        // List 페이지로 이동
        navigate('/list');
    };

    const fetchResumes = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            handleAuthError(null, navigate);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetchClient('/pdf/list');

            if (!response.ok) {
                handleListLoadingError(new Error('BAD REQUEST : ' + response.status));
                return;
            }
            if (response.status === 401) {
                handleAuthError(null, navigate);
                return;
            }

            const data = await response.json();
            setResumes(data.pdfs || []);
        } catch (error) {
            if (error.response?.status === 401) {
                handleAuthError(null, navigate);
            } else {
                handleNetworkError(error, navigate);
            }
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadConfirm = async () => {
        if (!selectedId) {
            handleFileNotSelectedError('이력서');
            return;
        }
        const selectedResume = resumes.find(resume => resume.id === selectedId);
        if (selectedResume) {
            try {
                const response = await fetch(selectedResume.pdfUri);
                if (!response.ok) {
                    handleFileLoadError(new Error('BAD REQUEST : ' + response.status));
                    return;
                }
                if (response.status === 401) {
                    handleAuthError(null, navigate);
                    return;
                }  
                const blob = await response.blob();
                const file = new File([blob], selectedResume.pdfFileName, { type: 'application/pdf' });
                setFileState({ 
                    name: selectedResume.pdfFileName, 
                    file: file 
                });
                // setIsLoadModalOpen(false);
                setIsUploadModalOpen(prev=>!prev);
            } catch (error) {
                handleFileLoadError(error);
            }
        }
    };

    const handleLoadModalOpen = () => {
        setIsLoadModalOpen(true);
        setIsMatching(false);
        fetchResumes();
    };
   
    const closeLoadModal = () => {setIsLoadModalOpen(false); setSelectedId(null);};

    const openMatchingModal = () => {
        setIsMatchingModalOpen(true);
        fetchResumes();
    };
    const closeMatchingModal = () => {
        setIsMatchingModalOpen(false);
        setMatchingFiles({ resume: null, jobPost: null });
    };
    const closeUploadCheckModal = () => setIsUploadModalOpen(prev=>!prev);

    return (
        <div className='l-content-apply'>
            <TutorialManager 
                steps={APPLICANT_PAGE_STEPS} 
                startImmediately={showTutorial} 
            />
            <TutorialButton onClick={() => setShowTutorial(true)} />
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
                                <span className="upload-text">이력서 매칭하기</span>
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
                                onClick={openMatchingModal}
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
            <UploadCheckModal isOpen={isUploadModalOpen} onRequestClose={closeUploadCheckModal} fileState={fileState} handleSubmit={handleSubmit} fileType={"이력서"}/>            

            {/* 이력서 불러오기 모달 */}
            <LoadModal isOpen={isLoadModalOpen} onRequestClose={closeLoadModal} isLoading={isLoading} resumes={resumes} selectedId={selectedId} setSelectedId={setSelectedId} handleLoadConfirm={handleLoadConfirm} fileType={"이력서"} isMatching={isMatching} setMatchingFiles={setMatchingFiles}/>
            
            {/* 1대1 매칭 모달 */}
            <MatchingModal isOpen={isMatchingModalOpen} onRequestClose={closeMatchingModal} setMatchingFiles={setMatchingFiles} setIsMatchingModalOpen={setIsMatchingModalOpen} setIsLoadModalOpen={setIsLoadModalOpen} matchingFiles={matchingFiles} setIsMatching={setIsMatching}/>
        </div>
    );
};

export default ContentApplicant;