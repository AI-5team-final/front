import { FaCloudDownloadAlt } from 'react-icons/fa';
import { RiRobot2Line } from 'react-icons/ri';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

const MatchingModal = ({isOpen, onRequestClose, setMatchingFiles, setIsMatchingModalOpen,setIsLoadModalOpen, matchingFiles}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Matching Modal"
            style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 11000, },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '12px',
                    zIndex: 11000,
                }
            }}
        >
            <div className='modal modal-match'>
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
                        className="modal-button cancel-button"
                        onClick={onRequestClose}
                    >
                        취소
                    </button>
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
                    
                </div>
            </div>
               
        </Modal>
    );
}

export default MatchingModal;

