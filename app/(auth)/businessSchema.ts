import { z } from "zod";

export const BusinessRegisterSchema = z
  .object({
    businessName: z.string().min(2, "Full Name is required"),
    username: z.string().min(3, "Username is required"),
    email: z.string().email("Invalid email format"),
    phoneNumber: z.string().min(10, "Phone number must be 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password is required"),
    location: z.string().optional(),
  })
  .refine((data) => data.password.trim() === data.confirmPassword.trim(), {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type BusinessRegisterFields = z.infer<typeof BusinessRegisterSchema>;
