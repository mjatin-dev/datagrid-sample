import React, { useEffect, useRef } from "react";
import styles from "./style.module.scss";
const AutoGrowInput = ({
  variant = "auditAssignmentInput",
  labelText,
  labelVariant,
  required = false,
  autoFocus = false,
  inputClassName = "",
  ...rest
}) => {
  const textRef = useRef();
  const calculateHeight = (e) => {
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
  };
  useEffect(() => {
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, [rest.value]);
  return (
    <>
      {labelText && (
        <div className={styles.labelContainer}>
          <label
            className={`${styles[labelVariant]} ${required && styles.required}`}
          >
            {labelText}
          </label>
        </div>
      )}
      <textarea
        autoFocus={autoFocus}
        ref={textRef}
        {...rest}
        className={`${styles[variant]} ${styles.autoGrowInput} ${inputClassName || ""
          }`}
        onFocus={calculateHeight}
      ></textarea>
    </>
  );
};

export default AutoGrowInput;
