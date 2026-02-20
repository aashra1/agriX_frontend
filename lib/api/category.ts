// lib/api/category.ts
import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  message?: string;
  data?: Category | Category[];
  categories?: Category[];
}

export const getAllCategories = async (): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.get(API.CATEGORY.GET_ALL);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryById = async (
  id: string,
): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.get(API.CATEGORY.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const createCategory = async (
  categoryData: Partial<Category>,
): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.post(
      API.CATEGORY.CREATE,
      categoryData,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  categoryData: Partial<Category>,
): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.put(
      API.CATEGORY.UPDATE(id),
      categoryData,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.delete(API.CATEGORY.DELETE(id));
    return response.data;
  } catch (error: any) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
