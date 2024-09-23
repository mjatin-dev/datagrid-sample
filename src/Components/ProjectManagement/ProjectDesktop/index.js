import { Progress } from "antd";
import React, { useState } from "react";
import {
  MdAdd,
  MdExpandMore,
  MdMoreHoriz,
  MdRadioButtonChecked,
  MdHistory,
} from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import {
  DeleteIconButton,
  EditIconButton,
  SmallIconButton,
} from "../components/Buttons";
import projectDeleteIcon from "../../../assets/ERIcons/projectDeleteIcon.svg";
import "./style.css";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { useOuterClick } from "../../OnBoarding/SubModules/DashBoardCO/components/RightSideGrid/outerClick";
import { useDispatch, useSelector } from "react-redux";
import {
  restoreFromTrashRequest,
  setDeleteModalState,
  setMilestoneModalState,
  setProjectModalState,
  setTaskListModalState,
  setTaskModalState,
} from "../redux/actions";
import moment from "moment";
import { getTaskProgressByStatus } from "../components/utils";
import { useWindowDimensions } from "CommonModules/helpers/custom.hooks";
import useAccount from "SharedComponents/Hooks/Account.hook";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
const Project = ({ data }) => {
  const [expandMoreLevel, setExpandMoreLevel] = useState(0);
  const [milestoneExpandMoreIds, setMilestoneExpandMoreIds] = useState([]);
  const [isShowProjectContextMenu, setIsShowProjectContextMenu] =
    useState(false);
  const projectContextMenuRef = useOuterClick(() =>
    setIsShowProjectContextMenu(!isShowProjectContextMenu)
  );
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );
  const projectData = useSelector(
    (state) => state?.ProjectManagementReducer?.projectManagementData?.projects
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const usersList = useSelector(
    (state) => state?.ProjectManagementReducer?.usersList
  );
  const dispatch = useDispatch();

  const {
    project_id,
    project_name,
    project_owner,
    project_start_date,
    project_end_date,
    project_assign_users,
    project_overview,
    task_list_data,
    milestone_count,
    any_task_completed,
    task_count,
  } = data;
  const addMilestoneHandler = () =>
    dispatch(
      setMilestoneModalState({
        ...modalsStatus?.milestoneModal,
        isVisible: !modalsStatus?.milestoneModal?.isVisible,
        projectId: project_id,
        dateValidations: {
          start_date: project_start_date || "",
          end_date: project_end_date || "",
        },
      })
    );

  const project_duration = differenceInDays(
    project_start_date,
    project_end_date
  );
  const formatted_project_start_date = getProjectDateFormat(project_start_date);
  const formatted_project_end_date = getProjectDateFormat(project_end_date);
  const project_owner_name =
    project_owner && getUserName(usersList, project_owner);
  const { url } = useRouteMatch();

  const handleOpenProject = () => {
    if (
      task_count > 0 ||
      milestone_count > 0 ||
      (task_list_data && task_list_data?.length > 0)
    ) {
      setExpandMoreLevel(expandMoreLevel >= 1 ? 0 : 1);
      setMilestoneExpandMoreIds([]);
    }
  };

  const handleMilestoneExpandMoreClick = (id) => {
    if (id && milestoneExpandMoreIds.includes(id)) {
      setMilestoneExpandMoreIds(
        [...milestoneExpandMoreIds].filter((m_id) => m_id !== id)
      );
    } else if (id && !milestoneExpandMoreIds.includes(id)) {
      setMilestoneExpandMoreIds([...milestoneExpandMoreIds, id]);
    }
  };

  return (
    <>
      {/* Desktop Component */}
      <div
        key={project_id || new Date().getTime()}
        className="d-none d-md-block project-management__project-item my-md-2 position-relative"
      >
        {isShowProjectContextMenu && (
          <ProjectAndTaskContextMenu
            containerRef={projectContextMenuRef}
            isProjectContextMenu
            onAddMilestoneClick={addMilestoneHandler}
            onAddTaskListClick={() => {
              const _project = [...projectData].filter(
                (item) => item.project_id === project_id
              );
              const _project_milestones =
                _project &&
                _project.length > 0 &&
                _project[0].milestone_data?.map((milestone) => ({
                  value: {
                    milestone_id: milestone?.milestone_id,
                    project_id: milestone?.project,
                  },
                  label: milestone.milestone_title,
                }));
              dispatch(
                setTaskListModalState({
                  ...modalsStatus?.taskListModal,
                  isVisible: true,
                  editData: {
                    ...modalsStatus?.taskListModal?.editData,
                    project_id,
                  },
                  milestonesList: _project_milestones || [],
                })
              );
            }}
            onEditClick={() => {
              dispatch(
                setProjectModalState({
                  ...modalsStatus?.projectModal,
                  isVisible: true,
                  isEdit: true,
                  editData: {
                    project_id,
                    project_name,
                    start_date: project_start_date,
                    end_date: project_end_date,
                    project_overview,
                    assign_user: project_assign_users,
                  },
                  projectId: project_id,
                })
              );
            }}
            onDeleteClick={() => {
              dispatch(
                setDeleteModalState({
                  ...deactivateModalAndStatus,
                  modalName: "Project",
                  id: project_id,
                  isVisible: true,
                })
              );
            }}
            isDeleteDisabled={any_task_completed}
          />
        )}
        <div className="project-management__project-data-container d-flex align-items-center w-100 justify-content-between">
          <p
            className={`project-data-container__project-name project-data-container__item ${
              task_count > 0 ||
              milestone_count > 0 ||
              (task_list_data && task_list_data?.length > 0)
                ? "cursor-pointer"
                : ""
            }`}
            title={project_name}
            onClick={handleOpenProject}
          >
            {project_name || "Management"}
          </p>
          {/* <p className="project-data-container__item">1</p> */}
          <p
            className={`project-data-container__item wide ${
              task_count > 0 ||
              milestone_count > 0 ||
              (task_list_data && task_list_data?.length > 0)
                ? "cursor-pointer"
                : ""
            } truncate`}
            title={
              project_owner &&
              project_owner_name &&
              `${project_owner_name} - ${project_owner}`
            }
            onClick={handleOpenProject}
          >
            {project_owner_name}
          </p>
          <p
            className={`project-data-container__item ${
              task_count > 0 ||
              milestone_count > 0 ||
              (task_list_data && task_list_data?.length > 0)
                ? "cursor-pointer"
                : ""
            }`}
            onClick={handleOpenProject}
          >
            {data?.task_count || 0}
          </p>
          <p
            className={`project-data-container__item ${
              task_count > 0 ||
              milestone_count > 0 ||
              (task_list_data && task_list_data?.length > 0)
                ? "cursor-pointer"
                : ""
            }`}
            onClick={handleOpenProject}
          >
            {data?.milestone_count || 0}
          </p>
          <p
            className={`project-data-container__item wide-2 ${
              task_count > 0 ||
              milestone_count > 0 ||
              (task_list_data && task_list_data?.length > 0)
                ? "cursor-pointer"
                : ""
            }`}
            onClick={handleOpenProject}
          >
            {project_duration}
          </p>
          <p
            className={`project-data-container__item wide ${
              task_count > 0 ||
              milestone_count > 0 ||
              (task_list_data && task_list_data?.length > 0)
                ? "cursor-pointer"
                : ""
            }`}
            onClick={handleOpenProject}
          >
            {formatted_project_start_date}
          </p>
          <p
            className={`project-data-container__item wide ${
              task_count > 0 ||
              milestone_count > 0 ||
              (task_list_data && task_list_data?.length > 0)
                ? "cursor-pointer"
                : ""
            }`}
            onClick={handleOpenProject}
          >
            {formatted_project_end_date}
          </p>
          <p
            onClick={handleOpenProject}
            className={`project-data-container__item ${
              task_count > 0 ||
              milestone_count > 0 ||
              (task_list_data && task_list_data?.length > 0)
                ? "cursor-pointer"
                : ""
            }`}
            title={project_assign_users?.join(", ")}
          >
            {getUsers(usersList, project_assign_users) || "-"}
          </p>
          <div className="project-data-container__buttons d-flex justify-content-end align-items-center">
            <div className="flex-grow-1 py-3" onClick={handleOpenProject}></div>
            <SmallIconButton
              type="outlined"
              className="mr-3"
              onClick={() => {
                setIsShowProjectContextMenu(!isShowProjectContextMenu);
              }}
            >
              <MdMoreHoriz />
            </SmallIconButton>
            <SmallIconButton
              onClick={handleOpenProject}
              className={
                data &&
                data?.milestone_count <= 0 &&
                (!task_list_data || task_list_data?.length <= 0) &&
                "project-management__button--disabled"
              }
            >
              <MdExpandMore
                className={`icon ${
                  expandMoreLevel >= 1 && "icon__rotate--180"
                }`}
              />
            </SmallIconButton>
          </div>
        </div>
        {expandMoreLevel >= 1 && (
          <div className="py-2 pl-2 background--grey">
            {data &&
              data?.milestone_data &&
              data?.milestone_data?.length > 0 &&
              data?.milestone_data?.map((milestone) => {
                const {
                  milestone_end_date,
                  milestone_id,
                  milestone_owner,
                  milestone_start_date,
                  milestone_title,
                  milestone_assign_users,
                } = milestone;
                const formatted_milestone_start_date =
                  getProjectDateFormat(milestone_start_date);
                const formatted_milestone_end_date =
                  getProjectDateFormat(milestone_end_date);
                const milestone_owner_name =
                  getUserName(usersList, milestone_owner) || "-";
                return (
                  <div
                    id={milestone_id}
                    className="project-management__project-item mb-md-2"
                  >
                    <div className="project-management__project-data-container project-data-container__1 d-flex align-items-center justify-content-between">
                      <p
                        className={`project-data-container__item project-data-container__project-name text-black ${
                          !(
                            milestone?.task_list_data?.length <= 0 ||
                            !milestone?.task_list_data
                          )
                            ? "cursor-pointer"
                            : ""
                        }`}
                        title={milestone_title}
                        onClick={() => {
                          if (
                            !(
                              milestone?.task_list_data?.length <= 0 ||
                              !milestone?.task_list_data
                            )
                          ) {
                            handleMilestoneExpandMoreClick(milestone_id);
                          }
                        }}
                      >
                        {milestone_title}
                      </p>
                      <p
                        className={`project-data-container__item wide ${
                          !(
                            milestone?.task_list_data?.length <= 0 ||
                            !milestone?.task_list_data
                          )
                            ? "cursor-pointer"
                            : ""
                        }`}
                        title={milestone_owner}
                        onClick={() => {
                          if (
                            !(
                              milestone?.task_list_data?.length <= 0 ||
                              !milestone?.task_list_data
                            )
                          ) {
                            handleMilestoneExpandMoreClick(milestone_id);
                          }
                        }}
                      >
                        {milestone_owner_name}
                      </p>
                      <p
                        className={`project-data-container__item ${
                          !(
                            milestone?.task_list_data?.length <= 0 ||
                            !milestone?.task_list_data
                          )
                            ? "cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            !(
                              milestone?.task_list_data?.length <= 0 ||
                              !milestone?.task_list_data
                            )
                          ) {
                            handleMilestoneExpandMoreClick(milestone_id);
                          }
                        }}
                      >
                        -
                      </p>
                      <p
                        className={`project-data-container__item ${
                          !(
                            milestone?.task_list_data?.length <= 0 ||
                            !milestone?.task_list_data
                          )
                            ? "cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            !(
                              milestone?.task_list_data?.length <= 0 ||
                              !milestone?.task_list_data
                            )
                          ) {
                            handleMilestoneExpandMoreClick(milestone_id);
                          }
                        }}
                      >
                        -
                      </p>
                      <p
                        className={`project-data-container__item wide-2 ${
                          !(
                            milestone?.task_list_data?.length <= 0 ||
                            !milestone?.task_list_data
                          )
                            ? "cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            !(
                              milestone?.task_list_data?.length <= 0 ||
                              !milestone?.task_list_data
                            )
                          ) {
                            handleMilestoneExpandMoreClick(milestone_id);
                          }
                        }}
                      >
                        {differenceInDays(
                          milestone_start_date,
                          milestone_end_date
                        )}
                      </p>
                      <p
                        className={`project-data-container__item wide cursor-text ${
                          !(
                            milestone?.task_list_data?.length <= 0 ||
                            !milestone?.task_list_data
                          )
                            ? "cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            !(
                              milestone?.task_list_data?.length <= 0 ||
                              !milestone?.task_list_data
                            )
                          ) {
                            handleMilestoneExpandMoreClick(milestone_id);
                          }
                        }}
                      >
                        {formatted_milestone_start_date}
                      </p>
                      <p
                        className={`project-data-container__item wide ${
                          !(
                            milestone?.task_list_data?.length <= 0 ||
                            !milestone?.task_list_data
                          )
                            ? "cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            !(
                              milestone?.task_list_data?.length <= 0 ||
                              !milestone?.task_list_data
                            )
                          ) {
                            handleMilestoneExpandMoreClick(milestone_id);
                          }
                        }}
                      >
                        {formatted_milestone_end_date}
                      </p>
                      <p
                        className={`project-data-container__item ${
                          !(
                            milestone?.task_list_data?.length <= 0 ||
                            !milestone?.task_list_data
                          )
                            ? "cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            !(
                              milestone?.task_list_data?.length <= 0 ||
                              !milestone?.task_list_data
                            )
                          ) {
                            handleMilestoneExpandMoreClick(milestone_id);
                          }
                        }}
                        title={milestone_assign_users?.join(", ")}
                      >
                        {(milestone_assign_users &&
                          milestone_assign_users?.length > 0 &&
                          getUsers(usersList, milestone_assign_users)) ||
                          "-"}
                      </p>
                      <div className="project-data-container__buttons d-flex align-items-center justify-content-end">
                        <div
                          className="flex-grow-1 py-3"
                          onClick={() => {
                            if (
                              !(
                                milestone?.task_list_data?.length <= 0 ||
                                !milestone?.task_list_data
                              )
                            ) {
                              handleMilestoneExpandMoreClick(milestone_id);
                            }
                          }}
                        ></div>
                        <EditIconButton
                          className="mr-2"
                          onClickHandler={() => {
                            dispatch(
                              setMilestoneModalState({
                                ...modalsStatus?.milestoneModal,
                                isVisible: true,
                                isEdit: true,
                                editData: {
                                  milestone_id,
                                  project: project_id,
                                  title: milestone_title,
                                  start_date: milestone_start_date,
                                  end_date: milestone_end_date,
                                  assign_user: milestone_assign_users,
                                },
                                dateValidations: {
                                  start_date: project_start_date,
                                  end_date: project_end_date,
                                },
                              })
                            );
                          }}
                        />
                        <DeleteIconButton
                          className="mr-2"
                          onClickHandler={() =>
                            dispatch(
                              setDeleteModalState({
                                ...deactivateModalAndStatus,
                                modalName: "Milestone",
                                id: milestone_id,
                                isVisible: true,
                              })
                            )
                          }
                        />
                        <SmallIconButton
                          type="primary"
                          title="Add Task List"
                          className="mr-2"
                          onClick={() => {
                            const _project = [...projectData].filter(
                              (item) => item.project_id === project_id
                            );
                            const _project_milestones =
                              _project &&
                              _project.length > 0 &&
                              _project[0].milestone_data?.map((milestone) => ({
                                value: {
                                  milestone_id: milestone?.milestone_id,
                                  project_id: milestone?.project,
                                },
                                label: milestone.milestone_title,
                              }));
                            dispatch(
                              setTaskListModalState({
                                ...modalsStatus?.taskListModal,
                                isVisible: true,
                                editData: {
                                  ...modalsStatus?.taskListModal?.editData,
                                  project_id,
                                  milestone_id,
                                },
                                milestonesList: _project_milestones || [],
                              })
                            );
                          }}
                        >
                          <MdAdd />
                        </SmallIconButton>
                        <SmallIconButton
                          onClick={() =>
                            handleMilestoneExpandMoreClick(milestone_id)
                          }
                          className={
                            milestone &&
                            (milestone?.task_list_data?.length <= 0 ||
                              !milestone?.task_list_data) &&
                            "project-management__button--disabled"
                          }
                        >
                          <MdExpandMore
                            className={`icon ${
                              milestoneExpandMoreIds.includes(milestone_id) &&
                              "icon__rotate--180"
                            }`}
                          />
                        </SmallIconButton>
                      </div>
                    </div>
                    {milestoneExpandMoreIds.includes(milestone_id) && (
                      <div className="py-2 pl-2 background--white">
                        {milestone?.task_list_data &&
                          milestone?.task_list_data?.length > 0 &&
                          milestone?.task_list_data?.map((tasklist) => {
                            return <DesktopTaskListComponent data={tasklist} />;
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            {expandMoreLevel >= 1 &&
              task_list_data &&
              task_list_data.length > 0 && (
                <div className="py-2 pl-2 background--white">
                  {task_list_data &&
                    task_list_data?.length > 0 &&
                    task_list_data?.map((tasklist) => {
                      return <DesktopTaskListComponent data={tasklist} />;
                    })}
                </div>
              )}
          </div>
        )}
      </div>
      {/* Mobile Component */}
      <div className="d-flex d-md-none project-management__project-container-mobile mb-3 p-2 py-3">
        <div className="w-100">
          {/* Title */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <p className="project-container-mobile__data-title flex-grow-1 mb-0">
              {project_name}
            </p>
          </div>
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="project-container-mobile__data">
              {/* Data */}
              <div className="d-grid project-container-mobile__data-container">
                <div className="project-container-mobile__data-item">
                  <p className="project-data-container__item project-container-mobile__data-item-title">
                    Owner
                  </p>
                  <p className="project-data-container__item">
                    {project_owner_name}
                  </p>
                </div>
                {data?.task_data && data?.task_data?.length > 0 && (
                  <Link
                    to={{
                      pathname: `${url}/project-tasks`,
                      state: {
                        task_list_title: null,
                        task_list_id: null,
                        task_data: data?.task_data || [],
                        project_id,
                        milestone_id: null,
                      },
                    }}
                  >
                    <div className="project-container-mobile__data-item">
                      <p className="project-data-container__item project-container-mobile__data-item-title">
                        Task
                      </p>
                      <p className="project-data-container__item">2/2</p>
                    </div>
                  </Link>
                )}
                <Link
                  to={{ pathname: `${url}/project-milestone`, state: data }}
                >
                  <div className="project-container-mobile__data-item">
                    <p className="project-data-container__item project-container-mobile__data-item-title">
                      Milestone
                    </p>
                    <p className="project-data-container__item">
                      0/{data?.milestone_data?.length || 0}
                    </p>
                  </div>
                </Link>
                {task_list_data && task_list_data.length > 0 && (
                  <Link
                    to={{
                      pathname: `${url}/project-tasklist`,
                      state: {
                        project_id,
                        project_name,
                        task_list_data,
                      },
                    }}
                  >
                    <div className="project-container-mobile__data-item">
                      <p className="project-data-container__item project-container-mobile__data-item-title">
                        Tasklist
                      </p>
                      <p className="project-data-container__item">
                        0/{task_list_data?.length || 0}
                      </p>
                    </div>
                  </Link>
                )}
                <div className="project-container-mobile__data-item">
                  <p className="project-data-container__item project-container-mobile__data-item-title">
                    Duration
                  </p>
                  <p className="project-data-container__item">
                    {project_duration}
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="project-container-mobile__progress px-3">
              <Progress
                trailColor="tranparent"
                type="circle"
                percent={66}
                width={70}
                strokeColor="#7A73FF"
                strokeWidth={11}
              />
            </div> */}
          </div>
          {/* Bottom Data */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            {/* Start Date and End Date */}
            <p className="project-data-container__item flex-grow-2 text-left">
              <IoCalendarOutline />
              &nbsp;
              {formatted_project_start_date +
                " To " +
                formatted_project_end_date}
            </p>
            <EditIconButton
              className="mx-2"
              onClickHandler={() => {
                dispatch(
                  setProjectModalState({
                    ...modalsStatus?.projectModal,
                    isVisible: true,
                    isEdit: true,
                    editData: {
                      project_id,
                      project_name,
                      start_date: project_start_date,
                      end_date: project_end_date,
                      project_overview,
                      assign_user: project_assign_users,
                    },
                    projectId: project_id,
                  })
                );
              }}
            />
            <DeleteIconButton
              className={`${
                any_task_completed && "project-management__button--disabled"
              }`}
              onClickHandler={() => {
                dispatch(
                  setDeleteModalState({
                    ...deactivateModalAndStatus,
                    modalName: "Project",
                    id: project_id,
                    isVisible: true,
                  })
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const DesktopTask = ({ data }) => {
  const userEmail = useSelector((state) => state?.auth?.loginInfo?.email);
  const taskData = data || {};
  const dispatch = useDispatch();
  const userDetail = useAccount();
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const usersList = useSelector(
    (state) => state?.ProjectManagementReducer?.usersList
  );
  const task_owner = getUserName(usersList, taskData?.task_owner) || "-";
  const task_duration =
    differenceInDays(taskData?.task_start_date, taskData?.task_end_date) || "-";
  const task_start_date = getProjectDateFormat(taskData?.task_start_date);
  const task_end_date = getProjectDateFormat(taskData?.task_end_date);
  const task_assign_to = getUserName(usersList, taskData?.assign_to) || "-";
  return (
    <div className="project-data-container__3 d-none d-md-flex align-items-center justify-content-between">
      <p className="project-data-container__project-name project-data-container__item">
        {taskData?.task_subject}
      </p>
      {/* <p className="project-data-container__item">10%</p> */}
      <p
        className="project-data-container__item wide truncate"
        title={taskData?.task_owner}
      >
        {taskData?.task_owner_name || task_owner}
      </p>
      <p className="project-data-container__item wide-flex-2">
        {taskData?.task_frequency || "-"}
      </p>
      <p className="project-data-container__item wide-2">{task_duration}</p>
      <p className="project-data-container__item wide">{task_start_date}</p>
      <p className="project-data-container__item wide">{task_end_date}</p>
      <p className="project-data-container__item" title={taskData?.assign_to}>
        {trimString(task_assign_to)}
      </p>
      <div className="project-data-container__buttons d-flex justify-content-end align-items-center">
        <EditIconButton
          className={`mr-2 p-1 ${
            taskData?.task_owner !== userEmail ||
            taskData?.task_status === "Approved"
              ? "project-management__button--disabled"
              : ""
          }`}
          onClickHandler={() => {
            dispatch(
              setTaskModalState({
                ...modalsStatus?.taskModal,
                isVisible: true,
                isEdit: true,
                editData: {
                  ...modalsStatus?.taskModal?.editData,
                  task_id: taskData?.task_id || null,
                  milestone_id: taskData?.task_project_milestone || null,
                  project_id: taskData?.task_project || null,
                  subject: taskData?.task_subject || null,
                  task_list_id: taskData?.task_project_task_list || null,
                  start_date: taskData?.task_start_date || null,
                  end_date: taskData?.task_end_date || null,
                  frequency: {
                    value: taskData?.task_frequency
                      ? taskData?.task_frequency
                      : "",
                    label: taskData?.task_frequency
                      ? taskData?.task_frequency
                      : "",
                  },
                  frequency_end_date: taskData?.frequency_end_date || null,
                  assign_to: taskData?.assign_to || null,
                  approver: taskData?.approver || null,
                  cc: taskData?.cc || null,
                  description: taskData?.task_description || "",
                  comments: taskData?.task_comments || "",
                  repeat_on_day: taskData?.task_repeat_on_day || "",
                  repeat_on_holiday: taskData?.repeat_on_holiday || "",
                  weekly_repeat_day: taskData?.task_weekly_repeat_day || "",
                  end_time: taskData?.end_time || null,
                  file_details: taskData?.file_details || [],
                  notify_on: taskData?.notify_on || [],
                  internal_deadline_date:
                    taskData?.internal_deadline_date || null,
                  internal_deadline_day:
                    taskData?.internal_deadline_day || null,
                  // impact: taskData?.impact
                  //   ? [
                  //       {
                  //         added_by: userDetail.email,
                  //         added_by_name: userDetail?.UserName,
                  //         edited: false,
                  //         reference: taskData?.impact,
                  //         task_id: "",
                  //         task_reference_id: "",
                  //       },
                  //     ]
                  //   : [],
                  impact: taskData?.impact || "",
                  impactFileDetails: taskData?.impactFileDetails || [],
                  circulars: taskData?.circulars || [],
                  riskRating: {
                    value: taskData?.riskRating ? taskData?.riskRating : "",
                    label: taskData?.riskRating ? taskData?.riskRating : "",
                  },
                  repeat_on_every: taskData?.repeat_on_every,
                },
              })
            );
          }}
        />
        {/* <SmallIconButton
          type={taskData?.task_status === "Approved" ? "primary" : "grey"}
          className="p-2 mr-2"
          title={taskData?.task_status}
        >
          {taskData?.task_status === "Not Assigned" && !taskData?.assign_to && (
            <IoCheckmarkCircleOutline className="icon__small" />
          )}
          {(taskData?.task_status === "Assigned" ||
            taskData?.task_status === "Approval Pending") &&
            taskData?.assign_to && <MdCheckCircle className="icon__small" />}
          {taskData?.task_status === "Approved" && taskData?.assign_to && (
            <FaUserCheck className="icon__small" />
          )}
        </SmallIconButton> */}
        {/* <SmallIconButton
          title="Deactivate Task"
          type="grey"
          className={`p-2 ${
            (taskData?.task_status === "Approved" ||
              taskData?.task_owner !== userEmail) &&
            "project-management__button--disabled"
          }`}
          onClick={() =>
            dispatch(
              setDeleteModalState({
                ...deactivateModalAndStatus,
                modalName: "Task",
                id: taskData?.task_id,
                isVisible: true,
                recurring_task: "all_events",
              })
            )
          }
        >
          <MdRadioButtonChecked className="icon__small" />
        </SmallIconButton> */}
      </div>
    </div>
  );
};
const DesktopTaskListComponent = ({ data }) => {
  const taskListData = data || {};
  const [isShowTaskListContextMenu, setIsShowTaskListContextMenu] =
    useState(false);
  const taskListContextMenuRef = useOuterClick(() =>
    setIsShowTaskListContextMenu(!isShowTaskListContextMenu)
  );
  const [isExpandMore, setIsExpandMore] = useState(false);
  const projectData = useSelector(
    (state) => state?.ProjectManagementReducer?.projectManagementData?.projects
  );
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const dispatch = useDispatch();
  const dateValidations = getDateValidationsFromProject(
    taskListData?.project,
    taskListData?.project_milestone,
    projectData
  );
  return (
    <div
      key={taskListData?.task_list_id}
      className="position-relative project-management__project-item project-management__project-item-2 mb-md-2"
    >
      {isShowTaskListContextMenu && (
        <ProjectAndTaskContextMenu
          containerRef={taskListContextMenuRef}
          onEditClick={() => {
            const _project = [...projectData].filter(
              (item) => item.project_id === taskListData?.project
            );
            const _project_milestones =
              _project &&
              _project.length > 0 &&
              _project[0].milestone_data?.map((milestone) => ({
                value: {
                  milestone_id: milestone?.milestone_id,
                  project_id: milestone?.project,
                },
                label: milestone.milestone_title,
              }));
            dispatch(
              setTaskListModalState({
                ...modalsStatus?.taskListModal,
                isVisible: true,
                isEdit: true,
                milestonesList: _project_milestones || [],
                editData: {
                  ...modalsStatus?.taskListModal?.editData,
                  milestone_id: taskListData?.project_milestone,
                  project_id: taskListData?.project,
                  title: taskListData?.task_list_title,
                  task_list_id: taskListData?.task_list_id,
                },
              })
            );
          }}
          onAddClick={() => {
            dispatch(
              setTaskModalState({
                ...modalsStatus?.taskModal,
                isVisible: true,
                isEdit: false,
                editData: {
                  ...modalsStatus?.taskModal?.editData,
                  milestone_id: taskListData?.project_milestone || null,
                  project_id: taskListData?.project || null,
                  task_list_id: taskListData?.task_list_id || null,
                },
                dateValidations,
              })
            );
          }}
          onDeleteClick={() =>
            dispatch(
              setDeleteModalState({
                ...deactivateModalAndStatus,
                modalName: "TaskList",
                id: taskListData?.task_list_id,
                isVisible: true,
              })
            )
          }
        />
      )}
      <div className="project-data-container__2 d-flex align-items-center justify-content-between">
        <p
          onClick={() => {
            if (
              !(
                taskListData?.task_data?.length <= 0 || !taskListData?.task_data
              )
            ) {
              setIsExpandMore(!isExpandMore);
            }
          }}
          className={`project-data-container__project-name project-data-container__item ${
            !(taskListData?.task_data?.length <= 0 || !taskListData?.task_data)
              ? "cursor-pointer"
              : ""
          }`}
        >
          {taskListData?.task_list_title}
        </p>
        <div
          className="flex-grow-1 py-3"
          onClick={() => {
            if (
              !(
                taskListData?.task_data?.length <= 0 || !taskListData?.task_data
              )
            ) {
              setIsExpandMore(!isExpandMore);
            }
          }}
        ></div>
        <div className="project-data-container__buttons d-flex align-items-center justify-content-between">
          <SmallIconButton
            type="outlined"
            className="mr-3"
            onClick={() =>
              setIsShowTaskListContextMenu(!isShowTaskListContextMenu)
            }
          >
            <MdMoreHoriz />
          </SmallIconButton>
          <SmallIconButton
            onClick={() => setIsExpandMore(!isExpandMore)}
            className={
              taskListData &&
              (taskListData?.task_data?.length <= 0 ||
                !taskListData?.task_data) &&
              "project-management__button--disabled"
            }
          >
            <MdExpandMore
              className={`icon ${isExpandMore && "icon__rotate--180"}`}
            />
          </SmallIconButton>
        </div>
      </div>
      {isExpandMore && (
        <div className="py-2 px-2 background__item-3">
          {/* Last Component */}
          {taskListData &&
            taskListData?.task_data &&
            taskListData?.task_data?.length > 0 &&
            taskListData.task_data.map((task) => {
              return <DesktopTask data={task} />;
            })}
        </div>
      )}
    </div>
  );
};
export const ProjectMilestone = ({ data, projectName }) => {
  const { url } = useRouteMatch();
  const usersList = useSelector(
    (state) => state?.ProjectManagementReducer?.usersList
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );
  const dispatch = useDispatch();
  const task_list_data = data?.task_list_data || [];
  const milestone_owner = getUserName(usersList, data?.milestone_owner) || "-";
  const milestone_start_date = getProjectDateFormat(data?.milestone_start_date);
  const milestone_end_date = getProjectDateFormat(data?.milestone_end_date);
  const milestone_assign_users =
    getUsers(usersList, data?.milestone_assign_users) || "-";
  const milestone_duration =
    differenceInDays(data?.milestone_start_date, data?.milestone_end_date) ||
    "-";
  return (
    <div
      key={data?.milestone_id}
      className="d-flex d-md-none project-management__project-container-mobile mb-3 p-2 py-3"
    >
      <div className="w-100">
        {/* Title */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p className="project-container-mobile__data-title flex-grow-1 mb-0">
            {data?.milestone_title}
          </p>
          {/* <SmallIconButton type="grey" className="mx-2">
          <IoCheckmarkCircleOutline />
        </SmallIconButton>
        <SmallIconButton type="grey">
          <IoBanOutline />
        </SmallIconButton> */}
        </div>
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div className="project-container-mobile__data">
            {/* Data */}
            <div className="d-grid project-container-mobile__data-container mb-3">
              <div className="project-container-mobile__data-item">
                <p className="project-data-container__item project-container-mobile__data-item-title">
                  Owner
                </p>
                <p className="project-data-container__item">
                  {milestone_owner}
                </p>
              </div>
              <div className="project-container-mobile__data-item">
                <p className="project-data-container__item project-container-mobile__data-item-title">
                  Assign to
                </p>
                <p className="project-data-container__item">
                  {milestone_assign_users}
                </p>
              </div>
              {task_list_data && task_list_data.length > 0 && (
                <Link
                  to={{
                    pathname: `${url}/project-tasklist`,
                    state: {
                      project_id: data?.project,
                      project_name: projectName,
                      task_list_data,
                      milestone_id: data?.milestone_id,
                      milestone_title: data?.milestone_title,
                    },
                  }}
                >
                  <div className="project-container-mobile__data-item">
                    <p className="project-data-container__item project-container-mobile__data-item-title">
                      Tasklist
                    </p>
                    <p className="project-data-container__item">
                      0/{(task_list_data && task_list_data.length) || 0}
                    </p>
                  </div>
                </Link>
              )}
            </div>
            <div className="d-flex mb-3 trash-task">
              <p className="project-data-container__item project-container-mobile__data-item-title mr-4 mb-0">
                Duration
              </p>
              <p className="project-data-container__item mb-0">
                {milestone_duration}
              </p>
            </div>
          </div>
          {/* Progress Bar */}
          {/* <div className="project-container-mobile__progress px-3">
            <Progress
              trailColor="tranparent"
              type="circle"
              percent={66}
              width={70}
              strokeColor="#7A73FF"
              strokeWidth={11}
            />
          </div> */}
        </div>
        {/* Bottom Data */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          {/* Start Date and End Date */}
          <p className="project-data-container__item flex-grow-1 text-left">
            <IoCalendarOutline />
            &nbsp;
            {milestone_start_date + " To " + milestone_end_date}
          </p>
          <EditIconButton
            className="mx-2"
            onClickHandler={() => {
              dispatch(
                setMilestoneModalState({
                  ...modalsStatus?.milestoneModal,
                  isVisible: true,
                  isEdit: true,
                  editData: {
                    milestone_id: data?.milestone_id,
                    project: data?.project,
                    title: data?.milestone_title,
                    start_date: data?.milestone_start_date,
                    end_date: data?.milestone_end_date,
                    assign_user: data?.milestone_assign_users,
                  },
                })
              );
            }}
          />
          <DeleteIconButton
            onClickHandler={() =>
              dispatch(
                setDeleteModalState({
                  ...deactivateModalAndStatus,
                  modalName: "Milestone",
                  id: data?.milestone_id,
                  isVisible: true,
                })
              )
            }
          />
          {/* Edit and Delete Button */}
        </div>
      </div>
    </div>
  );
};

export const ProjectSubTask = ({ data }) => {
  const userEmail = useSelector((state) => state?.auth?.loginInfo?.email);

  const usersList = useSelector(
    (state) => state?.ProjectManagementReducer?.usersList
  );
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const dispatch = useDispatch();
  const task_assign_to = getUserName(usersList, data?.assign_to) || "-";
  const task_duration =
    differenceInDays(data?.task_start_date, data?.task_end_date) || "-";
  const task_start_date = getProjectDateFormat(data?.task_start_date);
  const task_end_date = getProjectDateFormat(data?.task_end_date);
  const task_owner = getUserName(usersList, data?.task_owner);
  const task_progress = getTaskProgressByStatus(data?.task_status);
  return (
    <div
      key={data?.task_id}
      className="d-flex d-md-none project-management__project-container-mobile mb-3 p-2 py-3"
    >
      <div className="w-100">
        {/* Title */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p className="project-container-mobile__data-title flex-grow-1 mb-0">
            {data?.task_subject}
          </p>
          {/* <SmallIconButton type="grey" className="mx-2">
            <IoCheckmarkCircleOutline />
          </SmallIconButton> */}
          {/* <SmallIconButton
            type={data?.task_status === "Approved" ? "primary" : "grey"}
            className={`mx-2 ${data?.task_status === "Approved" && "p-1"}`}
            title={data?.task_status}
          >
            {data?.task_status === "Not Assigned" && !data?.assign_to && (
              <IoCheckmarkCircleOutline />
            )}
            {(data?.task_status === "Assigned" ||
              data?.task_status === "Approval Pending") &&
              data?.assign_to && <MdCheckCircle />}
            {data?.task_status === "Approved" && data?.assign_to && (
              <FaUserCheck className="icon__small" />
            )}
          </SmallIconButton> */}
          <SmallIconButton
            className={`${
              (data?.task_status === "Approved" ||
                data?.task_owner !== userEmail) &&
              "project-management__button--disabled"
            }`}
            type="grey"
            onClick={() =>
              dispatch(
                setDeleteModalState({
                  ...deactivateModalAndStatus,
                  modalName: "Task",
                  id: data?.task_id,
                  isVisible: true,
                })
              )
            }
          >
            <MdRadioButtonChecked />
          </SmallIconButton>
        </div>
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div className="project-container-mobile__data">
            {/* Data */}
            <div className="d-grid project-container-mobile__data-container mb-3">
              <div className="project-container-mobile__data-item">
                <p className="project-data-container__item project-container-mobile__data-item-title">
                  Owner
                </p>
                <p className="project-data-container__item">{task_owner}</p>
              </div>
              <div className="project-container-mobile__data-item">
                <p className="project-data-container__item project-container-mobile__data-item-title">
                  Assign to
                </p>
                <p className="project-data-container__item">{task_assign_to}</p>
              </div>
            </div>
            {/* Data (Row) */}
            <div className="d-flex mb-3">
              <p className="project-data-container__item project-container-mobile__data-item-title project-container-mobile__sub-task-text mr-4 mb-0">
                Duration
              </p>
              <p className="project-data-container__item project-container-mobile__sub-task-text mb-0">
                : {task_duration}
              </p>
            </div>
            <div className="d-flex mb-3">
              <p className="project-data-container__item project-container-mobile__sub-task-text project-container-mobile__data-item-title mr-4 mb-0">
                Schedule Date
              </p>
              <p className="project-container-mobile__sub-task-text project-data-container__item mb-0">
                : {task_start_date}
              </p>
            </div>
            <div className="d-flex mb-3">
              <p className="project-container-mobile__sub-task-text project-data-container__item project-container-mobile__data-item-title mr-4 mb-0">
                Actual End Date
              </p>
              <p className="project-container-mobile__sub-task-text project-data-container__item mb-0">
                : {task_end_date}
              </p>
            </div>
          </div>
          <div className="project-container-mobile__progress px-3">
            {/* Progress Bar */}
            <Progress
              trailColor="tranparent"
              type="circle"
              percent={task_progress}
              width={70}
              strokeColor="#7A73FF"
              strokeWidth={11}
            />
          </div>
        </div>
        {/* Bottom Data */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          {/* Start Date and End Date */}
          <p className="project-data-container__item flex-grow-1 text-left">
            <IoCalendarOutline />
            &nbsp;{task_start_date + " To " + task_end_date}
          </p>
          {/* Message and Edit Button */}
          {/* <SmallIconButton type="grey" className="mx-2 icon__small p-1">
            <RiMessage2Fill />
          </SmallIconButton> */}
          <EditIconButton
            onClickHandler={() => {
              dispatch(
                setTaskModalState({
                  ...modalsStatus?.taskModal,
                  isVisible: true,
                  isEdit: true,
                  editData: {
                    ...(modalsStatus?.taskModal?.editData || null),
                    task_id: data?.task_id || null,
                    milestone_id: data?.task_project_milestone || null,
                    project_id: data?.task_project || null,
                    subject: data?.task_subject || null,
                    task_list_id: data?.task_project_task_list || null,
                    start_date: data?.task_start_date || null,
                    end_date: data?.task_end_date || null,
                    frequency: data?.task_frequency || "None",
                    assign_to: data?.assign_to || null,
                    description: data?.task_description || "",
                    comments: data?.task_comments || "",
                    repeat_on_day: data?.task_repeat_on_day || "",
                    weekly_repeat_day: data?.task_weekly_repeat_day || "",
                    end_time: data?.end_time || null,
                    file_details: data?.file_details || [],
                    riskRating: data?.riskRating ? data?.riskRating : "",
                    repeat_on_every: data?.repeat_on_every,
                  },
                })
              );
            }}
            className={
              data?.task_owner !== userEmail
                ? "project-management__button--disabled"
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
};

export const ProjectHeader = ({
  isTasksHeader,
  isMilestonesHeader,
  isTaskListHeader,
  isTrashTasksHeader = false,
}) => {
  return (
    <div className="d-none d-md-flex mt-md-3 mb-md-2 project-management__project-header project-management__project-data-container align-items-center justify-content-between">
      <p className="project-data-container__project-name project-data-container__item">
        {isTasksHeader
          ? "Task"
          : isMilestonesHeader
          ? "Milestone"
          : isTaskListHeader
          ? "Task List"
          : "Project"}
        &nbsp;Name
      </p>
      {!isTaskListHeader && (
        <p className="project-data-container__item wide">Owner</p>
      )}
      {/* {width > 1439 ? (
        <p className=""></p>
      ) : width > 1024 ? (
        <p className="project-data-container__item"></p>
      ) : width < 1025 ? (
        <p className="project-data-container__item wide"></p>
      ) : null} */}

      {!isTasksHeader && !isMilestonesHeader && !isTaskListHeader && (
        <>
          <p className="project-data-container__item">Task</p>
          <p className="project-data-container__item">Milestone</p>
        </>
      )}

      {isTasksHeader && (
        <p className="project-data-container__item wide-flex-2">Frequency</p>
      )}
      {!isTaskListHeader && (
        <>
          {" "}
          <p className="project-data-container__item wide-2">
            {isTrashTasksHeader ? "Deactivation Date" : "Duration"}
          </p>
          <p className="project-data-container__item wide">Start Date</p>
          <p className="project-data-container__item wide">Due Date</p>
          <p className="project-data-container__item">Assign</p>
        </>
      )}
      <div className="project-data-container__buttons"></div>
    </div>
  );
};

export const ProjectTaskList = ({ data }) => {
  const { url } = useRouteMatch();
  const [isShowTaskListContextMenu, setIsShowTaskListContextMenu] =
    useState(false);
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );
  const dispatch = useDispatch();
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const taskListContextMenuRef = useOuterClick(() =>
    setIsShowTaskListContextMenu(!isShowTaskListContextMenu)
  );
  const projectData = useSelector(
    (state) => state?.ProjectManagementReducer?.projectManagementData?.projects
  );
  return (
    <div className="position-relative project-data-container__2 d-flex align-items-center justify-content-between mb-3">
      {isShowTaskListContextMenu && (
        <ProjectAndTaskContextMenu
          containerRef={taskListContextMenuRef}
          isMobileTaskListContextMenu
          onDeleteClick={() =>
            dispatch(
              setDeleteModalState({
                ...deactivateModalAndStatus,
                modalName: "TaskList",
                id: data?.task_list_id,
                isVisible: true,
              })
            )
          }
          onEditClick={() => {
            const _project = [...projectData].filter(
              (item) => item.project_id === data?.project
            );
            const _project_milestones =
              _project &&
              _project.length > 0 &&
              _project[0].milestone_data?.map((milestone) => ({
                value: {
                  milestone_id: milestone?.milestone_id,
                  project_id: milestone?.project,
                },
                label: milestone?.milestone_title,
              }));
            dispatch(
              setTaskListModalState({
                ...modalsStatus?.taskListModal,
                isVisible: true,
                isEdit: true,
                milestonesList: _project_milestones || [],
                editData: {
                  ...modalsStatus?.taskListModal?.editData,
                  milestone_id: data?.project_milestone,
                  project_id: data?.project,
                  title: data?.task_list_title,
                  task_list_id: data?.task_list_id,
                },
              })
            );
          }}
        />
      )}
      <Link
        to={{
          pathname: `${url}/tasklist-tasks`,
          state: {
            task_list_title: data?.task_list_title,
            task_list_id: data?.task_list_id,
            task_data: data?.task_data,
            project_id: data?.project,
            milestone_id: data?.project_milestone,
          },
        }}
      >
        <p className="project-data-container__project-name project-data-container__item flex-grow-1">
          {data?.task_list_title}
        </p>
      </Link>
      <div className="project-data-container__buttons d-flex align-items-center justify-content-between">
        <SmallIconButton
          type="outlined"
          onClick={() =>
            setIsShowTaskListContextMenu(!isShowTaskListContextMenu)
          }
        >
          <MdMoreHoriz />
        </SmallIconButton>
      </div>
    </div>
  );
};

export const ProjectAndTaskContextMenu = ({
  containerRef,
  onEditClick,
  onDeleteClick,
  onAddClick,
  isProjectContextMenu,
  onAddMilestoneClick,
  onAddTaskListClick,
  isMobileTaskListContextMenu,
  isDeleteDisabled,
}) => {
  return (
    <div className="project-three-dot-popup" ref={containerRef}>
      <div className="d-flex align-items-center justify-content-between">
        <EditIconButton className="mr-2" onClickHandler={onEditClick} />
        <DeleteIconButton
          className={`mr-2 ${
            isDeleteDisabled && "project-management__button--disabled"
          }`}
          onClickHandler={onDeleteClick}
        />
        {(!isProjectContextMenu || !isMobileTaskListContextMenu) &&
          onAddClick && (
            <SmallIconButton
              title="Add Task"
              type="primary"
              onClick={onAddClick}
            >
              <MdAdd />
            </SmallIconButton>
          )}
        {isProjectContextMenu && onAddMilestoneClick && onAddTaskListClick && (
          <>
            <SmallIconButton
              title="Add Milestone"
              type="primary"
              onClick={onAddMilestoneClick}
              className="mr-2 d-flex align-items-center justify-content-center project-context-menu__plus-button"
            >
              M<MdAdd />
            </SmallIconButton>
            <SmallIconButton
              title="Add Task List"
              type="primary"
              onClick={onAddTaskListClick}
              className="d-flex align-items-center justify-content-center project-context-menu__plus-button"
            >
              T<MdAdd />
            </SmallIconButton>
          </>
        )}
      </div>
      <div className="d-flex align-items-center justify-content-center w-100">
        <button className="mt-3 project-management__button project-management__button--outlined">
          Set as template
        </button>
      </div>
    </div>
  );
};

export const TrashProject = ({ data }) => {
  // const { url } = useRouteMatch();
  const usersList = useSelector(
    (state) => state?.ProjectManagementReducer?.usersList
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const project_assign_users =
    (data?.project_assign_users &&
      getUsers(usersList, data?.project_assign_users)) ||
    "-";
  const dispatch = useDispatch();
  const project_start_date = getProjectDateFormat(data?.project_start_date);
  const project_end_date = getProjectDateFormat(data?.project_end_date);
  const project_duration =
    differenceInDays(data?.project_start_date, data?.project_end_date) || "-";
  const project_owner =
    (data?.project_owner && getUserName(usersList, data?.project_owner)) || "-";
  return (
    <>
      <div
        key={data?.project_id}
        className="project-management__trash-project-data-container d-none d-md-flex align-items-center w-100 justify-content-between"
      >
        <p className="project-data-container__project-name project-data-container__item">
          {data?.project_name || "Management"}
        </p>
        {/* <p className="project-data-container__item">1</p> */}
        <p
          className="project-data-container__item wide"
          title={data?.project_owner}
        >
          {project_owner}
        </p>
        <p className="project-data-container__item">
          {data?.task_count || "-"}
        </p>
        <p className="project-data-container__item">
          {data?.milestone_count || "-"}
        </p>
        <p className="project-data-container__item wide-2">
          {project_duration}
        </p>
        <p className="project-data-container__item wide">
          {project_start_date}
        </p>
        <p className="project-data-container__item wide">{project_end_date}</p>
        <p
          className="project-data-container__item"
          title={data?.project_assign_users?.join(", ")}
        >
          {project_assign_users}
        </p>
        <div className="project-data-container__buttons d-flex justify-content-end align-items-center">
          <SmallIconButton
            title="Restore Project"
            type="primary"
            className="mr-3"
            onClick={() =>
              dispatch(
                restoreFromTrashRequest({
                  project_id: data?.project_id,
                  type: "project",
                })
              )
            }
          >
            <MdHistory />
          </SmallIconButton>
          <DeleteIconButton
            onClickHandler={() => {
              dispatch(
                setDeleteModalState({
                  ...deactivateModalAndStatus,
                  modalName: "Project",
                  id: data?.project_id,
                  isVisible: true,
                })
              );
            }}
          />
        </div>
      </div>
      {/* Mobile Component */}
      <div className="d-flex d-md-none project-management__project-container-mobile mb-3 p-2 py-3">
        <div className="w-100">
          {/* Title */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <p className="project-container-mobile__data-title flex-grow-1 mb-0">
              Management Design
            </p>
          </div>
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="project-container-mobile__data">
              {/* Data */}
              <div className="d-grid project-container-mobile__data-container">
                <div className="project-container-mobile__data-item">
                  <p className="project-data-container__item project-container-mobile__data-item-title">
                    Owner
                  </p>
                  <p className="project-data-container__item">
                    {project_owner}
                  </p>
                </div>
                <div className="project-container-mobile__data-item">
                  <p className="project-data-container__item project-container-mobile__data-item-title">
                    Duration
                  </p>
                  <p className="project-data-container__item">
                    {project_duration}
                  </p>
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            {/* <div className="project-container-mobile__progress px-3">
              <Progress
                trailColor="tranparent"
                type="circle"
                percent={66}
                width={70}
                strokeColor="#7A73FF"
                strokeWidth={11}
              />
            </div> */}
          </div>
          {/* Bottom Data */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            {/* Start Date and End Date */}
            <p className="project-data-container__item flex-grow-1 text-left">
              <IoCalendarOutline />
              &nbsp;
              {project_start_date + " To " + project_end_date}
            </p>
            <SmallIconButton
              title="Restore Project"
              type="primary"
              className="mr-3"
              onClick={() =>
                dispatch(
                  restoreFromTrashRequest({
                    project_id: data?.project_id,
                    type: "project",
                  })
                )
              }
            >
              <MdHistory />
            </SmallIconButton>
            <DeleteIconButton
              onClickHandler={() => {
                dispatch(
                  setDeleteModalState({
                    ...deactivateModalAndStatus,
                    modalName: "Project",
                    id: data?.project_id,
                    isVisible: true,
                  })
                );
              }}
            />
            {/* Edit and Delete Button */}
          </div>
        </div>
      </div>
    </>
  );
};

export const TrashMilestone = ({ data }) => {
  const usersList = useSelector(
    (state) => state?.ProjectManagementReducer?.usersList
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const dispatch = useDispatch();
  const milestone_owner = getUserName(usersList, data?.milestone_owner) || "-";
  const milestone_duration =
    differenceInDays(data?.milestone_start_date, data?.milestone_end_date) ||
    "-";
  const milestone_assign_users =
    (data?.milestone_assign_users &&
      getUsers(usersList, data?.milestone_assign_users)) ||
    "-";
  const milestone_start_date = getProjectDateFormat(data?.milestone_start_date);
  const milestone_end_date = getProjectDateFormat(data?.milestone_end_date);
  return (
    <>
      <div
        key={data?.milestone_id}
        className="d-none d-md-block project-management__project-item mb-md-2"
      >
        <div className="project-management__trash-project-data-container d-flex align-items-center justify-content-between">
          <p
            className="project-data-container__item project-data-container__project-name text-black"
            title={data?.milestone_title}
          >
            {data?.milestone_title}
          </p>
          {/* <p className="project-data-container__item">40%</p> */}
          <p
            className="project-data-container__item wide"
            title={data?.milestone_owner}
          >
            {milestone_owner}
          </p>
          {/* <p className="project-data-container__item">-</p> */}
          {/* <p className="project-data-container__item wide-flex-2"></p> */}
          <p className="project-data-container__item wide-2">
            {milestone_duration}
          </p>
          <p className="project-data-container__item wide">
            {milestone_start_date}
          </p>
          <p className="project-data-container__item wide">
            {milestone_end_date}
          </p>
          <p
            className="project-data-container__item"
            title={data?.milestone_assign_users?.join(", ")}
          >
            {milestone_assign_users}
          </p>
          <div className="project-data-container__buttons d-flex align-items-center justify-content-end">
            <SmallIconButton
              title="Restore Milestone"
              type="primary"
              className="mr-3"
              onClick={() =>
                dispatch(
                  restoreFromTrashRequest({
                    milestone_id: data?.milestone_id,
                    type: "milestone",
                  })
                )
              }
            >
              <MdHistory />
            </SmallIconButton>
            <DeleteIconButton
              onClickHandler={() =>
                dispatch(
                  setDeleteModalState({
                    ...deactivateModalAndStatus,
                    modalName: "Milestone",
                    id: data?.milestone_id,
                    isVisible: true,
                  })
                )
              }
            />
          </div>
        </div>
      </div>
      {/* Mobile Component */}
      <div className="d-flex d-md-none project-management__project-container-mobile mb-3 p-2 py-3">
        <div className="w-100">
          {/* Title */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <p
              className="project-container-mobile__data-title flex-grow-1 mb-0"
              title={data?.milestone_title}
            >
              {data?.milestone_title}
            </p>
          </div>
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="project-container-mobile__data">
              {/* Data */}
              <div className="d-grid project-container-mobile__data-container mb-3">
                <div className="project-container-mobile__data-item">
                  <p className="project-data-container__item project-container-mobile__data-item-title">
                    Owner
                  </p>
                  <p className="project-data-container__item">
                    {milestone_owner}
                  </p>
                </div>
                <div className="project-container-mobile__data-item">
                  <p className="project-data-container__item project-container-mobile__data-item-title">
                    Assign to
                  </p>
                  <p
                    className="project-data-container__item"
                    title={data?.milestone_assign_users?.join(", ")}
                  >
                    {milestone_assign_users}
                  </p>
                </div>
              </div>
              {/* <div className="d-flex mb-3">
                <p className="project-data-container__item project-container-mobile__data-item-title mr-4 mb-0">
                  Owner
                </p>
                <p className="project-data-container__item mb-0">
                  {data?.milestone_owner}
                </p>
              </div> */}
            </div>
            {/* Progress Bar */}
            {/* <div className="project-container-mobile__progress px-3">
              <Progress
                trailColor="tranparent"
                type="circle"
                percent={66}
                width={70}
                strokeColor="#7A73FF"
                strokeWidth={11}
              />
            </div> */}
          </div>
          {/* Bottom Data */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            {/* Start Date and End Date */}
            <p className="project-data-container__item flex-grow-1 text-left">
              <IoCalendarOutline />
              &nbsp;
              {data?.milestone_start_date &&
                data?.milestone_start_date &&
                milestone_start_date + " To " + milestone_end_date}
            </p>
            <SmallIconButton
              type="primary"
              className="mr-3"
              onClick={() =>
                dispatch(
                  restoreFromTrashRequest({
                    milestone_id: data?.milestone_id,
                    type: "milestone",
                  })
                )
              }
            >
              <MdHistory />
            </SmallIconButton>
            <DeleteIconButton
              onClickHandler={() => {
                dispatch(
                  setDeleteModalState({
                    ...deactivateModalAndStatus,
                    modalName: "Milestone",
                    id: data?.milestone_id,
                    isVisible: true,
                  })
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const TrashTask = ({ data }) => {
  const usersList = useSelector(
    (state) => state?.ProjectManagementReducer?.usersList
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const dispatch = useDispatch();
  const task_owner = getUserName(usersList, data?.task_owner) || "-";
  const assign_to = getUserName(usersList, data?.assign_to) || "-";
  // const task_duration =
  //   differenceInDays(data?.task_start_date, data?.task_end_date) || "-";
  const deactivation_date = data?.deactivation_date
    ? getProjectDateFormat(data?.deactivation_date)
    : "-";
  return (
    <>
      <div className="project-data-container__3 d-none d-md-flex align-items-center justify-content-between">
        <p className="project-data-container__project-name project-data-container__item">
          {data?.task_subject}
        </p>
        {/* <p className="project-data-container__item">10%</p> */}
        <p className="project-data-container__item wide">{task_owner}</p>
        <p className="project-data-container__item wide-flex-2">
          {data?.task_frequency || "-"}
        </p>
        <p className="project-data-container__item wide-2">
          {deactivation_date}
        </p>
        <p className="project-data-container__item wide">
          {getProjectDateFormat(data?.task_start_date)}
        </p>
        <p className="project-data-container__item wide">
          {getProjectDateFormat(data?.task_end_date)}
        </p>
        <p className="project-data-container__item" title={data?.assign_to}>
          {assign_to}
        </p>
        <div className="project-data-container__buttons d-flex justify-content-end align-items-center">
          {/* <SmallIconButton type="grey" className="p-2 mr-2">
            <MdTextsms className="icon__small" />
          </SmallIconButton>
          <SmallIconButton type="grey" className="p-2 mr-2">
            <MdCheckCircle className="icon__small" />
          </SmallIconButton> */}
          <SmallIconButton
            type="primary"
            className="mr-2 p-2"
            title="Restore Task"
            onClick={() => {
              dispatch(
                restoreFromTrashRequest({
                  task_id: data?.task_id,
                  type: "task",
                })
              );
            }}
          >
            <MdHistory className="icon__small" />
          </SmallIconButton>
          <SmallIconButton
            type="danger"
            className="p-2"
            title="Delete Task"
            onClick={() => {
              dispatch(
                setDeleteModalState({
                  ...deactivateModalAndStatus,
                  modalName: "Task",
                  id: data?.task_id,
                  isVisible: true,
                })
              );
            }}
          >
            <img
              src={projectDeleteIcon}
              alt="edit-icon"
              width="20px"
              height="20px"
              style={{ padding: "2px" }}
            />
          </SmallIconButton>
        </div>
      </div>
      {/* Mobile Component */}
      <div className="d-flex d-md-none project-management__project-container-mobile mb-3 p-2 py-3">
        <div className="w-100">
          {/* Title */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <p
              className="project-container-mobile__data-title flex-grow-1 mb-0"
              title={data?.task_subject}
            >
              {data?.task_subject}
            </p>
          </div>
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="project-container-mobile__data">
              {/* Data */}
              <div className="d-grid project-container-mobile__data-container mb-3">
                <div className="project-container-mobile__data-item">
                  <p className="project-data-container__item project-container-mobile__data-item-title">
                    Owner
                  </p>
                  <p className="project-data-container__item">{task_owner}</p>
                </div>
                <div className="project-container-mobile__data-item">
                  <p className="project-data-container__item project-container-mobile__data-item-title">
                    Assign to
                  </p>
                  <p className="project-data-container__item">{assign_to}</p>
                </div>
              </div>
              <div className="d-flex mb-3 trash-task">
                <p className="text-left project-data-container__item project-container-mobile__data-item-title mr-4 mb-0">
                  Deactivation Date
                </p>
                <p className="text-left project-data-container__item mb-0">
                  {deactivation_date}
                </p>
              </div>
              <div className="d-flex mb-3 trash-task">
                <p className="text-left project-data-container__item project-container-mobile__data-item-title mr-4 mb-0">
                  Schedule Date
                </p>
                <p className="text-left project-data-container__item mb-0">
                  {getProjectDateFormat(data?.schedule_date)}
                </p>
              </div>
              <div className="d-flex mb-3 trash-task">
                <p className="text-left project-data-container__item project-container-mobile__data-item-title mr-4 mb-0">
                  Actual End Date
                </p>
                <p className="text-left project-data-container__item mb-0">
                  {getProjectDateFormat(data?.task_end_date)}
                </p>
              </div>
            </div>
            <div className="project-container-mobile__progress px-3">
              {/* Progress Bar */}
              <Progress
                trailColor="tranparent"
                type="circle"
                percent={getTaskProgressByStatus(data?.task_status)}
                width={70}
                strokeColor="#7A73FF"
                strokeWidth={11}
              />
            </div>
          </div>
          {/* Bottom Data */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            {/* Start Date and End Date */}
            <p className="project-data-container__item flex-grow-1 text-left">
              <IoCalendarOutline />
              &nbsp;
              {data?.task_start_date &&
                data?.task_start_date &&
                getProjectDateFormat(data?.task_start_date) +
                  " To " +
                  getProjectDateFormat(data?.task_end_date)}
            </p>
            <SmallIconButton
              title="Restore Task"
              type="primary"
              className="mr-3"
              onClick={() =>
                dispatch(
                  restoreFromTrashRequest({
                    task_id: data?.task_id,
                    type: "task",
                  })
                )
              }
            >
              <MdHistory />
            </SmallIconButton>
            <DeleteIconButton
              onClickHandler={() => {
                dispatch(
                  setDeleteModalState({
                    ...deactivateModalAndStatus,
                    modalName: "Task",
                    id: data?.task_id,
                    isVisible: true,
                  })
                );
              }}
            />
            {/* Edit and Delete Button */}
          </div>
        </div>
      </div>
    </>
  );
};

export const TrashTaskList = ({ data }) => {
  const usersList = useSelector(
    (state) => state?.ProjectManagementReducer?.usersList
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const dispatch = useDispatch();
  const task_owner = getUserName(usersList, data?.task_owner) || "-";
  const assign_to = getUserName(usersList, data?.assign_to) || "-";
  const task_duration =
    differenceInDays(data?.task_start_date, data?.task_end_date) || "-";
  return (
    <>
      <div className="project-data-container__3 d-none d-md-flex align-items-center justify-content-between">
        <p className="project-data-container__item-list">
          {data?.task_list_title || "-"}
        </p>

        <div className="project-data-container__buttons d-flex justify-content-end align-items-center">
          <SmallIconButton
            type="primary"
            className="mr-2 p-2"
            title="Restore Task"
            onClick={() => {
              dispatch(
                restoreFromTrashRequest({
                  task_list_id: data?.task_list_id,
                  type: "tasklist",
                })
              );
            }}
          >
            <MdHistory className="icon__small" />
          </SmallIconButton>
          <SmallIconButton
            type="danger"
            className="p-2"
            title="Delete Task"
            onClick={() => {
              dispatch(
                setDeleteModalState({
                  ...deactivateModalAndStatus,
                  modalName: "tasklist",
                  id: data?.task_list_id,
                  isVisible: true,
                })
              );
            }}
          >
            <img
              src={projectDeleteIcon}
              alt="edit-icon"
              width="20px"
              height="20px"
              style={{ padding: "2px" }}
            />
          </SmallIconButton>
        </div>
      </div>
      {/* Mobile Component */}
      <div className="d-flex d-md-none project-management__project-container-mobile mb-3 p-2 py-3">
        <div className="w-100">
          {/* Title */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <p
              className="project-container-mobile__data-title flex-grow-1 mb-0"
              title={data?.task_subject}
            >
              {data?.task_subject}
            </p>
          </div>
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="project-container-mobile__data">
              {/* Data */}
              <div className="d-grid project-container-mobile__data-container mb-3">
                <div className="project-container-mobile__data-item">
                  <p className="project-data-container__item project-container-mobile__data-item-title">
                    Owner
                  </p>
                  <p className="project-data-container__item">{task_owner}</p>
                </div>
                <div className="project-container-mobile__data-item">
                  <p className="project-data-container__item project-container-mobile__data-item-title">
                    Assign to
                  </p>
                  <p className="project-data-container__item">{assign_to}</p>
                </div>
              </div>
              <div className="d-flex mb-3 trash-task">
                <p className="text-left project-data-container__item project-container-mobile__data-item-title mr-4 mb-0">
                  Duration
                </p>
                <p className="text-left project-data-container__item mb-0">
                  {task_duration}
                </p>
              </div>
              <div className="d-flex mb-3 trash-task">
                <p className="text-left project-data-container__item project-container-mobile__data-item-title mr-4 mb-0">
                  Schedule Date
                </p>
                <p className="text-left project-data-container__item mb-0">
                  {getProjectDateFormat(data?.schedule_date)}
                </p>
              </div>
              <div className="d-flex mb-3 trash-task">
                <p className="text-left project-data-container__item project-container-mobile__data-item-title mr-4 mb-0">
                  Actual End Date
                </p>
                <p className="text-left project-data-container__item mb-0">
                  {getProjectDateFormat(data?.task_end_date)}
                </p>
              </div>
            </div>
            <div className="project-container-mobile__progress px-3">
              {/* Progress Bar */}
              <Progress
                trailColor="tranparent"
                type="circle"
                percent={getTaskProgressByStatus(data?.task_status)}
                width={70}
                strokeColor="#7A73FF"
                strokeWidth={11}
              />
            </div>
          </div>
          {/* Bottom Data */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            {/* Start Date and End Date */}
            <p className="project-data-container__item flex-grow-1 text-left">
              <IoCalendarOutline />
              &nbsp;
              {data?.task_start_date &&
                data?.task_start_date &&
                getProjectDateFormat(data?.task_start_date) +
                  " To " +
                  getProjectDateFormat(data?.task_end_date)}
            </p>
            <SmallIconButton
              title="Restore Task"
              type="primary"
              className="mr-3"
              onClick={() =>
                dispatch(
                  restoreFromTrashRequest({
                    task_id: data?.task_id,
                    type: "task",
                  })
                )
              }
            >
              <MdHistory />
            </SmallIconButton>
            <DeleteIconButton
              onClickHandler={() => {
                dispatch(
                  setDeleteModalState({
                    ...deactivateModalAndStatus,
                    modalName: "Task",
                    id: data?.task_id,
                    isVisible: true,
                  })
                );
              }}
            />
            {/* Edit and Delete Button */}
          </div>
        </div>
      </div>
    </>
  );
};

const getUserName = (userList, email) => {
  if (userList && userList?.length > 0) {
    const user = [...userList].filter((element) => element.value === email)[0];
    const user_name = trimString(email);
    return (
      (user && Object.keys(user)?.length > 0 && trimString(user?.label)) ||
      user_name
    );
  }
  return email;
};
const getUsers = (usersList, assign_users, n = 8) => {
  const userName =
    (assign_users &&
      assign_users?.length > 0 &&
      getUserName(usersList, assign_users[0])) ||
    "";
  return (
    trimString(userName, n) +
    (assign_users?.length > 1 ? " +" + (assign_users?.length - 1) : "")
  );
};
const trimString = (str, n = 8) => {
  return (str && str?.length > n && str?.substring(0, n) + "...") || str;
};
const differenceInDays = (start_date, end_date) => {
  const difference =
    (start_date &&
      end_date &&
      moment(end_date)?.diff(moment(start_date), "days") + 1) ||
    0;
  return difference + (difference > 1 ? " days" : " day");
};
const getProjectDateFormat = (date, format = "D MMM YYYY") => {
  return (date && moment(date).format(format)) || "-";
};

export const getDateValidationsFromProject = (
  projectId,
  milestoneId,
  projects
) => {
  if (projectId && projects && projects?.length > 0) {
    const project = projects?.find((item) => item?.project_id === projectId);
    if (project && milestoneId && project.milestone_count > 0) {
      const milestone = [...(project?.milestone_data || [])].find(
        (item) => item.milestone_id === milestoneId
      );
      if (milestone && Object.keys(milestone).length > 0) {
        return {
          start_date: milestone?.milestone_start_date,
          end_date: milestone?.milestone_end_date,
        };
      }
    }
    if (project && !milestoneId) {
      return {
        start_date: project?.project_start_date,
        end_date: project?.project_end_date,
      };
    }
  }
  return {};
};
export default Project;
