/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import "./style.css";
// import SideBarBg from "../../../../assets/Images/Onboarding/side-bar-bg.png";
import projectManagementInactiveIcon from "../../../../../assets/Icons/projectManagementInactiveIcon.png";
import VectorIcon from "../../../../../assets/Icons/Vector.png";
import dashBoardActiveIcon from "../../../../../assets/Icons/dashBoardActiveIcon.png";
import suggestionIcon from "../../../../../assets/Icons/suggestions.svg";
import sidebarBell from "../../../../../assets/Icons/sidebarBell.png";
import sidebarBellActive from "../../../../../assets/Icons/bellSelected.png";
import settingActive from "../../../../../assets/Icons/activeSetting.png";
import calendarInactiveIcon from "../../../../../assets/Icons/calendar-grey.svg";
import calendarActiveIcon from "../../../../../assets/Icons/calendar-black.svg";
import dashboardView from "../../../../../assets/Icons/dashboardFirstIcon.png";
import sidebarSettingIcon from "../../../../../assets/Icons/sidebarSettingIcon.png";
import smeTabIcon from "../../../../../assets/Icons/sme_tab.svg";
import smeTabIconInactive from "../../../../../assets/Icons/sme_tab_inactive.svg";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  actions as adminMenuActions,
  setIsShowLogoutModal,
  setSuggestionShow,
} from "../MenuRedux/actions";
import { actions as notficationActions } from "./notification/Redux/actions";
import historyListActive from "../../../../../assets/Icons/history_active.png";
import historyListInActive from "../../../../../assets/Icons/history_unactive.png";
import Audit1 from "../../../../../assets/Icons/audit1.png";
import Audit2 from "../../../../../assets/Icons/audit2.png";
import Regulation1 from "../../../../../assets/Icons/regulation1.png";
import Regulation2 from "../../../../../assets/Icons/regulation2.png";
import trashIcon from "../../../../../assets/Icons/trashIcon.svg";
import otherComplianceIconActive from "../../../../../assets/Icons/other-compliance-active.svg";
import otherComplianceIconInActive from "../../../../../assets/Icons/other-compliance-inactive.svg";
import trashIconActive from "../../../../../assets/Icons/trashIconActive.svg";
import smeApplicationIcon1 from "../../../../../assets/Icons/smeApplication1.svg";
import smeApplicationIcon2 from "../../../../../assets/Icons/smeApplication2.svg";

import {
  isShowAuditModule,
  isShowOtherComplianceModule,
  isShowProjectModule,
  isShowSmeModule,
} from "app.config";
import { clearTaskDetail } from "SharedComponents/Dashboard/redux/actions";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";
import { subAuditorModuleActions } from "Components/Audit/redux/subAuditorModuleActions";

function LeftSideBar({ history, isTaskListOpen, setIsTaskListOpen }) {
  const state = useSelector((state) => state);
  const [openSuggestion, setOpenSuggestions] = useState(false);
  // const userTypeNo = state && state?.auth?.loginInfo?.UserType;
  const auditUserType = state && state?.auth?.loginInfo?.auditUserType;
  const { isTaskManagementUser, isLicenseManager, userType, isCEApprover } =
    useGetUserRoles();
  const dispatch = useDispatch();
  const isShowLogoutModal = useSelector(
    (state) => state.adminMenu.isShowLogoutModal || false
  );
  const [openProfile, setOpenProfile] = useState(false);
  const auditMenu = [
    "audit",
    "user-auditee",
    "auditor",
    "sub-Auditor",
    "sub-auditee",
  ];
  const onMenuClick = (currentActiveMenu) => {
    dispatch(adminMenuActions.setCurrentMenu(currentActiveMenu));
    dispatch(clearTaskDetail());
    if (currentActiveMenu === "taskList") {
      dispatch(notficationActions.setTaskID(null));
      // dispatch(adminMenuActions.setTakeActionTab(""));
      localStorage.removeItem("expandedFlagss");
      localStorage.removeItem("allRowCount");
      history.push("/dashboard");
      if (isTaskListOpen) {
        setIsTaskListOpen(false);
      }
    } else if (currentActiveMenu === "notifications") {
      history.push("/notifications");
    } else if (currentActiveMenu === "settings") {
      history.push("/settings");
    } else if (currentActiveMenu === "other-compliance") {
      history.push("/other-compliance/");
    } else if (currentActiveMenu === "dashboard") {
      history.push("/dashboard-view");
    } else if (currentActiveMenu === "history") {
      history.push("/compliance-history");
    } else if (currentActiveMenu === "updates") {
      history.push("/updates", {
        circular_id: "",
      });
    } else if (currentActiveMenu === "help") {
      history.push("/help");
    } else if (currentActiveMenu === "events") {
      history.push("/events");
    } else if (currentActiveMenu === "project-management") {
      history.push("/project-management");
    } else if (currentActiveMenu === "project-trash") {
      history.push("/project-trash");
    } else if (currentActiveMenu === "audit") {
      history.push("/audit");
    } else if (currentActiveMenu === "sub-Auditor") {
      dispatch(subAuditorModuleActions.setStatusTab("all"));
      history.push("/sub-Auditor/all");
    } else if (currentActiveMenu === "sub-auditee") {
      history.push("/sub-auditee/all");
    } else if (currentActiveMenu === "auditor") {
      history.push("/auditor/assignments");
    } else if (currentActiveMenu === "user-auditee") {
      history.push("/user-auditee/assignments");
    } else if (currentActiveMenu === "smeApplication") {
      history.push("/smeApplication");
    }
  };

  const checkUserTypeAndRedirect = () => {
    const validUserTypes = [3, 6, 8, 9, 13, 14, 16];
    if (validUserTypes.includes(auditUserType)) {
      onMenuClick("audit");
    }
  };

  return (
    <div className="side-bar">
      {/* <Suggestions open={openSuggestion} close={setOpenSuggestions} /> */}
      <div className="left-bar">
        <div className="logo">
          <img
            src="/images/newComplianceLogo.svg"
            alt="sideBarlogo"
            width={40}
            onClick={() => onMenuClick("dashboard")}
          />
        </div>
        <div className="first-icon-list">
          {/* {(userDetails.UserType === 3 ||
            userDetails.UserType === 5 ||
            userDetails.UserType === 6) && ( */}
          <div className="taskIcon position-relative">
            <div
              className={`position-absolute ${
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "dashboard" &&
                "iconActive"
              }`}
            ></div>
            <img
              style={{ cursor: "pointer", width: "18px" }}
              title="Dashboard"
              onClick={() => onMenuClick("dashboard")}
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "dashboard"
                  ? dashBoardActiveIcon
                  : dashboardView
              }
              alt="sidebar Active"
            />
          </div>
          {/* )} */}

          {/* {userDetails.UserType === 3 && ( */}
          <div className="taskIcon position-relative">
            <div
              className={`position-absolute ${
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "taskList" &&
                "iconActive"
              }`}
            ></div>
            <img
              style={{ cursor: "pointer", width: "22px" }}
              title="Calendar"
              onClick={() => onMenuClick("taskList")}
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "taskList"
                  ? calendarActiveIcon
                  : calendarInactiveIcon
              }
              alt="sidebar Active"
            />
          </div>
          {/* )} */}
          <div className="taskIcon position-relative">
            <div
              className={`position-absolute ${
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "notifications" &&
                "iconActive"
              }`}
            ></div>
            <img
              style={{ cursor: "pointer", width: "22px" }}
              title="Notifications"
              onClick={() => onMenuClick("notifications")}
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "notifications"
                  ? sidebarBellActive
                  : sidebarBell
              }
              alt="sidebar Bell"
            />
          </div>

          {/* <div className={!openProfile && state && state.adminMenu.currentMenu === "notifications" ? "taskIcon-active" : "taskIcon"}> */}

          <div className="taskIcon position-relative">
            <div
              className={`position-absolute ${
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "history" &&
                "iconActive"
              }`}
            ></div>
            <img
              style={{ cursor: "pointer", width: "22px" }}
              title="Compliance History"
              onClick={() => onMenuClick("history")}
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "history"
                  ? historyListActive
                  : historyListInActive
              }
              alt="sidebar Bell"
            />
          </div>
          {isShowProjectModule && (
            <div className="taskIcon position-relative">
              <div
                className={`position-absolute ${
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "project-management" &&
                  "iconActive"
                }`}
              ></div>
              <img
                style={{ cursor: "pointer", width: "18px" }}
                title={isShowProjectModule ? "Project & Tasks" : "Task"}
                onClick={() => onMenuClick("project-management")}
                src={
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "project-management"
                    ? VectorIcon
                    : projectManagementInactiveIcon
                }
                alt="sidebar Bell"
              />
            </div>
          )}

          {!isTaskManagementUser && (
            <div className="taskIcon position-relative">
              <div
                className={`position-absolute ${
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "updates" &&
                  "iconActive"
                }`}
              ></div>
              <img
                style={{ cursor: "pointer", width: "22px" }}
                title="Updates"
                onClick={() => onMenuClick("updates")}
                src={
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "updates"
                    ? Regulation1
                    : Regulation2
                }
                alt="sidebar Bell"
              />
            </div>
          )}

          {isShowAuditModule && (
            <div className="taskIcon position-relative">
              <div
                className={`position-absolute ${
                  !openProfile &&
                  auditMenu.includes(state?.adminMenu?.currentMenu) &&
                  "iconActive"
                }`}
              ></div>
              <img
                style={{ cursor: "pointer", width: "22px" }}
                title="Audit"
                onClick={() => checkUserTypeAndRedirect()}
                src={
                  !openProfile &&
                  auditMenu.includes(state?.adminMenu?.currentMenu)
                    ? Audit1
                    : Audit2
                }
                alt="sidebar Bell"
              />
            </div>
          )}
          {isShowSmeModule && isCEApprover && (
            <div className="taskIcon position-relative">
              <div
                className={`position-absolute ${
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "smeApplication" &&
                  "iconActive"
                }`}
              ></div>
              <img
                style={{ cursor: "pointer", width: "22px" }}
                title="SME Application"
                onClick={() => onMenuClick("smeApplication")}
                src={
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "smeApplication"
                    ? smeApplicationIcon1
                    : smeApplicationIcon2
                }
                alt="sidebar Active"
              />
            </div>
          )}

          {/* {(isLicenseManager || isCEApprover) && (
            <div className="taskIcon position-relative">
              <div
                className={`position-absolute ${
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "smeApplication" &&
                  "iconActive"
                }`}
              ></div>
              <img
                style={{ cursor: "pointer", width: "22px" }}
                title="SME Application"
                onClick={() => onMenuClick("smeApplication")}
                src={
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "smeApplication"
                    ? smeApplicationIcon1
                    : smeApplicationIcon2
                }
                alt="sidebar Active"
              />
            </div>
          )} */}

          {isShowSmeModule && isLicenseManager && (
            <div className="taskIcon position-relative">
              <div
                className={`position-absolute ${
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "events" &&
                  "iconActive"
                }`}
              ></div>
              <img
                style={{ cursor: "pointer", width: "22px" }}
                title="Events"
                onClick={() => onMenuClick("events")}
                src={
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "events"
                    ? smeTabIcon
                    : smeTabIconInactive
                }
                alt="sidebar Bell"
              />
            </div>
          )}

          {/* <div
            className={
              !openProfile &&
              state &&
              state.adminMenu.currentMenu === "subauditor"
                ? "taskIcon-active"
                : "taskIcon"
            }
          >
            <img
              style={{ cursor: "pointer" }}
              title="Create SubOrdinate"
              onClick={() => onMenuClick("subauditor")}
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "subauditor"
                  ? Regulation1
                  : Regulation2
              }
              alt="sidebar Bell"
            />
          </div> */}

          <div className="taskIcon position-relative">
            <div
              className={`position-absolute ${
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "project-trash" &&
                "iconActive"
              }`}
            ></div>
            <img
              style={{ cursor: "pointer", width: "18px" }}
              title="Trash"
              onClick={() => onMenuClick("project-trash")}
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "project-trash"
                  ? trashIconActive
                  : trashIcon
              }
              alt="sidebar Bell"
            />
          </div>
        </div>
        <div className="devider-line-set"></div>
        <div className="second-icon-list">
          {userType === 3 &&
            !isTaskManagementUser &&
            isShowOtherComplianceModule && (
              <div className="taskIcon position-relative">
                <div
                  className={`position-absolute ${
                    !openProfile &&
                    state &&
                    state.adminMenu.currentMenu === "other-compliance" &&
                    "iconActive"
                  }`}
                ></div>
                <img
                  style={{
                    cursor: "pointer",
                    width:
                      state.adminMenu.currentMenu === "other-compliance"
                        ? "20px"
                        : "18px",
                  }}
                  title="Other Compliance"
                  onClick={() => onMenuClick("other-compliance")}
                  src={
                    !openProfile &&
                    state &&
                    state.adminMenu.currentMenu === "other-compliance"
                      ? otherComplianceIconActive
                      : otherComplianceIconInActive
                  }
                  alt="other compliance icon"
                />
              </div>
            )}
          <div className="taskIcon position-relative">
            <div
              className={`position-absolute ${
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "settings" &&
                "iconActive"
              }`}
            ></div>
            <img
              style={{ cursor: "pointer" }}
              title="Settings"
              onClick={() => onMenuClick("settings")}
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "settings"
                  ? settingActive
                  : sidebarSettingIcon
              }
              alt="sidebar Setting Icon"
            />
          </div>

          <div className="taskIcon position-relative">
            <div
              className={`position-absolute ${
                openSuggestion ? "iconActive" : ""
              }`}
            ></div>

            <img
              style={{ cursor: "pointer" }}
              title="Suggestion"
              onClick={() => {
                dispatch(setSuggestionShow(true));
              }}
              src={suggestionIcon}
              alt="Suggestion"
            />
          </div>

          <div className="taskIcon position-relative">
            <div
              className={`position-absolute ${
                isShowLogoutModal ? "iconActive" : ""
              }`}
            ></div>
            <MdOutlinePowerSettingsNew
              title="Logout"
              style={{
                fontSize: "1.5rem",
                cursor: "pointer",
                color: isShowLogoutModal ? "black" : "gray",
              }}
              onClick={() => dispatch(setIsShowLogoutModal(true))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(LeftSideBar);
