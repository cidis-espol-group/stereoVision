import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InProgressToast = ({ label }) => {
  return (
    <div className="max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg" role="alert" tabIndex="-1" aria-labelledby="hs-toast-message-with-loading-indicator-label">
      <div className="flex items-center p-4">
        <div className="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span className="sr-only">Loading...</span>
        </div>
        <p id="hs-toast-message-with-loading-indicator-label" className="ms-3 text-sm text-gray-700">
          {label}
        </p>
      </div>
    </div>
  );
};

// Función para mostrar el toast
export const showInProgressToast = (label) => {
  toast(<InProgressToast label={label} />, {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: false, // Para que no se cierre automáticamente
    closeOnClick: false,
    draggable: false,
  });
};

export default InProgressToast;