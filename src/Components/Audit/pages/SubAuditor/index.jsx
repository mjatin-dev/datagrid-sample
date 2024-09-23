import React from "react";
import styles from "./style.module.scss";
import Sidebar, { NavigationTabs } from "./Sidebar";
import AllAssignment from "./All-Assignment";
import { useRouteMatch, Route, Switch, useLocation } from "react-router";
import Container from "../../components/Containers";
import TaxAuditSubOrdinate from "./All-Assignment/TaxAllAssignment";

function RouterSubAuditor() {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  return (
    <Container variant="main">
      {(NavigationTabs.map((item) => item.routes).includes(pathname) ||
        pathname === "/sub-Auditor") && (
        <div className={styles.leftsidebar}>
          <Sidebar />
        </div>
      )}
      <Container variant="container">
        <Switch>
          <Route exact path={`${path}/all`}>
            <AllAssignment />
          </Route>
          <Route exact path={`${path}/process`}>
            <AllAssignment />
          </Route>
          <Route exact path={`${path}/pending`}>
            <AllAssignment />
          </Route>
          <Route exact path={`${path}/completed`}>
            <AllAssignment />
          </Route>
          {NavigationTabs.map((tab) => {
            return (
              <Route key={tab.id} path={`${path + "/" + tab.value}/assignment`}>
                <TaxAuditSubOrdinate />
              </Route>
            );
          })}
        </Switch>
      </Container>
    </Container>
  );
}

export default RouterSubAuditor;
