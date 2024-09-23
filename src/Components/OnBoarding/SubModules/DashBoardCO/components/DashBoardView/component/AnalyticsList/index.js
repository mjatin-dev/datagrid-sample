/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "SharedComponents/Containers";
import dashboardStyles from "SharedComponents/Dashboard/styles.module.scss";
import styles from "./style.module.scss";
import { IconButton } from "@mui/material";
import { actions as adminMenuActions } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import {
  fetchAnalyticsTasksRequest,
  fetchDashboardAnalyticsRequest,
  fetchDashboardTeamAnalyticsRequest,
} from "SharedComponents/Dashboard/redux/actions";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import axiosInstance from "apiServices";
import DeactivatedUsers from "SharedComponents/DeactivedUser";
import { toast } from "react-toastify";
import { MdClose, MdSearch } from "react-icons/md";
import { DashboardTabsMobile, tabsList } from "../../quickOverview";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
import CheckTable from "./CheckTable";
import { DASHBOARD_SEARCH_KEY } from "CommonModules/sharedComponents/constants/constant";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import { createCustomDataGridStore } from "CommonModules/helpers/tasks.helper";
export const analyticsKeyTabs = {
  all: "All",
  assignedToMe: "Assigned To Me",
  assignedToOthers: "Assigned To Others",
  notAssigned: "Not Assigned",
  completedByMe: "Completed By Me",
  completedByOther: "Completed By Others",
  approvalPendingByMe: "Approval Pending by Me",
  approvalPendingByOthers: "Approval Pending by Others",
  cc: "CC",
  completedRequests: "Completed Requests",
  // deactived_request_count: "Requests",
};

const AnalyticsList = ({ defaultVisibleColumns, setDefaultVisibleColumns }) => {
  const state = useSelector((state) => state);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState(
    localStorage.getItem(DASHBOARD_SEARCH_KEY) || ""
  );
  const searchQuery = useDebounce(searchValue, 500);
  const [limits, setLimits] = useState({ offset: 0, limit: 2000, id: "" });
  const [approvalTab, setApprovalTab] = useState("");
  const [requestedTasks, setRequestedTasks] = useState([]);

  const BulkActionLoader = useSelector((state) => state?.taskReport?.loader);

  const takeActionActiveTab = useSelector(
    (state) => state?.adminMenu?.takeActionActiveTab
  );
  const currentAnalyticsKey = takeActionActiveTab?.key;
  const analyticsData = useSelector(
    (state) => state.DashboardState.tasksByAnalytics.data
  );
  const analyticsCount = useSelector(
    (state) =>
      state.DashboardState?.dashboardAnalytics?.analyticsData?.completedTask
  );
  const isLoading = useSelector(
    (state) => state.DashboardState.tasksByAnalytics.isLoading
  );
  const analyticsLoading = useSelector(
    (state) => state.DashboardState?.dashboardAnalytics?.isLoading
  );
  const loggedUser =
    state && state.auth && state.auth.loginInfo && state.auth.loginInfo;

  const currentAnalyticsTabName =
    [...tabsList[0], ...tabsList[1]].find(
      (item) => item.filter === takeActionActiveTab?.filter
    )?.tabName || "";

  const dispatch = useDispatch();
  const mainContainerRef = useRef();
  const [tblCount, setTblCount] = useState(0);
  const tasksListScrollHeight = useScrollableHeight(mainContainerRef, 64, [
    analyticsData,
    isLoading,
    analyticsLoading,
  ]);

  const onNext = () => {
    let _id = limits.id.split("-")?.slice(0, -1) || [];
    const _offset = limits.offset + 1;
    setLimits({
      ...limits,
      offset: _offset,
      id: `${_id?.join("-")}-${_offset}`,
    });
  };

  const [handleDataSource, setHandleDataSource] = useState([]);

  const skipReff = React.useRef(0);

  const fetchTblData = async () => {
    if (loggedUser.email) {
      const CustomDataStore = createCustomDataGridStore(
        takeActionActiveTab,
        skipReff,
        setTblCount,
        null,
        searchQuery
      );
      setHandleDataSource(CustomDataStore);
    }
  };

  const fetchTaskList = () => {
    dispatch(
      fetchAnalyticsTasksRequest({
        key: currentAnalyticsKey || "",
        filter:
          takeActionActiveTab.filter === "completedTask"
            ? "completed"
            : takeActionActiveTab.filter,
        search: searchQuery ? searchQuery : "",
        ...{ offset: limits.offset, limit: limits.limit },
      })
    );
  };

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get(
        "/compliance.api.DeactivateRequestList"
      );

      if (response?.status === 200) {
        if (response?.data?.message?.status) {
          setRequestedTasks(response?.data?.message?.status_response);
        } else {
          setRequestedTasks([]);
        }
      }
    } catch (error) {}
  };

  const reactivateUser = async (userEmail) => {
    const response = await axiosInstance.post(
      "/compliance.api.userDeactivate",
      { to_user: userEmail, assign_to: "", status: "Rejected" }
    );
    if (response.status === 200) {
      if (response.data.message) {
        toast.success(response.data.message.status_response);
        fetchRequests();
        dispatch(fetchDashboardAnalyticsRequest());
        dispatch(fetchDashboardTeamAnalyticsRequest());
      } else {
        toast.error(response.data.message.status_response);
      }
    } else {
      toast.error(response.data.message.Message);
    }
  };

  const deactivateUser = async (assginedEmail, email) => {
    try {
      const deactivate = await axiosInstance.post(
        "/compliance.api.userDeactivate",
        {
          to_user: email ? email : "",
          assign_to: assginedEmail ? assginedEmail : "",
          status: "Approve",
        }
      );
      if (deactivate.status === 200) {
        if (deactivate.data.message.status) {
          toast.success(deactivate.data.message.status_response);
          fetchRequests();
          dispatch(fetchDashboardAnalyticsRequest());
          dispatch(fetchDashboardTeamAnalyticsRequest());
        } else {
          toast.error(deactivate.data.message.status_response);
        }
      } else {
        toast.error(deactivate.data.message.Message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (limits.id) {
      fetchTblData();
    }
  }, [limits.id, searchQuery]);

  useEffect(() => {
    if (
      takeActionActiveTab.filter === "completedTask" &&
      takeActionActiveTab.key === "completedRequests"
    )
      fetchTaskList();
  }, [takeActionActiveTab]);

  useEffect(() => {
    fetchTblData();
  }, [analyticsData]);

  useEffect(() => {
    setLimits({
      ...limits,
      limit: 2000,
      offset: 0,
      id: `${takeActionActiveTab.filter}-${currentAnalyticsKey}-0`,
    });
    skipReff.current = 1;
    fetchTblData();
  }, [currentAnalyticsKey, takeActionActiveTab]);

  useEffect(() => {
    if (approvalTab === "Request") {
      fetchRequests();
    }
  }, [approvalTab]);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    localStorage.setItem(DASHBOARD_SEARCH_KEY, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (approvalTab === "Request") {
      setApprovalTab("");
    }
  }, [takeActionActiveTab]);

  useEffect(() => {
    const _searchQuery = localStorage.getItem(DASHBOARD_SEARCH_KEY);
    if (_searchQuery) {
      setShowSearch(true);
    }
    fetchTblData();
  }, []);

  const onSearch = (event) => {
    const { value } = event.target;
    const _id = limits.id?.split("-")?.slice(0, -1) || [];
    setSearchValue(value);
    if (limits.offset > 0) {
      setLimits({ ...limits, offset: 0, id: `${_id?.join("-")}-search-0` });
    }
  };

  useEffect(() => {
    fetchTblData();
  }, [defaultVisibleColumns]);

  return (
    <Container variant="main">
      <BackDrop isLoading={BulkActionLoader} />
      <Container variant="container">
        <Container
          variant="content"
          className="px-0 overflow-hidden "
          isShowAddTaskButton
        >
          <div
            className={`${dashboardStyles.dashboardHeaderContainer} justify-content-start justify-content-md-between m-0 mb-2`}
          >
            <DashboardTabsMobile />
            <p
              className={`${dashboardStyles.dashboardHeaderTitle} ${dashboardStyles.dashboardHeaderTitleActive}`}
            >
              {currentAnalyticsTabName}
            </p>
            <div className="d-flex align-items-center">
              <div
                className={`${
                  showSearch ? styles.searchInputContainer : ""
                } mr-3 d-none d-md-flex`}
              >
                {!showSearch && (
                  <IconButton
                    disableTouchRipple
                    onClick={() => setShowSearch(true)}
                  >
                    <MdSearch className={styles.searchIcon} />
                  </IconButton>
                )}
                {showSearch && (
                  <>
                    <input
                      // placeholder="Search for tasks"
                      className={styles.searchInput}
                      type="text"
                      value={searchValue}
                      onChange={onSearch}
                      autoFocus
                    />
                    <MdSearch className={styles.searchIcon} />
                    <IconButton
                      disableTouchRipple={true}
                      onClick={() => {
                        setShowSearch(false);
                        setSearchValue("");
                        setLimits({
                          ...limits,
                          offset: 0,
                          id: `${takeActionActiveTab.filter}-${currentAnalyticsKey}-0`,
                        });
                      }}
                      className={styles.closeSearchIcon}
                    >
                      <MdClose />
                    </IconButton>
                  </>
                )}
              </div>
            </div>
          </div>

          {takeActionActiveTab.filter !== "notAssigned" && (
            // takeActionActiveTab.filter !== "approvalPending" &&
            <div className={`${dashboardStyles.dashboardTabsContainer} mt-0`}>
              <div className="d-flex">
                {Object.keys(analyticsKeyTabs)
                  .filter((tab) =>
                    takeActionActiveTab.filter === "completedTask"
                      ? loggedUser.designation !== "Head of Compliance Officer"
                        ? tab !== "notAssigned" &&
                          tab !== "assignedToMe" &&
                          tab !== "assignedToOthers" &&
                          tab !== "completedRequests" &&
                          tab !== "approvalPendingByMe" &&
                          tab !== "approvalPendingByOthers"
                        : tab !== "notAssigned" &&
                          tab !== "assignedToMe" &&
                          tab !== "assignedToOthers" &&
                          tab !== "approvalPendingByMe" &&
                          tab !== "approvalPendingByOthers"
                      : takeActionActiveTab.filter === "approvalPending"
                      ? tab !== "notAssigned" &&
                        tab !== "assignedToMe" &&
                        tab !== "assignedToOthers" &&
                        tab !== "completedRequests" &&
                        tab !== "completedByMe" &&
                        tab !== "completedByOther"
                      : takeActionActiveTab.filter === "ccTask" ||
                        takeActionActiveTab.filter === "rejectedTask"
                      ? tab !== "notAssigned" &&
                        // tab !== "assignedToMe" &&
                        // tab !== "assignedToOthers" &&
                        tab !== "completedRequests" &&
                        tab !== "completedByMe" &&
                        tab !== "completedByOther" &&
                        tab !== "approvalPendingByMe" &&
                        tab !== "approvalPendingByOthers"
                      : // tab !== "all"
                        tab !== "completedByMe" &&
                        tab !== "completedByOther" &&
                        tab !== "completedRequests" &&
                        tab !== "approvalPendingByMe" &&
                        tab !== "approvalPendingByOthers"
                  )
                  .map((tab, index) => {
                    return (
                      <p
                        onClick={() => {
                          dispatch(
                            adminMenuActions.setTakeActionTabKey(
                              tab === "approvalPendingByMe"
                                ? "assignedToMe"
                                : tab === "approvalPendingByOthers"
                                ? "assignedToOthers"
                                : tab
                            )
                          );
                          if (approvalTab === "Request") {
                            setApprovalTab("");
                          }
                        }}
                        key={`dashboard-tab-title-${index}`}
                        className={`${dashboardStyles.dashboardTabTitle} ${
                          (takeActionActiveTab.filter === "approvalPending"
                            ? (currentAnalyticsKey === "assignedToMe" &&
                                tab === "approvalPendingByMe") ||
                              (currentAnalyticsKey === "assignedToOthers" &&
                                tab === "approvalPendingByOthers") ||
                              currentAnalyticsKey === tab
                            : currentAnalyticsKey === tab) && !approvalTab
                            ? dashboardStyles.dashboardTabTitle__active
                            : ""
                        } d-flex align-items-center`}
                      >
                        {analyticsKeyTabs[tab]}&nbsp;
                        <div className="initial-name__container ml-2">
                          <span className="initial-name">
                            {tab !== "completedRequests"
                              ? takeActionActiveTab.data &&
                                takeActionActiveTab.data[
                                  tab === "all" ? "count" : tab
                                ]
                              : analyticsCount.deactived_request_count}
                            {tab === "approvalPendingByMe"
                              ? takeActionActiveTab.data["assignedToMe"]
                              : tab === "approvalPendingByOthers"
                              ? takeActionActiveTab.data["assignedToOthers"]
                              : ""}
                            {tab === "cc" &&
                              (takeActionActiveTab?.data?.["ccAssigned"] || 0)}
                          </span>
                        </div>
                      </p>
                    );
                  })}
                {takeActionActiveTab.filter === "approvalPending" &&
                  loggedUser.designation === "Head of Compliance Officer" && (
                    <p
                      onClick={() => {
                        setApprovalTab("Request");
                      }}
                      className={`${dashboardStyles.dashboardTabTitle} ${
                        approvalTab === "Request"
                          ? dashboardStyles.dashboardTabTitle__active
                          : ""
                      } d-flex align-items-center`}
                    >
                      Request&nbsp;
                      <div className="initial-name__container ml-2">
                        <span className="initial-name">
                          {requestedTasks?.length}
                        </span>
                      </div>
                    </p>
                  )}
              </div>
            </div>
          )}
          {/* {takeActionActiveTab.filter === "approvalPending" &&
            loggedUser.designation === "Head of Compliance Officer" && (
              <>
                <div
                  className={`${dashboardStyles.dashboardTabsContainer} d-flex align-items-center`}
                >
                  <div className="d-flex align-items-center">
                    {approvalPendingTabs.map((tab) => {
                      return (
                        <p
                          onClick={() => setApprovalTab(tab)}
                          key={`tab-${tab}`}
                          className={`${dashboardStyles.dashboardTabTitle} ${
                            approvalTab === tab
                              ? dashboardStyles.dashboardTabTitle__active
                              : ""
                          } d-flex align-items-center`}
                        >
                          {tab}
                          &nbsp;
                          {tab === approvalPendingTabs[1] && (
                            <div className="initial-name__container ml-2">
                              <span className="initial-name">
                                {requestedTasks.length}
                              </span>
                            </div>
                          )}
                          {tab === approvalPendingTabs[0] && (
                            <div className="initial-name__container ml-2">
                              <span className="initial-name">
                                {analyticsData?.tasks?.length || 0}
                              </span>
                            </div>
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </>
            )} */}
          <div
            ref={mainContainerRef}
            style={{ height: tasksListScrollHeight }}
            className={`${dashboardStyles.dashboardMainContainer} mt-3`}
            id="scrollableList"
          >
            {approvalTab === "Request" && (
              <DeactivatedUsers
                fields={requestedTasks}
                reactivateUser={reactivateUser}
                deactivateUser={deactivateUser}
                isShowActionOn={false}
              />
            )}

            {currentAnalyticsKey === "completedRequests" ? (
              <DeactivatedUsers fields={analyticsData?.deactived_request} />
            ) : null}

            {/* {isLoading && !approvalTab && (
              <Dots height={limits.offset !== 0 && "40px"} />
            )} */}

            {/* {!isLoading &&
              !approvalTab &&
              currentAnalyticsKey !== "completedRequests" && (
                <AnalyticsTbl
                  // TableData={analyticsData?.tasks || []}
                  TableData={analyticsData?.tasks || []}
                  onNext={onNext}
                  rowCount={tblCount}
                  reCallfetchTaskList={fetchTaskList}
                  currentAnalyticsKey={takeActionActiveTab}
                  defaultVisibleColumns={defaultVisibleColumns}
                  setDefaultVisibleColumns={setDefaultVisibleColumns}
                />
              )} */}
            {/* CustomDataStore */}
            {/* !isLoading && */}

            {/* {!approvalTab && handleDataSource && currentAnalyticsKey !== "completedRequests" && (
               <FinalDevExTbl  
               TableData={handleDataSource || []}
               onNext={onNext}
               rowCount={tblCount}
               reCallfetchTaskList={fetchTaskList} 
               currentAnalyticsKey={takeActionActiveTab}
               defaultVisibleColumns={defaultVisibleColumns}
               setDefaultVisibleColumns={setDefaultVisibleColumns}      
               isLoading={tblLoading}
               setLoading={setTblLoading}
               />
             )} */}

            {/* {!isLoading && !approvalTab && currentAnalyticsKey !== "completedRequests" && (
             )}  */}

            {handleDataSource &&
              !approvalTab &&
              currentAnalyticsKey !== "completedRequests" && (
                <CheckTable
                  TableData={handleDataSource || []}
                  onNext={onNext}
                  rowCount={tblCount}
                  currentAnalyticsKey={takeActionActiveTab}
                  defaultVisibleColumns={defaultVisibleColumns}
                  setDefaultVisibleColumns={setDefaultVisibleColumns}
                />
              )}
          </div>
        </Container>
      </Container>
    </Container>
  );
};

export default AnalyticsList;
