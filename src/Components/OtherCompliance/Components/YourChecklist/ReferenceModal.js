import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import React from "react";
import styles from "../../style.module.scss";
import { IconButton } from "@mui/material";
import downloadArrowIcon from "../../../../assets/Icons/download-arrow.svg";
import { AiOutlineEye } from "react-icons/ai";
import { fileDownload } from "CommonModules/helpers/file.helper";
const reference = [
  {
    file_id: "fghjsfdk",
    file_name: "Account checkpoint.pdf",
  },
  {
    file_id: "fgijjsfdk",
    file_name: "Tax checkpoint.pdf",
  },
];
const ReferenceModal = ({ visible, onClose, data }) => {
  return (
    <ProjectManagementModal visible={visible} onClose={onClose}>
      <h4>Reference</h4>

      <div className={styles.otherComplianceDataTable}>
        <div
          className={`row no-gutters ${styles.tableHeaderContainer} ${styles.tableRow}`}
        >
          <div className={`col-4 ${styles.tableHeaderColumnTitle}`}>Name</div>
        </div>
        {data?.map((item, index) => {
          return (
            <div
              key={`other-compliance--checklist-details--${item.file_id}--${index}`}
              className={`row no-gutters align-items-center ${styles.tableRow} ${styles.tableDataRow}`}
            >
              <div className="col-9">
                <p className={`${styles.dataText} truncate`}>
                  {item?.file_name}
                </p>
              </div>
              <div className="col-3">
                <IconButton onClick={() => fileDownload(item.file_id, "view")}>
                  <AiOutlineEye
                    style={{ fontSize: "16px", color: "#7a73ff" }}
                  />
                </IconButton>
                <IconButton
                  onClick={() => fileDownload(item.file_id)}
                  className="ml-2"
                >
                  <img
                    src={downloadArrowIcon}
                    alt="download"
                    width={14}
                    height={14}
                  />
                </IconButton>
              </div>
            </div>
          );
        })}
      </div>
    </ProjectManagementModal>
  );
};

export default ReferenceModal;
