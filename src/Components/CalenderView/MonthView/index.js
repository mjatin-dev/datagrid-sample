import React, { useState } from "react";
import moment from "moment";
import "./style.css";
import { getInitialName } from "../../../CommonModules/helpers/GetIntialName.helper";
import constant from "../../../CommonModules/sharedComponents/constants/constant";
import { MdNavigateBefore } from "react-icons/md";

const MonthView = ({
  months,
  goToDateWeek,
  monthDate,
  monthData,
  getSelectTaskDetails,
  userDetails,
}) => {
  const [currentSelectedDay, setCurrentSelectedDay] = useState({});
  const moveToWeek = (day) => {
    goToDateWeek(day);
  };

  const viewDetail = (TaskId) => {
    const task = { TaskId };
    getSelectTaskDetails(task);
  };

  return (
    <>
      <div className="calender-container">
        <div className="calender-days">
          {constant.Weeks.map((day) => (
            <div className="day-name day-name__small">{day}</div>
          ))}
        </div>
        <div className="calender">
          {months.map((day) => {
            const todayDate = moment(new Date()).format("YYYY-MM-DD");
            const month = moment(day).format("MMMM");
            const currentMonth = moment(monthDate).format("MMMM");
            const currentDay = moment(day).format("D");
            const compareDate = moment(day).format("YYYY-MM-DD");

            const list = monthData.filter((item) => {
              if (item.dueDate === compareDate) {
                return item;
              }
            });

            return (
              <div
                className={month === currentMonth ? "day" : "day-disable"}
                onClick={() => {
                  if (userDetails && userDetails.UserType !== 6) {
                    moveToWeek(day);
                  }
                }}
                style={{
                  pointerEvents: `${
                    userDetails && userDetails.UserType === 6 ? "none" : "auto"
                  }`,
                }}
              >
                <p
                  className={`inactive-date ${
                    todayDate === compareDate ? "active-date" : ""
                  }`}
                >
                  {currentDay}
                </p>
                <div className="d-flex mb-1">
                  {month === currentMonth &&
                    list &&
                    list.length > 0 &&
                    list.slice(0, 2).map((item) => {
                      return (
                        <div className="button-code">
                          {item?.licenseDisplay}
                          <div className="tooltip-container">
                            <h2 className="tooltip-title">{item?.subject}</h2>
                            <div className="tooltip-company-detail">
                              <span className="tooltip-compant-name truncate">
                                {item?.customerName}
                              </span>
                              {item?.assignedToName && (
                                <p>
                                  <span className="circle-dp-tooltip">
                                    {item?.assignedToName &&
                                      getInitialName(item?.assignedToName)}
                                  </span>{" "}
                                  <span className="user-name-tooltip">
                                    {item?.assignedToName}
                                  </span>
                                </p>
                              )}
                            </div>

                            <button
                              className="tooltip-view-detail-button"
                              onClick={() => {
                                if (userDetails && userDetails.UserType !== 6) {
                                  viewDetail(item?.TaskId);
                                }
                              }}
                            >
                              View Detail
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {month === currentMonth && list && list.length > 2 && (
                  <button className="view-more">
                    View {parseInt(list.length - 2)} more{" "}
                    {parseInt(list.length - 2) < 1 ? "task" : "tasks"}{" "}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="calender-mobile d-block d-md-none">
        {currentSelectedDay &&
          Object?.keys(currentSelectedDay)?.length === 0 && (
            <div className="small-calender-mobile">
              {constant.Weeks.map((day) => (
                <div className="small-calender-day-name">{day[0]}</div>
              ))}
              {months.map((day) => {
                const todayDate = moment(new Date()).format("YYYY-MM-DD");
                const month = moment(day).format("MMMM");
                const currentMonth = moment(monthDate).format("MMMM");
                const currentDay = moment(day).format("D");
                const currentDayName = moment(day).format("dddd ");
                const currentDateWithZero = moment(day).format("DD");
                const compareDate = moment(day).format("YYYY-MM-DD");
                const list = monthData.filter(
                  ({ dueDate }) => dueDate === compareDate
                );
                const listLength = list?.length || 0;

                return (
                  <div
                    // href={`#date-${currentDateWithZero}`}
                    className={`${
                      month === currentMonth
                        ? "small-calender-day"
                        : "small-calender-day-disable"
                    } d-flex align-items-center justify-content-center`}
                    onClick={() =>
                      setCurrentSelectedDay({
                        day,
                        todayDate,
                        compareDate,
                        currentDayName,
                        currentDay: currentDateWithZero,
                        list,
                      })
                    }
                  >
                    <p
                      className={`${
                        todayDate === compareDate
                          ? "small-calender-active-date"
                          : "small-calender-inactive-date"
                      } ${listLength > 0 && "small-calander__container-task"}`}
                    >
                      <span>{currentDay}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        {currentSelectedDay && Object?.keys(currentSelectedDay)?.length > 0 && (
          <>
            <div className="position-relative mobile-calander__date-task-container">
              <div
                key={"date-" + currentSelectedDay?.currentDay}
                className=" calender-mobile-item d-flex align-items-center flex-column"
                style={{
                  pointerEvents: `${
                    userDetails && userDetails.UserType === 6 ? "none" : "auto"
                  }`,
                }}
              >
                <div className="w-100 mb-3 left d-flex justify-content-start align-items-end">
                  <button
                    className="calander-navigation__button"
                    onClick={() => setCurrentSelectedDay({})}
                  >
                    <MdNavigateBefore />
                  </button>
                  <div
                    className={`${
                      currentSelectedDay?.todayDate ===
                        currentSelectedDay?.compareDate && "current-day"
                    } d-flex justify-content-center align-items-center mr-1 mobile-calandar__list-day`}
                  >
                    <h5
                      className="mb-0"
                      style={{
                        color:
                          currentSelectedDay?.todayDate ===
                            currentSelectedDay?.compareDate && "#fff",
                        fontWeight:
                          !(
                            currentSelectedDay?.todayDate ===
                            currentSelectedDay?.compareDate
                          ) && "600",
                      }}
                    >
                      {currentSelectedDay?.currentDay}
                    </h5>
                  </div>
                  <p>{currentSelectedDay?.currentDayName}</p>
                </div>
                <div className="w-100 right">
                  {currentSelectedDay?.list &&
                    currentSelectedDay?.list[0]?.license && (
                      <>
                        <div
                          className="right-item d-flex align-items-center"
                          onClick={() => {
                            if (userDetails && userDetails.UserType !== 6) {
                              viewDetail(currentSelectedDay?.list[0]?.TaskId);
                            }
                          }}
                        >
                          <div className="button-code m-0">
                            {currentSelectedDay?.list[0]?.license}
                          </div>
                          <h6 className="right-item-task-name mb-0">
                            {currentSelectedDay?.list[0]?.subject}
                          </h6>
                        </div>
                      </>
                    )}

                  {currentSelectedDay?.list &&
                    currentSelectedDay?.list[0]?.license && (
                      <>
                        <div
                          className="right-item d-flex align-items-center"
                          onClick={() => {
                            if (userDetails && userDetails.UserType !== 6) {
                              viewDetail(currentSelectedDay?.list[0]?.TaskId);
                            }
                          }}
                        >
                          <div className="button-code m-0">
                            {currentSelectedDay?.list[0]?.license}
                          </div>
                          <h6 className="right-item-task-name mb-0">
                            {currentSelectedDay?.list[0]?.subject}
                          </h6>
                        </div>
                      </>
                    )}

                  {currentSelectedDay?.list &&
                    currentSelectedDay?.list.length > 2 && (
                      <button
                        className="view-more"
                        onClick={() => {
                          if (userDetails && userDetails.UserType !== 6) {
                            moveToWeek(currentSelectedDay?.day);
                          }
                        }}
                      >
                        View {parseInt(currentSelectedDay?.list.length - 2)}{" "}
                        more{" "}
                        {parseInt(currentSelectedDay?.list.length - 2) < 1
                          ? "tasks"
                          : "task"}{" "}
                      </button>
                    )}
                </div>
              </div>
            </div>
          </>
        )}
        {/* {months
          .filter((day) => {
            return (
              moment(day).format("MMMM") === moment(monthDate).format("MMMM")
            );
          })
          .map((day) => {
            const todayDate = moment(new Date()).format("YYYY-MM-DD");
            const compareDate = moment(day).format("YYYY-MM-DD");
            const currentDayName = moment(day).format("ddd");
            const currentDay = moment(day).format("DD");
            const list = monthData.filter(
              ({ due_date }) => due_date === compareDate
            );
            return (
              <div
                key={"date-" + currentDay}
                id={"date-" + currentDay}
                className="calender-mobile-item d-flex align-items-center"
                style={{
                  pointerEvents: `${
                    userDetails && userDetails.UserType === 6 ? "none" : "auto"
                  }`,
                }}
              >
                <div className="left d-flex flex-column justify-content-center align-items-center">
                  <div
                    className={`${
                      todayDate === compareDate && "current-day"
                    } d-flex justify-content-center align-items-center`}
                  >
                    <h5
                      className="m-0"
                      style={{
                        color: todayDate === compareDate && "#fff",
                        fontWeight: !(todayDate === compareDate) && "600",
                      }}
                    >
                      {currentDay}
                    </h5>
                  </div>
                  <p className="my-0">{currentDayName}</p>
                </div>
                <div className="right">
                  {list && list[0]?.license && (
                    <>
                      <div
                        className="right-item d-flex align-items-center"
                        onClick={() => {
                          if (userDetails && userDetails.UserType !== 6) {
                            viewDetail(list[0]?.TaskId);
                          }
                        }}
                      >
                        <div className="button-code m-0">
                          {list[0]?.license}
                        </div>
                        <h6 className="right-item-task-name mb-0">
                          {list[0]?.subject}
                        </h6>
                      </div>
                    </>
                  )}

                  {list && list[0]?.license && (
                    <>
                      <div
                        className="right-item d-flex align-items-center"
                        onClick={() => {
                          if (userDetails && userDetails.UserType !== 6) {
                            viewDetail(list[0]?.TaskId);
                          }
                        }}
                      >
                        <div className="button-code m-0">
                          {list[0]?.license}
                        </div>
                        <h6 className="right-item-task-name mb-0">
                          {list[0]?.subject}
                        </h6>
                      </div>
                    </>
                  )}

                  {list && list.length > 2 && (
                    <button
                      className="view-more"
                      onClick={() => {
                        if (userDetails && userDetails.UserType !== 6) {
                          moveToWeek(day);
                        }
                      }}
                    >
                      View {parseInt(list.length - 2)} More{" "}
                      {parseInt(list.length - 2) < 1 ? "Tasks" : "Task"}{" "}
                    </button>
                  )}
                </div>
              </div>
            );
          })} */}
      </div>
    </>
  );
};

export default MonthView;
