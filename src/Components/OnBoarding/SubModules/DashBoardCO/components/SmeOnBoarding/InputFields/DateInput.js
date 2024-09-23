import React, { useState } from "react";
import { DatePicker, TimePicker } from "antd";
import "./style.css";
const Date = (props) => {
  const { item, label, error, styleType, form_id, handleOnChange, index } =
    props;
  const [state, setState] = useState({date:'',time:''});
   switch (styleType) {
    case "Style 01":
      return (
        <div className='sme-style1-div' style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2' style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className='style2-input-div-dateTime'>
            <div className='flex-col'>
              <DatePicker
                format='DD MMM YYYY'
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                }}
                picker='day, month'
                placeholder='Day, month'
                onChange={(e, date) => {
                  let temp = { ...state };
                  temp = { ...temp, date: date };
                  setState({ ...state, date: date });
                  handleOnChange(temp, index);
                }}
              />
              <p className='sme-error'>{error?.[`${form_id}-date`]?.message}</p>
            </div>
            {item?.type?.options?.includeTime && (
              <div className='flex-col'>
                <TimePicker
                  style={{
                    width: "100%",
                    height: "50px",
                    borderRadius: "10px",
                  }}
                  onChange={(e, time) => {
                    let temp = { ...state };
                    temp = { ...temp, time: time };
                    setState({ ...state, time: time });
                    handleOnChange(temp, index);
                  }}
                />
                <p className='sme-error'>
                  {error?.[`${form_id}-time`]?.message}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    case "Style 02":
      return (
        <div className='sme-style2-div' style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2' style={{ margin: 0 }}>
            {label}
          </p>
          <div className='style2-input-div-dateTime'>
            <div className='flex-col'>
              <DatePicker
                format='DD MMM YYYY'
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                }}
                picker='day, month'
                placeholder='Day, month'
                onChange={(e, date) => {
                  let temp = { ...state };
                  temp = { ...temp, date: date };
                  setState({ ...state, date: date });
                  handleOnChange(temp, index);
                }}
              />
              <p className='sme-error'>
                {error?.[`${form_id}-date`]?.message}asdfadf
              </p>
            </div>
            {item?.type?.options?.includeTime && (
              <div className='flex-col'>
                <TimePicker
                  style={{
                    width: "100%",
                    height: "50px",
                    borderRadius: "10px",
                  }}
                  onChange={(e, time) => {
                    let temp = { ...state };
                    temp = { ...temp, time: time };
                    setState({ ...state, time: time });
                    handleOnChange(temp, index);
                  }}
                />
                <p className='sme-error'>
                  {error?.[`${form_id}-time`]?.message}asdf
                </p>
              </div>
            )}
          </div>
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
            <div className='flex-col'>
              <DatePicker
                format='DD MMM YYYY'
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                }}
                picker='day, month'
                placeholder='Day, month'
                onChange={(e, date) => {
                  let temp = { ...state };
                  temp = { ...temp, date: date };
                  setState({ ...state, date: date });
                  handleOnChange(temp, index);
                }}
              />
              <p className='sme-error'>{error?.[`${form_id}-date`]?.message}</p>
            </div>
            {item?.type?.options?.includeTime && (
              <div className='flex-col'>
                <TimePicker
                  style={{
                    width: "100%",
                    height: "50px",
                    borderRadius: "10px",
                  }}
                  onChange={(e, time) => {
                    let temp = { ...state };
                    temp = { ...temp, time: time };
                    setState({ ...state, time: time });
                    handleOnChange(temp, index);
                  }}
                />
                <p className='sme-error'>
                  {error?.[`${form_id}-time`]?.message}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    default:
      return (
        <div className='sme-style1-div' style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2' style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className='style2-input-div-dateTime'>
            <div className='flex-col'>
              <DatePicker
                format='DD MMM YYYY'
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                }}
                picker='day, month'
                placeholder='Day, month'
                onChange={(e, date) => {
                  let temp = { ...state };
                  temp = { ...temp, date: date };
                  setState({ ...state, date: date });
                  handleOnChange(temp, index);
                }}
              />
              <p className='sme-error'>{error?.[`${form_id}-date`]?.message}</p>
            </div>
            {item?.type?.options?.includeTime && (
              <div className='flex-col'>
                <TimePicker
                  style={{
                    width: "100%",
                    height: "50px",
                    borderRadius: "10px",
                  }}
                  onChange={(e, time) => {
                    let temp = { ...state };
                    temp = { ...temp, time: time };
                    setState({ ...state, time: time });
                    handleOnChange(temp, index);
                  }}
                />
                <p className='sme-error'>
                  {error?.[`${form_id}-time`]?.message}
                </p>
              </div>
            )}
          </div>
        </div>
      );
  }
};

export default Date;
