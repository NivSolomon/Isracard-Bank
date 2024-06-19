import React, { useContext, useState } from "react";
import Toast from "../components/toasts/Toast";
import { useQuery } from "react-query";
import * as AuthService from "../services/AuthService";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AuthContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

const AuthContext = React.createContext<AuthContext | undefined>(undefined);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const { isError, isLoading } = useQuery(
    "validateToken",
    AuthService.validateToken,
    {
      retry: false,
    }
  );

  const showToast = (toastMessage: ToastMessage) => {
    setToast(toastMessage);
  };

  return (
    <AuthContext.Provider
      value={{ showToast, isLoggedIn: !isError && !isLoading }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};
