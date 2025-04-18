import Modal from 'react-modal';

const UploadCheckPostingModal = ({isOpen, onRequestClose, fileState, handleSubmit, startDate, endDate}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Upload Posting Modal"
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
            <div className="modal modal-upload">
                <p>이 채용공고를 업로드하시겠습니까?</p>
                <p className="modal-filename">{fileState.name}</p>
                <p><span>공고기간 : </span>{!startDate ? (<span>상시채용</span>) : (<><span>{startDate}</span><span> ~ </span><span>{endDate}</span></>)}</p>
                <div className="modal-buttons">
                    <button onClick={onRequestClose} className="modal-button cancel-button">취소</button>
                    <button onClick={handleSubmit} className="modal-button">등록하기</button>
                </div>
            </div>
        </Modal>
    );
}

export default UploadCheckPostingModal;