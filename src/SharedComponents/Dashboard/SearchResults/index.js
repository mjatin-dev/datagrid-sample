/* eslint-disable react-hooks/exhaustive-deps */
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd } from "react-icons/md";
import accordionStyles from "../TaskAccordion/styles.module.scss";
import { fetchTasksBySearchQueryRequest } from "../redux/actions";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
import { TaskListItem } from "../TaskAccordion";
import styles from "./styles.module.scss";

const DashboardSearchResults = ({ isLeftBar = false }) => {
  const [limits, setLimits] = useState({ offset: 0, limit: 6 });

  const { data, isLoading, isNotFound, searchQuery } = useSelector(
    (state) => state?.DashboardState?.tasksBySearchQuery
  );
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const dispatch = useDispatch();

  const onLoadMoreClick = () => {
    setLimits({ ...limits, offset: limits.offset + 1 });
  };
  useEffect(() => {
    if (limits.offset > 0 && data?.tasks?.length >= 6) {
      dispatch(
        fetchTasksBySearchQueryRequest({
          search: debouncedSearchQuery,
          limit: limits.limit,
          offset: limits.offset,
        })
      );
    }
  }, [limits]);

  useEffect(() => {
    if (searchQuery) {
      setLimits({ ...limits, offset: 0 });
    }
  }, [searchQuery]);

  return (
    <>
      {isLoading && !data?.tasks ? (
        <Dots />
      ) : (
        <>
          <div className="w-100 mt-4">
            {!isNotFound &&
              data?.tasks &&
              data?.tasks?.length > 0 &&
              [...data?.tasks].map((item) => {
                return (
                  <TaskListItem
                    data={item}
                    key={item.taskName}
                    isLeftBar={isLeftBar}
                  />
                );
              })}

            {data &&
              data?.tasks?.length > 0 &&
              data?.tasks?.length < data?.count &&
              !isLoading && (
                <p
                  className={`mb-0 ml-1 mt-2 cursor-pointer ${accordionStyles.taskListItemText} ${accordionStyles.taskListItemText__assign}`}
                  onClick={onLoadMoreClick}
                  style={{ ...(isLeftBar && { padding: "0 2rem" }) }}
                >
                  <MdAdd
                    className={accordionStyles.taskAccordionDropdownIcon}
                  />
                  &nbsp;Load{" "}
                  {data?.count - data?.tasks?.length >= 6
                    ? 6
                    : data?.count - data?.tasks?.length}
                  &nbsp;More &nbsp;
                  {`(${data?.tasks.length}/${data?.count || 0})`}
                </p>
              )}
            {isLoading && data?.tasks?.length > 0 && <Dots />}

            {isNotFound && (
              <p className={styles.notFoundText}>No result found</p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DashboardSearchResults;
