import React from "react";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message: string, type: "success" | "error", options?: ToastOptions) => {
  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    default:
      break;
  }
};

const ToastComponent: React.FC = () => {
  return <ToastContainer />;
};

export default ToastComponent;
