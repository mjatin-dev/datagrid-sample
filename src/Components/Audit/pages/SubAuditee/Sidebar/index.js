import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styles from "./style.module.scss";

export const NavigationTabs = [
  {
    id: 1,
    title: "All Assignment",
    routes: `/sub-auditee/all`,
    value: "all",
  },
  {
    id: 2,
    title: "In progress",
    routes: `/sub-auditee/progress`,
    value: "process",
  },
  {
    id: 3,
    title: "Pending",
    routes: `/sub-auditee/pending`,
    value: "pending",
  },
  {
    id: 4,
    title: "Complete",
    routes: `/sub-auditee/complete`,
    value: "completed",
  },
];

const AuditeeSideBar = () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const [pathName, setPathName] = useState(window?.location?.pathname);
  const redirectTo = (route, title) => {
    setPathName(route);
    history.push({
      pathname: route,
      state: title,
    });
  };

  useEffect(() => {
    setPathName(window?.location?.pathname);
  }, [window?.location?.pathname]);
  return (
    <div className={styles.bar}>
      <div className={styles.heading}>
        <h1>SubAuditee</h1>
      </div>
      <div className={styles.navigationMenu}>
        <ul>
          {NavigationTabs &&
            NavigationTabs.map((tab) => {
              return (
                <li
                  key={`auditee-navigation-tab-${tab.id}`}
                  className={pathName === tab.routes ? styles.activeClass : ""}
                  onClick={() => redirectTo(tab.routes, tab.value)}
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

export default AuditeeSideBar;
