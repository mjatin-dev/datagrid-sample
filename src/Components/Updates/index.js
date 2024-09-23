/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

import {
  Route,
  Switch,
  withRouter,
  useRouteMatch,
  useHistory,
} from "react-router";
import Constants from "SharedComponents/Constants";
import NewRegulationsQuiz from "Components/NewRegulationsQuiz";
import { updateservice } from "SharedComponents/Services/updates.service";
import DrawerView from "SharedComponents/DrawerView";
import "./styles.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { MdFilterListAlt } from "react-icons/md";
import styles from "Components/Notifications/styles.module.scss";

import ViewHeader from "SharedComponents/ViewHeader";
import { toast } from "react-toastify";
import SmallDrawer from "SharedComponents/SmallDrawer";
import FiltersView, { isFilterApplied } from "./FiltersView";

import NoResultFound from "CommonModules/sharedComponents/NoResultFound";
import SearchBadges from "SharedComponents/SearchBadges";
import SearchView from "SharedComponents/SearchView";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import SendEmail from "SharedComponents/SendEmail";
import EmailLog from "SharedComponents/EmailLog";
import { IoMailOutline } from "react-icons/io5";
import { HiOutlineInboxIn } from "react-icons/hi";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdSearch } from "react-icons/md";
import Container from "SharedComponents/Containers";
import { IconButton } from "@mui/material";
import { getHighlightedTextBySearchQuery } from "CommonModules/helpers/string.helpers";
import { actions as adminMenuActions } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import { getUsersListRequest } from "Components/ProjectManagement/redux/actions";

const Updates = React.memo((props) => {
  const { path } = useRouteMatch();
  const dataContainerRef = useRef();
  const [isUpdateDetailsLoading, setIsUpdateDetailsLoading] = useState(false);
  const [isAllInputFilled, setIsAllInputFilled] = useState(false);
  const [templateList, setTemplateList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const history = useHistory();
  const [state, setState] = useState({
    section: "updateSec",
    selectedIds: [],
    isLoading: false,
    isFilters: false,
    isSearch: false,
    limit: Constants.limit,
    offset: Constants.offset,
    updates: [],
    filters: [],
    totalUpdateCount: 0,
    hasMore: true,
    isShowMobileFilter: false,
    filter: {
      value: Constants.notificationTypes[0].value,
      isChanged: false,
    },
    filterDrawer: {
      listOfIndustries: "",
      listOfIssuers: "",
      listOfTopic: "",
    },
    filterData: [],
    searchData: [],
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [updateDetails, setUpdateDetails] = useState([]);
  const scrollableHeight = useScrollableHeight(dataContainerRef, 64, [state]);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const userDetails = useSelector(
    (state) => state && state.auth && state.auth.loginInfo
  );
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    issuer: "",
    industry: "",
    topic: "",
    fromDate: "",
    toDate: "",
  });
  const onNext = () => {
    setState({
      ...state,
      offset: state?.offset + 1,
      filter: { ...state?.filter, isChanged: false },
    });
  };

  const fetchUpdates = async (currentOffset, isShowMobileFilter) => {
    try {
      setState({ ...state, isLoading: true });

      const { limit, offset } = state;
      const payload = {
        limit: limit,
        offset: currentOffset !== undefined ? currentOffset : offset,
        issuer: filters.issuer !== "" ? filters.issuer.split(",") : undefined,
        industry:
          filters.industry !== "" ? filters.industry.split(",") : undefined,
        topic: filters.topic !== "" ? filters.topic.split(",") : undefined,
        toDate: filters.toDate
          ? moment(filters.toDate.join("-"), "DD-M-YYYY").format(
              "YYYY-MM-DD"
            ) || undefined
          : undefined,
        fromDate: filters.fromDate
          ? moment(filters.fromDate.join("-"), "DD-M-YYYY").format(
              "YYYY-MM-DD"
            ) || undefined
          : undefined,
        ...(debouncedSearchValue && {
          search: debouncedSearchValue,
        }),
      };
      const response = await updateservice.post(payload);

      if (response) {
        const circulars = [
          ...(((currentOffset !== undefined ? currentOffset : offset) > 0 &&
            state?.updates?.length > 0 &&
            state?.updates) ||
            []),
          ...response.circular.map((item) => ({ ...item, isChecked: false })),
        ];
        setState({
          ...state,
          isLoading: false,
          updates: circulars,
          hasMore:
            circulars?.length >= response?.circular_total_count ? false : true,
          ...(isShowMobileFilter !== undefined ? { isShowMobileFilter } : {}),
          ...(currentOffset !== undefined ? { offset: currentOffset } : {}),
        });
      } else {
        toast.error("No data Found");
        setState({
          ...state,
          isLoading: false,
          ...(isShowMobileFilter !== undefined ? { isShowMobileFilter } : {}),
        });
      }
    } catch (error) {
      toast.error(error);
      setState({
        ...state,
        isLoading: false,
        ...(isShowMobileFilter !== undefined ? { isShowMobileFilter } : {}),
      });
    }
  };
  const fetchUpdateDetails = async (name) => {
    if (name) {
      try {
        setIsUpdateDetailsLoading(true);
        const response = await updateservice.getDetails(name);
        if (response) {
          const templateList = await updateservice.getTemplateList(name);
          if (templateList?.template_lst?.length > 0) {
            const updateTemplateList = templateList.template_lst.map(
              (item) => ({
                value: item,
                label: item,
              })
            );
            setTemplateList(updateTemplateList);
          } else {
            setTemplateList([]);
          }
          setIsDrawerOpen(true);
          setUpdateDetails(response);
          setIsUpdateDetailsLoading(false);
        } else {
          toast.error("No data Found");
          setIsUpdateDetailsLoading(false);
        }
      } catch (error) {
        setIsUpdateDetailsLoading(false);
        toast.error(error);
      }
    }
  };

  const fetchUpdateFilter = async () => {
    try {
      const response = await updateservice.getFilter();
      if (response) {
        setState({
          ...state,
          filterData: response,
          isShowMobileFilter: true,
        });
      } else {
        toast.error("No data Found");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const closeSearch = () => {
    setSearchValue("");
    setState({
      ...state,
      updates: searchValue ? [] : state.updates,
      isSearch: false,
    });
  };

  const openDrawer = (name) => {
    fetchUpdateDetails(name);
  };

  const changeShowUpdateDetail = (event, redirect = true) => {
    setIsDrawerOpen(!isDrawerOpen);
    if (history?.location?.state?.handleBack && redirect) {
      history.push(history.location?.state?.fromPathName || "/dashboard-view", {
        from: "updates",
      });
      dispatch(
        adminMenuActions.setCurrentMenu(
          history?.location?.state?.tabName || "dashboard"
        )
      );
    }
  };

  const onSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
  };

  const closeFilterDrawer = async () => {
    setState({
      ...state,
      isShowMobileFilter: false,
      offset: 0,
    });
  };

  useEffect(() => {
    if (state?.offset > 0 && !debouncedSearchValue) fetchUpdates();
    else if (
      !debouncedSearchValue ||
      (debouncedSearchValue && state?.offset > 0)
    ) {
      fetchUpdates();
    }
  }, [debouncedSearchValue, state.offset]);

  useEffect(() => {
    if (dataContainerRef.current) {
      dataContainerRef.current.scrollTop = 0;
    }
    if (debouncedSearchValue) {
      fetchUpdates(0);
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    fetchUpdates();
    dispatch(getUsersListRequest());
    if (props?.location?.state?.circular_id) {
      // setTimeout(() => {
      openDrawer(props.location.state.circular_id);
      // }, 2000);
    }
  }, []);

  useEffect(() => {
    if (dataContainerRef.current) {
      dataContainerRef.current.scrollTop = 0;
    }
    if (isFilterApplied(filters) && isAllInputFilled && state.offset === 0) {
      fetchUpdates(0);
    } else if (!isFilterApplied(filters)) {
      fetchUpdates(0);
    }
  }, [filters, isAllInputFilled]);

  const handleEmailClose = () => {
    setState({
      ...state,
      section: "updateSec",
      selectedIds: [],
      updates: [...(state.updates || [])].map((item) => {
        item.isChecked = false;
        return item;
      }),
    });
  };

  const handleChange = (index) => {
    const tempArray = state.updates;
    tempArray[index].isChecked = !tempArray[index].isChecked;

    const checkedValues = tempArray.filter((item) => item.isChecked);
    const circulars = checkedValues.map((item) => item.name);

    if (checkedValues.length < 13) {
      setState({ ...state, updates: tempArray, selectedIds: circulars });
    } else {
      toast.error("Please select only 12 circulars at one time");
    }
  };

  const sendEmail = () => {
    if (state.selectedIds.length === 0)
      toast.error("Please select at least one update to send a email.");
    else setState({ ...state, section: "sendEmail" });
  };

  const getLogs = () => setState({ ...state, section: "emailLog" });

  const selectAll = (event) => {
    const tempArray = [...(state.updates || [])];
    const newArray = tempArray.map((item, index) => ({
      ...item,
      isChecked: index <= 11 && event.target.checked,
    }));

    const checkedValues = newArray.filter((item) => item.isChecked);
    const circulars = checkedValues.map((item) => item.name);
    if (checkedValues.length < 13) {
      setState({ ...state, updates: newArray, selectedIds: circulars });
    } else {
      toast.error("Please select only 12 circulars at one time");
    }
  };

  const handleClearFilters = () => {
    setFilters({
      issuer: "",
      industry: "",
      topic: "",
      fromDate: "",
      toDate: "",
    });
    closeFilterDrawer();
  };

  const handleSendCircularFromDrawer = () => {
    // const circularIndex = [...(state?.updates || [])].findIndex(
    //   (item) => item.name === updateDetails.name
    // );
    setState({
      ...state,
      section: "sendEmail",
      selectedIds: [updateDetails.name],
    });
    // console.log({ circularIndex, updates: state?.updates });
  };

  useEffect(() => {
    const perfEntries = window.performance.getEntriesByType("navigation");

    console.log(
      "check condition",
      (perfEntries.length && perfEntries[0].type === "reload", perfEntries)
    );
    fetchUpdateDetails(history?.location?.state?.circular_no_from_history);
  }, [history?.location?.state?.circular_no_from_history]);

  return (
    <div style={{ width: "100%" }}>
      <div className={`d-none d-md-block w-100`}>
        <DrawerView
          isShowUpdatesDetail={isDrawerOpen}
          changeShowUpdateDetail={changeShowUpdateDetail}
          newUpdateDetail={updateDetails}
          handleSendCircularFromDrawer={handleSendCircularFromDrawer}
          templateList={templateList}
        />
      </div>
      <Switch>
        <Route exact path={path + "/quiz"}>
          <NewRegulationsQuiz key="new-regulations-quiz" />
        </Route>
        {state.section === "updateSec" && (
          <>
            <div className={`d-none d-md-block w-100 `}>
              <SmallDrawer
                isShowMobileFilter={state.isShowMobileFilter}
                changeShowUpdateDetail={() => {
                  handleClearFilters();
                }}
                newUpdateDetail={state?.updateDetails}
              >
                <FiltersView
                  handleClearFilter={handleClearFilters}
                  filterData={state.filterData}
                  filters={filters}
                  setFilters={setFilters}
                  getFilteredData={closeFilterDrawer}
                  isAllInputFilled={isAllInputFilled}
                  setIsAllInputFilled={setIsAllInputFilled}
                />
              </SmallDrawer>
            </div>
            <Container variant="main">
              <Container variant="container">
                <Container variant="content" isShowAddTaskButton>
                  <div className="updateHeader">
                    <div className="updateTitle">
                      <ViewHeader title="Updates" />
                    </div>
                    <div className="d-flex align-items-center mr-0">
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
                              onChange={onSearch}
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
                        onClick={fetchUpdateFilter}
                      >
                        <MdFilterListAlt
                          color={
                            filters.issuer !== "" ||
                            filters.industry !== "" ||
                            filters.topic !== "" ||
                            filters.fromDate !== "" ||
                            filters.toDate !== ""
                              ? "#666666"
                              : "#7a73ff"
                          }
                        />
                      </IconButton>
                    </div>
                  </div>

                  {state.isSearch && searchValue?.length !== 0 && (
                    <SearchView />
                  )}

                  <div className="checkbox-buttons">
                    {userDetails?.UserType === 3 && (
                      <>
                        <div>
                          {" "}
                          <input
                            className="new-regulation-checkboxs cursor-pointer"
                            type="checkbox"
                            id="selectAllCheckbox"
                            onClick={selectAll}
                            checked={
                              state?.updates?.length > 0 &&
                              ([...(state?.updates || [])]?.filter(
                                (item) => item.isChecked
                              )?.length === state?.updates?.length ||
                                [...(state?.updates || [])]?.filter(
                                  (item) => item.isChecked
                                )?.length === 12)
                            }
                          />
                          <label
                            htmlFor="selectAllCheckbox"
                            className="cursor-pointer"
                          >
                            Select All
                          </label>
                        </div>

                        <div className="emailBtns">
                          <button
                            className="sendEmailBtn"
                            onClick={sendEmail}
                            disabled={
                              state.selectedIds.length === 0 ? true : false
                            }
                            style={{
                              opacity:
                                state.selectedIds.length === 0 ? "0.3" : "",
                            }}
                          >
                            <IoMailOutline
                              size="20px"
                              color="#ffffff"
                              style={{
                                marginLeft: "15px",
                                marginRight: "10px",
                              }}
                            />
                            Send Email
                          </button>
                          <button className="EmailLogBtn" onClick={getLogs}>
                            <HiOutlineInboxIn
                              size="20px"
                              color="#ffffff"
                              style={{
                                marginLeft: "15px",
                                marginRight: "10px",
                              }}
                            />
                            Email Log
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {(filters.issuer !== "" ||
                    filters.industry !== "" ||
                    filters.topic !== "" ||
                    filters.fromDate !== "" ||
                    filters.toDate !== "") && (
                    <div className="new-regulations-list">
                      <SearchBadges
                        filters={filters}
                        setFilters={setFilters}
                        state={state}
                        setState={setState}
                        fetchUpdates={fetchUpdates}
                        isAllInputFilled={isAllInputFilled}
                        handleClearFilters={handleClearFilters}
                      />
                    </div>
                  )}

                  <div
                    id="scrollableList"
                    ref={dataContainerRef}
                    className="overflow-auto mt-4"
                    style={{ height: scrollableHeight }}
                  >
                    {(!state?.isLoading || !isUpdateDetailsLoading) &&
                    state?.updates?.length > 0 ? (
                      <InfiniteScroll
                        dataLength={state.updates?.length}
                        next={onNext}
                        hasMore={state?.hasMore}
                        loader={<Dots />}
                        className="scrollable_div"
                        scrollThreshold={0.9}
                        scrollableTarget="scrollableList"
                      >
                        {state.updates?.map((item, index) => {
                          return (
                            <UpdatesListItem
                              key={`${item.name}-${index}`}
                              item={item}
                              index={index}
                              userType={userDetails?.UserType}
                              openDrawer={openDrawer}
                              handleChange={handleChange}
                              isShowCheckboxInput
                              searchQuery={debouncedSearchValue}
                            />
                          );
                        })}
                      </InfiniteScroll>
                    ) : state?.updates?.length === 0 && !state?.isLoading ? (
                      <NoResultFound text="No Updates Found" />
                    ) : (
                      <Dots />
                    )}
                  </div>
                </Container>
              </Container>
            </Container>
          </>
        )}
        <Container variant="main">
          <Container variant="container">
            <Container variant="content" isShowAddTaskButton>
              {state.section === "sendEmail" && (
                <SendEmail
                  selectedId={state.selectedIds}
                  handleClose={handleEmailClose}
                  getLogs={getLogs}
                />
              )}
              {state.section === "emailLog" && (
                <EmailLog
                  handleClose={handleEmailClose}
                  fetchUpdateDetails={fetchUpdateDetails}
                />
              )}
            </Container>
          </Container>
        </Container>
      </Switch>
    </div>
  );
});

export const UpdatesListItem = ({
  item,
  index,
  userType,
  isShowCheckboxInput = true,
  handleChange = () => {},
  openDrawer = () => {},
  searchQuery = "",
  isNewTask = false,
}) => {
  const { topic, title, dateIssued, circularNumber, name } = item;

  return (
    <div className="col-md-12 regulations-scroll d-none d-md-block pl-0">
      <div>
        <div className="title d-none d-md-block">
          <div className="list my-2 p-0">
            {(isNewTask || (userType === 3 && isShowCheckboxInput)) && (
              <div>
                <input
                  className="new-regulation-checkbox"
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => {
                    handleChange(index);
                  }}
                />
              </div>
            )}

            <div onClick={() => openDrawer(name)} className="checkbox-title">
              <div>
                <div
                  className="align-items-center justify-content-between row no-gutters px-0"
                  onClick={() => openDrawer(name)}
                >
                  <div className="col-10">
                    <h2 className="new-regulation-title">
                      {getHighlightedTextBySearchQuery(searchQuery, title)}
                    </h2>
                  </div>
                  <div className="description-details col-2">
                    <span className="date">
                      {moment(dateIssued).format("DD MMM yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-start">
                <button className="license-code">
                  {getHighlightedTextBySearchQuery(
                    searchQuery,
                    circularNumber || item.circular_number
                  )}
                </button>
                {topic &&
                  (typeof topic === "string"
                    ? [topic]
                    : typeof topic === "object"
                    ? topic
                    : []
                  ).map((item) => {
                    return (
                      <p className="description-text mb-0 fit-content mr-3">
                        {getHighlightedTextBySearchQuery(searchQuery, item)}
                      </p>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Updates);
