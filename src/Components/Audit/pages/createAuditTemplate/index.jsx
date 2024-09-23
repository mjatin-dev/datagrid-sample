/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, Suspense, useCallback, useState } from "react";
import Text from "../../components/Text/Text";
import { Input } from "../../components/Inputs/Input";
import styles from "./style.module.scss";
import DropZone from "../../components/FileDragAndDrop/dropZone";
import { toast } from "react-toastify";
import IconButton from "../../components/Buttons/IconButton";
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import axiosInstance from "../../../../apiServices";
import { useEffect } from "react";
import { AiFillFile } from "react-icons/ai";
import Button from "../../components/Buttons/Button";
import Label from "../../components/Labels/Label";
import Dropzone from "react-dropzone";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { createUpdateAuditTemplateActions } from "../../redux/createUpdateTemplatesActions";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";
import DeactivateAndDeleteModal from "../../../ProjectManagement/components/Modals/DeactivateAndDeleteModal";
import deleteIcon from "../../../../assets/ERIcons/projectDeleteIcon.svg";
import Loading from "../../../../CommonModules/sharedComponents/Loader/index";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { fileDownload } from "Components/Audit/components/CustomCells/SubmittedDocs";
import { useDebounce } from "CommonModules/helpers/custom.hooks";

// import TemplateDescriptionTextEditor from "../../components/TemplateDescriptionTextEditor";
const TemplateDescriptionTextEditor = lazy(() =>
  import("../../components/TemplateDescriptionTextEditor")
);
function CreateAuditTemplate({
  next,
  back,
  stepper,
  templateId,
  isNewTemplate,
}) {
  const [deleteFileId, setDeleteFileId] = useState("");
  const [templateExist, setTemplateExist] = useState(false);
  const [isShowDescriptionEditor, setIsShowDescriptionEditor] = useState(false);
  const history = useHistory();
  const data = useSelector(
    (state) =>
      state?.AuditReducer?.CreateUpdateAuditTemplate?.auditScopeBasicDetails
  );
  const templateIdFromState = useSelector(
    (state) => state?.AuditReducer?.templateId || templateId
  );

  const auditCategoriesList = useSelector(
    (state) => state?.AuditReducer?.auditCategoriesList
  );
  const isLoading = useSelector(
    (state) => state?.AuditReducer?.CreateUpdateAuditTemplate?.isLoading
  );
  const { circularFilesList, attachmentsList, faqsList, basicDetails } = data;

  const debouncedSearchValue = useDebounce(
    basicDetails?.audit_template_name,
    500
  );

  const setFaqsList = useCallback(
    (payload) =>
      dispatch(
        createUpdateAuditTemplateActions.setAuditScopeBasicDetails({
          ...data,
          faqsList: [...payload],
        })
      ),
    [data, templateIdFromState]
  );
  const setBasicDetails = useCallback(
    (payload) =>
      dispatch(
        createUpdateAuditTemplateActions.setAuditScopeBasicDetails({
          ...data,
          basicDetails: { ...payload },
        })
      ),
    [data, templateIdFromState]
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // fetch audit categories list
    dispatch(createUpdateAuditTemplateActions.getAuditCategoriesList());
  }, []);
  useEffect(() => {
    if (!isNewTemplate && templateIdFromState) {
      dispatch(
        createUpdateAuditTemplateActions.getAuditScopeBasicDetails(
          templateIdFromState
        )
      );
    }
  }, [templateIdFromState, isNewTemplate]);

  const customStyle = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#fafafa",
      width: "250px",
      border: "none",
      boxShadow: "rgb(99 99 99 / 20%) 0px 2px 8px 0px;",
    }),
  };

  //function to check if template name or audit catagory is empty or not
  const fileUpload = (file, doc) => {
    if (basicDetails.audit_template_name === "") {
      toast.error("Please Enter the template name  first");
    } else {
      const validFiles = [...file].filter((uploadedFile) => {
        const isFileAlreadyExist = [
          ...(doc === "guideliencedoc" ? circularFilesList : attachmentsList),
        ].find((circularFile) => circularFile.file_name === uploadedFile.name);
        if (isFileAlreadyExist) {
          toast.error(
            `${uploadedFile.name} already exists. Please rename to upload it again.`
          );
        }
        return !isFileAlreadyExist;
      });
      if (validFiles?.length > 0) uploadFile(validFiles, doc);
    }
  };

  //function to set files into state
  const uploadFile = (file, doc) => {
    const {
      audit_template_id,
      audit_template_name,
      audit_category,
      buffer_period,
      duration_of_completion,
      audit_description,
    } = basicDetails;
    const fileArray1 = [];
    const fileArray2 = [];
    if (doc === "guideliencedoc") {
      file.forEach((file) => {
        fileArray1.push(file);
      });
    } else {
      file.forEach((file) => {
        fileArray2.push(file);
      });
    }
    const formData = new FormData();
    formData.append(
      "audit_template_id",
      audit_template_id || templateIdFromState
    );
    formData.append("audit_template_name", audit_template_name);
    formData.append("audit_category", audit_category);
    formData.append("buffer_period", buffer_period);
    formData.append("duration_of_completion", duration_of_completion);
    formData.append("audit_description", audit_description);
    formData.append("audit_questions", JSON.stringify(faqsList));

    for (let i = 0; i < fileArray1.length; i++) {
      formData.append("guidelines_documents", fileArray1[i]);
    }
    for (let i = 0; i < fileArray2.length; i++) {
      formData.append("reference_attachment_files", fileArray2[i]);
    }

    // Uploading file
    dispatch(
      createUpdateAuditTemplateActions.postAuditScopeBasicDetailsFiles(formData)
    );
  };

  //function to set question answer state
  const questionInputChange = (event, index) => {
    const { name, value } = event.target;
    const list = [...faqsList];
    list[index][name] = removeWhiteSpaces(value);
    setFaqsList(list);
  };

  //function to remove question field
  const removeQuestionFields = (index) => {
    const list = [...faqsList];
    list.splice(index, 1);
    setFaqsList(list);
  };

  // function to add new question
  const addQuestionField = () => {
    setFaqsList([...faqsList, { audit_question: "", audit_answer: "" }]);
  };

  // function for state change for other fields
  const onFormValueChange = (event) => {
    const { name, value } = event.target;
    setBasicDetails({
      ...basicDetails,
      [name]: removeWhiteSpaces(value),
    });
    if (name === "audit_template_name") {
      setTemplateExist(true);
    }
  };

  const onDescriptionValueChange = useCallback(
    (text) => {
      setBasicDetails({
        ...basicDetails,
        audit_description: text || "",
      });
    },
    [basicDetails]
  );

  // function for audit catagory dropdown
  const onDropdownChnage = (event) => {
    setBasicDetails({
      ...basicDetails,
      audit_category: event.target.value,
    });
  };

  const isFAQAddMoreDisabled = faqsList?.some(
    (item) => !item.audit_question.trim() || !item.audit_answer.trim()
  );

  // function to delete file
  const removeFileData = (file_id) => {
    // Delete File
    dispatch(
      createUpdateAuditTemplateActions.deleteAuditScopeBasicDetailsFiles({
        file_id,
        audit_template_id: templateIdFromState,
      })
    );
  };

  const dataValidation = (e) => {
    const { name } = e.target;
    const tempBasicDetails = { ...basicDetails };
    switch (name) {
      case "audit_template_name":
        if (templateExist === true) {
          checkTemplateAvailability();
        } else if (
          basicDetails.audit_template_name &&
          basicDetails.audit_template_name !== " " &&
          basicDetails.audit_template_name !== ""
        ) {
          tempBasicDetails.audit_template_name_err = "";
        } else {
          tempBasicDetails.audit_template_name_err =
            "Template name is required.";
        }
        break;
      case "buffer_period":
        tempBasicDetails.buffer_period_err = !basicDetails.buffer_period
          ? "Buffer period is required."
          : basicDetails.buffer_period < 0
          ? "Buffer period can't be negative."
          : "";
        break;
      case "duration_of_completion":
        tempBasicDetails.duration_of_completion_err =
          !basicDetails.duration_of_completion
            ? "Duration of completion is required."
            : basicDetails.duration_of_completion < 0
            ? "Duration of completion can't be negative."
            : "";
        break;
      default:
        return;
    }
    setBasicDetails({ ...tempBasicDetails });
  };
  //function to submit final data
  const dataSubmit = (type) => {
    const formData = new FormData();
    for (const key in basicDetails) {
      if (
        key === "audit_template_id" &&
        !basicDetails[key] &&
        templateIdFromState
      ) {
        formData.append(key, templateIdFromState);
      } else {
        formData.append(key, basicDetails[key]);
      }
    }
    const tempBasicDetails = { ...basicDetails };
    tempBasicDetails.audit_template_name_err = !basicDetails.audit_template_name
      ? "Template name is required."
      : "";
    tempBasicDetails.buffer_period_err = !basicDetails.buffer_period
      ? "Buffer period is required."
      : basicDetails.buffer_period < 0
      ? "Buffer period can't be negative."
      : "";
    tempBasicDetails.duration_of_completion_err =
      !basicDetails.duration_of_completion
        ? "Duration of completion is required."
        : basicDetails.duration_of_completion < 0
        ? "Duration of completion can't be negative."
        : "";

    if (
      !tempBasicDetails.audit_template_name_err &&
      !tempBasicDetails.buffer_period_err &&
      !tempBasicDetails.duration_of_completion_err
    ) {
      formData.append("audit_questions", JSON.stringify(faqsList));
      dispatch(
        createUpdateAuditTemplateActions.postAuditScopeBasicDetails({
          type,
          history,
          formData,
        })
      );
    } else {
      setBasicDetails({ ...tempBasicDetails });
    }
  };

  const checkTemplateAvailability = async () => {
    let templateName = basicDetails?.audit_template_name.trim();
    const tempBasicDetails = { ...basicDetails };
    try {
      const response = await axiosInstance.post(
        "audit.api.getAuditTemplateAvailability",
        {
          template_name: templateName,
        }
      );
      if (response?.status === 200 && response?.data?.message?.status) {
        tempBasicDetails.audit_template_name_err = "";
        setTemplateExist(false);
      } else {
        tempBasicDetails.audit_template_name_err =
          response?.data?.message?.status_response || "Template already exist";
        setTemplateExist(true);
      }
      setBasicDetails({ ...tempBasicDetails });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (debouncedSearchValue && templateExist) {
      checkTemplateAvailability();
    }
  }, [debouncedSearchValue]);

  return (
    <>
      <DeactivateAndDeleteModal
        iconSrc={deleteIcon}
        visible={deleteFileId}
        Text="Are you sure, you want to delete this?"
        onSubmit={() => {
          removeFileData(deleteFileId);
          setDeleteFileId("");
        }}
        onClose={() => setDeleteFileId("")}
      />
      <BackDrop isLoading={isLoading} />
      <div>
        <div className={styles.container}>
          <div className={styles.inputContainer}>
            <Text
              heading="p"
              text="Add Scope & Basic Details"
              variant="stepperSubHeading"
            />
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.inputContainer}>
            <Input
              variant="auditAssignmentInput"
              placeholder="  Name of the template"
              labelText="Name of the Template"
              required={true}
              labelVariant="createTemplateLabel"
              name="audit_template_name"
              onBlur={dataValidation}
              onChange={onFormValueChange}
              value={basicDetails?.audit_template_name}
            />
            {basicDetails?.audit_template_name_err && (
              <Text
                heading="span"
                text={basicDetails.audit_template_name_err}
                variant="error"
              />
            )}
          </div>
        </div>
        <div className={styles.inputContainer}>
          <Label text="Brief Audit Description" variant="createTemplateLabel" />
          {isShowDescriptionEditor || basicDetails?.audit_description ? (
            <Suspense fallback={<Loading isInline />}>
              <TemplateDescriptionTextEditor
                data={basicDetails?.audit_description}
                setData={onDescriptionValueChange}
              />
            </Suspense>
          ) : (
            <div>
              <Button
                description="Add Description"
                variant="preview"
                size="medium"
                clas
                onClick={() => {
                  setIsShowDescriptionEditor(true);
                }}
              />
            </div>
          )}
        </div>
        <div>
          {/* {circularFilesList.length === 0 && ( */}
          <DropZone
            uploadFile={(file) => {
              fileUpload(file, "guideliencedoc");
            }}
            labelText=" Add official circular/Guidelines Documents from Regulators"
          />
          {/* )} */}
          {circularFilesList.length !== 0 &&
            circularFilesList.map((item) => {
              return (
                <div
                  key={`circular-${item.file_name}`}
                  className={styles.container}
                >
                  <div className={styles.commonContainer}>
                    <AiFillFile />
                  </div>
                  <div className={styles.commonContainer}>
                    <Text heading="h1" text={item.file_name} size="small" />{" "}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        fileDownload(item.file_id, "view");
                      }}
                      description="View"
                      variant="viewfilebtn"
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setDeleteFileId(item.file_id);
                      }}
                      description="Delete"
                      variant="viewfilebtn"
                    />
                  </div>
                </div>
              );
            })}
          {circularFilesList.length >= 1 && (
            <Dropzone
              multiple={true}
              onDrop={(file) => {
                fileUpload(file, "guideliencedoc");
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps({
                    className: "dropzone",
                  })}
                >
                  <div>
                    <input {...getInputProps()} />
                  </div>
                  <Button
                    description="ADD NEW FILE/REFERENCE"
                    variant="extraFileAddBtn"
                    size="large"
                  />
                </div>
              )}
            </Dropzone>
          )}
        </div>
        <div className={styles.container}>
          <div className={styles.inputContainer}>
            <Input
              variant="auditAssignmentInput"
              placeholder="Type the no of days"
              labelText="Duration of Completion (in days)"
              required={true}
              maxLength={3}
              pattern="[0-9]{3}"
              type="text"
              labelVariant="createTemplateLabel"
              name="duration_of_completion"
              onBlur={dataValidation}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  !value ||
                  (/^[0-9]{0,3}$/.test(value) && value !== 0 && value !== "0")
                ) {
                  onFormValueChange(e);
                }
              }}
              value={basicDetails?.duration_of_completion}
            />
            {basicDetails?.duration_of_completion_err && (
              <Text
                heading="span"
                text={basicDetails.duration_of_completion_err}
                variant="error"
              />
            )}
          </div>
          <div className={styles.inputContainer}>
            <Input
              variant="auditAssignmentInput"
              placeholder="Enter the extra no of days required"
              labelText="Buffer period (extra time for audit completion in days)"
              labelVariant="createTemplateLabel"
              name="buffer_period"
              maxLength={3}
              pattern="[0-9]{3}"
              type="text"
              required={true}
              onChange={(e) => {
                const value = e.target.value;
                if (!value || /^[0-9]{0,3}$/.test(value)) {
                  onFormValueChange(e);
                }
              }}
              onBlur={dataValidation}
              value={basicDetails?.buffer_period}
            />
            {basicDetails?.buffer_period_err && (
              <Text
                heading="span"
                text={basicDetails.buffer_period_err}
                variant="error"
              />
            )}
          </div>
        </div>
        <div>
          {/* {attachmentsList.length === 0 && ( */}
          <DropZone
            uploadFile={fileUpload}
            labelText="Add Attachments/references"
          />
          {/* )} */}
          {attachmentsList.length !== 0 &&
            attachmentsList.map((item) => {
              return (
                <div
                  key={`attachement-${item?.file_name}`}
                  className={styles.container}
                >
                  <div className={styles.commonContainer}>
                    <AiFillFile />
                  </div>
                  <div className={styles.commonContainer}>
                    <Text heading="h1" text={item.file_name} size="small" />{" "}
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        fileDownload(item.file_id, "view");
                      }}
                      description="View"
                      variant="viewfilebtn"
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setDeleteFileId(item.file_id);
                      }}
                      description="Delete"
                      variant="viewfilebtn"
                    />
                  </div>
                </div>
              );
            })}
          {attachmentsList.length >= 1 && (
            <Dropzone
              multiple={true}
              onDrop={(file) => {
                fileUpload(file);
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps({
                    className: "dropzone",
                  })}
                >
                  <div>
                    <input {...getInputProps()} />
                  </div>
                  <Button
                    description="ADD NEW FILE/REFERENCE"
                    variant="extraFileAddBtn"
                    size="large"
                  />
                </div>
              )}
            </Dropzone>
          )}
          {/*  */}
        </div>
        <div className="mt-3">
          <div>
            <Text
              heading="p"
              text="Frequently Asked questions"
              variant="stepperSubHeading"
            />
          </div>
          <div className={styles.container}>
            {faqsList.map((item, index) => {
              return (
                <>
                  <div
                    className={styles.questionContainer}
                    key={`frequently-asked-question-${index}`}
                  >
                    <Input
                      variant="auditAssignmentInput"
                      placeholder="Type Your Question Here"
                      labelText={`Question ${index + 1}`}
                      labelVariant="createTemplateLabel"
                      value={item.audit_question}
                      name="audit_question"
                      onChange={(event) => questionInputChange(event, index)}
                    />
                    <Input
                      variant="auditAssignmentInput"
                      placeholder="Add Answer to your Question"
                      labelText={`Answer of Question ${index + 1}`}
                      labelVariant="createTemplateLabel"
                      value={item.audit_answer}
                      name="audit_answer"
                      onChange={(event) => questionInputChange(event, index)}
                    />
                    {faqsList.length !== 1 && (
                      <IconButton
                        icon={<AiFillDelete />}
                        variant="removeIcon"
                        description="Remove"
                        onClick={() => removeQuestionFields(index)}
                        size="small"
                      />
                    )}
                    {faqsList.length - 1 === index && (
                      <IconButton
                        icon={<AiFillPlusCircle />}
                        variant="addIcon"
                        disabledVariant="addIconDisabled"
                        disabled={isFAQAddMoreDisabled}
                        description="ADD"
                        onClick={addQuestionField}
                        size="small"
                      />
                    )}
                  </div>
                </>
              );
            })}
          </div>
        </div>
        {/* <button onClick={dataSubmit}>Sumbit</button> */}
        <div className={styles.saveTemplate}>
          <div>
            <Button
              description="NEXT"
              size="small"
              variant="default"
              disabled={
                basicDetails.audit_template_name_err ||
                basicDetails.buffer_period_err ||
                basicDetails.duration_of_completion_err
              }
              onClick={() => {
                dataSubmit("next");
              }}
            />
          </div>
          <div>
            <Button
              description="SAVE TEMPLATE"
              variant="preview"
              size="medium"
              disabled={
                basicDetails.audit_template_name_err ||
                basicDetails.buffer_period_err ||
                basicDetails.duration_of_completion_err
              }
              onClick={() => {
                dataSubmit("exist");
              }}
            />
            <Button
              description="QUIT"
              variant="preview"
              size="medium"
              onClick={() => {
                dispatch(createUpdateAuditTemplateActions.clearAllState());
                history.push("/audit");
              }}
              className="ml-3"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateAuditTemplate;
