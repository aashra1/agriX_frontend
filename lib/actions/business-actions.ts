"use server";

import axiosInstance from "../api/axios";
import {
  loginBusiness,
  registerBusiness,
  uploadBusinessDocument,
} from "../api/business";
import { setUserData, setAuthToken, getAuthToken } from "../cookie";

export const handleBusinessRegister = async (formData: any) => {
  try {
    const result = await registerBusiness(formData);

    if (result.success) {
      // Business registration returns a tempToken for document upload
      return {
        success: true,
        message: result.message || "Registration Successful",
        tempToken: result.tempToken,
        business: result.business,
      };
    }

    return {
      success: false,
      message: result.message || "Registration Failed",
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Registration Failed",
    };
  }
};

export const handleBusinessLogin = async (formData: any) => {
  try {
    const result = await loginBusiness(formData);

    if (result.success) {
      // Check status before setting cookies
      if (result.business.businessStatus !== "Approved") {
        return {
          success: false,
          message:
            "Your business is not verified yet. Please wait for admin approval.",
        };
      }

      await setAuthToken(result.token);
      await setUserData(result.business);

      return { success: true, business: result.business };
    }
    return { success: false, message: "Login Failed" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Login Failed",
    };
  }
};

export const handleUploadDocument = async (
  formData: FormData,
  token: string,
) => {
  try {
    const result = await uploadBusinessDocument(formData, token);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Upload Successful",
        document: result.document,
      };
    }

    return {
      success: false,
      message: result.message || "Upload Failed",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message || "Upload Failed",
    };
  }
};
