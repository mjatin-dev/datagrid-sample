import React, { useEffect, useState } from "react";
const PANInput = (props) => {
  const {
    item,
    label,
    error,
    styleType,
    register,
    form_id,
    handleOnChange,
    index,
  } = props;
  const [newValidation, setNewValidation] = useState({});

  const validation = () => {
    const required = {};
    if (item?.isRequired) {
      required.required = "Field is required";
    }
    required.pattern = {
      value: new RegExp("^[A-Z0-9]{10}$"),
      message: "Enter Valid PAN number!",
    };
    setNewValidation(required);
  };

  useEffect(() => {
    validation();
  }, []);
  const validateInput = (value) => {
    if (value && value.trim() === "") {
      return "Input can't be just empty space";
    }
    return true;
  };
  switch (styleType) {
    case "Style 01":
      return (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder={label}
            className="short-answer-input"
            style={{ width: "100%" }}
            {...register(form_id, {
              ...newValidation,
              validate: validateInput,
              onChange: (e) => {
                handleOnChange(e, index);
              },
            })}
          />
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
          <div className="style2-input-div">
            <input
              type="text"
              placeholder={label}
              className="short-answer-input"
              style={{ width: "100%" }}
              {...register(form_id, {
                ...newValidation,
                validate: validateInput,
                onChange: (e) => {
                  handleOnChange(e, index);
                },
              })}
            />
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
          <div className="style2-input-div">
            <input
              type="text"
              placeholder={label}
              className="short-answer-input"
              style={{ width: "100%" }}
              {...register(form_id, {
                ...newValidation,
                validate: validateInput,
                onChange: (e) => {
                  handleOnChange(e, index);
                },
              })}
            />
          </div>
          {error?.[form_id] && (
            <p className="sme-error">{error[form_id]?.message}</p>
          )}
        </div>
      );
    default:
      return (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder={label}
            className="short-answer-input"
            style={{ width: "100%" }}
            {...register(form_id, {
              ...newValidation,
              validate: validateInput,
              onChange: (e) => {
                handleOnChange(e, index);
              },
            })}
          />
          {error?.[form_id] && (
            <p className="sme-error">{error[form_id]?.message}</p>
          )}
        </div>
      );
  }
};

export default PANInput;
