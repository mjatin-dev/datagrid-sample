import { IconButton } from "@mui/material";
import React from "react";
import { MdDownload, MdRemoveRedEye } from "react-icons/md";
import { useSelector } from "react-redux";
import { fileDownload, onFileDownload } from "../../helpers/file.helper";
import { getSubstring } from "../../helpers/string.helpers";
import styles from "./styles.module.scss";
const TaskDescriptionTab = () => {
  const { description: taskDescription, fileDetails } = useSelector(
    (state) =>
      state?.DashboardState?.taskDetailById?.data || {
        description: "",
        fileDetails: [],
      }
  );
  return (
    <div className={styles.descriptionContainer}>
      {taskDescription ? (
        <p className="holding-list-bold-title">{taskDescription}</p>
      ) : (
        <p className="no-files">No Notes found</p>
      )}
      {fileDetails?.length > 0 && (
        <div className={`${styles.fileContainer}`}>
          {[...fileDetails]
            .filter((file) => file)
            .map((fileData) => {
              const file_name = fileData?.name || fileData?.file_name;
              const file_id = fileData?.id || fileData?.file_id;
              return (
                <div
                  key={file_id}
                  className="d-flex align-items-center justify-content-between"
                >
                  <p title={file_name} className={styles.fileName}>
                    {getSubstring(file_name, 52)}
                  </p>
                  <div>
                    {file_id && (
                      <IconButton
                        title="Preview"
                        onClick={() =>
                          file_id && fileDownload(file_id, "preview")
                        }
                        sx={{ height: "40px" }}
                        size="small"
                      >
                        <MdRemoveRedEye
                          className={`${styles.removeFileButton} mx-2`}
                        />
                      </IconButton>
                    )}
                    {file_id && (
                      <IconButton
                        title="Download"
                        onClick={() => file_id && onFileDownload(file_id)}
                        sx={{ height: "40px" }}
                        size="small"
                      >
                        <MdDownload
                          className={`${styles.removeFileButton} mx-2`}
                        />
                      </IconButton>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default TaskDescriptionTab;
