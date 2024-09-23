import { defaultStyles, FileIcon } from "react-file-icon";
import styles from "./styles.module.scss";
import notesIcons from "../../assets/icons/notes-icon.svg";
const RequiredDocPopup = ({ data }) => {
  const { value } = data;
  const { question_id } = data.data;
  const fileTypes =
    typeof value === "string"
      ? value
      : typeof value === "object" && value?.length > 0
      ? [...value].map((item) => item.attachment_type)
      : [];
  return value ? (
    <div className="d-flex align-items-center mt-2 flex-wrap p-2">
      {typeof fileTypes === "string" ? (
        fileTypes ? (
          <>
            <div style={{ width: "15px" }} className="mr-1">
              <FileIcon {...defaultStyles[fileTypes.split(".").pop()]} />
            </div>
            <span className={`${styles.customDataCell} mr-2`}>{fileTypes}</span>
          </>
        ) : (
          "No Required Type"
        )
      ) : null}

      {typeof fileTypes === "object"
        ? fileTypes?.length > 0
          ? fileTypes?.map((element, index) => {
              return (
                <div
                  className={`d-flex align-items-center flex-wrap p-2 ${
                    index !== fileTypes?.length - 1 ? "mr-2" : ""
                  }`}
                >
                  <div style={{ width: "15px" }} className="mr-1">
                    <FileIcon {...defaultStyles[element?.split(".").pop()]} />
                  </div>
                  <span title={element} className={`${styles.customDataCell}`}>
                    {element.split(".")?.pop() || "No Required Type"}
                  </span>
                </div>
              );
            })
          : "No Required Type"
        : null}
    </div>
  ) : question_id ? (
    <div className="d-flex w-100 align-items-center mt-2 flex-wrap p-2">
      <img src={notesIcons} alt="notes" className="mr-2" width={15} />{" "}
      <span className={styles.customDataCell}>Notes</span>
    </div>
  ) : (
    <span className={`${styles.customDataCell} d-block w-100 `}>No Required Type</span>
  );
};

export default RequiredDocPopup;
