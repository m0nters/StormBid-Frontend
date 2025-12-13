"use client";

import { FavoriteProductResponse } from "@/types/profile";
import { calculateCountdown, formatPrice } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiClock, FiDollarSign } from "react-icons/fi";

interface FavoriteProductCardProps {
  product: FavoriteProductResponse;
}

export function FavoriteProductCard({ product }: FavoriteProductCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const { timeLeft, isUrgent } = calculateCountdown(product.endTime);
      setTimeLeft(timeLeft);
      setIsUrgent(isUrgent);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [product.endTime]);

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg">
      <Link href={`/san-pham/${product.slug}`} className="relative block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.isEnded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
                ĐÃ KẾT THÚC
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-black">
            {product.title}
          </h3>

          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Giá hiện tại</p>
              <p className="text-lg font-bold text-black">
                {formatPrice(product.currentPrice)}
              </p>
            </div>
            {product.buyNowPrice && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Mua ngay</p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatPrice(product.buyNowPrice)}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <FiDollarSign className="h-3.5 w-3.5" />
              <span>{product.bidCount} lượt đấu giá</span>
            </div>
            {!product.isEnded && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  isUrgent ? "font-semibold text-red-600" : "text-gray-600"
                }`}
              >
                <FiClock className="h-3.5 w-3.5" />
                <span>{timeLeft}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
