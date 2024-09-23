import React, { useEffect, useRef, useState } from "react";
import MobileLeftSidebar from "../../OnBoarding/SubModules/DashBoardCO/components/MobileLeftSidebar";
import closeIcon from "../../../assets/Icons/closeIcon.png";
import HistoryFilterForm from "../HistoryFilterForm/index";
import download from "../../../assets/Icons/download.png";
import sideBarlogo from "../../../assets/Icons/sideBarlogo.png";
import togglemobile from "../../../assets/Icons/togglemobile.png";
import threeDots from "../../../assets/Icons/threeDots.PNG";
import { MdClose, MdFilterListAlt } from "react-icons/md";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import { MdSearch } from "react-icons/md";
import moment from "moment";
import {
  clearState,
  getCompanyList,
  getHistoryList,
  setSuccess,
} from "../redux/actions";
import { onFileDownload } from "../../../CommonModules/helpers/file.helper";
import { useHistory, withRouter } from "react-router";
import NoResultFound from "../../../CommonModules/sharedComponents/NoResultFound";
import TaskStatusBox from "../../../CommonModules/sharedComponents/TaskStatusBox";
// import Suggestions from "SharedComponents/Suggestions";
// import { Button } from "@mui/material";
import { fetchTaskDetailRequest } from "SharedComponents/Dashboard/redux/actions";
import { IconButton } from "@mui/material";
import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import Container from "SharedComponents/Containers";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import styles from "Components/Notifications/styles.module.scss";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
import Dots from "CommonModules/sharedComponents/Loader/Dots";

const HistoryList = (props) => {
  // state for mobile design
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isShowMobileOptionsId, setIsShowMobileOptionsId] = useState(null); // For showing options on single row
  const [isShowMobileRowData, setIsShowMobileRowData] = useState(false); // For showing Row Data
  const [mobileRowData, setMobileRowData] = useState({}); // Single Row data
  const sideBarParent = useRef(null);
  const sideBarChild = useRef(null);
  const [showHB, setShowHBMenu] = useState(false); // For showing Hamburger Menu
  const [isShowMobileFilter, setIsShowMobileFilter] = useState(false);
  // state for desktop design
  const [isShowFilter, setIsShowFilter] = useState(false); // Show filter popup
  const state = useSelector((state) => state); // state
  const dispatch = useDispatch(); // dispatch
  const history = useHistory();
  const mainContainer = useRef();
  const tableScrollableHeight = useScrollableHeight(mainContainer, 96, [
    state?.HistoryReducer?.HistoryList,
    isShowFilter,
  ]);
  const isLoading = state?.HistoryReducer?.isLoading;

  const debouncedSearchValue = useDebounce(searchValue, 500);
  // const [isOpen, setIsOpen] = useState(false);

  const onHBMenu = () => {
    const drawerParent = sideBarParent;
    const drawerChild = sideBarChild;
    if (drawerParent) {
      drawerParent.current.classList.add("overlay");
      drawerChild.current.style.left = "0%";
    }
  };

  const closeMobileSidebar = () => {
    const drawerParent = document.getElementById("sideBarParent");
    const drawerChild = document.getElementById("sideBarChild");
    if (drawerParent) {
      drawerParent.classList.remove("overlay");
      drawerChild.style.left = "-100%";
    }
    setShowHBMenu(false);
  };

  const getSelectTaskDetails = (task) => {
    dispatch(fetchTaskDetailRequest(task.task_name));
    history.push({
      pathname: "/dashboard-view",
      state: { handleBack: true, from: "history", taskId: task.task_name },
    });
  };

  useEffect(() => {
    dispatch(clearState());
    dispatch(getCompanyList());
    dispatch(
      getHistoryList({
        filters: {
          from_date: null,
          to_date: null,
          company: [],
          license: [],
          searchValue: "",
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsShowMobileFilter(false);

    dispatch(setSuccess(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.HistoryReducer.isSuccess]);

  const getNameInitials = (name) => {
    if (name !== undefined) {
      let initials = "";
      initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");
      return initials.toUpperCase();
    }
  };

  useEffect(() => {
    dispatch(
      getHistoryList({
        filters: {
          from_date: null,
          to_date: null,
          company: [],
          license: [],
        },
        search: searchValue,
      })
    );
  }, [debouncedSearchValue]);

  const closeSearch = () => {
    setSearchValue("");
  };

  return (
    <>
      <div
        className={`filter-popup ${isShowFilter && "popup-open"}`}
        style={{
          boxShadow: isShowFilter
            ? "1px 1px 9999px 9999px rgba(0,0,0,0.7)"
            : "none",
        }}
      >
        <div className="container" style={{ width: "364px", height: "auto" }}>
          <div className="popup-header d-flex align-items-center mt-5 justify-content-between">
            <h3 className="mb-0">Filters</h3>
            <IconButton
              disableTouchRipple={true}
              onClick={() => {
                // dispatch(
                //   getHistoryList({
                //     filters: {
                //       from_date: null,
                //       to_date: null,
                //       company: [],
                //       license: [],
                //     },
                //   })
                // );
                setIsShowFilter(!isShowFilter);
              }}
            >
              <MdClose />
            </IconButton>
          </div>
          <div className="filter-wrapper-desktop px-2">
            <HistoryFilterForm
              setIsShowFilter={setIsShowFilter}
              isShowFilter={isShowFilter}
            />
          </div>
        </div>
      </div>
      <Container variant="main">
        <Container variant="container">
          <Container variant="content" isShowAddTaskButton>
            {isMobile && (
              <div id="sideBarParent" className="" ref={sideBarParent}>
                <div
                  id="sideBarChild"
                  className="leftSideBarFixed"
                  ref={sideBarChild}
                >
                  <MobileLeftSidebar
                    className="d-block d-lg-none"
                    close={() => closeMobileSidebar()}
                  />
                </div>
              </div>
            )}
            {isMobile ? (
              <div className="history-container-mobile">
                {/* Filter pop-up for mobile */}
                <div
                  className={`filter-popup-mobile ${
                    isShowMobileFilter && "d-block"
                  } d-lg-none`}
                >
                  <div className="filter-popup-mobile--container">
                    <img
                      src={closeIcon}
                      alt="close-icon"
                      className="close--filter-popup-mobile"
                      onClick={() => setIsShowMobileFilter(!isShowMobileFilter)}
                    />
                    <div className="filter-popup-mobile--wrapper">
                      <h2 style={{ marginBottom: "3rem" }}>Fiters</h2>
                      <div className="filter-wrapper-mobile">
                        <HistoryFilterForm setIsShowFilter={setIsShowFilter} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* View More Data pop up */}
                {isShowMobileRowData && isShowMobileOptionsId && (
                  <div className="view-more-data--popup">
                    <div className="view-more-data--container">
                      <h3 style={{ width: "80%" }}>{mobileRowData.TaskName}</h3>
                      <img
                        className="close--data-popup"
                        src={closeIcon}
                        alt="close-icon"
                        onClick={() => {
                          setIsShowMobileOptionsId(null); // Resetting Mobile Options Id
                          setMobileRowData({}); // Resetting Row Data
                          setIsShowMobileRowData(!isShowMobileRowData); // Toggling isShowMobileRowData
                        }}
                      />
                      <div className="data-field">
                        <span className="task-detail">COMPANY</span>
                        <p>{mobileRowData?.company_name}</p>
                      </div>
                      <div className="data-field">
                        <span className="task-detail">EXECUTOR</span>
                        <p className="d-flex align-items-center">
                          {mobileRowData?.assign_to_name ||
                          mobileRowData?.assign_to ? (
                            <>
                              <span className="circle-dp">
                                {mobileRowData?.assign_to_name &&
                                  getNameInitials(
                                    mobileRowData?.assign_to_name
                                  )}
                              </span>
                              <span>
                                {mobileRowData?.assign_to_name ||
                                  mobileRowData?.assign_to}
                              </span>
                            </>
                          ) : (
                            "-"
                          )}
                        </p>
                      </div>
                      <div className="data-field">
                        <span className="task-detail">APPROVER</span>
                        <p className="d-flex align-items-center">
                          {mobileRowData?.approver_name ||
                          mobileRowData?.approver ? (
                            <>
                              <span className="circle-dp">
                                {mobileRowData?.approver_name &&
                                  getNameInitials(mobileRowData?.approver_name)}
                              </span>
                              <span>
                                {mobileRowData?.approver_name ||
                                  mobileRowData?.approver}
                              </span>
                            </>
                          ) : (
                            "-"
                          )}
                        </p>
                      </div>
                      <div className="data-field">
                        <span className="task-detail">DUE DATE</span>
                        <p>
                          {moment(mobileRowData.deadline_date).format(
                            "DD MMM YYYY"
                          )}
                        </p>
                      </div>
                      <div className="data-field">
                        {mobileRowData?.file_details &&
                        mobileRowData?.file_details.length > 0 ? (
                          <>
                            <a
                              href={`data:application/${
                                mobileRowData?.file_details &&
                                mobileRowData?.file_details[0].file_name
                                  .split(".")
                                  .pop()
                              };base64,${
                                mobileRowData?.file_details &&
                                mobileRowData?.file_details[0].encoded_string
                              }`}
                              download={
                                mobileRowData?.file_details &&
                                mobileRowData?.file_details[0].file_name
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img src={download} alt="download" />
                            </a>
                            <span
                              className="mb-0 ml-2"
                              style={{
                                color: "#6c5dd3",
                                fontWeight: "600",
                                fontSize: "1rem",
                              }}
                            >
                              Download File
                            </span>
                          </>
                        ) : (
                          <span>N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* View more data ends here */}
                <div className="d-block mobile-head d-md-none">
                  {showHB === false && (
                    <div className="d-flex justify-content-between">
                      <div
                        className=""
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          onHBMenu();
                        }}
                      >
                        <img src={togglemobile} alt="toggle mobile" />
                      </div>
                      <div className="pr-0">
                        {" "}
                        <img
                          className="mobile-logo"
                          src={sideBarlogo}
                          alt="sideBarlogo"
                        />{" "}
                      </div>
                    </div>
                  )}
                  <div className=" table-header-mobile d-flex justify-content-between align-items-center mt-3">
                    <p className="main-title mb-0">Compliance History</p>
                    {/* <img
                src={filter}
                alt="filter"
                onClick={() => setIsShowMobileFilter(!isShowMobileFilter)}
              /> */}
                    <p className="main-title mb-0">
                      <MdFilterListAlt
                        onClick={() =>
                          setIsShowMobileFilter(!isShowMobileFilter)
                        }
                        color={isShowFilter ? "#666666" : "#7a73ff"}
                      />
                    </p>
                  </div>
                  <div className="history-list-scroll-mobile">
                    {state.HistoryReducer.historyList.length !== 0 ? (
                      <table className="table table_legenda mt-3">
                        <thead>
                          <tr>
                            <th>Complete on</th>
                            <th>status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.HistoryReducer.historyList.map((list) => (
                            <tr>
                              <td className="task-name td-mobile">
                                {list.subject}
                                <br />
                                <span className="task-detail">
                                  {moment(list.status_date).format(
                                    "DD MMM YYYY"
                                  )}
                                </span>
                              </td>
                              <td className="d-flex justify-content-between td-mobile">
                                {/* <button
                            className={
                              list.Status === "Pending"
                                ? list.Status === "Delayed"
                                  ? "delayed"
                                  : "on-time"
                                : "pending"
                            }
                          >
                            {list.status}
                          </button> */}
                                <TaskStatusBox status={list.status} />
                                <div className="data-options">
                                  <img
                                    src={threeDots}
                                    alt="options"
                                    onClick={() => {
                                      if (
                                        isShowMobileOptionsId === list.task_name
                                      ) {
                                        setIsShowMobileOptionsId(null);
                                        setMobileRowData({});
                                        return;
                                      }
                                      setIsShowMobileOptionsId(list.task_name);
                                      setMobileRowData(list);
                                    }}
                                  />
                                  {isShowMobileOptionsId ===
                                    list?.task_name && (
                                    <div className="more-options">
                                      {/* View More Logic Here */}
                                      <span
                                        onClick={() => {
                                          setIsShowMobileRowData(
                                            !isShowMobileRowData
                                          );
                                        }}
                                      >
                                        View More
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <NoResultFound text="No Result Found" />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="row no-gutters">
                  <div className="history-header p-0">
                    <h2 className="header-title">Compliance History&nbsp;</h2>
                    <div className="d-flex">
                      <div
                        className={`${
                          showSearch ? styles.searchInputContainer : ""
                        } d-none d-md-flex`}
                      >
                        {!showSearch && (
                          <IconButton onClick={() => setShowSearch(true)}>
                            <MdSearch className={styles.searchIcon} />
                          </IconButton>
                        )}

                        {showSearch && (
                          <>
                            <input
                              className={styles.searchInput}
                              type="text"
                              value={searchValue}
                              onChange={(event) =>
                                setSearchValue(event.target.value)
                              }
                              autoFocus
                            />
                            <MdSearch className={styles.searchIcon} />
                            <IconButton
                              disableTouchRipple={true}
                              onClick={() => {
                                setShowSearch(false);
                                closeSearch();
                              }}
                              className={styles.closeSearchIcon}
                            >
                              <MdClose />
                            </IconButton>
                          </>
                        )}
                      </div>
                      <IconButton
                        disableTouchRipple={true}
                        onClick={() => setIsShowFilter(!isShowMobileFilter)}
                      >
                        <MdFilterListAlt
                          className="main-title"
                          color={
                            state?.HistoryReducer?.from?.length === 3 ||
                            state?.HistoryReducer?.to?.length === 3 ||
                            state.HistoryReducer.companyList
                              .filter((company) => company.selected === true)
                              .map((company) => company.company_docname)
                              .length > 0 ||
                            state.HistoryReducer.licenseList
                              .filter((license) => license.selected === true)
                              .map((license) => license.LicenseCode).length > 0
                              ? "#666666"
                              : "#7a73ff"
                          }
                        />
                      </IconButton>
                    </div>
                  </div>
                  <div
                    ref={mainContainer}
                    // style={{
                    //   maxHeight: tableScrollableHeight + "px",
                    //   overflowY: "auto",
                    // }}
                    style={{ width: "100%" }}
                  >
                    <div
                      className="scroll-personal-grid d-md-block d-sm-block table-responsive mt-4 p-0"
                      style={{
                        borderRadius: "10px",
                        height: tableScrollableHeight,
                        overflow: "auto",
                      }}
                    >
                      {!isLoading &&
                      state?.HistoryReducer?.historyList?.length !== 0 ? (
                        <table className="table co-company-details-tbl table_legenda">
                          <thead>
                            <tr className="compliance__history__header___styling">
                              <th clscope="col">Complete On</th>
                              <th scope="col">Task Name</th>
                              <th scope="col">Company</th>
                              <th>Assign To</th>
                              <th>Approver</th>
                              <th>Due Date</th>
                              <th>Status</th>
                              <th style={{ textAlign: "center" }}>Download</th>
                            </tr>
                          </thead>
                          <tbody>
                            {state.HistoryReducer.historyList.map((list) => {
                              return (
                                <tr>
                                  <td className="task-detail">
                                    {moment(list.status_date).format(
                                      "DD MMM YYYY"
                                    )}
                                  </td>
                                  <td
                                    title={list.subject}
                                    className="task-name truncate cursor-pointer"
                                    onClick={() => getSelectTaskDetails(list)}
                                  >
                                    {list.subject}
                                  </td>
                                  <td className="task-detail truncate">
                                    {list.company_name}
                                  </td>
                                  <td>
                                    {" "}
                                    <div
                                      title={list.assign_to || ""}
                                      className="holding-list-bold-title-background"
                                    >
                                      {list?.assign_to_name ? (
                                        <>
                                          <span className="circle-dp">
                                            {list?.assign_to_name &&
                                              getInitialName(
                                                list.assign_to_name
                                              )}
                                          </span>{" "}
                                          <div className="nameCirle truncate">
                                            {list.assign_to_name ||
                                              list.assign_to}{" "}
                                          </div>
                                        </>
                                      ) : (
                                        <div className="nameCirle text-center">
                                          -
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    {" "}
                                    <div
                                      title={list.approver || ""}
                                      className="holding-list-bold-title-background"
                                    >
                                      {list?.approver_name ? (
                                        <>
                                          <span className="circle-dp">
                                            {list?.approver_name &&
                                              getInitialName(
                                                list.approver_name
                                              )}
                                          </span>{" "}
                                          <div className="nameCirle truncate">
                                            {list.approver_name ||
                                              list.approver}{" "}
                                          </div>
                                        </>
                                      ) : (
                                        <div className="nameCirle">-</div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="task-detail">
                                    {moment(list?.deadline_date).format(
                                      "DD MMM YYYY"
                                    )}
                                  </td>
                                  <td>
                                    {/* <button
                                className={
                                  list.status === "PENDING"
                                    ? "pending"
                                    : list.status === "ON TIME"
                                    ? "on-time"
                                    : "delayed"
                                }
                              >
                                {list.status}
                              </button> */}
                                    <TaskStatusBox status={list.status} />
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    {list?.file_details &&
                                    list?.file_details.length > 0 ? (
                                      <img
                                        src={download}
                                        alt="download"
                                        onClick={() => {
                                          list?.file_details?.forEach(
                                            (file) => {
                                              onFileDownload(file.file_id);
                                            }
                                          );
                                        }}
                                      />
                                    ) : (
                                      <span>N/A</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : !isLoading &&
                        state.HistoryReducer.historyList?.length === 0 ? (
                        <NoResultFound text="No Result Found" />
                      ) : (
                        <Dots />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Container>
        </Container>
      </Container>
    </>
  );
};

export default withRouter(HistoryList);
