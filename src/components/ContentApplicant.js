import { useRef, useState } from 'react';
import { FaPlusCircle, FaCloudDownloadAlt } from 'react-icons/fa';
import { TbHeartHandshake } from 'react-icons/tb';
import { GrDocumentPdf } from 'react-icons/gr';
import { RiRobot2Line } from "react-icons/ri";
import '../styles/ContentApplicant.css';

const ContentApplicant = () => {
    const [fileState, setFileState] = useState({ name: '', file: null });
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);
    const [matchingFiles, setMatchingFiles] = useState({ resume: null, jobPost: null });
    const [selectedId, setSelectedId] = useState(null);
    const [resumes, setResumes] = useState([]);
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
        const selectedResume = resumes.find(resume => resume.id === selectedId);
        setFileState({ name: selectedResume.name, file: null });
        setIsLoadModalOpen(false);
        setIsUploadModalOpen(true);
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
                                onClick={() => setIsLoadModalOpen(true)}
                                className="button active"
                            >
                                <FaCloudDownloadAlt className="icon icon-white" />
                                <span>내 이력서<br/>불러오기</span>
                            </button>
                        
                            <button 
                                type="button"
                                onClick={() => setIsMatchingModalOpen(true)}
                                className="button active"
                            >
                                <TbHeartHandshake className="icon icon-white" />
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
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className={`resume-list-item ${selectedId === resume.id ? 'selected-resume-item' : ''}`}
                                onClick={() => setSelectedId(prev => prev === resume.id ? null : resume.id)}
                            >
                                <GrDocumentPdf size={20} color="#6B7280" />
                                <span>{resume.name} ({resume.date})</span>
                            </div>
                        ))}
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
