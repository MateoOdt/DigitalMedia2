import React, { useState } from "react";

interface TransactionPopupProps {
  onClose: () => void;
  onSubmit: (to: string, value: string) => void;
}

const TransactionPopup: React.FC<TransactionPopupProps> = ({ onClose, onSubmit }) => {
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    onSubmit(to, value);
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Transaction Details</h2>
        <label>To:</label>
        <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
        <label>Value (ETH):</label>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="popup-buttons">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionPopup;
