/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { MdAdd, MdInfo, MdKeyboardArrowDown } from "react-icons/md";
import assignIconRound from "../../../assets/Icons/assignIconCircle.png";
import Dots from "../../../CommonModules/sharedComponents/Loader/Dots";
import { splitCamelCaseString } from "../../../CommonModules/helpers/string.helpers";
import TaskStatusBox from "../../../CommonModules/sharedComponents/TaskStatusBox";
import styles from "./styles.module.scss";
import { getInitialName } from "../../../CommonModules/helpers/GetIntialName.helper";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchImpactDetailsByTaskId,
  fetchTaskDetailRequest,
  fetchTasksByFilterRequest,
} from "../redux/actions";
import { isShowProjectModule } from "app.config";
import TaskLicense from "CommonModules/sharedComponents/TaskStatusBox/TaskLicense";
import { getTaskListItemBackgroundColor } from "CommonModules/helpers/tasks.helper";
import { IconButton } from "@mui/material";

const TaskAccordion = ({ data, currentViewByFilter, isLeftBar = false }) => {
  const { count, tasks, keyName, keyId } = data;
  const { isLoading, loadingKey } = useSelector(
    (state) => state?.DashboardState?.tasksByFilter
  );
  const dispatch = useDispatch();
  const [tasksList, setTasksList] = useState([]);
  const [limits, setLimits] = useState({ limit: 6, offset: 0 });
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  useEffect(() => {
    if (tasks?.length > 0) {
      setTasksList(tasks);
    }
  }, [tasks]);

  const onLoadMoreClick = () =>
    setLimits({ ...limits, offset: limits.offset + 1 });

  useEffect(() => {
    if (limits?.offset > 0) {
      dispatch(
        fetchTasksByFilterRequest({
          ...limits,
          key: keyId || keyName,
        })
      );
    }
  }, [limits]);
  return (
    count > 0 && (
      <div className={`${styles.taskAccordionContainer} mb-5 mx-auto`}>
        <div
          className={`d-flex justify-content-between align-items-center mx-auto mb-3 ${
            !isLeftBar ? "pr-4" : ""
          }`}
          style={{ ...(isLeftBar && { width: "calc(100% - 4rem)" }) }}
        >
          <div
            className={`d-flex align-items-center cursor-pointer ${styles.taskAccordionHeader}`}
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          >
            <p
              className={`mb-0 mr-2 ${styles.taskAccordionTitle} ${
                styles[`taskAccordionTitle__${keyName?.toLowerCase()}`]
              } truncate`}
              style={{
                maxWidth: isLeftBar ? "180px" : "40vw",
              }}
            >
              {splitCamelCaseString(keyName)}
            </p>
            <div
              className={`initial-name__container mr-2 ${
                styles.taskAccordionCount
              } ${styles[`taskAccordionCount__${keyName?.toLowerCase()}`]}`}
            >
              <span className="initial-name">{count}</span>
            </div>
            <MdKeyboardArrowDown
              className={`${styles.taskAccordionDropdownIcon} ${
                isAccordionOpen ? styles.taskAccordionDropdownIcon__active : ""
              }`}
            />
          </div>
        </div>
        {isAccordionOpen && (
          <>
            {tasksList &&
              tasksList?.length > 0 &&
              tasksList.map((task, index) => {
                return (
                  <TaskListItem
                    key={`task-list-item-${task?.taskId}-${index}`}
                    data={task}
                    currentViewByFilter={currentViewByFilter}
                    isLeftBar={isLeftBar}
                  />
                );
              })}

            {isLoading && (loadingKey === keyName || loadingKey === keyId) ? (
              <Dots />
            ) : (
              tasksList?.length < count && (
                <p
                  className={`mb-0 ml-1 mt-2 cursor-pointer ${styles.taskListItemText} ${styles.taskListItemText__assign}`}
                  onClick={() => onLoadMoreClick()}
                  style={{ ...(isLeftBar && { padding: "0 2rem" }) }}
                >
                  <MdAdd className={styles.taskAccordionDropdownIcon} />
                  &nbsp;Load&nbsp;
                  {count - tasksList?.length >= 6
                    ? 6
                    : count - tasksList?.length}
                  &nbsp;More&nbsp;
                  {`(${tasksList.length}/${count})`}
                </p>
              )
            )}
          </>
        )}
      </div>
    )
  );
};

export const TaskListItem = ({
  currentViewByFilter = "Status",
  data,
  isLeftBar,
}) => {
  const dispatch = useDispatch();
  const currentOpenedTaskId = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.id
  );
  const userEmail = useSelector((state) => state.auth.loginInfo.email);
  const userName = useSelector((state) => state.auth.loginInfo.UserName);
  const userType = useSelector((state) => state.auth.loginInfo.UserType);
  const {
    subject,
    licenseDisplay,
    customerName,
    status,
    dueDate,
    assignTo,
    assignedToName,
    projectName,
    taskId,
    approverName,
    approver,
    assignedByUser,
    assignedBy,
    statusDate,
    impactFlag,
  } = data;
  const overviewName =
    status === "Assigned"
      ? assignedToName || assignTo
      : status === "Approval Pending"
      ? approverName ||
        approver ||
        assignedByUser ||
        assignedBy ||
        (userType === 3 ? userName || userEmail : assignedToName || assignTo)
      : assignedByUser ||
        assignedBy ||
        (userType === 3
          ? userName || userEmail
          : assignedToName || assignTo || null);

  return (
    <div
      className={`row ${
        !isLeftBar && "mb-2 p-2"
      } mx-auto cursor-pointer no-gutters  ${styles.taskItemContainer} ${
        currentOpenedTaskId === taskId && isLeftBar
          ? styles.taskItemContainerActive
          : ""
      } ${isLeftBar && "justify-content-between"}`}
      style={{
        ...(isLeftBar && { padding: "1rem 2rem" }),
        ...(!isLeftBar && { borderRadius: "0.25rem" }),
        backgroundColor: getTaskListItemBackgroundColor(userEmail, assignTo),
      }}
      onClick={() => dispatch(fetchTaskDetailRequest(taskId))}
    >
      <div className="d-flex col-12 mb-2">
        {currentViewByFilter !== "License" && (
          <TaskLicense text={licenseDisplay} />
        )}
        <TaskStatusBox status={status} isTaskListItem={true} />
      </div>
      <div
        className={`col-10 col-sm-11 col-md-${
          (currentViewByFilter === "Status" ||
            currentViewByFilter === "License") &&
          !isLeftBar
            ? "5"
            : isLeftBar
            ? "11"
            : "8"
        }`}
      >
        <p title={subject} className={`mb-1 ${styles.taskListItemText}`}>
          {subject}
        </p>
        {customerName === "Internal Task" && isShowProjectModule && (
          <p
            title={projectName}
            className={`mb-1 ${styles.taskListItemText} ${styles.taskListItemText__projectName}`}
          >
            {projectName}
          </p>
        )}
        <p
          className={`mb-0 d-block d-md-none ${styles.taskListItemText} ${styles.taskListItemText__dueDateSmall}`}
        >
          {moment(dueDate).format("DD MMM YYYY")}
        </p>
      </div>
      {currentViewByFilter !== "Company" && !isLeftBar && (
        <div className="col-2 d-none d-md-block">
          <p
            className={`mb-0 ${styles.taskListItemText} ${styles.taskListItemText__companyName}`}
          >
            {customerName}
          </p>
        </div>
      )}

      {currentViewByFilter !== "Team" && !isLeftBar && (
        <div className="col-2 align-items-start cursor-pointer d-none d-md-flex">
          {status !== "Not Assigned" && overviewName ? (
            <>
              <div className="initial-name__container mr-2">
                <span className="initial-name">
                  {getInitialName(overviewName)}
                </span>
              </div>
              <p
                title={overviewName}
                className={`mb-0 ${styles.taskListItemText} ${styles.taskListItemText__companyName}`}
              >
                {overviewName}
              </p>
            </>
          ) : (
            <>
              <img src={assignIconRound} alt="assign" />
              <p
                className={`mb-0 ml-1 ${styles.taskListItemText} ${styles.taskListItemText__assign}`}
              >
                assign
              </p>
            </>
          )}
        </div>
      )}
      {!isLeftBar && (
        <div className="col-2 d-none d-md-block">
          <p className={`mb-0 ${styles.taskListItemText}`}>
            {moment(status === "Approved" ? statusDate : dueDate).format(
              "DD MMM YYYY"
            )}
          </p>
        </div>
      )}
      {!isLeftBar && impactFlag && (
        <div className="col-1">
          <IconButton
            size="small"
            title="Impact"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                fetchImpactDetailsByTaskId({
                  task_name: taskId,
                  isShow: true,
                  data: null,
                  isLoading: true,
                })
              );
            }}
            style={{ marginTop: "-0.5rem" }}
          >
            <MdInfo style={{ color: "#7a73ff" }} />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default TaskAccordion;
