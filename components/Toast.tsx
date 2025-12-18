import React from 'https://aistudiocdn.com/react@^19.2.0';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div 
      className={`fixed top-5 right-5 z-50 flex items-center justify-between px-4 py-2 rounded-md text-white shadow-lg animate-fade-in-down ${bgColor}`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-xl font-bold leading-none">&times;</button>
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Toast;