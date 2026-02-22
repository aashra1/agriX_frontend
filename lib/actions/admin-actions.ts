"use server";

import {
  getAllUsers,
  getAllBusinesses,
  approveBusiness,
  rejectBusiness,
  AdminResponse,
} from "../api/admin";

export interface AdminActionResult {
  success: boolean;
  message?: string;
  users?: any[];
  businesses?: any[];
  data?: any;
}

export const handleGetAllUsers = async (): Promise<AdminActionResult> => {
  try {
    const result = await getAllUsers();
    if (result.success) {
      return {
        success: true,
        message: result.message || "Users fetched successfully",
        users: result.users || (Array.isArray(result.data) ? result.data : []),
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch users",
      users: [],
    };
  } catch (err: any) {
    console.error("Error in handleGetAllUsers:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Failed to fetch users",
      users: [],
    };
  }
};

export const handleGetAllBusinesses = async (): Promise<AdminActionResult> => {
  try {
    const result = await getAllBusinesses();
    if (result.success) {
      return {
        success: true,
        message: result.message || "Businesses fetched successfully",
        businesses:
          result.businesses || (Array.isArray(result.data) ? result.data : []),
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch businesses",
      businesses: [],
    };
  } catch (err: any) {
    console.error("Error in handleGetAllBusinesses:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch businesses",
      businesses: [],
    };
  }
};

export const handleApproveBusiness = async (
  id: string,
): Promise<AdminActionResult> => {
  try {
    const result = await approveBusiness(id, "Approved");
    if (result.success) {
      return {
        success: true,
        message: result.message || "Business approved successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to approve business",
    };
  } catch (err: any) {
    console.error("Error in handleApproveBusiness:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to approve business",
    };
  }
};

export const handleRejectBusiness = async (
  id: string,
  reason?: string,
): Promise<AdminActionResult> => {
  try {
    const result = await rejectBusiness(id, reason);
    if (result.success) {
      return {
        success: true,
        message: result.message || "Business rejected successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to reject business",
    };
  } catch (err: any) {
    console.error("Error in handleRejectBusiness:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to reject business",
    };
  }
};
