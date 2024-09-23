/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-dropdown-select";
import {
  addDaysInDate,
  getMondays,
  subtractDaysInDate,
} from "../../../CommonModules/helpers/Date.helper";
import constant from "../../../CommonModules/sharedComponents/constants/constant";
import DayView from "../DayView";
import MonthView from "../MonthView";
import {
  getDayData,
  getMonthData,
  getWeekData,
  setActiveFlag,
  setFilters,
} from "../redux/actions";
import WeekView from "../WeekView";
import "./style.css";
import DateButtons from "Components/ProjectManagement/Project&Task/Calender/components/DateButtons";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
const View = ({ getSelectTaskDetails, isRedirect }) => {
  const dispatch = useDispatch();
  const setActiveDays = (payload) => dispatch(setActiveFlag(payload));
  const setDayDate = (payload) =>
    dispatch(setFilters({ key: "dayDate", value: payload }));
  const setMonthDate = (payload) =>
    dispatch(setFilters({ key: "monthDate", value: payload }));
  const setWeekStartDate = (payload) =>
    dispatch(setFilters({ key: "weekStartDate", value: payload }));
  const setSevenDays = (payload) =>
    dispatch(setFilters({ key: "sevenDays", value: payload }));
  const [months, setMonths] = useState([]);
  const userDetails = useSelector((state) => state?.auth?.loginInfo);
  const {
    daysData,
    weekData,
    monthData,
    activeFlag: activeDays,
    isLoading,
    filters,
  } = useSelector((state) => state?.CalenderReducer);
  const { dayDate, monthDate, weekStartDate, sevenDays } = filters;

  const viewBy = [
    {
      id: 1,
      value: constant.day,
      name: "By Day",
    },
    {
      id: 2,
      value: constant.week,
      name: "By Week",
    },
    {
      id: 3,
      value: constant.month,
      name: "By Month",
    },
  ];

  useEffect(() => {
    activeDays === constant.day && fetchDayData();
    if (activeDays === constant.week) {
      getDays();
      fetchWeekData();
    }
  }, [dayDate, weekStartDate, activeDays]);

  useEffect(() => {
    getMonths();
    if (monthDate) {
      const date = new Date(monthDate);
      let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      fetchMonthData(endDate);
    }
  }, [monthDate]);

  useEffect(() => {
    setMonthDate(new Date());
  }, []);

  //Get Days from start date to end date.
  const getDays = () => {
    const days = [];
    setSevenDays([]);
    for (let index = 0; index < 7; index++) {
      const day = {
        day: moment(addDaysInDate(weekStartDate, index)).format("ddd D"),
        date: moment(addDaysInDate(weekStartDate, index)).format(),
      };
      days.push(day);
    }
    setSevenDays(days);
  };

  //Set Days based on day(day,week and month) type based on type(increment/decrement).
  const setDays = (activeDay, incrementType) => {
    if (activeDay === constant.week) {
      if (incrementType === constant.increment) {
        const date = addDaysInDate(weekStartDate, 7);
        setWeekStartDate(date);
      } else {
        const date = subtractDaysInDate(weekStartDate, 7);
        setWeekStartDate(date);
      }
    } else if (activeDay === constant.day) {
      if (incrementType === constant.increment) {
        const date = addDaysInDate(dayDate, 1);
        setDayDate(date);
      } else {
        const date = subtractDaysInDate(dayDate, 1);
        setDayDate(date);
      }
    } else {
      getMonths(incrementType);
    }
  };

  //Get Full Month
  const getMonths = (increment) => {
    const date = monthDate;
    let firstDayOfCurrentMonth, lastDayOfCurrentMonth, newDate;
    let listOfDate = [];

    if (increment === constant.increment) {
      newDate = new Date(date.setMonth(date.getMonth() + 1));
    } else if (increment === constant.decrement) {
      newDate = new Date(date.setMonth(date.getMonth() - 1));
    } else {
      newDate = date;
    }
    const listOfMondays = getMondays(newDate);

    firstDayOfCurrentMonth = parseInt(moment(listOfMondays[0]).format("D"));

    lastDayOfCurrentMonth = moment(
      new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0)
    ).format("D");

    if (firstDayOfCurrentMonth <= 7 && firstDayOfCurrentMonth !== 1) {
      let counter = 1;
      for (
        let index = firstDayOfCurrentMonth;
        index < firstDayOfCurrentMonth + 7;
        index++
      ) {
        const date = moment(listOfMondays[0]).format();
        const newDate = subtractDaysInDate(date, counter);
        listOfDate.push(newDate);
        counter++;
      }
      listOfDate.reverse();
    }

    let counter = 0;
    for (
      let index = firstDayOfCurrentMonth;
      index <= lastDayOfCurrentMonth;
      index++
    ) {
      const date = moment(listOfMondays[0]).format();
      const newDate = addDaysInDate(date, counter);
      listOfDate.push(newDate);
      counter++;
    }

    setMonthDate(newDate);
    setMonths(listOfDate);
  };

  //Dispatch Day API
  const fetchDayData = () => {
    dispatch(
      getDayData({
        StartDate: moment(dayDate).format("YYYY-MM-DD"),
        EndDate: moment(dayDate).format("YYYY-MM-DD"),
      })
    );
  };

  //Dispatch Week API
  const fetchWeekData = async () => {
    dispatch(
      getWeekData({
        StartDate: moment(weekStartDate).format("YYYY-MM-DD"),
        EndDate: moment(addDaysInDate(weekStartDate, 7)).format("YYYY-MM-DD"),
      })
    );
  };

  //Dispatch Month API
  const fetchMonthData = (endDate) => {
    var date = new Date(endDate);
    var startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayPayload = {
      StartDate: moment(startDate).format("YYYY-MM-DD"),
      EndDate: moment(moment(endDate).format()).format("YYYY-MM-DD"),
    };
    dispatch(getMonthData(dayPayload));
  };

  //Move to Week view when click on month view date.
  const goToDateWeek = (date) => {
    setWeekStartDate("");
    const newDate = moment(date).format();
    setDays(constant.week, constant.increment);
    setActiveDays(constant.week);
    setWeekStartDate(newDate);
    fetchWeekData();
  };

  //Move to day view when click on week view date.
  const goToDateDay = (date) => {
    setDayDate("");
    const newDate = moment(date).format();
    setDays(constant.day, constant.increment);
    setActiveDays(constant.day);
    setDayDate(newDate);
  };

  return (
    <>
      <div className="date-container">
        <DateButtons
          setDays={setDays}
          activeDays={activeDays}
          monthDate={monthDate}
          weekStartDate={weekStartDate}
          // addDaysInDate={addDaysInDate}
          dayDate={dayDate}
          setDayDate={setDayDate}
          setMonthDate={setMonthDate}
          setWeekStartDate={setWeekStartDate}
        />
        {/* <div>
          <AiOutlineLeft
            style={{ marginRight: "10px" }}
            onClick={() => setDays(activeDays, constant.decrement)}
          />
          {activeDays === constant.day && (
            <span className="current-date">
              {moment(dayDate).format("MMMM D,  ddd")}
            </span>
          )}

          {activeDays === constant.week && (
            <span className="current-date">
              {`${moment(weekStartDate).format("ddd D")}-${moment(
                addDaysInDate(weekStartDate, 6)
              ).format("ddd D MMM,YYYY")}`}
            </span>
          )}

          {activeDays === constant.month && (
            <span
              className="current-date"
              onClick={() => setIsShowSmallCalender(!isShowSmallCalender)}
              style={{ cursor: "pointer" }}
            >
              {`${moment(monthDate).format("MMMM")}`}
            </span>
          )}

          <AiOutlineRight
            style={{ marginLeft: "10px" }}
            onClick={() => setDays(activeDays, constant.increment)}
          />
        </div> */}
        <div className="d-none d-md-block">
          <button
            className={
              activeDays === constant.day ? "active-day" : "inactive-day"
            }
            onClick={() => setActiveDays(constant.day)}
          >
            Day
          </button>
          <button
            className={
              activeDays === constant.week ? "active-day" : "inactive-day"
            }
            onClick={() => setActiveDays(constant.week)}
          >
            Week
          </button>
          <button
            className={
              activeDays === constant.month ? "active-day" : "inactive-day"
            }
            onClick={() => setActiveDays(constant.month)}
          >
            Month
          </button>
        </div>
        <div className="d-block d-md-none">
          <Select
            options={viewBy}
            onChange={(value) => {
              const selectedValue = value[0].value;
              setActiveDays(selectedValue);
            }}
            className="view-by-select d-flex d-md-none"
            searchable={false}
            labelField={"name"}
            valueField={"value"}
            values={viewBy.filter((item) => item.value === activeDays)}
          />
        </div>
      </div>
      {isLoading && <Dots />}
      {activeDays === constant.day && !isLoading && (
        <DayView
          daysData={daysData}
          userDetails={userDetails}
          isRedirect={isRedirect}
        />
      )}

      {activeDays === constant.week && !isLoading && (
        <WeekView
          sevenDays={sevenDays}
          weekData={weekData}
          goToDateDay={goToDateDay}
          userDetails={userDetails}
        />
      )}

      {activeDays === constant.month && !isLoading && (
        <MonthView
          months={months}
          monthDate={monthDate}
          monthData={monthData}
          goToDateWeek={goToDateWeek}
          getSelectTaskDetails={getSelectTaskDetails}
          userDetails={userDetails}
        />
      )}
    </>
  );
};

export default View;
