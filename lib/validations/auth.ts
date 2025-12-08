import { z } from "zod";

/**
 * Login validation schema
 * Matches backend validation rules
 */
export const loginSchema = z.object({
  email: z.email("Email phải hợp lệ").min(1, "Email là bắt buộc"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt",
    ),
});

/**
 * Register validation schema
 * Matches backend validation rules
 */
export const registerSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email phải hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt",
    ),
  fullName: z
    .string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),
  address: z
    .string()
    .max(500, "Địa chỉ không được vượt quá 500 ký tự")
    .optional(),
  birthDate: z
    .string()
    .refine(
      (date) => {
        if (!date) return true;
        const birthDate = new Date(date);
        return birthDate < new Date();
      },
      { message: "Ngày sinh phải là ngày trong quá khứ" },
    )
    .optional(),
  recaptchaToken: z.string().min(1, "Vui lòng xác thực reCAPTCHA"),
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mật khẩu hiện tại là bắt buộc"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(100, "Mật khẩu không được vượt quá 100 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt",
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

/**
 * Update profile validation schema
 */
export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),
  email: z.string().min(1, "Email là bắt buộc").email("Email phải hợp lệ"),
  address: z
    .string()
    .max(500, "Địa chỉ không được vượt quá 500 ký tự")
    .optional(),
  birthDate: z
    .string()
    .refine(
      (date) => {
        if (!date) return true;
        const birthDate = new Date(date);
        return birthDate < new Date();
      },
      { message: "Ngày sinh phải là ngày trong quá khứ" },
    )
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
