import axiosInstance from "./axios";
import { API } from "./endpoints";

export const registerUser = async (registerData: FormData) => {
  try {
    const response = await axiosInstance.post(API.USER.REGISTER, registerData);
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
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Request failed",
    );
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post(API.USER.RESET_PASSWORD(token), {
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Reset failed",
    );
  }
};

export const getMyProfile = async () => {
  try {
    const response = await axiosInstance.get(API.USER.GET_MY_PROFILE);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateMyProfile = async (formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      API.USER.UPDATE_MY_PROFILE,
      formData,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.USER.GET_PROFILE(id));
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateUserById = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      API.USER.GET_PROFILE(id),
      formData,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const response = await axiosInstance.delete(API.USER.GET_PROFILE(id));
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(API.USER.GET_ALL);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await axiosInstance.put(
      API.USER.CHANGE_PASSWORD,
      passwordData,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
