"use server";
import { getAuthToken, getUserData } from "@/lib/cookie";

export const getAuthSession = async () => {
  const token = await getAuthToken();
  const userData = await getUserData();
  return { token, userData };
};
