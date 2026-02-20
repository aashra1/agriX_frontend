// lib/api/admin.ts
import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
  isAdmin?: boolean;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  _id: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  businessDocument?: string;
  businessVerified: boolean;
  businessStatus: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  updatedAt: string;
}

export interface AdminResponse {
  success: boolean;
  message?: string;
  users?: User[];
  businesses?: Business[];
  data?: any;
}

export const getAllUsers = async (): Promise<AdminResponse> => {
  try {
    const response = await axiosInstance.get(API.ADMIN.GET_ALL_USERS);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getAllBusinesses = async (): Promise<AdminResponse> => {
  try {
    const response = await axiosInstance.get(API.ADMIN.GET_ALL_BUSINESSES);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching businesses:", error);
    throw error;
  }
};

export const approveBusiness = async (
  id: string,
  status: string,
): Promise<AdminResponse> => {
  try {
    const response = await axiosInstance.put(API.ADMIN.APPROVE_BUSINESS(id), {
      businessStatus: status,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error approving business:", error);
    throw error;
  }
};

export const rejectBusiness = async (
  id: string,
  reason?: string,
): Promise<AdminResponse> => {
  try {
    const response = await axiosInstance.put(API.ADMIN.REJECT_BUSINESS(id), {
      businessStatus: "Rejected",
      reason,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error rejecting business:", error);
    throw error;
  }
};
