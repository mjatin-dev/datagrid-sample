import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import inputStyles from "Components/Audit/components/Inputs/style.module.scss";
import uploadIcon from "../../../assets/Icons/uploadIcon.svg";
import { useEffect } from "react";
import { isEqual } from "lodash";
import constant, { MAX_FILE_UPLOAD_LIMIT } from "../constants/constant";
import {
  getMaxFilesAndGenerateError,
  onDropRejection,
} from "CommonModules/helpers/file.helper";
const AttachementTab = ({
  visible,
  onClose,
  fileList,
  setFileList,
  fieldInputs,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const handleClose = () => {
    setUploadedFiles([]);
    onClose();
  };

  useEffect(() => {
    if (fileList && fileList?.length > 0 && visible) {
      setUploadedFiles([...fileList]);
    }
  }, [visible]);

  return (
    <ProjectManagementModal visible={visible} onClose={onClose}>
      <div className={`${styles.modalHeader} w-100`}>
        <h5 className="mb-2">Attach Files</h5>
      </div>
      <p className={styles.instructionMessage}>
        The files attached herein will repeat with all future tasks based on the
        repetition selected by you.
      </p>
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
              ...(fieldInputs?.file_details || []),
            ].find(
              (file) => (file?.file_name || file?.name) === uploadedFile.name
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
          {uploadedFiles?.length} File{fileList?.length > 1 ? "s" : ""} added
        </p>
      )}

      <div className="d-flex align-items-center justify-content-center mt-3">
        <button
          disabled={isEqual(fileList, uploadedFiles)}
          onClick={() => {
            if (uploadedFiles.length > 0 && !isEqual(fileList, uploadedFiles)) {
              setFileList([...uploadedFiles]);
              handleClose();
            }
          }}
          className="project-management__button project-management__button--primary mx-3"
        >
          Save
        </button>
        <button
          onClick={handleClose}
          className="project-management__button project-management__button--outlined mx-3"
        >
          Cancel
        </button>
      </div>
    </ProjectManagementModal>
  );
};
export default AttachementTab;
