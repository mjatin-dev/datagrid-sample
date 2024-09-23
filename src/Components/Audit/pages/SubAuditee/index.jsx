import React from "react";
import styles from "./style.module.scss";
import AuditeeSideBar from "../SubAuditee/Sidebar";
import AllAuditeeAssignment from "./All-Assignment";
import { useRouteMatch, Route, Switch, useLocation } from "react-router";
import Container from "Components/Audit/components/Containers";
import TaxAuditeeSubOrdinate from "./All-Assignment/TaxAssignmentAuditee";

function RouterSubAuditee() {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();

  const routesArray = [
    {
      id: 1,
      route: `${path}/all`,
    },
    {
      id: 2,
      route: `${path}/complete`,
    },
    {
      id: 3,
      route: `${path}/progress`,
    },
    {
      id: 4,
      route: `${path}/pending`,
    },
  ];
  return (
    <Container variant="main">
      {(routesArray.map((item) => item.route).includes(pathname) ||
        pathname === "/sub-auditee") && (
        <div className={styles.leftsidebar}>
          <AuditeeSideBar />
        </div>
      )}

      <Container variant="container">
        <Switch>
          {routesArray?.map((item, index) => (
            <Route exact path={item.route} key={index}>
              <AllAuditeeAssignment />
            </Route>
          ))}
          <Route path={`${path}/:status/assignment`}>
            <TaxAuditeeSubOrdinate />
          </Route>
        </Switch>
      </Container>
    </Container>
  );
}

export default RouterSubAuditee;
