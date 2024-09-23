import React from "react";
import styles from "./style.module.scss";

const Label = ({ text, variant = "medium" ,required = false}) => {
  return <label className={`${styles[variant]} ${required&&styles.required}`}>{text}</label>;
};

export default Label;
