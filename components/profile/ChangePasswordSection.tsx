"use client";

import PasswordInput from "@/components/ui/PasswordInput";
import { changePassword } from "@/lib/api/services/profile";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/lib/validations/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export function ChangePasswordSection() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data);
      toast.success("Đổi mật khẩu thành công!");
      reset();
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi đổi mật khẩu");
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <PasswordInput
          label="Mật khẩu hiện tại"
          {...register("oldPassword")}
          error={errors.oldPassword?.message}
        />

        <PasswordInput
          label="Mật khẩu mới"
          {...register("newPassword")}
          error={errors.newPassword?.message}
          helperText="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
