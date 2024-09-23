import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import AutoGrowInput from "Components/Audit/components/Inputs/AutoGrowInput";
import { eventsModuleActions } from "Components/Events/redux/actions";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import axiosInstance from "apiServices";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const AddComment = ({
  onClose = () => {},
  visible,
  commentDetails,
  handleSave = () => {},
  handleSend = () => {},
}) => {
  const [commentText, setCommentText] = useState("");
  const [savedComment, setSavedComment] = useState(null);
  const [commentsList, setCommentList] = useState([]);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const dispatch = useDispatch();
  const onSubmitComment = async (send = false) => {
    try {
      setIsRequestPending(true);
      const { data, status } = await axiosInstance.post(
        "compliance.api.CreateCommentDocument",
        {
          doctype: commentDetails.doctype,
          docname: commentDetails.docname,
          comments: commentText,
          send,
          ...(savedComment?.name && { c_name: savedComment?.name }),
        }
      );
      if (status === 200 && data?.message?.status) {
        toast.success(data?.message?.status_response);
        setIsRequestPending(false);
        setCommentText("");
        fetchComments();
      } else {
        toast.error(data?.message?.status_response);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setIsRequestPending(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, status } = await axiosInstance.post(
        "compliance.api.GetDocumentComments",
        {
          ...commentDetails,
        }
      );
      if (status === 200 && data?.message?.status) {
        // console.log(data);
        const saved_comment_list = data?.message?.saved_comment_list || [];
        const send_comment_list = data?.message?.sent_comment_list || [];
        setCommentList(send_comment_list);
        setSavedComment(saved_comment_list[0] || null);
      } else {
        setCommentList([]);
        setSavedComment(null);
      }
    } catch (error) {
      setCommentList([]);
      setSavedComment(null);
    }
  };

  const handleClose = () => {
    onClose();
    setCommentText("");
    setSavedComment(null);
    setCommentList([]);
    setIsRequestPending(false);
    dispatch(
      eventsModuleActions.setCommentModal({
        visible: false,
        commentDetails: null,
      })
    );
  };

  useEffect(() => {
    if (visible) {
      fetchComments();
    }
  }, [visible, commentDetails]);

  useEffect(() => {
    setCommentText(savedComment?.comment || "");
  }, [savedComment]);

  return (
    <ProjectManagementModal
      visible={visible}
      onClose={handleClose}
      containerClass="position-relative"
      closeByOuterClick={false}
    >
      <p className="project-management__header-title">Add comment</p>
      <AutoGrowInput
        maxLength={300}
        disabled={isRequestPending}
        inputClassName="mx-0"
        onChange={(e) => {
          setCommentText(removeWhiteSpaces(e?.target?.value));
        }}
        value={commentText}
      />
      <div className="mb-5" style={{ maxHeight: "300px", overflowY: "auto" }}>
        {commentsList.map((comment) => {
          return (
            <div
              key={`license-comment-${comment.name}`}
              className="d-flex align-items-center justify-content-between"
            >
              <div
                className="initial-name__container"
                title={comment.full_name || comment.owner}
              >
                <span className="initial-name">
                  {getInitialName(comment.full_name || comment.owner)}
                </span>
              </div>
              <p
                className="text-muted my-0 truncate w-50"
                title={comment.comment}
              >
                {comment.comment}
              </p>
              <p className="text-muted my-0 truncate">
                {moment(comment.modified).format("lll")}
              </p>
            </div>
          );
        })}
      </div>
      {isRequestPending ? (
        <Dots height="10px" />
      ) : (
        <div className="project-management__button-container--bottom-fixed d-flex align-items-center justify-content-between">
          <button
            disabled={!commentText || commentText === " "}
            onClick={() => {
              onSubmitComment();
            }}
            className="project-management__button project-management__button--primary"
          >
            Save
          </button>
          <button
            disabled={!commentText || commentText === " "}
            onClick={() => {
              onSubmitComment(true);
            }}
            className="project-management__button project-management__button--primary"
          >
            Send
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
      )}
    </ProjectManagementModal>
  );
};

export default AddComment;
