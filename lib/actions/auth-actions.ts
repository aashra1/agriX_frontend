"use server";

import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../api/auth";
import { setUserData, setAuthToken } from "../cookie";

export const handleRegister = async (formData: any) => {
  try {
    const result = await registerUser(formData);

    if (result.success) {
      return {
        success: true,
        message: "Registration Successful",
        data: result.user,
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

export const handleLogin = async (formData: any) => {
  try {
    const result = await loginUser(formData);

    if (result.success) {
      await setAuthToken(result.token);
      await setUserData(result.user);

      return {
        success: true,
        message: "Login Successful",
        token: result.token,
        user: result.user,
      };
    }

    return { success: false, message: result.message || "Login Failed" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message || "Login Failed",
    };
  }
};

export const handleRequestPasswordReset = async (email: string) => {
  try {
    const response = await requestPasswordReset(email);
    if (response.success) {
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Request password reset failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Request password reset action failed",
    };
  }
};

export const handleResetPassword = async (
  token: string,
  newPassword: string,
) => {
  try {
    const response = await resetPassword(token, newPassword);
    if (response.success) {
      return {
        success: true,
        message: "Password has been reset successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Reset password failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Reset password action failed",
    };
  }
};
