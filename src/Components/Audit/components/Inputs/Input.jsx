import React from "react";
import styles from "./style.module.scss";
import { DatePicker } from "antd";
import { MdClose, MdDownload, MdFileUpload } from "react-icons/md";
import { getSubstring } from "../../../../CommonModules/helpers/string.helpers";
import { onFileDownload } from "../../../../CommonModules/helpers/file.helper";
import moment from "moment";
export const Input = ({
  variant = "default",
  labelVariant = "labelMedium",
  placeholder,
  autofocus = false,
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
  selectEnabled = false,
  required = false,
  format = "DD MMM YYYY",
  maxLength,
  ...rest
}) => {
  return (
    <>
      {type === "select" ? (
        <>
          {labelText && (
            <div className={styles.labelContainer}>
              <label
                className={`${styles[labelVariant]} ${
                  required && styles.required
                }`}
              >
                {labelText}
              </label>
            </div>
          )}
          <div>
            <select
              value={value}
              onChange={onChange}
              className={`${styles[variant]} ${className}`}
              name={name}
              id={id}
              placeholder={placeholder}
              multiple={multiple || false}
              onBlur={onBlur}
              disabled={disabled}
            >
              {selectEnabled ? (
                <option selected> {placeholder || "Select"} </option>
              ) : (
                <option selected disabled>
                  {placeholder || "Select"}
                </option>
              )}

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
            <label
              className={`${styles[labelVariant]} ${
                required && styles.required
              }`}
            >
              {labelText}
            </label>
          </div>
          <div>
            <DatePicker
              onChange={onChange}
              format={format}
              className={styles[variant]}
              value={value}
              disabledDate={(current) => {
                let customDate = moment().format("YYYY-MM-DD");
                return current && current < moment(customDate, "YYYY-MM-DD");
              }}
              placeholder="Select Date"
            />
          </div>
        </>
      ) : type === "textArea" ? (
        <>
          <div className={styles.labelContainer}>
            <label
              className={`${styles[labelVariant]} ${
                required && styles.required
              }`}
            >
              {labelText}
            </label>
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
              <label
                className={`${styles[labelVariant]} ${
                  required && styles.required
                }`}
              >
                {labelText}
              </label>
            </div>
          )}
          <div className={styles.labelContainer}>
            <label
              className={`${styles.uploadFileLabel} ${
                styles[size || ""]
              } ${className} ${styles[variant]} `}
              htmlFor={`${id},${name}`}
            >
              <MdFileUpload className={styles.uploadIcon} />
              &nbsp;Upload
            </label>
          </div>

          <input
            onChange={onChange}
            type="file"
            placeholder={placeholder}
            name={name}
            disabled={disabled}
            className={`${styles[variant]} ${styles[size || ""]} ${className}`}
            // value={value}
            id={`${id},${name}`}
            onBlur={onBlur}
            multiple={multiple || false}
          />
          {fileList?.length > 0 && (
            <div className={`${styles.fileContainer} ${className}`}>
              {[...fileList]
                .filter((file) => file)
                .map((fileData, index) => {
                  return (
                    <FileListItem
                      key={`file-input-uploaded-file-list-item-${
                        fileData?.file_id || index
                      }`}
                      fileData={fileData}
                      maxFileChars={maxFileChars}
                      onRemoveFile={onRemoveFile}
                      disabled={disabled}
                    />
                  );
                })}
            </div>
          )}
        </>
      ) : (
        <>
          {isLabel && (
            <div className={styles.labelContainer}>
              <label
                className={`${styles[labelVariant]} ${
                  required && styles.required
                }`}
              >
                {labelText}
              </label>
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
                autoFocus={autofocus}
                placeholder={placeholder}
                name={name}
                disabled={disabled}
                max={max}
                min={min}
                maxLength={maxLength}
                pattern={pattern}
                className={`${styles[variant]} ${
                  styles[size || ""]
                } ${className}`}
                value={value}
                id={id}
                onBlur={onBlur}
              />
            )}

            {error && <p>{errorText}</p>}
          </div>
        </>
      )}
    </>
  );
};

export const FileListItem = ({
  fileData,
  onRemoveFile,
  maxFileChars,
  disabled = false,
}) => {
  const file_name = fileData?.name || fileData?.file_name;
  const file_id = fileData?.id || fileData?.file_id;
  return (
    <div className="d-flex align-items-start justify-content-between">
      <p title={file_name} className={styles.fileName}>
        {getSubstring(file_name, maxFileChars)}
      </p>
      <div>
        {file_id && (
          <MdDownload
            title="Download File"
            className={`${styles.removeFileButton} mx-2`}
            onClick={() => file_id && onFileDownload(file_id)}
          />
        )}
        {onRemoveFile && (
          <MdClose
            title="Delete File"
            className={styles.removeFileButton}
            onClick={() => {
              if (!disabled) {
                onRemoveFile(file_id, file_name);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
