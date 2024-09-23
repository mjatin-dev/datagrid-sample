/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TaskStatusBox from "../../../CommonModules/sharedComponents/TaskStatusBox";
import Container from "../../Containers";

import TaskAssignDialog from "CommonModules/sharedComponents/TaskAssignDialog";
import moment from "moment";
import TaskDescriptionTab from "../../../CommonModules/sharedComponents/TaskDescriptionTab";
import { actions as taskReportActions } from "../../../Components/OnBoarding/SubModules/DashBoardCO/redux/actions";
import TaskReferencesTab from "../../../CommonModules/sharedComponents/TaskReferencesTab";
import projectDeleteIcon from "../../../assets/ERIcons/projectDeleteIcon.svg";
import {
  checkIsInternalTask,
  isTaskOwner,
  removeWhiteSpaces,
} from "../../../CommonModules/helpers/string.helpers";
import Dots from "../../../CommonModules/sharedComponents/Loader/Dots";
import styles from "./styles.module.scss";
import ReAssignTasksModal from "../../../Components/ReAssignTasks";
import Modal from "react-responsive-modal";
import {
  clearTaskDetail,
  fetchImpactDetailsByTaskId,
  setApplicableRequest,
  setCurrentActiveTab,
  setNotApplicableRequest,
} from "../redux/actions";
import { Button, IconButton } from "@mui/material";
import { Close, ContactlessOutlined, Delete, Edit } from "@mui/icons-material";

import { useHistory } from "react-router";
import {
  clearDeleteModalSatate,
  deactivateRequest,
  setDeleteModalState,
  setTaskModalState,
} from "Components/ProjectManagement/redux/actions";
import { setCurrentMenu } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import { getInitials } from "Components/ReAssignTasks/utilties";
import FilesDetails from "./TaskDetailTabs/File";
import Comments from "./TaskDetailTabs/Comments";
import Logs from "./TaskDetailTabs/Logs";
import Updates from "./TaskDetailTabs/Updates";
import { useGetTaskPermissions } from "CommonModules/helpers/custom.hooks";
import TaskEditDeleteOptionsModal from "Components/ProjectManagement/components/Modals/TaskEditDeleteOptionsModal";
import { Link } from "react-router-dom";
import { actions as adminMenuActions } from "../../../Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import DeactivateAndDeleteModal from "Components/ProjectManagement/components/Modals/DeactivateAndDeleteModal";
import { MdBlock } from "react-icons/md";
import axiosInstance from "SharedComponents/Services/axios.service";
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import NotApplicableConfirmationModal from "./NotApplicableConfirmationModal";

const TaskData = () => {
  const [currentOpenedTask, setCurrentOpenedTask] = useState({});
  const {
    hasWorkPermissionOnTask,
    isPaymentPlanActive,
    currentTaskLicenseSubscriptionEndDate,
  } = useGetTaskPermissions();
  const [isShowTaskDeleteOptions, setIsShowTaskDeleteOptions] = useState(false);
  const {
    data: getTaskById,
    isLoading,
    isShowTaskDetail,
    isTaskActionPending,
  } = useSelector((state) => state?.DashboardState?.taskDetailById);
  const TaskLoader = useSelector(
    (state) => state?.ProjectManagementReducer?.TaskLoader
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const [readCounts, setReadCounts] = useState({
    reference_read_count: 0,
    reference_unread_count: 0,
    total_comments: 0,
    total_read_comments: 0,
    total_reference_count: 0,
    total_user_unread_comments: 0,
  });
  const [showFiles, setShowFiles] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const [isShowUpdates, setIsShowUpdates] = useState(false);
  const [referenceShow, setShowReference] = useState(false);
  const [visibleRejectTaskModal, setVisibleRejectTaskModal] = useState(false);
  const [
    isShowReAssignModalForTeamMember,
    setIsShowReAssignModalForTeamMember,
  ] = useState(false);
  const [rejectTaskInput, setRejectTaskInputComment] = useState("");

  const [isShowReAssignModalForApprover, setIsShowReAssignModalForApprover] =
    useState(false);
  const [isShowReAssignModalForCC, setIsShowReAssignModalForCC] =
    useState(false);
  const mainContainerRef = useRef(null);
  const userDetails = useSelector(
    (state) => state && state.auth && state.auth.loginInfo
  );
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );
  const deactivateModalAndStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.deactivateModalAndStatus
  );

  const loader = useSelector((state) => state?.taskReport?.loader);
  const [isShowNotApplicableConfirmation, setIsShowNotApplicableConfirmation] =
    useState({
      isShow: false,
      forApplicable: false,
    });

  const handleConfirmNotApplicableModal = () => {
    if (!isShowNotApplicableConfirmation.forApplicable) {
      dispatch(
        setNotApplicableRequest({
          data: {
            project: currentOpenedTask.project,
            compliance_event: currentOpenedTask?.compliance_events,
          },
          taskId: currentOpenedTask.taskName,
        })
      );
    } else {
      dispatch(
        setApplicableRequest({
          data: {
            project: currentOpenedTask.project,
            compliance_event: currentOpenedTask?.compliance_events,
          },
          taskId: currentOpenedTask.taskName,
        })
      );
    }

    setIsShowNotApplicableConfirmation({
      isShow: false,
      forApplicable: false,
    });
  };
  const getComments = () => {
    setShowFiles(false);
    setIsShowUpdates(false);
    setShowComments(true);
    setShowReference(false);
    setShowActivityLogs(false);
    dispatch(
      taskReportActions.taskCommentsByTaskIdRequest({
        task_name: currentOpenedTask.taskName,
      })
    );
  };
  const getActivityLogs = async () => {
    setShowFiles(false);
    setIsShowUpdates(false);
    setShowComments(false);
    setShowActivityLogs(true);
    setShowReference(false);
  };

  const setupUpdatesTab = () => {
    setShowFiles(false);
    setIsShowUpdates(true);
    setShowComments(false);
    setShowActivityLogs(false);
    setShowReference(false);
  };

  const teamMemberMarkComplete = () => {
    dispatch(
      taskReportActions.changeTaskStatusRequest({
        task_name: currentOpenedTask.taskName,
        ...((
          currentOpenedTask.customerName === "Internal Task"
            ? userDetails.email === currentOpenedTask.assignTo &&
              userDetails.email === currentOpenedTask.taskOwner
              ? !currentOpenedTask.approver
                ? true
                : userDetails.email === currentOpenedTask.approver
              : userDetails.email === currentOpenedTask.approver ||
                userDetails.email === currentOpenedTask.taskOwner
            : userDetails.UserType === 3 ||
              userDetails.email === currentOpenedTask.approver
        )
          ? { status: "Approved" }
          : { status: "Approval Pending" }),
      })
    );
  };
  const handleAppTask = (currentOpenedTask) => {
    dispatch(
      taskReportActions.changeTaskStatusRequest({
        task_name: currentOpenedTask.taskName,
        status: "Approved",
      })
    );
  };

  const submitModal = () => {
    dispatch(
      taskReportActions.changeTaskStatusRequest({
        task_name: currentOpenedTask.taskName,
        status: "Rejected",
        content: rejectTaskInput,
      })
    );

    setRejectTaskInputComment("");
    setVisibleRejectTaskModal(false);
  };

  const handleChangeRejectTaskComment = (e) => {
    e.preventDefault();
    setRejectTaskInputComment(removeWhiteSpaces(e.target.value));
  };

  const fetchCommentAndRefCounts = async (
    task_id = getTaskById?.taskName || ""
  ) => {
    let payload = {
      task_name: task_id,
    };
    try {
      const countData = await axiosInstance.post(
        `${BACKEND_BASE_URL}compliance.api.GetCountCommentReff`,
        payload
      );
      if (countData?.data?.message?.status && countData.status === 200) {
        setReadCounts({
          ...readCounts,
          ...countData.data.message,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderRejectTaskModal = () => {
    return (
      <Modal
        onOverlayClick={() => setVisibleRejectTaskModal(false)}
        open={visibleRejectTaskModal}
        center={true}
        showCloseIcon={true}
        modalId="modal2"
        onClose={() => setVisibleRejectTaskModal(false)}
        styles={{ width: "373", height: "265" }}
      >
        <div className="model-design-reject">
          <div className="reject-model-title">
            Enter a reason for rejecting the task
          </div>
          <div className="white-bottom">
            <div class="form-group">
              <label htmlFor="comment">Comment:</label>
              <textarea
                className="form-control"
                placeholder="Enter the reason for rejecting this task."
                value={rejectTaskInput}
                onChange={(e) => handleChangeRejectTaskComment(e)}
                rows="5"
                id="comment"
                name="rejectTaskComment"
                maxLength="200"
              ></textarea>
              <div className="text-count-area">0/200</div>
            </div>
            <div className="btn-group float-right">
              <button
                type="submit"
                onClick={() => setVisibleRejectTaskModal(false)}
                className="btn cancel-btn-reject mr-2"
              >
                Cancel
              </button>
              <button
                disabled={rejectTaskInput === "" || rejectTaskInput === " "}
                type="submit"
                onClick={() => submitModal()}
                className="btn reject-submit-btn"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const CommentAndRefCountComponent = (count) => {
    return (
      count !== 0 && (
        <div className="initial-name__container ml-1">
          <span className="initial-name">{count || 0}</span>
        </div>
      )
    );
  };

  useEffect(() => {
    if (getTaskById && Object.keys(getTaskById).length !== 0) {
      setCurrentOpenedTask(getTaskById);
      fetchCommentAndRefCounts(getTaskById.taskName);
    }
  }, [getTaskById]);

  useEffect(() => {
    if (currentOpenedTask && Object.keys(currentOpenedTask).length !== 0) {
      if (showFiles) {
        dispatch(
          taskReportActions.getTaskFilesById({
            doctype: "Task",
            docname: currentOpenedTask.taskName,
            is_references: 0,
          })
        );
      } else if (showComments) {
        getComments();
      }
    }
  }, [currentOpenedTask, showFiles]);

  useEffect(() => {
    const mainContainer = mainContainerRef.current;
    if (mainContainer) {
      const mainContainerClientTop = mainContainer.getClientRects()[0]?.top;
      mainContainer.style.height = `calc(100vh - ${
        mainContainerClientTop + 64
      }px)`;
    }
  }, [currentOpenedTask]);

  useEffect(() => {
    if (history.location.state?.from === "updates") {
      setupUpdatesTab();
    }
  }, [history.location.state?.from]);
  // const userDetail = useAccount();

  const getDateAndTimeDifference = (date, time) => {
    // const IsoDateTo = moment(inCominngDate,'YYYY-M-D h:m:s').format('YYYY-MM-DD HH:mm:ss');
    if (!time) {
      return moment().diff(date, "days") > 0;
    } else {
      //removing the Am and PM from date
      let inCominngDate = `${date} ${time}`;
      inCominngDate = inCominngDate.replace(/AM/g, "");
      inCominngDate = inCominngDate.replace(/PM/g, "");

      const todayDate = moment(new Date()).format("DD-MM-YYYY HH:mm");
      const comingDate = moment(inCominngDate).format("DD-MM-YYYY HH:mm");
      var m1 = moment(todayDate, "DD-MM-YYYY HH:mm");
      var m2 = moment(comingDate, "DD-MM-YYYY HH:mm");
      var m3 = m1.diff(m2, "minutes");

      var numdays = Math.floor(m3 / 1440);
      var numhours = Math.floor((m3 % 1440) / 60);
      var numminutes = Math.floor((m3 % 1440) % 60);
      if (
        parseInt(numdays) > 0 ||
        parseInt(numhours) > 0 ||
        parseInt(numminutes) > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    isShowTaskDetail && (
      <Container variant="main" className="w-100">
        <BackDrop isLoading={loader} />
        <Container variant="container">
          <Container
            variant="content"
            className="overflow-hidden py-5"
            isShowAddTaskButton
          >
            {isLoading || TaskLoader ? (
              <Dots height="100%" />
            ) : (
              <div className="row ">
                {!isPaymentPlanActive &&
                  currentOpenedTask.customer !== "Internal Task" && (
                    <div
                      style={{
                        background: "#ffefea",
                        marginLeft: 12,
                        marginBottom: 10,
                        width: "100%",
                        color: "red",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between p-2 px-3">
                        <p style={{ fontWeight: 200, padding: 0, margin: 0 }}>
                          Your subscription needs to be renewed.
                        </p>
                        {userDetails.UserType === 3 && (
                          <Link
                            to="/settings"
                            onClick={() => {
                              dispatch(
                                adminMenuActions.setActiveTabInSetting(
                                  "account"
                                )
                              );
                            }}
                            style={{ textDecoration: "underline" }}
                          >
                            Click here to renew
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                {currentOpenedTask &&
                  currentOpenedTask?.status !== "Approved" && (
                    <>
                      {visibleRejectTaskModal && renderRejectTaskModal()}
                      <ReAssignTasksModal
                        openModal={isShowReAssignModalForTeamMember}
                        setShowModal={setIsShowReAssignModalForTeamMember}
                        userId={currentOpenedTask && currentOpenedTask.assignTo}
                        taskId={currentOpenedTask && currentOpenedTask.taskName}
                        company={
                          currentOpenedTask && currentOpenedTask.customer
                        }
                        isSingleTask
                        isTeamMember
                        userKey="assign_to"
                      />
                      <ReAssignTasksModal
                        openModal={isShowReAssignModalForCC}
                        setShowModal={setIsShowReAssignModalForCC}
                        userId={currentOpenedTask && currentOpenedTask.cc}
                        taskId={currentOpenedTask && currentOpenedTask.taskName}
                        company={
                          currentOpenedTask && currentOpenedTask.customer
                        }
                        userKey="cc"
                        isSingleTask
                        isTeamMember
                      />
                      <ReAssignTasksModal
                        openModal={isShowReAssignModalForApprover}
                        setShowModal={setIsShowReAssignModalForApprover}
                        userId={currentOpenedTask && currentOpenedTask.approver}
                        taskId={currentOpenedTask && currentOpenedTask.taskName}
                        company={
                          currentOpenedTask && currentOpenedTask.customer
                        }
                        userKey="approver"
                        isSingleTask
                      />
                      <TaskEditDeleteOptionsModal
                        isShowChooseDeleteOptions={isShowTaskDeleteOptions}
                        handleClose={() => {
                          setIsShowTaskDeleteOptions(false);
                        }}
                        handleDelete={(selectedOption) => {
                          dispatch(
                            deactivateRequest({
                              id: currentOpenedTask.taskName,
                              modalName: "Task",
                              recurring_task: selectedOption,
                            })
                          );
                        }}
                      />
                      <DeactivateAndDeleteModal
                        visible={deactivateModalAndStatus?.isVisible}
                        onClose={() => dispatch(clearDeleteModalSatate())}
                        Text={`Are you sure ${
                          deactivateModalAndStatus?.modalName !== "Task"
                            ? "to delete this " +
                              deactivateModalAndStatus?.modalName
                            : "you want to De-activate this Task"
                        }?`}
                        iconSrc={
                          deactivateModalAndStatus?.modalName !== "Task" &&
                          projectDeleteIcon
                        }
                        Icon={
                          deactivateModalAndStatus?.modalName === "Task" &&
                          MdBlock
                        }
                        id={deactivateModalAndStatus?.id}
                        onSubmit={() => {
                          dispatch(
                            deactivateRequest({
                              ...deactivateModalAndStatus,
                            })
                          );
                          // dispatch(setCurrentActiveTab())
                          dispatch(clearDeleteModalSatate());
                        }}
                      />
                      <NotApplicableConfirmationModal
                        visible={isShowNotApplicableConfirmation.isShow}
                        forApplicable={
                          isShowNotApplicableConfirmation.forApplicable
                        }
                        onClose={() =>
                          setIsShowNotApplicableConfirmation({
                            isShow: false,
                            forApplicable: false,
                          })
                        }
                        onSubmit={handleConfirmNotApplicableModal}
                      />
                    </>
                  )}
                <div className="col-12">
                  <div className="">
                    <div className="">
                      <div className="task-details-header">
                        <div className="closing-icon">
                          {currentOpenedTask.customerName !==
                            "Internal Task" && (
                            <div className="task-details-title truncate w-75">
                              {currentOpenedTask &&
                                currentOpenedTask.customerName}
                            </div>
                          )}
                          <div
                            className={styles.taskCloseIcon}
                            // style={{
                            //   position:
                            //     currentOpenedTask.customerName ===
                            //       "Internal Task" &&
                            //     currentOpenedTask?.internal_license_tag &&
                            //     "revert",
                            //   textAlign: "end",
                            // }}
                          >
                            {currentOpenedTask.customerName !==
                              "Internal Task" &&
                              userDetails?.UserType === 3 &&
                              !currentOpenedTask?.not_applicable_for_me &&
                              (isTaskActionPending ? (
                                <Dots />
                              ) : (
                                <Button
                                  variant="contained"
                                  disabled={!hasWorkPermissionOnTask}
                                  size="small"
                                  className="mr-2"
                                  title="Not Applicable"
                                  sx={{
                                    backgroundColor: "#6c5dd3",
                                    "&:hover": { backgroundColor: "#6c5dd3" },
                                  }}
                                  onClick={() =>
                                    setIsShowNotApplicableConfirmation({
                                      isShow: true,
                                      forApplicable: false,
                                    })
                                  }
                                  disableElevation
                                  disableTouchRipple
                                  disableFocusRipple
                                >
                                  N/A
                                </Button>
                              ))}
                            {currentOpenedTask.customerName !==
                              "Internal Task" &&
                              userDetails?.UserType === 3 &&
                              Boolean(
                                currentOpenedTask?.not_applicable_for_me
                              ) &&
                              (isTaskActionPending ? (
                                <Dots />
                              ) : (
                                <Button
                                  variant="contained"
                                  disabled={!hasWorkPermissionOnTask}
                                  size="small"
                                  className="mr-2"
                                  title="Applicable"
                                  sx={{
                                    backgroundColor: "#6c5dd3",
                                    "&:hover": { backgroundColor: "#6c5dd3" },
                                  }}
                                  onClick={() =>
                                    setIsShowNotApplicableConfirmation({
                                      isShow: true,
                                      forApplicable: true,
                                    })
                                  }
                                  disableElevation
                                  disableTouchRipple
                                  disableFocusRipple
                                >
                                  Applicable
                                </Button>
                              ))}
                            {currentOpenedTask.customerName ===
                              "Internal Task" &&
                              currentOpenedTask.taskOwner ===
                                userDetails.email &&
                              currentOpenedTask.status !== "Approved" && (
                                <>
                                  <IconButton
                                    title="Edit"
                                    disabled={
                                      !hasWorkPermissionOnTask
                                      // || moment().isAfter(currentOpenedTask.frequencyEndDate)
                                    }
                                    onClick={() => {
                                      dispatch(
                                        setTaskModalState({
                                          ...modalsStatus?.taskModal,
                                          loader: false,
                                          isVisible: true,
                                          isEdit: true,
                                          editData: {
                                            ...modalsStatus?.taskModal
                                              ?.editData,
                                            task_id:
                                              currentOpenedTask?.taskName ||
                                              null,
                                            milestone_id:
                                              currentOpenedTask?.milestoneId ||
                                              null,
                                            project_id:
                                              currentOpenedTask?.project ||
                                              null,
                                            subject:
                                              currentOpenedTask?.subject ||
                                              null,
                                            task_list_id:
                                              currentOpenedTask?.taskListId ||
                                              null,
                                            start_date:
                                              currentOpenedTask?.startDate ||
                                              currentOpenedTask?.deadlineDate ||
                                              null,
                                            end_date:
                                              currentOpenedTask?.deadlineDate ||
                                              null,
                                            frequency: {
                                              value:
                                                currentOpenedTask?.frequency
                                                  ? currentOpenedTask?.frequency
                                                  : "",
                                              label:
                                                currentOpenedTask?.frequency
                                                  ? currentOpenedTask?.frequency
                                                  : "",
                                            },
                                            riskRating: {
                                              value:
                                                currentOpenedTask?.riskRating
                                                  ? currentOpenedTask?.riskRating
                                                  : "",
                                              label:
                                                currentOpenedTask?.riskRating
                                                  ? currentOpenedTask?.riskRating
                                                  : "",
                                            },
                                            frequency_end_date:
                                              currentOpenedTask?.frequencyEndDate ||
                                              null,
                                            assign_to:
                                              currentOpenedTask?.assignTo ||
                                              null,
                                            cc: currentOpenedTask?.cc || null,
                                            approver:
                                              currentOpenedTask?.approver ||
                                              null,
                                            description:
                                              currentOpenedTask?.description ||
                                              "",
                                            comments:
                                              currentOpenedTask?.task_comments ||
                                              "",
                                            repeat_on_holiday:
                                              currentOpenedTask?.repeatOnHoliday ||
                                              "",
                                            repeat_on_day:
                                              currentOpenedTask?.repeatOnDay ||
                                              "",
                                            weekly_repeat_day:
                                              currentOpenedTask?.weeklyRepeatDay ||
                                              "",
                                            repeat_on_month:
                                              currentOpenedTask?.repeatOnMonth ||
                                              "",
                                            end_time:
                                              currentOpenedTask?.endTime ||
                                              null,
                                            file_details:
                                              currentOpenedTask?.fileDetails,
                                            notify_on:
                                              currentOpenedTask?.notifyOn || [],
                                            internal_deadline_date:
                                              currentOpenedTask?.internalDeadlineDate ||
                                              null,
                                            internal_deadline_day:
                                              currentOpenedTask?.internalDeadlineDay ||
                                              0,
                                            internal_license_tag:
                                              currentOpenedTask?.internal_license_tag ||
                                              "",
                                            // impact: currentOpenedTask?.impact
                                            //   ? [
                                            //       {
                                            //         added_by: userDetail.email,
                                            //         added_by_name:
                                            //           userDetail?.UserName,
                                            //         edited: false,
                                            //         reference:
                                            //           currentOpenedTask?.impact,

                                            //         task_id: "",
                                            //         task_reference_id: "",
                                            //       },
                                            //     ]
                                            //   : [],
                                            impact:
                                              currentOpenedTask?.impact || "",
                                            impactFileDetails:
                                              currentOpenedTask?.impactFileDetails ||
                                              [],
                                            circulars:
                                              currentOpenedTask?.circulars ||
                                              [],
                                            repeat_on_every:
                                              currentOpenedTask?.repeat_on_every,
                                          },
                                        })
                                      );
                                    }}
                                    className="mr-2"
                                  >
                                    <Edit
                                      style={{
                                        fontSize: "1.25rem",
                                      }}
                                    />
                                  </IconButton>

                                  <IconButton
                                    disabled={!hasWorkPermissionOnTask}
                                    title="Delete"
                                    onClick={() => {
                                      if (
                                        currentOpenedTask?.frequency &&
                                        currentOpenedTask.frequency !== "None"
                                      ) {
                                        setIsShowTaskDeleteOptions(true);
                                      } else {
                                        dispatch(
                                          setDeleteModalState({
                                            ...deactivateModalAndStatus,
                                            modalName: "Task",
                                            id: currentOpenedTask?.taskName,
                                            isVisible: true,
                                          })
                                        );
                                      }
                                    }}
                                  >
                                    <Delete
                                      style={{
                                        fontSize: "1.25rem",
                                      }}
                                    />
                                  </IconButton>
                                </>
                              )}

                            <IconButton
                              disableTouchRipple
                              onClick={() => {
                                if (
                                  history.location.state?.handleBack &&
                                  history.location?.state?.taskId ===
                                    currentOpenedTask?.taskName
                                ) {
                                  history.goBack();
                                  if (history.location.state?.from) {
                                    dispatch(
                                      setCurrentMenu(
                                        history.location.state?.from
                                      )
                                    );
                                  }
                                }
                                dispatch(clearTaskDetail());
                                if (
                                  history.location.state?.from === "updates"
                                ) {
                                  history.replace("/dashboard-view");
                                }
                              }}
                            >
                              <Close />
                            </IconButton>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <p
                            title={currentOpenedTask.subject}
                            className="task-details-sub-title w-75 mb-0 d-block"
                          >
                            {currentOpenedTask && currentOpenedTask.subject}{" "}
                          </p>
                          {/* {currentOpenedTask?.customerName ===
                            "Internal Task" &&
                            currentOpenedTask?.internal_license_tag && (
                              <span className="nse-label d-none d-md-block">
                                I-{currentOpenedTask?.internal_license_tag}
                              </span>
                            )}
                          {currentOpenedTask.customerName !==
                            "Internal Task" && (
                            <span className="nse-label d-none d-md-block">
                              {currentOpenedTask?.licenseDisplay}
                            </span>
                          )} */}
                        </div>

                        <div className="d-flex d-block d-md-none align-items-center">
                          <span className="nse-label ml-0">
                            {currentOpenedTask &&
                              currentOpenedTask.licenseDisplay}
                          </span>

                          <TaskStatusBox
                            isTaskDetails
                            status={currentOpenedTask.status}
                          />
                        </div>

                        <div className="border-header d-none d-md-block w-100">
                          <div
                            className={`d-inline-flex align-items-center justify-content-start ${styles.licenseAndStatusContainer}`}
                          >
                            {currentOpenedTask &&
                              currentOpenedTask.status !== "" && (
                                <TaskStatusBox
                                  isTaskDetails
                                  status={currentOpenedTask.status}
                                />
                              )}
                            {currentOpenedTask?.customerName ===
                              "Internal Task" &&
                              currentOpenedTask?.internal_license_tag && (
                                <span className="nse-label d-none d-md-block">
                                  I-{currentOpenedTask?.internal_license_tag}
                                </span>
                              )}
                            {currentOpenedTask.customerName !==
                              "Internal Task" && (
                              <span className="nse-label d-none d-md-block">
                                {currentOpenedTask?.licenseDisplay}
                              </span>
                            )}
                          </div>

                          <div
                            className="holding-list-bold-title risk-fonts"
                            style={{
                              color: `${
                                currentOpenedTask.riskRating
                                  ? currentOpenedTask.riskRating === "High"
                                    ? "red"
                                    : currentOpenedTask.riskRating === "Medium"
                                    ? "rgb(242, 215, 72)"
                                    : "rgb(93, 209, 91)"
                                  : currentOpenedTask.customerName ===
                                    "Internal Task"
                                  ? "rgb(92 209 91)"
                                  : "red"
                              }`,
                              background: `${
                                currentOpenedTask.riskRating
                                  ? currentOpenedTask.riskRating === "High"
                                    ? "#ebbbbb"
                                    : currentOpenedTask.riskRating === "Medium"
                                    ? "#fff2af"
                                    : "rgb(204 254 203)"
                                  : currentOpenedTask.customerName ===
                                    "Internal Task"
                                  ? "rgb(204 254 203)"
                                  : "#ebbbbb"
                              }`,
                            }}
                          >
                            {currentOpenedTask && currentOpenedTask.riskRating
                              ? currentOpenedTask.riskRating
                              : currentOpenedTask.customerName ===
                                "Internal Task"
                              ? "Low"
                              : "High"}
                          </div>

                          {currentOpenedTask &&
                            currentOpenedTask.ExReview === 1 && (
                              <div className="d-flex align-items-center labels-container">
                                {/* Approver Status */}
                                {currentOpenedTask &&
                                  currentOpenedTask.AprStatus && (
                                    <div
                                      className="er-approved-label mr-3"
                                      style={{
                                        backgroundColor:
                                          currentOpenedTask &&
                                          currentOpenedTask.AprStatus
                                            ? currentOpenedTask.AprStatus ===
                                              "Not Assigned"
                                              ? "#ffefea"
                                              : currentOpenedTask.AprStatus ===
                                                "Approved by Approver"
                                              ? "#cdfcd8"
                                              : currentOpenedTask.AprStatus ===
                                                "Rejected by Approver"
                                              ? "#ffefea"
                                              : "#d2fccd"
                                            : "#d2fccd",
                                      }}
                                    >
                                      <div
                                        className="approved-text"
                                        style={{
                                          color:
                                            currentOpenedTask &&
                                            currentOpenedTask.AprStatus
                                              ? currentOpenedTask.AprStatus ===
                                                "Not Assigned"
                                                ? "#f8c102"
                                                : currentOpenedTask.AprStatus ===
                                                  "Approved by Approver"
                                                ? "#7fba7a"
                                                : currentOpenedTask.AprStatus ===
                                                  "Reject by Approver"
                                                ? "#ff5f31"
                                                : "#fcf3cd"
                                              : "#fcf3cd",
                                        }}
                                      >
                                        {currentOpenedTask &&
                                          currentOpenedTask.AprStatus && (
                                            <div
                                              style={{
                                                textTransform: "uppercase",
                                              }}
                                            >
                                              {currentOpenedTask &&
                                              currentOpenedTask.AprStatus
                                                ? currentOpenedTask.AprStatus ===
                                                  "Not Assigned"
                                                  ? `${
                                                      userDetails.UserType === 5
                                                        ? "Not Started"
                                                        : "Approver Not Started Task"
                                                    }`
                                                  : currentOpenedTask.AprStatus ===
                                                    "Approved by Approver"
                                                  ? `${
                                                      userDetails.UserType === 5
                                                        ? "Task Approved"
                                                        : "Approved By Approver"
                                                    }`
                                                  : currentOpenedTask.AprStatus ===
                                                    "Rejected by Approver"
                                                  ? `${
                                                      userDetails.UserType === 5
                                                        ? "Task Rejected"
                                                        : "Rejected By Approver"
                                                    }`
                                                  : null
                                                : null}
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  )}
                                {/* Expert Reviewer Status */}
                                {currentOpenedTask &&
                                  currentOpenedTask.ExStatus && (
                                    <div
                                      className="er-approved-label"
                                      style={{
                                        backgroundColor:
                                          currentOpenedTask &&
                                          currentOpenedTask.ExStatus
                                            ? currentOpenedTask.ExStatus ===
                                              "Not Started"
                                              ? "#ffefea"
                                              : currentOpenedTask.ExStatus ===
                                                "Approved by Expert"
                                              ? "#cdfcd8"
                                              : currentOpenedTask.ExStatus ===
                                                "Rejected by Expert"
                                              ? "#ffefea"
                                              : "#d2fccd"
                                            : "#d2fccd",
                                      }}
                                    >
                                      <div
                                        className="approved-text"
                                        style={{
                                          color:
                                            currentOpenedTask &&
                                            currentOpenedTask.ExStatus
                                              ? currentOpenedTask.ExStatus ===
                                                "Not Started"
                                                ? "#f8c102"
                                                : currentOpenedTask.ExStatus ===
                                                  "Approved by Expert"
                                                ? "#7fba7a"
                                                : currentOpenedTask.ExStatus ===
                                                  "Rejected by Expert"
                                                ? "#ff5f31"
                                                : "#fcf3cd"
                                              : "#fcf3cd",
                                        }}
                                      >
                                        {currentOpenedTask &&
                                          currentOpenedTask.ExStatus && (
                                            <div
                                              style={{
                                                textTransform: "uppercase",
                                              }}
                                            >
                                              {currentOpenedTask &&
                                              currentOpenedTask.ExStatus
                                                ? currentOpenedTask.ExStatus ===
                                                  "Not Started"
                                                  ? "Expert Not Started Task"
                                                  : currentOpenedTask.ExStatus ===
                                                    "Approved by Expert"
                                                  ? "Approved By Expert"
                                                  : currentOpenedTask.ExStatus ===
                                                    "Rejected by Expert"
                                                  ? "Rejected By Expert"
                                                  : null
                                                : null}
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            )}
                        </div>
                        <div className="task-detail-data">
                          <div
                            className="row no-gutters"
                            style={{ columnGap: "1rem" }}
                          >
                            {(userDetails.UserType !== 4 ||
                              userDetails?.email ===
                                currentOpenedTask.taskOwner ||
                              userDetails?.email === currentOpenedTask.cc) && (
                              <div className="col-xl-4 col-6 d-flex row">
                                <div className="col-5">
                                  <div className="holding-list-normal-title">
                                    Assign To
                                  </div>
                                </div>
                                <div className="col-7">
                                  <TaskAssignDialog
                                    setIsShowReAssignModal={
                                      setIsShowReAssignModalForTeamMember
                                    }
                                    userType={4}
                                    userKey="assignTo"
                                    userNameKey="assignedToName"
                                    customEnabled={
                                      // checkIsInternalTask(currentOpenedTask) &&
                                      currentOpenedTask.status !== "Approved" &&
                                      !isTaskOwner(
                                        userDetails,
                                        currentOpenedTask
                                      ) &&
                                      currentOpenedTask.approver ===
                                        userDetails.email
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {(userDetails.UserType !== 3 ||
                              userDetails?.email === currentOpenedTask.cc) &&
                              currentOpenedTask?.assignedBy && (
                                <div className="col-xl-4 col-6 d-flex row">
                                  <div className="col-5">
                                    <div className="holding-list-normal-title">
                                      Assigned By
                                    </div>
                                  </div>
                                  <div className="col-7">
                                    <div className="holding-list-bold-title">
                                      {currentOpenedTask &&
                                      currentOpenedTask?.assignedByUser ===
                                        null ? null : (
                                        <span className="cicrcle-name">
                                          {getInitials(
                                            currentOpenedTask &&
                                              currentOpenedTask?.assignedByUser
                                          )}
                                        </span>
                                      )}
                                      {currentOpenedTask &&
                                        currentOpenedTask?.assignedByUser}
                                    </div>
                                  </div>
                                </div>
                              )}
                            {(userDetails.UserType !== 5 ||
                              userDetails.email === currentOpenedTask.cc ||
                              userDetails.email ===
                                currentOpenedTask.assignTo) && (
                              <div className="col-xl-4 col-6 d-flex row">
                                <div className="col-5">
                                  <div className="holding-list-normal-title">
                                    Approver
                                  </div>
                                </div>
                                <div className="col-7">
                                  <TaskAssignDialog
                                    setIsShowReAssignModal={
                                      setIsShowReAssignModalForApprover
                                    }
                                    userType={5}
                                    userKey="approver"
                                    userNameKey="approverName"
                                    // readOnly={
                                    //   checkIsInternalTask(currentOpenedTask) &&
                                    //   !isTaskOwner(
                                    //     userDetails,
                                    //     currentOpenedTask
                                    //   ) &&
                                    //   currentOpenedTask.approver ===
                                    //     userDetails.email
                                    // }
                                  />
                                </div>
                              </div>
                            )}
                            <div className="col-xl-4 col-6 d-flex row">
                              <div className="col-5">
                                <div className="holding-list-normal-title">
                                  CC
                                </div>
                              </div>
                              <div className="col-7">
                                <TaskAssignDialog
                                  userType={4}
                                  setIsShowReAssignModal={
                                    setIsShowReAssignModalForCC
                                  }
                                  userKey="cc"
                                  userNameKey="ccName"
                                  // readOnly={
                                  //   checkIsInternalTask(currentOpenedTask) &&
                                  //   !isTaskOwner(
                                  //     userDetails,
                                  //     currentOpenedTask
                                  //   ) &&
                                  //   currentOpenedTask.approver ===
                                  //     userDetails.email
                                  // }
                                />
                                {/* <div
                                  className="holding-list-bold-title truncate"
                                  title={currentOpenedTask?.cc}
                                >
                                  {currentOpenedTask.cc ? (
                                    <>
                                      <span className="cicrcle-name">
                                        {getInitials(
                                          currentOpenedTask?.ccName ||
                                            currentOpenedTask?.cc
                                        )}
                                      </span>
                                      {currentOpenedTask?.ccName ||
                                        currentOpenedTask?.cc ||
                                        "-"}
                                    </>
                                  ) : (
                                    "--"
                                  )}
                                </div> */}
                              </div>
                            </div>
                            <div className="col-xl-4 col-6 d-flex row">
                              <div className="col-5">
                                <div className="holding-list-normal-title">
                                  Due Date
                                </div>
                              </div>
                              <div className="col-7">
                                <div
                                  className="holding-list-bold-title"
                                  style={{
                                    ...((currentOpenedTask?.deadlineDate ||
                                      currentOpenedTask?.dueDate) &&
                                      getDateAndTimeDifference(
                                        currentOpenedTask?.deadlineDate ||
                                          currentOpenedTask?.dueDate,
                                        currentOpenedTask.endTime
                                      ) && {
                                        color: "red",
                                      }),
                                  }}
                                >
                                  {moment(
                                    currentOpenedTask &&
                                      currentOpenedTask.deadlineDate
                                  ).format("DD MMM YYYY")}
                                </div>
                              </div>
                            </div>
                            {/* {currentOpenedTask?.endTime &&
                              currentOpenedTask?.customerName ===
                                "Internal Task" && (
                                <div className="col-xl-4 col-6 d-flex row">
                                  <div className="col-5">
                                    <div className="holding-list-normal-title">
                                      End Time
                                    </div>
                                  </div>
                                  <div className="col-7">
                                    <div className="holding-list-bold-title">
                                      {moment(
                                        currentOpenedTask &&
                                          currentOpenedTask.endTime,
                                        "hh:mm A"
                                      ).format("hh:mm A")}
                                    </div>
                                  </div>
                                </div>
                              )} */}
                            {currentOpenedTask?.frequency && (
                              <div className="col-xl-4 col-6 d-flex row">
                                <div className="col-5">
                                  <div className="holding-list-normal-title">
                                    Frequency
                                  </div>
                                </div>
                                <div className="col-7">
                                  <div className="holding-list-bold-title">
                                    {currentOpenedTask?.frequency}
                                  </div>
                                </div>
                              </div>
                            )}
                            {currentOpenedTask.taskOwner && (
                              <div className="col-xl-4 col-6 d-flex row">
                                <div className="col-5">
                                  <div className="holding-list-normal-title">
                                    Creator
                                  </div>
                                </div>
                                <div className="col-7">
                                  <div
                                    className="holding-list-bold-title truncate"
                                    title={currentOpenedTask?.taskOwner}
                                  >
                                    {(currentOpenedTask.taskOwnerName ||
                                      currentOpenedTask?.taskOwner) && (
                                      <>
                                        <span className="cicrcle-name">
                                          {getInitials(
                                            currentOpenedTask.taskOwnerName ||
                                              currentOpenedTask?.taskOwner
                                          )}
                                        </span>
                                        {currentOpenedTask?.taskOwnerName ||
                                          currentOpenedTask?.taskOwner}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="col-xl-4 col-6 d-flex row">
                              <div className="col-5">
                                <div className="holding-list-normal-title">
                                  Internal Deadline
                                </div>
                              </div>
                              <div className="col-7">
                                <div
                                  className="holding-list-bold-title"
                                  style={{
                                    ...(currentOpenedTask?.deadlineDate &&
                                      getDateAndTimeDifference(
                                        currentOpenedTask?.deadlineDate,
                                        currentOpenedTask.endTime
                                      ) && {
                                        color: "red",
                                      }),
                                  }}
                                >
                                  {moment(
                                    currentOpenedTask &&
                                      currentOpenedTask.dueDate
                                  ).format("DD MMM YYYY")}
                                  &nbsp;
                                  {currentOpenedTask?.endTime
                                    ? moment(
                                        currentOpenedTask &&
                                          currentOpenedTask.endTime,
                                        "hh:mm A"
                                      ).format("hh:mm A")
                                    : currentOpenedTask?.customerName ===
                                      "Internal Task"
                                    ? moment(currentOpenedTask?.dueDate)
                                        .endOf("day")
                                        .format("hh:mm A")
                                    : ""}
                                </div>
                              </div>
                            </div>
                            {/* <div className="col-xl-4 col-6 d-flex row">
                              <div className="col-5">
                                <div className="holding-list-normal-title">
                                  Risk Rating
                                </div>
                              </div>
                              <div className="col-7">
                                <div
                                  className="holding-list-bold-title"
                                  style={{
                                    color: `${
                                      currentOpenedTask.riskRating
                                        ? currentOpenedTask.riskRating ===
                                          "High"
                                          ? "red"
                                          : currentOpenedTask.riskRating ===
                                            "Medium"
                                          ? "rgb(242, 215, 72)"
                                          : "rgb(93, 209, 91)"
                                        : "rgb(242, 215, 72)"
                                    }`,
                                  }}
                                >
                                  {currentOpenedTask &&
                                  currentOpenedTask.riskRating
                                    ? currentOpenedTask.riskRating
                                    : "Medium"}
                                </div>
                              </div>
                            </div> */}
                          </div>

                          {currentOpenedTask &&
                            currentOpenedTask.date_of_approval &&
                            currentOpenedTask.status === "Approved" &&
                            userDetails.UserType !== 4 && (
                              <div className="row">
                                <div className="col-4 col-sm-3 col-md-3 col-xl-3">
                                  <div className="holding-list-normal-title">
                                    Approval Pending on
                                  </div>
                                </div>
                                <div className="col-8 col-sm-9 col-md-9 col-xl-9">
                                  <div className="holding-list-bold-title">
                                    {moment(
                                      currentOpenedTask.DateOfApproval
                                    ).format("DD MMM YYYY  hh:mm A")}
                                  </div>
                                </div>
                              </div>
                            )}
                          {userDetails.UserType !== 4 &&
                            currentOpenedTask &&
                            currentOpenedTask.ExReview === 1 &&
                            currentOpenedTask.ReviewerEmailID !== "" &&
                            currentOpenedTask.ReviewerName !== "" &&
                            currentOpenedTask.ReviewerMobile && (
                              <div className="row">
                                <div className="col-4 col-sm-3 col-md-3 col-xl-3">
                                  <div className="holding-list-normal-title">
                                    Contact Details
                                  </div>
                                </div>
                                <div className="col-8 col-sm-9 col-md-9 col-xl-9">
                                  <div className="holding-list-bold-title">
                                    {`${currentOpenedTask.ReviewerMobile} | ${currentOpenedTask.ReviewerEmailID}`}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="task-details-file-grid1 d-flex justify-content-between align-items-end">
                        <div className="d-flex">
                          <div className="tab-list-space">
                            {showFiles ? (
                              <div
                                className="file-title file-title__active pointer"
                                onClick={() => {
                                  setShowFiles(true);
                                  setShowComments(false);
                                  setShowReference(false);
                                  setShowActivityLogs(false);
                                }}
                              >
                                File
                              </div>
                            ) : (
                              <div
                                className="file-title unActiveText-color pointer"
                                onClick={() => {
                                  setShowFiles(true);
                                  setShowComments(false);
                                  setShowReference(false);
                                  setShowActivityLogs(false);
                                  setIsShowUpdates(false);
                                }}
                              >
                                File
                              </div>
                            )}
                            {/* {showFiles && (
                              <div className="file-title-progress col-5"></div>
                            )} */}
                          </div>
                          <div className="tab-list-space">
                            {showComments ? (
                              <div
                                className="d-flex justify-content-center align-items-center"
                                onClick={() => getComments()}
                              >
                                <h1
                                  className="file-title file-title__active pointer"
                                  style={{ color: "#000000" }}
                                >
                                  Comment
                                </h1>

                                {CommentAndRefCountComponent(
                                  readCounts.total_user_unread_comments
                                )}
                              </div>
                            ) : (
                              <div
                                className="d-flex justify-content-center align-items-center"
                                onClick={() => getComments()}
                              >
                                <h1 className="file-title unActiveText-color">
                                  Comment
                                </h1>

                                {CommentAndRefCountComponent(
                                  readCounts.total_user_unread_comments
                                )}
                              </div>
                            )}
                          </div>
                          <div className="tab-list-space">
                            {referenceShow ? (
                              <div
                                className="d-flex justify-content-center align-items-center"
                                style={{ color: "#000000" }}
                                onClick={() => {
                                  setShowFiles(false);
                                  setIsShowUpdates(false);
                                  setShowComments(false);
                                  setShowReference(true);
                                  setShowActivityLogs(false);
                                }}
                              >
                                <h1 className="file-title file-title__active pointer">
                                  {currentOpenedTask?.customerName ===
                                  "Internal Task"
                                    ? "Note"
                                    : "Ref"}
                                </h1>
                                {currentOpenedTask?.customerName !==
                                  "Internal Task" &&
                                  CommentAndRefCountComponent(
                                    readCounts.reference_unread_count
                                  )}
                              </div>
                            ) : (
                              <div
                                className="d-flex justify-content-center align-items-center"
                                onClick={() => {
                                  setShowFiles(false);
                                  setIsShowUpdates(false);
                                  setShowComments(false);
                                  setShowReference(true);
                                  setShowActivityLogs(false);
                                }}
                              >
                                <h1 className="file-title unActiveText-color">
                                  {currentOpenedTask?.customerName ===
                                  "Internal Task"
                                    ? "Note"
                                    : "Ref"}
                                </h1>
                                {currentOpenedTask?.customerName !==
                                  "Internal Task" &&
                                  CommentAndRefCountComponent(
                                    readCounts.reference_unread_count
                                  )}
                              </div>
                            )}
                          </div>
                          {/* {currentOpenedTask?.customerName !== */}
                          <div className="tab-list-space">
                            {isShowUpdates ? (
                              <div
                                className="file-title file-title__active pointer"
                                style={{ color: "#000000" }}
                                onClick={() => setupUpdatesTab()}
                              >
                                Update
                              </div>
                            ) : (
                              <div
                                className="file-title unActiveText-color"
                                onClick={() => setupUpdatesTab()}
                              >
                                Update
                              </div>
                            )}
                          </div>
                          {/* )} */}
                          <div className="tab-list-space">
                            {showActivityLogs ? (
                              <div
                                className="file-title file-title__active pointer"
                                style={{ color: "#000000" }}
                                onClick={() => getActivityLogs()}
                              >
                                Log
                              </div>
                            ) : (
                              <div
                                className="file-title unActiveText-color"
                                onClick={() => getActivityLogs()}
                              >
                                Log
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Task Actions (Approval, Rejection, Mark Complete) */}
                        <div className="d-flex">
                          {((currentOpenedTask?.impact &&
                            currentOpenedTask.impact !== "<p></p>\n") ||
                            currentOpenedTask?.impactFileDetails?.length >
                              0) && (
                            <button
                              className="btn save-details-bnt reject-task mb-1 mr-3"
                              onClick={() =>
                                dispatch(
                                  fetchImpactDetailsByTaskId({
                                    task_name: currentOpenedTask.taskName,
                                    isShow: true,
                                    data: null,
                                    isLoading: true,
                                  })
                                )
                              }
                            >
                              Impact
                            </button>
                          )}
                          {currentOpenedTask &&
                            (currentOpenedTask.status === "Assigned" ||
                              currentOpenedTask.status === "Not Assigned" ||
                              currentOpenedTask.status === "Rejected") &&
                            (currentOpenedTask?.license !== "Task"
                              ? currentTaskLicenseSubscriptionEndDate &&
                                moment(
                                  currentOpenedTask.deadlineDate,
                                  "YYYY-MM-DD"
                                ).isSameOrBefore(
                                  currentTaskLicenseSubscriptionEndDate
                                )
                              : true) &&
                            (currentOpenedTask.customerName === "Internal Task"
                              ? userDetails.email ===
                                  currentOpenedTask.approver ||
                                userDetails.email ===
                                  currentOpenedTask.taskOwner ||
                                currentOpenedTask.assignTo === userDetails.email
                              : userDetails.UserType === 3 ||
                                userDetails.email ===
                                  currentOpenedTask.approver ||
                                userDetails.UserType === 4 ||
                                userDetails.UserType === 5) &&
                            (currentOpenedTask.cc
                              ? currentOpenedTask.cc !== userDetails.email
                              : true) && (
                              <button
                                onClick={() => teamMemberMarkComplete()}
                                className="btn save-details-bnt approve-task mb-1 d-block"
                                value="3"
                                disabled={
                                  // !(!checkIsInternalTask(currentOpenedTask)
                                  //   ? isPaymentPlanActive
                                  //   : true)
                                  !hasWorkPermissionOnTask
                                }
                              >
                                Mark Complete
                              </button>
                            )}
                          {currentOpenedTask &&
                            currentOpenedTask.status === "Approval Pending" &&
                            // (currentOpenedTask.customerName === "Internal Task"
                            //   ? userDetails.email ===
                            //       currentOpenedTask.approver ||
                            //     userDetails.email ===
                            //       currentOpenedTask.taskOwner
                            //   : userDetails.UserType === 3 ||
                            //     userDetails.email ===
                            //       currentOpenedTask.approver) &&
                            (currentOpenedTask.customerName === "Internal Task"
                              ? userDetails.email ===
                                  currentOpenedTask.assignTo &&
                                userDetails.email ===
                                  currentOpenedTask.taskOwner
                                ? !currentOpenedTask.approver
                                  ? true
                                  : userDetails.email ===
                                    currentOpenedTask.approver
                                : userDetails.email ===
                                    currentOpenedTask.approver ||
                                  userDetails.email ===
                                    currentOpenedTask.taskOwner
                              : userDetails.UserType === 3 ||
                                userDetails.email ===
                                  currentOpenedTask.approver) &&
                            currentOpenedTask &&
                            (currentOpenedTask.cc
                              ? currentOpenedTask.cc !== userDetails.email
                              : true) && (
                              <div class="d-flex mb-1">
                                <button
                                  onClick={(e) =>
                                    handleAppTask(currentOpenedTask)
                                  }
                                  className="btn save-details-bnt approve-task d-block"
                                  disabled={
                                    // !(!checkIsInternalTask(currentOpenedTask)
                                    //   ? isPaymentPlanActive
                                    //   : true)
                                    !hasWorkPermissionOnTask
                                  }
                                >
                                  approve task
                                </button>
                                <button
                                  className="btn save-details-bnt reject-task ml-3"
                                  value="3"
                                  onClick={() =>
                                    setVisibleRejectTaskModal(true)
                                  }
                                  disabled={
                                    // !(!checkIsInternalTask(currentOpenedTask)
                                    //   ? isPaymentPlanActive
                                    //   : true)
                                    !hasWorkPermissionOnTask
                                  }
                                >
                                  reject Task
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                      <div
                        ref={mainContainerRef}
                        className={`${styles.scrollTaskDetailsActions} pt-2 d-flex flex-column d-md-block`}
                      >
                        {referenceShow && (
                          <>
                            <div className="11"></div>
                            {currentOpenedTask?.customerName ===
                            "Internal Task" ? (
                              <TaskDescriptionTab />
                            ) : (
                              <TaskReferencesTab
                                countReferesh={fetchCommentAndRefCounts}
                              />
                            )}
                          </>
                        )}
                        {showFiles && <FilesDetails />}
                        {showComments && (
                          <Comments
                            commentReferesh={getComments}
                            countReferesh={fetchCommentAndRefCounts}
                          />
                        )}
                        {showActivityLogs && <Logs />}
                        {isShowUpdates && (
                          <Updates task_id={currentOpenedTask?.taskName} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </Container>
      </Container>
    )
  );
};
export default TaskData;
