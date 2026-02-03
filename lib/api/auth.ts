import axiosInstance from "./axios";
import { API } from "./endpoints";

export const registerUser = async (registerData: FormData) => {
  try {
    const response = await axiosInstance.post(API.USER.REGISTER, registerData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const loginUser = async (loginData: any) => {
  try {
    const response = await axiosInstance.post(API.USER.LOGIN, loginData);
    return response.data;
  } catch (err: any) {
    throw err;
  }
};
