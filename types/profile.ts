export interface UserProfileResponse {
  id: number;
  email: string;
  fullName: string;
  address?: string;
  birthDate?: string; // ISO date string (LocalDate)
  role: "BIDDER" | "SELLER" | "ADMIN";
  positiveRating: number;
  negativeRating: number;
  ratingPercentage: number;
  totalRatings: number;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string; // ISO datetime string (ZonedDateTime)
}

export interface UpdateProfileRequest {
  email: string;
  fullName: string;
  address: string;
  birthDate: string; // ISO date string (LocalDate)
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface FavoriteProductResponse {
  productId: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  currentPrice: number;
  buyNowPrice?: number;
  bidCount: number;
  endTime: string; // ISO datetime string (ZonedDateTime)
  isEnded: boolean;
  favoritedAt: string; // ISO datetime string (ZonedDateTime)
}
