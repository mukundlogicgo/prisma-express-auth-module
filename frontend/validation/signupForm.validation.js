import z from "zod";

export const signupFormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, { message: "Name must be 3 or more characters long" })
    .max(50, { message: "Name must be 50 or fewer characters long" }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, { message: "Password must be 8 or more characters long" })
    .max(255, { message: "Password must be 255 or fewer characters long" }),
  profilePicture: z
    .string({
      required_error: "Profile picture is required",
      invalid_type_error: "Profile picture must be a string",
    })
    .url({
      message: "Profile picture url is invalid",
    })
    .optional(),
});

export const loginFormSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, { message: "Password must be 8 or more characters long" })
    .max(255, { message: "Password must be 255 or fewer characters long" }),
  profilePicture: z
    .string({
      required_error: "Profile picture is required",
      invalid_type_error: "Profile picture must be a string",
    })
    .url({
      message: "Profile picture url is invalid",
    })
    .optional(),
});
