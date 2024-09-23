import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import AutoGrowInput from "Components/Audit/components/Inputs/AutoGrowInput";
import { eventsModuleActions } from "Components/Events/redux/actions";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RejectionCommentModal = ({
  onClose = () => {},
  visible,
  rejectionDetails,
  onReject,
}) => {
  const [commentText, setCommentText] = useState("");
  const dispatch = useDispatch();
  const rejectionCommentModal = useSelector(
    (state) => state?.eventsModuleReducer?.rejectionCommentModal
  );
  const handleClose = () => {
    onClose();
    setCommentText("");
    dispatch(
      eventsModuleActions.setRejectionCommentModal({
        visible: false,
        rejectionDetails: null,
        name: "",
      })
    );
  };
  const handleSubmit = () => {
    const payload = {
      ...rejectionCommentModal.rejectionDetails,
      comments: commentText,
    };
    if (onReject) {
      onReject(payload);
    } else {
      if (rejectionCommentModal.name === "Circular") {
        dispatch(eventsModuleActions.setCircularStatusRequest(payload));
      }
    }
    handleClose();
  };

  return (
    <ProjectManagementModal
      visible={visible || rejectionCommentModal.visible}
      onClose={handleClose}
      containerClass="position-relative"
      closeByOuterClick={false}
    >
      <p className="project-management__header-title">Reason for rejection</p>
      <AutoGrowInput
        maxLength={300}
        // disabled={isRequestPending}
        inputClassName="mx-0"
        onChange={(e) => {
          setCommentText(removeWhiteSpaces(e?.target?.value));
        }}
        value={commentText}
      />

      <div className="project-management__button-container--bottom-fixed d-flex align-items-center justify-content-between">
        <button
          disabled={!commentText || commentText === " "}
          onClick={handleSubmit}
          className="project-management__button project-management__button--primary"
        >
          Reject
        </button>
        <button
          onClick={() => {
            handleClose();
          }}
          className="project-management__button project-management__button--outlined"
        >
          Cancel
        </button>
      </div>
    </ProjectManagementModal>
  );
};

export default RejectionCommentModal;
