"use client";

import { logout } from "@/lib/api/services/auth";
import {
  ChangePasswordFormData,
  changePasswordSchema,
  UpdateProfileFormData,
  updateProfileSchema,
} from "@/lib/validations/auth";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiAward,
  FiBox,
  FiClock,
  FiDollarSign,
  FiHeart,
  FiLock,
  FiLogOut,
  FiPackage,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";

type TabType =
  | "info"
  | "change-password"
  | "watchlist"
  | "bidding"
  | "won"
  | "selling"
  | "sold";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [activeTab, setActiveTab] = useState<TabType>("info");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/dang-nhap");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      clearAuth();
      router.push("/");
    }
  };

  const tabs = [
    { id: "info", label: "Thông tin cá nhân", icon: FiUser },
    { id: "change-password", label: "Đổi mật khẩu", icon: FiLock },
    ...(user?.role === "BIDDER" || user?.role === "SELLER"
      ? [
          { id: "watchlist", label: "Yêu thích", icon: FiHeart },
          { id: "bidding", label: "Đang đấu giá", icon: FiClock },
          { id: "won", label: "Đã thắng", icon: FiAward },
        ]
      : []),
    ...(user?.role === "SELLER"
      ? [
          { id: "selling", label: "Đang bán", icon: FiPackage },
          { id: "sold", label: "Đã bán", icon: FiBox },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Tài khoản</h1>
          <p className="mt-2 text-gray-600">
            Quản lý thông tin cá nhân và hoạt động của bạn
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              {/* User Profile */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl font-bold text-white">
                  {user?.fullName.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.fullName}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
                <div className="mt-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      user?.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : user?.role === "SELLER"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user?.role === "ADMIN"
                      ? "Quản trị viên"
                      : user?.role === "SELLER"
                        ? "Người bán"
                        : "Người mua"}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                {user?.role === "BIDDER" && (
                  <Link
                    href="/xin-ban-hang"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-black px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white"
                  >
                    <FiTrendingUp className="h-5 w-5" />
                    <span>Xin bán hàng</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span>Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              {activeTab === "info" && <ProfileInfoSection />}
              {activeTab === "change-password" && <ChangePasswordSection />}
              {activeTab === "watchlist" && <WatchlistSection />}
              {activeTab === "bidding" && <BiddingSection />}
              {activeTab === "won" && <WonSection />}
              {activeTab === "selling" && <SellingSection />}
              {activeTab === "sold" && <SoldSection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Info Section
function ProfileInfoSection() {
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      address: "",
      birthDate: "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    // TODO: Call API to update profile
    console.log("Update profile:", data);
    alert("Chức năng đang được phát triển");
    setIsEditing(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Họ tên
            </label>
            <input
              type="text"
              {...register("fullName", { required: "Họ tên là bắt buộc" })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email là bắt buộc" })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Địa chỉ
            </label>
            <input
              type="text"
              {...register("address")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Ngày sinh
            </label>
            <input
              type="date"
              {...register("birthDate")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:border-black"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Họ tên</p>
              <p className="mt-1 text-lg text-gray-900">{user?.fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Trạng thái email
              </p>
              <p className="mt-1 text-lg">
                {user?.emailVerified ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-green-600">
                    ✓ Đã xác thực
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-red-600">
                    ✗ Chưa xác thực
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Điểm đánh giá</p>
              <p className="mt-1 text-lg text-gray-900">Chưa có dữ liệu</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Change Password Section
function ChangePasswordSection() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    // TODO: Call API to change password
    console.log("Change password:", data);
    alert("Chức năng đang được phát triển");
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            {...register("currentPassword", {
              required: "Mật khẩu hiện tại là bắt buộc",
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Mật khẩu mới
          </label>
          <input
            type="password"
            {...register("newPassword", {
              required: "Mật khẩu mới là bắt buộc",
              minLength: {
                value: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự",
              },
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Vui lòng xác nhận mật khẩu",
              validate: (value) =>
                value === watch("newPassword") || "Mật khẩu không khớp",
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

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

// Empty state component
function EmptyState({ icon: Icon, title, description }: any) {
  return (
    <div className="py-12 text-center">
      <Icon className="mx-auto h-16 w-16 text-gray-300" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
      <div className="mt-6">
        <span className="text-sm text-gray-400">
          Chức năng đang được phát triển
        </span>
      </div>
    </div>
  );
}

function WatchlistSection() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Danh sách yêu thích
      </h2>
      <EmptyState
        icon={FiHeart}
        title="Chưa có sản phẩm yêu thích"
        description="Các sản phẩm bạn đã lưu sẽ xuất hiện ở đây"
      />
    </div>
  );
}

function BiddingSection() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Đang tham gia đấu giá
      </h2>
      <EmptyState
        icon={FiClock}
        title="Chưa có phiên đấu giá nào"
        description="Các sản phẩm bạn đang tham gia đấu giá sẽ xuất hiện ở đây"
      />
    </div>
  );
}

function WonSection() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Đã thắng đấu giá
      </h2>
      <EmptyState
        icon={FiAward}
        title="Chưa thắng phiên đấu giá nào"
        description="Các sản phẩm bạn đã thắng sẽ xuất hiện ở đây"
      />
    </div>
  );
}

function SellingSection() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Đang bán</h2>
      <EmptyState
        icon={FiPackage}
        title="Chưa có sản phẩm đang bán"
        description="Các sản phẩm bạn đang đăng bán sẽ xuất hiện ở đây"
      />
    </div>
  );
}

function SoldSection() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Đã bán</h2>
      <EmptyState
        icon={FiDollarSign}
        title="Chưa có sản phẩm đã bán"
        description="Các sản phẩm đã có người thắng đấu giá sẽ xuất hiện ở đây"
      />
    </div>
  );
}
