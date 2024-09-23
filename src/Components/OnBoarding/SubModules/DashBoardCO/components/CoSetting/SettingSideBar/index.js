import React, { useEffect, useState } from "react";
import "./style.css";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { actions as adminMenuActions } from "../../../MenuRedux/actions";
import { actions as coSettingSideBarOpen } from "../../../redux/actions";
import MobileLeftSidebar from "../../MobileLeftSidebar";
import { isMobile } from "react-device-detect";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";

function SettingSideBar({ handleTabChange, history }) {
  const [isOpen, setIsOpen] = useState(false);
  const userTypeNo = useSelector((state) => state?.auth?.loginInfo?.UserType);
  const emailID = useSelector(
    (state) => state?.auth?.loginInfo?.EmailID || state?.auth?.loginInfo?.email
  );

  const state = useSelector((state) => state);

  const { isTaskManagementUser } = useGetUserRoles();

  const [openSettings, setOpenSettings] = useState(false);
  const dispatch = useDispatch();

  const isShowNightlyJobReports = [
    "padmapujari14+4103@gmail.com",
    "hitendraparanjpe+201@trakiot.in",
    "ashuk+hughie@trakiot.in",
    "padma@secmark.net",
    "kaushik@secmark.in",
    "hitendraparanjpe@trakiot.in",
    "amit+a@trakiot.in",
  ].includes(emailID);

  const userDetails = state && state.auth && state.auth.loginInfo;

  const onSettingsOpenClose = () => {
    setOpenSettings(!openSettings);
    dispatch(coSettingSideBarOpen.coSettingSideBarOpen(!openSettings));
  };

  // const onLogoutClick = () => {
  //   if (userDetails.UserType === 3) {
  //     dispatch(adminMenuActions.setCurrentMenu("dashboard"));
  //   } else {
  //     dispatch(adminMenuActions.setCurrentMenu("taskList"));
  //   }
  //   dispatch(adminMenuActions.setActiveTabInSetting("personal"));
  //   dispatch(clearTaskDetail());
  //   dispatch(adminMenuActions.setTakeActionTab(""));
  //   dispatch(loginActions.createLogoutAction());
  //   dispatch(adminMenuActions.setCurrentBoardViewTaskId(null));
  //   dispatch(notficationActions.setTaskID(null));
  //   dispatch(adminMenuActions.setCurrentCalendarViewTaskId(null));
  //   dispatch(clearDashboardAnalytics());
  //   localStorage.removeItem("basicToken");
  //   localStorage.removeItem("deviceToken");
  //   localStorage.removeItem("userType");
  //   history.push("/login");
  // };
  const closeMobileSidebar = () => {
    // const drawerParent = document.getElementById("sideBarParent");
    // const drawerChild = document.getElementById("sideBarChild");
  };

  const deactivateAccount = () => {
    setIsOpen(true);
  };

  const tabChange = (index) => {
    handleTabChange(index);
    history.push("/settings");
    if (index === 0) {
      dispatch(adminMenuActions.setActiveTabInSetting("personal"));
    } else if (index === 1) {
      dispatch(adminMenuActions.setActiveTabInSetting("company"));
    } else if (index === 2) {
      dispatch(adminMenuActions.setActiveTabInSetting("account"));
    } else if (index === 3) {
      dispatch(adminMenuActions.setActiveTabInSetting("notifications"));
    } else if (index === 4) {
      dispatch(adminMenuActions.setActiveTabInSetting("security"));
    } else if (index === 5) {
      dispatch(adminMenuActions.setActiveTabInSetting("team-member"));
    } else if (index === 6) {
      dispatch(adminMenuActions.setActiveTabInSetting("nightly-job-reports"));
    } else if (index === 7) {
      dispatch(adminMenuActions.setActiveTabInSetting("NotApplicableTasks"));
    } else {
    }
  };

  useEffect(() => {
    setOpenSettings(false);
    dispatch(coSettingSideBarOpen.coSettingSideBarOpen(false));
  }, []);

  return (
    <div className="setting-side-bar">
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

      <div className="get-main-settingCo">
        <div className="SettingBtn justify-content-between align-items-center">
          {!openSettings && <p className="setting-title mb-0">Settings</p>}
          <p
            onClick={onSettingsOpenClose}
            className="cursor-pointer d-md-block d-none"
          >
            {openSettings ? (
              <BiArrowToRight className="leftRightIcons" />
            ) : (
              <BiArrowToLeft className="leftRightIcons" />
            )}
          </p>
        </div>
        {!openSettings && (
          <div className="menu-items">
            {(userDetails && userDetails.UserType === 4) ||
            userDetails.UserType === 5 ? (
              <ul>
                <li
                  onClick={() => tabChange(0)}
                  className={
                    state.adminMenu.activeTab === "personal"
                      ? "active-class un-active-class"
                      : ""
                  }
                >
                  {" "}
                  <span>Personal </span>
                </li>
                {/* <li
                  onClick={() => tabChange(3)}
                  className={
                    state.adminMenu.activeTab === "notifications"
                      ? "active-class un-active-class"
                      : ""
                  }
                >
                  <span>Notification </span>
                </li> */}
                <li
                  onClick={() => tabChange(4)}
                  className={
                    state.adminMenu.activeTab === "security"
                      ? "active-class un-active-class"
                      : ""
                  }
                >
                  <span>Security </span>
                </li>
                {isShowNightlyJobReports && (
                  <li
                    onClick={() => tabChange(6)}
                    className={
                      state.adminMenu.activeTab === "nightly-job-reports"
                        ? "active-class un-active-class"
                        : ""
                    }
                  >
                    <span>Nightly Job Reports</span>
                  </li>
                )}
                {userTypeNo !== 16 &&
                  userTypeNo !== 14 &&
                  userTypeNo !== 13 &&
                  userTypeNo !== 9 &&
                  userTypeNo !== 8  && (
                  <li
                    onClick={() => tabChange(7)}
                    className={
                      state.adminMenu.activeTab === "NotApplicableTasks"
                        ? "active-class un-active-class"
                        : ""
                    }
                  >
                    <span>Not Applicable tasks</span>
                  </li>
                )}
              </ul>
            ) : (
              <ul>
                <li
                  onClick={() => tabChange(0)}
                  className={
                    state.adminMenu.activeTab === "personal"
                      ? "active-class un-active-class"
                      : ""
                  }
                >
                  {" "}
                  <span>Personal </span>
                </li>
                {userTypeNo !== 16 &&
                  userTypeNo !== 14 &&
                  userTypeNo !== 13 &&
                  userTypeNo !== 9 &&
                  userTypeNo !== 8 && (
                    <li
                      onClick={() => tabChange(1)}
                      className={
                        state.adminMenu.activeTab === "company"
                          ? "active-class un-active-class"
                          : ""
                      }
                    >
                      <span>Company </span>
                    </li>
                  )}
                {userTypeNo !== 16 &&
                  userTypeNo !== 14 &&
                  userTypeNo !== 13 &&
                  userTypeNo !== 9 &&
                  userTypeNo !== 8 &&
                  !isTaskManagementUser && (
                    <li
                      onClick={() => tabChange(2)}
                      className={
                        state.adminMenu.activeTab === "account"
                          ? "active-class un-active-class"
                          : ""
                      }
                    >
                      <span>Account</span>
                    </li>
                  )}
                {/* <li
                onClick={() => tabChange(3)}
                className={
                  state.adminMenu.activeTab === "notifications"
                    ? "active-class un-active-class"
                    : ""
                }
              >
                <span>Notification </span>
              </li> */}
                <li
                  onClick={() => tabChange(4)}
                  className={
                    state.adminMenu.activeTab === "security"
                      ? "active-class un-active-class"
                      : ""
                  }
                >
                  <span>Security </span>
                </li>
                {userTypeNo !== 13 && userTypeNo !== 14 && (
                  <li
                    onClick={() => tabChange(5)}
                    className={
                      state.adminMenu.activeTab === "team-member"
                        ? "active-class un-active-class"
                        : ""
                    }
                  >
                    <span>Team Members </span>
                  </li>
                )}
                {isShowNightlyJobReports && (
                  <li
                    onClick={() => tabChange(6)}
                    className={
                      state.adminMenu.activeTab === "nightly-job-reports"
                        ? "active-class un-active-class"
                        : ""
                    }
                  >
                    <span>Nightly Job Reports</span>
                  </li>
                )}
                {userTypeNo !== 16 &&
                  userTypeNo !== 14 &&
                  userTypeNo !== 13 &&
                  userTypeNo !== 9 &&
                  userTypeNo !== 8 && (
                  <li
                    onClick={() => tabChange(7)}
                    className={
                      state.adminMenu.activeTab === "NotApplicableTasks"
                        ? "active-class un-active-class"
                        : ""
                    }
                  >
                    <span>Not Applicable tasks</span>
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(SettingSideBar);
