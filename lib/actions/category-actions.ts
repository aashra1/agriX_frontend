"use server";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
  CategoryResponse,
} from "../api/category";

export interface CategoryActionResult {
  success: boolean;
  message?: string;
  data?: Category;
  categories?: Category[];
}

export const handleGetAllCategories =
  async (): Promise<CategoryActionResult> => {
    try {
      const result = await getAllCategories();

      if (result.success) {
        let categoriesArray: Category[] = [];

        if (result.categories && Array.isArray(result.categories)) {
          categoriesArray = result.categories;
        } else if (result.data && Array.isArray(result.data)) {
          categoriesArray = result.data;
        }

        return {
          success: true,
          message: result.message || "Categories fetched successfully",
          categories: categoriesArray,
        };
      }

      return {
        success: false,
        message: result.message || "Failed to fetch categories",
        categories: [],
      };
    } catch (err: any) {
      console.error("Error in handleGetAllCategories:", err);
      return {
        success: false,
        message:
          err?.response?.data?.message ||
          err.message ||
          "Failed to fetch categories",
        categories: [],
      };
    }
  };


export const handleGetCategoryById = async (
  id: string,
): Promise<CategoryActionResult> => {
  try {
    const result = await getCategoryById(id);

    if (result.success) {
      const categoryData =
        (result.data && !Array.isArray(result.data) ? result.data : null) ||
        (result as any).category;

      if (!categoryData) {
        return {
          success: false,
          message: "Category data missing in server response",
        };
      }

      return {
        success: true,
        message: result.message || "Category fetched successfully",
        data: categoryData,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch category",
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch category",
    };
  }
};

export const handleCreateCategory = async (
  categoryData: Partial<Category>,
): Promise<CategoryActionResult> => {
  try {
    const result = await createCategory(categoryData);

    if (result.success) {
      let categoryData: Category | null = null;

      if (result.data && !Array.isArray(result.data)) {
        categoryData = result.data;
      }

      return {
        success: true,
        message: result.message || "Category created successfully",
        data: categoryData || undefined,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to create category",
    };
  } catch (err: any) {
    console.error("Error in handleCreateCategory:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to create category",
    };
  }
};

export const handleUpdateCategory = async (
  id: string,
  categoryData: Partial<Category>,
): Promise<CategoryActionResult> => {
  try {
    const result = await updateCategory(id, categoryData);

    if (result.success) {
      let categoryData: Category | null = null;

      if (result.data && !Array.isArray(result.data)) {
        categoryData = result.data;
      }

      return {
        success: true,
        message: result.message || "Category updated successfully",
        data: categoryData || undefined,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update category",
    };
  } catch (err: any) {
    console.error("Error in handleUpdateCategory:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to update category",
    };
  }
};

export const handleDeleteCategory = async (
  id: string,
): Promise<CategoryActionResult> => {
  try {
    const result = await deleteCategory(id);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Category deleted successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to delete category",
    };
  } catch (err: any) {
    console.error("Error in handleDeleteCategory:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to delete category",
    };
  }
};
