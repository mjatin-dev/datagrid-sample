import React, { useCallback, useEffect, useState } from "react";
import styles from "./style.module.scss";
import { MdAdd, MdClose, MdDelete, MdEdit } from "react-icons/md";
import { IconButton } from "@mui/material";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";

const FrappeStackInput = ({
  name,
  title,
  displayKey,
  handleEdit,
  setEditIndex,
  editIndex,
  isSelectionEnabled = false,
  selectionLabel,
  editInside = false,
  // selectionIndex = null,
  handleOptionSelection,
  values = [],
  setValues,
}) => {
  // const [values, setValues] = useState([]);
  //   const [editIndex, setEditIndex] = useState(null);

  const handleAdd = useCallback(() => {
    if (values.length > 0 ? [...values].pop()?.value : true) {
      setValues([
        ...values,
        {
          id: `${name}-${values.length + 1}`,
          label: displayKey ? values.length + 1 : null,
          value: null,
        },
      ]);
      setEditIndex(values.length);
    }
  }, [setEditIndex, values, displayKey, name, setValues]);

  const handleChangeOption = (value, index) => {
    const _tempValues = [...values];
    _tempValues[index].label = value;
    _tempValues[index].value = value;
    setValues(_tempValues);
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputHeader}>
        <p className={styles.inputText}>{title}</p>
        {values.length === 0 && (
          <button
            className={styles.inputButton}
            onClick={() => {
              handleAdd();
            }}
          >
            <MdAdd />
            &nbsp;Add&nbsp;{title}
          </button>
        )}
        {values.length > 0 && selectionLabel && (
          <p className={`${styles.inputInfoText}`}>{selectionLabel}</p>
        )}
      </div>

      {values.map((data, index) => {
        return (
          <div
            className={styles.inputItem}
            key={`option-${name || title}-${index}`}
          >
            {editIndex !== index ? (
              <p className={`${styles.inputText} truncate cursor-pointer`}>
                {`${displayKey || ""} ${data.label || ""}`}
              </p>
            ) : (
              <input
                autoFocus
                className={`${styles.textInput} mr-3`}
                value={data?.value || ""}
                onChange={(e) => {
                  if (handleChangeOption) {
                    handleChangeOption(
                      removeWhiteSpaces(e.target.value),
                      index
                    );
                  }
                }}
              />
            )}
            <div className="d-flex align-items-center justify-content-end">
              {isSelectionEnabled && (
                <input
                  type="checkbox"
                  checked={data.selected}
                  onChange={(e) =>
                    handleOptionSelection(e.target.checked, index)
                  }
                  className="mr-3"
                />
              )}
              <IconButton
                disableTouchRipple
                // color="inherit"
                size="small"
                title="Edit"
                disabled={editIndex === index}
                onClick={() => {
                  if (!editInside) handleEdit(index);
                  else setEditIndex(index);
                }}
                className="mr-2"
              >
                <MdEdit color={editIndex !== index ? "#7a73ff" : "inherit"} />
              </IconButton>
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
          </div>
        );
      })}
      {values.length > 0 && (
        <div className={styles.inputBottom}>
          <button
            className={styles.inputButton}
            onClick={() => {
              handleAdd();
            }}
          >
            <MdAdd />
            &nbsp;Add&nbsp;{title}
          </button>
        </div>
      )}
    </div>
  );
};

export default FrappeStackInput;
