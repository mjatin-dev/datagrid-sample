/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../BoardView/style.css";
import SideBarInputControl from "../LeftSideBar";
import { isMobile } from "react-device-detect";
import { withRouter } from "react-router-dom";
import QuickOverViewSection from "./quickOverview";
import { actions as adminMenuActions } from "../../MenuRedux/actions";
import { actions as notificationActions } from "../notification/Redux/actions.js";
import Auth from "../../../../../Authectication/components/Auth";
import Dashboard from "SharedComponents/Dashboard";
import MobileLeftSidebar from "../../../../../../CommonModules/sharedComponents/MobileLeftSideBar";
import { dashboardViews } from "SharedComponents/Constants";
import { checkPaymentPlanStatus } from "SharedComponents/Dashboard/redux/actions";

function DashBoardView() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const currentDashboardTab = state.DashboardState.currentDashboardTab;
  const sideBarOpen = state?.taskReport?.sideBarOpenClose || false;
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const currentDashboardViewMobile =
    state?.adminMenu?.currentDashboardViewMobile;

  const taskIdFromNR =
    state && state.NotificationRedu && state.NotificationRedu.taskID;
  useEffect(() => {
    if (taskIdFromNR !== null) {
      dispatch(notificationActions.setTaskID(null));
    }
  }, []);
  useEffect(() => {
    dispatch(checkPaymentPlanStatus());
  }, []);

  // useEffect(() => {
  //   if (taskList && taskList.length === 0) {
  //     dispatch(taskReportActions.taskReportRequest());
  //   }
  // }, [state.adminMenu.currentMenu]);

  // useEffect(() => {
  //   const taskId = history.location?.state?.taskId;
  //   console.log({ historyLocation: history.location });
  //   if (taskId) {
  //     console.log("inside dispatch");
  //     dispatch(fetchTaskDetailRequest(taskId));
  //   }
  // }, []);
  // useEffect(() => {
  //   if (userEmail && userDetails?.mobileVerified) {
  //     if (userDetails?.UserType === 3 || userDetails?.UserType === 5) {
  //       dispatch(taskReportActions.taskReportRequest());
  //       const refresh_taskList = setInterval(() => {
  //         dispatch(taskReportActions.taskReportRequest());
  //       }, 30000);
  //       return () => clearInterval(refresh_taskList);
  //     }
  //   }
  // }, []);
  useEffect(() => {
    if (window.location.href.includes("dashboard-view")) {
      dispatch(adminMenuActions.setCurrentMenu("dashboard"));
    }
    // if (userDetails.UserType === 3 || userDetails.UserType === 5) {
    //   if (window.location.href.includes("dashboard-view")) {
    //     dispatch(adminMenuActions.setCurrentMenu("dashboard"));
    //   }
    // } else if (userDetails.UserType === 4) {
    //   if (window.location.href.includes("dashboard")) {
    //     dispatch(adminMenuActions.setCurrentMenu("taskList"));
    //   }
    //   if (window.location.href.includes("dashboard-view")) {
    //     history?.push("/dashboard");
    //     dispatch(adminMenuActions.setCurrentMenu("taskList"));
    //   } else {
    //     if (window.location.href.includes("dashboard")) {
    //       dispatch(adminMenuActions.setCurrentMenu("taskList"));
    //     }
    //     if (window.location.href.includes("dashboard-view")) {
    //       dispatch(adminMenuActions.setCurrentMenu("dashboard"));
    //     }
    //   }
    // }
  }, []);

  return (
    <div>
      <Auth />
      <div className="row co-dashboard" style={{ height: "auto" }}>
        {!isMobile && (
          <div className="left-fixed d-none d-md-block">
            <div className="on-boarding">
              <SideBarInputControl
                isTaskListOpen={isTaskListOpen}
                setIsTaskListOpen={setIsTaskListOpen}
              />
            </div>
          </div>
        )}
      </div>
      <MobileLeftSidebar />

      <div className="row no-gutters ml-auto dashboard-view__container">
        {currentDashboardViewMobile === "overview" && (
          <div className="col-12 col-md-3 d-block d-md-none">
            <QuickOverViewSection />
          </div>
        )}
        <div
          className={`col-12 ${
            sideBarOpen ? "col-md-1" : "col-md-3"
          } d-none d-md-block `}
        >
          <QuickOverViewSection />
        </div>
        <div
          className={`d-md-block d-none    ${
            sideBarOpen ? "col-md-11" : "col-md-9"
          }`}
        >
          {state && state.adminMenu.currentMenu === "dashboard" && (
            <Dashboard
              showAnalytics={currentDashboardTab === dashboardViews[0]}
            />
          )}
        </div>
        <div className={`d-block d-md-none col-md-9`}>
          {state &&
            state.adminMenu.currentMenu === "dashboard" &&
            currentDashboardViewMobile === "tasks" &&
            isMobile && (
              <Dashboard
                showAnalytics={currentDashboardTab === dashboardViews[0]}
              />
            )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(DashBoardView);
