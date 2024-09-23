import React, { useEffect, useState } from "react";
import "./style.css";

function Checkbox(props) {
  const {
    item,
    label,
    error,
    styleType,
    register,
    form_id,
    handleOnChange,
    index,
    options,
  } = props;

  const [newValidation, setNewValidation] = useState({});

  const validateSelectAtLeast = (selectedFields) => {
    const selectedCount = Object.values(selectedFields).filter(Boolean).length;
    return selectedCount >= 1 || "Please select at least one option";
  };

  const validateSelectAtMost = (selectedFields) => {
    const selectedCount = Object.values(selectedFields).filter(Boolean).length;
    return selectedCount <= 2 || "Please select at most two options";
  };

  const validation = () => {
    const required = {};
    if (item?.isRequired) {
      required.required = "Field is required";
    }
    if (item?.type?.options?.responseValidation) {
      switch (item?.type?.options?.responseValidation?.option) {
        case "Select at least":
          required.min = {
            value: parseInt(item?.type?.options?.responseValidation?.number),
            message:
              item?.type?.options?.responseValidation?.customError ||
              `Select at least ${item?.type?.options?.responseValidation?.number}`,
          };
          break;
        case "Select at most":
          required.max = {
            value: parseInt(item?.type?.options?.responseValidation?.number),
            message:
              item?.type?.options?.responseValidation?.customError ||
              `Select at most ${item?.type?.options?.responseValidation?.number}`,
          };
          break;
      }
    }

    setNewValidation(required);
  };

  useEffect(() => {
    validation();
  }, []);
  const [checkboxes, setCheckboxes] = useState(
    options ? options.split(",") : [""]
  );

  switch (styleType) {
    case "Style 01":
      return (
        <div className="sme-style1-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className="style2-input-div-checkbox">
            {checkboxes?.length > 0 &&
              checkboxes?.map((item, checkBoxindex) => (
                <div className="style3-checkbox-option">
                  <input
                    type="checkbox"
                    {...register(form_id, {
                      ...newValidation,
                      onChange: (e) => {
                        handleOnChange(e, index, "checkbox");
                      },
                    })}
                    value={item}
                  />
                  <p className="checkbox-label">{item}</p>
                </div>
              ))}
          </div>
          {error?.[form_id] && (
            <p className="sme-error">{error[form_id]?.message}</p>
          )}
        </div>
      );
    case "Style 02":
      return (
        <div className="sme-style2-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ margin: 0 }}>
            {label}
          </p>
          <div className="style2-input-div-checkbox">
            {checkboxes?.length > 0 &&
              checkboxes?.map((item, checkBoxindex) => (
                <div className="style3-checkbox-option">
                  <input
                    type="checkbox"
                    {...register(form_id, {
                      ...newValidation,
                      onChange: (e) => {
                        handleOnChange(e, index, "checkbox");
                      },
                    })}
                    value={item}
                  />
                  <p className="checkbox-label">{item}</p>
                </div>
              ))}
          </div>
          {error?.[form_id] && (
            <p className="sme-error">{error[form_id]?.message}</p>
          )}
        </div>
      );
    case "Style 03":
      return (
        <div className="sme-style3-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2">{label}</p>
          <div className="style3-input-div-checkbox">
            {checkboxes?.length > 0 &&
              checkboxes?.map((item, checkBoxindex) => (
                <div className="style3-checkbox-option">
                  <input
                    type="checkbox"
                    {...register(form_id, {
                      ...newValidation,
                      onChange: (e) => {
                        handleOnChange(e, index, "checkbox");
                      },
                    })}
                    value={item}
                  />
                  <p className="checkbox-label">{item}</p>
                </div>
              ))}
          </div>
          {error?.[form_id] && (
            <p className="sme-error">{error[form_id]?.message}</p>
          )}
        </div>
      );
    default:
      return (
        <div className="sme-style1-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className="style2-input-div-checkbox">
            {checkboxes?.length > 0 &&
              checkboxes?.map((item, checkBoxindex) => (
                <div className="style3-checkbox-option">
                  <input
                    type="checkbox"
                    {...register(form_id, {
                      ...newValidation,
                      onChange: (e) => {
                        handleOnChange(e, index, "checkbox");
                      },
                    })}
                    value={item}
                  />
                  <p className="checkbox-label">{item}</p>
                </div>
              ))}
          </div>
          {error?.[form_id] && (
            <p className="sme-error">{error[form_id]?.message}</p>
          )}
        </div>
      );
  }
}
export default Checkbox;
