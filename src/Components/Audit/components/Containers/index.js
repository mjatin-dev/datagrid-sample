import React from "react";
import styles from "./styles.module.scss";
const Container = ({
  children,
  variant = "main" || "container" || "content" || "contentWithoutOverflow",
  className,
}) => {
  return (
    <div className={`${styles[variant]} ${className || ""}`}>{children}</div>
  );
};

export default Container;
