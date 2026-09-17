import React from "react";
import  "../css/ResetButton.css";

const ResetButton = ({ onClick, children , style, className = ""}) => {
  return (
    <button
      className={`resetButton ${className}`}
      onClick={onClick}
      style={style}
    >
      <span className="resetButtonText">{children}</span>
    </button>
  );
};

export default ResetButton;
