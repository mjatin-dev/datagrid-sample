import React, { useEffect } from "react";
import styles from "./style.module.scss";
import Text from "../Text/Text";
import { getShortStr } from "CommonModules/helpers/GetIntialName.helper";
import { FileIcon, defaultStyles } from "react-file-icon";
import axiosInstance from "apiServices";
import { fileDownload } from "../CustomCells/SubmittedDocs";

function AuditReferenceModal({
  isShowReferenceData,
  references,
  setReferences,
}) {
  const getReferences = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "audit.api.getQuestionDocreferences",
        { params: { question_id: isShowReferenceData.question_id } }
      );

      if (status === 200 && data?.message) {
        setReferences(data.message?.file || []);
      } else {
        setReferences([]);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (
      isShowReferenceData?.isShowReference &&
      isShowReferenceData?.question_id
    ) {
      getReferences();
    }
  }, [isShowReferenceData]);

  return (
    <>
      <div className={styles.header}>
        <Text heading="p" variant="stepperMainHeading" text="References" />
      </div>
      <div
        className={`${references?.length > 0 ? styles.file_section : ""} mt-3`}
      >
        {references?.length > 0 &&
          references?.map((file, index) => {
            const file_name = file.file_name?.split(".");
            const shortFileName = getShortStr(file_name[0]);
            const extension = file_name?.pop();
            return (
              <div key={index} title={file_name[0]} onClick={()=>fileDownload(file.file_id,"preview")}>
                <div className={styles.file_container}>
                  <FileIcon
                    extension={extension}
                    {...defaultStyles[extension]}
                  />
                </div>
                <p className={styles.file_name}>{shortFileName}</p>
              </div>
            );
          })}
        {references?.length === 0 && (
          <p className={`${styles.file_name} ${styles.notFound}`}>
            No files found
          </p>
        )}
      </div>
    </>
  );
}

export default AuditReferenceModal;
