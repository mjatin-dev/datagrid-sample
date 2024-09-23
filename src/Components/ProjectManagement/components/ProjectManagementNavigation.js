import { isShowProjectModule } from "app.config";
import React from "react";
import "./style.css";
export const ProjectManagmentPages = [
  ...(isShowProjectModule
    ? [
        {
          id: "project-management-project",
          value: "Project & Task",
          buttonName: "Project",
        },
      ]
    : []),
  {
    id: "project-management-task",
    value: "Task",
    buttonName: "Task",
  },
  // {
  //   id: "project-management-calender",
  //   value: "Calender",
  //   buttonName: "Calender",
  // },
];

export const ProjectTrashPages = [
  ...(isShowProjectModule
    ? [
        {
          id: "project-trash-project",
          value: "Projects",
          buttonName: "Projects",
        },
        {
          id: "project-trash-milestone",
          value: "Milestone",
          buttonName: "Milestone",
        },
        {
          id: "project-trash-task-list",
          value: "Task List",
          buttonName: "Task List",
        },
      ]
    : []),
  {
    id: "project-trash-tasks",
    value: "Tasks",
    buttonName: "Tasks",
  },
];

const ProjectManagementNavigation = ({
  containerClass,
  buttonClass,
  currentPageView,
  setCurrentPageView,
  pages,
}) => {
  return (
    <div
      className={`d-flex w-100 mt-3 align-items-start ${containerClass}`}
      style={{
        borderBottom: "2px solid #eee8fc",
      }}
    >
      {pages.map((page) => (
        <p
          key={page.id}
          className={`${buttonClass} mb-0 project-management__page-display mr-4 px-1 text-center ${
            currentPageView.buttonName === page.buttonName
              ? "project-management__text--active project-management__page-display--active"
              : ""
          }`}
          onClick={() => setCurrentPageView(page)}
        >
          {page.buttonName}
        </p>
      ))}
    </div>
  );
};

export default ProjectManagementNavigation;
