"use server";
import { cookies } from "next/headers";

export const setAuthToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
};

export const getAuthToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return token || null;
};

export const setTempToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "temp_token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600, 
  });
};

export const getTempToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("temp_token")?.value;
  return token || null;
};

export const clearTempToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("temp_token");
};

export const setUserData = async (userData: any) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "user_data",
    value: JSON.stringify(userData),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
};

export const getUserData = async () => {
  const cookieStore = await cookies();
  const userData = cookieStore.get("user_data")?.value;
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const clearAuthCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_data");
  cookieStore.delete("temp_token");
};
