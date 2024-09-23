import React, { useState, useEffect } from "react";
import "./style.css";
import assignIcon1 from "../../../../assets/Icons/assignIcon.png";
import assignIcon3 from "../../../../assets/Icons/assignIcon2.png";
import assignIcon5 from "../../../../assets/Icons/assignIcon3.png";
import assignIcon2 from "../../../../assets/Icons/assignIcon4.png";
import assignIcon4 from "../../../../assets/Icons/assignIcon5.png";
import RightImageBg from "../../../../assets/Images/Onboarding/RectangleOnboadign.png";
import search from "../../../../assets/Icons/search.png";

import closeIcon from "../../../../assets/Icons/closeIcon.png";
import closeIconGray from "../../../../assets/Icons/closeIconGray.png";
import searchIcon from "../../../../assets/Icons/searchIcon.png";
import { useDispatch, useSelector } from "react-redux";
import { actions as companyActions } from "../../redux/actions";

function ChooseLicenses({
  fields,
  setFields,
  close,
  companyInfo,
  setCompanyInfo,

  liecenseData,
  setLiecenseData,
  currentSelectedIndex,
  category,
  setCategory,
}) {
  const state = useSelector((state) => state);
  const [searchEnable, setSearchEnable] = useState(false);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const [checkedLiecense, setCheckedLiecense] = useState(new Map());
  const [licenseList, setLicenseList] = useState({});
  const [searchLiecenseData, setSearchLienceseData] = useState([]);
  const [selectedLiecenseIdArray, setSelectedLicenseIdArray] = useState([]);
  const [parentCheckBox, setParentCheckBox] = useState([]);

  const userID =
    state &&
    state.complianceOfficer &&
    state.complianceOfficer.personalInfo &&
    state.complianceOfficer.personalInfo.data &&
    state.complianceOfficer.personalInfo.data[0][0] &&
    state.complianceOfficer.personalInfo.data[0][0] &&
    state.complianceOfficer.personalInfo.data[0][0].UserDetails &&
    state.complianceOfficer.personalInfo.data[0][0].UserDetails[0] &&
    state.complianceOfficer.personalInfo.data[0][0].UserDetails[0].UserID;

  const licenseInfo =
    state &&
    state.complianceOfficer &&
    state.complianceOfficer?.companyInfo &&
    state.complianceOfficer?.companyInfo?.licenseList?.licenseList;

  const categoryName =
    fields &&
    fields[currentSelectedIndex] &&
    fields[currentSelectedIndex].category;

  useEffect(() => {
    // list[currentSelectedIndex].parentLicense = [];
    // list[currentSelectedIndex].selectedLiecenseIdArray = [];
    setSelectedLicenseIdArray([]);
    setParentCheckBox([]);
  }, [categoryName, currentSelectedIndex]);

  useEffect(() => {
    console.log("sdfadsfsd");
    if (companyInfo && companyInfo !== "")
      //  setSelectedLicenseIdArray([]);
      dispatch(
        companyActions.companyTypeRequest({
          country: "India",
          category:
            fields &&
            fields[currentSelectedIndex] &&
            fields[currentSelectedIndex].category,
          eid: "",
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName, currentSelectedIndex]);

  useEffect(() => {
    let temp =
      fields &&
      fields[currentSelectedIndex] &&
      fields[currentSelectedIndex].selectedLiecenseIdArray;
    let parentCheckBox =
      fields &&
      fields[currentSelectedIndex] &&
      fields[currentSelectedIndex].parentLicense;
    setSelectedLicenseIdArray(temp);
    setParentCheckBox(parentCheckBox);
  }, [currentSelectedIndex, fields, setFields]);

  useEffect(() => {
    setLicenseList(state.complianceOfficer?.licenseList?.licenseList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [licenseInfo]);

  const onClickLiencesCheckbox = (e, item) => {
    var array = [...selectedLiecenseIdArray];
    if (e.target.classList.contains("sub-checkbox")) {
      if (e.target.checked) {
        array.push(parseInt(item.LicenseId));
        const uniqueArray = Array.from(new Set(array));
        let list = [...fields];
        list[currentSelectedIndex].selectedLiecenseIdArray = uniqueArray;
        setFields(list);
      } else {
        var parentChkbox = parentCheckBox;
        var index = parentChkbox.indexOf(item.Category);
        if (index !== -1) {
          parentChkbox.splice(index, 1);
        }
        const newArray = array.filter(
          (checkedItem) => checkedItem !== parseInt(item.LicenseId)
        );
        let list = [...fields];
        list[currentSelectedIndex].selectedLiecenseIdArray = newArray;
        list[currentSelectedIndex].parentLicense = parentChkbox;
        setFields(list);
        e.target
          .closest(".drower")
          .querySelector(".down-arrow .custom-control-input").checked = false;
      }
    } else {
      if (e.target.checked) {
        parentChkbox =
          parentCheckBox && parentCheckBox.length > 0 ? parentCheckBox : [];
        parentChkbox.push(item[0]);
        item[1].forEach((item) => array.push(parseInt(item.LicenseId)));
        const uniqueArray = Array.from(new Set(array));
        let list = [...fields];
        list[currentSelectedIndex].selectedLiecenseIdArray = uniqueArray;
        list[currentSelectedIndex].parentLicense = parentChkbox;
        setFields(list);
      } else {
        if (index !== -1) {
          parentChkbox.splice(index, 1);
        }
        let tempObj = [];
        const filteredArray = array.filter(function (x) {
          return tempObj.indexOf(x) < 0;
        });
        let list = [...fields];
        list[currentSelectedIndex].selectedLiecenseIdArray = filteredArray;
        list[currentSelectedIndex].parentLicense = parentChkbox;
        setFields(list);
      }
    }
  };
  const onClickLiencesCheckboxInserach = (e, item) => {
    var array = [...selectedLiecenseIdArray];
    if (e.target.classList.contains("custom-search-checkbox")) {
      if (e.target.checked) {
        array.push(parseInt(item.LicenseId));
        const uniqueArray = Array.from(new Set(array));
        let list = [...fields];
        list[currentSelectedIndex].selectedLiecenseIdArray = uniqueArray;
        setFields(list);
      } else {
        const newArray = array.filter(
          (checkedItem) => checkedItem !== parseInt(item.LicenseId)
        );
        let list = [...fields];
        list[currentSelectedIndex].selectedLiecenseIdArray = newArray;
        setFields(list);
        e.target
          .closest(".search-list")
          .querySelector(
            ".down-arrow-search .custom-control-input"
          ).checked = false;
      }
    } else {
      if (e.target.checked) {
        item[1] &&
          item[1].forEach((item) => array.push(parseInt(item.LicenseId)));
        const uniqueArray = Array.from(new Set(array));
        let list = [...fields];
        list[currentSelectedIndex].selectedLiecenseIdArray = uniqueArray;
        setFields(list);
      } else {
        let tempObj = [];
        const filteredArray = array.filter(function (x) {
          return tempObj.indexOf(x) < 0;
        });
        let list = [...fields];
        list[currentSelectedIndex].selectedLiecenseIdArray = filteredArray;
        setFields(list);
      }
    }
  };

  const groupBy = (objectArray, property) => {
    if (objectArray && objectArray.length > 0)
      return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
  };

  const renderCheckBox = (item, index) => {
    let temp = item[0];
    return (
      <input
        type="checkbox"
        value={temp}
        onChange={(e) => onClickLiencesCheckbox(e, item)}
        className="custom-control-input"
        id={temp}
        name={temp}
        checked={
          parentCheckBox &&
          parentCheckBox.length > 0 &&
          parentCheckBox.includes(item[0])
        }
      />
    );
  };
  const onClickArrow = (index) => {
    const color = document.getElementById(`grid${index}`);
    const arrow = document.getElementById(`arrow${index}`);
    const SortBar = document.getElementById(`content${index}`);
    if (arrow && SortBar) {
      if (
        arrow.classList.contains("downArrow") &&
        SortBar.classList.contains("accordian-bar-with-min")
      ) {
        arrow.classList.remove("downArrow");
        arrow.classList.add("upArrow");
        color.classList.add("accordian-grid-active");
        SortBar.classList.add("filter-price-height");
        SortBar.classList.add("accordian-bar-with-fullheight");
      } else if (
        arrow.classList.contains("upArrow") &&
        SortBar.classList.contains("filter-price-height")
      ) {
        SortBar.classList.remove("filter-price-height");
        SortBar.classList.remove("accordian-bar-with-fullheight");
        arrow.classList.remove("upArrow");
        color.classList.remove("accordian-grid-active");
        arrow.classList.add("downArrow");
      }
    }
  };
  const setCerificateDetails = () => {
    let arr = checkedLiecense;
    let selectedLicenseId = [];
    if (arr.size !== 0)
      for (let pair of arr) {
        var [key] = pair;
        // eslint-disable-next-line no-loop-func
        [...licenseList].map((item) => {
          for (let value of item[1]) {
            if (value.Category === key) {
              selectedLicenseId.push(value.LicenseId);
            }
          }
          return 0;
        });
      }
    let list = [...fields];
    setTimeout(() => {}, 500);
    list[currentSelectedIndex].countShow = true;
    list[currentSelectedIndex].liecenseData =
      fields[currentSelectedIndex].selectedLiecenseIdArray;
    list[currentSelectedIndex].currentIndex = currentSelectedIndex;
    list[currentSelectedIndex].liecenseCount =
      fields[currentSelectedIndex].selectedLiecenseIdArray.length;
    setFields(list);
    const licenseIDgrpStr = fields[currentSelectedIndex].liecenseData.join(",");
    dispatch(
      companyActions.insertCerificateDetailsRequest({
        licenseSubID: 0,
        entityId: 0,
        userId: userID,
        entityName: fields && fields[currentSelectedIndex].companyName,
        status: 0,
        category: fields && fields[currentSelectedIndex].category,
        cmptype: fields && fields[currentSelectedIndex].EntityTypeID,
        licenseIDgrp: licenseIDgrpStr,
      })
    );

    close();
    setSearchEnable(false);
  };

  const handleSearch = (e) => {
    if (e.target.value !== "") {
      let filterData = [];
      let searchData = [];
      licenseList &&
        licenseList.length > 0 &&
        [...licenseList].map((item) => {
          item[1] &&
            item[1].length > 0 &&
            item[1].filter((data) => {
              var filterKey = e.target.value.toUpperCase();
              if (data.hasOwnProperty("LicenseCode")) {
                if (data.LicenseCode.toUpperCase().indexOf(filterKey) > -1) {
                  return filterData.push(data);
                }
              }
              return null;
            });
          return 0;
        });
      if (filterData && filterData.length > 0) {
        searchData = groupBy(filterData, "Category");
        setSearchLienceseData(Object.entries(searchData));
      } else {
        setSearchLienceseData([]);
      }
    } else {
      setSearchLienceseData([]);
    }
    setSearchText(e.target.value);
  };

  const closeSearch = () => {
    setCheckedLiecense(new Map());
    setSearchLienceseData([]);
    setSearchEnable(false);
    setSearchText("");
  };

  const closeButtonCall = () => {
    //let list = [...fields];
    // list[currentSelectedIndex].countShow = false;
    //setFields(list);
    setCheckedLiecense(new Map());
    close();
  };
  const renderChekboxInSearch = (item, itemParent) => {
    return (
      <div className="row">
        <div className="col-12 pl-1">
          {/* <div className="search-category-title">{itemParent}</div> */}
        </div>
        <div className="col-12 col-md-8 col-sm-8 col-xl-8">
          <div className="two-icon choose-licence-btn">
            <div className="down-arrow-search">
              <div className="custom-control custom-checkbox">
                <input
                  style={{ cursor: "pointer" }}
                  value={item.LicenseId}
                  type="checkbox"
                  onChange={(e) => onClickLiencesCheckboxInserach(e, item)}
                  className="custom-control-input custom-search-checkbox"
                  id={`search${item.LicenseId}`}
                  name="example3"
                  checked={
                    selectedLiecenseIdArray &&
                    selectedLiecenseIdArray.length > 0 &&
                    selectedLiecenseIdArray.includes(item.LicenseId)
                  }
                />
                <label
                  className="custom-control-label"
                  htmlFor={`search${item.LicenseId}`}
                >
                  &nbsp;
                </label>
              </div>
            </div>
            <div className="list-search">
              {item.LicenseCode}:{" "}
              <span className="small-gray">{item.LicenseDesc}</span>
            </div>
          </div>
          <div className="serch-num d-block d-sm-none">
            {item.TaskCount} Task
          </div>
        </div>
        <div className="col-4 col-md-4 col-sm-4 col-xl-4 pl-0 d-none d-sm-block">
          <div className="serch-num">{item.TaskCount} Task</div>
        </div>
      </div>
    );
  };

  const chooseImage = (index) => {
    if (index === 0 || index % 5 === 0) {
      return assignIcon1;
    }
    if (index === 1 || index % 5 === 1) {
      return assignIcon2;
    }
    if (index === 2 || index % 5 === 2) {
      return assignIcon3;
    }
    if (index === 3 || index % 5 === 3) {
      return assignIcon4;
    }
    if (index === 4 || index % 5 === 4) {
      return assignIcon5;
    }
  };

  return (
    <div className="get-main">
      <div className="container-fluid pl-0 pr-0">
        <div className="col-12 padding-right d-block d-sm-none">
          <img
            className="bottom-right-bg-drower1"
            src={RightImageBg}
            alt="RightImageBg"
          />
        </div>
        <div className="choose-licenses">
          <div className="choose-licenses-title">
            <div className="d-flex">
              <div className="col-6 pl-0">
                <img
                  className="closeIcon"
                  onClick={() => closeButtonCall()}
                  src={closeIcon}
                  alt="closeIcon"
                />
              </div>
              <div className="col-6 pl-0 d-block d-sm-none text-right mt-0 mobile-right-0">
                <button
                  class="btn mb-2 save-details common-button-next"
                  disabled={
                    selectedLiecenseIdArray &&
                    selectedLiecenseIdArray.length === 0
                  }
                  onClick={() => setCerificateDetails()}
                >
                  CONFIRM
                </button>
              </div>
            </div>
            {!searchEnable && (
              <p className="licenses-title">
                {" "}
                Choose Licenses{" "}
                <span className="mobile-right-0 search-icon">
                  <img
                    onClick={() => setSearchEnable(true)}
                    src={search}
                    alt="search Icon"
                  />
                </span>
              </p>
            )}
          </div>
        </div>
        {searchEnable && (
          <div className="searchBox">
            <div className="input-group form-group">
              <img className="IconGray" src={searchIcon} alt="search Icon" />
              <input
                className="form-control"
                type="text"
                placeholder="Search Licenses"
                value={searchText}
                onChange={(e) => handleSearch(e)}
                id="example-search-input"
              />
              <span className="input-group-append">
                <button
                  onClick={() => closeSearch()}
                  className="btn border-start-0 border-top-0 border-bottom-0 border-0 ms-n5"
                  type="button"
                >
                  <img src={closeIconGray} alt="close Icon" />
                </button>
              </span>
            </div>
          </div>
        )}
        <div className="scroll-div">
          {searchEnable &&
            searchLiecenseData &&
            searchLiecenseData.length > 0 &&
            searchLiecenseData.map((data, key) => (
              <div className="searchGrid search-list">
                {/* <div className="col-12 d-block d-sm-none pl-0">
                  <div className="serchlist-title">Search Results:</div>
                </div> */}
                <div className="search-detail-grid">
                  <div className="serchlist-title">Search Results:</div>
                  {data[1].map((subTask) =>
                    renderChekboxInSearch(subTask, data[0])
                  )}
                </div>
              </div>
            ))}
          {searchEnable === false && (
            <div className="scroll-div">
              {licenseList &&
                licenseList.length > 0 &&
                licenseList.map((item, index) => (
                  <div
                    key={index}
                    id={`grid${item}`}
                    className="accordian-grid drower"
                  >
                    <div className="row">
                      <div className="col-10 col-sm-7 col-md-7 col-xl-7">
                        <div className="two-icon choose-licence-btn">
                          <div className="down-arrow">
                            <div className="custom-control custom-checkbox">
                              {renderCheckBox(item, index)}
                              <label
                                className="custom-control-label"
                                htmlFor={item.industry}
                              >
                                &nbsp;
                              </label>
                            </div>
                          </div>
                          <div className="assign-icon">
                            <img
                              src={chooseImage(index)}
                              alt="assignIcon"
                              style={
                                chooseImage(index) === assignIcon4
                                  ? { height: 44, width: 44 }
                                  : {}
                              }
                            />
                          </div>
                          <div className="gst-type-licence">
                            {item.industry}
                            <div className="count-task-num d-block d-sm-none">
                              {" "}
                              {item.license &&
                                item.license.length} Licenses{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4 col-sm-3 col-md-3 pl-0 d-none d-sm-block">
                        <div className="count-task-num">
                          {" "}
                          {item.license && item.license.length} Licenses{" "}
                        </div>
                      </div>
                      <div
                        onClick={() => onClickArrow(index)}
                        className="col-2 col-sm-2 col-md-2"
                      >
                        <div className="liecense down-arrow float-right mobile-right">
                          <div id={`arrow${index}`} className="downArrow" />
                        </div>
                      </div>
                    </div>
                    <div
                      id={`content${item}`}
                      className="accordian-bar-with-min accordian-grid accordian-grid-active border-0"
                    >
                      <div>
                        {item.license.map((subTask, indexx) => (
                          <div className="row">
                            <div className="col-10 col-sm-7 col-md-7 col-xl-7">
                              <div className="two-icon choose-licence-btn">
                                <div className="down-arrow">
                                  <div className="custom-control custom-checkbox">
                                    {renderCheckBox(subTask, indexx)}
                                    <label
                                      className="custom-control-label"
                                      htmlFor={subTask.name}
                                    >
                                      &nbsp;
                                    </label>
                                  </div>
                                </div>

                                <div>
                                  {subTask.name}
                                  <div className="count-task-num d-block d-sm-none">
                                    {" "}
                                    {subTask.sublicense &&
                                      subTask.sublicense.length}{" "}
                                    Licenses{" "}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-4 col-sm-3 col-md-3 pl-0 d-none d-sm-block">
                              <div className="count-task-num">
                                {" "}
                                {subTask.sublicense &&
                                  subTask.sublicense.length}{" "}
                                Licenses{" "}
                              </div>
                            </div>
                            <div
                              onClick={() => onClickArrow(index)}
                              className="col-2 col-sm-2 col-md-2"
                            >
                              <div className="liecense down-arrow float-right mobile-right">
                                <div
                                  id={`arrow${index}`}
                                  className="downArrow"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="bottom-logo-strip-drower">
          <div className="row aligncenter">
            <div className="col-12">
              <button
                disabled={
                  selectedLiecenseIdArray &&
                  selectedLiecenseIdArray.length === 0
                }
                onClick={() => setCerificateDetails()}
                className="btn save-details common-button-drower  mb-2"
                style={{
                  backgroundColor:
                    selectedLiecenseIdArray &&
                    selectedLiecenseIdArray.length === 0
                      ? "#e4e4e4"
                      : "#6c5dd3",
                  color:
                    selectedLiecenseIdArray &&
                    selectedLiecenseIdArray.length === 0 &&
                    "#aeaeae",
                }}
              >
                {selectedLiecenseIdArray && selectedLiecenseIdArray.length}{" "}
                licenses selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChooseLicenses;
