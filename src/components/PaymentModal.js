// PaymentModal.jsx
import React from 'react';
import Modal from 'react-modal';
import Payment from '../pages/Payment'; // 실제 Payment 컴포넌트 경로에 맞게 수정

Modal.setAppElement('#root');

const PaymentModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Payment Modal"
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          maxWidth: '500px',
          width: '90%',
          padding: '20px',
          borderRadius: '12px'
        }
      }}
    >
    <button onClick={onRequestClose} style={{ float: 'right', fontSize: '17px', fontWeight: 'bold' }}>
        X
    </button>
      <h2 style={{ marginTop: '0' }}>크레딧 충전</h2>
      <Payment />
    </Modal>
  );
};

export default PaymentModal;
