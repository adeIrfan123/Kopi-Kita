import React from "react";

export default function Input({ label, placeholder, value, onChange, type = "text", disabled = false }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="" className="text-white">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="bg-[#1D1D1D] border border-graye2 w-40 pl-4 h-8 rounded-sm outline-none focus:border-orange2 placeholder:italic placeholder:text-graye2 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
