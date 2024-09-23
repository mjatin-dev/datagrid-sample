/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import styles from "./style.module.scss";
import "../BoardView/style.css";
import Modal from "react-awesome-modal";
import AssigneList from "./component/AssignedView.js";
import CompanyTaskList from "./component/companyList.js";
import LicenseTaskList from "./component/LicenseTaskList.js";
import { Link, withRouter } from "react-router-dom";
import { useDropdownOuterClick } from "../RightSideGrid/dropdownOuterClick";
import redArrowTop from "../../../../../../assets/Icons/redArrowTop.png";
import keyboardArrowRightBlack from "../../../../../../assets/Icons/keyboardArrowRightBlack.png";
import downArrow from "../../../../../../assets/Icons/downArrow.png";

import upArrow from "../../../../../../assets/Icons/topArrowAccordian.png";
import RedLine from "../../../../../../assets/Icons/RedLine.png";
import { isMobile } from "react-device-detect";
import assignIconCircle from "../../../../../../assets/Icons/assignIconCircle.png";
import viewAllArow from "../../../../../../assets/Icons/viewAllArow.png";
import viewAllArowTop from "../../../../../../assets/Icons/viewAllArowTop.png";
import closeIconGray from "../../../../../../assets/Icons/closeIconGray.png";
import searchIcon from "../../../../../../assets/Icons/searchIcon.png";
import { toast } from "react-toastify";
import moment from "moment";
import { useOuterClick } from "../RightSideGrid/outerClick.js";
import { useSelector, useDispatch } from "react-redux";
import { actions as taskReportActions } from "../../redux/actions";
import MobileLeftSidebar from "../MobileLeftSidebar";

import BoardView from "../BoardView/index";
import dropdownBottomArrow from "../../../../../../assets/Icons/dropdownBottomArrow.png";
import dropdownCheckIcon from "../../../../../../assets/Icons/dropdownCheckIcon.png";

import RiskAndDelaysTaskList from "./component/RiskAndDelaysTaskList";
import PendingAction from "./component/PendingAction";
import View from "../../../../../CalenderView/View";
import { getDataByStatus } from "../../../../../../CommonModules/helpers/tasks.helper";
import TaskStatusBox from "../../../../../../CommonModules/sharedComponents/TaskStatusBox";
import { actions as adminMenuActions } from "../../MenuRedux/actions";
import Loading from "../../../../../../CommonModules/sharedComponents/Loader";
import Auditor from "../Auditor";
import CompletedTasks from "./component/CompletedTasks";
import ScheduledTasks from "./component/ScheduledTasks";
import { fetchTaskDetailRequest } from "SharedComponents/Dashboard/redux/actions";

const getAuditScreen = (userTypeNo) => {
  let html = null;
  if (
    userTypeNo === 9 ||
    userTypeNo === 8 ||
    userTypeNo === 16 ||
    userTypeNo === 3 ||
    userTypeNo === 13 ||
    userTypeNo === 14
  ) {
    html = <Auditor />;
  } else {
    html = <div className="text-center mt-4">No Data</div>;
  }
  return html;
};

function RightSideGrid({ isTaskListOpen, user }) {
  const searchInput = useRef(null);
  const tabs = ["Tasks", "Audit"];
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [openBoardDrD, setOpenBoardDrp] = useState(false);
  const state = useSelector((state) => state);
  const auditUserType = state && state?.auth?.loginInfo?.auditUserType;
  const checklistExist = state && state.auth.loginInfo.checklist_exist;
  const questionExist = state && state.auth.loginInfo.question_exist;
  const dispatch = useDispatch();
  const click = useSelector((state) => state?.adminMenu?.takeActionActiveTab);
  const setClick = (payload) =>
    dispatch(adminMenuActions.setTakeActionTab(payload));
  const setListView = (payload) =>
    dispatch(adminMenuActions.setDashboardViewType(payload));
  const [currentBoardViewBy, setCurrentBoardViewBy] = useState("status");
  const [rejectTaskInput, setRejectTaskInputComment] = useState("");
  const [visibleRejectTaskModal, setVisibleRejectTaskModal] = useState(false);

  const [searchBoxShow, setsearchBoxShow] = useState(false);

  const [searchBoxShowMobile, setsearchBoxShowMobile] = useState(false);

  const [listTaskData, setListTaskData] = useState("");
  const [expandedFlags, setExpandedFlags] = useState([0, 1, 2]);
  const [rowCount, setRowCount] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [showUserToolTip, setShowUserToolTip] = useState("");
  const [today, setToday] = useState(new Date());
  const taskListDisplay = useSelector(
    (state) => state?.adminMenu?.currentFilterViewBy
  );
  const setTaskListDisplay = (payload) =>
    dispatch(adminMenuActions.setCurrentFilterMenuViewBy(payload));
  const displayTask = useSelector(
    (state) => state?.adminMenu?.dashboardCurrentTab
  );
  const setDisplayTask = (payload) =>
    dispatch(adminMenuActions.setDashboardTab(payload));
  const [mobileViewBy, setMobileViewBy] = useState(false);

  const getTaskById =
    state &&
    state.taskReport &&
    state.taskReport.taskReportById &&
    state.taskReport.taskReportById.taskReportById;
  const taskList =
    state &&
    state.taskReport &&
    state.taskReport.taskReport &&
    state.taskReport.taskReport.taskReport &&
    state.taskReport.taskReport.taskReport;
  const taskLoader = state?.taskReport?.loader;
  useEffect(() => {
    if (taskListDisplay === "status") {
      if (taskList && taskList.length > 0) {
        const tempRowCount = {};
        const taskByStatus = getDataByStatus(taskList);
        [...taskByStatus].forEach((item) => {
          if (item.tasks.length > 0) {
            tempRowCount[item.status.trim()] = 3;
          }
        });
        setRowCount(tempRowCount);
        setListTaskData(taskByStatus);
      }
    }
  }, [taskList, taskListDisplay, displayTask]);

  useEffect(() => {
    const ApproverUsers =
      state &&
      state.taskReport &&
      state.taskReport.getUserByRole &&
      state.taskReport.getUserByRole.getUserByRole;

    if (ApproverUsers !== undefined) {
      let temp = [];
      ApproverUsers &&
        ApproverUsers.length > 0 &&
        ApproverUsers.forEach((obj1) => {
          obj1 &&
            obj1.GEN_Users &&
            obj1.GEN_Users.forEach((obj2) => {
              temp.push(obj2);
            });
        });
    }
  }, [state.taskReport.getUserByRole]);

  const innerRefDrop = useDropdownOuterClick((e) => {
    if (openBoardDrD === true && !e.target.id.includes("dropDown")) {
      setOpenBoardDrp(false);
    }
  });
  useEffect(() => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const mm = monthNames[today.getMonth()];
    var yyyy = today.getFullYear();
    today = dd + " " + mm + " " + yyyy;
    setToday(today);
  }, [getTaskById]);

  const innerSearch = useOuterClick((e) => {
    if (searchBoxShow && searchData.length === 0) {
      setsearchBoxShow(false);
      setSearchValue("");
    }
  });

  const innerSearchMobile = useOuterClick((e) => {
    if (searchBoxShowMobile && searchData?.length === 0) {
      setsearchBoxShowMobile(false);
      setSearchValue("");
    }
  });

  const userDetails = state && state.auth && state.auth.loginInfo;

  const getInitials = (str) => {
    if (str !== "" && str) {
      var names = str.split(" "),
        initials = names[0].substring(0, 1)?.toUpperCase();
      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1)?.toUpperCase();
      } else if (names.length === 1) {
        initials = names[0].substring(0, 2)?.toUpperCase();
      }
    }
    return initials;
  };

  const submitModal = () => {
    let id = getTaskById.TaskId;
    dispatch(
      taskReportActions.taskAssignByTaskID({
        taskID: id,
        userType: 1,
        email: "",
        invitee: "",
        isApproved: 3,
        loginID: userDetails.UserID,
        userDetails: userDetails,
      })
    );
    dispatch(
      taskReportActions.postTaskCommentByTaskID({
        actionFlag: 1, //Action Flag
        taskID: getTaskById.TaskId, //TaskID
        comment: rejectTaskInput,
        commentBy: user.UserID, //UserID
      })
    );
    setRejectTaskInputComment("");
    setVisibleRejectTaskModal(false);
    toast.success("Task rejected successfully");
  };

  const handleChangeRejectTaskComment = (e) => {
    e.preventDefault();
    setRejectTaskInputComment(e.target.value);
  };

  const renderRejectTaskModal = () => {
    return (
      <Modal
        onClickAway={() => setVisibleRejectTaskModal(false)}
        visible={visibleRejectTaskModal}
        width="373px"
        height="265px"
      >
        <div className="model-design-reject">
          <div className="reject-model-title">
            Enter a reason for rejecting the task
          </div>
          <div className="white-bottom">
            <div className="form-group">
              <label htmlFor="comment">Comment:</label>
              <textarea
                className="form-control"
                placeholder="Enter the reason for rejecting this task."
                value={rejectTaskInput}
                onChange={(e) => handleChangeRejectTaskComment(e)}
                rows="5"
                id="comment"
                name="rejectTaskComment"
              ></textarea>
              <div className="text-count-area">0/200</div>
            </div>
            <div className="btn-group float-right">
              <button
                type="submit"
                onClick={() => setVisibleRejectTaskModal(false)}
                className="btn cancel-btn-reject mr-2"
              >
                Cancel
              </button>
              <button
                disabled={rejectTaskInput === ""}
                type="submit"
                onClick={() => submitModal()}
                className="btn reject-submit-btn"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const getSelectTaskDetails = (task) => {
    dispatch(fetchTaskDetailRequest(task.task_name));
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

  const clearSearch = () => {
    setsearchBoxShow(false);
    setsearchBoxShowMobile(false);
    setSearchValue("");
  };

  const closeMobileSidebar = () => {
    const drawerParent = document.getElementById("sideBarParent");
    const drawerChild = document.getElementById("sideBarChild");
    if (drawerParent) {
      drawerParent.classList.remove("overlay");
      drawerChild.style.left = "-100%";
    }
  };

  const showLessMore = (status, count) => {
    let tempRowCnt = { ...rowCount };
    tempRowCnt[status.trim()] = count;
    setRowCount(tempRowCnt);
  };

  const handleExpandList = (flag, index) => {
    let tempExtend = [...expandedFlags];
    if (flag === "show") {
      tempExtend.push(index);
    } else {
      tempExtend = tempExtend.filter((item) => item !== index);
    }
    setExpandedFlags(tempExtend);
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

  const handleSearch = (searchText) => {
    setSearchValue(searchText);
    let tempArr = [];
    if (searchText !== "") {
      let searchQuery = searchText?.toLowerCase();
      listTaskData &&
        listTaskData.length !== 0 &&
        listTaskData.forEach((tasksByStatus) => {
          tasksByStatus.tasks.forEach((task) => {
            if (task.subject !== "" && task.subject !== "Norec") {
              if (
                task?.subject?.toLowerCase().includes(searchQuery) ||
                task?.customer_name?.toLowerCase().includes(searchQuery) ||
                task?.license?.toLowerCase().includes(searchQuery) ||
                task?.assign_to_name?.toLowerCase().includes(searchQuery)
              ) {
                let searchResults = {
                  status: tasksByStatus.status,
                  data: task,
                };
                tempArr.push(searchResults);
              }
            }
          });
        });
      setSearchData(tempArr);
    }
  };
  useEffect(() => {
    searchInput.current && searchInput.current.focus();
  }, [searchBoxShow]);

  function handleFocus() {
    setsearchBoxShow(true);
    searchInput.current && searchInput.current.focus();
  }

  const renderTaskList = (task, Status, listType) => {
    return (
      <Link
        to={{ pathname: "/dashboard", state: { handleBack: true } }}
        onClick={() => {
          getSelectTaskDetails(task);
        }}
        style={{
          textDecoration: "none",
          ...(userDetails &&
            userDetails.UserType === 6 && { pointerEvents: "none" }),
        }}
        key={task?.task_name}
      >
        <div
          className="row"
          style={{ marginBottom: "15px", position: "relative" }}
        >
          {listType === 1 && Status === "Overdue" && (
            <div className="redWidth">
              <div className="redLine">
                {" "}
                <img src={RedLine} alt="" />
              </div>
            </div>
          )}
          <div className="col-10 col-md-5 col-sm-5 col-xl-5">
            <div className="all-companies-sub-title new-task-list">
              <div
                onClick={(e) => getSelectTaskDetails(task)}
                style={{ cursor: "pointer", display: "flex" }}
              >
                <div className="graybox-left">
                  <span className="all-companies-nse-label">
                    {task.license_display}
                  </span>
                </div>
                <span className="pink-label-title-right">
                  <div className="overdue-title">{task.subject}</div>
                  {task.customer_name === "Internal Task" && (
                    <div
                      className="overdue-title task_project_name"
                      onClick={(e) => getSelectTaskDetails(task)}
                    >
                      {task?.project_name}
                    </div>
                  )}
                  <div
                    className={
                      Status === "Overdue"
                        ? "red-week d-block d-sm-none"
                        : "black-week d-block d-sm-none"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={(e) => getSelectTaskDetails(task)}
                  >
                    <div className="d-block d-sm-none">
                      {getDayDate(task.due_date, 2)}
                    </div>
                  </div>
                  <TaskStatusBox status={task.status} />
                </span>
              </div>
            </div>
          </div>
          <div className="col-2 col-md-2 col-sm-2 col-xl-2 d-none d-sm-block">
            <div
              className="circle-front-text"
              style={{ width: "fit-content", cursor: "pointer" }}
              value={task.TaskId}
              onClick={(e) => getSelectTaskDetails(task)}
            >
              {task.customer_name}
            </div>
          </div>
          <div
            className="col-2 col-md-3 col-sm-3 col-xl-3 d-none d-sm-block"
            style={{ cursor: "pointer" }}
            onClick={(e) => getSelectTaskDetails(task)}
          >
            {task.assign_to ? (
              <div className="d-flex new-task-list">
                {userDetails.UserType === 4 ? (
                  task.approver === null ? null : (
                    <div className="circle-name d-none d-sm-block">
                      <div className="circle-text">
                        {userDetails.UserType === 4 &&
                          getInitials(task.approver_name)}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="circle-name d-none d-sm-block">
                    <div className="circle-text">
                      {getInitials(task.assign_to_name)}
                    </div>
                  </div>
                )}

                {userDetails.UserType === 4 ? (
                  <div className="circle-front-text d-none d-sm-block">
                    {task.approver === null
                      ? "No Approver"
                      : task.approver_name}
                  </div>
                ) : (
                  <div className="circle-front-text d-none d-sm-block mail">
                    {_getAssignedName(task.assign_to_name)}
                  </div>
                )}
              </div>
            ) : userDetails.UserType === 3 ? (
              <div>
                <div className="circle-front-text NoStatus">
                  {" "}
                  <img src={assignIconCircle} alt="" /> ASSIGN
                </div>
              </div>
            ) : null}
          </div>
          <div className="col-2">
            <div className="align-right task-list-new">
              <div className="d-flex">
                <div
                  className={
                    Status === "Overdue"
                      ? "red-week d-none d-sm-block"
                      : "black-week d-none d-sm-block"
                  }
                  style={{ cursor: "pointer" }}
                  onClick={(e) => getSelectTaskDetails(task)}
                >
                  {getDayDate(task.due_date, 1)}
                </div>
                <div
                  className="right-arrow-week text-right-grid"
                  onClick={(e) => getSelectTaskDetails(task)}
                >
                  {
                    <img
                      className="d-none d-sm-block"
                      src={keyboardArrowRightBlack}
                      alt="Right Arrow"
                    />
                  }
                  {task.assign_to !== null && (
                    <img
                      className="d-block d-sm-none"
                      src={keyboardArrowRightBlack}
                      alt="Right Arrow"
                    />
                  )}
                  {showUserToolTip === `Tooltip${task.task_name}` && (
                    <div className="toolTip-input">
                      <div className="tooltiptext1 mobDisplaynone">
                        <span className="font-normal-text1">
                          {task.assign_to_name}
                        </span>
                      </div>
                    </div>
                  )}
                  {task.assign_to === null && (
                    <div className="only-mobile-assign-add d-block d-sm-none">
                      <div
                        className="assign-user-icon"
                        onMouseOver={() =>
                          setShowUserToolTip(`Tooltip${task.task_name}`)
                        }
                        onMouseOut={() => setShowUserToolTip("")}
                      >
                        <img
                          src={assignIconCircle}
                          className="d-block d-sm-none"
                          alt="Assign Circle"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {Status === "Overdue" && searchValue === "" && (
            <div className="redWidth-bottom">
              <div className="redLine">
                {" "}
                <img src={RedLine} alt="" />
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <>
      {click === "riskAndDelays" ? (
        <div className="all-companies-task-grid mobile-dashboard-view">
          <RiskAndDelaysTaskList
            click={click}
            setClick={setClick}
            user={user}
          />
        </div>
      ) : click === "pendingAction" || click === "notAssigned" ? (
        <div className="all-companies-task-grid mobile-dashboard-view">
          <PendingAction click={click} setClick={setClick} user={user} />
        </div>
      ) : click === "completed" || click === "notAssigned" ? (
        <div className="all-companies-task-grid mobile-dashboard-view">
          <CompletedTasks click={click} setClick={setClick} user={user} />
        </div>
      ) : click === "scheduled" || click === "notAssigned" ? (
        <div className="all-companies-task-grid mobile-dashboard-view">
          <ScheduledTasks click={click} setClick={setClick} user={user} />
        </div>
      ) : (
        <>
          {visibleRejectTaskModal && renderRejectTaskModal()}
          {!isTaskListOpen && (
            <div className="all-companies-task-grid mobile-dashboard-view">
              {isMobile && (
                <div id="sideBarParent" className="">
                  <div id="sideBarChild" className="leftSideBarFixed">
                    <MobileLeftSidebar
                      className="d-block d-sm-none"
                      close={() => closeMobileSidebar()}
                    />
                  </div>
                </div>
              )}
              <>
                <div className={styles.content}>
                  <div className={styles.header}>
                    {tabs.map((tab) => (
                      <div
                        className={`${styles.tab} ${
                          currentTab === tab && styles.tabActive
                        }`}
                        onClick={() => setCurrentTab(tab)}
                      >
                        {tab}
                      </div>
                    ))}
                  </div>
                </div>

                {currentTab === "Tasks" ? (
                  <div>
                    <div className="d-flex mobile-height-dasboardView">
                      <div className="companies-sub-title w-25 d-none d-sm-block">
                        Tasks
                      </div>

                      <div className="w-75 d-none d-sm-block">
                        {!searchBoxShow && (
                          <div
                            className="only-search-icon"
                            onClick={handleFocus}
                          >
                            <img src={searchIcon} alt="sidebar Check Icon" />
                          </div>
                        )}
                        {searchBoxShow && (
                          <div
                            className="searchBox d-none d-sm-block"
                            ref={innerSearch}
                          >
                            <div className="input-group form-group">
                              <img
                                className="IconGray"
                                src={searchIcon}
                                alt="search Icon"
                              />
                              <input
                                ref={searchInput}
                                autofocus
                                className="form-control mozilla-py"
                                type="text"
                                placeholder="Search for teams, licenses, Companies etc"
                                onChange={(e) => handleSearch(e.target.value)}
                                value={searchValue}
                              />
                              <span className="input-group-append">
                                <button
                                  className="btn border-start-0 border-top-0 border-bottom-0 border-0 ms-n5"
                                  type="button"
                                >
                                  <img
                                    src={closeIconGray}
                                    alt="close Icon"
                                    onClick={() => clearSearch()}
                                  />
                                </button>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="d-flex pl-0">
                        <div
                          className="overview-mobile d-block d-sm-none"
                          onClick={() => setListView("0")}
                        >
                          Overview
                        </div>
                        <div className="companies-sub-title d-block d-sm-none">
                          Tasks
                        </div>
                      </div>

                      <div
                        className={
                          searchBoxShowMobile
                            ? "col-12 d-block d-sm-none"
                            : "col-5 d-block d-sm-none mobile"
                        }
                      >
                        {!searchBoxShowMobile && (
                          <div
                            className="only-search-icon m-0"
                            onClick={() => setsearchBoxShowMobile(true)}
                          >
                            <img src={searchIcon} alt="sidebar Check Icon" />
                          </div>
                        )}
                        {searchBoxShowMobile && (
                          <div className="searchBox" ref={innerSearchMobile}>
                            <div className="input-group form-group">
                              <img
                                className="IconGray"
                                src={searchIcon}
                                alt="search Icon"
                              />
                              <input
                                className="form-control"
                                type="text"
                                placeholder="Search for teams, licenses, Companies etc"
                                onChange={(e) => handleSearch(e.target.value)}
                                value={searchValue}
                              />
                              <span className="input-group-append">
                                <button
                                  className="btn border-start-0 border-top-0 border-bottom-0 border-0 ms-n5"
                                  type="button"
                                >
                                  <img
                                    src={closeIconGray}
                                    onClick={() => clearSearch()}
                                    alt="close Icon"
                                  />
                                </button>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="task-details-file-grid task-details-file-grid-dashboard custimDesignTask"
                      style={{ position: "relative" }}
                    >
                      {searchValue !== "" && (
                        <div className="file-title">Search Results: </div>
                      )}
                      {searchValue === "" && (
                        <span>
                          <span
                            className={
                              displayTask === "List"
                                ? "file-title-active"
                                : "file-title-inactive"
                            }
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              setDisplayTask("List");
                              setTaskListDisplay("status");
                            }}
                          >
                            List
                          </span>
                          {displayTask === "List" && (
                            <div className="file-title-progress"></div>
                          )}
                          <span
                            className={
                              displayTask === "Calender"
                                ? "file-title-active"
                                : "file-title-inactive"
                            }
                            style={{ marginLeft: "40px", cursor: "pointer" }}
                            onClick={(e) => {
                              setDisplayTask("Calender");
                              setTaskListDisplay("status");
                            }}
                          >
                            Calendar
                          </span>
                          {displayTask === "Calender" && (
                            <div
                              className="file-title-progress"
                              style={{ left: "67px", width: "90px" }}
                            ></div>
                          )}
                          <span
                            className={
                              displayTask === "Board"
                                ? "file-title-active"
                                : "file-title-inactive"
                            }
                            style={{ marginLeft: "40px", cursor: "pointer" }}
                            onClick={(e) => {
                              setDisplayTask("Board");
                              setTaskListDisplay("status");
                            }}
                          >
                            Board
                          </span>
                          {displayTask === "Board" && (
                            <div
                              className="file-title-progress"
                              style={{ left: "190px", width: "65px" }}
                            ></div>
                          )}
                        </span>
                      )}
                      {((searchValue === "" && displayTask === "List") ||
                        (searchValue === "" && displayTask === "Board")) && (
                        <div className="take-action mb-0 d-none d-md-block view-by__status-box">
                          <ul
                            className="pull-right my-2"
                            style={{ float: "right" }}
                          >
                            <span
                              style={{
                                fontSize: "10px",
                                backgroundColor: "transparent",
                              }}
                            >
                              View by
                            </span>
                            <span
                              className={
                                taskListDisplay === "status" ? "active" : ""
                              }
                              style={{
                                fontSize: "10px",
                                marginLeft: "10px",
                                paddingLeft: "6px",
                                paddingRight: "6px",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                if (displayTask === "List") {
                                  setTaskListDisplay("status");
                                  setDisplayTask("List");
                                }
                                if (displayTask === "Board") {
                                  setTaskListDisplay("status");
                                  setDisplayTask("Board");
                                }
                              }}
                            >
                              Status
                            </span>
                            <span
                              className={
                                taskListDisplay === "company" ? "active" : ""
                              }
                              style={{
                                fontSize: "11px",
                                marginLeft: "10px",
                                paddingLeft: "6px",
                                paddingRight: "6px",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                if (displayTask === "List") {
                                  setTaskListDisplay("company");
                                  setDisplayTask("List");
                                }
                                if (displayTask === "Board") {
                                  setTaskListDisplay("company");
                                  setDisplayTask("Board");
                                }
                              }}
                            >
                              Company
                            </span>
                            <span
                              className={
                                taskListDisplay === "license" ? "active" : ""
                              }
                              style={{
                                fontSize: "11px",
                                marginLeft: "10px",
                                paddingLeft: "6px",
                                paddingRight: "6px",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                if (displayTask === "List") {
                                  setTaskListDisplay("license");
                                  setDisplayTask("List");
                                }
                                if (displayTask === "Board") {
                                  setTaskListDisplay("license");
                                  setDisplayTask("Board");
                                }
                              }}
                            >
                              License
                            </span>
                            <span
                              className={
                                taskListDisplay === "team-member"
                                  ? "active"
                                  : ""
                              }
                              style={{
                                fontSize: "11px",
                                marginLeft: "10px",
                                paddingLeft: "6px",
                                paddingRight: "6px",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                if (displayTask === "List") {
                                  setTaskListDisplay("team-member");
                                  setDisplayTask("List");
                                }
                                if (displayTask === "Board") {
                                  setTaskListDisplay("team-member");
                                  setDisplayTask("Board");
                                }
                              }}
                            >
                              Team
                            </span>
                          </ul>
                        </div>
                      )}
                    </div>

                    {displayTask === "Board" && searchValue === "" && (
                      <div>
                        <div
                          className="take-action"
                          style={{ height: "62vh", overflowY: "hidden" }}
                        >
                          {taskList && taskList.length > 0 ? (
                            <div className="task-list-grid">
                              <BoardView isRedirect />
                            </div>
                          ) : taskLoader ? (
                            <Loading isInline />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    )}

                    {displayTask === "Calender" && searchValue === "" && (
                      <div>
                        <div
                          className="take-action pt-0"
                          style={{ height: "72vh" }}
                        >
                          {taskList && taskList.length > 0 ? (
                            <div className="task-list-grid">
                              <View
                                getSelectTaskDetails={getSelectTaskDetails}
                                isRedirect
                              />
                            </div>
                          ) : taskLoader ? (
                            <Loading isInline />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    )}

                    <div
                      className={
                        displayTask === "List" &&
                        "task-grid-scroll customScrollSecond newHeigt"
                      }
                    >
                      {searchValue !== "" && (
                        <div
                          className="take-action"
                          style={{
                            marginBottom: "0px",
                            paddingBottom: "0px",
                            paddingTop: "20px",
                            height: "70vh",
                          }}
                        >
                          {searchData.length > 0 &&
                            searchData.map((task) => {
                              return (
                                <>{renderTaskList(task.data, task.status, 2)}</>
                              );
                            })}
                        </div>
                      )}

                      {isMobile && displayTask === "List" && (
                        <>
                          <div
                            className="dropdown-mobile"
                            onClick={(e) => {
                              if (mobileViewBy) {
                                setMobileViewBy(false);
                              } else {
                                setMobileViewBy(true);
                              }
                            }}
                          >
                            {taskListDisplay === "status"
                              ? "By Status"
                              : taskListDisplay === ""
                              ? "Company"
                              : taskListDisplay === "license"
                              ? "License"
                              : taskListDisplay === "team-member"
                              ? "Team"
                              : "View By"}
                            <img
                              className="drop-down-bottom-arrow"
                              src={dropdownBottomArrow}
                              alt="dropdownBottomArrow"
                            />
                          </div>
                          {mobileViewBy && (
                            <div ref={innerRefDrop} className="dropdown-open">
                              <div
                                className=""
                                onClick={(e) => {
                                  setTaskListDisplay("team-member");
                                  setDisplayTask("List");
                                  setMobileViewBy(false);
                                }}
                              >
                                <div className="icon-text-inline">
                                  <span
                                    className={
                                      taskListDisplay === "team-member"
                                        ? "float-left dropdown-active-link"
                                        : "float-left change-role"
                                    }
                                  >
                                    By Team
                                  </span>
                                  <span className="float-right change-role">
                                    {taskListDisplay === "team-member" && (
                                      <img
                                        className="dropdownCheck"
                                        src={dropdownCheckIcon}
                                        alt="dropdownCheckIcon"
                                      />
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  setTaskListDisplay("license");
                                  setDisplayTask("List");
                                  setMobileViewBy(false);
                                }}
                                className=""
                              >
                                <div className="icon-text-inline">
                                  <span
                                    className={
                                      taskListDisplay === "license"
                                        ? "float-left dropdown-active-link"
                                        : "float-left change-role"
                                    }
                                  >
                                    By License
                                  </span>
                                  <span className="float-right change-role">
                                    {taskListDisplay === "license" && (
                                      <img
                                        className="dropdownCheck"
                                        src={dropdownCheckIcon}
                                        alt="dropdownCheckIcon"
                                      />
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  setTaskListDisplay("status");
                                  setDisplayTask("List");
                                  setMobileViewBy(false);
                                }}
                                className=""
                              >
                                <div className="icon-text-inline">
                                  <span
                                    className={
                                      taskListDisplay === "status"
                                        ? "float-left dropdown-active-link"
                                        : "float-left change-role"
                                    }
                                  >
                                    By Status
                                  </span>
                                  <span className="float-right change-role">
                                    {taskListDisplay === "status" && (
                                      <img
                                        className="dropdownCheck"
                                        src={dropdownCheckIcon}
                                        alt="dropdownCheckIcon"
                                      />
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  setTaskListDisplay("company");
                                  setDisplayTask("List");
                                  setMobileViewBy(false);
                                }}
                                className=""
                              >
                                <div className="icon-text-inline">
                                  <span
                                    className={
                                      taskListDisplay === "company"
                                        ? "float-left dropdown-active-link"
                                        : "float-left change-role"
                                    }
                                  >
                                    By Company
                                  </span>
                                  <span className="float-right change-role">
                                    {taskListDisplay === "company" && (
                                      <img
                                        className="dropdownCheck"
                                        src={dropdownCheckIcon}
                                        alt="dropdownCheckIcon"
                                      />
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {taskListDisplay === "status" &&
                        displayTask === "List" &&
                        searchValue === "" &&
                        listTaskData &&
                        listTaskData.length > 0 &&
                        listTaskData.map((item, index) => {
                          return (
                            <>
                              <div className="mobile-dashboard-view">
                                <div className="take-action">
                                  <div className="task-list-grid mt-2">
                                    {item.status === "Overdue" && (
                                      <div
                                        className="action-title upcoming-btn"
                                        style={{
                                          color: "#f22727",
                                          fontWeight: "500",
                                          display: "flex",
                                          width: "fit-content",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          expandedFlags.includes(index)
                                            ? handleExpandList("hide", index)
                                            : handleExpandList("show", index);
                                        }}
                                      >
                                        {"Overdue"}{" "}
                                        <p className="red-circle-overide">
                                          {item.tasks.length}
                                        </p>
                                        {expandedFlags.includes(index) ? (
                                          <img
                                            src={redArrowTop}
                                            className="redArrowTop arrowDown"
                                            alt="Arrow Up"
                                            style={{
                                              width: "18px",
                                              height: "18px",
                                              marginTop: "2px",
                                              marginLeft: "9px",
                                            }}
                                          />
                                        ) : (
                                          <img
                                            src={redArrowTop}
                                            className="redArrowTop arrowDown"
                                            alt="Arrow Up"
                                            style={{
                                              width: "18px",
                                              height: "18px",
                                              marginTop: "2px",
                                              marginLeft: "9px",
                                              transform: "rotate(180deg)",
                                            }}
                                          />
                                        )}
                                      </div>
                                    )}
                                    {item.status === "Take Action" && (
                                      <div
                                        className="upcoming-btn"
                                        style={{
                                          cursor: "pointer",
                                          width: "fit-content",
                                        }}
                                        onClick={() => {
                                          expandedFlags.includes(index)
                                            ? handleExpandList("hide", index)
                                            : handleExpandList("show", index);
                                        }}
                                      >
                                        <div
                                          style={{ cursor: "pointer" }}
                                          className="upcoming-title"
                                        >
                                          {"Take Action"}
                                          <span className="black-circle">
                                            <p className="black-circle-text">
                                              {item.tasks.length}
                                            </p>
                                          </span>
                                          {expandedFlags.includes(index) ? (
                                            <img
                                              src={upArrow}
                                              className="arrowDown"
                                              alt="Arrow Up"
                                            />
                                          ) : (
                                            <img
                                              src={downArrow}
                                              className="arrowDown"
                                              alt="Arrow down"
                                            />
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {(item.status === "Upcoming" ||
                                      item.status === "Completed") && (
                                      <div
                                        className="upcoming-btn"
                                        style={{
                                          cursor: "pointer",
                                          width: "fit-content",
                                        }}
                                        onClick={() => {
                                          expandedFlags.includes(index)
                                            ? handleExpandList("hide", index)
                                            : handleExpandList("show", index);
                                        }}
                                      >
                                        <div
                                          style={{ cursor: "pointer" }}
                                          className={
                                            item.status === "Upcoming"
                                              ? "upcoming-title"
                                              : "complete-title"
                                          }
                                        >
                                          {item.status === "Upcoming"
                                            ? "Upcoming"
                                            : "Completed"}
                                          <span
                                            className={
                                              item.status === "Upcoming"
                                                ? "black-circle"
                                                : "green-circle"
                                            }
                                          >
                                            <p className="black-circle-text">
                                              {item.tasks.length}
                                            </p>
                                          </span>
                                          {!expandedFlags.includes(index) ? (
                                            <img
                                              src={downArrow}
                                              className="arrowDown"
                                              alt="Arrow down"
                                            />
                                          ) : (
                                            <img
                                              src={upArrow}
                                              className="arrowDown"
                                              alt="Arrow Up"
                                            />
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {(item.status === "Upcoming"
                                      ? expandedFlags.includes(index)
                                      : item.status === "Completed"
                                      ? expandedFlags.includes(index)
                                      : item.status === "Overdue"
                                      ? expandedFlags.includes(index)
                                      : item.status === "Take Action"
                                      ? expandedFlags.includes(index)
                                      : !expandedFlags.includes(index)) && (
                                      <>
                                        {item.tasks
                                          .slice(0, rowCount[item.status])
                                          .map((task) => {
                                            return (
                                              <>
                                                {renderTaskList(
                                                  task,
                                                  item.status,
                                                  1
                                                )}
                                              </>
                                            );
                                          })}
                                        <div>
                                          {item.tasks.length > 3 && (
                                            <>
                                              {rowCount[item.status] > 3 && (
                                                <div
                                                  onClick={() =>
                                                    showLessMore(item.status, 3)
                                                  }
                                                  className="viewAll showLess"
                                                >
                                                  Show Less{" "}
                                                  <img
                                                    src={viewAllArowTop}
                                                    alt="Show Less"
                                                  />
                                                </div>
                                              )}
                                              {rowCount[item.status] === 3 && (
                                                <div
                                                  onClick={() =>
                                                    showLessMore(
                                                      item.status,
                                                      item.tasks.length
                                                    )
                                                  }
                                                  className="viewAll"
                                                >
                                                  View All (
                                                  {item.tasks.length - 3} More)
                                                  <img
                                                    src={viewAllArow}
                                                    alt="view All Arow"
                                                  />
                                                </div>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      {/* License View Temp test */}
                      <div className="task-list-grid">
                        {taskListDisplay === "license" &&
                          displayTask === "List" && (
                            <LicenseTaskList
                              user={user}
                              sideBarTaskList={false}
                            />
                          )}
                      </div>
                      {/* Company view Display */}
                      <div className="task-list-grid">
                        {taskListDisplay === "company" &&
                          displayTask === "List" && (
                            <CompanyTaskList
                              user={user}
                              sideBarTaskList={false}
                            />
                          )}
                      </div>

                      {/* Assigned View  */}
                      <div className="Assign View">
                        {taskListDisplay === "team-member" &&
                          displayTask === "List" && (
                            <AssigneList
                              assignRowCount
                              user={user}
                              sideBarTaskList={false}
                            />
                          )}
                      </div>
                    </div>
                  </div>
                ) : (
                  getAuditScreen(auditUserType, checklistExist, questionExist)
                )}
              </>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default withRouter(RightSideGrid);
