import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import React from "react";

const messagesForNotApplicableConfirmationModal = {
  notApplicable: {
    heading: 'Are you sure you want to mark this task as "Not Applicable"?',
    note: 'This task will not be repeated in the future. If you want it in the future, you may mark the task as "Applicable"',
  },
  applicable: {
    heading: 'Are you sure you want to mark this task as "Applicable"?',
    note: `This task will be repeated in the future. If you don't want it in the future, you may mark the task as "Not Applicable"`,
  },
};

const NotApplicableConfirmationModal = ({
  visible,
  onClose,
  onSubmit,
  forApplicable = false,
}) => {
  return (
    <ProjectManagementModal visible={visible} onClose={onClose}>
      <p>
        {!forApplicable
          ? messagesForNotApplicableConfirmationModal.notApplicable.heading
          : messagesForNotApplicableConfirmationModal.applicable.heading}
        <br />
      </p>
      <span>
        Note:&nbsp;
        {!forApplicable
          ? messagesForNotApplicableConfirmationModal.notApplicable.note
          : messagesForNotApplicableConfirmationModal.applicable.note}
      </span>

      <div
        className="d-flex align-items-center justify-content-between position-absolute"
        style={{
          width: "calc(100% - 2rem)",
          bottom: "1rem",
        }}
        onClick={onClose}
      >
        <button className="project-management__button project-management__button--outlined">
          No
        </button>
        <button
          onClick={onSubmit}
          className="project-management__button project-management__button--primary"
        >
          Yes
        </button>
      </div>
    </ProjectManagementModal>
  );
};

export default NotApplicableConfirmationModal;
