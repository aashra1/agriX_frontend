"use server";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getBusinessProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
} from "../api/products";

export interface ProductActionResult {
  success: boolean;
  message?: string;
  product?: any;
  products?: any[];
}

export const handleGetAllProducts = async (): Promise<ProductActionResult> => {
  try {
    const result = await getAllProducts();
    return {
      success: result.success,
      message: result.message,
      products:
        result.products || (Array.isArray(result.data) ? result.data : []),
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch products",
      products: [],
    };
  }
};

export const handleGetProductById = async (
  id: string,
): Promise<ProductActionResult> => {
  try {
    const result = await getProductById(id);
    return {
      success: result.success,
      message: result.message,
      product: result.product || result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch product",
    };
  }
};

export const handleGetProductsByCategory = async (
  categoryId: string,
): Promise<ProductActionResult> => {
  try {
    const result = await getProductsByCategory(categoryId);
    return {
      success: result.success,
      message: result.message,
      products:
        result.products || (Array.isArray(result.data) ? result.data : []),
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to fetch products",
      products: [],
    };
  }
};

export const handleGetBusinessProducts =
  async (): Promise<ProductActionResult> => {
    try {
      const result = await getBusinessProducts();
      return {
        success: result.success,
        message: result.message,
        products:
          result.products || (Array.isArray(result.data) ? result.data : []),
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Failed to fetch business products",
        products: [],
      };
    }
  };

export const handleCreateProduct = async (
  formData: FormData,
): Promise<ProductActionResult> => {
  try {
    const result = await createProduct(formData);
    return {
      success: result.success,
      message: result.message,
      product: result.product || result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to create product",
    };
  }
};

export const handleUpdateProduct = async (
  id: string,
  formData: FormData,
): Promise<ProductActionResult> => {
  try {
    const result = await updateProduct(id, formData);
    return {
      success: result.success,
      message: result.message,
      product: result.product || result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to update product",
    };
  }
};

export const handleDeleteProduct = async (
  id: string,
): Promise<ProductActionResult> => {
  try {
    const result = await deleteProduct(id);
    return {
      success: result.success,
      message: result.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to delete product",
    };
  }
};
