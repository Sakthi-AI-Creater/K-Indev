import React from "react";
import  "../css/CommonButton.css";

const CommonButton = ({ onClick, children, style, className = "" }) => {
  return (
    <button
      className={`commonButton ${className}`}
      onClick={onClick}
      style={style}
    >
      <span className="commonButtonText">{children}</span>
    </button>
  );
};

export default CommonButton;
