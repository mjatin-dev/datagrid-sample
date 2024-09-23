import { useState } from "react";
import styles from "./styles.module.scss";
import { useHistory } from "react-router";

const adminTabsForEvents = [
  {
    tabName: "SME Application Form",
    route: "/smeApplication",
  },
  {
    tabName: "Registered SME",
    route: "/events",
  },
  {
    tabName: "Template",
    route: "/new-requirements",
  },
];

const HeaderTabsForEventPage = ({ defaultTabIndex = 0 }) => {
  const [activeTab, setActiveTab] = useState(
    adminTabsForEvents[defaultTabIndex].tabName
  );
  const history = useHistory();
  return (
    <div className={styles.header}>
      {adminTabsForEvents.map((tab) => {
        return (
          <div
            onClick={() => {
              setActiveTab(tab.tabName);
              history.replace(tab.route);
            }}
            className={`${styles.tab} ${
              activeTab === tab.tabName && styles.tabActive
            }`}
          >
            {tab.tabName}
          </div>
        );
      })}
    </div>
  );
};

export default HeaderTabsForEventPage;
