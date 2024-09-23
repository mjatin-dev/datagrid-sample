import React from "react";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { DatePicker } from "antd";
import "./style.css";
import moment from "moment";

const Datepicker = ({ name, dispatch, actionType, pageName, value }) => {
  const onChangeHandler = (date, dateString) => {
    if (dateString) {
      const dateArr = moment(dateString)
        .format("DD MM YYYY")
        .split(" ")
        .map((element) => parseInt(element));

      dispatch({ type: actionType, payload: dateArr });
    } else {
      dispatch({ type: actionType, payload: [] });
    }
  };
  return (
    <div className="form-group">
      {value && value.length === 3 ? (
        <DatePicker
          style={{
            width: "100%",
            color: "#000",
            border: "1px solid #ced4da",
            minHeight: "38px",
            background: "#fafafa",
          }}
          format="DD MMM YYYY"
          placeholder="Select Date"
          name={name}
          value={moment(value?.join(" "), "DD MM YYYY")}
          className={
            pageName === "newRegulation" ? "date-picker" : "taskhistoryfilter"
          }
          onChange={onChangeHandler}
        />
      ) : (
        <DatePicker
          style={{
            width: "100%",
            color: "#000",
            border: "1px solid #ced4da",
            minHeight: "38px",
            background: "#fafafa",
          }}
          value={null}
          placeholder="Select Date"
          format="DD MMM YYYY"
          name={name}
          className={
            pageName === "newRegulation" ? "date-picker" : "taskhistoryfilter"
          }
          onChange={onChangeHandler}
        />
      )}
    </div>
  );
};

export default Datepicker;
