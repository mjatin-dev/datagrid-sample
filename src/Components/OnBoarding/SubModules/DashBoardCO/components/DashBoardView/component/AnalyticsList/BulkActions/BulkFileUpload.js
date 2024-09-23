import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import axiosInstance from "apiServices";
import { actions as taskReportActions } from "Components/OnBoarding/SubModules/DashBoardCO/redux/actions";
import trashIcon from "assets/Icons/trash-icon.svg";
import downloadIcon from "assets/Icons/download-arrow.svg";
import { FileIcon, defaultStyles } from "react-file-icon";
import styles from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/styles.module.scss";
import {
  fileDownload,
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
import constant from "CommonModules/sharedComponents/constants/constant";
import Modal from "react-responsive-modal";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
const { Dragger } = Upload;

const BulkFileUpload = ({
  openModal,
  closeModal,
  selectedList,
  resetSelectCol,
}) => {
  //   const [currentOpenedTask, setCurrentOpenedTask] = useState({});
  const { isPaymentPlanActive } = useGetTaskPermissions();
  const hasWorkPermissionOnTask = true;
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const mainContainerRef = useRef();
  const h = useScrollHeight(mainContainerRef, 0, [fileList]);

  const props = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  const dispatch = useDispatch();
  const userDetails = useSelector(
    (state) => state && state.auth && state.auth.loginInfo
  );
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data
  );
  const { isLoading, files: taskFilesById } = useSelector(
    (state) => state?.taskReport?.taskFilesById
  );

  // const getUpload = (file) => {
  //   let url = `${BACKEND_BASE_URL}compliance.api.bulkUploadFile`;

  //   // if (currentOpenedTask && currentOpenedTask.taskName) {
  //   //   url = `${BACKEND_BASE_URL}compliance.api.UploadFile`;
  //   // } else {
  //   //   url = `${BACKEND_BASE_URL}compliance.api.UploadFile`;
  //   // }

  //   // compliance.api.bulkUploadFile

  //   let TaskNameStr = "";
  //   selectedList.map((st) => {
  //     TaskNameStr += st.taskId + ",";
  //   });
  //   TaskNameStr = TaskNameStr.slice(0, -1);

  //   var formData = [];
  //   formData = new FormData();
  //   formData.append("doctype", "Task");
  //   formData.append("docname", TaskNameStr);
  //   formData.append("is_private", 1);
  //   for (var i = 0; i < file.length; i++) {
  //     formData.append("file_details", file[i]);
  //   }
  //   const config = {
  //     headers: {
  //       "content-type": "multipart/form-data",
  //     },
  //   };
  //   return axiosInstance.post(url, formData, config);
  // };

  // const handleSelectUploadFile = (file) => {
  //   const _fileList = (fileList && fileList.length > 0 && fileList) || [];
  //   var isPresent = false;
  //   let fileArray = [];
  //   file.forEach((file) => {
  //     isPresent = _fileList.some(function (el) {
  //       return el.file_name === file.name;
  //     });
  //     if (!isPresent) {
  //       fileArray.push(file);
  //     } else {
  //       toast.error(
  //         `File ${file.name} is already uploaded. Please rename it and upload`
  //       );
  //       return "";
  //     }
  //   });

  //   if (selectedList.length === 0) {
  //     toast.error("Please select any Task.");
  //     return "";
  //   }

  //   if (fileArray && fileArray.length !== 0) {
  //     try {
  //       getUpload(fileArray).then((response) => {
  //         const { data, status } = response;
  //         if (
  //           status === 200 &&
  //           data?.message &&
  //           data?.message?.status === true
  //         ) {
  //           toast.success("File Uploaded Successfully");
  //           closeModal(false);
  //           resetSelectCol();
  //           // if (currentOpenedTask && currentOpenedTask.taskName !== "") {
  //           //   dispatch(
  //           //     taskReportActions.getTaskFilesById({
  //           //       doctype: "Task",
  //           //       docname: currentOpenedTask.taskName,
  //           //       is_references: 0,
  //           //     })
  //           //   );
  //           // }
  //         }
  //       });
  //     } catch (error) {
  //       toast.error("Something went wrong! Please try again.");
  //     }
  //   }
  // };

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

  useEffect(() => {
    if (taskFilesById && taskFilesById.length !== 0) {
      setFileList(taskFilesById);
    } else {
      setFileList([]);
    }
  }, [taskFilesById]);

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
          <Dots />
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
                            <Dragger {...props}>
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                              </p>
                              <p className="ant-upload-text">
                                Click or drag file to this area to upload
                              </p>
                              <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly
                                prohibited from uploading company data or other
                                banned files.
                              </p>
                            </Dragger>
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
  const fileName = file.name || file.file_name || file.fileName;
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

export default BulkFileUpload;
