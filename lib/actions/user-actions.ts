"use server";

import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  getMyProfile,
  updateMyProfile,
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsers,
  changePassword,
  LoginData,
  ChangePasswordData,
  AuthResponse,
} from "../api/auth";
import { setUserData, setAuthToken } from "../cookie";

export interface UserActionResult {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
  users?: any[];
  data?: any;
}

export const handleRegister = async (
  formData: FormData,
): Promise<UserActionResult> => {
  try {
    const result = await registerUser(formData);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Registration Successful",
        user: result.user || result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Registration Failed",
    };
  } catch (err: any) {
    console.error("Error in handleRegister:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Registration Failed",
    };
  }
};

export const handleLogin = async (
  formData: LoginData,
): Promise<UserActionResult> => {
  try {
    const result = await loginUser(formData);

    if (result.success && result.token && result.user) {
      await setAuthToken(result.token);
      await setUserData(result.user);

      return {
        success: true,
        message: result.message || "Login Successful",
        token: result.token,
        user: result.user,
      };
    }

    return {
      success: false,
      message: result.message || "Login Failed",
    };
  } catch (err: any) {
    console.error("Error in handleLogin:", err);
    return {
      success: false,
      message: err?.response?.data?.message || err.message || "Login Failed",
    };
  }
};

export const handleRequestPasswordReset = async (
  email: string,
): Promise<UserActionResult> => {
  try {
    const response = await requestPasswordReset(email);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Password reset email sent successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Request password reset failed",
    };
  } catch (err: any) {
    console.error("Error in handleRequestPasswordReset:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Request password reset failed",
    };
  }
};

export const handleResetPassword = async (
  token: string,
  newPassword: string,
): Promise<UserActionResult> => {
  try {
    const response = await resetPassword(token, newPassword);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Password has been reset successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Reset password failed",
    };
  } catch (err: any) {
    console.error("Error in handleResetPassword:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Reset password failed",
    };
  }
};

export const handleGetMyProfile = async (): Promise<UserActionResult> => {
  try {
    const result = await getMyProfile();

    if (result.success) {
      return {
        success: true,
        message: result.message || "Profile fetched successfully",
        user: result.user || result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch profile",
    };
  } catch (err: any) {
    console.error("Error in handleGetMyProfile:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch profile",
    };
  }
};

export const handleUpdateMyProfile = async (
  formData: FormData,
): Promise<UserActionResult> => {
  try {
    const result = await updateMyProfile(formData);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Profile updated successfully",
        user: result.user || result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update profile",
    };
  } catch (err: any) {
    console.error("Error in handleUpdateMyProfile:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to update profile",
    };
  }
};

export const handleGetUserById = async (
  id: string,
): Promise<UserActionResult> => {
  try {
    const result = await getUserById(id);

    if (result.success) {
      return {
        success: true,
        message: result.message || "User fetched successfully",
        user: result.user || result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch user",
    };
  } catch (err: any) {
    console.error("Error in handleGetUserById:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Failed to fetch user",
    };
  }
};

export const handleUpdateUserById = async (
  id: string,
  formData: FormData,
): Promise<UserActionResult> => {
  try {
    const result = await updateUserById(id, formData);

    if (result.success) {
      return {
        success: true,
        message: result.message || "User updated successfully",
        user: result.user || result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update user",
    };
  } catch (err: any) {
    console.error("Error in handleUpdateUserById:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Failed to update user",
    };
  }
};

export const handleDeleteUserById = async (
  id: string,
): Promise<UserActionResult> => {
  try {
    const result = await deleteUserById(id);

    if (result.success) {
      return {
        success: true,
        message: result.message || "User deleted successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to delete user",
    };
  } catch (err: any) {
    console.error("Error in handleDeleteUserById:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message || err.message || "Failed to delete user",
    };
  }
};

export const handleGetAllUsers = async (): Promise<UserActionResult> => {
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

export const handleChangePassword = async (
  passwordData: ChangePasswordData,
): Promise<UserActionResult> => {
  try {
    const result = await changePassword(passwordData);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Password changed successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to change password",
    };
  } catch (err: any) {
    console.error("Error in handleChangePassword:", err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err.message ||
        "Failed to change password",
    };
  }
};
