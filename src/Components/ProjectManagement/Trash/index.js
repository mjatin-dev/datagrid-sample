import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackDrop from "../../../CommonModules/sharedComponents/Loader/BackDrop";
import MobileLeftSideBar from "../../../CommonModules/sharedComponents/MobileLeftSideBar";
import Auth from "../../Authectication/components/Auth";
import {
  ProjectManagementHeader,
  ProjectManagementMain,
  ProjectManagementMainContainer,
} from "../components";
import projectDeleteIcon from "../../../assets/ERIcons/projectDeleteIcon.svg";

import DeactivateAndDeleteModal from "../components/Modals/DeactivateAndDeleteModal";
import ProjectManagementNavigation, {
  ProjectTrashPages,
} from "../components/ProjectManagementNavigation";

import {
  ProjectHeader,
  TrashMilestone,
  TrashProject,
  TrashTask,
  TrashTaskList,
} from "../ProjectDesktop";
import {
  clearDeleteModalSatate,
  deleteFromTrashRequest,
  getTrashMilestoneRequest,
  getTrashProjectRequest,
  getTrashTaskListRequest,
  getTrashTasksRequest,
  getUsersListRequest,
} from "../redux/actions";
import "../style.css";
import "./style.css";
import { MdBlock } from "react-icons/md";

import NoResultFound from "CommonModules/sharedComponents/NoResultFound";
import Container from "SharedComponents/Containers";
import { isShowProjectModule } from "app.config";
const Trash = () => {
  const [currentPageView, setCurrentPageView] = useState(ProjectTrashPages[0]);
  const trashData = useSelector(
    (state) => state?.ProjectManagementReducer?.projectManagementTrash
  );
  const userEmail = useSelector((state) => state?.auth?.loginInfo?.email);

  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const dispatch = useDispatch();
  const isLoading = trashData?.isLoading;
  const isDeleteRequestInProgress = useSelector(
    (state) =>
      state?.ProjectManagementReducer?.deleteFromTrashRequestStatus?.isLoading
  );
  const isRestoreRequestInProgress = useSelector(
    (state) =>
      state?.ProjectManagementReducer?.restoreFromTrashRequestStatus?.isLoading
  );

  useEffect(() => {
    if (currentPageView.id === "project-trash-project") {
      dispatch(getTrashProjectRequest());
    } else if (currentPageView.id === "project-trash-milestone") {
      dispatch(getTrashMilestoneRequest());
    } else if (currentPageView.id === "project-trash-tasks") {
      dispatch(getTrashTasksRequest());
    } else if (currentPageView.id === "project-trash-task-list") {
      dispatch(getTrashTaskListRequest());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageView]);
  useEffect(() => {
    dispatch(getUsersListRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <BackDrop
        isLoading={
          isLoading || isDeleteRequestInProgress || isRestoreRequestInProgress
        }
      />
      <DeactivateAndDeleteModal
        visible={deactivateModalAndStatus?.isVisible}
        onClose={() => dispatch(clearDeleteModalSatate())}
        Text={`Are you sure ${
          deactivateModalAndStatus?.modalName !== "Task"
            ? "to delete this " + deactivateModalAndStatus?.modalName
            : "you want to De-activate this Task"
        }?`}
        iconSrc={
          deactivateModalAndStatus?.modalName !== "Task" && projectDeleteIcon
        }
        Icon={deactivateModalAndStatus?.modalName === "Task" && MdBlock}
        id={deactivateModalAndStatus?.id}
        onSubmit={() => {
          dispatch(
            deleteFromTrashRequest({
              ...(currentPageView.id === "project-trash-project" && {
                project_id: deactivateModalAndStatus?.id,
                type: "project",
              }),
              ...(currentPageView.id === "project-trash-milestone" && {
                milestone_id: deactivateModalAndStatus?.id,
                type: "milestone",
              }),
              ...(currentPageView.id === "project-trash-tasks" && {
                task_id: deactivateModalAndStatus?.id,
                type: "task",
              }),
              ...(currentPageView.id === "project-trash-task-list" && {
                task_list_id: deactivateModalAndStatus?.id,
                type: "tasklist",
              }),
            })
          );
          dispatch(clearDeleteModalSatate());
        }}
      />
      <Auth />
      <Container variant="main">
        <Container variant="container">
          <Container variant="content" className="p-0" isShowAddTaskButton>
            <MobileLeftSideBar />
            <ProjectManagementHeader>
              <div className="w-100 d-flex align-items-center justify-content-between">
                <p className="header-title mb-0">Trash</p>
              </div>
              {isShowProjectModule && (
                <ProjectManagementNavigation
                  currentPageView={currentPageView}
                  setCurrentPageView={setCurrentPageView}
                  pages={ProjectTrashPages}
                />
              )}
            </ProjectManagementHeader>
            <ProjectManagementMainContainer>
              <ProjectHeader
                isTasksHeader={currentPageView.id === "project-trash-tasks"}
                isTrashTasksHeader={
                  currentPageView.id === "project-trash-tasks"
                }
                isMilestonesHeader={
                  currentPageView.id === "project-trash-milestone"
                }
                isTaskListHeader={
                  currentPageView.id === "project-trash-task-list"
                }
              />
              <ProjectManagementMain>
                {currentPageView.id === "project-trash-project" && (
                  <>
                    {trashData?.trashProjects &&
                      trashData?.trashProjects.map((project) => {
                        return <TrashProject data={project} />;
                      })}
                    {trashData?.trashProjects &&
                      trashData?.trashProjects?.length === 0 && (
                        <p className="project-trash__not-found">
                          No Projects in Trash
                        </p>
                      )}
                  </>
                )}
                {currentPageView.id === "project-trash-milestone" && (
                  <>
                    {trashData?.trashMilestones &&
                      trashData?.trashMilestones.map((milestone) => {
                        return <TrashMilestone data={milestone} />;
                      })}
                    {trashData?.trashMilestones &&
                      trashData?.trashMilestones?.length === 0 && (
                        <p className="project-trash__not-found">
                          No Milestones in Trash
                        </p>
                      )}
                  </>
                )}
                {currentPageView.id === "project-trash-tasks" && (
                  <>
                    {trashData?.trashTasks &&
                      trashData?.trashTasks
                        ?.filter((task) => task.task_owner === userEmail)
                        .map((task) => {
                          return <TrashTask data={task} />;
                        })}
                    {trashData?.trashTasks &&
                      trashData?.trashTasks?.length === 0 && (
                        <NoResultFound text="No tasks in trash" />
                      )}
                  </>
                )}
                {currentPageView.id === "project-trash-task-list" && (
                  <>
                    {trashData?.trashTaskList &&
                      trashData?.trashTaskList.map((task) => {
                        return (
                          <TrashTaskList data={task} userEmail={userEmail} />
                        );
                      })}
                    {trashData?.trashTaskList &&
                      trashData?.trashTaskList?.length === 0 && (
                        <NoResultFound text="No task list in trash" />
                      )}
                  </>
                )}
              </ProjectManagementMain>
            </ProjectManagementMainContainer>
          </Container>
        </Container>
      </Container>
    </>
  );
};

export default Trash;
