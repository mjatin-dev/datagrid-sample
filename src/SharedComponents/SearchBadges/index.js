import React, { useState } from "react";
import moment from "moment";
import Constants from "SharedComponents/Constants";
import { GrFormClose } from "react-icons/gr";
import "./style.css";

const SearchBadges = ({
  filters,
  setFilters,
  state,
  setState,
  fetchUpdates,
  isAllInputFilled,
}) => {
  const [badge, setbadge] = useState({
    industrySelect: filters?.issuer,
    issuerSelect: filters?.industry,
    topicSelect: filters?.topic,
    fromDate: filters?.fromDate,
    toDate: filters?.toDate,
  });
  const removeBadgeAndFetchIndustryList = (name) => {
    if (name === "issuer") {
      setbadge({
        ...badge,
        issuerSelect: "",
      });
      setFilters({ ...filters, issuer: "" });
    } else if (name === "industry") {
      setbadge({
        ...badge,
        industrySelect: "",
      });
      setFilters({ ...filters, industry: "" });
    } else if (name === "topic") {
      setbadge({
        ...badge,
        topicSelect: "",
      });
      setFilters({ ...filters, topic: "" });
    } else if (name === "fromAndToDate") {
      setbadge({
        ...badge,
        fromDate: "",
        toDate: "",
      });
      setFilters({ ...filters, fromDate: "", toDate: "" });
    } else {
      setFilters({
        issuer: "",
        industry: "",
        topic: "",
        fromDate: "",
        toDate: "",
      });
      setState({
        ...state,
        isFilters: false,
        updates: [],
        limit: Constants.limit,
        offset: Constants.offset,
      });
    }
  };

  return (
    <div className="BadgesWrapper">
      {filters?.issuer && isAllInputFilled && (
        <div className="BadgesDiv">
          <span>{filters?.issuer}</span>
          <div
            className="CloseBadge"
            onClick={() => removeBadgeAndFetchIndustryList("issuer")}
          >
            <GrFormClose />
          </div>
        </div>
      )}

      {filters?.industry && isAllInputFilled && (
        <div className="BadgesDiv">
          <span>{filters.industry}</span>
          <div
            className="CloseBadge"
            onClick={() => removeBadgeAndFetchIndustryList("industry")}
          >
            <GrFormClose />
          </div>
        </div>
      )}

      {filters?.topic && isAllInputFilled && (
        <div className="BadgesDiv">
          <span>{filters?.topic}</span>
          <div
            className="CloseBadge"
            onClick={() => removeBadgeAndFetchIndustryList("topic")}
          >
            <GrFormClose />
          </div>
        </div>
      )}

      {filters?.fromDate?.length > 0 &&
        filters?.toDate?.length > 0 &&
        isAllInputFilled && (
          <div className="BadgesDiv">
            <span>{`${moment(filters?.fromDate.join("-"), "DD-MM-YYYY").format(
              "DD MMM YYYY"
            )} to ${moment(filters?.toDate.join("-"), "DD-MM-YYYY").format(
              "DD MMM YYYY"
            )}`}</span>
            <div
              className="CloseBadge"
              onClick={() => removeBadgeAndFetchIndustryList("fromAndToDate")}
            >
              <GrFormClose />
            </div>
          </div>
        )}
      {(filters?.issuer !== "" ||
        filters?.industry !== "" ||
        filters?.topic !== "" ||
        (filters?.fromDate?.length > 0 && filters?.toDate?.length > 0)) &&
        isAllInputFilled && (
          <div
            className="BadgesDiv"
            onClick={() => removeBadgeAndFetchIndustryList("reset")}
          >
            <span>Reset all</span>
            <div className="CloseBadge">
              <GrFormClose />
            </div>
          </div>
        )}
    </div>
  );
};

export default SearchBadges;
