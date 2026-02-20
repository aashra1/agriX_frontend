import { z } from "zod";

export const BusinessRegisterSchema = z.object({
  businessName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number must be 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  address: z.string().optional(),
  profilePicture: z.any().optional(),
});

export type BusinessRegisterFields = z.infer<typeof BusinessRegisterSchema>;
