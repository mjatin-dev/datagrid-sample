/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { getSubstring } from "../../helpers/string.helpers";
import { getInitialName } from "../../helpers/GetIntialName.helper";

import "draft-js/dist/Draft.css";
import styles from "./styles.module.scss";
import { MdAdd } from "react-icons/md";

import apis from "../../../Components/OnBoarding/SubModules/DashBoardCO/api/index";
import { useDispatch, useSelector } from "react-redux";
import draftToHtml from "draftjs-to-html";
import { toast } from "react-toastify";
import tabStyles from "../../../SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/styles.module.scss";
import Dots from "../Loader/Dots";
import useScrollHeight from "SharedComponents/Hooks/useScrollHeight";
import { FileDocumentDetails } from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/File";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import {
  setIsRefEdited,
  setTaskDetailRefModal,
} from "SharedComponents/Dashboard/redux/actions";
import moment from "moment";
import { isEqual } from "lodash";
import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useGetTaskPermissions } from "CommonModules/helpers/custom.hooks";
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import axiosInstance from "SharedComponents/Services/axios.service";
import { onDropRejection } from "CommonModules/helpers/file.helper";
import constant from "../constants/constant";

const TaskReferencesTab = ({ countReferesh }) => {
  const { hasWorkPermissionOnTask } = useGetTaskPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [referencesList, setReferencesList] = useState([]);
  const dispatch = useDispatch();
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data || {}
  );
  const userEmail = useSelector(
    (state) => state && state.auth && state.auth?.loginInfo?.email
  );
  const mainContainerRef = useRef();
  const h = useScrollHeight(mainContainerRef, 0, [
    referencesList,
    fileList,
    currentOpenedTask,
    isLoading,
  ]);
  const isReferenceEdited = useSelector(
    (state) => state.DashboardState?.taskDetailById?.modals?.isReferenceEdited
  );
  const userEmailId = useSelector((state) => state?.auth?.loginInfo?.email);
  const fileInputRef = useRef();

  const getTaskReferencesData = async () => {
    try {
      setIsLoading(true);
      if (currentOpenedTask?.taskName) {
        const { data, status } = await apis.getTaskReferencesData(
          currentOpenedTask?.taskName
        );
        if (
          status === 200 &&
          data?.message?.status &&
          (data?.message?.data?.length > 0 || data?.message?.files?.length > 0)
        ) {
          let { data: references, files } = data?.message;
          setFileList([...files]);
          const referencesWithData = [...references]?.filter((item) => {
            const blockContent = convertFromHTML(item.reference || "");
            return blockContent?.contentBlocks?.length > 0;
          });
          setReferencesList([...referencesWithData]);
          setIsLoading(false);
          countReferesh();
        } else {
          setFileList([]);
          setReferencesList([]);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
    }
    if (isReferenceEdited) {
      dispatch(setIsRefEdited(false));
    }
  };

  const setReferenceFilesRequest = async (payload) => {
    try {
      setIsLoading(true);
      const { data, status } = await apis.setTaskReferenceFiles(payload);
      if (status === 200 && data?.message?.status) {
        toast.success(data?.message?.status_response);
        getTaskReferencesData();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onFileInputChange = (files) => {
    // const files = Array?.from(e?.target?.files) || [];

    const formData = new FormData();
    files.forEach((f) => {
      formData.append("file_details", f);
    });
    formData.append("task_name", currentOpenedTask?.taskName);
    setReferenceFilesRequest(formData);
  };

  const onFileDelete = async (file_id) => {
    try {
      setIsLoading(true);
      const { data, status } = await apis.deleteFile(file_id);
      if (status === 200 && data?.message?.status) {
        setIsLoading(false);
        getTaskReferencesData();
        toast.success("File deleted successfully!");
      } else {
        toast.error(data?.message?.status || "Unable to delete file.");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Unable to delete file.");
      setIsLoading(false);
    }
  };

  const readReference = async (task_reference_id) => {
    let payload = {
      task_reference_id: task_reference_id,
    };
    try {
      const readRefData = await axiosInstance.post(
        `${BACKEND_BASE_URL}compliance.api.SetTaskReferencesReadUser`,
        payload
      );
      if (readRefData?.data?.message?.status && readRefData.status === 200) {
        // commentReferesh();
        getTaskReferencesData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentOpenedTask?.taskName) {
      getTaskReferencesData();
    }
  }, [currentOpenedTask]);
  useEffect(() => {
    if (isReferenceEdited) {
      getTaskReferencesData();
    }
  }, [isReferenceEdited]);

  return isLoading ? (
    <Dots />
  ) : (
    <>
      <div ref={mainContainerRef} className="container-fluid h-100 px-0">
        <div className="row">
          {currentOpenedTask?.status !== "Approved" && (
            <div className={`${styles.taskReferencesContainer} col-3`}>
              <div className="mb-3">
                <button
                  disabled={!hasWorkPermissionOnTask}
                  className={`${styles.AddButton} ${
                    !hasWorkPermissionOnTask ? "cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (hasWorkPermissionOnTask) {
                      dispatch(
                        setTaskDetailRefModal({
                          isShow: true,
                          data: {
                            reference: "",
                            added_by: userEmailId,
                          },
                        })
                      );
                    }
                  }}
                >
                  <MdAdd /> Add Reference
                </button>
              </div>
              <div>
                <Dropzone
                  disabled={!hasWorkPermissionOnTask}
                  onDropRejected={onDropRejection}
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
                  ]}
                  multiple={true}
                  // onDrop={(acceptedFiles) => {
                  //   const files = [...acceptedFiles];
                  //   const validFiles = [...files].filter((uploadedFile) => {
                  //     const isFileAlreadyExist = [
                  //       ...uploadedFiles,
                  //       ...(fieldInputs?.file_details || []),
                  //     ].find(
                  //       (file) =>
                  //         (file?.file_name || file?.name) === uploadedFile.name
                  //     );
                  //     if (isFileAlreadyExist)
                  //       toast.error(
                  //         `${uploadedFile.name} is already uploaded.`
                  //       );
                  //     return !isFileAlreadyExist;
                  //   });
                  //   setUploadedFiles((pervFiles) => [
                  //     ...pervFiles,
                  //     ...validFiles,
                  //   ]);
                  // }}

                  onDrop={onFileInputChange}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <button
                          className={`${styles.AddButton} ${
                            !hasWorkPermissionOnTask ? "cursor-not-allowed" : ""
                          }`}
                        >
                          <MdAdd /> Upload Files
                        </button>
                      </div>{" "}
                      <p className={styles.instructionMessage}>
                        {constant.maxFileSizeWarnning}
                      </p>
                    </section>
                  )}
                </Dropzone>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="d-none"
                  multiple
                  onChange={onFileInputChange}
                  accept={
                    ".pdf,.xls,.xlsx,.odt,.ppt,.pptx,.txt,.doc,.docx,.rtf,.zip,.mp4,.jpg,.csv,.jpeg,.png"
                  }
                />
              </div>
            </div>
          )}
          <div
            className={`${styles.taskReferencesContainer} ${
              tabStyles.fileListContainerGrid
            } col-${currentOpenedTask?.status !== "Approved" ? "9" : "12"}`}
            style={{ gap: ".5rem" }}
          >
            {fileList && fileList.length > 0 && (
              <div
                className={tabStyles.fileListColumnContainer}
                style={{
                  maxHeight: h + "px",
                  overflowY: "auto",
                }}
              >
                {fileList
                  .filter((item) => item?.files?.length > 0)
                  .map((item) => {
                    return (
                      <div className={`${styles.formGroup} p-3 mb-3`}>
                        {/* <div className="d-flex align-items-center mb-1">
                          {(item?.added_by_name || item?.added_by) && (
                            <div
                              className="initial-name__container mr-2"
                              title={item?.added_by}
                            >
                              <span className="initial-name">
                                {getSubstring(
                                  getInitialName(
                                    item?.added_by_name || item?.added_by
                                  ),
                                  2
                                )}
                              </span>
                            </div>
                          )}
                          <p
                            className="holding-list-bold-title mb-0"
                            title={item?.added_by}
                          >
                            {item?.added_by_name || item?.added_by}
                          </p>
                        </div> */}
                        {item?.files?.map((file) => {
                          return (
                            <FileDocumentDetails
                              file={{
                                ...file,
                                added_by: item.added_by,
                                added_by_name: item.added_by_name,
                              }}
                              hasWorkPermissionOnTask={hasWorkPermissionOnTask}
                              isShowUser={true}
                              currentOpenedTask={currentOpenedTask}
                              deleteUploadedFile={(file_id) => {
                                if (userEmailId === item.added_by) {
                                  onFileDelete(file_id);
                                }
                              }}
                              height="21px"
                              isShowDeleteButton={userEmail === item.added_by}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
              </div>
            )}
            {fileList?.length === 0 && referencesList?.length === 0 && (
              <p className="text-muted my-3">No refs found</p>
            )}
            {referencesList?.length > 0 && (
              <div
                className={tabStyles.fileListColumnContainer}
                style={{
                  maxHeight: h + "px",
                  overflowY: "auto",
                }}
              >
                {referencesList.map((referenceData, index) => {
                  const {
                    // task_id,
                    reference,
                    added_by,
                    added_by_name,
                    last_modified,
                    task_reference_id,
                    edited,
                    read,
                  } = referenceData;

                  return (
                    <>
                      <div
                        key={`task_reference_${task_reference_id}`}
                        className={`${styles.formGroup} p-3 mb-3 cursor-pointer`}
                        onClick={() => {
                          readReference(task_reference_id);
                          dispatch(
                            setTaskDetailRefModal({
                              isShow: true,
                              data: referenceData,
                            })
                          );
                        }}
                      >
                        <div className="d-flex align-items-start justify-content-between mb-0">
                          {/* <div className="d-flex align-items-center"> */}
                          {(added_by_name || added_by) && (
                            <div
                              className="initial-name__container mr-2"
                              title={added_by}
                            >
                              <span className="initial-name">
                                {getSubstring(
                                  getInitialName(added_by_name || added_by),
                                  2
                                )}
                              </span>
                            </div>
                          )}
                          {/* <p
                              className="holding-list-bold-title mb-0"
                              title={added_by}
                            >
                              {added_by_name || added_by}
                            </p> */}
                          {/* </div> */}
                          <div
                            style={{ flex: 1 }}
                            className={`${styles.referenceViewer} ${
                              !read && styles.referenceTextBold
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: reference,
                            }}
                          ></div>
                          <div className="ml-1 d-flex flex-column align-items-end">
                            <p className={`${styles.lastModifiedText} mb-0`}>
                              {moment(
                                last_modified,
                                "YYYY-MM-DD kk:mm:ss"
                              ).format("DD MMM YYYY hh:mm A")}
                            </p>

                            {edited && (
                              <p
                                className={`${styles.lastModifiedText} mb-0 align-right`}
                              >
                                Edited
                              </p>
                            )}
                            {added_by === userEmail &&
                              hasWorkPermissionOnTask && (
                                <IconButton size="small">
                                  <Edit style={{ fontSize: "1rem" }} />
                                </IconButton>
                              )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const AddUpdateTaskReferenceModal = () => {
  const { hasWorkPermissionOnTask } = useGetTaskPermissions();
  const [isValidContent, setIsValidContent] = useState(false);
  const userEmail = useSelector(
    (state) => state && state.auth && state.auth?.loginInfo?.email
  );
  const isShowReferenceDetails = useSelector(
    (state) =>
      state.DashboardState?.taskDetailById?.modals?.isShowReferenceDetails
  );
  const dispatch = useDispatch();
  const refData = useSelector(
    (state) => state.DashboardState?.taskDetailById?.modals?.data
  );
  const [referenceTextBackup, setReferenceTextBackup] = useState("");
  const [referenceText, setReferenceText] = useState("");
  const [isSaveTextRequestLoading, setIsSaveTextRequestLoading] =
    useState(false);
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data || {}
  );

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const isEdited = !isEqual(
    referenceTextBackup,
    draftToHtml(convertToRaw(editorState.getCurrentContent()))
  );
  const handleClose = () => {
    // setReferenceText("");
    setReferenceText("");
    changeEditorState("");
    dispatch(setTaskDetailRefModal());
  };
  const setReferenceTextRequest = async () => {
    setIsSaveTextRequestLoading(true);
    try {
      const { data, status } = await apis.setTaskReferenceText({
        task_name: currentOpenedTask?.taskName,
        reference: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        ...(refData?.task_reference_id && {
          task_reference_id: refData?.task_reference_id,
        }),
      });
      if (status === 200 && data?.message?.status) {
        dispatch(setIsRefEdited(true));
        handleClose();
        toast.success("Reference updated successfully!");
      }
      setIsSaveTextRequestLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsSaveTextRequestLoading(false);
    }
  };

  const changeEditorState = (text) => {
    setReferenceTextBackup(text);
    const blocksFromHTML = convertFromHTML(text);
    const content = ContentState.createFromBlockArray(blocksFromHTML);
    const e_status = EditorState.createWithContent(content);
    setEditorState(e_status);
  };

  useEffect(() => {
    changeEditorState(referenceText);
  }, [referenceText]);

  useEffect(() => {
    const htmlData = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const blockContent = convertFromHTML(htmlData);
    setIsValidContent(blockContent.contentBlocks.length > 0);
  }, [editorState]);

  useEffect(() => {
    setReferenceText(refData?.reference || "");
  }, [refData]);

  return (
    <ProjectManagementModal
      visible={isShowReferenceDetails && refData}
      onClose={handleClose}
      containerClass="pt-5 px-4 pb-4"
    >
      {userEmail && refData && refData.added_by === userEmail ? (
        <>
          <div className={styles.taskReferencesContainer}>
            <div className={`${styles.formGroup} position-relative`}>
              <Editor
                readOnly={currentOpenedTask.status === "Approved"}
                editorState={editorState}
                editorClassName={styles.editorClass}
                // onBlur={() => setReferenceTextRequest()}

                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "fontSize",
                    "fontFamily",
                    "list",
                    "textAlign",
                    "link",
                    "remove",
                  ],
                }}
                onEditorStateChange={(editorState) => {
                  setEditorState(editorState);
                }}
              />
            </div>
          </div>
          {!isSaveTextRequestLoading ? (
            currentOpenedTask.status !== "Approved" && (
              <div className="d-flex align-items-center justify-content-between mt-3">
                <button
                  disabled={
                    !(hasWorkPermissionOnTask && isEdited && isValidContent)
                  }
                  onClick={setReferenceTextRequest}
                  className="project-management__button project-management__button--primary"
                >
                  Save
                </button>
                <button
                  onClick={handleClose}
                  className="project-management__button project-management__button--outlined"
                >
                  Cancel
                </button>
              </div>
            )
          ) : (
            <Dots />
          )}
        </>
      ) : (
        refData && (
          <>
            <div className={`${styles.formGroup} mt-3`}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  {(refData?.added_by_name || refData?.added_by) && (
                    <div
                      className="initial-name__container mr-2"
                      title={refData?.added_by}
                    >
                      <span className="initial-name">
                        {getSubstring(
                          getInitialName(
                            refData?.added_by_name || refData?.added_by
                          ),
                          2
                        )}
                      </span>
                    </div>
                  )}
                  <p
                    className="holding-list-bold-title mb-0"
                    title={refData?.added_by}
                  >
                    {refData?.added_by_name || refData?.added_by}
                  </p>
                </div>
                <p className={`${styles.lastModifiedText} mb-0`}>
                  {moment(refData?.last_modified, "YYYY-MM-DD kk:mm:ss").format(
                    "lll"
                  )}
                </p>
              </div>

              <div
                className={`${styles.referenceViewer} ${styles.modalReferenceViewer}`}
                dangerouslySetInnerHTML={{
                  __html: refData?.reference,
                }}
              ></div>
            </div>
          </>
        )
      )}
    </ProjectManagementModal>
  );
};

export default TaskReferencesTab;
