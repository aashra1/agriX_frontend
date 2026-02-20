import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  stock: number;
  image?: string;
  category: {
    _id: string;
    name: string;
  };
  business: {
    _id: string;
    businessName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  discount?: number;
  stock: number;
  category: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  discount?: number;
  stock?: number;
  category?: string;
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  product?: Product;
  products?: Product[];
  count?: number;
  data?: Product | Product[];
}

export const getAllProducts = async (): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.get(API.PRODUCT.GET_ALL);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch products",
    };
  }
};

export const getProductById = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.get(API.PRODUCT.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch product",
    };
  }
};

export const getProductsByCategory = async (
  categoryId: string,
): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.get(
      API.PRODUCT.GET_BY_CATEGORY(categoryId),
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products by category:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch products",
    };
  }
};

export const getBusinessProducts = async (): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.get(API.PRODUCT.GET_BUSINESS);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching business products:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch business products",
    };
  }
};

export const createProduct = async (
  formData: FormData,
): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.post(API.PRODUCT.CREATE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to create product",
    };
  }
};

export const updateProduct = async (
  id: string,
  formData: FormData,
): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.put(API.PRODUCT.UPDATE(id), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to update product",
    };
  }
};

export const deleteProduct = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.delete(API.PRODUCT.DELETE(id));
    return response.data;
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete product",
    };
  }
};
