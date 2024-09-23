import React from "react";
import SideBar from "./SideBar/Sidebar";
import { useRouteMatch, Route, Switch, useLocation } from "react-router";
import Container from "../../components/Containers";
import User from "./User/User";
import WorkStatus from "./User/WorkStatus";
import CompletedWorkQuestionnarie from "./User/WorkStatus/CompletedWork/Questionnarie/index";
import CurrentWorkQuestionnarie from "./User/WorkStatus/CurrentWork/Questionnarie/index";
import MyWork from "../MyWork/index";
import MyWorkQuestionnarie from "../MyWork/questionsAndCheckpoints/index";
import AuditTemplates from "../AuditTemplates";
import TaxAudit from "../AuditTemplates/TaxAudit";
import Assignments from "../Assignments";
import TaxAuditAssignment from "../Assignments/TaxAuditAssignment";
import AuditAssignment from "../AuditAssignment";
import FormBuilder from "../FormBuilder";
import AssignChecklistAndDetails from "../Assignments/AssignAssignment";
const pathName = "/user-auditee";
const whiteListRoutes = [
  `${pathName}/user`,
  `${pathName}/work-status`,
  `${pathName}/my-work`,
  `${pathName}/assignments`,
  pathName,
];

function Audtee() {
  const { path } = useRouteMatch();
  const location = useLocation();
  return (
    <div>
      <Container variant="main">
        {/* <div> */}
        <SideBar
          style={{
            ...(!whiteListRoutes?.includes(location.pathname) && {
              width: "0px",
              minWidth: "0px",
            }),
          }}
        />
        {/* </div> */}
        <Container variant="container">
          <Switch>
            <Route exact path={`${path}`}>
              <AuditTemplates />
            </Route>
            <Route exact path={`${path}/template`}>
              <TaxAudit />
            </Route>
            <Route exact path={`${path}/create-template`}>
              <FormBuilder />
            </Route>
            <Route exact path={`${path}/assignments`}>
              <Assignments />
            </Route>
            <Route exact path={`${path}/assignments/assignment/:id/:type`}>
              <TaxAuditAssignment />
            </Route>
            <Route exact path={`${path}/assignments/assignment/:id/:type/:assign`}>
            <AssignChecklistAndDetails/>
          </Route>
            <Route exact path={`${path}/assignments/audit-assignment`}>
              <AuditAssignment />
            </Route>
            <Route exact path={`${path}/user`}>
              <User />
            </Route>
            <Route exact path={`${path}/user/work-status`}>
              <WorkStatus />
            </Route>
            <Route
              exact
              path={`${path}/user/work-status/completed/questionnaire`}
            >
              <CompletedWorkQuestionnarie />
            </Route>
            <Route
              exact
              path={`${path}/user/work-status/current/questionnaire`}
            >
              <CurrentWorkQuestionnarie />
            </Route>
            <Route exact path={`${path}/my-work`}>
              <MyWork />
            </Route>
            <Route exact path={`${path}/my-work/questionnarie`}>
              <MyWorkQuestionnarie />
            </Route>
          </Switch>
        </Container>
      </Container>
    </div>
  );
}

export default Audtee;
