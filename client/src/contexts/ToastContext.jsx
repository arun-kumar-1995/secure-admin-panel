import { createContext, useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
const ToastContext = createContext();


export const ToastProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);