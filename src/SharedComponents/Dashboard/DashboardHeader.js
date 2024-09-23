import React, { useEffect } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import styles from "./styles.module.scss";
import { dashboardTabs, dashboardViews, viewByFilters } from "../Constants";
import {
  setCurrentViewByFilter,
  setCurrentActiveTab,
  setCurrentDashboardTab,
  setDashboardSearch,
  clearDashboardSearch,
  fetchTasksBySearchQueryRequest,
} from "./redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../CommonModules/helpers/custom.hooks";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import { ArrowBack, Search } from "@mui/icons-material";
import { setSuggestionShow } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";

const DashboardHeader = ({
  isLeftBar,
  isShowAuditTab = false,
  setListView,
  showOnlyCalendar,
}) => {
  const {
    currentActiveTab,
    currentViewByFilter,
    currentDashboardTab,
    tasksBySearchQuery,
  } = useSelector((state) => state?.DashboardState);

  const { isShowSearchBox, searchQuery } = tasksBySearchQuery;
  const dispatch = useDispatch();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  useEffect(() => {
    if (!isShowAuditTab) {
      dispatch(setCurrentDashboardTab(dashboardViews[0]));
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery) {
      dispatch(
        fetchTasksBySearchQueryRequest({
          search: debouncedSearchQuery,
          limit: 6,
          offset: 0,
        })
      );
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (showOnlyCalendar) {
      dispatch(setCurrentDashboardTab("Calendar"));
    } else {
      dispatch(setCurrentDashboardTab("Tasks"));
    }
  }, [showOnlyCalendar, dispatch]);

  return (
    <>
      {/* Header */}
      <div className={`${styles.dashboardHeaderContainer}`}>
        {(isLeftBar ? !isShowSearchBox : true) && (
          <div className="d-flex align-items-center">
            {setListView && (
              <div className="d-block d-md-none mr-2 ml-n3">
                <IconButton
                  size="small"
                  disableTouchRipple
                  onClick={() => setListView && setListView("")}
                >
                  <ArrowBack />
                </IconButton>
              </div>
            )}
            {(!showOnlyCalendar
              ? [
                ...(!isShowAuditTab
                  ? [...dashboardViews].filter((item) => item !== "Audit")
                  : dashboardViews),
              ]
              : ["Calendar"]
            )?.map((view) => {
              return (
                <h3
                  className={`${styles.dashboardHeaderTitle} ${currentDashboardTab === view
                      ? styles.dashboardHeaderTitleActive
                      : ""
                    } mr-3`}
                  onClick={() => dispatch(setCurrentDashboardTab(view))}
                >
                  {view}
                </h3>
              );
            })}
          </div>
        )}
        <div className="d-flex align-items-center">
          {currentDashboardTab !== dashboardViews[1] && !showOnlyCalendar && (
            <div className={`${styles.dashboardHeaderSearchContainer} mr-3`}>
              {!isShowSearchBox ? (
                <IconButton
                  disableRipple
                  size="small"
                  onClick={() => {
                    dispatch(
                      setDashboardSearch({ isShowSearchBox: !isShowSearchBox })
                    );
                  }}
                >
                  <Search />
                </IconButton>
              ) : (
                <>
                  <div className={styles.searchInputContainer}>
                    <input
                      placeholder="search for license, teams, companies etc.."
                      className={styles.searchInput}
                      type="text"
                      value={searchQuery}
                      onChange={(e) =>
                        dispatch(
                          setDashboardSearch({ searchQuery: e.target.value })
                        )
                      }
                    />
                    <MdSearch className={styles.searchIcon} />
                    <MdClose
                      className={styles.closeSearchIcon}
                      onClick={() => dispatch(clearDashboardSearch())}
                    />
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
      {/* Tabs [List, Calender, Baord] */}
      {currentDashboardTab !== dashboardViews[1] && !showOnlyCalendar ? (
        <>
          <div className={`${styles.dashboardTabsContainer}`}>
            {dashboardTabs.map((tab, index) => {
              return (
                <p
                  onClick={() => dispatch(setCurrentActiveTab(tab))}
                  key={`dashboard-tab-title-${index}`}
                  className={`${styles.dashboardTabTitle} ${currentActiveTab === tab
                      ? styles.dashboardTabTitle__active
                      : ""
                    }`}
                >
                  {tab}
                </p>
              );
            })}
          </div>
          {(currentActiveTab !== dashboardTabs[1] || isLeftBar) &&
            !searchQuery && (
              <>
                {/* View By Filters */}
                <div className={styles.dashboardViewByFiltersContianer}>
                  <ul className={styles.dashboardViewByFiltersList}>
                    <span
                      className={`${styles.dashboardViewByFilterTitle} truncate`}
                      title="View by"
                    >
                      View by
                    </span>
                    {viewByFilters.map((viewByFilter) => {
                      return (
                        <span
                          className={`${styles.dashboardViewByFilterItem} ${currentViewByFilter === viewByFilter
                              ? styles.dashboardViewByFilterItem__active
                              : ""
                            }`}
                          onClick={() =>
                            dispatch(setCurrentViewByFilter(viewByFilter))
                          }
                        >
                          {viewByFilter}
                        </span>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
        </>
      ) : (
        <div className={`${styles.dashboardTabsContainer} mt-1`}></div>
      )}
    </>
  );
};

export default DashboardHeader;
