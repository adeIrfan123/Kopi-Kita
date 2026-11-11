import { Search } from "lucide-react";
import React from "react";

export default function SearchBar({ onChange }) {
  return (
    <div className="flex gap-2 items-center bg-[#181210] rounded-2xl pl-4 drop-shadow-sm drop-shadow-orange2/30 border border-transparent focus-within:border-orange2 transition">
      <span className="pointer-events-none text-graye2">
        <Search size={18} />
      </span>
      <input
        type="text"
        placeholder="Search coffee, pastries, or flavor..."
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#181210] text-sm text-[#F3EFEA] placeholder-[#8A7B73] rounded-2xl pl-4 pr-4 py-3.5 border-none outline-0"
      />
    </div>
  );
}
