import { IconButton } from "@mui/material";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
import { useOuterClick } from "Components/OnBoarding/SubModules/DashBoardCO/components/RightSideGrid/outerClick";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import { setLoading } from "Components/SuperAdminModule/TaskHistoryFilter/redux/actions";
import FiltersView from "Components/Updates/FiltersView/index";
import { UpdatesListItem } from "Components/Updates";
import React, { useEffect, useRef, useState } from "react";
import { MdFilterListAlt, MdSearch } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import Constants from "SharedComponents/Constants";
import { updateservice } from "SharedComponents/Services/updates.service";
import Dots from "../Loader/Dots";
import NoResultFound from "../NoResultFound";
import styles from "./styles.module.scss";
import moment from "moment";
import { useSelector } from "react-redux";

const RegulatoryRefTab = ({
  visible,
  onClose,
  fieldInputs,
  setFieldInputs,
  updates,
  setUpdates,
  isSelected,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [limits, setLimits] = useState({
    limit: Constants.limit,
    offset: Constants.offset,
  });
  const [isAllInputFilled, setIsAllInputFilled] = useState(false);
  const dataContainerRef = useRef();
  const filtersContextRef = useOuterClick((e) => {
    if (!e.target?.className?.includes("ant-picker")) {
      setIsShowFilters(false);
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isShowFilters, setIsShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    issuer: "",
    industry: "",
    topic: "",
    fromDate: "",
    toDate: "",
  });
  const [isFiltersDataLoading, setIsFiltersDataLoading] = useState(false);
  const [filtersData, setFiltersData] = useState({});
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );

  // const [updates, setUpdates] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const onNext = () => {
    setLimits({
      ...limits,
      offset: limits.offset + 1,
    });
  };

  const fetchUpdateFilter = async () => {
    try {
      setIsFiltersDataLoading(true);
      const response = await updateservice.getFilter();
      if (response) {
        setFiltersData({
          ...response,
        });
        setIsFiltersDataLoading(false);
      } else {
        setIsFiltersDataLoading(false);
      }
    } catch (error) {
      setIsFiltersDataLoading(false);
    }
  };

  const fetchUpdates = async (currentOffset) => {
    try {
      if (modalsStatus.taskModal.isUpdate) {
        setUpdates(modalsStatus.taskModal.editData.circularsList);
      } else {
        setIsLoading(true);
        const payload = {
          limit: limits.limit,
          offset: currentOffset !== undefined ? currentOffset : limits.offset,
          ...(debouncedSearchQuery && {
            search: debouncedSearchQuery,
          }),
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
        };

        const responce = await updateservice.post(payload);

        if (responce) {
          const _circulars = [
            ...(((currentOffset !== undefined ? currentOffset : limits.offset) >
              0 &&
              updates.length > 0 &&
              updates) ||
              []),
            ...responce.circular?.map((item) => ({
              ...item,
              isChecked: !!fieldInputs?.circulars?.find(
                (c) => c?.name === item.name
              )
                ? true
                : false,
            })),
          ];
          setUpdates(_circulars);
          setHasMore(
            _circulars?.length >= responce?.circular_total_count ? false : true
          );
          isLoading(false);
          if (currentOffset !== undefined) {
            setLimits({
              ...limits,
              offset: currentOffset,
            });
          }
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChange = (index) => {
    const tempArray = [...updates];
    tempArray[index].isChecked = !tempArray[index].isChecked;
    setUpdates(tempArray);
  };

  const handleClearFilters = () => {
    setFilters({
      issuer: "",
      industry: "",
      topic: "",
      fromDate: "",
      toDate: "",
    });
  };

  useEffect(() => {
    if (visible) {
      if (limits.offset > 0 && !debouncedSearchQuery) fetchUpdates();
      else if (
        !debouncedSearchQuery ||
        (debouncedSearchQuery && limits.offset > 0)
      ) {
        fetchUpdates();
      }
    }
  }, [debouncedSearchQuery, limits.offset, fieldInputs?.circulars, visible]);

  useEffect(() => {
    if (visible) {
      if (dataContainerRef.current) {
        dataContainerRef.current.scrollTop = 0;
      }
      if (debouncedSearchQuery) {
        fetchUpdates(0);
      }
    }
  }, [debouncedSearchQuery, fieldInputs?.circulars, visible]);

  useEffect(() => {
    if (visible) {
      if (
        !filters.fromDate &&
        !filters.industry &&
        !filters.issuer &&
        !filters.toDate &&
        !filters.topic &&
        isShowFilters
      ) {
        fetchUpdates(0);
      }
    }
  }, [filters, isShowFilters, visible]);

  return (
    <ProjectManagementModal
      visible={visible}
      onClose={onClose}
      containerClass={styles.bigModal}
    >
      <div
        className={`${styles.modalHeader} w-100 d-flex justify-content-between align-items-center pb-2 pr-5`}
      >
        <h5 className="mb-0">Regulatory Reference</h5>

        {!modalsStatus.taskModal.editData.isUpdate && (
          <div className="d-flex align-items-center">
            <div className={styles.searchInputGroup}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target?.value)}
                placeholder="Search for regulatory reference"
              />
              <MdSearch className={styles.searchInputIcon} />
            </div>
            <div className="position-relative">
              <IconButton
                className="ml-2"
                disableTouchRipple
                onClick={() => {
                  if (!isShowFilters) {
                    setIsShowFilters(true);
                    fetchUpdateFilter();
                  }
                }}
              >
                <MdFilterListAlt color="#7a73ff" />
              </IconButton>

              {isShowFilters && (
                <div
                  ref={filtersContextRef}
                  className={`${styles.filtersContainer}`}
                >
                  <div className={`${styles.filtersData} px-3`}>
                    {isFiltersDataLoading && <Dots />}
                    {!isFiltersDataLoading &&
                      filtersData &&
                      Object.keys(filtersData)?.length > 0 && (
                        <FiltersView
                          filterData={filtersData}
                          filters={filters}
                          setFilters={setFilters}
                          getFilteredData={() => {
                            fetchUpdates(0);
                            setIsShowFilters(false);
                          }}
                          isAllInputFilled={isAllInputFilled}
                          setIsAllInputFilled={setIsAllInputFilled}
                          handleClearFilter={handleClearFilters}
                        />
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <p className={styles.instructionMessage}>
        Your task may have regulatory references. You can add them here and it
        will be shown in all future tasks based on the repetition as selected by
        you.
      </p>
      <div
        style={{
          height: "55vh",
          width: "100%",
        }}
      >
        <div id="scrollableList" className="overflow-auto h-100">
          {!isLoading && updates?.length > 0 ? (
            <InfiniteScroll
              dataLength={updates?.length}
              next={onNext}
              hasMore={hasMore}
              loader={<Dots />}
              className="scrollable_div"
              scrollThreshold={0.9}
              scrollableTarget="scrollableList"
            >
              {updates?.map((item, index) => {
                return (
                  <UpdatesListItem
                    item={item}
                    index={index}
                    key={`create-task-${item.name}-${index}`}
                    isNewTask={true}
                    handleChange={handleChange}
                    searchQuery={debouncedSearchQuery}
                  />
                );
              })}
            </InfiniteScroll>
          ) : updates?.length === 0 && !isLoading ? (
            <NoResultFound text="No Updates Found" />
          ) : (
            <Dots />
          )}
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-3">
        <button
          className="project-management__button project-management__button--primary mx-3"
          onClick={() => {
            const checkedValues = [...updates].filter((item) => item.isChecked);
            // const selectedUpdates = checkedValues.map((item) => item.name);
            setFieldInputs({ ...fieldInputs, circulars: checkedValues });
            onClose();
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            // setFieldInputs({ ...fieldInputs, circulars: [] });
            onClose();
          }}
          className="project-management__button project-management__button--outlined mx-3"
        >
          Cancel
        </button>
      </div>
    </ProjectManagementModal>
  );
};

export default RegulatoryRefTab;
