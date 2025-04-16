import Modal from 'react-modal';

const DeleteModal = ({isOpen, onRequestClose, deleteTarget, handleConfirmDelete, fileType}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Delete Modal"
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
            <div className="modal modal-delete">
                <p>정말 이 {fileType}를 삭제하시겠습니까?</p>
                <p className="modal-filename">{deleteTarget?.pdfFileName ?? ""}</p>
                <div className="modal-buttons">
                    <button onClick={onRequestClose} className="modal-button cancel-button">취소</button>
                    <button onClick={handleConfirmDelete} className="modal-button">삭제</button>
                    
                </div>
            </div>
        </Modal>
    );
}

export default DeleteModal;