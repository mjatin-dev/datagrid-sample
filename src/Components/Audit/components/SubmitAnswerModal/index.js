/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import Text from "../Text/Text";
import Button from "../Buttons/Button";
import styles from "./style.module.scss";
import ProjectManagementModal from "../../../ProjectManagement/components/ProjectManagementModal";
import { useDispatch, useSelector } from "react-redux";
import { submitAnswerModalActions } from "../../redux/submitAnswersModalActions";
import Loading from "../../../../CommonModules/sharedComponents/Loader/index";
import AutoGrowInput from "../Inputs/AutoGrowInput";
import { DatePicker } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;
const SubmitAnswerModal = () => {
  const {
    isOpen,
    questionId,
    status,
    assignmentId,
    answer_option,
    fieldType,
    isLoading,
    question,
    answer,
    selectedAnswers,
  } = useSelector((state) => state?.AuditReducer?.submitAnswerModalStatus);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(submitAnswerModalActions.closeModal());
  };
  const setAnswer = useCallback(
    (payload) =>
      dispatch(
        submitAnswerModalActions.setAnswersInput({
          answer: payload,
        })
      ),
    [answer]
  );
  const setSelectedAnswers = useCallback(
    (payload) =>
      dispatch(
        submitAnswerModalActions.setAnswersInput({
          selectedAnswers: [...payload],
        })
      ),
    [selectedAnswers]
  );

  const handleChecked = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedAnswers([...selectedAnswers, name]);
    } else {
      setSelectedAnswers([
        ...selectedAnswers.filter((element) => element !== name),
      ]);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("assignment_id", assignmentId);
    formData.append("question_id", questionId);
    if (fieldType === "checkbox") {
      formData.append("answer_option", JSON.stringify(selectedAnswers));
    } else if (
      fieldType === "text-field" ||
      fieldType === "radio" ||
      fieldType === "date" ||
      fieldType === "date-range"
    ) {
      formData.append("answer", answer);
    }
    dispatch(submitAnswerModalActions.submitDataRequest(formData));
  };
  return (
    <ProjectManagementModal
      visible={isOpen}
      onClose={handleClose}
      containerClass={styles.submitAnswerModalContainer}
    >
      <div className={styles.submitAnswerContainer}>
        <div className={styles.header}>
          <div>
            <Text
              heading="p"
              variant="stepperMainHeading"
              text="Required points"
            />
          </div>
        </div>
        {!isLoading ? (
          <>
            {fieldType === "text-field" ||
            fieldType === "date" ||
            fieldType === "date-range" ? (
              <div className={styles.form}>
                <div className={styles.inputLabel}>{question}</div>
                {fieldType === "text-field" && (
                  <AutoGrowInput
                    variant="auditAssignmentInput"
                    disabled={status === "Complied"}
                    placeholder="Your answer"
                    value={answer}
                    name="text-field-answer"
                    onChange={(e) => {
                      setAnswer(e.target.value);
                    }}
                  />
                )}
                {fieldType === "date" && (
                  <DatePicker
                    format="DD MMM YYYY"
                    disabled={status === "Complied"}
                    placeholder="Select Date"
                    name="date-selector"
                    onChange={(date, dateString) => setAnswer(dateString)}
                    // value={answer}
                    value={(answer && moment(answer, "DD MMM YYYY")) || null}
                  />
                )}
                {fieldType === "date-range" && (
                  <RangePicker
                    disabled={status === "Complied"}
                    value={
                      answer && answer?.split("|")[0] && answer?.split("|")[1]
                        ? [
                            moment(answer?.split("|")[0], "DD MMM YYYY"),
                            moment(answer?.split("|")[1], "DD MMM YYYY"),
                          ]
                        : []
                    }
                    onChange={(date, formatStrings) => {
                      setAnswer(formatStrings.join("|"));
                    }}
                    format="DD MMM YYYY"
                  />
                )}
              </div>
            ) : fieldType === "radio" ? (
              <div className={styles.form}>
                <div class="form-group">
                  <div className={styles.inputLabel}>{question}</div>
                  {answer_option &&
                    answer_option?.length > 0 &&
                    answer_option?.map((item, index) => {
                      return (
                        <div
                          class="form-check my-2 ml-2"
                          key={`radio-options-${index}`}
                        >
                          <input
                            class="form-check-input"
                            disabled={status === "Complied"}
                            type="radio"
                            value={item}
                            checked={answer === item}
                            onChange={(e) => setAnswer(item)}
                            id={`radio-options-${index}`}
                          />
                          <label
                            class="form-check-label"
                            htmlFor={`radio-options-${index}`}
                          >
                            {item}
                          </label>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : fieldType === "checkbox" ? (
              <div className={styles.form}>
                <div class="form-group">
                  <div className={styles.inputLabel}>{question}</div>
                  <div className="row mx-1">
                    {answer_option &&
                      answer_option?.length > 0 &&
                      answer_option?.map((item, index) => {
                        return (
                          <div
                            className={`col-md-6 form-check pt-2 ${styles.auditAnswerCheckbox}`}
                            key={`checkbox-input-option-${index}`}
                          >
                            <input
                              class="form-check-input"
                              disabled={status === "Complied"}
                              name={item}
                              type="checkbox"
                              value={item.value}
                              onChange={(e) => handleChecked(e)}
                              id={`checkbox-input-option-${index}`}
                              checked={selectedAnswers?.includes(item)}
                            />
                            <label
                              htmlFor={`checkbox-input-option-${index}`}
                              class="form-check-label"
                            >
                              {item}
                            </label>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className={styles.loaderContainer}>
            <Loading isInline />
          </div>
        )}

        <div className="d-flex justify-content-center mt-3">
          <div className="p-2">
            <Button
              description="SUBMIT"
              disabled={status === "Complied"}
              onClick={() => handleSubmit()}
            />
          </div>
          <div className="p-2">
            <Button
              description="CANCEL"
              variant="cancelBtn"
              onClick={handleClose}
            />
          </div>
        </div>
      </div>
    </ProjectManagementModal>
  );
};

export default SubmitAnswerModal;
