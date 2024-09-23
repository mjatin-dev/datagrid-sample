import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./style.css";

function Dropdowns(props) {
  const { item, label, error, options, styleType, form_id, handleOnChange } =
    props;
  
  switch (styleType) {
    case "Style 01":
      return (
        <div className='sme-style1-div' style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2' style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className='style2-input-div-checkbox'>
            <Select
              isMulti
              onChange={handleOnChange}
              style={{
                width: "100%",
              }}
              options={options}
            />
          </div>
          {error?.[form_id] && (
            <p className='sme-error'>{error[form_id]?.message}</p>
          )}
        </div>
      );
    case "Style 02":
      return (
        <div className='sme-style2-div' style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2' style={{ margin: 0 }}>
            {label}
          </p>
          <div className='style2-input-div-checkbox'>
            <Select
              isMulti
              onChange={handleOnChange}
              style={{
                width: "100%",
              }}
              options={options}
            />
          </div>
          {error?.[form_id] && (
            <p className='sme-error'>{error[form_id]?.message}</p>
          )}
        </div>
      );
    case "Style 03":
      return (
        <div
          className='sme-style3-div'
          style={{ marginBottom: "20px", width: "auto" }}
        >
          <p className='short-answer-p-style2'>{label}</p>
          <div className='style3-input-div-checkbox'>
            <Select
              isMulti
              onChange={handleOnChange}
              style={{
                width: "100%",
              }}
              options={options}
            />
          </div>
          {error?.[form_id] && (
            <p className='sme-error'>{error[form_id]?.message}</p>
          )}
        </div>
      );
    default:
      return (
        <div className='sme-style1-div' style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2' style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className='style2-input-div-checkbox'>
            <Select
              isMulti
              onChange={handleOnChange}
              style={{
                width: "100%",
              }}
              options={options}
            />
          </div>
          {error?.[form_id] && (
            <p className='sme-error'>{error[form_id]?.message}</p>
          )}
        </div>
      );
  }
}

export default Dropdowns;
