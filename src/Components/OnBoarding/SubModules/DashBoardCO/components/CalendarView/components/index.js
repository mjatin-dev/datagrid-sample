/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import * as $ from "jquery";
import "./tooltip.css";
import { useSelector, useDispatch } from "react-redux";
import { actions as taskReportActions } from "../../../redux/actions";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import "@fullcalendar/daygrid/main.css";

import "@fullcalendar/timegrid/main.css";
import "./custom.css";
import moment from "moment";
import classNames from "classnames";
import "react-responsive-modal/styles.css";

import { withRouter } from "react-router-dom";
import { actions as menuReduxActions } from "../../../MenuRedux/actions";

function CalendarView({ history }) {
  // let title = "";
  let otherProps;
  const calendarRef = React.useRef();
  const [currentView, setCurrentView] = React.useState("dayGridMonth");
  const [eventList, setEventList] = React.useState([]);
  const state = useSelector((state) => state);
  const [calendarClass, setCalendarClass] = useState("monthViewContainer");
  const dispatch = useDispatch();
  const userDetails = state && state.auth && state.auth.loginInfo;
  let taskList =
    state &&
    state.taskReport &&
    state.taskReport.taskReport &&
    state.taskReport.taskReport.taskReport;

  useEffect(() => {
    dispatch(
      taskReportActions.taskReportRequest({
        // userID: 20243,
        userID: userDetails.UserID,
        usertype: userDetails.UserType,
      })
    );
  }, []);
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

  useEffect(() => {
    let taskListArr = [];
    let tempArr = [];
    if (taskList && taskList.length > 0) {
      taskList.forEach((item, index) => {
        item.Details &&
          item.Details.length > 0 &&
          item.Details.forEach((data, key) => {
            taskListArr.push(data);
          });
      });
    }
    taskListArr &&
      taskListArr.length > 0 &&
      taskListArr.map((item, index) => {
        if (item.LicenseCode !== "Norec") {
          let obj = {
            ApproverName: item.ApproverName,
            title: item.LicenseCode,
            date: moment(item.EndDate).format("YYYY-MM-DD"),
            AssignedName: item.AssignedName,
            AssignedTo: item.AssignedTo,
            Cnt: item.Cnt,
            EntityName: item.EntityName,
            TaskId: item.TaskId,
            Status: item.Status,
            TaskName: item.TaskName,
            EndDate: item.EndDate,
          };
          tempArr.push(obj);
        }
        if (tempArr && tempArr.length > 0) {
          setEventList(tempArr);
        }
      });
  }, [taskList]);

  useEffect(() => {
    if (currentView !== undefined) {
      let btnClass = classNames({
        monthViewContainer: currentView === "dayGridMonth",
        weekViewContainer: currentView === "dayGridWeek",
        dayViewContainer: currentView === "dayGridDay",
      });
      setCalendarClass(btnClass);
    }
  }, [currentView, setCurrentView]);

  const createEventMouseEnter = (info) => {
    let taskId =
      info &&
      info.event &&
      info.event._def &&
      info.event._def.extendedProps &&
      info.event._def.extendedProps.TaskId;
    dispatch(menuReduxActions.setCurrentCalendarViewTaskId(taskId));
    history.push("/dashboard");
  };

  const ViewDetails = (taskId) => {
    dispatch(menuReduxActions.setCurrentCalendarViewTaskId(taskId));
    history.push("/dashboard");

    window.$(".popover").popover("hide");
  };

  $(document).on("mousedown", ".fc-dayGridMonth-button", function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    setCurrentView("dayGridMonth");
  });
  $(document).on("mousedown", ".fc-dayGridWeek-button", function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    setCurrentView("dayGridWeek");
  });
  $(document).on("mousedown", ".fc-dayGridDay-button", function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    setCurrentView("dayGridDay");
  });

  const renderEventContent = React.useCallback((data) => {
    if (data.view.type === "dayGridMonth") {
      return renderMonthView(data);
    } else if (data.view.type === "dayGridDay") {
      return renderDayView(data);
    } else {
      return renderWeekView(data);
    }
  });
  const _moreLinkContent = (info) => {
    if (info.view.type === "dayGridMonth") {
      return <span>VIEW +{info.num} MORE TASKS</span>;
    }
    return "";
  };
  const _eventLimitClick = (data) => {
    let calendarApi = calendarRef.current.getApi();
    if (data.view.type === "dayGridMonth") {
      setCurrentView("dayGridDay");
      calendarApi.gotoDate(new Date(data.date));
      calendarApi.changeView("dayGridDay");
    } else {
      return "";
    }
  };

  const renderMonthView = (data) => {
    return (
      <div className="md-full-event monthView">
        <div className="new-task-list w-100">
          <div className="float-left">
            <div className="graybox-left">
              <span
                data-trigger="hover"
                data-html="true"
                data-placement="bottom"
                data-toggle="popover"
                className="all-companies-nse-label popover__title"
              >
                {data.event._def.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = (data) => {
    var today = new Date();
    let otherProps =
      data && data.event && data.event._def && data.event._def.extendedProps;

    return (
      <div className="md-full-event weekView">
        <div className="week-card">
          <div className="new-task-list w-100">
            <div className="float-left">
              <div className="graybox-left">
                <span className="all-companies-nse-label">
                  {data.event._def.title}
                </span>
              </div>
            </div>
            <div className="float-right">
              {" "}
              <div className="black-week d-none d-sm-block">
                {" "}
                {moment(otherProps.EndDate).format("DD MMM")}
              </div>
            </div>
          </div>
          <div className="week-card-title">
            {otherProps && otherProps.TaskName}
          </div>
          <p className="pink-label-text d-none d-sm-block">
            {otherProps && otherProps.Status
              ? otherProps.Status === "Completed By User"
                ? otherProps.EndDate < today
                  ? "Task Completed"
                  : "Approval Pending"
                : otherProps.Status === "Assign"
                ? "Assign Task"
                : otherProps.Status === "Assigned"
                ? "Task Assigned"
                : otherProps.Status === "Approved"
                ? "Task Approved"
                : otherProps.Status === "Request Rejected"
                ? "Task Rejected"
                : null
              : ""}
          </p>
          <div className="circle-front-text" value="717064">
            {otherProps && otherProps.EntityName}
          </div>
          <div className="d-flex new-task-list">
            <div className="circle-name d-none d-sm-block">
              <div className="circle-text">
                {otherProps &&
                  otherProps.AssignedName &&
                  getInitials(otherProps.AssignedName)}
              </div>
            </div>
            <div className="circle-front-name d-none d-sm-block mail">
              {otherProps && otherProps.AssignedName}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderDayView = (data) => {
    var today = new Date();
    let otherProps =
      data && data.event && data.event._def && data.event._def.extendedProps;
    return (
      <div className="md-full-event dayView">
        <div className="row">
          <div className="col-10 col-md-5 col-sm-5 col-xl-5">
            <div className="all-companies-sub-title new-task-list">
              <div>
                <div className="graybox-left">
                  <span className="all-companies-nse-label">
                    {data.event._def.title}
                  </span>
                </div>
                <span className="pink-label-title-right">
                  <div className="overdue-title">
                    {otherProps && otherProps.TaskName}
                  </div>
                  <div className="black-week d-block d-sm-none">
                    <div className="d-block d-sm-none">
                      {moment(otherProps.EndDate).format("DD MMM")}
                    </div>
                  </div>
                  <p className="pink-label-text d-none d-sm-block">
                    {otherProps && otherProps.Status
                      ? otherProps.Status === "Completed By User"
                        ? otherProps.EndDate < today
                          ? "Task Completed"
                          : "Approval Pending"
                        : otherProps.Status === "Assign"
                        ? "Assign Task"
                        : otherProps.Status === "Assigned"
                        ? "Task Assigned"
                        : otherProps.Status === "Approved"
                        ? "Task Approved"
                        : otherProps.Status === "Request Rejected"
                        ? "Task Rejected"
                        : null
                      : ""}
                  </p>
                </span>
              </div>
            </div>
          </div>
          <div className="col-2 col-md-2 col-sm-2 col-xl-2 d-none d-sm-block">
            <div className="circle-front-text" value="717064">
              {otherProps && otherProps.EntityName}
            </div>
          </div>
          <div className="col-2 col-md-3 col-sm-3 col-xl-3 d-none d-sm-block">
            <div className="d-flex new-task-list">
              <div className="circle-name d-none d-sm-block">
                <div className="circle-text">
                  {otherProps &&
                    otherProps.AssignedName &&
                    getInitials(otherProps.AssignedName)}
                </div>
              </div>
              <div className="circle-front-text d-none d-sm-block mail">
                {otherProps && otherProps.AssignedName}
              </div>
            </div>
          </div>
          <div className="col-2">
            <div className="align-right task-list-new">
              <div className="d-flex">
                <div className="black-week d-none d-sm-block">
                  {moment(otherProps.EndDate).format("DD MMM")}
                </div>
                <div className="right-arrow-week text-right-grid"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const _renderToolTip = (info) => {
    otherProps =
      info && info.event && info.event._def && info.event._def.extendedProps;

    if (info.view.type === "dayGridMonth") {
      window
        .$('[data-toggle="popover"]')
        .popover({
          html: true,
          sanitize: false,
          content: function () {
            return `<div style='width: 250px'><p class='title-tooltip-white'>${
              otherProps.TaskName
            }</p><div class='compliant-option-new'><div class='col-6 d-flex pl-0'><p class='two-digin-circle-tooltip'>${
              otherProps &&
              otherProps.AssignedName &&
              getInitials(otherProps.AssignedName)
            } </p><span class='right-title-tooltip'>${
              otherProps && otherProps.AssignedName
            }</div><div class='col-6 pr-0'><p class='tooltip-right-text'>${moment(
              otherProps.EndDate
            ).format("DD MMM")}</p></div></div><span id=${
              otherProps.TaskId
            } class='view-tooltip w-100'>View Deatils</span></div>`;
          },
        })
        .on("hide.bs.popover", function () {
          let id = `${otherProps && otherProps.TaskId}`;
          if (id !== "") {
            if (document.getElementById(id)) {
              document.getElementById(id).onclick = function () {
                ViewDetails(otherProps.TaskId);
              };
            }
          }

          if ($(".popover:hover").length) {
            return false;
          }
        });

      $("body").on("mouseleave", ".popover", function () {
        window.$(".popover").popover("hide");
      });
    }
  };

  return (
    <>
      <div className="full-calender-container">
        {eventList && eventList.length > 0 && (
          <div id="calender">
            <FullCalendar
              ref={calendarRef}
              lazyFetching={true}
              eventClick={(e) => createEventMouseEnter(e)}
              themeSystem="standard"
              defaultView="dayGridMonth"
              headerToolbar={{
                left: "prev,title,next",
                center: "",
                right: "dayGridDay,dayGridWeek,dayGridMonth",
              }}
              weekends={true}
              initialView={currentView}
              editable={true}
              eventClassNames={calendarClass}
              selectable={true}
              moreLinkClick={(e) => _eventLimitClick(e)}
              moreLinkContent={(e) => _moreLinkContent(e)}
              selectMirror={true}
              dayMaxEvents={currentView === "dayGridMonth" ? 2 : null}
              eventContent={renderEventContent}
              plugins={[dayGridPlugin, bootstrapPlugin, timeGridPlugin]}
              events={eventList}
              eventMouseEnter={(e) => _renderToolTip(e)}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default withRouter(CalendarView);
