/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import filter from "../../../assets/Icons/Filters.png";
import MobileLeftSidebar from "../../OnBording/SubModules/DashBoardCO/components/MobileLeftSidebar";
import sideBarlogo from "../../../assets/Icons/sideBarlogo.png";
import togglemobile from "../../../assets/Icons/togglemobile.png";
import { isMobile } from "react-device-detect";
import closeIcon from "../../../assets/Icons/closeIcon.png";
import filterImage from "../../../assets/Icons/filter_background.png";
import { withRouter } from "react-router";
import { ImSearch } from "react-icons/im";
import { useRouteMatch } from "react-router";
import { Switch, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFilter,
  setIsSearch,
  getIndustryList,
  getUpdates,
} from "../redux/actions";
import Loading from "../../../CommonModules/sharedComponents/Loader";
import moment from "moment";

import NewRegulationDetail from "../NewRegulationDetail";
import NewRegulationFilter from "../NewRegulationFilter";
import NoResultFound from "../../../CommonModules/sharedComponents/NoResultFound";
import NewRegulationSearchResult from "../NewRegulationSearchResult";
import NewRegulationsQuiz from "../../NewRegulationsQuiz/index";
import "./style.css";
import NewRegulationSearchBadge from "../NewRegulationSearchBadge";
import axiosInstance from "../../../apiServices";
import { BACKEND_BASE_URL } from "../../../apiServices/baseurl";
import { toast } from "react-toastify";
import BackDrop from "../../../CommonModules/sharedComponents/Loader/BackDrop";
import Auth from "../../Authectication/components/Auth";
import { MdFilterListAlt } from "react-icons/md";
import { useDebounce } from "../../../CommonModules/helpers/custom.hooks";
import { onFileDownload } from "../../../CommonModules/helpers/file.helper";
import { getUsersListRequest } from "Components/ProjectManagement/redux/actions";
const NewRegulations = (props) => {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowRegulationDetail, setIsShowRegulationDetail] = useState(false);
  const [newRegulationDetail, setNewRegulationDetail] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [showHB, setShowHBMenu] = useState(false); // For showing Hamburger Menu
  const sideBarParent = useRef(null);
  const sideBarChild = useRef(null);
  // const [navigationHideShow, setNavigationHideShow] = useState(false);
  const [showSearchBoxMobile, setShowSearchBoxMobile] = useState(false);
  const [isShowMobileFilter, setIsShowMobileFilter] = useState(false);
  const [isShowRegulationDetailMobile, setIsShowRegulationDetailMobile] =
    useState(false);
  const { path } = useRouteMatch();
  const [loading, setLoading] = useState(false);
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [highlightSearchData, setHighlightSearchData] = useState({
    cursor: 0,
    searchResultTexts: [],
  });
  const debouncedSearchTerm = useDebounce(searchValue, 500);
  const filters = {
    issuer: [],
    industry: [],
    topic: [],
    from_date: "",
    to_date: "",
  };

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  //deconstruct updates reducer state values.
  const { isSuccess, isLoading, updateList, isFilterApplied, isSearch } =
    state.UpdatesReducer;
  const { industry, issuer, topic, from, to } = state.UpdatesReducer?.badges;
  useEffect(() => {
    const listOfFilters = [industry, issuer, topic, from, to].filter(
      (element) => element
    );
    setNumberOfFilters(listOfFilters?.length || 0);
  }, [industry, issuer, topic, from, to]);
  const onHBMenu = () => {
    // setNavigationHideShow(true);
    const drawerParent = sideBarParent;
    const drawerChild = sideBarChild;
    if (drawerParent) {
      drawerParent.current.classList.add("overlay");
      drawerChild.current.style.left = "0%";
    }
  };

  const handleKeyDown = (e) => {
    const { cursor, searchResultTexts } = highlightSearchData;
    if (e.keyCode === 38 && cursor > 0) {
      setHighlightSearchData({ ...highlightSearchData, cursor: cursor - 1 });
    } else if (e.keyCode === 40 && cursor < searchResultTexts?.length - 1) {
      setHighlightSearchData({ ...highlightSearchData, cursor: cursor + 1 });
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

  // clear filter
  useEffect(() => {
    dispatch(clearFilter());
    dispatch(getUsersListRequest());
  }, []);

  useEffect(() => {
    const filter = filters;
    fetchAndSetUpdates({ filters: filter });
  }, []);

  useEffect(() => {
    setIsShowFilter(false);
    setIsShowMobileFilter(false);
  }, [isSuccess]);

  useEffect(() => {
    if (
      props.history?.location?.state?.from === "notifications" &&
      props.history?.location?.state?.circular_id
    ) {
      fetchAndSetNewRegulationDetail(
        props.history?.location?.state?.circular_id
      );
    }
  }, []);

  const fetchAndSetUpdates = (filter) => {
    dispatch(getUpdates(filter));
  };
  const changeShowRegulationDetail = () => {
    setIsShowRegulationDetail(!isShowRegulationDetail);
  };

  const fetchAndSetNewRegulationDetail = async (updatesId) => {
    try {
      setNewRegulationDetail({});
      setLoading(true);

      if (updateList.length > 0) {
        const { data } = await axiosInstance.post(
          `${BACKEND_BASE_URL}compliance.api.getRegulationDetails`,
          {
            name: updatesId,
          }
        );

        if (data.message.status) {
          const { circular_details } = data.message;
          setNewRegulationDetail(circular_details);
          setLoading(false);
          setIsShowRegulationDetail(!isShowRegulationDetail);
          setIsShowRegulationDetailMobile(!isShowRegulationDetailMobile);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch circular details! Please try later");
    }
  };

  const setSeachTextAndFetchIndustryList = (event) => {
    const { value } = event.target;
    if (value !== "") {
      setSearchValue(value);
      dispatch(setIsSearch(true));
    } else {
      setSearchValue("");
      dispatch(setIsSearch(false));
      fetchAndSetUpdates();
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      const queryResult = document.querySelectorAll(
        ".new-regulation-search__highlighted-text"
      );
      setHighlightSearchData({
        ...highlightSearchData,
        searchResultTexts: [...queryResult],
      });
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const { cursor, searchResultTexts } = highlightSearchData;
    const cursorElement = searchResultTexts[cursor] || null;
    if (cursorElement) {
      [...searchResultTexts].forEach((el, index) => {
        if (cursor === index) {
          el.style.backgroundColor = "yellow";
        } else {
          el.style.backgroundColor = "inherit";
        }
      });
    }
  }, [highlightSearchData]);

  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { fontWeight: "bold", color: "#000" }
                : {}
            }
            className={`${
              part.toLowerCase() === highlight.toLowerCase()
                ? "new-regulation-search__highlighted-text"
                : ""
            }`}
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  };
  const getNewRegulationFilterList = async (isMobile) => {
    if (!isMobile) {
      setIsShowFilter(!isShowFilter);
    } else {
      setIsShowMobileFilter(!isShowMobileFilter);
    }
    dispatch(getIndustryList());
  };

  return (
    <>
      <Auth />
      <Switch>
        <Route exact path={path + "/quiz"}>
          <NewRegulationsQuiz key="new-regulations-quiz" />
        </Route>
        <Route exact path={path}>
          <div className="new-regulation-side-bar">
            <BackDrop isLoading={loading} />
            {isMobile && (
              <div id="sideBarParent" className="" ref={sideBarParent}>
                <div
                  id="sideBarChild"
                  className="leftSideBarFixed"
                  ref={sideBarChild}
                >
                  <MobileLeftSidebar
                    className="d-block d-md-none"
                    close={() => closeMobileSidebar()}
                  />
                </div>
              </div>
            )}

            <div className="new-regulation-container-mobile d-block d-md-none">
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
                    <h2 style={{ marginBottom: "2rem" }}>Filter</h2>
                    <div className="filter-wrapper-mobile">
                      <NewRegulationFilter
                        setIsShowFilter={setIsShowFilter}
                        isShowFilter={isShowFilter}
                        isShowMobileFilter={isShowMobileFilter}
                        setIsShowMobileFilter={setIsShowMobileFilter}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Regulation Details pop-up for mobile */}
              <div
                className={`regulation-details-popup-mobile ${
                  isShowRegulationDetailMobile &&
                  newRegulationDetail &&
                  newRegulationDetail?.name &&
                  "d-block"
                } d-lg-none `}
              >
                <div className=" regulation-details-popup-mobile--container">
                  <img
                    src={closeIcon}
                    alt="close-icon"
                    className="close--regulation-details-popup-mobile"
                    onClick={() => setIsShowRegulationDetailMobile(false)}
                  />
                  <div className=" regulation-details-popup-mobile--wrapper">
                    <div style={{ marginBottom: "1rem", width: "90%" }}>
                      <div className="tags" style={{ marginBottom: "1rem" }}>
                        <div className="tag-buttons">
                          {newRegulationDetail?.tags &&
                            newRegulationDetail?.tags.map((item) => (
                              <button className="tags-button">{item}</button>
                            ))}
                        </div>
                      </div>
                      <h5>{newRegulationDetail?.title}</h5>
                      <div className="w-100 d-flex justify-content-start mb-4">
                        <span className="license-code">
                          {newRegulationDetail?.circular_number}
                        </span>
                        <span className="date ml-3">
                          {newRegulationDetail?.date_issued &&
                            moment(newRegulationDetail?.date_issued).format(
                              "DD MMM YYYY"
                            )}
                        </span>
                      </div>
                    </div>
                    <div className="regulation-details-wrapper-mobile pr-2">
                      <div
                        className="regulation-details-html-mobile"
                        dangerouslySetInnerHTML={{
                          __html: newRegulationDetail?.description,
                        }}
                      />
                      <div className="regulation-details-html-mobile">
                        <a
                          href={newRegulationDetail?.circular_link}
                          target="blank"
                          className="download-file"
                        >
                          Issuer Link
                        </a>
                      </div>
                    </div>
                    <div className=" mt-3 d-flex align-items-center justify-content-between">
                      {newRegulationDetail?.file_details?.length > 0 && (
                        <button
                          onClick={() =>
                            onFileDownload(
                              newRegulationDetail?.file_details[0].file_id
                            )
                          }
                          className="download-file"
                        >
                          Download File
                        </button>
                      )}
                      <Link
                        to={{
                          pathname: path + "/quiz",
                          state: {
                            circular_no: newRegulationDetail?.name,
                          },
                        }}
                        className="download-file"
                      >
                        Quiz
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-block mobile-head d-md-none">
                {showHB === false && (
                  // <div className=" d-block d-sm-none pad-ms">
                  <div className="d-flex justify-content-between d-lg-none">
                    <div
                      className=""
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        onHBMenu();
                      }}
                    >
                      <img src={togglemobile} alt="toggle mobile" />
                    </div>
                    <div className="pr-4">
                      {" "}
                      <img
                        className="mobile-logo"
                        src={sideBarlogo}
                        alt="sideBarlogo"
                      />{" "}
                    </div>
                  </div>
                )}
                <div className="new-regulations-mobile-header justify-content-between">
                  {showSearchBoxMobile ? (
                    <div className="TopSearch">
                      <div className="SearchIcon">
                        <ImSearch />
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for updates"
                        onChange={(event) =>
                          setSeachTextAndFetchIndustryList(event)
                        }
                      />
                      <img
                        src={closeIcon}
                        alt="close-icon"
                        onClick={() =>
                          setShowSearchBoxMobile(!showSearchBoxMobile)
                        }
                        style={{
                          margin: "0 0.5rem",
                          height: "15px",
                          width: "15px",
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <h4>Updates</h4>
                      <div className="mobile-header-buttons-group">
                        <div
                          className="SearchIcon--black"
                          onClick={() =>
                            setShowSearchBoxMobile(!showSearchBoxMobile)
                          }
                        >
                          <ImSearch />
                        </div>
                        <div className="filter-counter">
                          <span className="black-background">
                            {numberOfFilters}
                          </span>
                          <img
                            src={filter}
                            alt="filter"
                            onClick={() => getNewRegulationFilterList(true)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="new-regulations-list my-5">
                  {isFilterApplied && <NewRegulationSearchBadge />}

                  {isSearch && <NewRegulationSearchResult />}
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <div className="title regulations-list-mobile">
                      {updateList?.length === 0 ? (
                        <NoResultFound text="No detail found" />
                      ) : (
                        updateList?.map((updates, index) => {
                          return (
                            <div
                              className="list"
                              onClick={() =>
                                fetchAndSetNewRegulationDetail(updates?.name)
                              }
                            >
                              <h2
                                className={
                                  state.UpdatesReducer.isSearch
                                    ? "new-regulation-title-search-active"
                                    : "new-regulation-title"
                                }
                              >
                                {updates?.topic &&
                                  getHighlightedText(
                                    updates.topic,
                                    searchValue
                                  )}
                              </h2>
                              <div className="description">
                                <p
                                  className={
                                    state.UpdatesReducer.isSearch
                                      ? "description-text-search-active"
                                      : "description-text"
                                  }
                                >
                                  {updates?.GistText &&
                                    getHighlightedText(
                                      updates.title,
                                      searchValue
                                    )}
                                </p>
                                <span
                                  className={
                                    state.UpdatesReducer.isSearch
                                      ? "date-search-active"
                                      : "date"
                                  }
                                >
                                  {updates?.date_issued &&
                                    getHighlightedText(
                                      moment(updates.date_issued).format(
                                        "DD MMM YYYY"
                                      ),
                                      searchValue
                                    )}
                                </span>
                              </div>
                              <span
                                className={
                                  state.UpdatesReducer.isSearch
                                    ? "license-number-search-active"
                                    : "license-number"
                                }
                              >
                                {updates?.circular_number &&
                                  getHighlightedText(
                                    updates.circular_number,
                                    searchValue
                                  )}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`filter-popup ${
                isShowFilter && "popup-open"
              } d-none d-md-block`}
              style={{
                boxShadow: isShowFilter
                  ? "1px 1px 9999px 9999px rgba(0,0,0,0.7)"
                  : "none",
                backgroundImage: `url(${filterImage})`,
                backgroundPosition: "right -157px bottom -155px",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="container" style={{ width: "300px" }}>
                <div className="popup-header d-flex align-items-center my-5">
                  <img
                    src={closeIcon}
                    alt="close-icon"
                    onClick={() => {
                      setIsShowFilter(!isShowFilter);
                    }}
                    style={{
                      marginRight: "2rem",
                      cursor: "pointer",
                    }}
                  />
                  <h3 style={{ marginBottom: "0px" }}>Filters</h3>
                </div>
                <NewRegulationFilter
                  setIsShowFilter={setIsShowFilter}
                  isShowFilter={isShowFilter}
                  isShowMobileFilter={isShowMobileFilter}
                  setIsShowMobileFilter={setIsShowMobileFilter}
                />
              </div>
            </div>
            <div className="d-none d-md-block w-100">
              <NewRegulationDetail
                isShowRegulationDetail={isShowRegulationDetail}
                changeShowRegulationDetail={changeShowRegulationDetail}
                newRegulationDetail={newRegulationDetail}
              />
            </div>
            <div className="new-regulation-container d-none d-md-block">
              <div className="row d-none d-md-block">
                <div className="col-md-12 p-0">
                  <div className="new-regulation-header">
                    <h2 className="main-title">
                      Updates{" "}
                      <MdFilterListAlt
                        className="ml-2 filter-image"
                        color={
                          filters.issuer !== "" ||
                          filters.industry !== "" ||
                          filters.topic !== "" ||
                          filters.fromDate !== "" ||
                          filters.toDate !== ""
                            ? "#666666"
                            : "#7a73ff"
                        }
                        onClick={() =>
                          getNewRegulationFilterList(!isShowMobileFilter)
                        }
                      />
                    </h2>

                    <div className="TopSearch">
                      <div className="SearchIcon">
                        <ImSearch />
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for updates"
                        onChange={(event) =>
                          setSeachTextAndFetchIndustryList(event)
                        }
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12 regulations-scroll d-none d-md-block">
                  {isFilterApplied && <NewRegulationSearchBadge />}

                  {isSearch && <NewRegulationSearchResult />}

                  <div>
                    <div className="title d-none d-md-block">
                      {isLoading && updateList.length === 0 ? (
                        <Loading />
                      ) : !isLoading && updateList.length === 0 ? (
                        <NoResultFound text="No detail found" />
                      ) : (
                        updateList?.map((updates, index) => {
                          return (
                            <div
                              className="list"
                              key={`updates-list-key-${index}`}
                              onClick={() => {
                                fetchAndSetNewRegulationDetail(updates?.name);
                                setIsShowRegulationDetailMobile(
                                  !isShowRegulationDetailMobile
                                );
                              }}
                            >
                              <h2
                                className={
                                  state.UpdatesReducer.isSearch
                                    ? "new-regulation-title-search-active"
                                    : "new-regulation-title"
                                }
                              >
                                {updates?.topic &&
                                  getHighlightedText(
                                    updates.topic,
                                    searchValue
                                  )}
                              </h2>
                              <div className="description">
                                <p
                                  className={
                                    state.UpdatesReducer.isSearch
                                      ? "description-text-search-active"
                                      : "description-text"
                                  }
                                >
                                  {" "}
                                  {updates?.title &&
                                    getHighlightedText(
                                      updates?.title,
                                      searchValue
                                    )}
                                </p>
                              </div>
                              <div className="description-details">
                                <div className="license-details">
                                  <span
                                    className={
                                      state.UpdatesReducer.isSearch
                                        ? "license-number-active"
                                        : "license-number"
                                    }
                                  >
                                    {updates?.circular_number &&
                                      getHighlightedText(
                                        updates.circular_number,
                                        searchValue
                                      )}
                                  </span>
                                </div>
                                <span
                                  className={
                                    state.UpdatesReducer.isSearch
                                      ? "date-active"
                                      : "date"
                                  }
                                >
                                  {updates?.date_issued &&
                                    moment(updates.date_issued).format(
                                      "Do MMM YY"
                                    )}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </>
        )} */}
          </div>
        </Route>
      </Switch>
    </>
  );
};

export default withRouter(NewRegulations);
