import React, { useState } from "react";
import SideBar from "../SideBar/SideBar";
import FormBuilder from "../../pages/FormBuilder";
import CheckList from "../../pages/FormBuilder/CheckList";
import AuditAssignment from "../../pages/AuditAssignment";
import AuditTemplates from "../../pages/AuditTemplates";
import AuditUsers from "../../pages/AuditUsers";
import Assignments from "../../pages/Assignments/";
import { useRouteMatch, Route, Switch, useLocation } from "react-router";
import Container from "../Containers";
import TaxAudit from "../../pages/AuditTemplates/TaxAudit";
import TaxAuditAssignment from "../../pages/Assignments/TaxAuditAssignment";
import WorkAuditUser from "../../pages/AuditUsers/WorkAuditUser";
import UserListing from "../../pages/AuditUsers/WorkAuditUser/Listing";
import Reassign from "../../pages/Auditor/User/WorkAuditUser/Reassign";
import AuditCompany from "../../pages/AuditCompany";
import CompanyBranches from "../../pages/AuditCompany/Branches";
import CompanyWorkStatus from "../../pages/AuditCompany/WorkStatus";
import CompanyCoWorkQuesCheck from "../../pages/AuditCompany/WorkStatus/CompletedWorkQuestionandCheckPoints";
import CompanyCuWorkQuesCheck from "../../pages/AuditCompany/WorkStatus/CurrentWorkQuestionandCheckPoints";
import AssignChecklistAndDetails from "../../pages/Assignments/AssignAssignment";
import Remark from "../Remarks";
const pathName = "/audit";
const whitelistPathnames = [
  `${pathName}`,
  `${pathName}/users`,
  `${pathName}/users/work-user`,
  `${pathName}/assignments`,
  `${pathName}/assignment`,
  `${pathName}/company`,
  `${pathName}/company/branches`,
  // `${pathName}/template`,
];
const Layout = () => {
  const { path } = useRouteMatch();
  const location = useLocation();

  return (
    <Container variant="main">
      <SideBar
        style={{
          ...(!whitelistPathnames?.includes(location.pathname) && {
            width: "0px",
            minWidth: "0px",
          }),
        }}
      />
      <Container variant="container">
        <Switch>
          <Route exact path={`${path}`}>
            <AuditTemplates />
          </Route>
          <Route exact path={`${path}/users`}>
            <AuditUsers />
          </Route>
          <Route exact path={`${path}/assignments`}>
            <Assignments />
          </Route>
          <Route exact path={`${path}/company`}>
            <AuditCompany />
          </Route>
          <Route exact path={`/${path}/questionaire`}>
            <FormBuilder />
          </Route>
          <Route path={`/${path}/checklist`}>
            <CheckList />
          </Route>
          <Route exact path={`${path}/assignments/audit-assignment`}>
            <AuditAssignment />
          </Route>
          <Route exact path={`${path}/create-template`}>
            <FormBuilder />
          </Route>
          <Route exact path={`${path}/template`}>
            <TaxAudit />
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
          <Route exact path={`${path}/users/work-user`}>
            <WorkAuditUser />
          </Route>

          <Route exact path={`${path}/users/work-user/current-work`}>
            <UserListing />
          </Route>
          <Route exact path={`${path}/users/work-user/current-work/remark`}>
            <Remark />
          </Route>
          <Route exact path={`${path}/users/work-user/complete-work`}>
            <UserListing />
          </Route>
          <Route exact path={`${path}/users/work-user/complete-work/remark`}>
            <Remark />
          </Route>
          <Route exact path={`${path}/users/work-user/reassign`}>
            <Reassign />
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
  );
};

export default Layout;
