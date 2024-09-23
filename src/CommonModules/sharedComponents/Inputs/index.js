import React from "react";
import styles from "./style.module.scss";
import { DatePicker } from "antd";
import { MdClose, MdDownload, MdFileUpload } from "react-icons/md";
import { getSubstring } from "../../helpers/string.helpers";
import { onFileDownload } from "../../helpers/file.helper";
export const Input = ({
  variant = "default",
  labelVariant = "labelMedium",
  placeholder,
  labelText,
  size,
  type = "text",
  error,
  errorText,
  onChange,
  onBlur,
  name,
  max,
  min,
  pattern,
  className,
  valueForDropDown,
  disabled,
  selected,
  value,
  defaultValue,
  rows = "6",
  id,
  multiple,
  fileList,
  isLabel = true,
  onRemoveFile,
  maxFileChars = 6,
  uploadIcon = true,
  fileLabel = "Upload",
  FileLabelVariant = "uploadFileLabel",
  ...rest
}) => {
  return (
    <>
      {type === "select" ? (
        <>
          {labelText && (
            <div className={styles.labelContainer}>
              <label className={styles[labelVariant]}>{labelText}</label>
            </div>
          )}
          <div>
            <select
              value={value}
              onChange={onChange}
              className={`${styles[variant]} ${className} ${
                size ? styles[size] : ""
              }`}
              name={name}
              id={id}
              placeholder={placeholder}
              multiple={multiple || false}
              onBlur={onBlur}
            >
              <option selected disabled>
                {placeholder}
              </option>
              {valueForDropDown?.map((element, index) => {
                return (
                  <option
                    key={
                      element?.id ||
                      element?.value ||
                      element?.name ||
                      index ||
                      element
                    }
                    value={element?.value ? element?.value : element}
                  >
                    {element?.label || element?.name || element}
                  </option>
                );
              })}
            </select>
          </div>
        </>
      ) : type === "date" ? (
        <>
          <div className={styles.labelContainer}>
            <label className={styles[labelVariant]}>{labelText}</label>
          </div>
          <div>
            <DatePicker
              onChange={onChange}
              className={styles[variant]}
              value={value}
              placeholder="Select Date"
            />
          </div>
        </>
      ) : type === "textArea" ? (
        <>
          <div className={styles.labelContainer}>
            <label className={styles[labelVariant]}>{labelText}</label>
          </div>
          <div>
            <textarea
              onChange={onChange}
              type={type}
              placeholder={placeholder}
              name={name}
              disabled={disabled}
              max={max}
              min={min}
              rows={rows}
              pattern={pattern}
              className={styles[variant]}
              value={value}
              onBlur={onBlur}
            />
          </div>
        </>
      ) : type === "file" ? (
        <>
          {labelText && (
            <div className={styles.labelContainer}>
              <label className={styles[labelVariant]}>{labelText}</label>
            </div>
          )}

          <div className={styles.labelContainer}>
            <label
              className={`${styles[FileLabelVariant]} ${
                styles[size || ""]
              } ${className} ${styles[variant]} `}
              htmlFor={`${id},${name}`}
            >
              {uploadIcon && <MdFileUpload className={styles.uploadIcon} />}
              &nbsp;{fileLabel}
            </label>
          </div>

          <input
            onChange={onChange}
            type="file"
            placeholder={placeholder}
            name={name}
            disabled={disabled}
            className={`${styles[variant]} ${styles[size || ""]} ${className}`}
            value={value}
            id={`${id},${name}`}
            onBlur={onBlur}
            multiple={multiple || false}
          />
          {fileList?.length > 0 && (
            <div className={`${styles.fileContainer} ${className}`}>
              {[...fileList]
                .filter((file) => file)
                .map((fileData) => {
                  const file_name = fileData?.name || fileData?.file_name;
                  const file_id = fileData?.id || fileData?.file_id;
                  return (
                    <div className="d-flex align-items-start justify-content-between">
                      <p
                        title={fileData?.name || fileData?.file_name}
                        className={`${styles.fileName} mb-0`}
                      >
                        {getSubstring(
                          fileData?.name || fileData?.file_name,
                          maxFileChars
                        )}
                      </p>
                      <div>
                        {file_id && (
                          <MdDownload
                            className={`${styles.removeFileButton} mx-2`}
                            onClick={() => file_id && onFileDownload(file_id)}
                          />
                        )}
                        {onRemoveFile && (
                          <MdClose
                            className={styles.removeFileButton}
                            onClick={() => onRemoveFile(file_id, file_name)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </>
      ) : (
        <>
          {isLabel && (
            <div className={styles.labelContainer}>
              <label className={styles[labelVariant]}>{labelText}</label>
            </div>
          )}
          <div className={styles.inputWrapper}>
            {type === "textarea" ? (
              <textarea
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                name={name}
                disabled={disabled}
                max={max}
                min={min}
                pattern={pattern}
                className={styles[variant]}
                value={value}
                id={id}
                onBlur={onBlur}
                rows={rows}
              />
            ) : (
              <input
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                name={name}
                disabled={disabled}
                max={max}
                min={min}
                pattern={pattern}
                className={`${styles[variant]} ${
                  styles[size || ""]
                } ${className}`}
                value={value}
                id={id}
                onBlur={onBlur}
                {...rest}
              />
            )}

            {error && <p>{errorText}</p>}
          </div>
        </>
      )}
    </>
  );
};
