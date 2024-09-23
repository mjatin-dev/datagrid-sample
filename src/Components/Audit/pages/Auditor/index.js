import React from "react";
import SideBar from "./SideBar/Sidebar";
import { useRouteMatch, Route, Switch, useLocation } from "react-router";
import Container from "../../components/Containers";
import User from "./User";
import WorkAuditorUser from "./User/WorkAuditUser";
import AuditorCompletedUser from "./User/WorkAuditUser/CompletedWork/TaxAuditCompletedUser";
import AuditorCurrentUser from "./User/WorkAuditUser/CurrentWork/TaxAuditCurrentUser";
import Reassign from "./User/WorkAuditUser/Reassign";
import MyWork from "../MyWork/index";
import MyWorkQuestionnarie from "../MyWork/questionsAndCheckpoints/index";
import Remark from "../../components/Remarks";
import AuditTemplates from "../AuditTemplates";
import AuditAssignment from "../AuditAssignment";
import Assignments from "../Assignments";
import TaxAuditAssignment from "../Assignments/TaxAuditAssignment";
import TaxAudit from "../AuditTemplates/TaxAudit";
import AssignChecklistAndDetails from "../Assignments/AssignAssignment";
import FormBuilder from "../FormBuilder";
import AuditCompany from "../AuditCompany";
import CompanyBranches from "../AuditCompany/Branches";
import CompanyWorkStatus from "../AuditCompany/WorkStatus";
import CompanyCoWorkQuesCheck from "../AuditCompany/WorkStatus/CompletedWorkQuestionandCheckPoints";
import CompanyCuWorkQuesCheck from "../AuditCompany/WorkStatus/CurrentWorkQuestionandCheckPoints";

const pathName = "/auditor";
const whitelistPathnames = [
  `${pathName}`,
  `${pathName}/user`,
  `${pathName}/mywork`,
  `${pathName}/assignments`,
  `${pathName}/company`,
  `${pathName}/company/branches`,
];
function Auditor() {
  const { path } = useRouteMatch();
  const location = useLocation();
  return (
    <div>
      <Container variant="main">
        <SideBar
          style={{
            ...(!whitelistPathnames.includes(location.pathname) && {
              width: "0px",
              minWidth: "0px",
            }),
          }}
        />

        <Container variant="container">
          <Switch>
            <Route exact path={`${path}/user`}>
              <User />
            </Route>
            <Route exact path={`${path}`}>
              <AuditTemplates />
            </Route>
            <Route exact path={`${path}/create-template`}>
              <FormBuilder />
            </Route>
            <Route exact path={`${path}/template`}>
              <TaxAudit />
            </Route>
            <Route exact path={`${path}/assignments`}>
              <Assignments />
            </Route>
            <Route exact path={`${path}/assignments/assignment/:id/:type`}>
              <TaxAuditAssignment />
            </Route>
            <Route
              exact
              path={`${path}/assignments/assignment/:id/:type/:assign`}
            >
              <AssignChecklistAndDetails />
            </Route>
            <Route exact path={`${path}/assignments/audit-assignment`}>
              <AuditAssignment />
            </Route>
            <Route exact path={`${path}/user/work-user`}>
              <WorkAuditorUser />
            </Route>
            <Route exact path={`${path}/user/work-user/complete-work`}>
              <AuditorCompletedUser />
            </Route>
            <Route exact path={`${path}/user/work-user/complete-work/remark`}>
              <Remark />
            </Route>
            <Route exact path={`${path}/user/work-user/current-work`}>
              <AuditorCurrentUser />
            </Route>
            <Route exact path={`${path}/user/work-user/current-work/remark`}>
              <Remark />
            </Route>
            <Route exact path={`${path}/user/work-user/reassign`}>
              <Reassign />
            </Route>
            <Route exact path={`${path}/mywork`}>
              <MyWork />
            </Route>
            <Route exact path={`${path}/mywork/questionnarie`}>
              <MyWorkQuestionnarie />
            </Route>
            <Route exact path={`${path}/company`}>
            <AuditCompany />
          </Route>
            <Route exact path={`${path}/company/branches`}>
            <CompanyBranches />
          </Route>
          <Route exact path={`${path}/company/branches/work-status`}>
            <CompanyWorkStatus />
          </Route>
          <Route
            exact
            path={`${path}/company/branches/work-status/completed-work/questionaire-checklist`}
          >
            <CompanyCoWorkQuesCheck />
          </Route>
          <Route
            exact
            path={`${path}/company/branches/work-status/completed-work/questionaire-checklist/remark`}
          >
            <Remark />
          </Route>
          <Route
            exact
            path={`${path}/company/branches/work-status/current-work/questionaire-checklist`}
          >
            <CompanyCuWorkQuesCheck />
          </Route>
          <Route
            exact
            path={`${path}/company/branches/work-status/current-work/questionaire-checklist/remark`}
          >
            <Remark />
          </Route>
          </Switch>
        </Container>
      </Container>
    </div>
  );
}

export default Auditor;
