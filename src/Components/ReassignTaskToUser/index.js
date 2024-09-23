import React, { useEffect, useState, useReducer } from "react";
import { Modal } from "react-responsive-modal";
import moment from "moment";
import "./style.css";
import check from "../../assets/Icons/check.png";
import uncheck from "../../assets/Icons/uncheck.png";
import closeIconGray from "../../assets/Icons/closeIconGray.png";
import closeIcon from "../../assets/Icons/closeIcon.png";
import plusIcon from "../../assets/Icons/plusIcon3.png";
import Datepicker from "../../CommonModules/sharedComponents/Datepicker/index";
import constants from "../../CommonModules/sharedComponents/constants/constant";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import reducer from "./reducer";
import validator from "validator";
import { actions as taskReportActions } from "../OnBoarding/SubModules/DashBoardCO/redux/actions";
import {
  getInitials,
  isDifferenceIsMoreThanOneYear,
  isBeforeToday,
  isMoreThanOneYearFromToday,
  isToDateBeforeFromDate,
  searchUsers,
} from "./utilties";
import apiServices from "../OnBoarding/SubModules/DashBoardCO/api/index";
import axiosInstance from "../../apiServices";
import { getUserLlistByUserType } from "../OnBoarding/SubModules/DashBoardCO/components/RightSideGrid";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
function ReAssignTasksToUserModal({
  openModal,
  setShowModal,

  userId,
  isSingleTask,

  memberList,
  user,
  isTeamMember,
  company,
  deactivateUser,
}) {
  const { getUsersByRole } = apiServices;
  const [isAllInputFilled, setIsAllInputFilled] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const dispatcher = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [{ from, to, dueOn }, dispatch] = useReducer(reducer, {
    from: [],
    to: [],
    dueOn: [],
  });
  const [searchValue, setSearchValue] = useState("");
  const [assignTo, setAssignTo] = useState({});
  const [filter, setFilter] = useState({});
  const [isEmailValidationLoading, setIsEmailValidationLoading] =
    useState(false);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const FilterTypes = constants.ReAssignFilterTypes;

  const handleClose = () => {
    setAssignTo({});
    setFilter({});
    setShowModal(false);
    dispatch({ type: "CLEAR_STATE" });
  };

  useEffect(() => {
    if (isSingleTask && openModal && company) {
      try {
        getUsersByRole({ isFromAssignPage: true }).then((response) => {
          const { data, status } = response;
          if (
            status === 200 &&
            data &&
            data.message &&
            data.message.length !== 0
          ) {
            const users = getUserLlistByUserType(
              data.message,
              isTeamMember ? 4 : 5
            ).filter((item) => item?.email !== userId);
            setData(users || []);
          }
        });
      } catch (error) {
        toast.error("Something went wrong. Please try again");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, isSingleTask]);

  const handleReAssign = async (assignToUser) => {
    deactivateUser(assignToUser.email);
  };

  const checkEmailAvailability = () => {
    if (validator.isEmail(debouncedSearchValue)) {
      setIsEmailValidationLoading(true);
      axiosInstance
        .post(`compliance.api.avabilityCheck`, {
          email: debouncedSearchValue,
        })
        .then((response) => {
          if (
            response &&
            response.data &&
            response?.data?.message?.status === true
          ) {
            setIsEmailAvailable(true);
          } else {
            setIsEmailAvailable(false);
          }
          setIsEmailValidationLoading(false);
        })
        .catch((err) => {
          console.log("error =>  ", err);
          setIsEmailValidationLoading(false);
        });
    }
  };

  // For updating selected dates in state variables.
  useEffect(() => {
    if (filter.name === FilterTypes.migrateAllTasksInDateRange) {
      setFilter({
        name: FilterTypes.migrateAllTasksInDateRange,
        value: {
          from: from,
          to: to,
        },
      });
    }
    if (filter.name === FilterTypes.migrateAllTasksOfParticularDate) {
      setFilter({
        name: FilterTypes.migrateAllTasksOfParticularDate,
        value: {
          dueOn: dueOn,
        },
      });
    }
  }, [
    from,
    to,
    dueOn,
    filter.name,
    FilterTypes.migrateAllTasksInDateRange,
    FilterTypes.migrateAllTasksOfParticularDate,
  ]);

  // For checking is all input filled
  useEffect(() => {
    if (
      Object.entries(assignTo).length !== 0 &&
      Object.entries(filter).length !== 0
    ) {
      if (filter.name === FilterTypes.migrateAllTasksForever) {
        setIsAllInputFilled(true);
      } else if (
        filter.name === FilterTypes.migrateAllTasksOfParticularDate &&
        filter.value.dueOn &&
        filter.value.dueOn.length !== 0 &&
        filter.value.dueOn.length === 3 &&
        !isBeforeToday(filter.value.dueOn) &&
        !isMoreThanOneYearFromToday(filter.value.dueOn)
      ) {
        setIsAllInputFilled(true);
      } else if (
        filter.name === FilterTypes.migrateAllTasksInDateRange &&
        filter.value.from &&
        filter.value.to &&
        filter.value.from.length !== 0 &&
        filter.value.to.length !== 0 &&
        filter.value.from.length === 3 &&
        filter.value.to.length === 3 &&
        !isBeforeToday(filter.value.from) &&
        !isMoreThanOneYearFromToday(filter.value.from) &&
        !isBeforeToday(filter.value.to) &&
        !isMoreThanOneYearFromToday(filter.value.to) &&
        !isDifferenceIsMoreThanOneYear(filter.value.from, filter.value.to) &&
        !isToDateBeforeFromDate(filter.value.from, filter.value.to)
      ) {
        setIsAllInputFilled(true);
      } else {
        setIsAllInputFilled(false);
      }
    } else {
      setIsAllInputFilled(false);
    }
  }, [
    assignTo,
    filter,
    from,
    to,
    dueOn,
    FilterTypes.migrateAllTasksForever,
    FilterTypes.migrateAllTasksOfParticularDate,
    FilterTypes.migrateAllTasksInDateRange,
  ]);
  useEffect(() => {
    console.log("Effect");
    if (assignTo && Object.keys(assignTo).length !== 0 && isSingleTask) {
      handleReAssign(assignTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignTo]);

  useEffect(() => {
    if (
      debouncedSearchValue &&
      validator.isEmail(debouncedSearchValue) &&
      searchUsers(debouncedSearchValue, memberList || data)?.length === 0
    ) {
      // check email
      checkEmailAvailability();
    }
  }, [debouncedSearchValue]);
  return (
    <Modal
      center={true}
      showCloseIcon={false}
      open={openModal}
      onClose={handleClose}
      classNames={{
        modalContainer: "customReAssignModalContainerMobile",
        modal: "customReAssignModalMobile",
      }}
    >
      <BackDrop isLoading={isLoading} />
      <div className="re-container">
        {Object.entries(assignTo).length === 0 && (
          <div className="modal-top">
            <h5>Re-assign to </h5>
            <img src={closeIcon} alt="cross" onClick={handleClose} />
          </div>
        )}
        <div className="header">
          {Object.entries(assignTo).length === 0 && (
            <div className="header-controls">
              <input
                type="text"
                className="form-control"
                placeholder="Enter name or email"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <span>or</span>
              <button
                className="btn re-assign-to-me"
                onClick={() => {
                  setAssignTo({
                    EmailID: auth.loginInfo.email,
                    UserName: auth.loginInfo.UserName,
                    UserType: auth.loginInfo.UserType,
                    UserID: auth.loginInfo.UserID,
                    email: auth.loginInfo.email,
                    full_name: auth.loginInfo.UserName,
                  });
                }}
              >
                Re-assign to me
              </button>
            </div>
          )}
          {Object.entries(assignTo).length !== 0 && (
            <div className="header-after-selected">
              <div className="selected-member">
                <span className="circle-dp">
                  {getInitials(assignTo.full_name)}
                </span>
                <span className="member-name">{assignTo.full_name}</span>
                <img
                  src={closeIconGray}
                  alt="croxx"
                  onClick={() => setAssignTo({})}
                />
              </div>
              <img src={closeIcon} alt="cross" onClick={handleClose} />
            </div>
          )}
        </div>
        <div className="main-content">
          {Object.entries(assignTo).length === 0 && (
            <div
              className="members-list"
              style={{ overflowY: "auto", maxHeight: "390px" }}
            >
              {/* {data && data.length > 0 ? (
                data.map((member) => { */}
              {searchUsers(debouncedSearchValue, memberList || data) &&
              searchUsers(debouncedSearchValue, memberList || data).length >
                0 ? (
                searchUsers(debouncedSearchValue, memberList || data).map(
                  (member, index) => {
                    const { email, full_name } = member;

                    return (
                      <article
                        className="member"
                        key={index}
                        onClick={() =>
                          setAssignTo({
                            email: member.email,
                            first_name: member.first_name,
                            full_name: member.full_name,
                          })
                        }
                      >
                        <span className="circle-dp">
                          {getInitials(full_name)}
                        </span>
                        <span className="member-name">{full_name}</span>
                        <span className="member-email">{email}</span>
                      </article>
                    );
                  }
                )
              ) : (
                <>
                  {!isEmailAvailable && !isEmailValidationLoading ? (
                    <span
                      className="last-email-box email-list-row"
                      style={{
                        textAlign: "center",
                        opacity: "inherit",
                      }}
                      onClick={() => {
                        if (window.location.href.includes("settings")) {
                          setAssignTo({
                            email: searchValue,
                            first_name: searchValue,
                            full_name: searchValue,
                          });
                        } else {
                          handleReAssign(searchValue);
                        }
                      }}
                    >
                      {/* No records Available */}
                      {searchValue !== "" && validator.isEmail(searchValue) && (
                        <div className="dropbox-add-line">
                          <img src={plusIcon} alt="account Circle Purple" />
                          {`Invite '${searchValue}' via email`}
                        </div>
                      )}
                    </span>
                  ) : isEmailValidationLoading ? (
                    <Dots />
                  ) : (
                    <p className="text-danger invalid-feedback d-block">
                      Email already exists
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          {Object.entries(assignTo).length !== 0 && !isSingleTask && (
            <>
              <div className="filters">
                {/* <div
									className="filter"
									onClick={() => {
										if (
											filter.name ===
											FilterTypes.migrateAllTasksOfParticularDate
										) {
											setFilter({});
											return;
										}
										setFilter({
											name: FilterTypes.migrateAllTasksOfParticularDate,
											value: {
												dueOn: [],
											},
										});
									}}
								>
									<p>
										<img
											src={
												filter.name ===
													FilterTypes.migrateAllTasksOfParticularDate
													? check
													: uncheck
											}
											alt="check"
										/>{" "}
										<span>Re-assign task due on</span>
									</p>
								</div>
								{filter.name ===
									FilterTypes.migrateAllTasksOfParticularDate && (
										<div className="date-input-container">
											<div className="form-group d-flex align-items-start my-3">
												<label>Date:</label>
												<div className="d-flex flex-column">
													<Datepicker
														name="DueOn"
														dispatch={dispatch}
														actionType="SET_DUE_DATE"
													/>
													<p className="warnings">
														{isBeforeToday(filter.value.dueOn) !== undefined &&
															isBeforeToday(filter.value.dueOn) && (
																<small>
																	{"* " +
																		constants.errorMessage.errorDueToBeforeDate}
																</small>
															)}
														{isMoreThanOneYearFromToday(filter.value.dueOn) &&
															isMoreThanOneYearFromToday(filter.value.dueOn) && (
																<small>
																	{"* " +
																		constants.errorMessage
																			.errorDueToMoreThanOneYearDateFromToday}
																</small>
															)}
													</p>
												</div>
											</div>
										</div>
									)}
								<div
									className="filter"
									onClick={() => {
										if (
											filter.name === FilterTypes.migrateAllTasksInDateRange
										) {
											setFilter({});
											return;
										}
										setFilter({
											name: FilterTypes.migrateAllTasksInDateRange,
											value: {
												from: [],
												to: [],
											},
										});
									}}
								>
									<p>
										<img
											src={
												filter.name === FilterTypes.migrateAllTasksInDateRange
													? check
													: uncheck
											}
											alt="check"
										/>{" "}
										<span>
											Re-assign this task to {assignTo.full_name} for a specific
											duration
										</span>
									</p>
								</div>
								{filter.name === FilterTypes.migrateAllTasksInDateRange && (
									<div className="date-input-container">
										<div className="form-group d-flex align-items-start my-3">
											<label>From:</label>
											<div className="d-flex flex-column">
												<Datepicker
													name="From"
													dispatch={dispatch}
													actionType="SET_FROM_DATE"
												/>
												<p className="warnings">
													{isBeforeToday(filter.value.from) !== undefined &&
														isBeforeToday(filter.value.from) && (
															<small className="d-block">
																{"* " +
																	constants.errorMessage.errorDueToBeforeDate}
															</small>
														)}
													{isMoreThanOneYearFromToday(filter.value.from) !==
														undefined &&
														isMoreThanOneYearFromToday(filter.value.from) && (
															<small className="d-block">
																{"* " +
																	constants.errorMessage
																		.errorDueToMoreThanOneYearDateFromToday}
															</small>
														)}
												</p>
											</div>
										</div>
										<div className="form-group d-flex align-items-start my-3">
											<label>To:</label>
											<div className="d-flex flex-column">
												<Datepicker
													name="To"
													dispatch={dispatch}
													actionType="SET_TO_DATE"
												/>
												<p className="warnings">
													{isBeforeToday(filter.value.to) !== undefined &&
														isBeforeToday(filter.value.to) && (
															<small className="d-block">
																{"* " +
																	constants.errorMessage.errorDueToBeforeDate}
															</small>
														)}
													{isMoreThanOneYearFromToday(filter.value.to) !==
														undefined &&
														isMoreThanOneYearFromToday(filter.value.to) && (
															<small className="d-block">
																{"* " +
																	constants.errorMessage
																		.errorDueToMoreThanOneYearDateFromToday}
															</small>
														)}
													{isDifferenceIsMoreThanOneYear(
														filter.value.from,
														filter.value.to
													) !== undefined &&
														isDifferenceIsMoreThanOneYear(
															filter.value.from,
															filter.value.to
														) && (
															<small className="d-block">
																{"* " + constants.errorMessage.errorDueToRange}
															</small>
														)}
													{isToDateBeforeFromDate(
														filter.value.from,
														filter.value.to
													) !== undefined &&
														isToDateBeforeFromDate(
															filter.value.from,
															filter.value.to
														) && (
															<small className="d-block">
																{"* " +
																	constants.errorMessage.errorDueToReverseDate +
																	moment(
																		filter.value.from.join("-"),
																		"DD-MM-YYYY"
																	).format("D MMMM YYYY")}
															</small>
														)}
												</p>
											</div>
										</div>
									</div>
								)}
								<div
									className="filter"
									onClick={() => {
										if (filter.name === FilterTypes.migrateAllTasksForever) {
											setFilter({});
											return;
										}
										setFilter({
											name: FilterTypes.migrateAllTasksForever,
											value: null,
										});
									}}
								>
									<p>
										<img
											src={
												filter.name === FilterTypes.migrateAllTasksForever
													? check
													: uncheck
											}
											alt="check"
										/>{" "}
										Re-assign for all future tasks
									</p>
								</div> */}

                <div className="buttons-re-assign">
                  <button
                    className="btn re-assign"
                    disabled={isLoading}
                    onClick={() => handleReAssign(assignTo)}
                  >
                    RE-ASSIGN
                  </button>

                  <button className="btn cancel" onClick={handleClose}>
                    CANCEL
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ReAssignTasksToUserModal;
