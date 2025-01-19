// Alert.js
import React from 'react';
import { X } from 'lucide-react';

const Alert = ({ title, message, setAlertVisible }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-sm transform transition-all">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-l-4 border-[#800000]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#800000] to-[#de9e28]/90">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={() => setAlertVisible(false)}
              className="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
            >
              <X size={10} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 bg-gradient-to-b from-gray-50 to-white">
            <p className="text-gray-700 leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={() => setAlertVisible(false)}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setAlertVisible(false)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#800000] to-[#de9e28] text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#de9e28]/20"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
