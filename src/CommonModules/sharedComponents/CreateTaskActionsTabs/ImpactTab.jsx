import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import Dropzone from "react-dropzone";
// import { isEqual } from "lodash";
import uploadIcon from "../../../assets/Icons/uploadIcon.svg";
import { toast } from "react-toastify";
import inputStyles from "Components/Audit/components/Inputs/style.module.scss";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  //   Editor,
  EditorState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useSelector } from "react-redux";
import draftToHtml from "draftjs-to-html";
import { isEqual } from "lodash";
import constant from "../constants/constant";
import {
  getMaxFilesAndGenerateError,
  onDropRejection,
} from "CommonModules/helpers/file.helper";
const ImpactTab = ({ visible, onClose, fieldInputs, setFieldInputs }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data || {}
  );
  const [isValidContent, setIsValidContent] = useState(false);
  const [impactText, setImpactText] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const impactData = fieldInputs?.impact || "";
  useEffect(() => {
    if (impactData && impactData?.length > 0) {
      setImpactText(impactData);
    }
  }, [impactData]);

  const changeEditorState = (text) => {
    const blocksFromHTML = convertFromHTML(text);
    const content = ContentState.createFromBlockArray(blocksFromHTML);
    const e_status = EditorState.createWithContent(content);
    setEditorState(e_status);
  };

  const saveImpactText = () => {
    const _tempImpactText = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const isImpactEdited = !isEqual(fieldInputs?.impact, _tempImpactText);
    const isFilesAdded = uploadedFiles?.length > 0;
    if (isImpactEdited || isFilesAdded) {
      setFieldInputs({
        ...fieldInputs,
        ...(isImpactEdited && {
          impact: isValidContent ? _tempImpactText : "",
        }),
        ...(isFilesAdded && {
          impactFileDetails: [
            ...uploadedFiles,
            ...(fieldInputs.impactFileDetails || []).filter(
              (item) => item?.file_id
            ),
          ],
        }),
      });
    }
    setUploadedFiles([]);
    // editorState.clear();
    onClose();
  };
  useEffect(() => {
    changeEditorState(impactText);
  }, [impactText, visible]);

  useEffect(() => {
    const htmlData = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const blockContent = convertFromHTML(htmlData);
    setIsValidContent(blockContent.contentBlocks.length > 0);
  }, [editorState]);

  useEffect(() => {
    if (fieldInputs?.impactFileDetails?.length > 0) {
      setUploadedFiles(
        [...fieldInputs?.impactFileDetails].filter((item) => !item.file_id)
      );
    }
  }, [visible, fieldInputs]);
  return (
    <ProjectManagementModal
      visible={visible}
      onClose={onClose}
      containerClass={styles.bigModal}
    >
      <div className={`${styles.modalHeader} w-100`}>
        <h5 className="mb-2">Attach Files</h5>
      </div>
      <p className={styles.instructionMessage}>
        Failure to complete the task on time may result in costs for regulatory
        actions. You can record the impact of not completing the task in time
        here. This will be shown in all the task based on the repetition.
      </p>
      <div
        className="d-flex w-100 justify-content-between"
        style={{ gap: "1rem" }}
      >
        <div className={styles.impactDataContainer}>
          <div className={`${styles.formGroup} position-relative`}>
            <Editor
              readOnly={currentOpenedTask.status === "Approved"}
              editorState={editorState}
              editorClassName={styles.editorClass}
              // onBlur={() => setImpactTextRequest()}

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
        <div className="w-50">
          <Dropzone
            onDropRejected={onDropRejection}
            maxSize={10485760}
            // accept={[
            //   ".pdf",
            //   ".xls",
            //   ".xlsx",
            //   ".odt",
            //   ".ppt",
            //   ".pptx",
            //   ".txt",
            //   ".doc",
            //   ".docx",
            //   ".rtf",
            //   ".zip",
            //   ".mp4",
            //   ".jpg",
            //   ".csv",
            //   ".jpeg",
            //   ".png",
            // ]}
            multiple={true}
            onDrop={(acceptedFiles) => {
              const files = [...acceptedFiles];
              const validFiles = [...files].filter((uploadedFile) => {
                const isFileAlreadyExist = [
                  ...uploadedFiles,
                  ...(fieldInputs.impactFileDetails || []),
                ].find(
                  (file) =>
                    (file?.file_name || file?.name) === uploadedFile.name
                );
                if (isFileAlreadyExist)
                  toast.error(`${uploadedFile.name} is already uploaded.`);
                return !isFileAlreadyExist;
              });
              const _files = getMaxFilesAndGenerateError([
                ...uploadedFiles,
                ...validFiles,
              ]);
              setUploadedFiles(_files);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className={inputStyles.labelContainer}>
                    <label
                      className={`${inputStyles.uploadFileLabel}  ${inputStyles["task-model-big"]}`}
                    >
                      <div className="d-flex flex-column align-items-center justify-content-center">
                        <img src={uploadIcon} alt="upload" />
                        <p
                          className={`${styles.instructionMessage} ${styles.instructionMessageActive}`}
                        >
                          Drag & Drop Upload File
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </section>
            )}
          </Dropzone>
          <p className={styles.instructionMessage}>
            {constant.maxFileSizeWarnning}
          </p>
          {uploadedFiles?.length > 0 && (
            <p className={styles.informationText}>
              {uploadedFiles?.length} File{uploadedFiles?.length > 1 ? "s" : ""}{" "}
              added
            </p>
          )}
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-center mt-3">
        <button
          disabled={
            (fieldInputs.impact
              ? isEqual(
                  draftToHtml(convertToRaw(editorState.getCurrentContent())),
                  fieldInputs.impact
                ) || !isValidContent
              : !isValidContent) && !(uploadedFiles?.length > 0)
          }
          onClick={() => {
            saveImpactText();
          }}
          className="project-management__button project-management__button--primary mx-3"
        >
          Save
        </button>
        <button
          onClick={() => {
            onClose();
            setUploadedFiles([]);
            // editorState.clear();
          }}
          className="project-management__button project-management__button--outlined mx-3"
        >
          Cancel
        </button>
      </div>
    </ProjectManagementModal>
  );
};

export default ImpactTab;
