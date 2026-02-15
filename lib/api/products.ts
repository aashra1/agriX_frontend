import axiosInstance from "./axios";
import { API } from "./endpoints";

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get(API.PRODUCT.ADD);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.PRODUCT.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getProductsByCategory = async (categoryId: string) => {
  try {
    const response = await axiosInstance.get(
      API.PRODUCT.GET_BY_CATEGORY(categoryId),
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getBusinessProducts = async () => {
  try {
    const response = await axiosInstance.get(API.PRODUCT.GET_BUSINESS);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createProduct = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(API.PRODUCT.ADD, formData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateProduct = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(API.PRODUCT.UPDATE(id), formData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(API.PRODUCT.DELETE(id));
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
