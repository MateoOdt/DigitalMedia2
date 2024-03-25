import React, { useState } from "react";

interface TransactionPopupProps {
  onClose: () => void;
  onSubmit: (to: string, value: string) => void;
  transactionType: string;
}

const TransactionPopup: React.FC<TransactionPopupProps> = ({
  onClose,
  onSubmit,
  transactionType,
}) => {
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [hash, setHash] = useState("");

  const handleSubmit = () => {
    if (transactionType === "send") {
      onSubmit(to, value);
    } else if (transactionType === "get") {
      onSubmit(hash, "");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-primary-100 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
        {transactionType === "send" && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="to"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                To:
              </label>
              <input
                id="to"
                type="text"
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-primary-100"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="value"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Value (ETH):
              </label>
              <input
                id="value"
                type="text"
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-primary-100"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
        )}
        {transactionType === "get" && (
          <div className="mb-4">
            <label
              htmlFor="hash"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter Transaction Hash:
            </label>
            <input
              id="hash"
              type="text"
              className="border border-gray-300 rounded-md w-full px-3 py-2 text-primary-100"
              value={hash}
              onChange={(e) => setHash(e.target.value)} // Update hash state
            />
          </div>
        )}
        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionPopup;
