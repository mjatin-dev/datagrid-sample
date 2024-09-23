/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import Container from "../Containers";
import styles from "./styles.module.scss";
import TaskAccordion from "./TaskAccordion";
import Dots from "../../CommonModules/sharedComponents/Loader/Dots";
import View from "../../Components/CalenderView/View";
import { dashboardTabs, dashboardViews } from "../Constants";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDashboardSearch,
  setCurrentActiveTab,
  setCurrentDashboardTab,
} from "./redux/actions";
import TaskDetail from "./TaskDetail";
import Auditor from "Components/OnBoarding/SubModules/DashBoardCO/components/Auditor";
import useAccount from "../Hooks/Account.hook";
import DashboardSearchResults from "./SearchResults";

import AddProject from "Components/ProjectManagement/components/AddandEditProject/AddProjectModal";
import { clearProjectModalState } from "Components/ProjectManagement/redux/actions";
import AnalyticsList from "Components/OnBoarding/SubModules/DashBoardCO/components/DashBoardView/component/AnalyticsList";
import TeamPerformanceList from "Components/OnBoarding/SubModules/DashBoardCO/components/DashBoardView/component/TeamPerformanceList";
import { setTeamPerformanceUser } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import { AddUpdateTaskReferenceModal } from "CommonModules/sharedComponents/TaskReferencesTab";
import { LogContentModal } from "./TaskDetail/TaskDetailTabs/Logs";
import { CommentDataModal } from "./TaskDetail/TaskDetailTabs/Comments";
import ImpactModal from "./TaskDetail/TaskDetailTabs/Impact";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";

const getAuditScreen = (userTypeNo) => {
  let html = null;
  if (
    userTypeNo === 9 ||
    userTypeNo === 8 ||
    userTypeNo === 16 ||
    userTypeNo === 3 ||
    userTypeNo === 13 ||
    userTypeNo === 14
  ) {
    html = <Auditor />;
  } else {
    html = <div className="text-center mt-4">No Data</div>;
  }
  return html;
};

const Dashboard = ({ showOnlyCalendar = false, showAnalytics = false }) => {
  const { auditUserType: auditUserType } = useAccount();
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );

  const {
    currentActiveTab,
    currentViewByFilter,
    tasks,
    currentDashboardTab,
    tasksBySearchQuery,
  } = useSelector((state) => state?.DashboardState);
  const isShowTaskDetail = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.isShowTaskDetail
  );
  const takeActionActiveTab = useSelector(
    (state) => state?.adminMenu?.takeActionActiveTab
  );
  const teamPerformanceUser = useSelector(
    (state) => state.adminMenu.teamPerformanceUser
  );
  const isDeactivateRequestInProgress = useSelector(
    (state) =>
      state?.ProjectManagementReducer?.deactivateRequestStatus?.isLoading
  );
  const { isShowSearchBox, searchQuery } = tasksBySearchQuery;
  const { isLoading, list: tasksList } = tasks;
  const dispatch = useDispatch();
  const mainContainerRef = useRef(null);
  const [defaultVisibleColumns, setDefaultVisibleColumns] = React.useState([
    {
      title: "subject",
      dataField: "subject",
      is_visible: true,
      filter_value: [],
      col: "columns[0].visible",
      disabled: true,
    },
    {
      title: "customerName",
      dataField: "customerName",
      is_visible: false,
      filter_value: [],
      col: "columns[1].visible",
    },
    {
      title: "status",
      dataField: "status",
      is_visible: false,
      filter_value: [],
      col: "columns[2].visible",
    },
    {
      title: "licenseDisplay",
      dataField: "licenseDisplay",
      is_visible: true,
      filter_value: [],
      col: "columns[3].visible",
    },
    {
      title: "assignedToName",
      dataField: "assignedToName",
      is_visible: true,
      filter_value: [],
      col: "columns[4].visible",
    },
    {
      title: "frequency",
      dataField: "frequency",
      is_visible: false,
      filter_value: [],
      col: "columns[5].visible",
    },
    {
      title: "due_date",
      dataField: "due_date",
      is_visible: true,
      filter_value: [],
      col: "columns[6].visible",
    },
    {
      title: "impactFlag",
      dataField: "impactFlag",
      is_visible: true,
      filter_value: [],
      col: "columns[7].visible",
    },
    {
      title: "riskRating",
      dataField: "riskRating",
      is_visible: true,
      filter_value: [],
      col: "columns[8].visible",
    },
    {
      title: "deadline_date",
      dataField: "deadline_date",
      is_visible: true,
      filter_value: [],
      col: "columns[9].visible",
    },
  ]);

  // useEffect(() => {
  //   if (!showOnlyCalendar) {
  //     dispatch(fetchTasksRequest());
  //   }
  // }, [currentViewByFilter]);

  useEffect(() => {
    dispatch(clearDashboardSearch());
  }, []);

  useEffect(() => {
    const mainContainer = mainContainerRef.current;
    if (mainContainer) {
      const mainContainerClientTop = mainContainer.getClientRects()[0]?.top;
      mainContainer.style.height = `calc(100vh - ${
        mainContainerClientTop + 64
      }px + ${currentActiveTab === dashboardTabs[1] ? "2" : "0"}vh)`;
    }
  }, [
    isShowTaskDetail,
    currentDashboardTab,
    takeActionActiveTab,
    currentActiveTab,
  ]);

  useEffect(() => {
    if (showOnlyCalendar && currentActiveTab !== dashboardTabs[1]) {
      dispatch(setCurrentDashboardTab(dashboardViews[0]));
      dispatch(setCurrentActiveTab(dashboardTabs[1]));
    } else if (!showOnlyCalendar && currentActiveTab !== dashboardTabs[0]) {
      dispatch(setCurrentActiveTab(dashboardTabs[0]));
    }
  }, [showOnlyCalendar]);

  useEffect(() => {
    dispatch(setTeamPerformanceUser(null));
  }, []);
  return (
    <>
      <BackDrop isLoading={isDeactivateRequestInProgress} />
      <AddUpdateTaskReferenceModal />
      <CommentDataModal />
      <LogContentModal />
      <ImpactModal />
      <AddProject
        show={modalsStatus?.projectModal?.isVisible}
        onClose={() => dispatch(clearProjectModalState())}
        isEdit={modalsStatus?.projectModal?.isEdit}
        editData={modalsStatus?.projectModal?.editData}
      />

      {isShowTaskDetail ? (
        <TaskDetail />
      ) : !isShowTaskDetail && !teamPerformanceUser && showAnalytics ? (
        <AnalyticsList
          defaultVisibleColumns={defaultVisibleColumns}
          setDefaultVisibleColumns={setDefaultVisibleColumns}
        />
      ) : !isShowTaskDetail && teamPerformanceUser ? (
        <TeamPerformanceList
          defaultVisibleColumns={defaultVisibleColumns}
          setDefaultVisibleColumns={setDefaultVisibleColumns}
        />
      ) : (
        <Container variant="main">
          <Container variant="container">
            <Container
              variant="content"
              className="overflow-hidden position-relative px-0"
              isShowAddTaskButton
            >
              {/* {!showOnlyCalendar && (
                <DashboardHeader
                  isShowAuditTab={
                    currentEnvironment !== environments.production
                  }
                  setListView={setListView}
                  showOnlyCalendar={showOnlyCalendar}
                />
              )} */}
              {currentDashboardTab === "Audit" ? (
                getAuditScreen(auditUserType)
              ) : (
                <>
                  {/* Tasks List */}
                  <div
                    ref={mainContainerRef}
                    className={`${styles.dashboardMainContainer} mt-3 ${
                      currentActiveTab === dashboardTabs[1] ? "px-md-0" : ""
                    }`}
                  >
                    {isShowSearchBox && searchQuery !== "" ? (
                      <DashboardSearchResults />
                    ) : (
                      <>
                        {currentActiveTab === dashboardTabs[0] && (
                          <>
                            {isLoading ? (
                              <Dots height="30vh" />
                            ) : (
                              tasksList &&
                              tasksList?.length > 0 &&
                              tasksList?.map((item, index) => {
                                const { keyName, keyId } = item;
                                return (
                                  <TaskAccordion
                                    key={`taskAccordion-${
                                      keyId || keyName
                                    }-${index}`}
                                    data={item}
                                    currentViewByFilter={currentViewByFilter}
                                  />
                                );
                              })
                            )}
                          </>
                        )}

                        {currentActiveTab === dashboardTabs[1] && <View />}
                        {/* {currentActiveTab === dashboardTabs[2] && (
                          <BoardView currentBoardViewBy={currentViewByFilter} />
                        )} */}
                      </>
                    )}
                  </div>
                </>
              )}
            </Container>
          </Container>
        </Container>
      )}
    </>
  );
};

export default Dashboard;
