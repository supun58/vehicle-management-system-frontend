import React from "react";

const Alert = ({ message, type = "error", onClose }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg ${
        type === "error"
          ? "bg-red-100 border border-red-400 text-red-700"
          : "bg-yellow-100 border border-yellow-400 text-yellow-700"
      }`}
    >
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg ml-4 transition-colors duration-200"
        >
          Close
        </button>
      )}
    </div>
  );
};

export default Alert;
