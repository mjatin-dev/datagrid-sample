import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import axiosInstance from "apiServices";
import trashIcon from "assets/Icons/trash-icon.svg";
import downloadIcon from "assets/Icons/download-arrow.svg";
import { FileIcon, defaultStyles } from "react-file-icon";
import styles from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/styles.module.scss";
import {
  fileDownload,
  getMaxFilesAndGenerateError,
  onDropRejection,
} from "CommonModules/helpers/file.helper";
import { AiFillFileText } from "react-icons/ai";
import moment from "moment";
import RefStyles from "CommonModules/sharedComponents/TaskReferencesTab/styles.module.scss";
import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import useScrollHeight from "SharedComponents/Hooks/useScrollHeight";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { useGetTaskPermissions } from "CommonModules/helpers/custom.hooks";
import { IconButton } from "@mui/material";
import { MdClose, MdDelete } from "react-icons/md";
import Modal from "react-responsive-modal";
import { CheckWorkPermission } from "CommonModules/helpers/tasks.helper";
const BulkUploadFile = ({ openModal, closeModal, selectedList }) => {
  //   const [currentOpenedTask, setCurrentOpenedTask] = useState({});
  const { isPaymentPlanActive } = useGetTaskPermissions();
  const hasWorkPermissionOnTask = true;
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const mainContainerRef = useRef();
  const h = useScrollHeight(mainContainerRef, 0, [fileList]);
  // const dispatch = useDispatch();
  const userDetails = useSelector(
    (state) => state && state.auth && state.auth.loginInfo
  );
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data
  );
  const { isLoading } = useSelector(
    (state) => state?.taskReport?.taskFilesById
  );

  const { activeLicenses } = useSelector(
    (state) => state?.DashboardState?.taskDetailById
  );

  const getUpload = (file) => {
    let url = `${BACKEND_BASE_URL}compliance.api.bulkUploadFile`;

    // if (currentOpenedTask && currentOpenedTask.taskName) {
    //   url = `${BACKEND_BASE_URL}compliance.api.UploadFile`;
    // } else {
    //   url = `${BACKEND_BASE_URL}compliance.api.UploadFile`;
    // }

    // compliance.api.bulkUploadFile

    let TaskNameStr = "";
    selectedList.map((st) => {
      let Permission = CheckWorkPermission(activeLicenses, st, userDetails);
      if (Permission.workPermission) {
        TaskNameStr += st.taskId + ",";
      } else {
        toast.error(`Action cannot be performed on the task ${st.subject}`);
      }
    });
    if (TaskNameStr) {
      TaskNameStr = TaskNameStr.slice(0, -1);
      // return false;
      var formData = [];
      formData = new FormData();
      formData.append("doctype", "Task");
      formData.append("docname", TaskNameStr);
      formData.append("is_private", 1);
      for (var i = 0; i < file.length; i++) {
        formData.append("file_details", file[i]);
      }
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      return axiosInstance.post(url, formData, config);
    } else {
      return false;
    }
  };

  const handleSelectUploadFile = (file) => {
    // console.log(fileList);

    const _fileList = (fileList && fileList.length > 0 && fileList) || [];
    // console.log(_fileList);
    var isPresent = false;
    let fileArray = [];
    file.forEach((file) => {
      isPresent = _fileList.some(function (el) {
        return el.file_name === file.name;
      });
      if (!isPresent) {
        fileArray.push(file);
      } else {
        toast.error(
          `File ${file.name} is already uploaded. Please rename it and upload`
        );
        return "";
      }
    });

    if (selectedList.length === 0) {
      toast.error("Please select any Task.");
      return "";
    }
    fileArray = getMaxFilesAndGenerateError(fileArray);
    if (fileArray && fileArray.length !== 0) {
      try {
        setLoading(true);
        getUpload(fileArray).then((response) => {
          const { data, status } = response;
          if (
            status === 200 &&
            data?.message &&
            data?.message?.status === true
          ) {
            toast.success("File Uploaded Successfully");
            closeModal(false);
            // if (currentOpenedTask && currentOpenedTask.taskName !== "") {
            //   dispatch(
            //     taskReportActions.getTaskFilesById({
            //       doctype: "Task",
            //       docname: currentOpenedTask.taskName,
            //       is_references: 0,
            //     })
            //   );
            // }
          } else {
            toast.error(
              data?.message?.status_response || "Unable to upload this file."
            );
          }
          setLoading(false);
        });
      } catch (error) {
        // toast.error("Something went wrong! Please try again.");
        setLoading(false);
      }
    }
  };

  const deleteUploadedFile = async (file_id) => {
    if (file_id && file_id !== "") {
      try {
        setLoading(true);
        const { data, status } = await axiosInstance.post(
          "compliance.api.DeleteFile",
          { file_id }
        );
        if (status === 200 && data.message && data.message.status) {
          toast.success("File deleted successfully!");
          // Get task files
          const _tempFileList = [...fileList];
          setFileList([
            ..._tempFileList.filter((file) => file.file_id !== file_id),
          ]);
          setLoading(false);
        } else {
          toast.error(
            "Something went wrong. Please try again after some time."
          );
          setLoading(false);
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again after some time.");
        setLoading(false);
      }
    }
  };

  // useEffect(() => {
  //   if (taskFilesById && taskFilesById.length !== 0) {
  //     console.log("Gelloooo", taskFilesById);
  //     setFileList(taskFilesById);
  //   } else {
  //     setFileList([]);
  //   }
  // }, [taskFilesById]);

  const handleClose = () => closeModal(false);
  return (
    <>
      <Modal
        center={true}
        showCloseIcon={false}
        open={openModal}
        onClose={handleClose}
        classNames={{
          modalContainer: "customReAssignModalContainerMobile ",
          modal: "customReAssignModalMobile bulk-comment-form",
        }}
      >
        <div className="modal-header">
          <div className="modal-top">
            <div style={{ fontSize: 18, fontWeight: 600 }}>Upload Files</div>
            <IconButton disableTouchRipple={true} onClick={handleClose}>
              <MdClose />
            </IconButton>
          </div>
        </div>
        <div className="border-style"></div>

        {isLoading || loading ? (
          <div className="row h-100 mb-4">
            <div className="col-12">
              <Dots />
            </div>
          </div>
        ) : (
          <>
            {((userDetails &&
              userDetails.UserType &&
              userDetails.UserType === 4) ||
              (userDetails &&
                userDetails.UserType &&
                userDetails.UserType === 3) ||
              (userDetails &&
                userDetails.UserType &&
                userDetails.UserType === 5)) && (
              <div
                ref={mainContainerRef}
                className={`container-fluid h-100 px-0`}
              >
                <div className="row h-100 mb-4">
                  {currentOpenedTask?.status !== "Approved" && (
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12">
                          <div className={styles.fileUploadBox}>
                            <Dropzone
                              onDropRejected={onDropRejection}
                              disabled={!hasWorkPermissionOnTask}
                              multiple={true}
                              maxSize={10485760}
                              accept={[
                                ".pdf",
                                ".xls",
                                ".xlsx",
                                ".odt",
                                ".ppt",
                                ".pptx",
                                ".txt",
                                ".doc",
                                ".docx",
                                ".rtf",
                                ".zip",
                                ".mp4",
                                ".jpg",
                                ".csv",
                                ".jpeg",
                                ".png",
                                ".S0001",
                                ".T0001",
                              ]}
                              onDrop={(acceptedFiles) => {
                                handleSelectUploadFile(acceptedFiles);
                              }}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div
                                  {...getRootProps({
                                    className: `dropzone ${
                                      !hasWorkPermissionOnTask
                                        ? "cursor-not-allowed"
                                        : ""
                                    }`,
                                  })}
                                >
                                  <div>
                                    <input {...getInputProps()} />
                                  </div>
                                  <div className={"upload-file"}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="30"
                                      height="30"
                                      viewBox="0 0 40 40"
                                      fill="none"
                                    >
                                      <path
                                        d="M27.4 14.833C33.4 15.3497 35.85 18.433 35.85 25.183L35.85 25.3997C35.85 32.8497 32.8666 35.833 25.4166 35.833L14.55 35.833C7.09997 35.833 4.11664 32.8497 4.11664 25.3997L4.11664 25.183C4.11664 18.483 6.53331 15.3997 12.4333 14.8497"
                                        stroke="#7A73FF"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M20 24.9999L20 6.0332"
                                        stroke="#7A73FF"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M25.5833 9.75033L20 4.16699L14.4166 9.75032"
                                        stroke="#7A73FF"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <div className="drag-drop-title text-center">
                                    Drag & drop or{" "}
                                    <span
                                      style={{
                                        color: "blue",
                                        marginLeft: 5,
                                        marginRight: 5,
                                      }}
                                    >
                                      Choose file
                                    </span>{" "}
                                    to upload here.
                                  </div>
                                  <div className={"support-file"}>
                                    Support files
                                  </div>
                                </div>
                              )}
                            </Dropzone>
                          </div>
                          {/* <p className={styles.instructionMessage}>
                          {constant.maxFileSizeWarnning}
                        </p> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* <div className="d-flex mt-3 justify-content-center w-100">
                  <div className="p-2">
                    <button className="button-confirm" >
                      Confirm
                    </button>
                  </div>
                  <div className="p-2">
                    <button className="button-cancel" >
                      Cancel
                    </button>
                  </div>
                </div> */}
                  <div
                    className={`${styles.fileListContainerGrid} col-${
                      currentOpenedTask?.status !== "Approved" ? "9" : "12"
                    }`}
                  >
                    <div className={styles.fileListColumnContainer}>
                      {/* {fileList?.length === 0 && (
                      // <div className="col-12">
                      <p className="my-3 text-muted">No files to view here</p>
                      // </div>
                    )} */}
                      {fileList &&
                        fileList.length > 0 &&
                        fileList.slice(0, Math.floor(h / 40)).map((file) => {
                          return (
                            <FileDocumentDetails
                              file={file}
                              currentOpenedTask={currentOpenedTask}
                              isPaymentPlanActive={isPaymentPlanActive}
                              deleteUploadedFile={deleteUploadedFile}
                              isShowDeleteButton={
                                userDetails.UserType === 3 ||
                                currentOpenedTask.approver ===
                                  userDetails.email ||
                                (currentOpenedTask.assignTo ===
                                  userDetails.email &&
                                  file.added_by === userDetails.email)
                              }
                            />
                          );
                        })}
                    </div>
                    <div
                      className={styles.fileListColumnContainer}
                      style={{
                        maxHeight: h + "px",
                        overflowY: "auto",
                      }}
                    >
                      {fileList &&
                        fileList.length > 0 &&
                        fileList.slice(Math.floor(h / 40)).map((file) => {
                          return (
                            <FileDocumentDetails
                              file={file}
                              currentOpenedTask={currentOpenedTask}
                              isPaymentPlanActive={isPaymentPlanActive}
                              deleteUploadedFile={deleteUploadedFile}
                              isShowDeleteButton={
                                userDetails.UserType === 3 ||
                                currentOpenedTask.approver ===
                                  userDetails.email ||
                                (currentOpenedTask.assignTo ===
                                  userDetails.email &&
                                  file.added_by === userDetails.email)
                              }
                            />
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export const FileDocumentDetails = ({
  file,
  currentOpenedTask,
  deleteUploadedFile,
  isShowUser = true,
  height = "40px",
  isShowDeleteButton = false,
  userDetail,
  isTaskNotOpen = false,
  hasWorkPermissionOnTask = true,
}) => {
  return (
    <div className="container-fluid px-0 mb-2">
      <div style={{ height }} className="row no-gutters align-items-center">
        {isShowUser && (
          <div className="col-1">
            <div
              title={file?.added_by || userDetail?.UserName}
              className={`${styles.nameInitials} initial-name__container`}
            >
              <span className="initial-name">
                {getInitialName(file?.added_by_name || userDetail?.UserName)}
              </span>
            </div>
          </div>
        )}
        <div className="col-1 d-flex justify-content-center">
          <AiFillFileText className={styles.fileIcon} />
        </div>
        <div className={`col-${!isShowUser ? "5" : "4"} d-flex`}>
          <p
            title={file.file_name || file.name}
            className={`${styles.fileTitleText} truncate mb-0`}
          >
            {file.file_name || file.name}
          </p>
        </div>
        <div className="col-2 d-flex justify-content-center">
          {file.file_id && (
            <img
              onClick={() => fileDownload(file.file_id, "download")}
              src={downloadIcon}
              alt="download"
              className={styles.imageIcon}
              title="Download"
            />
          )}
          {currentOpenedTask?.status !== "Approved" && isShowDeleteButton && (
            <img
              onClick={() => {
                if (hasWorkPermissionOnTask || isShowDeleteButton) {
                  deleteUploadedFile(file.file_id, file.file_name || file.name);
                }
                if (isTaskNotOpen) {
                  deleteUploadedFile(file.file_id, file.file_name || file.name);
                }
              }}
              src={trashIcon}
              alt="delete"
              title="Delete"
              className={`${styles.imageIcon} cursor-pointer`}
            />
          )}
        </div>
        <div className="col-4">
          {(file.creation_date || file.creation || file.lastModifiedDate) && (
            <p className={`${RefStyles.lastModifiedText} mb-0`}>
              {moment(
                file.creation_date || file.creation || file.lastModifiedDate
              ).format("DD MMM YYYY hh:mm A")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const FileDocumentDetailsBox = ({
  file,
  deleteUploadedFile,
  isShowDeleteButton = true,
}) => {
  const fileExtension = (file.file_name || file.name).split(".")?.pop();
  const fileName = file.name || file.file_name;
  return (
    <div
      className={`${styles.fileDetailsBoxContainer} d-flex align-items-center justify-content-between`}
    >
      <div className={styles.fileIconContainer}>
        <FileIcon extension={fileExtension} {...defaultStyles[fileExtension]} />
      </div>
      <div className="d-flex align-items-center justify-content-between flex-grow-1 pl-2">
        <div className="flex-grow-1">
          <p
            className={`${styles.fileName} mb-0 truncate w-100`}
            title={fileName}
          >
            {fileName}
          </p>
          {file?.size && (
            <p className={`${styles.fileSize} mb-0`}>{file.size / 1000}kb</p>
          )}
        </div>
        {isShowDeleteButton && (
          <IconButton
            onClick={() => {
              deleteUploadedFile(file?.file_id, fileName);
            }}
            size="small"
            disableTouchRipple={true}
          >
            <MdDelete style={{ color: "#FF5858" }} />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default BulkUploadFile;
