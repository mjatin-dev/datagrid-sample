import React, { useEffect, useState } from "react";

const LongAnswer = (props) => {
  const {
    item,
    label,
    error,
    styleType,
    register,
    form_id,
    handleOnChange,
    index,
    customErrors,
  } = props;
  const [newValidation, setNewValidation] = useState({});

  switch (styleType) {
    case "Style 01":
      return (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder={label}
            className="short-answer-input"
            style={{ width: "100%" }}
            onChange={(e) => {
              handleOnChange(e, index);
            }}
          />
          {customErrors?.[form_id] && (
            <p className="sme-error">{customErrors[form_id]?.message}</p>
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
              className="short-answer-input"
              style={{ width: "100%" }}
              onChange={(e) => {
                handleOnChange(e, index);
              }}
            />
          </div>
          {customErrors?.[form_id] && (
            <p className="sme-error">{customErrors[form_id]?.message}</p>
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
              className="short-answer-input"
              style={{ width: "100%" }}
              onChange={(e) => {
                handleOnChange(e, index);
              }}
            />
          </div>
          {customErrors?.[form_id] && (
            <p className="sme-error">{customErrors[form_id]?.message}</p>
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
            onChange={(e) => {
              handleOnChange(e, index);
            }}
          />
          {customErrors?.[form_id] && (
            <p className="sme-error">{customErrors[form_id]?.message}</p>
          )}
        </div>
      );
  }
};

export default LongAnswer;
