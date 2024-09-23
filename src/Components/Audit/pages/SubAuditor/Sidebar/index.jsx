import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { subAuditorModuleActions } from "../../../redux/subAuditorModuleActions";
import styles from "./style.module.scss";

export const NavigationTabs = [
  {
    id: 1,
    title: "All Assignment",
    routes: `/sub-Auditor/all`,
    value: "all",
  },
  {
    id: 2,
    title: "In progress",
    routes: `/sub-Auditor/process`,
    value: "process",
  },
  {
    id: 3,
    title: "Pending",
    routes: `/sub-Auditor/pending`,
    value: "pending",
  },
  {
    id: 4,
    title: "Complete",
    routes: `/sub-Auditor/completed`,
    value: "completed",
  },
];

const Sidebar = () => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState("");
  const dispatch = useDispatch();
  const currentStatusTab = useSelector(
    (state) => state?.AuditReducer?.subAuditorModule?.currentStatusTab
  );
  useEffect(() => {
    if (currentTab) {
      const tabDetails = NavigationTabs.find(
        (element) => element.value === currentTab
      );
      history.push(tabDetails.routes);
      dispatch(subAuditorModuleActions.fetchAssignmentList(currentTab));
      dispatch(subAuditorModuleActions.setStatusTab(currentTab));
    }
  }, [currentTab]);

  useEffect(() => {
    setCurrentTab(currentStatusTab);
  }, [currentStatusTab]);
  return (
    <div className={styles.bar}>
      <div className={styles.heading}>
        <h1>Sub Auditor</h1>
      </div>
      <div className={styles.navigationMenu}>
        <ul>
          {NavigationTabs &&
            NavigationTabs.map((tab) => {
              return (
                <li
                  key={`subauditor-navigation-tab-${tab.id}`}
                  className={currentTab === tab.value ? styles.activeClass : ""}
                  onClick={() => setCurrentTab(tab.value)}
                >
                  <span>{tab.title}</span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
