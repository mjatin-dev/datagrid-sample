import React, { Fragment, useEffect, useState } from "react";
import { MdSend } from "react-icons/md";
import moment from "moment";
import ProjectManagementModal from "../../../ProjectManagement/components/ProjectManagementModal";
import IconButton from "../Buttons/IconButton";
import Text from "../Text/Text";
import { getInitialName } from "../../../../CommonModules/helpers/GetIntialName.helper";
import styles from "./styles.module.scss";

const Comment = ({ user_name, commented_on, content }) => (
  <div className={`${styles.comment}`}>
    <div className={styles.commentProfileImage}>
      <span>{getInitialName(user_name)}</span>
    </div>
    <div className={styles.commentRightSection}>
      <div className={styles.commentText}>
        <p className={styles.commentor} title={user_name}>
          {user_name}
          <span className={styles.timeStamp}>
            {moment(commented_on).format("DD MMM YYYY, HH:mm")}
          </span>
        </p>
        <span>{content}</span>
      </div>
    </div>
  </div>
);

const CommentSection = ({
  isVisible,
  onClose,
  comments = [],
  isError,
  onSend,
  QuestionCanExist = false,
}) => {
  const [commentText, setCommentText] = useState([]);
  const [commonComments, setCommonComments] = useState([]);
  const [taggedQuestionComments, setTaggedQuestionComment] = useState([]);

  useEffect(() => {
    const commonComments = [];
    const taggedQuestionComments = [];

    comments?.forEach((item) => {
      if (item.hasOwnProperty("question_id")) {
        const existingEntry = taggedQuestionComments.find(
          (entry) => entry.question_id === item.question_id
        );

        if (existingEntry) {
          existingEntry.allQuestions.push({
            user_name: item.user_name,
            content: item.content,
            commented_on: item.commented_on,
          });
        } else {
          taggedQuestionComments.push({
            question_id: item.question_id,
            parent: item.parent,
            question: item.question,
            allQuestions: [
              {
                user_name: item.user_name,
                content: item.content,
                commented_on: item.commented_on,
              },
            ],
          });
        }
      } else {
        commonComments.push(item);
      }
    });

    setTaggedQuestionComment(taggedQuestionComments);
    setCommonComments(commonComments);
  }, [comments]);

  return (
    <>
      <ProjectManagementModal visible={isVisible} onClose={onClose}>
        <div className={styles.header}>
          <Text
            heading="p"
            variant="stepperMainHeading"
            text="Comments"
            className={styles.sectionHeading}
          />
        </div>
        <div className={styles.main}>
          <div className={styles.comments}>
            {QuestionCanExist && commonComments.length > 0 && (
              <p className={styles.commentType}>CheckPoint Comments</p>
            )}
            {commonComments.map((element) => (
              <Comment
                key={element.commented_on}
                user_name={element.user_name}
                commented_on={element.commented_on}
                content={element.content}
              />
            ))}
            {QuestionCanExist && taggedQuestionComments.length > 0 && (
              <p className={styles.commentType}>Tagged Question Comments</p>
            )}
            {taggedQuestionComments.map((element, index) => (
              <Fragment key={element.question}>
                {element.hasOwnProperty("question_id") && (
                  <>
                    <span className={styles.commentType}>
                      {index + 1}) {element?.question}
                    </span>
                    {element.allQuestions.map((item) => (
                      <Comment
                        key={item.commented_on}
                        user_name={item.user_name}
                        commented_on={item.commented_on}
                        content={item.content}
                      />
                    ))}
                  </>
                )}
              </Fragment>
            ))}
          </div>
          <div className={styles.commentInputContainer}>
            <input
              type="text"
              className={styles.commentInput}
              placeholder="Type a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <IconButton
              variant="iconButtonPrimary"
              description={<MdSend className={styles.rotatedArrow} />}
              size="none"
              onClick={() => {
                setCommentText("");
                onSend?.(commentText);
              }}
              className={styles.sendButton}
            />
          </div>
        </div>
      </ProjectManagementModal>
    </>
  );
};

export default CommentSection;
