import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import {
  removeOnlySpaces,
  removeWhiteSpaces,
} from "CommonModules/helpers/string.helpers";
import moment from "moment";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import inputRightArrow from "../../../../../../../../../assets/Icons/inputRightArrow.png";
import { actions as taskReportActions } from "Components/OnBoarding/SubModules/DashBoardCO/redux/actions";
import styles from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/styles.module.scss";

import { Modal } from "react-responsive-modal";
import useScrollHeight from "SharedComponents/Hooks/useScrollHeight";
import AutoGrowInput from "Components/Audit/components/Inputs/AutoGrowInput";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import "./modal.styles.scss";
// import { setTaskDetailCommentModal } from "../../redux/actions";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";

// import { useGetTaskPermissions } from "CommonModules/helpers/custom.hooks";
// import axiosInstance from "./../../../Services/axios.service";
import axiosInstance from "SharedComponents/Services/axios.service.js";
import { BACKEND_BASE_URL } from "apiServices/baseurl";

import { IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";

const ConfirmModal = ({ openModal, closeModal, tab, handleAction }) => {
  const [inputComment, setInputComment] = useState("");
  const dispatch = useDispatch();
  const mainContainerRef = useRef();

  // Are you sure you want to mark complete the selected tasks?
  const commentList = {
    "Approve": "Are you sure you want approve",
    "Reject": "Are you sure you want reject",
    "Mark Complete": "Are you sure you want mark complete",
  };

  const titleName = (str) => {
    str = str.split("_").join(" ");
    return str;
  };

  const countReferesh = () => {};
  const commentReferesh = () => {};
  const { isLoading, comments: getCommentsbyId } = useSelector(
    (state) => state?.taskReport?.getTaskCommentByRole
  );
  const h = useScrollHeight(mainContainerRef, 0, [getCommentsbyId]);
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data
  );

  const handleChange = (e) => {
    setInputComment(removeWhiteSpaces(e.target.value));
  };

  const submitComment = () => {
    dispatch(
      taskReportActions.postTaskCommentByTaskID({
        task_name: currentOpenedTask.taskName,
        content: inputComment,
      })
    );
    setInputComment("");
  };

  useEffect(() => {
    // countReferesh();
  }, [getCommentsbyId]);

  const handleClose = () => closeModal(false);

  return (
    <Modal
      center={true}
      showCloseIcon={false}
      open={openModal}
      onClose={handleClose}
      classNames={{
        modalContainer:
          "customReAssignModalContainerMobile confirm-modal-112  ",
        modal: "customReAssignModalMobile bulk-comment-form confirm-modal-112 ",
      }}
      id="bulk-comment-form"
    >
      <div className="modal-header">
        <h3 className="modal-title">{titleName(tab)}</h3>
        <span className="cursor-pointer" onClick={handleClose}>
          <MdClose />
        </span>
      </div>
      <div ref={mainContainerRef} className="container-fluid h-100 px-1">
        {isLoading ? (
          <Dots />
        ) : (
          <div className="row h-100">
            {currentOpenedTask?.status !== "Approved" && (
              <div className="col-12">
                <div className="text-title">
                  <div className="text-style">
                    {commentList?.[tab]}&nbsp;the selected tasks?
                  </div>
                </div>

                <div className="d-flex mt-3 justify-content-center w-100">
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => handleAction("confirm")}
                      className="button-confirm"
                    >
                      Confirm
                    </button>
                  </div>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => handleAction("cancel")}
                      className="button-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

const CommentLine = ({ comment, commentReferesh }) => {
  const dispatch = useDispatch();
  const readComment = async (commentId) => {
    let payload = {
      comment_id: commentId,
    };
    try {
      const readCommentData = await axiosInstance.post(
        `${BACKEND_BASE_URL}compliance.api.SetChecklistCommentsReadUser`,
        payload
      );
      if (
        readCommentData?.data?.message?.status &&
        readCommentData.status === 200
      ) {
        commentReferesh();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid">
      <div
        style={{
          height: "40px",
        }}
        className="row no-gutters align-items-center cursor-pointer"
        onClick={() => {
          if (!comment?.read) {
            readComment(comment.comment_id);
          }
          //   dispatch(
          //     setTaskDetailCommentModal({
          //       isShow: true,
          //       data: {
          //         ...comment,
          //       },
          //     })
          //   );
        }}
      >
        <div className="col-1">
          <div
            title={comment.user_name}
            className={`${styles.nameInitials} initial-name__container`}
          >
            {
              <span className="initial-name">
                {getInitialName(comment.user_name)}
              </span>
            }
          </div>
        </div>
        <div className="col-7">
          <p
            title={comment.content}
            className={`${styles.fileTitleText} truncate mb-0 pl-1`}
            style={
              !comment?.read ? { fontWeight: "700" } : { fontWeight: "normal" }
            }
          >
            {comment.content}
          </p>
        </div>
        <div className="col-4">
          <p className={`${styles.fileTimestampText} mb-0`}>
            {moment(comment.commented_on).format("DD MMM YYYY hh:mm A")}
          </p>
        </div>
      </div>
    </div>
  );
};

export const CommentDataModal = () => {
  const data = useSelector(
    (state) => state.DashboardState?.taskDetailById?.modals?.data
  );
  const isShowCommentDetails = useSelector(
    (state) =>
      state.DashboardState?.taskDetailById?.modals?.isShowCommentDetails
  );
  const dispatch = useDispatch();
  const handleClose = () => {};
  return (
    data && (
      <ProjectManagementModal
        visible={isShowCommentDetails}
        onClose={handleClose}
      >
        <div>
          <div className="d-flex align-items-center mb-3">
            <div className={`initial-name__container mr-2`}>
              <span className="initial-name">
                {getInitialName(data?.user_name)}
              </span>
            </div>
            <p className={`mb-0 ${styles.nameText}`}>{data?.user_name}</p>
          </div>
          <p className="mb-0 holding-list-bold-title">{data?.content}</p>
          <p className={`${styles.fileTimestampText} mb-0 mt-3`}>
            {moment(data?.commented_on).format("DD MMM YYYY hh:mm A")}
          </p>
        </div>
      </ProjectManagementModal>
    )
  );
};

export default ConfirmModal;
