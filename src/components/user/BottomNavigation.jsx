"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Home, ScanQrCode, ShoppingBag, User } from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();

  const menu = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Menu", icon: Coffee, href: "/menu" },
    { label: "Orders", icon: ShoppingBag, href: "/cart" },
    { label: "Profile", icon: User, href: "/me" },
  ];

  return (
    <div className="mx-2 sticky bottom-0 h-20 rounded-2xl bg-[#15100E]/90 backdrop-blur-2xl border border-[#221814] px-6 flex items-center justify-between z-30">
      {menu.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition ${
              isActive
                ? "text-[#D97706]"
                : "text-[#8A7B73] hover:text-[#F3EFEA]"
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span
              className={`text-[10px] ${
                isActive ? "font-semibold" : "font-medium"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      <Link
        href="/payment"
        className="relative -top-5 w-14 h-14 rounded-full bg-gradient-to-tr from-[#D97706] to-amber-500 text-white flex items-center justify-center shadow-xl shadow-[#D97706]/40 hover:scale-105 transition"
      >
        <ScanQrCode size={22} />
      </Link>

      {menu.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition ${
              isActive
                ? "text-[#D97706]"
                : "text-[#8A7B73] hover:text-[#F3EFEA]"
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span
              className={`text-[10px] ${
                isActive ? "font-semibold" : "font-medium"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
