import axios from "axios";
import instance from "../axios-instance";
import { SignInFormData } from "../types";

export const signIn = async (formData: SignInFormData) => {
  try {
    const response = await instance.post("/api/auth/login", formData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An error occurred during sign in");
  }
};

export const validateToken = async () => {
  try {
    const response = await instance.get("/api/auth/validate-token");
    return response.data;
  } catch (error) {
    throw new Error("Token invalid");
  }
};

export const signOut = async () => {
  try {
    const response = await instance.post("/api/auth/logout", {});
    if (response.status !== 200) {
      throw new Error("Error during sign out");
    }
    localStorage.removeItem("token");
  } catch (error) {
    throw new Error("Error during sign out");
  }
};
