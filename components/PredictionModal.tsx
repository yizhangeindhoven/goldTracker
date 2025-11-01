import React, { useEffect } from 'react';

interface PredictionModalProps {
  explanation: string;
  onClose: () => void;
}

const PredictionModal: React.FC<PredictionModalProps> = ({ explanation, onClose }) => {
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prediction-modal-title"
    >
      <div 
        className="bg-gray-800 border border-yellow-500/30 rounded-lg shadow-xl p-6 w-full max-w-md text-white relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
          aria-label="关闭弹窗"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 id="prediction-modal-title" className="text-xl font-bold text-yellow-400 mb-4">
          预测依据
        </h2>
        <p className="text-gray-300">
          {explanation}
        </p>
        <p className="text-xs text-gray-500 mt-4 italic">
            免责声明：此预测由人工智能模型根据公开数据生成，不构成财务建议。
        </p>
      </div>
    </div>
  );
};

export default PredictionModal;