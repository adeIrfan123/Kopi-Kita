import Link from "next/link";
import React from "react";

function ButtonAdd({ href, label }) {
  return (
    <div>
      <Link
        href={href}
        className="bg-orange2 px-3 py-2 rounded-lg text-[#181310] font-bold"
      >
        {label}
      </Link>
    </div>
  );
}

export default ButtonAdd;
