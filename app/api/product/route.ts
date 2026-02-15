import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import { getAuthToken } from "@/lib/cookie";

export const addProduct = async (formData: FormData) => {
  try {
    const token = await getAuthToken();
    const response = await axiosInstance.post(API.PRODUCT.ADD, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const getBusinessProducts = async () => {
  try {
    const token = await getAuthToken();

    const response = await axiosInstance.get(API.PRODUCT.GET_BUSINESS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.PRODUCT.GET_BY_ID(id));
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const updateProduct = async (id: string, formData: FormData) => {
  try {
    const token = await getAuthToken();
    const response = await axiosInstance.put(API.PRODUCT.UPDATE(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const token = await getAuthToken();
    const response = await axiosInstance.delete(API.PRODUCT.DELETE(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    throw err;
  }
};
