import React, { useEffect, useState } from "react";
import constant from "CommonModules/sharedComponents/constants/constant";
import { DatePicker } from "antd";
import moment from "moment";
import {
  isDifferenceIsMoreThanOneYear,
  isSameOrBeforeToday,
  isToDateBeforeFromDate,
} from "Components/ReAssignTasks/utilties";
import "./styles.css";
import MultiSelectInput from "Components/Audit/components/MultiSelectInput";
// import { useDispatch } from "react-redux";
// import { clearFilter } from "../redux/actions";
const FiltersView = ({
  filterData,
  filters,
  setFilters,
  getFilteredData,
  isAllInputFilled,
  setIsAllInputFilled,
  handleClearFilter,
}) => {
  const [state, setState] = useState({
    industryList: [],
    issuerList: [],
    topicList: [],
  });
  // const dispatch = useDispatch();
  const getFilterData = () => {
    getFilteredData();
  };

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f6f9fb",
      fontSize: "12px",
      border: "none",
      borderRadius: "4px",
    }),
  };

  useEffect(() => {
    if (filterData) {
      const { industryList, issuerList, topicList } = filterData;
      setState({
        ...state,
        industryList: industryList
          ? industryList
              .filter((item) => item)
              .map((item) => ({ value: item, label: item }))
          : [],
        issuerList: issuerList
          ? issuerList
              .filter((item) => item)
              .map((item) => ({ value: item, label: item }))
          : [],
        topicList: topicList
          ? topicList
              .filter((item) => item?.topic)
              .map((item) => ({ value: item.topic, label: item.topic }))
          : [],
      });
    }
  }, [filterData]);

  useEffect(() => {
    if (
      (filters.industry !== "" ||
        filters.issuer !== "" ||
        filters.topic !== "" ||
        true) &&
      (filters?.fromDate?.length === 3 || filters?.toDate?.length === 3)
        ? filters.fromDate !== "" &&
          filters.fromDate.length !== 0 &&
          filters.fromDate.length === 3 &&
          isSameOrBeforeToday(filters.fromDate) &&
          filters.toDate !== "" &&
          filters.toDate.length !== 0 &&
          filters.toDate.length === 3 &&
          isSameOrBeforeToday(filters.toDate) &&
          !isDifferenceIsMoreThanOneYear(filters.fromDate, filters.toDate) &&
          !isToDateBeforeFromDate(filters.fromDate, filters.toDate, false)
        : true
    ) {
      setIsAllInputFilled(true);
    } else {
      setIsAllInputFilled(false);
    }
  }, [filters]);

  const setFromDate = (date, dateString) => {
    let dateArr;
    if (dateString) {
      dateArr = moment(dateString)
        .format("DD MM YYYY")
        ?.split(" ")
        ?.map((element) => parseInt(element));
    }
    setFilters({ ...filters, fromDate: dateString ? dateArr : "" });
  };

  const setToDate = (date, dateString) => {
    let dateArr;
    if (dateString) {
      dateArr = moment(dateString)
        ?.format("DD MM YYYY")
        ?.split(" ")
        ?.map((element) => parseInt(element));
    }
    setFilters({ ...filters, toDate: dateString ? dateArr : "" });
  };

  return (
    <div>
      <div className={`filter-form px-2`}>
        <div>
          <MultiSelectInput
            customStyles={selectStyles}
            placeholder="Select Issuer"
            labelText="Issuer:"
            options={state.issuerList}
            multiple={true}
            onChange={(data) => {
              setFilters({
                ...filters,
                issuer: data?.map((item) => item.value)?.toString() || "",
              });
            }}
            value={
              filters?.issuer
                ? filters?.issuer?.split(",")?.map((item) => ({
                    label: item,
                    value: item,
                  }))
                : []
            }
          />
        </div>
        <div>
          {/* <Searchable
            className="l"
            placeholder="Select Industry"
            notFoundText="No result found"
            listMaxHeight={200}
            options={state.industryList}
            multiple={true}
            onSelect={(event) =>
              setFilters({ ...filters, industry: event.toString() })
            }
            value={filters?.industry || []}
          /> */}
          <MultiSelectInput
            placeholder="Select Industry"
            customStyles={selectStyles}
            labelText="Industry:"
            options={state.industryList}
            multiple={true}
            onChange={(data) => {
              setFilters({
                ...filters,
                industry: data?.map((item) => item.value)?.toString() || "",
              });
            }}
            value={
              filters?.industry
                ? filters?.industry?.split(",")?.map((item) => ({
                    label: item,
                    value: item,
                  }))
                : []
            }
          />
        </div>
        <div>
          {/* <Searchable
            className=""
            placeholder="Select Topic"
            notFoundText="No result found"
            listMaxHeight={200}
            options={state.topicList}
            multiple={true}
            onSelect={(event) =>
              setFilters({ ...filters, topic: event.toString() })
            }
            value={filters?.topic || []}
          /> */}
          <MultiSelectInput
            placeholder="Select Topic"
            customStyles={selectStyles}
            labelText="Topic:"
            options={state.topicList}
            multiple={true}
            onChange={(data) => {
              setFilters({
                ...filters,
                topic: data?.map((item) => item.value)?.toString() || "",
              });
            }}
            value={
              filters?.topic
                ? filters?.topic?.split(",")?.map((item) => ({
                    label: item,
                    value: item,
                  }))
                : []
            }
          />
        </div>
        <div>
          <label>From:</label>
          <DatePicker
            style={{
              width: "100%",
              color: "#000",
              border: "1px solid #ced4da",
            }}
            format="DD MMM YYYY"
            name={"from"}
            className={"date-picker"}
            onChange={setFromDate}
            placeholder="Select Date"
            value={
              filters.fromDate && filters.fromDate?.length > 0
                ? moment(filters.fromDate?.join(" "), "DD MM YYYY")
                : null
            }
          />
          {filters.fromDate !== "" &&
            filters.fromDate?.length === 3 &&
            !isSameOrBeforeToday(filters.fromDate) !== undefined &&
            !isSameOrBeforeToday(filters.fromDate) && (
              <p className="warnings">
                <small className="d-block">
                  {"* " + constant.errorMessage.errorDueToGreaterDate}
                </small>
              </p>
            )}
        </div>
        <div>
          <label>To:</label>
          <DatePicker
            style={{
              width: "100%",
              color: "#000",
              border: "1px solid #ced4da",
            }}
            format="DD MMM YYYY"
            name={"to"}
            className={"date-picker"}
            placeholder="Select Date"
            onChange={setToDate}
            value={
              filters.toDate && filters.toDate?.length > 0
                ? moment(filters.toDate?.join(" "), "DD MM YYYY")
                : null
            }
          />
          <p className="warnings">
            {filters.toDate !== "" &&
              filters.toDate?.length === 3 &&
              !isSameOrBeforeToday(filters.toDate) !== undefined &&
              !isSameOrBeforeToday(filters.toDate) && (
                <small className="d-block">
                  {"* " + constant.errorMessage.errorDueToGreaterDate}
                </small>
              )}

            {filters.toDate !== "" &&
              filters.toDate?.length === 3 &&
              filters.toDate !== "" &&
              filters.fromDate?.length === 3 &&
              isDifferenceIsMoreThanOneYear(
                filters.fromDate,
                filters.toDate
              ) !== undefined &&
              isDifferenceIsMoreThanOneYear(
                filters.fromDate,
                filters.toDate
              ) && (
                <small className="d-block">
                  {"* " + constant.errorMessage.errorDueToRange}
                </small>
              )}
            {filters.toDate !== "" &&
              filters.toDate?.length === 3 &&
              filters.fromDate !== "" &&
              filters.fromDate?.length === 3 &&
              isToDateBeforeFromDate(
                filters.fromDate,
                filters.toDate,
                false
              ) !== undefined &&
              isToDateBeforeFromDate(
                filters.fromDate,
                filters.toDate,
                false
              ) && (
                <small className="d-block">
                  {"* " +
                    constant.errorMessage.errorDueToReverseDate +
                    moment(filters?.fromDate?.join("-"), "DD-MM-YYYY").format(
                      "D MMMM YYYY"
                    )}
                </small>
              )}
          </p>
        </div>

        <div className="d-flex align-items-center justify-content-start">
          <button
            className={`view-updates mr-3 ${
              isAllInputFilled && "view-updates-active"
            }`}
            onClick={getFilterData}
          >
            View Updates
          </button>
          <button
            className={`view-updates view-updates-outline`}
            onClick={() => handleClearFilter()}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export const isFilterApplied = (filters) =>
  Boolean(
    filters?.issuer ||
      filters?.industry ||
      filters?.topic ||
      filters?.fromDate ||
      filters?.toDate
  );

export default FiltersView;
