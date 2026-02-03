"use server";

import { loginUser, registerUser } from "../api/auth";
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
