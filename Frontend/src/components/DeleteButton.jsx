import React from "react";
import  "../css/DeleteButton.css";

const DeleteButton = ({ onClick, children , style, className = "", disabled }) => {
  return (
    <button
      className={`deleteButton ${className}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      <span className="deleteButtonText">{children}</span>
    </button>
  );
};

export default DeleteButton;
