import { GrDocumentPdf } from 'react-icons/gr';
import Modal from 'react-modal';

const LoadModal = ({isOpen, onRequestClose, isLoading, resumes, selectedId, setSelectedId, handleLoadConfirm, fileType, isMatching, setMatchingFiles}) => {
    
    const handleClick = () => {
        if(isMatching) {
            const selectedResume = resumes.find(resume => resume.id === selectedId);
            console.log('match',  selectedResume)

            setMatchingFiles((prev) => ({
                ...prev,
                resume: {...selectedResume, name: selectedResume.pdfFileName},
            })) 
            onRequestClose();
        }
        else {
            console.log('matchfalse')
            handleLoadConfirm()
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Load Modal"
            style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 11001, },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '12px',
                    zIndex: 11002,
                }
            }}
        >
            <div className='modal modal-load'>
                <div className="modal-title">내 {fileType} 불러오기</div>
                <p className="resume-list-header">불러올 {fileType}를 선택해주세요</p>
                <div className="divider" />
                {isLoading ? (
                    <div className="loading">{fileType} 목록을 불러오는 중...</div>
                ) : resumes.length === 0 ? (
                    <div className="empty-state">등록된 {fileType}가 없습니다.</div>
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
                        className="modal-button cancel-button"
                        onClick={onRequestClose} 
                    >
                        취소
                    </button>   
                    <button
                        className="modal-button"
                        onClick={handleClick}
                    >
                        선택하기
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default LoadModal;

