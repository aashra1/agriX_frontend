import axiosInstance from "./axios";
import { API } from "./endpoints";

export const registerBusiness = async (registerData: any) => {
  try {
    const response = await axiosInstance.post(
      API.BUSINESS.REGISTER,
      registerData,
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

export const uploadBusinessDocument = async (
  formData: FormData,
  token: string,
) => {
  try {
    const response = await axiosInstance.post(
      API.BUSINESS.UPLOAD_DOC,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (err: any) {
    throw err;
  }
};
