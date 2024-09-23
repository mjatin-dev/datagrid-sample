import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import closeBlack from "../../../../../../assets/Icons/closeBlack.png";
import settingActive from "../../../../../../assets/Icons/activeSetting.png";
import settingInactive from "../../../../../../assets/Icons/sidebarSettingIcon.png";
import { useOuterClick } from "../RightSideGrid/outerClick";
import {
  actions as setCurrentMenuActions,
  setIsShowLogoutModal,
} from "../../MenuRedux/actions";
import { useSelector, useDispatch } from "react-redux";
import taskActive from "../../../../../../assets/Icons/sidebar-active.png";
import taskInactive from "../../../../../../assets/Icons/task_alt_black_24dp (1).png";
import bellInactive from "../../../../../../assets/Icons/sidebarBell.png";
import bellActive from "../../../../../../assets/Icons/bellSelected.png";
import dashboardView from "../../../../../../assets/Icons/dashboardFirstIcon.png";
import circleClock from "../../../../../../assets/Icons/circleClock.png";
import circleClockActive from "../../../../../../assets/Icons/history_active.png";
import listIcon from "../../../../../../assets/Icons/listIcon.png";
import projectManagementInactiveIcon from "../../../../../../assets/Icons/projectManagementInactiveIcon.png";
import projectManagementIcon from "../../../../../../assets/Icons/Vector.png";
import trashIcon from "../../../../../../assets/Icons/trashIcon.svg";
import trashIconActive from "../../../../../../assets/Icons/trashIconActive.svg";
import dashBoardActiveIcon from "../../../../../../assets/Icons/dashBoardActiveIcon.png";

import "./style.css";
import { MdOutlinePowerSettingsNew } from "react-icons/md";

function MobileLeftSidebar({ history, close }) {
  const state = useSelector((state) => state);
  const userName = state?.auth?.loginInfo?.UserName;
  const dispatch = useDispatch();
  const [openProfile, setOpenProfile] = useState(false);

  const userDetails = state && state.auth && state.auth.loginInfo;

  const onMenuClick = (currentActiveMenu) => {
    close();
    dispatch(setCurrentMenuActions.setCurrentMenu(currentActiveMenu));
    if (currentActiveMenu === "taskList") {
      history.push("/dashboard");
    } else if (currentActiveMenu === "notifications") {
      history.push("/notifications");
    } else if (currentActiveMenu === "settings") {
      history.push("/settings");
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
    } else if (currentActiveMenu === "project-management") {
      history.push("/project-management");
    } else if (currentActiveMenu === "project-trash") {
      history.push("/project-trash");
    }
  };

  const handleClose = () => {
    history.push("/settings");
  };

  const onEditProfileClick = () => {
    close();
    history.push("/company-personal", handleClose());
    dispatch(setCurrentMenuActions.setActiveTabInSetting("personal"));
    dispatch(setCurrentMenuActions.setCurrentMenu("settings"));
  };

  return (
    <div
      id="navigationBar mobile-navigation-drower"
      style={{ overflow: "scroll" }}
    >
      <div className="left-bar">
        <div className="logo d-flex align-items-center justify-content-between pr-3">
          <p
            className="mb-0 cursor-pointer"
            onClick={onEditProfileClick}
            style={{ color: "#6c5dd3" }}
          >
            {userName}
          </p>
          <img
            src={closeBlack}
            alt="sideBarlogo"
            style={{ cursor: "pointer" }}
            onClick={() => close()}
          />
        </div>
        <div className="first-icon-list-mobile">
          {userDetails.UserType !== 4 && (
            <div
              onClick={() => onMenuClick("dashboard")}
              style={{ cursor: "pointer" }}
              className={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "dashboard"
                  ? "taskList-mobile"
                  : "inactiveMobile"
              }
            >
              <img
                src={
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "dashboard"
                    ? dashBoardActiveIcon
                    : dashboardView
                }
                style={{ cursor: "pointer", width: "18px" }}
                alt="sideBarlogo"
              />{" "}
              Dashboard
            </div>
          )}
          <div
            onClick={() => onMenuClick("taskList")}
            style={{ cursor: "pointer" }}
            className={
              !openProfile &&
              state &&
              state.adminMenu.currentMenu === "taskList"
                ? "taskList-mobile"
                : "inactiveMobile"
            }
          >
            <img
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "taskList"
                  ? taskActive
                  : taskInactive
              }
              alt="sideBarlogo"
            />{" "}
            Tasks
          </div>
          <div
            onClick={() => onMenuClick("notifications")}
            style={{ cursor: "pointer" }}
            className={
              !openProfile &&
              state &&
              state.adminMenu.currentMenu === "notifications"
                ? "taskList-mobile"
                : "inactiveMobile"
            }
          >
            <img
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "notifications"
                  ? bellActive
                  : bellInactive
              }
              alt="sideBarlogo"
            />{" "}
            Notifications
          </div>
          <div
            onClick={() => onMenuClick("history")}
            style={{ cursor: "pointer" }}
            className={
              !openProfile && state && state.adminMenu.currentMenu === "history"
                ? "taskList-mobile"
                : "inactiveMobile"
            }
          >
            <img
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "history"
                  ? circleClockActive
                  : circleClock
              }
              style={{ cursor: "pointer", width: "18px" }}
              alt="sideBarlogo"
            />{" "}
            Compliance History
          </div>
          {/* {userDetails.UserType !== 4 && (
            <div
              onClick={() => onMenuClick("project-management")}
              style={{ cursor: "pointer" }}
              className={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "project-management"
                  ? "taskList-mobile"
                  : "inactiveMobile"
              }
            >
              <img
                src={
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "project-management"
                    ? projectManagementIcon
                    : projectManagementInactiveIcon
                }
                alt="sideBarlogo"
                style={{ cursor: "pointer", width: "18px" }}
              />{" "}
              <span>Projects</span>
            </div>
          )} */}
          {userDetails.UserType !== 4 && (
            <div
              onClick={() => onMenuClick("updates")}
              style={{ cursor: "pointer" }}
              className={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "updates"
                  ? "taskList-mobile"
                  : "inactiveMobile"
              }
            >
              <img
                src={listIcon}
                alt="sideBarlogo"
                style={{ cursor: "pointer", width: "18px" }}
              />{" "}
              <span>Updates</span>
            </div>
          )}
          {userDetails.UserType !== 4 && (
            <div
              onClick={() => onMenuClick("project-trash")}
              style={{ cursor: "pointer" }}
              className={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "project-trash"
                  ? "taskList-mobile"
                  : "inactiveMobile"
              }
            >
              <img
                src={
                  !openProfile &&
                  state &&
                  state.adminMenu.currentMenu === "project-trash"
                    ? trashIconActive
                    : trashIcon
                }
                alt="sideBarlogo"
                style={{ cursor: "pointer", width: "18px" }}
              />{" "}
              <span>Trash</span>
            </div>
          )}
        </div>
        <div className="devider-line"></div>
        <div className="second-icon-list">
          <div
            onClick={() => onMenuClick("settings")}
            style={{ cursor: "pointer" }}
            className={
              !openProfile &&
              state &&
              state.adminMenu.currentMenu === "settings"
                ? "taskList-mobile"
                : "inactiveMobile"
            }
          >
            <img
              src={
                !openProfile &&
                state &&
                state.adminMenu.currentMenu === "settings"
                  ? settingActive
                  : settingInactive
              }
              alt="sideBarlogo"
            />{" "}
            Settings
          </div>
          <div
            onClick={() => {
              dispatch(setIsShowLogoutModal(true));
              close();
            }}
            style={{ cursor: "pointer" }}
            className="inactiveMobile"
          >
            <MdOutlinePowerSettingsNew
              title="Logout"
              style={{
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "gray",
                marginRight: "17px",
              }}
            />
            Logout
          </div>
          {/* <div
            onClick={() => onMenuClick("help")}
            style={{ cursor: "pointer" }}
            className={
              !openProfile && state && state.adminMenu.currentMenu === "help"
                ? "taskList-mobile"
                : "inactiveMobile"
            }
          >
            <img
              src={
                !openProfile && state && state.adminMenu.currentMenu === "help"
                  ? questionIconActive
                  : questionIcon
              }
              style={{ cursor: "pointer", width: "18px" }}
              alt="sideBarlogo"
            />{" "}
            Help & Support
          </div> */}
          {/* <div style={{ cursor: "pointer" }} className="inactiveMobile">
            <img
              src={listIcon}
              alt="sideBarlogo"
              style={{ cursor: "pointer", width: "18px" }}
            />{" "}
            Modules
          </div> */}
          {/* <div
            onClick={() => setOpenProfile(true)}
            style={{ cursor: "pointer" }}
            className={openProfile ? "taskList-mobile" : "inactiveMobile"}
          >
            <img
              src={openProfile ? userActive : userInactive}
              alt="sidebar Account Circle"
            />{" "}
            Profile
            <img
              className={openProfile ? "top-arrow-mobile" : "down-arrow-mobile"}
              src={mobileTopArrow}
              alt="edit"
            />
            {openProfile && (
              <div className="">
                <div ref={openProfileRef} className="edit-option-box">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => onEditProfileClick()}
                    className="edit-label-option"
                  >
                    <img src={editpen} alt="edit" /> Edit Profile
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => onLogoutClick()}
                    className="logout-label-option border-0"
                  >
                    <img src={LogoutIcon} alt="logout Icon" /> Deactivate
                    Account
                  </div>
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default withRouter(MobileLeftSidebar);
