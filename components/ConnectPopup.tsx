import React, { useState } from "react";

interface ConnectAccountPopupProps {
  onClose: () => void;
  onSubmit: (input: string) => void;
  connectAccountInput: string;
  setConnectAccountInput: React.Dispatch<React.SetStateAction<string>>;
}

const ConnectAccountPopup: React.FC<ConnectAccountPopupProps> = ({ onClose, onSubmit, connectAccountInput, setConnectAccountInput }) => {
  const handleSubmit = () => {
    onSubmit(connectAccountInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg p-8">
        <h2 className="text-lg font-semibold mb-4">Connect Account</h2>
        <input
          type="text"
          value={connectAccountInput}
          onChange={(e) => setConnectAccountInput(e.target.value)}
          placeholder="Enter address"
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full text-primary-100"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Connect
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 rounded px-4 py-2 ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectAccountPopup;
