import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";

const DateRange = (props) => {
  const { RangePicker } = DatePicker;
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
    setNewValidation(required);
  };

  useEffect(() => {
    validation();
  }, []);
  switch (styleType) {
    case "Style 01":
      return (
        <div className='sme-style1-div' style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2' style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className='style2-input-div-checkbox'>
            <RangePicker
             format='DD MMM YYYY'
              style={{
                width: "453px",
                height: "50px",
                borderRadius: "10px",
              }}
              onChange={(e) => {
                handleOnChange(e, index);
              }}
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
            <RangePicker
             format='DD MMM YYYY'
              style={{
                width: "453px",
                height: "50px",
                borderRadius: "10px",
              }}
              onChange={(e, dateString) => {
                handleOnChange(dateString, index);
              }}
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
            <RangePicker
             format='DD MMM YYYY'
              style={{
                width: "453px",
                height: "50px",
                borderRadius: "10px",
              }}
              onChange={(e, dateString) => {
                handleOnChange(dateString, index);
              }}
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
            <RangePicker
             format='DD MMM YYYY'
              style={{
                width: "453px",
                height: "50px",
                borderRadius: "10px",
              }}
              onChange={(e, dateString) => {
                handleOnChange(dateString, index);
              }}
            />
          </div>
          {error?.[form_id] && (
            <p className='sme-error'>{error[form_id]?.message}</p>
          )}
        </div>
      );
  }
};

export default DateRange;
