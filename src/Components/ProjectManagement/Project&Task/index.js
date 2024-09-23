import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ProjectManagementHeader,
  ProjectManagementMain,
  ProjectManagementMainContainer,
} from "../components";
import dashboardHeaderStyles from "../../../SharedComponents/Dashboard/styles.module.scss";
import ProjectManagementNavigation, {
  ProjectManagmentPages,
} from "../components/ProjectManagementNavigation";
import { ProjectHeader } from "../ProjectDesktop";
import ProjectManagamentCalender from "./Calender";
import Projects from "./Projects";
import Tasks from "./Tasks";
import DateFilters from "./Calender/components/DateFilters";
import constant from "../../../CommonModules/sharedComponents/constants/constant";
import DateButtons from "./Calender/components/DateButtons";
import { MdAdd, MdBlock, MdClose, MdSearch } from "react-icons/md";
import {
  getProjectDataRequest,
  setProjectModalState,
  setTaskModalState,
  clearTaskListModalState,
  clearMilestoneModalState,
  clearDeleteModalSatate,
  deactivateRequest,
} from "../redux/actions";
import AddEditMilestone from "../components/PopPupModules/AddEditMilestone";
import AddEditTaskList from "../components/PopPupModules/AddEditTaskList";
import DeactivateAndDeleteModal from "../components/Modals/DeactivateAndDeleteModal";
import projectDeleteIcon from "../../../assets/ERIcons/projectDeleteIcon.svg";
import BackDrop from "../../../CommonModules/sharedComponents/Loader/BackDrop";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
import { isShowProjectModule } from "app.config";
import { IconButton } from "@mui/material";

const ProjectAndTask = () => {
  const dispatch = useDispatch();
  const calenderRef = useRef();
  const [currentPageView, setCurrentPageView] = useState(
    ProjectManagmentPages[0]
  );
  const [calenderFunctions, setCalenderFunctions] = useState({});
  const [dayDate, setDayDate] = useState(new Date());
  const [monthDate, setMonthDate] = useState(new Date());
  const [weekStartDate, setWeekStartDate] = useState(new Date());
  const [activeDays, setActiveDays] = useState(constant.month);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );
  const ProjectLoader = useSelector(
    (state) => state?.ProjectManagementReducer?.ProjectLoader
  );
  const TaskLoader = useSelector(
    (state) => state?.ProjectManagementReducer?.TaskLoader
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );
  const isDeactivateRequestInProgress = useSelector(
    (state) =>
      state?.ProjectManagementReducer?.deactivateRequestStatus?.isLoading
  );
  const addProjectHandler = (flag) =>
    dispatch(
      setProjectModalState({
        ...modalsStatus?.projectModal,
        isVisible: flag,
      })
    );
  const addTaskHandler = (flag) =>
    dispatch(
      setTaskModalState({
        ...modalsStatus?.taskModal,
        isVisible: flag,
      })
    );
  const closeMilestoneModal = () => {
    dispatch(clearMilestoneModalState());
  };
  const closeTaskListModal = () => {
    dispatch(clearTaskListModalState());
  };
  useEffect(() => {
    if (calenderRef.current) {
      setCalenderFunctions(calenderRef.current);
    }
  }, [currentPageView, calenderRef, dayDate, weekStartDate, monthDate]);
  useEffect(() => {
    if (currentPageView.buttonName === "Project") {
      dispatch(getProjectDataRequest());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageView]);
  return (
    <>
      <BackDrop isLoading={isDeactivateRequestInProgress} />
      <BackDrop isLoading={ProjectLoader} />
      <BackDrop isLoading={TaskLoader} />
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
            deactivateRequest({
              ...deactivateModalAndStatus,
            })
          );
          dispatch(clearDeleteModalSatate());
        }}
      />
      {/* <AddProject
        show={modalsStatus?.projectModal?.isVisible}
        onClose={() => dispatch(clearProjectModalState())}
        isEdit={modalsStatus?.projectModal?.isEdit}
        editData={modalsStatus?.projectModal?.editData}
      /> */}
      {/* <NewTaskModel
        showTask={modalsStatus?.taskModal?.isVisible}
        onClose={() => dispatch(clearTaskModalState())}
        isEdit={modalsStatus?.taskModal?.isEdit}
        editData={modalsStatus?.taskModal?.editData}
      /> */}
      <AddEditMilestone
        visible={modalsStatus?.milestoneModal?.isVisible}
        onClose={closeMilestoneModal}
        isEdit={modalsStatus?.milestoneModal?.isEdit}
        editData={modalsStatus?.milestoneModal?.editData}
      />
      <AddEditTaskList
        visible={modalsStatus?.taskListModal?.isVisible}
        onClose={closeTaskListModal}
        isEdit={modalsStatus?.taskListModal?.isEdit}
        editData={modalsStatus?.taskListModal?.editData}
      />
      <ProjectManagementHeader isNoBorder>
        <div
          className="w-100 d-flex align-items-center justify-content-between"
          style={{ height: "48px" }}
        >
          <p className="project-management__header-title mb-0 cursor-pointer">
            {isShowProjectModule
              ? "Project & Task"
              : currentPageView.buttonName}
          </p>
          {/* {calenderFunctions && Object.keys(calenderFunctions).length > 0 && (
          
          )} */}

          {currentPageView.id !== "project-management-calender" && (
            <div className="d-flex align-items-center ">
              <div
                className={`${
                  showSearch ? dashboardHeaderStyles.searchInputContainer : ""
                } mr-3 d-none d-md-flex`}
              >
                {!showSearch && (
                  <IconButton
                    disableTouchRipple={false}
                    onClick={() => setShowSearch(true)}
                  >
                    <MdSearch className={dashboardHeaderStyles.searchIcon} />
                  </IconButton>
                )}
                {showSearch && (
                  <>
                    <input
                      placeholder={`Search for ${
                        currentPageView.id === "project-management-project"
                          ? "project"
                          : "tasks, assigned to and task owner"
                      }`}
                      className={dashboardHeaderStyles.searchInput}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />

                    <MdSearch className={dashboardHeaderStyles.searchIcon} />
                    <IconButton
                      disableTouchRipple={false}
                      className={dashboardHeaderStyles.closeSearchIcon}
                      onClick={() => {
                        setSearchQuery("");
                        setShowSearch(false);
                      }}
                    >
                      <MdClose />
                    </IconButton>
                  </>
                )}
              </div>
              <div className="d-flex align-items-center">
                {isShowProjectModule && (
                  <button
                    title="Add New Project"
                    onClick={() => addProjectHandler(true)}
                    className="mr-2 project-management__button project-management__button--primary"
                    style={{
                      minWidth: "12px",
                    }}
                  >
                    P <MdAdd />
                  </button>
                )}
                <button
                  title="Add Task"
                  onClick={() => addTaskHandler(true)}
                  style={{
                    minWidth: "12px",
                  }}
                  className="project-management__button project-management__button--primary mr-3"
                >
                  T <MdAdd />
                </button>
              </div>
            </div>
          )}
          {currentPageView.id === "project-management-calender" &&
            calenderFunctions &&
            Object.keys(calenderFunctions).length > 0 && (
              <>
                <div className="justify-content-start flex-grow-1 px-4 d-none d-md-flex">
                  <DateButtons
                    setDays={calenderFunctions?.setDays}
                    activeDays={activeDays}
                    monthDate={monthDate}
                    weekStartDate={weekStartDate}
                    addDaysInDate={calenderFunctions?.addDaysInDate}
                    dayDate={dayDate}
                  />
                </div>
                <DateFilters
                  filters={[constant.day, constant.week, constant.month]}
                  currentFilter={activeDays}
                  setDateFilter={setActiveDays}
                  containerClass="d-none d-md-flex"
                />
              </>
            )}
        </div>
        <div
          className={`${dashboardHeaderStyles.searchInputContainer} mr-3 d-flex d-md-none mt-3`}
        >
          {showSearch && (
            <input
              // placeholder="Search for project, tasks, assigned to, assigned by and task owner"
              className={dashboardHeaderStyles.searchInput}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
          <MdSearch
            className={dashboardHeaderStyles.searchIcon}
            onClick={() => setShowSearch(true)}
          />
          {showSearch && (
            <MdClose
              className={dashboardHeaderStyles.closeSearchIcon}
              onClick={() => setShowSearch(false)}
            />
          )}
        </div>
        {isShowProjectModule && (
          <ProjectManagementNavigation
            currentPageView={currentPageView}
            setCurrentPageView={setCurrentPageView}
            pages={ProjectManagmentPages}
          />
        )}
      </ProjectManagementHeader>
      <ProjectManagementMainContainer className="mt-4">
        {/* Components over the main  */}
        {(currentPageView.id === "project-management-project" ||
          currentPageView.id === "project-management-task") && (
          <ProjectHeader
            isTasksHeader={currentPageView.id === "project-management-task"}
          />
        )}
        {currentPageView.id === "project-management-calender" && (
          <DateFilters
            filters={[constant.day, constant.week, constant.month]}
            currentFilter={activeDays}
            setDateFilter={setActiveDays}
            containerClass="mb-3 d-md-none"
          />
        )}

        <ProjectManagementMain
          className={`${
            currentPageView.id === "project-management-calender" &&
            "project-management__main--calender"
          }`}
        >
          {/* Components of main */}
          {currentPageView.id === "project-management-project" && (
            <Projects searchQuery={debouncedSearchQuery} />
          )}
          {currentPageView.id === "project-management-task" && (
            <Tasks searchQuery={debouncedSearchQuery} />
          )}
          {currentPageView.id === "project-management-calender" && (
            <ProjectManagamentCalender
              ref={calenderRef}
              activeDays={activeDays}
              setActiveDays={setActiveDays}
              dayDate={dayDate}
              setDayDate={setDayDate}
              monthDate={monthDate}
              setMonthDate={setMonthDate}
              weekStartDate={weekStartDate}
              setWeekStartDate={setWeekStartDate}
            />
          )}
        </ProjectManagementMain>
      </ProjectManagementMainContainer>
    </>
  );
};

export default ProjectAndTask;
