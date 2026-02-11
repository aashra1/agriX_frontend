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

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axiosInstance.post(API.USER.REQUEST_PASSWORD_RESET, {
      email,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Request password reset failed",
    );
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post(API.USER.RESET_PASSWORD(token), {
      newPassword: newPassword,
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Reset password failed",
    );
  }
};
