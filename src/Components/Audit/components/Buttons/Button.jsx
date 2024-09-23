import React from "react";
import styles from "./style.module.scss";

export const Button = ({
  description,
  disabled,
  variant = "default",
  draggable = false,
  onClick,
  onDragStart,
  size = "small",
  id,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      onDragStart={(event) => onDragStart(event, id)}
      disabled={disabled}
      style={{
        ...(disabled && { cursor: "not-allowed" }),
      }}
      draggable={draggable}
      className={`${styles[size]} ${styles[variant]} ${
        disabled && styles.disabled
      } ${className}`}
    >
      {description}
    </button>
  );
};

export default Button;
