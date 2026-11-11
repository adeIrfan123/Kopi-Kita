import React from "react";
import UserLayout from "./UserLayout";
import { Coffee } from "lucide-react";

export default function NotFoundPage() {
  return (
    <UserLayout>
      <div className="w-full h-screen flex flex-col items-center justify-center scrollbar-none gap-2 overflow-hidden">
        <Coffee size={100} className="text-orange2" />
        <p className="font-bold text-lg">Sorry Not Found Page</p>
      </div>
    </UserLayout>
  );
}
