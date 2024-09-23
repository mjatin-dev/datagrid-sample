import { defaultStyles, FileIcon } from "react-file-icon";
import { getSubstring } from "../../../../CommonModules/helpers/string.helpers";
import styles from "./styles.module.scss";
import { Menu, Dropdown } from "antd";
import { useState } from "react";
import axiosInstance from "../../../../apiServices";
import auditApis from "../../api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import notesIcon from "../../assets/icons/notes-icon.svg";
import notesIconActive from "../../assets/icons/notes-icon-active.svg";
import {
  getAssignmentCheckpoints,
  getAssignmentQuestionnarie,
} from "../../redux/actions";
import { MdMoreVert } from "react-icons/md";
import { mimeTypes } from "Components/Audit/constants/DateTypes/fileType";
import { base64ToBlob } from "CommonModules/helpers/file.helper";
const menu = (handleDelete, handleDownload, status, listType, userTypeNo) => (
  <Menu>
    <Menu.Item key="0" onClick={() => handleDownload()}>
      Download
    </Menu.Item>
    <Menu.Item key="1" onClick={() => handleDownload("preview")}>
      Preview
    </Menu.Item>
    {!status && checkuserTypeForDeleteAccess(listType, userTypeNo) && (
      <Menu.Item key="2" onClick={handleDelete}>
        Delete
      </Menu.Item>
    )}
  </Menu>
);

const checkuserTypeForDeleteAccess = (listType, userTypeNo) => {
  if (
    listType === "Questionnarie" &&
    (userTypeNo === 14 || userTypeNo === 8 || userTypeNo === 3)
  ) {
    return true;
  } else if (
    listType === "Checklist" &&
    (userTypeNo === 9 || userTypeNo === 16 || userTypeNo === 13)
  ) {
    return true;
  } else {
    return false;
  }
};
export const fileDownload = async (file_id, type = "download") => {
  axiosInstance
    .post("compliance.api.GetFileContent", { file_id })
    .then((res) => {
      if (res?.status === 200) {
        const fileExtension =
          res?.data?.message?.file_name?.split(".")?.pop() || "";

        const mimeType =
          mimeTypes.find((item) => item.fileExtension === "." + fileExtension)
            ?.fileMimeType || `application/${fileExtension}`;

        const url = `data:${mimeType};base64,${res?.data.message.encoded_string}`;
        const hiddenElement = document.createElement("a");
        if (type === "download") {
          hiddenElement.href = url;
          hiddenElement.download = res?.data.message.file_name;
        } else {
          const blob = base64ToBlob(
            res.data?.message?.encoded_string,
            mimeType
          );

          const blobURl = URL.createObjectURL(blob);
          hiddenElement.href = blobURl;
          hiddenElement.target = "_blank";
          hiddenElement.rel = "noreferrer";
          hiddenElement.title = res?.data.message.file_name;
        }
        hiddenElement.click();
      } else {
        toast.error("Unable to get this file.");
      }
    })
    .catch((err) => {
      toast.error("Unable to preview this file.");
    });
};

const SubmitedDocsComponent = ({ data, updateData, listType }) => {
  const userTypeNo = useSelector((state) => state?.auth?.loginInfo?.UserType);
  const value = data?.value;
  const { field_type, question_id } = data?.data;
  const dispatch = useDispatch();
  const { currentTab, currentAssignmentId } = useSelector(
    (state) => state?.AuditReducer?.assignmentData
  );

  const [currentFile, setCurrentFile] = useState(null);
  const handleDownload = (type = "download") => fileDownload(currentFile, type);
  const handleDelete = async () => {
    try {
      const { data, status } = await auditApis.deleteAuditScopeBasicDetailsFile(
        { file_id: currentFile }
      );
      if (status === 200 && data?.message?.status) {
        toast.success("File succesfully deleted");
        updateData?.();
        if (currentTab === "questionnarie") {
          dispatch(getAssignmentQuestionnarie(currentAssignmentId));
        } else if (currentTab === "checkpoints") {
          dispatch(getAssignmentCheckpoints(currentAssignmentId));
        }
      }
    } catch (error) {}
  };
  return (
    <div className={`d-flex flex-column ${styles.submitedFilesContainer}`}>
      {value &&
        value?.length > 0 &&
        value?.map((fileData) => {
          const { file_id, file_name, file_type } = fileData;
          return (
            <>
              <Dropdown
                overlay={menu(
                  handleDelete,
                  handleDownload,
                  data?.data?.status === "Complied" ? true : false,
                  listType,
                  userTypeNo
                )}
                trigger={["click"]}
              >
                <div
                  className={`${styles.submitedDoc} mb-1 d-flex align-items-center justify-content-between px-1`}
                  title={file_name}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentFile(file_id);
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className={styles.fileIcon}>
                      <FileIcon
                        extension={file_type}
                        {...defaultStyles[file_type]}
                      />
                    </div>
                    <span className={styles.fileName}>
                      {getSubstring(file_name, 10)}
                    </span>
                  </div>

                  <MdMoreVert />
                </div>
              </Dropdown>
            </>
          );
        })}
      {(!value || value?.length === 0) &&
        ((field_type && field_type === "attachment" && question_id) ||
          (!field_type && !question_id)) && (
          <span className="text-center">-</span>
        )}
    </div>
  );
};

const SubmitedDocsComponentForAuditee = ({
  data,
  updateData,
  listType = "checklist",
}) => {
  const userTypeNo = useSelector((state) => state?.auth?.loginInfo?.UserType);
  const value = data?.file_data;
  const { answer_type, question_id } = data;
  const dispatch = useDispatch();
  const { currentTab, currentAssignmentId } = useSelector(
    (state) => state?.AuditReducer?.assignmentData
  );

  const [currentFile, setCurrentFile] = useState(null);
  const handleDownload = (type = "download") => fileDownload(currentFile, type);
  const handleDelete = async () => {
    try {
      const { data, status } = await auditApis.deleteAuditScopeBasicDetailsFile(
        { file_id: currentFile }
      );
      if (status === 200 && data?.message?.status) {
        toast.success("File succesfully deleted");
        updateData?.();
        if (currentTab === "questionnarie") {
          dispatch(getAssignmentQuestionnarie(currentAssignmentId));
        } else if (currentTab === "checkpoints") {
          dispatch(getAssignmentCheckpoints(currentAssignmentId));
        }
      }
    } catch (error) {}
  };
  return (
    <div
      className={`d-flex flex-column ${styles.submitedFilesContainerForAuditee}`}
    >
      {value &&
        value?.length > 0 &&
        value?.map((fileData) => {
          const { file_id, file_name, file_type } = fileData;
          return (
            <>
              <Dropdown
                overlay={menu(
                  handleDelete,
                  handleDownload,
                  true,
                  listType,
                  userTypeNo
                )}
                trigger={["click"]}
                getPopupContainer={(triggerNode) => {
                  return triggerNode.parentNode;
                }}
              >
                <div
                  className={`${styles.submitedDoc} mb-1 d-flex align-items-center justify-content-between px-1`}
                  title={file_name}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentFile(file_id);
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className={styles.fileIcon}>
                      <FileIcon
                        extension={file_type}
                        {...defaultStyles[file_type]}
                      />
                    </div>
                    <span className={styles.fileName}>{file_name}</span>
                  </div>
                  <MdMoreVert />
                </div>
              </Dropdown>
            </>
          );
        })}
      {(!value || value?.length === 0) &&
        ((answer_type && answer_type === "attachment" && question_id) ||
          (!answer_type && !question_id)) && (
          <span className="text-center">-</span>
        )}
    </div>
  );
};
export const SubmitedDocsByAuditee = (data, updateData) => {
  const { field_type, status, list_type, submitted_doc_by_auditee } =
    data?.data?.data;
  return (
    <div>
      {typeof submitted_doc_by_auditee === "string" ? (
        <div>
          <p className={styles.customDataCell}>
            {submitted_doc_by_auditee || "-"}
          </p>
        </div>
      ) : (
        <SubmitedDocsComponent
          data={data.data}
          updateData={updateData}
          status={status}
          listType={list_type}
        />
      )}
    </div>
  );
};
const SubmitedDocs = (data, updateData) => {
  const { question_id, field_type, questionare_answer_id, status, list_type } =
    data?.data?.data;
  return (
    <div>
      {question_id && field_type && field_type !== "attachment" && (
        <div className="d-flex w-100 align-items-center justify-content-center mb-2">
          {questionare_answer_id ? (
            <img
              src={notesIconActive}
              alt="notes"
              className="mr-2"
              width={15}
            />
          ) : (
            <img src={notesIcon} alt="notes" className="mr-2" width={15} />
          )}
          <span className={styles.customDataCell}>Notes</span>
        </div>
      )}
      <SubmitedDocsComponent
        data={data.data}
        updateData={updateData}
        status={status}
        listType={list_type}
      />
    </div>
  );
};

export const SubmitedDocsQuestionReferences = (data, updateData) => {
  const { status, list_type, reference_document } = data?.data?.data;
  return (
    <div>
      {reference_document?.length > 0 ? (
        <SubmitedDocsComponent
          data={data.data}
          updateData={updateData}
          status={status}
          listType={list_type}
        />
      ) : (
        <span>-</span>
      )}
    </div>
  );
};

export const SubmitedDocsAuditee = (data, updateData) => {
  return (
    <div>
      <SubmitedDocsComponentForAuditee
        data={data}
        updateData={updateData}
        listType={"checklist"}
      />
    </div>
  );
};

export default SubmitedDocs;
