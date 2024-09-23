/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import { withRouter } from "react-router-dom";
import SideBarInputControl from "../LeftSideBar";
import Cobg from "../../../../../../assets/Images/Onboarding/co-bg.png";
import CoPersonal from "./CoPersonal";
import sideBarlogo from "../../../../../../assets/Icons/sideBarlogo.png";
import CoCompany from "./CoCompany";
import togglemobile from "../../../../../../assets/Icons/togglemobile.png";
import CoNotification from "./CoNotification";
import CoAccount from "./CoAccount/PurhcasePlan";
import CoSecurity from "./CoSecurity";
import MobileSettingSideBar from "./MobileSettingSideBar";
import CoTeamMember from "./CoTeamMember";
import { actions as adminMenuActions } from "../../MenuRedux/actions";
import SettingSideBar from "./SettingSideBar";
import MobileLeftSidebar from "../MobileLeftSidebar";
import { isMobile } from "react-device-detect";
import Auth from "../../../../../Authectication/components/Auth";
import Container from "SharedComponents/Containers";
import NightlyReports from "./CoNightlyReports/index";
import CoNotApplicableTasks from "./CoNotApplicableTasks";
const settingJson = [
  { type: 1, isEnable: true },
  { type: 2, isEnable: false },
  { type: 3, isEnable: true },
  { type: 4, isEnable: false },
  { type: 5, isEnable: true },
];
function CoSetting({ history }) {
  const state = useSelector((state) => state);
  const sideBarOpen = useSelector(
    (state) => state?.taskReport?.sideBarOpenClose || false
  );

  const dispatch = useDispatch();
  const [notificationSetting, setNotificationSetting] = useState(null);
  const [selectedTabKey, setSelectedTabKey] = useState(0);

  const [showHB, setShowHBMenu] = useState(false);

  useEffect(() => {
    setNotificationSetting(settingJson);
  }, []);
  useEffect(() => {
    if (
      window.location.href.includes("settings") &&
      state.adminMenu.currentMenu !== "settings"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("settings"));
    }
  }, []);
  const handleTabChange = (key) => {
    if (selectedTabKey !== key) {
      setSelectedTabKey(key);
    }
  };
  const onHBMenu = () => {
    const drawerParent = document.getElementById("sideBarParent");
    const drawerChild = document.getElementById("sideBarChild");
    console.log(drawerParent, "drawerParent");
    if (drawerParent) {
      drawerParent.classList.add("overlay");
      drawerChild.style.left = "0%";
    }
  };

  const closeMobileSidebar = () => {
    const drawerParent = document.getElementById("sideBarParent");
    const drawerChild = document.getElementById("sideBarChild");
    if (drawerParent) {
      drawerParent.classList.remove("overlay");
      drawerChild.style.left = "-100%";
    }
    setShowHBMenu(false);
  };

  return (
    <div className="row co-setting no-gutters">
      <Auth />
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
      <div className={`${sideBarOpen ? "col-1" : "col-3"}`}>
        <div
          className={`${sideBarOpen ? "side-bar-outer2" : "side-bar-outer"}`}
        >
          <SideBarInputControl />
          <SettingSideBar
            activeTabKey={selectedTabKey}
            handleTabChange={(key) => handleTabChange(key)}
          />
        </div>
      </div>
      {!isMobile && (
        <Container variant="main" className={sideBarOpen ? "col" : "col-9"}>
          <Container variant="container">
            <Container variant="content" isShowAddTaskButton>
              {state.adminMenu.activeTab === "personal" && (
                <CoPersonal activeTabKey={selectedTabKey} />
              )}
              {state.adminMenu.activeTab === "NotApplicableTasks" && (
                <CoNotApplicableTasks activeTabKey={selectedTabKey} />
              )}
              {state.adminMenu.activeTab === "company" && (
                <CoCompany activeTabKey={selectedTabKey} />
              )}
              {state.adminMenu.activeTab === "account" && (
                <CoAccount activeTabKey={selectedTabKey} />
              )}
              {state.adminMenu.activeTab === "notifications" && (
                <CoNotification
                  activeTabKey={selectedTabKey}
                  settingData={notificationSetting}
                />
              )}
              {state.adminMenu.activeTab === "security" && (
                <CoSecurity activeTabKey={selectedTabKey} />
              )}

              {state.adminMenu.activeTab === "team-member" && (
                <CoTeamMember activeTabKey={selectedTabKey} />
              )}
              {state.adminMenu.activeTab === "nightly-job-reports" && (
                <NightlyReports activeTabKey={selectedTabKey} />
              )}
            </Container>
          </Container>
        </Container>
      )}
      {showHB === false && (
        <div className=" d-block d-md-none pad-ms pr-4">
          <div className="d-flex">
            <div
              className="w-25"
              style={{ cursor: "pointer" }}
              onClick={() => {
                onHBMenu();
              }}
            >
              <img src={togglemobile} alt="toggle mobile" />
            </div>
            <div className="w-75 pr-4">
              {" "}
              <img
                className="mobile-logo"
                src={sideBarlogo}
                alt="sideBarlogo"
              />{" "}
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <MobileSettingSideBar showHB={showHB} setShowHBMenu={setShowHBMenu} />
      )}
    </div>
  );
}

export default withRouter(CoSetting);
