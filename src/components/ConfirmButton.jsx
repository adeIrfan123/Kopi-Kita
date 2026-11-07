import React from "react";

function ConfirmButton({
  label1,
  label2,
  labelColor1,
  bgColor1,
  labelColor2,
  bgColor2,
  onCancel,
  onSubmit,
  isLoading,
}) {
  return (
    <div>
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={`${bgColor1} cursor-pointer px-3 py-2 rounded-lg ${labelColor1} font-bold disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {label1}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={`${bgColor2} cursor-pointer px-3 py-2 rounded-lg ${labelColor2} font-bold disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Menyimpan..." : label2}
        </button>
      </div>
    </div>
  );
}

export default ConfirmButton;
