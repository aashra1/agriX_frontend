import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
  isAdmin?: boolean;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  users?: User[];
  data?: User | User[];
}

export const registerUser = async (
  registerData: FormData,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(API.USER.REGISTER, registerData);
  return response.data;
};

export const loginUser = async (
  loginData: LoginData,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(API.USER.LOGIN, loginData);
  return response.data;
};

export const requestPasswordReset = async (
  email: string,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(API.USER.REQUEST_PASSWORD_RESET, {
    email,
  });
  return response.data;
};

export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post(API.USER.RESET_PASSWORD(token), {
    newPassword,
  });
  return response.data;
};

export const getMyProfile = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.get(API.USER.GET_MY_PROFILE);
  return response.data;
};

export const updateMyProfile = async (
  formData: FormData,
): Promise<AuthResponse> => {
  const response = await axiosInstance.put(
    API.USER.UPDATE_MY_PROFILE,
    formData,
  );
  return response.data;
};

export const changePassword = async (
  passwordData: ChangePasswordData,
): Promise<AuthResponse> => {
  const response = await axiosInstance.put(
    API.USER.CHANGE_PASSWORD,
    passwordData,
  );
  return response.data;
};

export const getAllUsers = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.get(API.USER.GET_ALL);
  return response.data;
};

export const getUserById = async (id: string): Promise<AuthResponse> => {
  const response = await axiosInstance.get(API.USER.GET_PROFILE(id));
  return response.data;
};

export const updateUserById = async (
  id: string,
  formData: FormData,
): Promise<AuthResponse> => {
  const response = await axiosInstance.put(API.USER.GET_PROFILE(id), formData);
  return response.data;
};

export const deleteUserById = async (id: string): Promise<AuthResponse> => {
  const response = await axiosInstance.delete(API.USER.GET_PROFILE(id));
  return response.data;
};
