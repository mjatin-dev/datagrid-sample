/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import "./style.css";
// import percentageless60 from "../../../../../../assets/Icons/percentageless60.png";
// import classNames from "classnames";
// import btnicon from "../../../../../../assets/Icons/btn-icon.png";
// import Collapsible from "react-collapsible";
// import siderBarbtnArrow from "../../../../../../assets/Icons/siderBarbtnArrow.png";
// import siderBarbtnArrowTop from "../../../../../../assets/Icons/siderBarbtnArrowTop.png";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import { actions as coSettingSideBarOpen } from "../../redux/actions";

import {
  actions as adminMenuActions,
  setTeamPerformanceUser,
} from "../../MenuRedux/actions";
import { Button, IconButton } from "@mui/material";
import { CallMade, CallReceived } from "@mui/icons-material";
import { analyticsKeyTabs } from "./component/AnalyticsList/index";
import { isEqual } from "lodash";
import {
  clearTaskDetail,
  clearTasksByTeamPerformance,
  fetchDashboardAnalyticsRequest,
  fetchDashboardTeamAnalyticsRequest,
  setCurrentDashboardTab,
} from "SharedComponents/Dashboard/redux/actions";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { MdArrowLeft, MdDoDisturb, MdKeyboardArrowLeft } from "react-icons/md";
import styles from "./style.module.scss";
import { dashboardViews } from "SharedComponents/Constants";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
export const tabsList = [
  [
    {
      filter: "riskDelay",
      tabName: "Overdue",
      countColor: "#ef605a",
    },
    {
      filter: "today",
      tabName: "Today",
      countColor: "#ff8100",
    },
    {
      filter: "next6Days",
      tabName: "Next 6 Days",
      countColor: "#f2d748",
    },
    {
      filter: "next8To30Days",
      tabName: "8 to 30 Days",
      countColor: "#5dd15b",
    },
    {
      filter: "beyond30Days",
      tabName: "Beyond 30 Days",
      countColor: "#6394fd",
    },
    {
      filter: "All",
      tabName: "Total",
      countColor: "#9e63fd",
      borderColor: "rgba(158, 99, 253,0.5)",
    },
  ],
  [
    {
      filter: "approvalPending",
      tabName: "Approval Pending",
      countColor: "#f0362a",
      keysTitle: {
        approvalPendingByMe: "Approval Pending By Me",
        approvalPendingByOthers: "Approval Pending By Others",
      },
      isDisableKeys: false,
      isNotShowNotAssigned: true,
    },
    // {
    //   filter: "ccTask",
    //   tabName: "CC Tasks",
    //   countColor: "#6394fd",
    //   // keysTitle: {
    //   //   approvalPendingByMe: "Approval Pending By Me",
    //   //   approvalPendingByOthers: "Approval Pending By Others",
    //   // },
    //   isDisableKeys: true,
    // },
    {
      filter: "rejectedTask",
      tabName: "Rejected Tasks",
      countColor: "#f0362a",
      isNotShowNotAssigned: true,
    },
    {
      filter: "completedTask",
      tabName: "Completed",
      countColor: "#7dba75",
      keys: {
        completedByMe: "completedByMe",
        completedByOther: "completedByOther",
      },
      isNotShowNotAssigned: true,
    },
  ],
];
// let percentage;
function QuickOverView({ containerClass }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const currentDashboardTab = state.DashboardState.currentDashboardTab;
  const currentOpenedTask = state.DashboardState?.taskDetailById.data;
  const userDetails = state && state.auth && state.auth.loginInfo;
  const sideBarOpen = state?.taskReport?.sideBarOpenClose || false;

  const [openSettings, setOpenSettings] = useState(false);

  const setClick = (payload) =>
    dispatch(adminMenuActions.setTakeActionTab(payload));
  // const [showMoreLess, setShowMoreLess] = useState(false);
  const [showMoreLessTM, setShowMoreLessTM] = useState(false);
  const { isLoading, teamStats, analyticsData } = useSelector(
    (state) => state.DashboardState?.dashboardAnalytics
  );
  const teamPerformanceUser = useSelector(
    (state) => state.adminMenu.teamPerformanceUser
  );

  const takeActionActiveTab = state?.adminMenu?.takeActionActiveTab;

  const onSettingsOpenClose = () => {
    setOpenSettings(!openSettings);
    // coSettingSideBarOpen
    dispatch(coSettingSideBarOpen.coSettingSideBarOpen(!openSettings));
  };

  useEffect(() => {
    if (
      takeActionActiveTab?.filter &&
      analyticsData &&
      analyticsData[takeActionActiveTab.filter] &&
      Object.keys(analyticsData[takeActionActiveTab?.filter])?.length > 0 &&
      !teamPerformanceUser
    ) {
      let _updatedAnalyticsTab = analyticsData[takeActionActiveTab?.filter];
      if (!isEqual(takeActionActiveTab?.data, _updatedAnalyticsTab)) {
        setClick({
          ...takeActionActiveTab,
          data: _updatedAnalyticsTab,
        });
      }
    }
  }, [analyticsData, teamPerformanceUser]);

  const handleTabClick = (filter, key, data) => {
    if (currentOpenedTask) {
      dispatch(clearTaskDetail());
    }
    setClick({
      filter,
      key,
      data,
    });
  };
  const handleTeamPerformanceUserClick = (user_id, user_name) => {
    if (currentOpenedTask) {
      dispatch(clearTaskDetail());
    }
    dispatch(
      setTeamPerformanceUser({
        user_id,
        user_name,
      })
    );
  };

  useEffect(() => {
    dispatch(fetchDashboardAnalyticsRequest());
    dispatch(fetchDashboardTeamAnalyticsRequest());
  }, []);

  // useEffect(() => {
  //   if (currentOpenedTask.taskName) {
  //     dispatch(fetchDashboardAnalyticsRequest());
  //     dispatch(fetchDashboardTeamAnalyticsRequest());
  //   }
  // }, [currentOpenedTask]);

  useEffect(() => {
    if (analyticsData && analyticsData["riskDelay"] && !takeActionActiveTab) {
      const payload = {
        filter: "riskDelay",
        key: "all",
        data: analyticsData["riskDelay"],
      };
      dispatch(adminMenuActions.setTakeActionTab(payload));
    }
  }, [analyticsData]);

  // const openCloseCollapsible = (index) => {
  //   let list = [...collapse];
  //   if (collapse[index].open === false) {
  //     list &&
  //       list.map((item, key) => {
  //         if (key === index) {
  //           list[index].open = true;
  //         } else {
  //           list[key].open = false;
  //         }
  //       });
  //     setCollapse(list);
  //   } else {
  //     let list = [...collapse];
  //     list &&
  //       list.map((item, key) => {
  //         if (key === index) {
  //           list[index].open = false;
  //         } else {
  //           list[key].open = false;
  //         }
  //       });
  //     setCollapse(list);
  //   }
  // };

  // const monthlyBoxView = (item, index) => {
  //   return (
  //     <>
  //       <div
  //         key={`monthly-box-${item.name}-${index}`}
  //         className="compliant-option"
  //       >
  //         <p className="compliant-title-left">{item.name}</p>
  //         <ul className="list-group list-group-horizontal">
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-1`}
  //             className={item && calculateColorCode(item.status?.m1)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-2`}
  //             className={item && calculateColorCode(item.status?.m2)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-3`}
  //             className={item && calculateColorCode(item.status?.m3)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-4`}
  //             className={item && calculateColorCode(item.status?.m4)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-5`}
  //             className={item && calculateColorCode(item.status?.m5)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-6`}
  //             className={item && calculateColorCode(item.status?.m6)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-7`}
  //             className={item && calculateColorCode(item.status?.m7)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-8`}
  //             className={item && calculateColorCode(item.status?.m8)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-9`}
  //             className={item && calculateColorCode(item.status?.m9)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-10`}
  //             className={item && calculateColorCode(item.status?.m10)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-11`}
  //             className={item && calculateColorCode(item.status?.m11)}
  //           ></li>
  //           <li
  //             key={`monthly-box-item-${item.name}-${index}-12`}
  //             className={item && calculateColorCode(item.status?.m12)}
  //           ></li>
  //         </ul>
  //       </div>
  //     </>
  //   );
  // };
  // const renderCollapsibleMonthView = (data, index) => {
  //   return (
  //     <div className="btn-data">
  //       {data &&
  //         data &&
  //         data.length > 0 &&
  //         data.map((item, index) => {
  //           return monthlyBoxView(item, index);
  //         })}
  //     </div>
  //   );
  // };
  // const _renderCompanyView = (data, index, length) => {
  //   percentage = (data.completed_task / data.total_task) * 100;
  //   if (length <= 2) {
  //     let btnClass = classNames({
  //       "btn sidebar-btn-two-new-active  btnLattwo": index % 2 !== 0,
  //       "btn sidebar-btn-one-two": index % 2 === 0,
  //       heightFull: collapse && collapse[index] && collapse[index].open,
  //       heightFixed:
  //         collapse && collapse[index] && collapse[index].open === false,
  //       "border-top-left-radius": index === length - 1,
  //     });
  //     return (
  //       <button key={data?.companyName} className={btnClass}>
  //         <div className="d-flex">
  //           <div className="two-btn-img">
  //             <img
  //               src={
  //                 data && data?.completed_task === data?.total_task
  //                   ? btnicon
  //                   : percentageless60
  //               }
  //               alt="btn-icon"
  //             />{" "}
  //           </div>
  //           <div className="icon-right-text-arrow d-flex justify-content-between">
  //             <div className="small-text truncate">
  //               {" "}
  //               {data && data.companyName}
  //             </div>
  //             <div className="big-text">
  //               ({data && data.completed_task}/{data && data.total_task}){" "}
  //               <img
  //                 className="float-right"
  //                 onClick={() => openCloseCollapsible(index)}
  //                 src={
  //                   collapse && collapse[index] && collapse[index].open
  //                     ? siderBarbtnArrowTop
  //                     : siderBarbtnArrow
  //                 }
  //                 alt="btn Arrow top"
  //               />
  //             </div>
  //           </div>
  //         </div>
  //         <Collapsible
  //           transitionTime={400}
  //           transitionCloseTime={500}
  //           easing="linear"
  //           overflowWhenOpen="inherit"
  //           open={collapse && collapse[index] && collapse[index].open}
  //         >
  //           <div>{renderCollapsibleMonthView(data.licenseCodeList)}</div>
  //         </Collapsible>
  //       </button>
  //     );
  //   } else if (length > 2 && length <= 5) {
  //     let btnClass = classNames({
  //       "btn sidebar-btn-two-new-active ": index % 2 !== 0,
  //       "btn sidebar-btn-one-two ": index % 2 === 0,
  //       "fullwidth-5c": collapse && collapse[index] && collapse[index].open,
  //       "widthfixed-5c":
  //         collapse && collapse[index] && collapse[index].open === false,
  //       "border-radious-zr": index % 2 !== 0 && index !== length - 1,
  //       "border-top-left-radius": index === length - 1,
  //     });

  //     return (
  //       <button key={data?.companyName} className={btnClass}>
  //         <div className="d-flex">
  //           <div className="two-btn-img">
  //             <img
  //               src={
  //                 data && data?.completed_task === data?.total_task
  //                   ? btnicon
  //                   : percentageless60
  //               }
  //               alt="btn-icon"
  //             />{" "}
  //           </div>
  //           <div className="icon-right-text-new">
  //             <div className="small-text-new">{data && data.companyName}</div>
  //             <div className="big-text-new">
  //               ({data && data.completed_task}/{data && data.total_task}){" "}
  //               <img
  //                 style={{ cursor: "pointer" }}
  //                 onClick={() => openCloseCollapsible(index)}
  //                 src={
  //                   collapse && collapse[index] && collapse[index].open
  //                     ? siderBarbtnArrowTop
  //                     : siderBarbtnArrow
  //                 }
  //                 alt="btn Arrow"
  //               />
  //             </div>
  //           </div>
  //         </div>
  //         <Collapsible
  //           transitionTime={400}
  //           transitionCloseTime={500}
  //           overflowWhenOpen="inherit"
  //           open={collapse && collapse[index] && collapse[index].open}
  //         >
  //           <div>
  //             {data &&
  //               data.licenseCodeList &&
  //               data.licenseCodeList.length > 0 &&
  //               renderCollapsibleMonthView(data.licenseCodeList)}
  //           </div>
  //         </Collapsible>
  //       </button>
  //     );
  //   } else if (length > 5) {
  //     let btnClass = classNames({
  //       "btn sidebar-btn-two-new-active": index % 2 !== 0,
  //       "btn sidebar-btn-one-two ": index % 2 === 0,
  //       "fullwidth-5c": collapse && collapse[index] && collapse[index].open,
  //       "widthfixed-5c":
  //         collapse && collapse[index] && collapse[index].open === false,
  //       "border-radious-zr": index % 2 !== 0 && index !== length - 1,
  //       "border-top-left-radius": index === length - 1,
  //     });

  //     return (
  //       <>
  //         <button key={data?.companyName} className={btnClass}>
  //           <div className="d-flex">
  //             <div className="icon-left-new">
  //               <img
  //                 style={
  //                   percentage && percentage > 60
  //                     ? { width: "auto", height: "auto" }
  //                     : {}
  //                 }
  //                 src={
  //                   percentage && percentage >= 0 ? btnicon : percentageless60
  //                 }
  //                 alt="btn-icon"
  //               />{" "}
  //             </div>
  //             <div className="icon-right-text-new">
  //               <div className="small-text-new">{data && data.companyName}</div>
  //               <div className="big-text-new">
  //                 ({data && data.completed_task}/{data && data.total_task}){" "}
  //                 <img
  //                   style={{ cursor: "pointer" }}
  //                   onClick={() => openCloseCollapsible(index)}
  //                   src={
  //                     collapse && collapse[index] && collapse[index].open
  //                       ? siderBarbtnArrowTop
  //                       : siderBarbtnArrow
  //                   }
  //                   alt="btn Arrow"
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //           <Collapsible
  //             overflowWhenOpen="inherit"
  //             open={collapse && collapse[index] && collapse[index].open}
  //           >
  //             <div>{renderCollapsibleMonthView(data.licenseCodeList)}</div>
  //           </Collapsible>
  //         </button>
  //       </>
  //     );
  //   }
  // };
  const _getAssignedName = (name) => {
    let str = "";
    if (name.length < 11) {
      str = name;
    } else {
      str = `${name.slice(0, 9)}...`;
    }
    return str;
  };

  const calculateColorCode = (item) => {
    const value = item?.week_task_flag;
    let str = "";
    if (value === "grey") {
      str = "gray-box";
    } else if (value === "green") {
      str = "green-box";
    } else if (value === "red") {
      str = "red-box";
    } else if (value === "orange") {
      str = "orange-box";
    } else {
      str = "gray-box";
    }
    return str;
  };
  const _renderteamStats = (item, index) => {
    return (
      <div
        onClick={() =>
          handleTeamPerformanceUserClick(item.user_id, item.user_name)
        }
        style={{
          ...(teamPerformanceUser &&
            teamPerformanceUser.user_id === item.user_id && {
              backgroundColor: "rgba(108, 93, 211, 0.075)",
              borderRadius: "4px",
            }),
        }}
        key={`team-status-${index}`}
        className="compliant-option-new cursor-pointer align-items-center py-2"
      >
        {item && item.user_name && (
          <>
            <p className="compliant-title-left-new mb-0">
              {/* <p className="two-digin-circle mb-0">
                {&& getInitialName(item.user_name)}
              </p> */}
              {item && item.user_name && (
                <div className="initial-name__container mr-2">
                  <span className="initial-name">
                    {getInitialName(item.user_name)}
                  </span>
                </div>
              )}
              {item && item.user_name && _getAssignedName(item.user_name)}
            </p>
            <ul className="list-group list-group-horizontal m-0 p-0">
              <li
                className={
                  item &&
                  item?.week_status?.w1 &&
                  calculateColorCode(item?.week_status?.w1)
                }
              ></li>
              <li
                className={
                  item &&
                  item?.week_status?.w2 &&
                  calculateColorCode(item?.week_status?.w2)
                }
              ></li>
              <li
                className={
                  item &&
                  item?.week_status?.w3 &&
                  calculateColorCode(item?.week_status?.w3)
                }
              ></li>
              <li
                className={
                  item &&
                  item?.week_status?.w4 &&
                  calculateColorCode(item?.week_status?.w4)
                }
              ></li>
              <li
                className={
                  item &&
                  item?.week_status?.w5 &&
                  calculateColorCode(item?.week_status?.w5)
                }
              ></li>
            </ul>
          </>
        )}
      </div>
    );
  };
  useEffect(() => {
    if (teamPerformanceUser) {
      dispatch(setTeamPerformanceUser(null));
      dispatch(clearTasksByTeamPerformance());
    }
  }, [takeActionActiveTab]);

  return (
    <div className={`row ${containerClass || ""}`}>
      {isLoading ? (
        <Dots height="50vh" />
      ) : (
        <div
          className={`col-12 col-md-3  ${
            sideBarOpen ? "col-xl-1" : "col-xl-3"
          } new-side-bar`}
        >
          <div className="scroll-inside-new">
            <div
              className={
                isMobile
                  ? "mobile108Height all-companies-task-grid-1"
                  : "all-companies-task-grid-1"
              }
            >
              <div className="right-side">
                <div className="d-flex justify-content-between align-items-center">
                  {sideBarOpen === false && (
                    <>
                      <div className="">
                        <div className="user-title">
                          Hi&nbsp;
                          {userDetails &&
                            (userDetails.full_name || userDetails.UserName)}
                          ,
                        </div>
                      </div>
                    </>
                  )}
                  <IconButton
                    disableTouchRipple={true}
                    onClick={onSettingsOpenClose}
                  >
                    {sideBarOpen ? (
                      <BiArrowToRight className="leftRightIcons" />
                    ) : (
                      <BiArrowToLeft className="leftRightIcons" />
                    )}
                  </IconButton>
                </div>
                {sideBarOpen === false && (
                  <>
                    <DashboardTabsMobile />

                    <div
                      className={styles.header}
                      style={{ marginBottom: "20px" }}
                    >
                      {dashboardViews.map((tab) => (
                        <div
                          key={tab}
                          className={`${styles.tab} ${
                            currentDashboardTab === tab && styles.tabActive
                          }`}
                          onClick={() => {
                            dispatch(setCurrentDashboardTab(tab))
                            if(tab === "Audit"){
                              dispatch(clearTaskDetail());
                            }
                          }}
                        >
                          {tab}
                        </div>
                      ))}
                    </div>
                    {currentDashboardTab === dashboardViews[0] && (
                      <>
                        <div className="take-action-grid-new shadow bg-white rounded">
                          <div className="row no-gutters align-items-center w-100 mb-2">
                            <div className="col-6">
                              <div className="take-action-title mb-0">
                                Dashboard
                              </div>
                            </div>
                            <div className="row no-gutters col">
                              <div
                                className="col-3 text-center"
                                title={analyticsKeyTabs.assignedToMe}
                              >
                                <CallReceived
                                  className="incoming-tasks__color"
                                  style={{ fontSize: 18 }}
                                />
                              </div>
                              <div
                                className="col-3 text-center"
                                title={analyticsKeyTabs.assignedToOthers}
                              >
                                <CallMade
                                  className="outgoing-tasks__color"
                                  style={{ fontSize: 18 }}
                                />
                              </div>
                              <div
                                className="col-3 text-center"
                                title={analyticsKeyTabs.notAssigned}
                              >
                                <MdDoDisturb
                                  className="not-assigned-tasks__color"
                                  style={{ fontSize: 18 }}
                                />
                              </div>
                              <div
                                className="col-3 text-center"
                                title={analyticsKeyTabs.notAssigned}
                              >
                                <span style={{ color: "#7165d5" }}>CC</span>
                              </div>
                            </div>
                            <div className="col-1"></div>
                          </div>

                          <div className="action-bottom-grid">
                            {tabsList[0].map((tabData) => {
                              return (
                                <div className="action-bottom-item my-1">
                                  <div
                                    className="row no-gutters align-items-center w-100"
                                    style={{
                                      ...(takeActionActiveTab &&
                                        tabData.filter ===
                                          takeActionActiveTab.filter &&
                                        !teamPerformanceUser && {
                                          backgroundColor:
                                            "rgba(108, 93, 211, 0.075)",
                                          borderRadius: "4px",
                                        }),
                                      ...(tabData.filter === "All" &&
                                        tabData.borderColor && {
                                          borderBottom: `1px solid ${tabData.borderColor}`,
                                          borderTop: `1px solid ${tabData.borderColor}`,
                                        }),
                                    }}
                                  >
                                    <div className="col-6">
                                      <Button
                                        disableTouchRipple={true}
                                        size="small"
                                        variant="text"
                                        className="analytics-btn"
                                        onClick={() => {
                                          handleTabClick(
                                            tabData.filter,
                                            "all",
                                            analyticsData[tabData.filter]
                                          );
                                        }}
                                        style={{ fontWeight: 800 }}
                                      >
                                        {tabData.tabName}
                                      </Button>
                                    </div>
                                    <div className="row col no-gutters">
                                      {!tabData?.isDisableKeys && (
                                        <>
                                          <div className="col-3 text-center">
                                            <Button
                                              title={
                                                analyticsKeyTabs.assignedToMe
                                              }
                                              size="small"
                                              variant="text"
                                              className="analytics-btn"
                                              disableTouchRipple={true}
                                              onClick={() => {
                                                handleTabClick(
                                                  tabData.filter,
                                                  tabData?.keys
                                                    ?.completedByMe ||
                                                    "assignedToMe",
                                                  analyticsData[tabData.filter]
                                                );
                                              }}
                                            >
                                              <span>
                                                {(analyticsData[
                                                  tabData.filter
                                                ] &&
                                                  analyticsData[tabData.filter][
                                                    tabData?.keys
                                                      ?.completedByMe ||
                                                      "assignedToMe"
                                                  ]) ||
                                                  0}
                                              </span>
                                            </Button>
                                          </div>
                                          <div className="col-3 text-center">
                                            <Button
                                              disableTouchRipple={true}
                                              title={
                                                analyticsKeyTabs.assignedToOthers
                                              }
                                              size="small"
                                              variant="text"
                                              className="analytics-btn"
                                              onClick={() => {
                                                handleTabClick(
                                                  tabData.filter,
                                                  tabData?.keys
                                                    ?.completedByOther ||
                                                    "assignedToOthers",
                                                  analyticsData[tabData.filter]
                                                );
                                              }}
                                            >
                                              <span>
                                                {(analyticsData[
                                                  tabData.filter
                                                ] &&
                                                  analyticsData[tabData.filter][
                                                    tabData?.keys
                                                      ?.completedByOther ||
                                                      "assignedToOthers"
                                                  ]) ||
                                                  0}
                                              </span>
                                            </Button>
                                          </div>
                                          <div className="col-3 text-center">
                                            {(tabData.filter !==
                                              "completedTask" ||
                                              tabData.filter !==
                                                "approvalPending") && (
                                              <Button
                                                disableTouchRipple={true}
                                                title={
                                                  analyticsKeyTabs.notAssigned
                                                }
                                                size="small"
                                                variant="text"
                                                className="analytics-btn"
                                                onClick={() => {
                                                  handleTabClick(
                                                    tabData.filter,
                                                    "notAssigned",
                                                    analyticsData[
                                                      tabData.filter
                                                    ]
                                                  );
                                                }}
                                              >
                                                <span>
                                                  {analyticsData[tabData.filter]
                                                    ?.notAssigned || 0}
                                                </span>
                                              </Button>
                                            )}
                                          </div>
                                          <div className="col-3 text-center">
                                            {(tabData.filter !==
                                              "completedTask" ||
                                              tabData.filter !==
                                                "approvalPending") && (
                                              <Button
                                                disableTouchRipple={true}
                                                title={analyticsKeyTabs.cc}
                                                size="small"
                                                variant="text"
                                                className="analytics-btn"
                                                onClick={() => {
                                                  handleTabClick(
                                                    tabData.filter,
                                                    "cc",
                                                    analyticsData[
                                                      tabData.filter
                                                    ]
                                                  );
                                                }}
                                              >
                                                <span>
                                                  {analyticsData[tabData.filter]
                                                    ?.ccAssigned || 0}
                                                </span>
                                              </Button>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <div className="col-1 d-flex justify-content-end">
                                      <div
                                        className="count-container cursor-pointer"
                                        style={{
                                          backgroundColor: tabData.countColor,
                                        }}
                                        title={
                                          (analyticsData[tabData.filter]
                                            ?.count || 0) +
                                          (analyticsData[tabData.filter]
                                            ?.deactived_request_count || 0)
                                        }
                                        onClick={() => {
                                          handleTabClick(
                                            tabData.filter,
                                            "all",
                                            analyticsData[tabData.filter]
                                          );
                                        }}
                                      >
                                        <div>
                                          {(analyticsData[tabData.filter]
                                            ?.count || 0) +
                                            (analyticsData[tabData.filter]
                                              ?.deactived_request_count || 0)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="take-action-grid-new shadow bg-white rounded">
                          <div className="action-bottom-grid">
                            {tabsList[1].map((tabData) => {
                              return (
                                <div className="action-bottom-item my-1">
                                  <div
                                    className="row no-gutters align-items-center w-100"
                                    style={{
                                      ...(takeActionActiveTab &&
                                        tabData.filter ===
                                          takeActionActiveTab.filter &&
                                        !teamPerformanceUser && {
                                          backgroundColor:
                                            "rgba(108, 93, 211, 0.075)",
                                          borderRadius: "4px",
                                        }),
                                      ...(tabData.filter === "All" &&
                                        tabData.borderColor && {
                                          borderBottom: `1px solid ${tabData.borderColor}`,
                                          borderTop: `1px solid ${tabData.borderColor}`,
                                        }),
                                    }}
                                  >
                                    <div className="col-6">
                                      <Button
                                        disableTouchRipple={true}
                                        size="small"
                                        variant="text"
                                        className="analytics-btn"
                                        onClick={() => {
                                          handleTabClick(
                                            tabData.filter,
                                            "all",
                                            analyticsData[tabData.filter]
                                          );
                                        }}
                                        style={{ fontWeight: 800 }}
                                      >
                                        {tabData.tabName}
                                      </Button>
                                    </div>

                                    <div className="col row no-gutters">
                                      {!tabData?.isDisableKeys && (
                                        <>
                                          <div className="col-3 text-center">
                                            <Button
                                              title={
                                                tabData?.keysTitle
                                                  ?.approvalPendingByMe ||
                                                analyticsKeyTabs.assignedToMe
                                              }
                                              size="small"
                                              variant="text"
                                              className="analytics-btn"
                                              disableTouchRipple={true}
                                              onClick={() => {
                                                handleTabClick(
                                                  tabData.filter,
                                                  tabData?.keys
                                                    ?.completedByMe ||
                                                    "assignedToMe",
                                                  analyticsData[tabData.filter]
                                                );
                                              }}
                                            >
                                              <span>
                                                {(analyticsData[
                                                  tabData.filter
                                                ] &&
                                                  analyticsData[tabData.filter][
                                                    tabData?.keys
                                                      ?.completedByMe ||
                                                      "assignedToMe"
                                                  ]) ||
                                                  0}
                                              </span>
                                            </Button>
                                          </div>
                                          <div className="col-3 text-center">
                                            <Button
                                              disableTouchRipple={true}
                                              title={
                                                tabData?.keysTitle
                                                  ?.approvalPendingByOthers ||
                                                analyticsKeyTabs.assignedToOthers
                                              }
                                              size="small"
                                              variant="text"
                                              className="analytics-btn"
                                              onClick={() => {
                                                handleTabClick(
                                                  tabData.filter,
                                                  tabData?.keys
                                                    ?.completedByOther ||
                                                    "assignedToOthers",
                                                  analyticsData[tabData.filter]
                                                );
                                              }}
                                            >
                                              <span>
                                                {(analyticsData[
                                                  tabData.filter
                                                ] &&
                                                  analyticsData[tabData.filter][
                                                    tabData?.keys
                                                      ?.completedByOther ||
                                                      "assignedToOthers"
                                                  ]) ||
                                                  0}
                                              </span>
                                            </Button>
                                          </div>
                                          <div className="col-3 text-center">
                                            {!tabData?.isNotShowNotAssigned && (
                                              <Button
                                                disableTouchRipple={true}
                                                title={
                                                  analyticsKeyTabs.notAssigned
                                                }
                                                size="small"
                                                variant="text"
                                                className="analytics-btn"
                                                onClick={() => {
                                                  handleTabClick(
                                                    tabData.filter,
                                                    "notAssigned",
                                                    analyticsData[
                                                      tabData.filter
                                                    ]
                                                  );
                                                }}
                                              >
                                                <span>
                                                  {analyticsData[tabData.filter]
                                                    ?.notAssigned || 0}
                                                </span>
                                              </Button>
                                            )}
                                          </div>
                                          <div className="col-3 text-center">
                                            <Button
                                              disableTouchRipple={true}
                                              title={analyticsKeyTabs.cc}
                                              size="small"
                                              variant="text"
                                              className="analytics-btn"
                                              onClick={() => {
                                                handleTabClick(
                                                  tabData.filter,
                                                  "cc",
                                                  analyticsData[tabData.filter]
                                                );
                                              }}
                                            >
                                              <span>
                                                {analyticsData[tabData.filter]
                                                  ?.ccAssigned || 0}
                                              </span>
                                            </Button>
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    <div
                                      className="col-1 d-flex justify-content-end"
                                      style={{ textAlign: "center" }}
                                    >
                                      <div
                                        className="count-container cursor-pointer"
                                        style={{
                                          backgroundColor: tabData.countColor,
                                        }}
                                        title={
                                          (analyticsData[tabData.filter]
                                            ?.count || 0) +
                                          (analyticsData[tabData.filter]
                                            ?.deactived_request_count || 0)
                                        }
                                        onClick={() => {
                                          handleTabClick(
                                            tabData.filter,
                                            "all",
                                            analyticsData[tabData.filter]
                                          );
                                        }}
                                      >
                                        <div>
                                          {(analyticsData[tabData.filter]
                                            ?.count || 0) +
                                            (analyticsData[tabData.filter]
                                              ?.deactived_request_count || 0)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* </div> */}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {userDetails.UserType === 3 && (
                          <div className="sidebar-overview-grid-new shadow bg-white rounded">
                            <div className="take-action-title">
                              Team Performance
                            </div>
                            <div className="btn-data-new">
                              {teamStats &&
                                teamStats.length > 0 &&
                                teamStats.length <= 4 &&
                                teamStats.map((item, index) =>
                                  _renderteamStats(
                                    item,
                                    index,
                                    teamStats.length
                                  )
                                )}
                              {!showMoreLessTM &&
                                teamStats &&
                                teamStats.length > 0 &&
                                teamStats.length > 4 &&
                                teamStats
                                  .slice(0, 4)
                                  .map((item, index) =>
                                    _renderteamStats(
                                      item,
                                      index,
                                      teamStats.length
                                    )
                                  )}
                              {showMoreLessTM &&
                                teamStats &&
                                teamStats.length > 0 &&
                                teamStats.length > 4 &&
                                teamStats.map((item, index) =>
                                  _renderteamStats(
                                    item,
                                    index,
                                    teamStats.length
                                  )
                                )}

                              {!showMoreLessTM &&
                                teamStats &&
                                teamStats.length > 4 && (
                                  <div
                                    style={{ textAlign: "left" }}
                                    onClick={() =>
                                      setShowMoreLessTM(!showMoreLessTM)
                                    }
                                    className="view-more-task"
                                  >
                                    view all members
                                  </div>
                                )}
                              {showMoreLessTM &&
                                teamStats &&
                                teamStats.length > 4 && (
                                  <div
                                    style={{ textAlign: "left" }}
                                    onClick={() =>
                                      setShowMoreLessTM(!showMoreLessTM)
                                    }
                                    className="view-more-task"
                                  >
                                    Show less
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}{" "}
                {/* Sidebar Open Condition End Here  */}
                {/* Company List View */}
                {/* {userDetails.UserType === 3 && (
                  <>
                    <div
                      className={
                        companyViewData &&
                        companyViewData.length > 0 &&
                        companyViewData.length === 2
                          ? "two-btn mainBoxShado"
                          : "two-btn"
                      }
                    >
                      {dashboardStats &&
                        dashboardStats.length > 0 &&
                        dashboardStats.length <= 5 &&
                        dashboardStats.map((item, index) =>
                          _renderCompanyView(item, index, dashboardStats.length)
                        )}
                      {!showMoreLess &&
                        dashboardStats &&
                        dashboardStats.length > 0 &&
                        dashboardStats.length > 5 &&
                        dashboardStats
                          .slice(0, 5)
                          .map((item, index) =>
                            _renderCompanyView(
                              item,
                              index,
                              dashboardStats.length
                            )
                          )}
                      {showMoreLess &&
                        dashboardStats &&
                        dashboardStats.length > 0 &&
                        dashboardStats.length > 5 &&
                        dashboardStats.map((item, index) =>
                          _renderCompanyView(item, index, dashboardStats.length)
                        )}
                    </div>

                    {!showMoreLess &&
                      dashboardStats &&
                      dashboardStats.length > 5 && (
                        <div
                          onClick={() => setShowMoreLess(!showMoreLess)}
                          className="view-more-task"
                        >
                          view more
                        </div>
                      )}
                    {showMoreLess &&
                      dashboardStats &&
                      dashboardStats.length > 5 && (
                        <div
                          onClick={() => setShowMoreLess(!showMoreLess)}
                          className="view-more-task"
                        >
                          view less
                        </div>
                      )}
                    <div className="two-btn-new"></div>

                    <div className="two-btn-new"></div>
                  </>
                )} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const DashboardTabsMobile = () => {
  const currentDashboardViewMobile = useSelector(
    (state) => state?.adminMenu?.currentDashboardViewMobile
  );
  const dispatch = useDispatch();
  return (
    <div className="d-block d-md-none mb-2">
      <span
        className="bold-title-sidebar mr-4"
        onClick={() =>
          dispatch(adminMenuActions.setCurrentDashboardViewMobile("overview"))
        }
      >
        <span
          style={{
            color:
              currentDashboardViewMobile === "overview" ? "#000000" : "#9999",
          }}
        >
          Overview
        </span>
      </span>
      <span
        className="bold-title-sidebar cursor-pointer"
        onClick={() =>
          dispatch(adminMenuActions.setCurrentDashboardViewMobile("tasks"))
        }
      >
        <span
          style={{
            color: currentDashboardViewMobile === "tasks" ? "#000000" : "#9999",
          }}
        >
          Tasks
        </span>
      </span>
    </div>
  );
};

export default QuickOverView;
