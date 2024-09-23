/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import {
  checkIsInternalTask,
  getSubstring,
} from "../../helpers/string.helpers";
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
  setAddImpactModal,
  setIsRefEdited,
  setTaskDetailRefModal,
} from "SharedComponents/Dashboard/redux/actions";
import moment from "moment";
import { isEqual } from "lodash";
import { IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import useAccount from "SharedComponents/Hooks/Account.hook";
import auditApis from "../../../Components/Audit/api/index";
import Dropzone from "react-dropzone";
import { MdError, MdFileUpload } from "react-icons/md";
import inputStyles from "../../../Components/Audit/components/Inputs/style.module.scss";
import { onDropRejection } from "CommonModules/helpers/file.helper";

const TaskImpactTab = ({ fieldInputs, setFieldInputs }) => {
  const userDetail = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [impactList, setImpactList] = useState([]);
  const dispatch = useDispatch();
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data || {}
  );
  const userEmail = useSelector(
    (state) => state && state.auth && state.auth?.loginInfo?.email
  );
  const mainContainerRef = useRef();
  const h = useScrollHeight(mainContainerRef, 0, [
    setImpactList,
    fieldInputs.impactFileDetails,
    currentOpenedTask,
    isLoading,
  ]);
  const isReferenceEdited = useSelector(
    (state) => state.DashboardState?.taskDetailById?.modals?.isReferenceEdited
  );
  const { isPaymentPlanActive } = useSelector(
    (state) => state?.DashboardState?.taskDetailById
  );
  const userEmailId = useSelector((state) => state?.auth?.loginInfo?.email);

  useEffect(() => {
    if (currentOpenedTask?.taskName) {
      //  getTaskReferencesData();
    }
  }, [currentOpenedTask]);
  useEffect(() => {
    if (isReferenceEdited) {
      // getTaskReferencesData();
    }
  }, [isReferenceEdited]);

  const onRemoveFile = async (file_id, file_name) => {
    if (file_name && file_id) {
      const files = [...(fieldInputs.impactFileDetails || [])].filter(
        (element) => element.file_id !== file_id
      );
      try {
        await auditApis.deleteFile(file_id);
        setFieldInputs({
          ...fieldInputs,
          impactFileDetails: [...files],
        });
      } catch (error) {}
    } else if (file_name && !file_id) {
      let tempFileList = [...fieldInputs.impactFileDetails];

      tempFileList = [...(tempFileList || [])].filter(
        (file) => (file.name || file.file_name) !== file_name
      );

      setFieldInputs({ ...fieldInputs, impactFileDetails: [...tempFileList] });
    }
  };

  const deleteImpact = (index) => {
    let tempFileList = [...fieldInputs.impact];
    tempFileList.splice(index, 1);
    setFieldInputs({ ...fieldInputs, impact: tempFileList });
  };

  return isLoading ? (
    <Dots />
  ) : (
    <>
      <AddUpdateTaskImpacteModal
        impactList={impactList}
        setImpactList={setImpactList}
        fieldInputs={fieldInputs}
        setFieldInputs={setFieldInputs}
      />
      <div ref={mainContainerRef} className="container-fluid px-0">
        <div className="row">
          {currentOpenedTask?.status !== "Approved" && (
            <div className={`${styles.taskReferencesContainer} col-3`}>
              <div className="mb-3">
                <button
                  className={styles.AddButton}
                  onClick={() => {
                    dispatch(
                      setAddImpactModal({
                        isShow: true,
                        data: {
                          reference: "",
                          added_by: userEmailId,
                        },
                      })
                    );
                  }}
                >
                  <MdAdd /> Add Impact
                </button>
              </div>
              <div>
                <Dropzone
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
                  onDrop={(acceptedFiles) => {
                    const files = Array?.from(acceptedFiles) || [];
                    const validFiles = [...files].filter((uploadedFile) => {
                      const isFileAlreadyExist =
                        fieldInputs?.impactFileDetails &&
                        [...fieldInputs.impactFileDetails].find(
                          (file) =>
                            (file?.file_name || file?.name) ===
                            uploadedFile.name
                        );
                      if (isFileAlreadyExist)
                        toast.error(
                          `${uploadedFile.name} is already uploaded.`
                        );
                      return !isFileAlreadyExist;
                    });

                    setFieldInputs({
                      ...fieldInputs,
                      impactFileDetails: [
                        ...fieldInputs.impactFileDetails,
                        ...validFiles,
                      ],
                    });
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div
                          className={inputStyles.labelContainer}
                          style={{ width: "130px" }}
                        >
                          <label
                            className={`${inputStyles.uploadFileLabel}  ${inputStyles["task-model"]} `}
                            style={{ border: "1px solid #7a73ff" }}
                          >
                            <MdFileUpload className={inputStyles.uploadIcon} />
                            &nbsp;Upload File
                          </label>
                        </div>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </div>
          )}
          <div
            className={`${styles.taskReferencesContainer} ${
              tabStyles.fileListContainerGrid
            } col-${currentOpenedTask?.status !== "Approved" ? "9" : "12"}`}
            style={{ gap: ".5rem" }}
          >
            {fieldInputs.impactFileDetails?.length > 0 && (
              <div className={`${styles.formGroup} p-3 mb-3`}>
                {fieldInputs.impactFileDetails
                  .filter((file) => file)
                  .map((item, index) => {
                    return (
                      <FileDocumentDetails
                        file={item}
                        isShowUser={true}
                        currentOpenedTask={currentOpenedTask}
                        isPaymentPlanActive={isPaymentPlanActive}
                        deleteUploadedFile={(index) => {
                          onRemoveFile(
                            item.file_id,
                            item.name || item.file_name
                          );
                        }}
                        height="21px"
                        isShowDeleteButton={true}
                        userDetail={userDetail}
                        isTaskNotOpen={true}
                      />
                    );
                  })}
              </div>
            )}
            {fieldInputs.impactFileDetails?.length === 0 &&
              fieldInputs.impact?.length === 0 && (
                <p className="text-muted my-3">No impact found</p>
              )}
            {fieldInputs?.impact?.length > 0 && (
              <div
                className={tabStyles.fileListColumnContainer}
                style={{
                  maxHeight: h + "px",
                  overflowY: "auto",
                }}
              >
                {fieldInputs?.impact.map((impactData, index) => {
                  const {
                    // task_id,
                    reference,
                    added_by,
                    added_by_name,
                    last_modified,
                    task_reference_id,
                    edited,
                  } = impactData;

                  impactData.id = index + 1;

                  return (
                    <>
                      <div
                        key={`task_reference_${task_reference_id}`}
                        className={`${styles.formGroup} p-3 mb-3 cursor-pointer`}
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

                          <div
                            style={{ flex: 1 }}
                            className={styles.referenceViewer}
                            dangerouslySetInnerHTML={{
                              __html: reference,
                            }}
                          ></div>
                          <div className="ml-1 d-flex flex-column align-items-end">
                            {/* <p className={`${styles.lastModifiedText} mb-0`}>
                              {moment(
                                last_modified,
                                "YYYY-MM-DD kk:mm:ss"
                              ).format("DD MMM YYYY hh:mm A")}
                            </p> */}

                            {edited && (
                              <p
                                className={`${styles.lastModifiedText} mb-0 align-right`}
                              >
                                Edited
                              </p>
                            )}
                            {added_by === userEmail && (
                              <div style={{ display: "flex" }}>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    dispatch(
                                      setAddImpactModal({
                                        isShow: true,
                                        data: impactData,
                                      })
                                    );
                                  }}
                                >
                                  <Edit style={{ fontSize: "1rem" }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    deleteImpact(index);
                                  }}
                                >
                                  <Delete
                                    style={{ fontSize: "1rem", color: "red" }}
                                  />
                                </IconButton>
                              </div>
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

export const AddUpdateTaskImpacteModal = ({
  impactList,
  setImpactList,
  fieldInputs,
  setFieldInputs,
}) => {
  const userDetail = useAccount();
  const isShowAddImpact = useSelector(
    (state) => state.DashboardState?.taskDetailById?.modals?.isAddImpact
  );
  const dispatch = useDispatch();
  const impactData = useSelector(
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
    dispatch(setAddImpactModal({}));
  };
  const setImpactTextRequest = async () => {
    if (!impactData?.id) {
      const referenceObject = {
        added_by: userDetail.email,
        added_by_name: userDetail?.UserName,
        edited: false,
        reference: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        task_id: "",
        task_reference_id: "",
      };
      setFieldInputs({ ...fieldInputs, impact: [referenceObject] });
    } else {
      const temp = [...fieldInputs.impact];

      const impactObject = temp.find((item) => item.id === impactData.id);

      temp[0].reference = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );

      // setImpactList(temp);
      setFieldInputs({ ...fieldInputs, impact: temp });
    }

    dispatch(setIsRefEdited(true));
    handleClose();
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
    // if (data && userEmail && data?.reference && data?.added_by === userEmail) {
    setReferenceText(impactData?.reference || "");
    // }
  }, [impactData]);
  return (
    <ProjectManagementModal
      visible={isShowAddImpact}
      onClose={handleClose}
      containerClass="pt-5 px-4 pb-4"
    >
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
                className="project-management__button project-management__button--primary"
                onClick={setImpactTextRequest}
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
    </ProjectManagementModal>
  );
};

export default TaskImpactTab;
