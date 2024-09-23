import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./style.module.scss";

const NavigationTabs = [
  {
    id: 1,
    title: "Templates",
    routes: `/audit`,
  },
  {
    id: 2,
    title: "Assignments",
    routes: `/audit/assignments`,
  },
  {
    id: 4,
    title: "Company",
    routes: `/audit/company`,
  },
];

const SideBar = ({ ...rest }) => {
  const history = useHistory();
  const [pathName, setPathName] = useState(window?.location?.pathname);
  const redirectTo = (route) => {
    setPathName(route);
    history.push(route);
  };

  useEffect(()=>{
    setPathName(window?.location?.pathname);
  },[window?.location?.pathname])

  return (
    <div className={styles.bar} {...rest}>
      <div className={styles.heading}>
        <h1>Audit</h1>
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
