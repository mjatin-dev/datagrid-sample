/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SideBarInputControl from "./LeftSideBar";
import Cobg from "../../../../../assets/Images/Onboarding/co-bg.png";
import { withRouter } from "react-router-dom";
import ComplianceOfficerSetting from "../components/CoSetting";
import { actions as adminMenuActions } from "../MenuRedux/actions";
import HistoryList from "../../../../HistoryModule/HistoryList";
import HelpSection from "../../../../HelpSection/Help";
// import { actions as taskReportActions } from "../redux/actions";
import ProjectManagement from "../../../../ProjectManagement";
import ProjectTrash from "../../../../ProjectManagement/Trash";
import Auth from "../../../../Authectication/components/Auth";
import "./style.css";
import Layout from "../../../../Audit/components/Layout/Layout.jsx";
import Auditee from "../../../../Audit/pages/Auditee";
import RouterSubAuditor from "../../../../Audit/pages/SubAuditor";
import RouterSubAuditee from "../../../../Audit/pages/SubAuditee";
import Auditor from "../../../../Audit/pages/Auditor";
import DashBoardAuditor from "./Auditor/AuditorQuestionAnswer";
import Notifications from "Components/Notifications";
import Updates from "Components/Updates";
import NewRegulationsQuiz from "Components/NewRegulationsQuiz";
import TaskList from "SharedComponents/Dashboard";
import MobileHeader from "CommonModules/sharedComponents/MobileLeftSideBar";
import { checkPaymentPlanStatus } from "SharedComponents/Dashboard/redux/actions";
import Events from "Components/Events";
import OtherCompliance from "Components/OtherCompliance";
import ApplicationForm from "./SmeApplication/ApplicationForm";
import NewRequirements from "./SmeApplication/NewRequirements";
import DetailApplification from "./SmeApplication/DetailApplification";

function Dashboard({ history }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const userDetails = state && state.auth && state.auth.loginInfo;
  useEffect(() => {
    setIsTaskListOpen(false);
  }, []);
  // useEffect(() => {
  //   dispatch(taskReportActions.taskReportRequest());
  // }, []);
  useEffect(() => {
    if (state.adminMenu.currentMenu !== "taskList") setIsTaskListOpen(false);
  }, []);

  useEffect(() => {
    if (userDetails?.email) {
      dispatch(checkPaymentPlanStatus());
    }
  }, [state.adminMenu?.currentMenu, userDetails?.email]);
  useEffect(() => {
    if (window.location.href.includes("dashboard")) {
      if (isTaskListOpen) {
        setIsTaskListOpen(false);
      }
      if (userDetails.UserType !== 3) {
        history.push("/dashboard");
        dispatch(adminMenuActions.setCurrentMenu("taskList"));
        //dispatch(adminMenuActions.setCurrentMenu("dashboard"));
      } else if (state.adminMenu.currentMenu !== "taskList") {
        dispatch(adminMenuActions.setCurrentMenu("taskList"));
      }
    } else if (
      window.location.href.includes("compliance-history") &&
      // window.location.hash === "#/compliance-history" &&
      state.adminMenu.currentMenu !== "history"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("history"));
      return;
    } else if (
      window.location.href.includes("new-regulation-quiz") &&
      state.adminMenu.currentMenu !== "new-regulation-quiz"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("new-regulation-quiz"));
      return;
    } else if (
      window.location.href.includes("updates") &&
      state.adminMenu.currentMenu !== "updates"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("updates"));
      return;
    } else if (
      window.location.href.includes("help") &&
      state.adminMenu.currentMenu !== "help"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("help"));
    } else if (
      window.location.href.includes("notifications") &&
      state.adminMenu.currentMenu !== "notifications"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("notifications"));
    } else if (
      window.location.href.includes("project-management") &&
      state.adminMenu.currentMenu !== "project-management"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("project-management"));
    } else if (
      window.location.href.includes("smeApplication") &&
      state.adminMenu.currentMenu !== "smeApplication"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("smeApplication"));
    } else if (
      window.location.href.includes("detail-application") &&
      state.adminMenu.currentMenu !== "detail-application"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("detail-application"));
    } else if (
      window.location.href.includes("new-requirements") &&
      state.adminMenu.currentMenu !== "new-requirements"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("new-requirements"));
    } else if (
      window.location.href.includes("project-trash") &&
      state?.adminMenu.currentMenu !== "project-trash"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("project-trash"));
    } else if (
      window.location.href.match(/other-compliance$/) &&
      state?.adminMenu?.currentMenu !== "other-compliance"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("other-compliance"));
    } else if (
      window.location.href.match(/audit$/) &&
      state?.adminMenu?.currentMenu !== "audit"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("audit"));
    } else if (
      window.location.href.match(/user-auditee$/) &&
      state?.adminMenu?.currentMenu !== "audit"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("audit"));
    } else if (
      window.location.href.match(/sub-Auditor$/) &&
      state?.adminMenu?.currentMenu !== "audit"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("audit"));
    } else if (
      window.location.href.match(/sub-auditee$/) &&
      state?.adminMenu?.currentMenu !== "audit"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("audit"));
    } else if (
      window.location.href.match(/auditor$/) &&
      state?.adminMenu?.currentMenu !== "audit"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("audit"));
    } else if (
      window.location.href.match(/dashboard-auditee$/) &&
      state?.adminMenu?.currentMenu !== "dashboard-auditee"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("dashboard-auditee"));
    } else if (
      window.location.href.match(/dashboard-subauditee$/) &&
      state?.adminMenu?.currentMenu !== "dashboard-subauditee"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("dashboard-subauditee"));
    } else if (
      window.location.href.match(/dashboard-auditor$/) &&
      state?.adminMenu?.currentMenu !== "dashboard-auditor"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("dashboard-auditor"));
    } else if (
      window.location.href.match(/dashboard-subauditor$/) &&
      state?.adminMenu?.currentMenu !== "dashboard-subauditor"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("dashboard-subauditor"));
    } else if (
      window.location.href.match(/events$/) &&
      state?.adminMenu?.currentMenu !== "events"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("events"));
    }
  }, [window.location.href]);

  return (
    <div className="row co-dashboard fix-top">
      <Auth />
      <div className=" left-fixed ">
        <div className="on-boarding">
          {/* <SideBar /> */}
          <SideBarInputControl
            isTaskListOpen={isTaskListOpen}
            setIsTaskListOpen={setIsTaskListOpen}
          />
        </div>
      </div>
      <div className="col-12">
        <img className="right-bg" src={Cobg} alt="" />
        {state && state.adminMenu.currentMenu === "taskList" && (
          <>
            <div className="dashboard-view__container ml-auto">
              <MobileHeader />
              <TaskList showOnlyCalendar={true} />
            </div>
          </>
        )}

        <div className="dashboard-view__container ml-auto">
          {state && state.adminMenu.currentMenu === "notifications" && (
            <Notifications />
          )}
          {state && state.adminMenu.currentMenu === "updates" && <Updates />}
          {state && state.adminMenu.currentMenu === "history" && (
            <HistoryList />
          )}
          {state && state.adminMenu.currentMenu === "events" && <Events />}
          {state && state.adminMenu.currentMenu === "other-compliance" && (
            <OtherCompliance />
          )}
        </div>

        {state && state.adminMenu.currentMenu === "settings" && (
          <>
            <div className="d-none d-sm-block">
              <ComplianceOfficerSetting />
            </div>
          </>
        )}
        {/* {state && state.adminMenu.currentMenu === "historyFilter" && (
          <HistoryFilter />
        )} */}

        {state && state.adminMenu.currentMenu === "new-regulation-quiz" && (
          <NewRegulationsQuiz />
        )}
        {state && state.adminMenu.currentMenu === "help" && <HelpSection />}
        <div className="dashboard-view__container ml-auto">
          {state && state.adminMenu.currentMenu === "project-management" && (
            <ProjectManagement />
          )}
          {state && state.adminMenu.currentMenu === "project-trash" && (
            <ProjectTrash />
          )}
        </div>

        {state && state.adminMenu.currentMenu === "smeApplication" && (
          <div className="create-template">
            <ApplicationForm />
          </div>
        )}

        {state && state.adminMenu.currentMenu === "new-requirements" && (
          <div className="create-template">
            <NewRequirements />
          </div>
        )}

        {state && state.adminMenu.currentMenu === "detail-application" && (
          <div className="create-template">
            <DetailApplification />
          </div>
        )}

        {state && state.adminMenu.currentMenu === "audit" && (
          <div className="create-template">
            <Layout />
          </div>
        )}
        {state && state.adminMenu.currentMenu === "user-auditee" && (
          <div className="create-template">
            <Auditee />
          </div>
        )}

        {state && state.adminMenu.currentMenu === "sub-Auditor" && (
          <div className="create-template">
            <RouterSubAuditor />
          </div>
        )}
        {state && state.adminMenu.currentMenu === "sub-auditee" && (
          <div className="create-template">
            <RouterSubAuditee />
          </div>
        )}
        {state && state.adminMenu.currentMenu === "auditor" && (
          <div className="create-template">
            <Auditor />
          </div>
        )}

        {state && state.adminMenu.currentMenu === "dashboard-auditee" && (
          <div className="create-template">
            <DashBoardAuditor />
          </div>
        )}
        {state && state.adminMenu.currentMenu === "dashboard-auditor" && (
          <div className="create-template">
            <DashBoardAuditor />
          </div>
        )}
        {state && state.adminMenu.currentMenu === "dashboard-subauditor" && (
          <div className="create-template">
            <DashBoardAuditor />
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(Dashboard);
