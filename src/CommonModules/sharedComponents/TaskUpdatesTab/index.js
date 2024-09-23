import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "apiServices";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { UpdatesListItem } from "Components/Updates";
import { actions as adminMenuActions } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";

import useScrollHeight from "SharedComponents/Hooks/useScrollHeight";

import Constants from "SharedComponents/Constants";
import { updateservice } from "SharedComponents/Services/updates.service";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
import NoResultFound from "../NoResultFound";
import styles from "Components/Notifications/styles.module.scss";
import { IconButton } from "@mui/material";
import { MdClose, MdSearch } from "react-icons/md";

const TaskUpdatesTab = ({ fieldInputs, setFieldInputs }) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const dataContainerRef = useRef();
  const [showSearch, setShowSearch] = useState(false);
  const [state, setState] = useState({
    section: "updateSec",
    selectedIds: [],
    isLoading: false,
    isSearch: false,
    limit: Constants.limit,
    offset: Constants.offset,
    updates: [],
    filters: [],
    totalUpdateCount: 0,
    hasMore: true,
    isShowMobileFilter: false,
  });

  const mainContainerRef = useRef();
  const h = useScrollHeight(mainContainerRef, 0, [
    state.updates,
    "",
    state.isLoading,
  ]);

  const handleChange = (index) => {
    const tempArray = state.updates;
    tempArray[index].isChecked = !tempArray[index].isChecked;
    setState({ ...state, updates: tempArray });
    const checkedValues = tempArray.filter((item) => item.isChecked);
    const circularsList = checkedValues.map((item) => item.name);

    setState({ ...state, selectedIds: circularsList });

    setFieldInputs({ ...fieldInputs, circulars: circularsList });
  };

  const onNext = () => {
    setState({
      ...state,
      offset: state?.offset + 1,
    });
  };

  const onSearch = (event) => {
    const { value } = event.target;
    setSearchValue(value);
  };

  const closeSearch = () => {
    setSearchValue("");
    setState({
      ...state,
      updates: searchValue ? [] : state.updates,
      isSearch: false,
    });
  };

  const fetchUpdates = async (currentOffset, isShowMobileFilter) => {
    try {
      setState({ ...state, isLoading: true });

      const { limit, offset } = state;
      const payload = {
        limit: limit,
        offset: currentOffset !== undefined ? currentOffset : offset,

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
          ...response.circular.map((item) => ({
            ...item,
            isChecked: fieldInputs?.circulars?.includes(item.name)
              ? true
              : false,
          })),
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
        setState({
          ...state,
          isLoading: false,
          ...(isShowMobileFilter !== undefined ? { isShowMobileFilter } : {}),
        });
      }
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        ...(isShowMobileFilter !== undefined ? { isShowMobileFilter } : {}),
      });
    }
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

  return (
    <>
      {" "}
      <div ref={mainContainerRef} className="container-fluid px-0">
        <div>
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
        </div>
        <div
          style={{
            maxHeight: h + "px",
            overflowY: "auto",
            width: "100%",
          }}
        >
          <div id="scrollableList" className="overflow-auto mt-4">
            {!state?.isLoading && state?.updates?.length > 0 ? (
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
                      item={item}
                      index={index}
                      key={`${item.name}-${index}`}
                      isNewTask={true}
                      handleChange={handleChange}
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
        </div>
      </div>
    </>
  );
};

export default TaskUpdatesTab;
