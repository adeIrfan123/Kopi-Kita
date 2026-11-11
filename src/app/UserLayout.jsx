import React from "react";
import BottomNavigation from "@/components/user/BottomNavigation";

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#171413] ">
      <main className="min-h-screen pb-20">{children}</main>
      <BottomNavigation />
    </div>
  );
}
