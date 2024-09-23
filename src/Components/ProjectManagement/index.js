import React from "react";
import "./style.css";
import MobileLeftSideBar from "../../CommonModules/sharedComponents/MobileLeftSideBar";
import { useRouteMatch } from "react-router";
import { Switch, Route } from "react-router-dom";
import ProjectAndTask from "./Project&Task";
import Milestone from "./Milestone";
import TaskList from "./TaskList";
import Tasks from "./Tasks";
import Auth from "../Authectication/components/Auth";
import Container from "SharedComponents/Containers";
const ProjectManagement = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Auth />
      <Container variant="main">
        <Container variant="container">
          <Container variant="content" isShowAddTaskButton className="p-0">
            <MobileLeftSideBar />
            <Switch>
              <Route exact path={path}>
                <ProjectAndTask />
              </Route>
              <Route exact path={`${path}/project-milestone`}>
                <Milestone />
              </Route>
              <Route exact path={`${path}/project-tasklist`}>
                <TaskList />
              </Route>
              <Route exact path={`${path}/project-milestone/project-tasklist`}>
                <TaskList />
              </Route>
              <Route exact path={`${path}/project-tasklist/tasklist-tasks`}>
                <Tasks />
              </Route>
              <Route
                exact
                path={`${path}/project-milestone/project-tasklist/tasklist-tasks`}
              >
                <Tasks />
              </Route>
            </Switch>
          </Container>
        </Container>
      </Container>
      {/* <div className="project-management p-0 p-md-4">
        <div className="project-management__container">
        </div>
      </div> */}
    </>
  );
};

export default ProjectManagement;
