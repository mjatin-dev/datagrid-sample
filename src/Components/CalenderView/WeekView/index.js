import React from "react";
import moment from "moment";
import "./style.css";
import { useSelector } from "react-redux";
import { getTaskListItemBackgroundColor } from "CommonModules/helpers/tasks.helper";
import TaskStatusBox from "CommonModules/sharedComponents/TaskStatusBox";
import TaskLicense from "CommonModules/sharedComponents/TaskStatusBox/TaskLicense";
import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";

const WeekView = ({ sevenDays, weekData, goToDateDay, userDetails }) => {
  const userEmail = useSelector((state) => state.auth.loginInfo.email);

  // const getNameInitials = (name) => {
  //   if (name !== undefined) {
  //     let initials = "";
  //     initials = name
  //       .split(" ")
  //       .map((n) => n[0])
  //       .join("");
  //     return initials.toUpperCase();
  //   }
  // };

  const moveToDay = (date) => {
    goToDateDay(date);
  };

  return (
    <div className="detail-main">
      <table className="table co-company-details-tbl table_legenda week-table">
        <thead>
          <tr>
            {sevenDays.map((day) => (
              <th key={day?.day}>{day?.day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {sevenDays &&
              sevenDays.map((data) => {
                const startDate = moment(data?.date).format("YYYY-MM-DD");
                const filterList = weekData.filter((details) => {
                  return (
                    moment(details.dueDate).format("YYYY-MM-DD") === startDate
                  );
                });

                return (
                  <td>
                    {filterList.map((list) => {
                      return (
                        <div
                          className="week-main"
                          onClick={() => {
                            if (userDetails && userDetails.UserType !== 6) {
                              moveToDay(list?.dueDate);
                            }
                          }}
                          style={{
                            pointerEvents: `${
                              userDetails && userDetails.UserType === 6
                                ? "none"
                                : "auto"
                            }`,
                            backgroundColor: getTaskListItemBackgroundColor(
                              userEmail,
                              list.assignTo,
                              list.approver
                            ),
                          }}
                        >
                          <div className="week-detail">
                            {/* <button className="license-code">
                            {list?.license}
                          </button> */}
                            <TaskLicense text={list?.licenseDisplay} />
                            <h2>{list?.subject}</h2>
                            <TaskStatusBox
                              status={list.status}
                              isTaskListItem
                            />
                            {/* <button
                            className={`${
                              list?.status === "Approval Pending"
                                ? "approval-day"
                                : list?.status === "Assigned" ||
                                  list?.status === "Approved"
                                ? "assigned-day"
                                : "approval-day"
                            }`}
                          >
                            {" "}
                            {list?.status === "Approval Pending"
                              ? "Approval Pending"
                              : list?.status === "Approval Pending"
                              ? "Approval Pending"
                              : list?.status}
                          </button> */}
                          </div>
                          <div className="CompanyName truncate">
                            {list?.customerName}
                          </div>
                          {list?.assignToName && (
                            <div>
                              <p className="UserNameDp mb-0">
                                <span className="circle-dp">
                                  {list?.assignToName &&
                                    getInitialName(list?.assignToName)}
                                </span>{" "}
                                <span className="user-name">
                                  {list?.assignToName}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </td>
                );
              })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeekView;
