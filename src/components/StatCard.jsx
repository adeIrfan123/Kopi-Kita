import React from "react";

function StatCard({ label, value, status }) {
  return (
    <div className="bg-[#181310] border border-[#251C18] w-fit p-4 rounded-2xl">
      <p className="text-[#7C706B]">{label}</p>
      <div className="flex justify-between gap-3 items-end my-1">
        <p className="text-white text-2xl font-bold">{value}</p>
        <p className="text-[#D97706] text-sm font-bold">{status}</p>
      </div>
    </div>
  );
}

export default StatCard;
