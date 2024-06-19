import instance from "../axios-instance";
import { ICreditCard } from "../types";
import axios from 'axios';

export const getAllCreditCards = async (): Promise<ICreditCard[]> => {
  try {
    const response = await instance.get<ICreditCard[]>("/api/card");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "An error occurred while fetching credit cards");
    }
    throw new Error("An error occurred while fetching credit cards");
  }
};

interface CreditLimitFormData {
  requestedFrameAmount: number;
  occupation: string;
  averageMonthlyIncome: number;
}

export const increaseCreditLimit = async (
  formData: CreditLimitFormData & { cardId: string }
): Promise<void> => {
  try {
    const requestData = {
      cardId: formData.cardId,
      requestedFrameAmount: Number(formData.requestedFrameAmount),
      occupation: formData.occupation,
      averageMonthlyIncome: Number(formData.averageMonthlyIncome),
    };

    const response = await instance.put("/api/card/creditLimitIncrease", requestData);
    console.log("Server response:", response.data);
    return response.data;
  } catch (error:unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(error.response.data.message || "An error occurred during credit limit increase");
    } else {
      console.error("Network error:", error.message);
      throw new Error("An error occurred during credit limit increase");
    }
  }
};

export const filterCreditCards = async (
  searchTerm: string,
  selectedBank: string,
  showBlockedOnly: boolean | undefined
): Promise<ICreditCard[]> => {
  try {
    const response = await instance.get<ICreditCard[]>("/api/card/filter", {
      params: {
        cardNumber: searchTerm || undefined,
        bankCode: selectedBank || undefined,
        isBlocked: showBlockedOnly,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server error:", error.response.data);
      throw new Error(error.response.data.message || "An error occurred while filtering cards");
    } else {
      console.error("Network error:", error.message);
      throw new Error("An error occurred while filtering cards");
    }
  }
};
