import { DatePicker } from "antd";
import moment from "moment";
import React from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import constant from "../../../../../CommonModules/sharedComponents/constants/constant";

const DateButtons = ({
  setDays,
  activeDays,
  monthDate,
  weekStartDate,
  setWeekStartDate,
  dayDate,
  setDayDate,
  setMonthDate,
}) => {
  return (
    <div className="mb-3 mb-md-0 pm-data__container pm-date__container d-flex align-items-center justify-content-between">
      <AiOutlineLeft
        className="mr-2 pm-data__active pm-calender-view__header-navigation--arrow"
        onClick={() => setDays(activeDays, constant.decrement)}
      />
      {activeDays === constant.day && (
        <>
          {/* <span className="pm__date-filter-text">
            {moment(dayDate).format("MMMM D,  ddd")}
          </span> */}
          <DatePicker
            bordered={false}
            allowClear={false}
            picker="date"
            format="MMMM D, YYYY"
            value={moment(dayDate)}
            onChange={(date) => {
              const _d = date.format("YYYY-MM-DD");
              setDayDate(new Date(_d));
            }}
          />
        </>
      )}

      {activeDays === constant.week && (
        <span className="pm__date-filter-text">
          <DatePicker
            value={moment(weekStartDate)}
            bordered={false}
            picker="week"
            allowClear={false}
            format="MMMM YYYY"
            onChange={(date) => {
              const _d = moment(date).day(0).format("YYYY-MM-DD");
              setWeekStartDate(new Date(_d));
            }}
          />
        </span>
      )}

      {activeDays === constant.month && (
        <DatePicker
          bordered={false}
          allowClear={false}
          picker="month"
          format="MMMM YYYY"
          value={moment(monthDate)}
          onChange={(date) => {
            const _d = date.format("YYYY-MM-DD");
            setMonthDate(new Date(_d));
          }}
        />
      )}

      <AiOutlineRight
        className="ml-2 pm-data__active pm-calender-view__header-navigation--arrow"
        onClick={() => setDays(activeDays, constant.increment)}
      />
    </div>
  );
};

export default DateButtons;
