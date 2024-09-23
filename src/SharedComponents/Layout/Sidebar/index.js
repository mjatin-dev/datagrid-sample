import React from "react";

import sideBarlogo from "assets/Icons/sideBarlogo.png";
import SideBaruser from "assets/Icons/sideBaruser.png";
import sidebarRightActive from "assets/Icons/task_alt_black_24dp (1).png";
import sidebarBell from "assets/Icons/sidebarBell.png";
import dashboardView from "assets/Icons/dashboardFirstIcon.png";
import sidebarSettingIcon from "assets/Icons/sidebarSettingIcon.png";
import projectManagementInactiveIcon from "assets/Icons/projectManagementInactiveIcon.svg";
import historyListInActive from "assets/Icons/history_unactive.png";
import Audit2 from "assets/Icons/audit2.png";
import Regulation2 from "assets/Icons/regulation2.png";
import trashIcon from "assets/Icons/trashIcon.svg";

import { withRouter } from "react-router-dom";
import styles from "./styles.module.scss";

function SideBar({ history, isTaskListOpen, setIsTaskListOpen }) {
  return (
    <div className={styles.leftSiderBardContainer}>
      <div className={styles.brandLogo}>
        <img src={sideBarlogo} alt="sideBarlogo" />
      </div>
      <div className={styles.tabsList}>
        <div className={styles.tabLink}>
          <img
            title="Dashboard"
            src={dashboardView}
            alt="sidebar Active"
            style={{ width: "16px" }}
          />
        </div>
        <div className={styles.tabLink}>
          <img title="Tasks" src={sidebarRightActive} alt="sidebar Active" />
        </div>
        <div className={styles.tabLink}>
          <img title="Notifications" src={sidebarBell} alt="sidebar Bell" />
        </div>

        <div className={styles.tabLink}>
          <img
            title="Compliance History"
            src={historyListInActive}
            alt="sidebar Bell"
          />
        </div>

        <div className={styles.tabLink}>
          <img
            title="Project Management"
            src={projectManagementInactiveIcon}
            alt="sidebar Bell"
            style={{ width: "16px" }}
          />
        </div>

        <div className={styles.tabLink}>
          <img title="Updates" src={Regulation2} alt="sidebar Bell" />
        </div>

        <div className={styles.tabLink}>
          <img title="Audit" src={Audit2} alt="sidebar Bell" />
        </div>

        <div className={styles.tabLink}>
          <img
            title="Trash"
            src={trashIcon}
            alt="sidebar Bell"
            style={{ width: "16px" }}
          />
        </div>
        <div className="devider-line devider-line-set"></div>

        <div className={styles.tabLink}>
          <img
            style={{ cursor: "pointer" }}
            title="Settings"
            src={sidebarSettingIcon}
            alt="sidebar Setting Icon"
          />
        </div>

        <div className={styles.tabLink}>
          <img
            style={{ cursor: "pointer" }}
            title="Profile"
            src={SideBaruser}
            alt="sidbar User"
          />
        </div>
      </div>
    </div>
  );
}

export default withRouter(SideBar);
