import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./style.module.scss";
import { useEffect } from "react";

const SideBar = ({ ...rest }) => {
  const history = useHistory();
  const [pathName, setPathName] = useState(window?.location?.pathname);
  const [paths, setPaths] = useState([
    {
      id: 1,
      title: "Assignments",
      routes: "/auditor/assignments",
    },
    {
      id: 2,
      title: "My Work",
      routes: `/auditor/mywork`,
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
        <h1>Auditor</h1>
      </div>
      <div className={styles.navigationMenu}>
        <ul>
          {paths &&
            paths.map((tab) => {
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
