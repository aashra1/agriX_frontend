import axiosInstance from "./axios";
import { API } from "./endpoints";

export const registerBusiness = async (registerData: FormData) => {
  try {
    const response = await axiosInstance.post(
      API.BUSINESS.REGISTER,
      registerData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const loginBusiness = async (loginData: any) => {
  try {
    const response = await axiosInstance.post(API.BUSINESS.LOGIN, loginData);
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const uploadBusinessDocument = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      API.BUSINESS.UPLOAD_DOC,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const getBusinessProfile = async () => {
  try {
    const response = await axiosInstance.get(API.BUSINESS.GET_PROFILE);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateBusinessProfile = async (formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      API.BUSINESS.UPDATE_PROFILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAllBusinesses = async () => {
  try {
    const response = await axiosInstance.get(API.BUSINESS.GET_ALL);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const approveBusiness = async (businessId: string) => {
  try {
    const response = await axiosInstance.put(API.BUSINESS.APPROVE(businessId));
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
