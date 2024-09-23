import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import React from "react";
import styles from "./style.module.scss";
const ConfirmationModal = ({ visible, onConfirm = () => {}, onClose }) => {
  return (
    <ProjectManagementModal visible={visible} onClose={onClose}>
      <p>Are you sure you want to exit?</p>
      <div
        className={`${styles.modalActionsButtonContainer} justify-content-between d-flex align-items-center`}
      >
        <button
          onClick={() => {
            onClose();
          }}
          className="project-management__button project-management__button--outlined"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
          }}
          className="project-management__button project-management__button--primary"
        >
          Yes
        </button>
      </div>
    </ProjectManagementModal>
  );
};

export default ConfirmationModal;
