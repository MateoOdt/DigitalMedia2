import React, { useState } from "react";

interface PopupProps {
  onClose: () => void;
  onSubmit: (input: string | { to: string; value: string }) => void;
  popupType: "connectAccount" | "transaction";
  connectAccountInput?: string;
}

const Popup: React.FC<PopupProps> = ({
  onClose,
  onSubmit,
  popupType,
  connectAccountInput,
}) => {
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (popupType === "connectAccount") {
      onSubmit(connectAccountInput || "");
    } else if (popupType === "transaction") {
      onSubmit({ to, value });
    }
    onClose();
  };

  return (
    <div className="relative inset-0 z-10 flex items-center justify-center bg-primary-200 rounded-lg">
      <div className="relative flex-col items-center justify-center p-8">
        {popupType === "connectAccount" && (
          <>
            <h2 className="text-lg font-semibold mb-4">Connect Account</h2>
            <div className="mb-4">
              <input
                type="text"
                value={connectAccountInput || ""}
                onChange={(e) => onSubmit(e.target.value)}
                placeholder="Enter address"
                className="border border-gray-300 rounded-md w-full px-3 py-2 text-primary-100"
              />
            </div>
          </>
        )}
        {popupType === "transaction" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
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
          </>
        )}
        <div className="flex justify-center ">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            {popupType === "connectAccount" ? "Connect" : "Submit"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 rounded px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
