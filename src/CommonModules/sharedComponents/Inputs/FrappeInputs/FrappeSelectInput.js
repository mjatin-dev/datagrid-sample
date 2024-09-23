import React, { useState } from "react";
import styles from "./style.module.scss";
import { MdAdd, MdClose, MdEdit } from "react-icons/md";
import { IconButton } from "@mui/material";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  control: (provided) => ({
    ...provided,
    boxShadow: "none",
    border: "none",
    borderRadius: "6px",
    "&:hover, &:focus": {
      border: "none",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: "999",
  }),
};

const FrappeSelectInput = ({
  name,
  title,
  values = [],
  setValues = () => {},
  options = [],
  isCreatableSelect = false,
  onCreateOption = () => {},
  isValidNewOption,
  onEditOption,
}) => {
  // const [values, setValues] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const SelectInput = isCreatableSelect ? CreatableSelect : Select;
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputHeader}>
        <p className={styles.inputText}>{title}</p>
        <button
          className={styles.inputButton}
          onClick={() => {
            if (values.length > 0 ? [...values].pop() : true) {
              setValues([...values, null]);
              setEditIndex(values.length);
            }
          }}
        >
          <MdAdd />
          &nbsp;Add&nbsp;{title}
        </button>
      </div>
      {values.map((data, index) => {
        return (
          <div
            className={styles.inputItem}
            key={`option-${name || title}-${index}`}
          >
            {editIndex === index || !data ? (
              <SelectInput
                value={data}
                autoFocus
                isValidNewOption={
                  isValidNewOption
                    ? isValidNewOption
                    : (inputStr) => {
                        return inputStr && removeWhiteSpaces(inputStr) !== " ";
                      }
                }
                onCreateOption={(inputStr) => onCreateOption(inputStr, index)}
                styles={customStyles}
                hideSelectedOptions
                options={[...options].filter(
                  (item) =>
                    ![...values]
                      .map((item) => item?.value)
                      .includes(item?.value)
                )}
                onChange={(selectedValue) => {
                  const _tempValues = [...values];
                  _tempValues.splice(index, 1, selectedValue);
                  setValues(_tempValues);
                }}
              />
            ) : (
              <p
                onClick={() => {
                  if (editIndex !== index) setEditIndex(index);
                }}
                className={`${styles.inputText} truncate cursor-pointer`}
              >
                {data.label}
              </p>
            )}
            {data && onEditOption && (
              <IconButton
                disableTouchRipple
                color="inherit"
                size="small"
                title="Edit"
                onClick={() => {
                  onEditOption(data, index);
                }}
              >
                <MdEdit />
              </IconButton>
            )}
            <IconButton
              disableTouchRipple
              color="inherit"
              size="small"
              title="Delete"
              onClick={() => {
                const tempValues = [...values];
                tempValues.splice(index, 1);
                setValues(tempValues);
              }}
            >
              <MdClose />
            </IconButton>
          </div>
        );
      })}
    </div>
  );
};

export default FrappeSelectInput;
