import axios from 'axios';
import instance from '../axios-instance';
import { IBank } from '../types';

export const getAllBanks = async (): Promise<IBank[]> => {
  try {
    const response = await instance.get<IBank[]>("/api/bank");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred while fetching banks');
    }
    throw new Error('An error occurred while fetching banks');
  }
};
