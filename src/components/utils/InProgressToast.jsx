import React from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InProgressToast = ({ label }) => {
  return (
    <>
      <div className="flex">
        <div className="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
          <span className="sr-only">Loading...</span>
        </div>
        <p id="hs-toast-message-with-loading-indicator-label" className="ms-3 text-sm text-gray-700">
          {label}
        </p>
      </div>
    </>
  );
};

// Función para mostrar el toast
export const showInProgressToast = (label) => {
  toast(<InProgressToast label={label} />,{
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    });
};

export default InProgressToast;