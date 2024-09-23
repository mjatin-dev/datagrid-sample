import React from "react";
import moment from "moment";
import "../style.css";
import assignIconCircle from "../../../../../../../assets/Icons/assignIconCircle.png";
import { useSelector, useDispatch } from "react-redux";
import { fetchTaskDetailRequest } from "SharedComponents/Dashboard/redux/actions";
import TaskLicense from "CommonModules/sharedComponents/TaskStatusBox/TaskLicense";
import TaskStatusBox from "CommonModules/sharedComponents/TaskStatusBox";
import { getTaskListItemBackgroundColor } from "CommonModules/helpers/tasks.helper";

function CustomCard(props) {
  const state = useSelector((state) => state);
  const userEmail = state?.auth?.loginInfo?.email;
  const dispatch = useDispatch();
  const { currentItem } = props;
  const userDetails = state && state.auth && state.auth.loginInfo;
  const defineStyleForDate = (props) => {
    let obj = {};
    if (props && currentItem && currentItem.status === "Overdue") {
      obj = {
        color: "red",
      };
    } else if (props && currentItem && currentItem.status === "Upcoming") {
      obj = {
        color: "rgb(27, 29, 33)",
      };
    } else if (
      props &&
      currentItem &&
      currentItem.status === "Approval Pending"
    ) {
      obj = {
        color: "rgb(27, 29, 33)",
      };
    } else {
      if (props && props.status === "Overdue") {
        obj = {
          color: "red",
        };
      } else if (props && props.status === "Upcoming") {
        obj = {
          color: "rgb(27, 29, 33)",
        };
      } else if (props && props.status === "Approval Pending") {
        obj = {
          color: "rgb(27, 29, 33)",
        };
      } else {
        obj = {
          color: "rgb(27, 29, 33)",
        };
      }
    }
    return obj;
  };
  const getInitials = (str) => {
    if (str !== "" && str) {
      var names = str.split(" "),
        initials = names[0].substring(0, 1).toUpperCase();
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
    }
    return initials;
  };
  const getDayDate = (date, flag) => {
    var today = new Date();
    var dateObj = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (dateObj.toLocaleDateString() === today.toLocaleDateString()) {
      return "Today";
    } else if (
      dateObj.toLocaleDateString() === yesterday.toLocaleDateString()
    ) {
      return "Yesterday";
    } else {
      return flag === 1
        ? moment(date).format("DD MMM YYYY")
        : moment(date).format("DD MMM");
    }
  };
  const _getAssignedName = (name) => {
    let str = "";
    if (name.length < 11) {
      str = name;
    } else {
      str = `${name.slice(0, 9)}...`;
    }
    return str;
  };

  const redirectToTaskListView = (TaskId) => {
    dispatch(fetchTaskDetailRequest(TaskId.task_name));
  };
  return (
    <div className="" key={`${currentItem.task_name}`}>
      {currentItem ? (
        <div
          style={{
            maxWidth: "100%",

            pointerEvents: `${userDetails.UserType === 6 ? "none" : "auto"}`,
            cursor: "pointer",
          }}
          className="board-tab-design"
        >
          <div
            onClick={() => {
              redirectToTaskListView(currentItem);
            }}
          >
            <div
              style={{
                backgroundColor: getTaskListItemBackgroundColor(
                  userEmail,
                  currentItem.assign_to,
                  currentItem.approver
                ),
              }}
              className="risk-pink-grid"
            >
              {/* <div className="nse-label">
                {currentItem && currentItem.license}
              </div> */}
              <div className="d-flex">
                <TaskLicense text={currentItem.license} />
                <TaskStatusBox status={currentItem.status} isTaskListItem />
              </div>
              <div className="w-100 d-flex pb-20 mt-3">
                <div className="checkIconText">
                  {currentItem && currentItem.subject}
                </div>
              </div>
              {currentItem.customer_name === "Internal Task" && (
                <div className="overdue-title task_project_name my-1">
                  {currentItem?.project_name}
                </div>
              )}
              <div className="card-company-title truncate">
                {currentItem && currentItem.customer_name}
              </div>

              <div className="w-100 d-flex">
                {currentItem && currentItem.assign_to_name !== null && (
                  <div className="d-flex w-50">
                    <div className="pjCircle">
                      <span className="pjText">
                        {" "}
                        {currentItem && getInitials(currentItem.assign_to_name)}
                      </span>
                    </div>
                    <div className="circle-flex-text">
                      {currentItem &&
                        currentItem.assign_to_name &&
                        _getAssignedName(currentItem.assign_to_name)}
                    </div>
                  </div>
                )}
                {currentItem && currentItem.assign_to_name === null && (
                  <div className="d-flex w-50">
                    <div
                      className="circle-front-text NoStatus"
                      style={{ color: "#6c5dd3" }}
                    >
                      {" "}
                      <img src={assignIconCircle} alt="" /> ASSIGN
                    </div>
                  </div>
                )}

                <div className="w-50">
                  <span style={defineStyleForDate(props)} className="red-day">
                    {currentItem &&
                      getDayDate(
                        currentItem.due_date || currentItem.deadline_date,
                        2
                      )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="board-tab-design">
          <div className="risk-pink-grid">
            <span>No tasks available</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default CustomCard;
