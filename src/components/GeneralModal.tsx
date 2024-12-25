import React from 'react';

interface ModalProps {
  onClose: () => void;
  title?: string; // Optional title for the modal
  children: React.ReactNode; // Add this to include the `children` prop
}

export const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default  Modal;
