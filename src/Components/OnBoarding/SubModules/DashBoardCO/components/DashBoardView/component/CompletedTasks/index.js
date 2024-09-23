/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import delayCloseIcon from "../../../../../../../../assets/Icons/delayCloseIcon.png";
import keyboardArrowRightBlack from "../../../../../../../../assets/Icons/keyboardArrowRightBlack.png";
import moment from "moment";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { actions as taskReportActions } from "../../../../redux/actions";
import { actions as adminMenuActions } from "../../../../MenuRedux/actions";
import {
  getAllTasks,
  getDataByStatus,
} from "../../../../../../../../CommonModules/helpers/tasks.helper";
import TaskStatusBox from "../../../../../../../../CommonModules/sharedComponents/TaskStatusBox";
import Loading from "../../../../../../../../CommonModules/sharedComponents/Loader";
import { fetchTaskDetailRequest } from "SharedComponents/Dashboard/redux/actions";

function CompletedTasks({ history }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const click = useSelector((state) => state?.adminMenu?.takeActionActiveTab);
  const setClick = (payload) =>
    dispatch(adminMenuActions.setTakeActionTab(payload));
  const [pendingArr, setPendingArr] = useState([]);

  const userDetails = state && state.auth && state.auth.loginInfo;

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
  const taskList =
    state &&
    state.taskReport &&
    state.taskReport.taskReport &&
    state.taskReport.taskReport.taskReport &&
    state.taskReport.taskReport.taskReport;
  const taskLoader = state?.taskReport?.loader;
  const getSelectTaskDetails = (task) => {
    dispatch(fetchTaskDetailRequest(task.task_name));
  };
  useEffect(() => {
    if (taskList && taskList.length > 0) {
      try {
        const taskDetail = getDataByStatus(taskList);
        const pending = taskDetail.filter(
          (task) => task.status === "Completed"
        )[0]?.tasks;

        setPendingArr([
          ...(pending && typeof pending === "object" ? pending : []),
        ]);
      } catch (error) {
        console.log(error);
      }
    }
  }, [click, taskList]);

  return (
    <>
      <div className="task-grid-scroll customScrollSecond scroll-btm">
        <div className="mobile-dashboard-view">
          <div className="take-action" style={{ height: "90vh" }}>
            <div className="task-list-grid">
              <div className="upcoming-btn-pending">
                <div className="pink-circle-closing">
                  <div className="pink-label-close">Completed Tasks</div>
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => setClick("")}
                    className="pink-label-close-icon"
                    src={delayCloseIcon}
                    alt=""
                  />
                </div>
              </div>
              {taskList?.length > 0 &&
              !taskLoader &&
              pendingArr &&
              pendingArr.length > 0 ? (
                pendingArr.map((task) => {
                  return (
                    <>
                      <Link
                        to={{
                          pathname: "/dashboard",
                          state: { handleBack: true },
                        }}
                        onClick={() => {
                          getSelectTaskDetails(task);
                        }}
                        style={{
                          pointerEvents: `${
                            userDetails && userDetails.UserType === 6
                              ? "none"
                              : "auto"
                          }`,
                          textDecoration: "none",
                        }}
                        key={task?.task_name}
                      >
                        <div className="row mb-16">
                          <div className="col-10 col-md-5 col-sm-5 col-xl-5">
                            <div className="all-companies-sub-title new-task-list">
                              <div className="pending-list-mobile">
                                <div className="graybox-left">
                                  <span className="all-companies-nse-label">
                                    {task?.license_display}
                                  </span>
                                </div>
                                <span className="pink-label-title-right">
                                  <div className="overdue-title">
                                    {task?.subject}
                                  </div>
                                  {task.customer_name === "Internal Task" && (
                                    <div
                                      className="overdue-title task_project_name"
                                      onClick={(e) =>
                                        getSelectTaskDetails(task)
                                      }
                                    >
                                      {task?.project_name}
                                    </div>
                                  )}
                                  <div className="black-week d-block d-sm-none">
                                    <div className="d-block d-sm-none">
                                      Today
                                    </div>
                                  </div>
                                  <TaskStatusBox status={task.status} />
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-2 col-md-2 col-sm-2 col-xl-2 d-none d-sm-block">
                            <div className="circle-front-text" value="717149">
                              {task.customer_name}
                            </div>
                          </div>
                          <div className="col-2 col-md-3 col-sm-3 col-xl-3 d-none d-sm-block">
                            {task && task.assign_to && (
                              <div className="d-flex new-task-list">
                                <div className="circle-name d-none d-sm-block">
                                  <div className="circle-text">
                                    {getInitials(task && task.assign_to)}
                                  </div>
                                </div>
                                <div className="circle-front-text d-none d-sm-block mail">
                                  {task.assign_to}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-2">
                            <div className="align-right task-list-new">
                              <div className="d-flex">
                                <div className="black-week d-none d-sm-block">
                                  {moment(task && task.deadline_date).format(
                                    "DD MMM"
                                  )}
                                </div>
                                <div className="right-arrow-week text-right-grid">
                                  <img
                                    className="d-none d-sm-block"
                                    src={keyboardArrowRightBlack}
                                    alt="Right Arrow"
                                  />
                                  <img
                                    class="d-block d-sm-none"
                                    src={keyboardArrowRightBlack}
                                    alt="Right Arrow"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </>
                  );
                })
              ) : taskLoader ? (
                <div className="mt-5">
                  <Loading isInline />
                </div>
              ) : (
                <p className="text-center">No task found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withRouter(CompletedTasks);
