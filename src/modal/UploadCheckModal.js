import Modal from 'react-modal';

const UploadCheckModal = ({isOpen, onRequestClose, fileState, handleSubmit, fileType}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Upload Modal"
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
                <p>이 {fileType}를 업로드하시겠습니까?</p>
                <p className="modal-filename">{fileState.name}</p>
                <div className="modal-buttons">
                    <button onClick={onRequestClose} className="modal-button cancel-button">취소</button>
                    <button onClick={handleSubmit} className="modal-button">확인</button>
                </div>
            </div>
        </Modal>
    );
}

export default UploadCheckModal;