import React from "react";

function ConfirmButton({
  label1,
  label2,
  labelColor1,
  bgColor1,
  labelColor2,
  bgColor2,
  onCancel,
  isLoading,
}) {
  return (
    <div>
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className={`${bgColor1} cursor-pointer px-3 py-2 rounded-lg ${labelColor1} font-bold`}
        >
          {label1}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`${bgColor2} cursor-pointer px-3 py-2 rounded-lg ${labelColor2} font-bold`}
        >
          {isLoading ? "Menyimpan..." : label2}
        </button>
      </div>
    </div>
  );
}

export default ConfirmButton;
