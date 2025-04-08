import React from 'react';
import Modal from 'react-modal';
import Payment from '../pages/Payment'; // 실제 Payment 컴포넌트 경로에 맞게 수정
import { IoClose } from 'react-icons/io5';

Modal.setAppElement('#root');

const PaymentModal = ({ isOpen, onRequestClose }) => {
  return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Payment Modal"
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
        <div className="modal">
          <button onClick={onRequestClose} className='btn-modal-close'>
            <IoClose />
          </button>
          <Payment />
        </div>
      </Modal>
  );
};

export default PaymentModal;
