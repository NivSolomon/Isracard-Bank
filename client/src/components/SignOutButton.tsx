import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../services/AuthService";
import { useAuthContext } from "../contexts/AuthContext";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAuthContext();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Sign out!", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
