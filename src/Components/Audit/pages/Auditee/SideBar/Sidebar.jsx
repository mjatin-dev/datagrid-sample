import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./style.module.scss";

const SideBar = ({ ...rest }) => {
  const history = useHistory();
  const [pathName, setPathName] = useState(window?.location?.pathname);
  const [NavigationTabs, setNavigationTabs] = useState([
    {
      id: 1,
      title: "Assignments",
      routes: "/user-auditee/assignments",
    },
    {
      id: 3,
      title: "My Work",
      routes: `/user-auditee/my-work`,
    },
  ]);
  const redirectTo = (route) => {
    setPathName(route);
    history.push(route);
  };
  useEffect(() => {
    setPathName(window?.location?.pathname);
  }, [window?.location?.pathname]);
  return (
    <div className={styles.bar} {...rest}>
      <div className={styles.heading}>
        <h1>Auditee</h1>
      </div>
      <div className={styles.navigationMenu}>
        <ul>
          {NavigationTabs &&
            NavigationTabs.map((tab) => {
              return (
                <li
                  key={`audit-navigation-tab-${tab.id}`}
                  className={pathName === tab.routes ? styles.activeClass : ""}
                  onClick={() => redirectTo(tab.routes)}
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

export default SideBar;
