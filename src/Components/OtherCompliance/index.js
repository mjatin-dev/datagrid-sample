import Container from "SharedComponents/Containers";
import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import YourLicenses from "./Components/YourLicenses";
import YourChecklist from "./Components/YourChecklist";
import YourCompliance from "./Components/YourCompliance";
import ChecklistDetail from "./Components/YourChecklist/ChecklistDetail";
import ComplianceDetails from "./Components/YourCompliance/ComplianceDetails";
const path = "/other-compliance";
const otherComplianceTabsList = [
  {
    id: 1,
    tab: "",
    tabName: "Your License",
    component: YourLicenses,
  },
  {
    id: 2,
    tab: "your-checklist",
    tabName: "Your Checklist",
    component: YourChecklist,
  },
  {
    id: 3,
    tab: "your-compliance",
    tabName: "Your Compliance",
    component: YourCompliance,
  },
];
const OtherCompliance = () => {
  const history = useHistory();
  const [otherComplianceActiveTab, setOtherComplianceActiveTab] = useState(
    otherComplianceTabsList[0]
  );

  useEffect(() => {
    const activeTab = otherComplianceTabsList.find(
      (item) => item.tab && history.location?.pathname?.includes(item.tab)
    );
    setOtherComplianceActiveTab(activeTab || otherComplianceTabsList[0]);
  }, [history.location]);

  return (
    <Container
      variant="main"
      className={`row ${styles.otherCompliance} w-100 mx-0`}
    >
      <div className={`col-3 px-0 ${styles.leftNavigationBar}`}>
        <div
          className={`${styles.leftNavigationBarItem} ${styles.leftNavigationBarHeaderTitle}`}
        >
          <h4>Other Compliance</h4>
        </div>
        {otherComplianceTabsList.map((item) => {
          return (
            <Link to={`${path}/${item.tab}`}>
              <div
                className={`${styles.leftNavigationBarItem} ${
                  otherComplianceActiveTab.tab === item.tab
                    ? styles.leftNavigationBarItemActive
                    : ""
                }`}
              >
                <h6>{item.tabName}</h6>
              </div>
            </Link>
          );
        })}
      </div>
      <Container variant="container" className="col-9">
        <Container variant="content">
          <Switch>
            {otherComplianceTabsList.map((item) => {
              return (
                <Route exact path={`${path}/${item.tab}`}>
                  <item.component
                    otherComplianceActiveTab={otherComplianceActiveTab}
                  />
                </Route>
              );
            })}
            <Route path={`${path}/your-checklist/checklist-details`}>
              <ChecklistDetail />
            </Route>
            <Route path={`${path}/your-compliance/compliance-details`}>
              <ComplianceDetails />
            </Route>
          </Switch>
        </Container>
      </Container>
    </Container>
  );
};

export default OtherCompliance;
