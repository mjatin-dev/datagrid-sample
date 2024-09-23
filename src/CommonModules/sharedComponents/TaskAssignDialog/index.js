/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIsAssignToMeDisabled,
  filterUsersListFor,
  getUserListByUserType,
} from "../../helpers/tasks.helper";
import { useDebounce, useGetTaskPermissions } from "../../helpers/custom.hooks";
import { actions as taskReportActions } from "Components/OnBoarding/SubModules/DashBoardCO/redux/actions";

import assignIconCircle from "../../../assets/Icons/assignIconCircle.png";
import plusIcon from "../../../assets/Icons/plusIcon3.png";
import validator from "validator";
import axiosInstance from "../../../apiServices/index";
import { useOuterClick } from "Components/OnBoarding/SubModules/DashBoardCO/components/CoSetting/CoCompany/utils";
import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";

const TaskAssignDialog = ({
  setIsShowReAssignModal,
  userType = 4,
  userKey,
  userNameKey,
  customEnabled = false,
}) => {
  // const userNameKey = userKey + "Name";
  const { hasEditPermissionOnTask: editPermission } = useGetTaskPermissions();
  const [currentDropDown, setCurrentDropDown] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [filteredUsersList, setFilteredUsersList] = useState([]);
  const debouncedSelectedUser = useDebounce(selectedUser, 500);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [noRecords, setNoRecords] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  // const [dialogPosition, setDialogPosition] = useState({
  //   right: 0,
  // });
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data
  );
  const userDetails = useSelector((state) => state?.auth?.loginInfo);
  const hasEditPermissionOnTask = editPermission || customEnabled;
  const isAssignToMeDisabled = checkIsAssignToMeDisabled(
    userKey === "assignTo" ? "assign_to" : userKey,
    userDetails.email,
    currentOpenedTask.assignTo,
    currentOpenedTask.approver,
    currentOpenedTask.cc
  );
  const usersListBackup = useSelector((state) =>
    state?.taskReport?.getUserByRole?.getUserByRole?.length > 0
      ? state?.taskReport?.getUserByRole?.getUserByRole
      : []
  );
  const dialogRef = useOuterClick((e) => {
    if (
      (currentDropDown === "open" &&
        !e.target.id.includes(`assignBtn${userType}`)) ||
      (currentDropDown === "open" && e.target.id === "")
    ) {
      setCurrentDropDown("");
      setSelectedUser("");
    }
  });
  const dispatch = useDispatch();

  const getUserDetail = (e) => {
    dispatch(
      taskReportActions.userByRoleRequest({
        company: currentOpenedTask && currentOpenedTask?.customer,
        role_type: userType === 5 ? "Approver" : "Team Member",
      })
    );
  };
  const handleAssignTaskToMe = () => {
    if (!isAssignToMeDisabled) {
      dispatch(
        taskReportActions.taskAssignByTaskID({
          task_details: [
            {
              name: currentOpenedTask.taskName,
              [userKey === "assignTo" ? "assign_to" : userKey]:
                userDetails.email,
              assigned_by: userDetails.email,
            },
          ],
        })
      );
      setSelectedUser("");
    }
  };
  const handleOpenDialog = () => {
    if (currentDropDown === "open") {
      setCurrentDropDown("");
    } else {
      setCurrentDropDown("open");
      getUserDetail();
    }
  };
  const handleKeyDownOnInput = (e) => {
    const { value } = e.target;
    if (e.key === "Enter") {
      if (validator.isEmail(value)) {
        setIsValidEmail(true);
        if (
          usersList &&
          usersList?.length > 0 &&
          usersList.find((el) => el.email === value)
        ) {
          handleAssignTask(value);
        } else {
          checkEmailAvailability(true);
        }
      } else {
        setIsValidEmail(false);
      }
    }
  };
  const checkEmailAvailability = (isInvite = false) => {
    if (validator.isEmail(selectedUser)) {
      setIsValidEmail(true);
      axiosInstance
        .post(`compliance.api.avabilityCheck`, {
          email: selectedUser,
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
            if (isInvite) {
              handleAssignTask();
            }
          }
        })
        .catch((err) => {});
    } else {
      setIsValidEmail(false);
    }
  };

  const handleSearchUser = () => {
    if (selectedUser === "") {
      setUsersList([...(filteredUsersList || [])]);
    }
    const tempSearchResults = [...(filteredUsersList || [])].filter((item) => {
      if (
        item.email.toLowerCase().includes(selectedUser.toLowerCase()) ||
        (item.full_name &&
          item.full_name.toLowerCase().includes(selectedUser.toLowerCase()))
      ) {
        return true;
      }
      return false;
    });

    setUsersList([...tempSearchResults]);
  };

  const handleAssignTask = () => {
    dispatch(
      taskReportActions.taskAssignByTaskID({
        task_details: [
          {
            name: currentOpenedTask.taskName,
            [userKey === "assignTo" ? "assign_to" : userKey]: selectedUser,
            assigned_by: userDetails.email,
          },
        ],
      })
    );
    setSelectedUser("");
  };

  const handleAssignClickOnUser = (data) => {
    dispatch(
      taskReportActions.taskAssignByTaskID({
        task_details: [
          {
            name: currentOpenedTask.taskName,
            [userKey === "assignTo" ? "assign_to" : userKey]: data.email,
            assigned_by: userDetails.email,
          },
        ],
      })
    );
    setSelectedUser("");
  };

  useEffect(() => {
    if (usersListBackup && usersListBackup?.length > 0) {
      const filteredUsers = filterUsersListFor(
        userKey === "assignTo" ? "assign_to" : userKey,
        usersListBackup,
        currentOpenedTask?.assignTo,
        currentOpenedTask?.approver,
        currentOpenedTask?.cc,
        userDetails.email,
        currentOpenedTask,
        true
      );
      const _list =
        userKey === "cc"
          ? [...filteredUsers].filter(
              (user) => user.email !== userDetails.email
            )
          : [...filteredUsers];
      setFilteredUsersList(_list);
      setUsersList(_list);
    } else {
      setNoRecords(true);
    }
  }, [usersListBackup]);

  useEffect(() => {
    handleSearchUser();
    if (debouncedSelectedUser && validator.isEmail(debouncedSelectedUser)) {
      checkEmailAvailability();
    } else if (debouncedSelectedUser) {
      setIsEmailAvailable(false);
    }
  }, [debouncedSelectedUser]);

  useEffect(() => {
    if (dialogRef.current) {
      const containerNode = dialogRef.current;
      const containerWidth = 360;
      const leftPosition = containerNode.getClientRects()[0]?.left;
      if (window.innerWidth - containerWidth < leftPosition) {
        containerNode.classList.add("bottom-tool-tip__left");
      }
    }
  }, [dialogRef, currentDropDown, usersList]);

  return (
    <>
      {currentOpenedTask && currentOpenedTask[userKey] ? (
        <div
          className={`holding-list-bold-title truncate ${
            hasEditPermissionOnTask ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          style={{
            ...(hasEditPermissionOnTask && { color: "#7a73ff" }),
          }}
          onClick={() => {
            if (hasEditPermissionOnTask) {
              setIsShowReAssignModal(true);
            }
          }}
          title={currentOpenedTask[userKey]}
        >
          {currentOpenedTask && currentOpenedTask[userNameKey] && (
            <span className="cicrcle-name">
              {getInitialName(
                currentOpenedTask && currentOpenedTask[userNameKey]
              )}
            </span>
          )}
          {currentOpenedTask[userNameKey] || "Not Assigned"}
        </div>
      ) : (
        <div className="holding-list-bold-title AssinTo">
          <div className="col-9 pl-0">
            <div
              className={`dashboard-assign d-flex w-100 ${
                hasEditPermissionOnTask
                  ? "cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              id={`assignBtn${userType}${userKey}`}
              style={{
                width: "fit-content",
              }}
              onClick={() => {
                if (hasEditPermissionOnTask) {
                  handleOpenDialog();
                }
              }}
            >
              <img
                src={assignIconCircle}
                width={19}
                height={19}
                className="mr-1"
                alt="account Circle Purple"
              />{" "}
              Assign
            </div>
            {currentDropDown === "open" && (
              <div
                ref={dialogRef}
                className="bottom-tool-tip"
                // style={{
                //   display: "block",
                //   ...(dialogPosition.right && {
                //     right: dialogPosition.right,
                //   }),
                // }}
              >
                <div
                  className="shadow-tooltip"
                  style={{
                    minHeight: "113px",
                    maxHeight: "auto",
                    height: "auto",
                  }}
                >
                  <div className="">
                    <div className="tool-tip-head">
                      <div className="add-Email border-bottom">
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Enter name or email"
                            value={selectedUser}
                            onKeyPress={(e) => handleKeyDownOnInput(e)}
                            onChange={(e) => setSelectedUser(e.target.value)}
                          />
                          {!isValidEmail && (
                            <div
                              className=""
                              style={{
                                color: "#ef5d5d",
                                paddingLeft: "7px",
                                position: "absolute",
                              }}
                            >
                              Please Enter valid Email
                            </div>
                          )}
                          {isEmailAvailable &&
                            selectedUser !== "" &&
                            !usersList.find(
                              (el) => el.email === selectedUser
                            ) && (
                              <div
                                className=""
                                style={{
                                  color: "#ef5d5d",
                                  paddingLeft: "7px",
                                  position: "absolute",
                                }}
                              >
                                Email already exists
                              </div>
                            )}
                        </div>
                        {userKey !== "cc" && (
                          <>
                            <span className="or-devider">or </span>
                            <button
                              class="btn save-details assign-me"
                              value="4"
                              onClick={() => handleAssignTaskToMe()}
                              disabled={isAssignToMeDisabled}
                            >
                              Assign to me
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className="email-list-box"
                      style={{
                        paddingBottom: "15px",
                        maxHeight: "115px",
                        height: "auto",
                      }}
                    >
                      {usersList && usersList.length > 0
                        ? [
                            ...(userType === 5
                              ? getUserListByUserType(usersList, userType)
                              : getUserListByUserType(
                                  usersList,
                                  userType || 4
                                )),
                          ].map((user, index) => (
                            <div
                              className="email-list-row"
                              key={index}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleAssignClickOnUser(user)}
                            >
                              <span class="name-circle">
                                {user?.full_name &&
                                  getInitialName(
                                    user.full_name ? user.full_name : user.email
                                  )}
                              </span>
                              <span className="name-of-emailer">
                                {user.full_name ? user.full_name : ""}
                              </span>
                              <span className="last-email-box">
                                {user.email}
                              </span>
                            </div>
                          ))
                        : !isEmailAvailable && (
                            <span
                              className="last-email-box email-list-row"
                              style={{
                                textAlign: "center",
                                opacity: "inherit",
                              }}
                              onClick={() => checkEmailAvailability(true)}
                            >
                              {/* No records Available */}
                              {selectedUser !== "" &&
                                validator.isEmail(selectedUser) && (
                                  <div className="dropbox-add-line">
                                    <img
                                      src={plusIcon}
                                      alt="account Circle Purple"
                                    />
                                    {selectedUser !== "" &&
                                      `Invite '${selectedUser}' via email`}
                                  </div>
                                )}

                              {noRecords === true &&
                                selectedUser === "" &&
                                "No records Available"}
                            </span>
                          )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskAssignDialog;
