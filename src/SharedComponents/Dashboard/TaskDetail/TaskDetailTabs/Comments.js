import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import {
  removeOnlySpaces,
  removeWhiteSpaces,
} from "CommonModules/helpers/string.helpers";
import moment from "moment";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import inputRightArrow from "../../../../assets/Icons/inputRightArrow.png";
import { actions as taskReportActions } from "Components/OnBoarding/SubModules/DashBoardCO/redux/actions";
import styles from "./styles.module.scss";
import useScrollHeight from "SharedComponents/Hooks/useScrollHeight";
import AutoGrowInput from "Components/Audit/components/Inputs/AutoGrowInput";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { setTaskDetailCommentModal } from "../../redux/actions";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";

// import { useGetTaskPermissions } from "CommonModules/helpers/custom.hooks";
import axiosInstance from "./../../../Services/axios.service";
import { BACKEND_BASE_URL } from "apiServices/baseurl";

const Comments = ({ commentReferesh, countReferesh }) => {
  const [inputComment, setInputComment] = useState("");
  // const { hasWorkPermissionOnTask } = useGetTaskPermissions();
  const dispatch = useDispatch();
  const mainContainerRef = useRef();
  const { isLoading, comments: getCommentsbyId } = useSelector(
    (state) => state?.taskReport?.getTaskCommentByRole
  );
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data
  );
  const h = useScrollHeight(mainContainerRef, 0, [
    getCommentsbyId,
    currentOpenedTask,
  ]);

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
    countReferesh();
  }, [getCommentsbyId]);

  return (
    <div ref={mainContainerRef} className="container-fluid h-100 px-1">
      {isLoading ? (
        <Dots />
      ) : (
        <div className="row h-100">
          {currentOpenedTask?.status !== "Approved" && (
            <div className="col-3">
              <AutoGrowInput
                variant="commentInput"
                value={inputComment}
                placeholder="Add a comment"
                onChange={handleChange}
                autoFocus
                // disabled={!hasWorkPermissionOnTask}
                // inputClassName={
                //   !hasWorkPermissionOnTask ? "cursor-not-allowed" : ""
                // }
              />
              <div className="inputIcon ml-auto">
                <img
                  src={inputRightArrow}
                  alt=""
                  className="cursor-pointer"
                  style={{
                    ...((inputComment === "" || inputComment === " ") && {
                      opacity: "0.6",
                      pointerEvents: "none",
                      cursor: "not-allowed",
                    }),
                  }}
                  onClick={() => {
                    if (removeOnlySpaces(inputComment) !== "") submitComment();
                  }}
                />
              </div>
            </div>
          )}
          <div
            className={`${styles.fileListContainerGrid} col-${
              currentOpenedTask?.status !== "Approved" ? "9" : "12"
            }`}
          >
            <div className={styles.fileListColumnContainer}>
              {!getCommentsbyId?.length && (
                <p className="text-muted my-3">No comments</p>
              )}
              {getCommentsbyId &&
                getCommentsbyId?.length > 0 &&
                getCommentsbyId.slice(0, Math.floor(h / 40)).map((comment) => {
                  return (
                    <CommentLine
                      comment={comment}
                      commentReferesh={commentReferesh}
                      countReferesh={countReferesh}
                    />
                  );
                })}
            </div>
            <div
              className={styles.fileListColumnContainer}
              style={{
                maxHeight: h + "px",
                overflowY: "auto",
              }}
            >
              {getCommentsbyId &&
                getCommentsbyId?.length > 0 &&
                getCommentsbyId.slice(Math.floor(h / 40)).map((comment) => {
                  return (
                    <CommentLine
                      comment={comment}
                      commentReferesh={commentReferesh}
                      countReferesh={countReferesh}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
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
          dispatch(
            setTaskDetailCommentModal({
              isShow: true,
              data: {
                ...comment,
              },
            })
          );
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
  const handleClose = () => dispatch(setTaskDetailCommentModal());
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

export default Comments;
