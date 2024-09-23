import React, { useEffect, useState } from "react";
import "./style.css";
const listOfStatus = [
  {
    status: "Not Assigned",
    backgroundColor: "#fcf3cd",
    color: "#f8c102",
    listText: "Not Assigned",
    taskDetailsText: "Not Assigned",
  },
  {
    status: "Assigned",
    backgroundColor: "#dfe9ff",
    color: "#5f91ff",
    listText: "Task Assigned",
    taskDetailsText: "Task Assigned",
  },
  {
    status: "Approved",
    backgroundColor: "#cdfcd8",
    color: "#7fba7a",
    listText: "Task Approved",
    taskDetailsText: "Task Approved",
  },
  {
    status: "Approval Pending",
    backgroundColor: "#ffefea",
    color: "#ff5f31",
    listText: "Approval Pending",
    taskDetailsText: "Approval Pending",
    listTextBeforeToday: "Not reviewed",
  },
  {
    status: "Rejected",
    backgroundColor: "#ffefea",
    color: "#ff5f31",
    listText: "Task Rejected",
    taskDetailsText: "Task Rejected",
  },
  {
    status: "Expired",
    backgroundColor: "#ffefea",
    color: "#ff5f31",
    listText: "Expired",
    taskDetailsText: "Task Expired",
  },
  {
    status: "Default",
    backgroundColor: "#d2fccd",
    color: "#fcf3cd",
    listText: "",
    taskDetailsText: "",
  },
];
const TaskStatusBox = ({
  status,
  deadline_date,
  isExpertReviwerStatus,
  isTaskDetails,
  isTaskListItem = false,
}) => {
  const [currentStatus, setCurrentStatus] = useState(
    listOfStatus.find((item) => item.status === "Default")
  );
  useEffect(() => {
    if (status) {
      const _status = listOfStatus.find((item) => item.status === status);
      if (_status) setCurrentStatus(_status);
    }
  }, [status]);
  return (
    <>
      <div
        // className={`task-status__container d-none d-md-block ${
        //   isTaskDetails ? "align-center" : ""
        // }`}
        className="task-status__container d-none d-md-block"
        style={{
          borderRadius: "0.125rem",
          backgroundColor: isTaskListItem
            ? "rgb(108, 93, 211)"
            : currentStatus?.backgroundColor || "#d2fccd",
        }}
      >
        <p
          className={`task-status__text--${
            isTaskDetails ? "task-detail" : "task-list"
          }`}
          style={{
            fontWeight: "500",
            color: isTaskListItem
              ? "#ffffff"
              : currentStatus?.color || "#fcf3cd",
          }}
        >
          {/* {children} */}
          {isTaskDetails
            ? currentStatus?.taskDetailsText
              ? currentStatus?.taskDetailsText
              : ""
            : currentStatus?.listText
            ? currentStatus?.listText
            : ""}
        </p>
      </div>
      {status && status !== "Assigned" && (
        <div
          className="task-status__container d-block d-md-none"
          style={{
            backgroundColor: currentStatus?.backgroundColor || "#d2fccd",
          }}
        >
          <p
            className={`task-status__text--${
              isTaskDetails ? "task-detail" : "task-list"
            }`}
            style={{
              color: currentStatus?.color || "#fcf3cd",
            }}
          >
            {/* {children} */}
            {isTaskDetails
              ? currentStatus?.taskDetailsText
                ? currentStatus?.taskDetailsText
                : ""
              : currentStatus?.listText
              ? currentStatus?.listText
              : ""}
          </p>
        </div>
      )}
    </>
  );
};

export default TaskStatusBox;
