import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import styles from "./styles.module.scss";

const MultiSelectInput = ({
  name,
  options,
  variant = "auditAssignmentInput",
  onChange,
  labelText,
  labelVariant,
  isDisabled = false,
  multiple = true,
  isClearable = false,
  customStyles,
  isCreateable,
  isLableVisible = true,
  placeholder= "Select",
  menuPos="absolute",
  ...rest
}) => {
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: variant === "auditAssignmentInput" ? "#f6f9fb" : "#fff",
      fontSize: multiple ? "8px" : "12px",
      border: "none",
      borderRadius: "4px",
    }),
    option: (provided, state) => ({
      ...provided,
      ...(state?.isSelected && {
        backgroundColor: "#dde3fd",
        color: "#000",
      }),
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      ...(state?.isFocused && {
        transform: "rotate(180deg)",
      }),
      transition: "all 0.15s ease",
    }),
    menu: (provided, state) => ({
      ...provided,
      position:menuPos
    })
  };
  return (
    <>
      {isLableVisible && (
        <div className={styles.labelContainer}>
          <label className={styles[labelVariant]}>{labelText}</label>
        </div>
      )}

      {!isCreateable ? (
        <Select
          hideSelectedOptions={false}
          maxMenuHeight={240}
          isMulti={multiple}
          styles={{
            ...selectStyles,
            ...(customStyles || {}),
          }}
          name={name}
          options={options}
          onChange={onChange}
          isDisabled={isDisabled}
          isClearable={isClearable}
          closeMenuOnSelect={false}
          placeholder={placeholder}
          {...rest}
          // components={{
          //   IndicatorSeparator: () => ({
          //     isDisabled: true,
          //   }),
          // }}
          components={{
            IndicatorSeparator: () => null,
            ...rest?.components,
          }}
        />
      ) : (
        <CreatableSelect
          hideSelectedOptions={false}
          maxMenuHeight={240}
          isMulti={multiple}
          styles={{
            ...selectStyles,
            ...(customStyles || {}),
          }}
          name={name}
          placeholder={placeholder}
          options={options}
          onChange={onChange}
          isDisabled={isDisabled}
          isClearable={isClearable}
          closeMenuOnSelect={false}
          {...rest}
          // components={{
          //   IndicatorSeparator: () => ({
          //     isDisabled: true,
          //   }),
          // }}
          components={{
            IndicatorSeparator: () => null,
            ...rest?.components,
          }}
        />
      )}
    </>
  );
};

export default MultiSelectInput;
