/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router";
import Constants from "../../SharedComponents/Constants";
import Dropdown from "react-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { actions as adminMenuActions } from "../../Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
// import { actions as taskReportActions } from "../OnBoarding/SubModules/DashBoardCO/redux/actions";
import { useHistory } from "react-router-dom";
import { notificationservice } from "../../SharedComponents/Services/notification.service";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./styles.module.scss";
import ViewHeader from "../../SharedComponents/ViewHeader";
import { toast } from "react-toastify";
import useAccount from "../../SharedComponents/Hooks/Account.hook";
import Dots from "../../CommonModules/sharedComponents/Loader/Dots";
import { fetchTaskDetailRequest } from "SharedComponents/Dashboard/redux/actions";
import Container from "SharedComponents/Containers";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import serachStyles from "Components/Notifications/styles.module.scss";
import { MdClose, MdSearch } from "react-icons/md";
import { IconButton } from "@mui/material";
import {
  useDebounce,
  useGetUserRoles,
} from "CommonModules/helpers/custom.hooks";

const Notification = React.memo((props) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchValue = useDebounce(searchQuery, 500);
  const [notificationList, setNotificationList] = useState([]);
  const Actionstate = useSelector((state) => state);
  const { isTaskManagementUser } = useGetUserRoles();
  const is_task_manager_user =
    Actionstate && Actionstate.CompanyExistsState.isCompanyExists;
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    limit: Constants.limit,
    offset: Constants.offset,
    notifications: [],
    totalNotificationCount: 0,
    hasMore: true,
    filter: {
      value: Constants.notificationTypes[0].value,
      isChanged: false,
    },
  });

  const mainContainer = useRef();
  const scrollHeight = useScrollableHeight(mainContainer, 64, [
    state,
    isLoading,
  ]);

  const loggedUser = useAccount();

  const storeDispatch = useDispatch();
  const history = useHistory();

  const onNext = () => {
    setState({
      ...state,
      offset: state?.offset + 1,
      filter: { ...state?.filter, isChanged: false },
    });
  };

  const fetchNotifications = async (currentOffset) => {
    try {
      const { limit, offset, filter } = state;
      if (!(currentOffset || offset)) setIsLoading(true);
      const response = await notificationservice.get(
        limit,
        currentOffset !== undefined ? currentOffset : offset,
        filter.value,
        debouncedSearchValue || ""
      );

      if (response) {
        const { notifications, totalNotificationCount } = response;

        const updatedNotifications = [
          ...(!filter.isChanged &&
          (currentOffset !== undefined ? currentOffset : offset) > 0
            ? state.notifications
            : []),
          ...notifications,
        ];
        if (!(currentOffset || offset)) setIsLoading(false);
        setState({
          ...state,
          notifications: updatedNotifications,
          hasMore:
            updatedNotifications?.length >= totalNotificationCount
              ? false
              : true,
          totalNotificationCount,
          ...(currentOffset !== undefined && {
            offset: currentOffset,
          }),
        });
      } else {
        toast.error("No data Found");
        if (!(currentOffset || offset)) setIsLoading(false);
      }
    } catch (error) {
      toast.error(error);
      if (isLoading) setIsLoading(false);
    }
  };

  const handleChange = (selectedOption) => {
    setState(() => ({
      ...state,
      // limit: Constants.limit,
      // offset: Constants.offset,
      filter: {
        ...state?.filter,
        value: selectedOption.value,
        isChanged: true,
      },
    }));
  };

  const handleNotificationSelect = (list) => {
    if (loggedUser && loggedUser.UserType !== 6) {
      if (list.type === "Circular") {
        storeDispatch(adminMenuActions.setCurrentMenu("updates"));
        history.push("/updates", {
          circular_id: list.id,
          from: "notifications",
        });
      } else if (list.type === "Task") {
        storeDispatch(fetchTaskDetailRequest(list.id));
        history.push({
          pathname: "/dashboard-view",
          state: { handleBack: true, taskId: list.id },
        });
      }
    }
  };

  useEffect(() => {
    if (state?.offset > 0 && !debouncedSearchValue) fetchNotifications();
    else if (
      // !debouncedSearchValue ||
      debouncedSearchValue &&
      state?.offset > 0
    ) {
      fetchNotifications();
    }
  }, [state.offset]);

  useEffect(() => {
    if (mainContainer.current) {
      mainContainer.current.scrollTop = 0;
    }
    // if (debouncedSearchValue) {
    fetchNotifications(0);
    // }
  }, [debouncedSearchValue, state?.filter?.value]);

  const closeSearch = () => {
    if (searchQuery) {
      setState({
        ...state,
        notifications: [],
      });
    }
    setShowSearch(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (!isTaskManagementUser) {
      setNotificationList(Constants.notificationTypes);
    } else {
      let arr = [];
      Constants.notificationTypes.forEach((NT) => {
        if (NT.label !== "Updates") {
          arr.push(NT);
        }
      });
      setNotificationList(arr);
    }
  }, [isTaskManagementUser]);

  return (
    <Container variant="main">
      <Container variant="container">
        <Container variant="content" isShowAddTaskButton>
          <ViewHeader title="Notifications">
            <div
              className={`${styles.headerFilter} d-flex align-items-center justify-content-end`}
              style={{ width: "100%" }}
            >
              <div
                className={`${
                  showSearch ? serachStyles.searchInputContainer : ""
                } d-none d-md-flex`}
              >
                {!showSearch && (
                  <IconButton onClick={() => setShowSearch(true)}>
                    <MdSearch className={serachStyles.searchIcon} />
                  </IconButton>
                )}

                {showSearch && (
                  <>
                    <input
                      // placeholder="Search for Notification"
                      className={styles.searchInput}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <MdSearch className={styles.searchIcon} />
                    <IconButton
                      disableTouchRipple={true}
                      onClick={() => {
                        closeSearch();
                      }}
                      className={styles.closeSearchIcon}
                    >
                      <MdClose />
                    </IconButton>
                  </>
                )}
              </div>
              <div className={`${styles.filterDropDown}`}>
                <ul>
                  <li>
                    <p className={`${styles.filterBy}  d-none d-md-block`}>
                      Filter By:
                    </p>
                  </li>
                  <li>
                    <Dropdown
                      className="d-none d-md-block"
                      value={state?.filter.value}
                      onChange={handleChange}
                      arrowClassName={styles.dropdownArrow}
                      options={notificationList}
                      placeholder="Select an option"
                      controlClassName={styles.dropdownControl}
                      menuClassName={styles.dropdownMenu}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </ViewHeader>
          <div
            ref={mainContainer}
            id="scrollableList"
            className={styles.notificationsList}
            style={{
              maxHeight: scrollHeight,
              overflowY: "auto",
            }}
          >
            {!isLoading && state?.notifications?.length > 0 ? (
              <InfiniteScroll
                dataLength={state?.notifications?.length}
                next={onNext}
                hasMore={state?.hasMore}
                loader={<Dots />}
                className="scrollable_div"
                scrollThreshold={0.9}
                scrollableTarget="scrollableList"
              >
                {state?.notifications.map((item, index) => {
                  const { date, id, type, title, body } = item;
                  return (
                    <ul
                      className={`${styles.listView} my-3`}
                      key={`notification-${id}-${index}`}
                      onClick={() => {
                        handleNotificationSelect(item);
                      }}
                    >
                      <li>
                        <div
                          className="initial-name__container"
                          style={{
                            backgroundColor: `${
                              type && type === "Task" ? "#03cbaf" : "#7970ed"
                            }`,
                          }}
                        >
                          <span
                            className="initial-name"
                            style={{ color: "white", opacity: "initial" }}
                          >
                            {type && type === "Task" ? "T" : "U"}
                          </span>
                        </div>
                      </li>
                      <li className={`d-none d-sm-block ${styles.normalText}`}>
                        <span>
                          {moment(date).format("DD MMM YYYY, h:mm A")} &nbsp;
                        </span>
                        <span className={styles.strongTitle}>{title}</span>{" "}
                        <span>{body}</span>
                      </li>
                    </ul>
                  );
                })}
              </InfiniteScroll>
            ) : !isLoading && state.notifications?.length === 0 ? (
              <div className={styles.noResultFound__notification}>
                <h1>No notification found</h1>
              </div>
            ) : (
              <div className="my-5">
                <Dots />
              </div>
            )}
          </div>
        </Container>
      </Container>
    </Container>
  );
});

export default withRouter(Notification);
