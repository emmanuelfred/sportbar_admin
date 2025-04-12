// components/CustomAlertModal.jsx
import React from 'react';
import './custom.css'; // CSS styles in external file

const CustomAlertModal = ({ visible, onClose, title, message, buttons = [] }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => {
                onClose();
                if (btn.onPress) btn.onPress();
              }}
              className={`modal-button ${btn.style === 'cancel' ? 'cancel-button' : ''}`}
            >
              {btn.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomAlertModal;
