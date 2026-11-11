import { Bell, MapPin } from "lucide-react";
import React from "react";

export default function HeaderLocation() {
  return (
    <div className="pt-6 px-6 pb-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-20 border-b border-[#1F1714] rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#261E1A] border border-[#3A2D26] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs text-[#A39995] font-medium">Location</p>
          <div className="flex items-center gap-1 text-sm font-semibold text-[#F3EFEA]">
            <MapPin size={14} className="text-[#D97706]" />
            <span>Senopati, Jakarta</span>
          </div>
        </div>
      </div>

      <button className="w-10 h-10 rounded-full bg-[#1C1613] border border-[#2D231E] flex items-center justify-center text-[#F3EFEA] hover:bg-[#261E1A] transition relative">
        <Bell size={18} />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#D97706] rounded-full ring-2 ring-[#120E0C]"></span>
      </button>
    </div>
  );
}
