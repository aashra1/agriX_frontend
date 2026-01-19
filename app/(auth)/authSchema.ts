import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(3, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginFields = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number must be 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  address: z.string().optional(),
});

export type RegisterFields = z.infer<typeof RegisterSchema>;
