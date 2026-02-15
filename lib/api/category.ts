import axiosInstance from "./axios";
import { API } from "./endpoints";

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get(API.CATEGORY.GET_ALL);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.CATEGORY.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createCategory = async (categoryData: any) => {
  try {
    const response = await axiosInstance.post(
      API.CATEGORY.GET_ALL,
      categoryData,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateCategory = async (id: string, categoryData: any) => {
  try {
    const response = await axiosInstance.put(
      API.CATEGORY.GET_BY_ID(id),
      categoryData,
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await axiosInstance.delete(API.CATEGORY.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
