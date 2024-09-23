import React, { useEffect, useState } from "react";
import "./style.css";
import { NamedTimeZoneImpl } from "@fullcalendar/react";

function Radio(props) {
  const {
    index,
    form_id,
    item,
    label,
    error,
    styleType,
    options,
    register,
    handleOnChange,
  } = props;
  const [radios, setRadios] = useState(options ? options.split(",") : [""]);

  switch (styleType) {
    case "Style 01":
      return (
        <div className="sme-style1-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className="style2-input-div-checkbox">
            {radios?.length > 0 &&
              radios?.map((item, checkBoxindex) => (
                <div key={checkBoxindex} className="style3-checkbox-option">
                  <input
                    type="radio"
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
                    value={item}
                    name="radio"
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
            {radios?.length > 0 &&
              radios?.map((item, checkBoxindex) => (
                <div className="style3-checkbox-option">
                  <input
                    type="radio"
                    name={NamedTimeZoneImpl}
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
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
            {radios?.length > 0 &&
              radios?.map((item, checkBoxindex) => (
                <div className="style3-checkbox-option">
                  <input
                    type="radio"
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
                    value={item}
                  />
                  <p className="checkbox-label">{item}</p>
                </div>
              ))}
          </div>
          {error && <p className="sme-error">{error}</p>}
        </div>
      );
    default:
      return (
        <div className="sme-style1-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className="style2-input-div-checkbox">
            {radios?.length > 0 &&
              radios?.map((item, checkBoxindex) => (
                <div className="style3-checkbox-option">
                  <input
                    type="radio"
                    onChange={(e) => {
                      handleOnChange(e);
                    }}
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

export default Radio;
