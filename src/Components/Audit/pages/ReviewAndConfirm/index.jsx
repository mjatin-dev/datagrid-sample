import React, { useEffect, useState, useCallback } from "react";
import styles from "./styles.module.scss";
import Text from "../../components/Text/Text";
import Button from "../../components/Buttons/Button";
// import { AiFillFile } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import auditApi from "../../api/index";
import { useHistory } from "react-router";
import { createUpdateAuditTemplateActions } from "../../redux/createUpdateTemplatesActions";
import { defaultStyles, FileIcon } from "react-file-icon";
import { dataTypes } from "../../constants/DateTypes";
import TemplateDescriptionTextEditor from "../../components/TemplateDescriptionTextEditor";
function ReviewTemplateDetails({ setStepper, templateId: template, setNavigateBackTo}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const templateIdFromState = useSelector(
    (state) => state?.AuditReducer?.templateId
  );
  let audit_template_id = template || templateIdFromState;

  const stepper = useSelector(
    (state) => state?.AuditReducer?.CreateUpdateAuditTemplate?.stepperState
  );
  const [templateData, setTemplateData] = useState([]);
  const [questionaryDetails, setQuestionaryDetails] = useState([]);
  const [checklistDetails, setChecklistDetails] = useState([]);

  const handleStepClick = useCallback(
    (step) => {
      setNavigateBackTo(4);
      const completedSlides = stepper.stepperCompletedSlides;
      if (completedSlides.includes(step)) {
        setStepper?.({
          ...stepper,
          // stepperCompletedSlides: completedSlides.filter(
          //   (item) => item !== step
          // ),
          stepperAcitveSlide: step,
        });
      }
    },
    [setStepper, stepper]
  );

  useEffect(() => {
    fetchCreateTemplateDetails();
    fetchQuestionaryDetails();
    fetchChecklist();
  }, []);

  const fetchCreateTemplateDetails = () => {
    try {
      auditApi.fetchAuditTempateDetails(audit_template_id).then((res) => {
        setTemplateData(res?.data?.message?.data);
      });
    } catch (err) {
      toast.error("something went wrong");
    }
  };
  const fetchQuestionaryDetails = () => {
    try {
      auditApi.fetchQuestionsFromTemplate(audit_template_id).then((res) => {
        setQuestionaryDetails(res?.data?.message?.question_list || []);
      });
    } catch (err) {
      toast.error("something went wrong");
    }
  };
  const fetchChecklist = () => {
    try {
      auditApi.fetchChecklistFromTemplate(audit_template_id).then((res) => {
        setChecklistDetails(res?.data?.message?.check_list || []);
      });
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  return (
    <div style={{ paddingRight: "1rem" }}>
      <div className={styles.headingContainer}>
        <div className={styles.heading}>
          <Text heading="p" size="stepperSubHeading" text="Scope Details" />
        </div>
        <div className={styles.editButton}>
          <Button
            description="EDIT"
            variant="edit"
            onClick={() => handleStepClick(1)}
          />
        </div>
      </div>
      <div className={styles.createTemplateFields}>
        <div className={styles.outputValues}>
          <Text
            heading="h3"
            variant="reviewDetailsLeft"
            size="small"
            text="Audit Name"
          />
        </div>
        <div className={styles.outputValues}>
          {templateData?.audit_template_name || ""}
        </div>
      </div>
      <div className={styles.createTemplateFields}>
        <div className={styles.outputValues}>
          <Text
            heading="h3"
            variant="reviewDetailsLeft"
            size="small"
            text="Audit Category"
          />
        </div>
        <div className={styles.outputValues}>
          {templateData?.audit_category}
        </div>
      </div>
      <div className={styles.createTemplateFields}>
        <div className={styles.outputValues}>
          <Text
            heading="h3"
            size="small"
            variant="reviewDetailsLeft"
            text="Possible Completion duration"
          />
        </div>
        <div className={styles.outputValues}>
          {templateData?.duration_of_completion || "-"}
        </div>
      </div>
      <div className={styles.createTemplateFields}>
        <div className={styles.outputValues}>
          <Text
            heading="h3"
            variant="reviewDetailsLeft"
            size="small"
            text="Buffer Time"
          />
        </div>
        <div className={styles.outputValues}>
          {templateData?.buffer_period || "-"}
        </div>
      </div>
      <div className={styles.createTemplateFields}>
        <div className={styles.outputValues}>
          <Text
            heading="h3"
            variant="reviewDetailsLeft"
            size="small"
            text="Description"
          />
        </div>
        <div className={styles.outputValues}>
          {/* {templateData?.audit_description || "-"} */}
          {templateData?.audit_description ? (
            <TemplateDescriptionTextEditor
              data={templateData?.audit_description}
              isReadOnly
            />
          ) : (
            "-"
          )}
        </div>
      </div>
      <div className={styles.createTemplateFields}>
        <div className={styles.outputValues}>
          <Text
            heading="h3"
            variant="reviewDetailsLeft"
            size="small"
            text="Attached Files"
          />
        </div>
        <div className={styles.outputValues}>
          {[
            ...(templateData?.file?.length > 0 ? templateData.file : []),
            ...(templateData?.reference_files?.length > 0
              ? templateData?.reference_files
              : []),
          ]?.map((item) => {
            const { file_name } = item;
            const file_type = file_name.split(".").pop();
            return (
              <div className="d-flex align-items-center">
                <div style={{ width: "10px" }}>
                  {file_type && (
                    <FileIcon
                      extension={file_type}
                      {...defaultStyles[file_type]}
                    />
                  )}
                </div>
                <Text
                  heading="p"
                  size="small"
                  className={`${file_name ? "ml-1" : ""}`}
                  text={file_name || "-"}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.headingContainer}>
        <div className={styles.heading}>
          <Text
            heading="h1"
            size="stepperSubHeading"
            text="Questionnaire Details"
          />
        </div>
        <div className={styles.editButton}>
          <Button
            description="EDIT"
            variant="edit"
            onClick={() => handleStepClick(2)}
          />
        </div>
      </div>
      {questionaryDetails?.map((questionnarie, index) => {
        return (
          <>
            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="Section"
                />
              </div>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  size="small"
                  text={questionnarie?.questionnaire_section}
                />
              </div>
            </div>
            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="Question"
                />
              </div>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  size="small"
                  text={questionnarie?.question}
                />
              </div>
            </div>
            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="Data Type"
                />
              </div>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  size="small"
                  // text={questionnarie?.field_type || "-"}
                  text={
                    dataTypes?.find(
                      (element) => element.value === questionnarie?.field_type
                    )?.label || "-"
                  }
                />
              </div>
            </div>
            {/* {questionnarie?.field_type === "date-range" && (
              <>
                <div className={styles.createTemplateFields}>
                  <div className={styles.outputValues}>
                    <Text
                      heading="h3"
                      variant="reviewDetailsLeft"
                      size="small"
                      text="Start Date"
                    />
                  </div>
                  <div className={styles.outputValues}>
                    <Text
                      heading="h3"
                      size="small"
                      text={questionnarie?.start_date || "-"}
                    />
                  </div>
                </div>
                <div className={styles.createTemplateFields}>
                  <div className={styles.outputValues}>
                    <Text
                      heading="h3"
                      variant="reviewDetailsLeft"
                      size="small"
                      text="End Date"
                    />
                  </div>
                  <div className={styles.outputValues}>
                    <Text
                      heading="h3"
                      size="small"
                      text={questionnarie?.end_date || "-"}
                    />
                  </div>
                </div>
              </>
            )} */}
            {questionnarie?.field_type === "attachment" && (
              <>
                <div className={styles.createTemplateFields}>
                  <div className={styles.outputValues}>
                    <Text
                      heading="h3"
                      variant="reviewDetailsLeft"
                      size="small"
                      text="Attachment Details"
                    />
                  </div>
                  <div className={styles.outputValues}>
                    <Text
                      heading="p"
                      size="small"
                      text={questionnarie?.attachment_details || "-"}
                    />
                  </div>
                </div>
                <div className={styles.createTemplateFields}>
                  <div className={styles.outputValues}>
                    <Text
                      heading="h3"
                      variant="reviewDetailsLeft"
                      size="small"
                      text="Attachment Type"
                    />
                  </div>
                  <div className={styles.outputValues}>
                    <div className="d-flex align-items-center justify-content-start">
                      {typeof questionnarie?.attachment_type === "string" ? (
                        questionnarie?.attachment_type ? (
                          <>
                            <div style={{ width: "20px" }} className="mr-2">
                              <FileIcon
                                {...defaultStyles[
                                  questionnarie?.attachment_type
                                    ?.split(".")
                                    .pop()
                                ]}
                              />
                            </div>
                            <Text
                              heading="p"
                              size="small"
                              text={
                                questionnarie?.attachment_type
                                  ?.split(".")
                                  .pop() || "-"
                              }
                            />
                          </>
                        ) : (
                          "-"
                        )
                      ) : null}

                      {typeof questionnarie.attachment_type === "object"
                        ? questionnarie.attachment_type?.length > 0
                          ? questionnarie.attachment_type
                              .map((item) => item.attachment_type)
                              .map((item) => {
                                return (
                                  <div className="mr-3 d-flex align-items-center">
                                    <div
                                      style={{ width: "18px" }}
                                      className="mr-1"
                                    >
                                      <FileIcon
                                        {...defaultStyles[
                                          item?.split(".").pop()
                                        ]}
                                      />
                                    </div>

                                    <Text
                                      heading="p"
                                      size="small"
                                      text={item?.split(".").pop() || "-"}
                                    />
                                  </div>
                                );
                              })
                          : "-"
                        : null}
                      {/* {questionnarie?.attachment_type && (
                        <div style={{ width: "20px" }} className="mr-2">
                          <FileIcon
                            {...defaultStyles[
                              questionnarie?.attachment_type?.split(".").pop()
                            ]}
                          />
                        </div>
                      )}
                      <Text
                        heading="p"
                        size="small"
                        text={
                          questionnarie?.attachment_type?.split(".").pop() ||
                          "-"
                        }
                      /> */}
                    </div>
                  </div>
                </div>
              </>
            )}
            {(questionnarie?.field_type === "radio" ||
              questionnarie?.field_type === "checkbox") && (
              <>
                <div className={styles.createTemplateFields}>
                  <div className={styles.outputValues}>
                    <Text
                      heading="h3"
                      variant="reviewDetailsLeft"
                      size="small"
                      text="Expected Answers"
                    />
                  </div>
                  <div className={styles.outputValues}>
                    <Text
                      heading="p"
                      size="small"
                      text={questionnarie?.answer_option?.join(",") || "-"}
                    />
                  </div>
                </div>
              </>
            )}
            {index < questionaryDetails.length - 1 && (
              <div className={styles.horizontalLine}></div>
            )}
          </>
        );
      })}
      <div className={styles.headingContainer}>
        <div className={styles.heading}>
          <Text
            heading="h1"
            size="stepperSubHeading"
            text="Checklist Details"
          />
        </div>
        <div className={styles.editButton}>
          <Button
            description="EDIT"
            variant="edit"
            onClick={() => handleStepClick(3)}
          />
        </div>
      </div>
      {checklistDetails?.map((checklist, index) => {
        return (
          <>
            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="Section"
                />
              </div>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  size="small"
                  text={checklist?.checklist_section}
                />
              </div>
            </div>
            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="Checkpoint"
                />
              </div>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  size="small"
                  text={checklist?.check_point || "-"}
                />
              </div>
            </div>

            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="Attachment Type"
                />
              </div>
              <div className={styles.outputValues}>
                <div className="d-flex align-items-center justify-content-start">
                  {typeof checklist?.attachment_format === "string" ? (
                    checklist?.attachment_format ? (
                      <>
                        <div style={{ width: "20px" }} className="mr-2">
                          <FileIcon
                            {...defaultStyles[
                              checklist?.attachment_format?.split(".").pop()
                            ]}
                          />
                        </div>
                        <Text
                          heading="p"
                          size="small"
                          text={
                            checklist?.attachment_format?.split(".").pop() ||
                            "-"
                          }
                        />
                      </>
                    ) : (
                      "-"
                    )
                  ) : null}

                  {typeof checklist.attachment_format === "object"
                    ? checklist.attachment_format?.length > 0
                      ? checklist.attachment_format
                          .map((item) => item.attachment_type)
                          .map((item) => {
                            return (
                              <div className="mr-3 d-flex align-items-center">
                                <div style={{ width: "18px" }} className="mr-1">
                                  <FileIcon
                                    {...defaultStyles[item?.split(".").pop()]}
                                  />
                                </div>

                                <Text
                                  heading="p"
                                  size="small"
                                  text={item?.split(".").pop() || "-"}
                                />
                              </div>
                            );
                          })
                      : "-"
                    : null}
                </div>
              </div>
            </div>
            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="How to verify"
                />
              </div>
              <div className={styles.outputValues}>
                <Text
                  heading="p"
                  size="small"
                  text={checklist?.how_to_verify || "-"}
                />
              </div>
            </div>
            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="Penalty"
                />
              </div>
              <div className={styles.outputValues}>
                <Text
                  heading="p"
                  size="small"
                  text={checklist?.penalty || "-"}
                />
              </div>
            </div>
            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="Documents Relied Upon"
                />
              </div>
              <div className={styles.outputValues}>
                <Text
                  heading="p"
                  size="small"
                  text={checklist?.documents_relied_upon
                    ?.map((item) => item.question)
                    .join(", ")}
                />
              </div>
            </div>
            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="Regulatory Reference"
                />
              </div>
              <div className={`${styles.outputValues} d-flex align-items-end`}>
                <div style={{ width: "10px" }}>
                  {checklist?.checkpoint_reference_list &&
                    checklist?.checkpoint_reference_list?.length > 0 &&
                    checklist?.checkpoint_reference_list[0]?.file_type && (
                      <FileIcon
                        extension={
                          checklist?.checkpoint_reference_list[0]?.file_type
                        }
                        {...defaultStyles[
                          checklist?.checkpoint_reference_list[0]?.file_type
                        ]}
                      />
                    )}
                </div>
                <Text
                  heading="p"
                  size="small"
                  className={`${
                    checklist?.checkpoint_reference_list &&
                    checklist?.checkpoint_reference_list?.length > 0 &&
                    checklist?.checkpoint_reference_list[0]?.file_name
                      ? "ml-1"
                      : ""
                  }`}
                  text={
                    (checklist?.checkpoint_reference_list &&
                      checklist?.checkpoint_reference_list?.length > 0 &&
                      checklist?.checkpoint_reference_list[0]?.file_name) ||
                    "-"
                  }
                />
              </div>
            </div>
            <div className={styles.createTemplateFields}>
              <div className={styles.outputValues}>
                <Text
                  heading="h3"
                  variant="reviewDetailsLeft"
                  size="small"
                  text="Severity"
                />
              </div>
              <div className={`${styles.outputValues}`}>
                <Text
                  heading="p"
                  size="small"
                  className="ml-1"
                  text={checklist?.severity || "-"}
                />
              </div>
            </div>
            {index < checklistDetails.length - 1 && (
              <div className={styles.horizontalLine}></div>
            )}
          </>
        );
      })}
      <div className="mt-4">
        <Button
          description="Done"
          size="small"
          variant="default"
          onClick={() => {
            history.push("/audit");
            dispatch(createUpdateAuditTemplateActions.clearAllState());
          }}
        />
      </div>
    </div>
  );
}

export default ReviewTemplateDetails;
