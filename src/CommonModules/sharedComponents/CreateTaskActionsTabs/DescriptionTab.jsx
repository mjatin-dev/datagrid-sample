import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import AutoGrowInput from "Components/Audit/components/Inputs/AutoGrowInput";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import React, { useState } from "react";
import { useEffect } from "react";
import styles from "./styles.module.scss";
const DescriptionTab = ({
  visible = false,
  onClose,
  setFieldsInputs,
  fieldInputs,
}) => {
  // const [descriptionBackup, setDescriptionBackup] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (fieldInputs?.description) {
      setDescription(fieldInputs.description);
      // setDescriptionBackup(fieldInputs.description);
    }
  }, [fieldInputs.description]);
  return (
    <ProjectManagementModal visible={visible} onClose={onClose}>
      <div className={`${styles.modalHeader} w-100`}>
        <h5 className="mb-2">Description</h5>
      </div>
      <p className={styles.instructionMessage}>
        This is a permanent message that will repeat every time the task is
        triggered based on the repetition selected by you.
      </p>

      <AutoGrowInput
        variant="commentInput"
        value={description}
        onChange={(e) => {
          setDescription(removeWhiteSpaces(e?.target?.value));
        }}
      />
      <div className="d-flex align-items-center justify-content-center mt-3">
        <button
          disabled={fieldInputs.description === description}
          className="project-management__button project-management__button--primary mx-3"
          onClick={() => {
            setFieldsInputs({
              ...fieldInputs,
              description,
            });
            onClose();
          }}
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="project-management__button project-management__button--outlined mx-3"
        >
          Cancel
        </button>
      </div>
      {/* <div className="d-flex align-items-center justify-content-center mt-3">
        <button className="project-management__button project-management__button--primary mx-3">
          Save
        </button>
        <button className="project-management__button project-management__button--outlined mx-3">
          Cancel
        </button>
      </div> */}
    </ProjectManagementModal>
  );
};

export default DescriptionTab;
