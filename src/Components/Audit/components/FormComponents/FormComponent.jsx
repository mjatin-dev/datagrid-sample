/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Text from "../Text/Text";
import Button from "../Buttons/Button";
import styles from "./style.module.scss";
import { inputItem } from "../../constants/FormBuilderConstants/InputItem";
import { BsTrashFill, BsPlusSquareFill } from "react-icons/bs";
import { Input } from "../Inputs/Input";
import { v4 as uuidv4 } from "uuid";
import { dataTypes } from "../../constants/DateTypes";
import axiosInstance from "../../../../apiServices";
import { BACKEND_BASE_URL } from "../../../../apiServices/baseurl";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useCallback } from "react";
import { createUpdateAuditTemplateActions } from "../../redux/createUpdateTemplatesActions";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";
import auditApis from "../../api/index";
import { useEffect } from "react";
import { useState } from "react";
import ExpectedAnswerInput from "./ExpectedAnswersInput";
import { checkpointAttachmentType } from "../../constants/DateTypes/fileType";
import AutoGrowInput from "../Inputs/AutoGrowInput";
import { MdCheck, MdClose, MdModeEdit } from "react-icons/md";
import _ from "lodash";
import MultiSelectInput from "../MultiSelectInput";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
const FormComponents = ({ next, back, stepper, templateId, isNewTemplate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [questionsList, setQuestionsList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEditFieldBackup, setCurrentEditFieldBackup] = useState({
    index: null,
    data: {},
  });
  const inputFieldList = useSelector(
    (state) =>
      state?.AuditReducer?.CreateUpdateAuditTemplate?.questionnarieDetails
  );

  const templateIdFromState = useSelector(
    (state) => state?.AuditReducer?.templateId
  );
  const templateName = useSelector(
    (state) =>
      state?.AuditReducer?.CreateUpdateAuditTemplate?.auditScopeBasicDetails
        ?.basicDetails?.audit_template_name
  );
  const {
    duration_of_completion: template_completion_duration,
    buffer_period: template_buffer_period,
  } = useSelector(
    (state) =>
      state?.AuditReducer?.CreateUpdateAuditTemplate?.auditScopeBasicDetails
        ?.basicDetails
  );
  const setInputFieldList = useCallback(
    (payload) => {
      dispatch(
        createUpdateAuditTemplateActions.setQuestionnarieDetails(payload)
      );
    },
    [inputFieldList]
  );

  const ondragstart = (event, value) => {
    event.dataTransfer.setData("value", value);
  };

  const ondragover = (event) => {
    event.preventDefault();
  };

  const drop = (event, sectionIndex, inputIndex, sectionName) => {
    const valueType = event.dataTransfer.getData("value");
    onCreateQuestion("addNewSection", sectionIndex, valueType);
  };

  const addNewSection = async () => {
    let isErrors = false;
    let isAddNewSection = false;
    let temp = [...inputFieldList];
    const tempLength = temp?.length || 0;
    let previousSectionQuestionInput = temp[tempLength - 1]?.inputs || [];
    if (tempLength >= 1) {
      const prevSection = temp[tempLength - 1];
      const prevSectionQuestions = prevSection?.inputs || [];
      const prevSectionQuestionsLength = prevSectionQuestions?.length || 0;
      if (prevSection.sectionNameErr) {
        toast.error(prevSection.sectionNameErr);
        isErrors = true;
      } else if (prevSection.bufferPeriodErr) {
        toast.error(prevSection.bufferPeriodErr);
        isErrors = true;
      } else if (prevSection.completionDurationErr) {
        toast.error(prevSection.completionDurationErr);
        isErrors = true;
      }
      if (prevSectionQuestionsLength > 0) {
        const lastQuestion =
          prevSectionQuestions[prevSectionQuestionsLength - 1];

        if (lastQuestion && Object.keys(lastQuestion)?.length > 0) {
          // check if the question is already saved or currently in edit mode
          const isQuestionUpdated =
            !lastQuestion?.question_id ||
            lastQuestion?.question_id ===
              currentEditFieldBackup?.data?.question_id
              ? await handleSaveFieldChanges(
                  tempLength - 1,
                  prevSectionQuestionsLength - 1
                )
              : true;

          if (!isErrors && isQuestionUpdated) {
            isAddNewSection = true;
          }
        }
      }
    }
    if (!isErrors && previousSectionQuestionInput?.length === 0) {
      toast.error("Please add requirements to previous section");
    }

    if (tempLength === 0 || isAddNewSection) {
      temp.push({
        id: uuidv4(),
        sectionName: "",
        completionDuration: "",
        bufferPeriod: "0",
        isError: false,
        questionSectionId: "",
        questionnaireSection: "",
        inputs: [],
      });
    }
    setInputFieldList(temp);
  };

  const onAttachmentTypeChange = (values, id) => {
    const temp = [...inputFieldList];
    const splitId = id.split(",");
    temp[splitId[1]].inputs[splitId[0]].attachment_type =
      values?.map((element) => ({ attachment_type: element.value })) || [];
    setInputFieldList([...temp]);
  };

  const deleteSection = async (uid, sectionId) => {
    let temp = [...inputFieldList];
    if (sectionId) {
      try {
        setIsLoading(true);
        const { data, status } = await auditApis.deleteQuestionnarieSection(
          sectionId
        );
        if (status === 200 && data?.message?.status) {
          temp = [...temp].filter(
            (element) => element?.questionSectionId !== sectionId
          );
          toast.success(data?.message?.status_response);
          setIsLoading(false);
        } else {
          toast.error(data?.message?.status_response);
          setIsLoading(false);
        }
      } catch (error) {
        toast.error("Something went wrong!");
        setIsLoading(false);
      }
    } else if (uid && !sectionId) {
      temp = [...temp].filter((element) => element?.id !== uid);
    }
    setInputFieldList(temp);
  };

  const addSectionName = async (event) => {
    let temp = [...inputFieldList];
    const { value, id, name } = event.target;
    temp[id].isError = false;
    if (name === "sectionName") {
      temp[id].sectionName = removeWhiteSpaces(value);
    } else if (name === "duration" && value !== 0 && value !== "0") {
      temp[id].completionDuration = parseInt(value);
    } else if (name === "buffer") {
      temp[id].bufferPeriod = parseInt(value);
    }

    setInputFieldList(temp);
  };

  const submitSection = async (event) => {
    let temp = [...inputFieldList];
    const { id } = event.target;
    const { sectionName, completionDuration, bufferPeriod } = temp[id];

    temp[id].bufferPeriodErr =
      bufferPeriod > template_buffer_period
        ? `Buffer Period should be ${
            parseInt(template_buffer_period) > 0 ? "less than or" : ""
          } equal to ${template_buffer_period} days`
        : bufferPeriod < 0
        ? "Buffer Period can't be negative."
        : "";

    temp[id].completionDurationErr =
      completionDuration !== "" &&
      completionDuration !== null &&
      !isNaN(completionDuration)
        ? parseInt(completionDuration) > parseInt(template_completion_duration)
          ? `Duration should be ${
              parseInt(template_completion_duration) > 0 ? "less than or" : ""
            } equal to ${template_completion_duration} days`
          : completionDuration < 0
          ? "Duration can't be negative"
          : ""
        : "Duration is required";
    temp[id].sectionNameErr =
      !sectionName || sectionName === " " ? "Section name is required" : "";

    if (
      !temp[id].completionDurationErr &&
      !temp[id].bufferPeriodErr &&
      !temp[id].sectionNameErr
    ) {
      let payload = {
        // audit_template_name: state.AuditReducer.templateId,
        audit_template_id: templateId || templateIdFromState,
        questionnaire_section: temp[id].sectionName,
        duration_of_completion: parseInt(temp[id].completionDuration) || 0,
        buffer_period: parseInt(temp[id].bufferPeriod) || 0,
      };
      let addSectionResponse = "";

      if (temp[id].questionSectionId === "") {
        addSectionResponse = await axiosInstance.post(
          `${BACKEND_BASE_URL}audit.api.AddQuestionnaireSection`,
          payload
        );
      } else {
        payload.question_section_id = temp[id].questionSectionId
          ? temp[id].questionSectionId
          : "";

        addSectionResponse = await axiosInstance.post(
          `${BACKEND_BASE_URL}audit.api.UpdateQuestionnaireSection`,
          payload
        );
      }

      if (addSectionResponse) {
        const { message } = addSectionResponse.data;
        if (message.status) {
          temp[id].questionSectionId =
            message?.question_section_id || temp[id]?.questionSectionId;
          temp[id].questionnaireSection =
            message?.questionnaire_section || temp[id]?.sectionName;
          temp[id].isError = false;
          if (temp[id]?.inputs[0]?.question_section_id) {
            temp[id].inputs[0].question_section_id =
              message?.question_section_id || temp[id]?.questionSectionId;
          }
          setInputFieldList(temp);
          return;
        } else {
          temp[id].isError = true;
          setInputFieldList(temp);
          return;
        }
      }
    }
    setInputFieldList(temp);
  };

  const deleteQuestion = async (uid, questionId, sectionIndex) => {
    let temp = [...inputFieldList];
    let checkListInputs = [...(temp[sectionIndex]?.inputs || [])];
    if (questionId) {
      try {
        setIsLoading(true);
        const { data, status } = await auditApis.deleteQuestionnarieQuestion(
          questionId
        );
        if (status === 200 && data?.message?.status) {
          checkListInputs = [...checkListInputs].filter(
            (element) => element.question_id !== questionId
          );
          toast.success(data?.message?.status_response);
          setIsLoading(false);
        } else {
          toast.error(data?.message?.status_response);
          setIsLoading(false);
        }
      } catch (error) {
        toast.error("Something went wrong!");
        setIsLoading(false);
      }
    } else if (uid && !questionId) {
      checkListInputs = [...checkListInputs].filter(
        (element) => element.id !== uid
      );
    }

    temp[sectionIndex].inputs = [...checkListInputs];
    setInputFieldList(temp);
  };

  const onExpectedAnswersChange = (value, id) => {
    const temp = [...inputFieldList];
    const splitId = id.split(",");
    temp[splitId[1]].inputs[splitId[0]].answer_option = value;
    temp[splitId[1]].inputs[splitId[0]].error = {
      isError: false,
      type: "",
      message: "",
    };
    setInputFieldList(temp);
  };

  const onRemoveFile = async (id, file_id, file_name) => {
    let temp = [...inputFieldList];

    if (id) {
      const splitId = id?.split(",");
      let tempQuestion = { ...(temp[splitId[1]].inputs[splitId[0]] || {}) };
      if (file_name && file_id) {
        tempQuestion.reference_document = [
          ...(tempQuestion.reference_document || []),
        ].filter((element) => element.file_id !== file_id);
        try {
          const res = await auditApis.deleteFile(file_id);
          if (res?.data?.message?.status) {
            toast.success(res?.data?.message?.status_response);
          }
        } catch (error) {}
      } else if (file_name && !file_id) {
        tempQuestion.reference_document_uploaded = [
          ...(tempQuestion.reference_document_uploaded || []),
        ].filter((file) => file.name !== file_name);
      }

      temp[splitId[1]].inputs[splitId[0]] = { ...tempQuestion };
    }
    setInputFieldList(temp);
  };

  const createRequirement = async (event) => {
    let temp = [...inputFieldList];
    const { name, value, id } = event.target;
    const splitId = id.split(",");
    let tempQuestion = temp[splitId[1]].inputs[splitId[0]];

    if (name === "questionnaire_section") {
      tempQuestion.questionnaire_section = value;
      tempQuestion.error = {
        isError: false,
        type: "",
        message: "",
      };
    } else if (name === "question") {
      tempQuestion.question = value;
      tempQuestion.error = {
        isError: false,
        type: "",
        message: "",
      };
    } else if (name === "answer_option") {
      tempQuestion.answer_option = value;
      tempQuestion.error = {
        isError: false,
        type: "",
        message: "",
      };
    } else if (name === "attachment_details") {
      tempQuestion.attachment_details = value;
    } else if (name === "reference_document") {
      const files = Array?.from(event?.target?.files) || [];
      const prevFiles = tempQuestion.reference_document_uploaded || [];
      const fileSizeLimit = 10 * 1024 * 1024; // 10 MB (adjust this value as needed)
      const validFiles = [...files, ...prevFiles].filter((uploadedFile) => {
        const isFileAlreadyExist = [
          ...(tempQuestion.reference_document || []),
        ].find((file) => file.file_name === uploadedFile.name);
        if (isFileAlreadyExist) {
          toast.error(
            `${uploadedFile.name} already exists. Please rename to upload it again.`
          );
        }
        if (uploadedFile.size > fileSizeLimit) {
          toast.error(
            `${uploadedFile.name} exceeds the file size limit of 10MB.`
          );
          return false; // Skip oversized files
        }
        return !isFileAlreadyExist;
      });
      tempQuestion.reference_document_uploaded = validFiles || [];
    } else if (name === "attachment_type") {
      tempQuestion.attachment_type = event.target.value;
    } else if (name === "field_type") {
      temp[splitId[1]].inputs[splitId[0]].field_type = value;
    }

    temp[splitId[1]].inputs[splitId[0]] = { ...tempQuestion };

    setInputFieldList(temp);
  };

  const handleSaveFieldChanges = async (sectionIndex, fieldIndex) => {
    let temp = [...inputFieldList];
    const fieldToUpdate = temp[sectionIndex]?.inputs[fieldIndex];
    const formData = new FormData();
    let isErrors = false;
    if (fieldToUpdate && Object.keys(fieldToUpdate)?.length > 0) {
      if (fieldToUpdate.question === "") {
        isErrors = true;
        fieldToUpdate.error = {
          isError: true,
          type: "questionLabel",
          message: "Requirement is required",
        };
        toast.error("Question is required");
      } else if (
        fieldToUpdate.field_type === "attachment" &&
        fieldToUpdate.attachment_type === ""
      ) {
        isErrors = true;
        fieldToUpdate.error = {
          isError: true,
          type: "attachmentDetails",
          message: "Attachment type is required.",
        };
        toast.error("Attachment type is required.");
      } else if (
        (fieldToUpdate.field_type === "checkbox" ||
          fieldToUpdate.field_type === "radio") &&
        (fieldToUpdate.answer_option === "" ||
          fieldToUpdate?.answer_option?.length < 2)
      ) {
        isErrors = true;
        fieldToUpdate.error = {
          isError: true,
          type: "answerOption",
          message: "2 options are required!",
        };
        toast.error("Answer is required!");
      } else if (!isErrors) {
        for (const key in fieldToUpdate) {
          if (
            key === "reference_document_uploaded" &&
            fieldToUpdate[key]?.length > 0
          ) {
            [...fieldToUpdate[key]].forEach((file) =>
              formData.append("reference_document", file)
            );
          } else if (key === "attachment_type") {
            // [...fieldToUpdate[key]]?.forEach(file => formData.append(''))
            formData.append(
              "attachment_type",
              JSON.stringify(fieldToUpdate[key] || "")
            );
          } else if (key === "answer_option") {
            formData.append(key, JSON.stringify(fieldToUpdate[key] || []));
          } else if (key !== "reference_document" && key !== "error") {
            formData.append(key, fieldToUpdate[key] || "");
          }
        }

        try {
          const { data, status } = await axiosInstance.post(
            "audit.api.AddQuestionQuestionnaire",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (status === 200 && data?.message?.status) {
            if (data?.message?.status_response === "question updated") {
              toast.success(`${fieldToUpdate?.question} successfully updated`);
              const recenltyUploadedFiles = data?.message?.updated_files || [];
              if (recenltyUploadedFiles && recenltyUploadedFiles?.length > 0) {
                temp[sectionIndex].inputs[fieldIndex].reference_document = [
                  ...(currentEditFieldBackup?.data?.reference_document || []),
                  ...recenltyUploadedFiles,
                ];
                temp[sectionIndex].inputs[
                  fieldIndex
                ].reference_document_uploaded = [];
              }
              setCurrentEditFieldBackup({ index: null, data: {} });
            } else if (data?.message?.status_response === "question created") {
              toast.success(`${fieldToUpdate?.question} successfully created`);
              const recenltyUploadedFiles = data?.message?.updated_files || [];
              temp[sectionIndex].inputs[fieldIndex] = {
                ...fieldToUpdate,
                question_id: data?.message?.question_id,
                ...(recenltyUploadedFiles &&
                  recenltyUploadedFiles?.length > 0 && {
                    reference_document: [
                      ...(currentEditFieldBackup?.data?.reference_document ||
                        []),
                      ...recenltyUploadedFiles,
                    ],
                    reference_document_uploaded: [],
                  }),
              };
              setCurrentEditFieldBackup({ index: null, data: {} });
            }
            setInputFieldList([...temp]);

            return true;
          } else {
            toast.error("Unable to update this question");
            temp[sectionIndex].inputs[fieldIndex] = {
              ...currentEditFieldBackup?.data,
            };
          }
          setInputFieldList([...temp]);
          return false;
        } catch (error) {
          toast.error("Unable to save question.");
          return false;
        }
      }
    }
    if (isErrors) {
      temp[sectionIndex].inputs[fieldIndex] = { ...fieldToUpdate };
      setInputFieldList(temp);
    }
    return false;
  };

  const onDiscardChange = (sectionIndex, fieldIndex) => {
    const temp = [...inputFieldList];
    temp[sectionIndex].inputs[fieldIndex] = currentEditFieldBackup?.data;
    setInputFieldList([...temp]);
    setCurrentEditFieldBackup({
      ...currentEditFieldBackup,
      index: null,
      data: {},
    });
  };

  const onCreateQuestion = async (type, Index, defaultFieldType) => {
    const isIndex = Index !== null && Index !== undefined;
    let isAddNewRequirement = false;
    let temp = [...inputFieldList];
    let isErrors = false; // errors in question template
    let nextCount = 0,
      saveAndQuitCount = 0;
    if (isIndex && type === "addNewSection") {
      setIsLoading(true);
      const section = temp[Index];
      // validate question
      const questions = section?.inputs || [];
      const totalQuestionsLength = questions?.length || 0;
      const currentQuestion =
        (totalQuestionsLength >= 1 && questions[totalQuestionsLength - 1]) ||
        null;
      if (
        !section.sectionName ||
        section.sectionName === " " ||
        section.completionDuration === "" ||
        section.completionDuration === null ||
        isNaN(section.completionDuration)
      ) {
        toast.error("Please enter Section Name, Duration.");
        isErrors = true;
        setIsLoading(false);
      } else if (section.bufferPeriodErr) {
        toast.error(section.bufferPeriodErr);
        isErrors = true;
        setIsLoading(false);
      } else if (section.completionDurationErr) {
        toast.error(section.completionDurationErr);
        isErrors = true;
        setIsLoading(false);
      }

      if (currentQuestion && Object.keys(currentQuestion)?.length > 0) {
        // check if the question is already saved or currently in edit mode
        const isQuestionUpdated =
          !currentQuestion?.question_id ||
          currentQuestion?.question_id ===
            currentEditFieldBackup?.data?.question_id
            ? await handleSaveFieldChanges(Index, totalQuestionsLength - 1)
            : true;

        if (!isErrors && isQuestionUpdated) {
          isAddNewRequirement = true;
          setIsLoading(false);
        } else {
          temp[Index].inputs[totalQuestionsLength - 1] = { ...currentQuestion };
        }
      }

      if (isAddNewRequirement || (totalQuestionsLength === 0 && !isErrors)) {
        const { questionnaireSection, questionSectionId } = temp[Index];
        temp[Index]?.inputs?.push({
          questionnaire_section: questionnaireSection || "",
          question: "",
          question_id: "",
          question_section_id: questionSectionId || "",
          attachment_details: "",
          reference_document: "",
          answer_option: "",
          field_type: defaultFieldType || "text-field",
          attachment_type: [],
          start_date: "",
          end_date: "",
          id: uuidv4(),
          error: {
            isError: false,
            type: "",
            message: "",
          },
        });
      }
      setInputFieldList([...temp]);
      setIsLoading(false);
    }
    if (!isIndex) {
      if (type === "next" || type === "save&quit") {
        const questionsRequests = [];
        temp.forEach(async (lastSection, secIndex) => {
          // const lastSection = temp?.length > 0 ? temp[temp?.length - 1] : null;
          if (lastSection && Object.keys(lastSection)?.length > 0) {
            if (
              lastSection.sectionName === "" ||
              lastSection.completionDuration === ""
            ) {
              toast.error("Please enter section name, Duration.");
              isErrors = true;
            } else if (lastSection.bufferPeriodErr) {
              toast.error(lastSection.bufferPeriodErr);
              isErrors = true;
            } else if (lastSection.completionDurationErr) {
              toast.error(lastSection.completionDurationErr);
              isErrors = true;
            }

            if (lastSection?.inputs?.length > 0) {
              const lastQuestions = lastSection?.inputs || [];
              const lastQuestion =
                lastQuestions?.length > 0
                  ? lastQuestions[lastQuestions.length - 1]
                  : null;

              if (lastQuestion && Object.keys(lastQuestion)) {
                const isQuestionAlreadySaved = Boolean(
                  lastQuestion?.question_id
                );
                // const isQuestionUpdated =
                //   !lastQuestion?.question_id ||
                //   lastQuestion?.question_id ===
                //     currentEditFieldBackup?.data?.question_id
                //     ? await handleSaveFieldChanges(
                //         secIndex,
                //         lastQuestions?.length - 1,
                //         "edit"
                //       )
                //     : true;

                if (
                  !lastQuestion?.question_id ||
                  lastQuestion?.question_id ===
                    currentEditFieldBackup?.data?.question_id
                ) {
                  questionsRequests.push(
                    handleSaveFieldChanges(
                      secIndex,
                      lastQuestions.length - 1,
                      "edit"
                    )
                  );
                }
                if (!isErrors && isQuestionAlreadySaved) {
                  if (type === "next") {
                    // next(stepper?.stepperAcitveSlide);
                    nextCount++;
                  } else if (type === "save&quit") {
                    // dispatch(createUpdateAuditTemplateActions.clearAllState());
                    // history.push("/audit");
                    saveAndQuitCount++;
                  }
                }
              }
            }
          }

          if (!isErrors && lastSection?.inputs?.length === 0) {
            if (type === "next") {
              nextCount++;
              // next(stepper?.stepperAcitveSlide);
            } else if (type === "save&quit") {
              saveAndQuitCount++;
              // dispatch(createUpdateAuditTemplateActions.clearAllState());
              // history.push("/audit");
            }
          }
        });

        Promise.all(questionsRequests)
          .then((requestResponses) => {
            const isRequestErrors =
              requestResponses?.length > 0
                ? [...new Set(requestResponses)].includes(false)
                : false;
            const isValid =
              !isErrors &&
              (requestResponses?.length
                ? !isRequestErrors
                : nextCount || saveAndQuitCount);
            if (isValid) {
              if (type === "next") {
                next(stepper?.stepperAcitveSlide);
              } else if (type === "save&quit") {
                dispatch(createUpdateAuditTemplateActions.clearAllState());
                history.push("/audit");
              }
            }
          })
          .catch((error) => {
            console.log("error: ", error);
          });
      }
    }
  };

  const getQuestionnarieSectionData = async () => {
    if (templateId || templateIdFromState) {
      try {
        const { data, status } =
          await auditApis.fetchQuestionnarieSectionFromTemplate(
            templateId || templateIdFromState
          );

        if (status === 200 && data?.message?.data) {
          const details = data?.message?.data || [];
          setSectionList(details);
        } else {
          setSectionList([]);
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    }
  };

  const getQuestionsList = async () => {
    if (templateId || templateIdFromState) {
      try {
        const { data, status } = await auditApis.fetchQuestionsFromTemplate(
          templateId || templateIdFromState
        );

        if (status === 200 && data.message.status) {
          const details = data?.message?.question_list || [];
          setQuestionsList(details);
        } else {
          setQuestionsList([]);
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    getQuestionsList();
    getQuestionnarieSectionData();
  }, [templateId, templateIdFromState]);

  useEffect(() => {
    if (
      (templateId || templateIdFromState) &&
      sectionList &&
      sectionList.length > 0
    ) {
      const requiredData = [...sectionList].map((section) => {
        const quesitonsBySection =
          questionsList?.length > 0
            ? [...questionsList]
                .filter(
                  (element) =>
                    element.questionnaire_section ===
                    section.questionnaire_section
                )
                ?.map((element) => ({
                  ...element,
                  question_section_id: section.name,
                }))
            : [];

        return {
          id: uuidv4(),
          sectionName: section.questionnaire_section,
          questionnaireSection: section.questionnaire_section || "",
          bufferPeriod: section?.buffer_period || 0,
          completionDuration: section?.duration_of_completion,
          questionSectionId: section?.name || "",
          inputs: quesitonsBySection?.length > 0 ? [...quesitonsBySection] : [],
        };
      });
      setInputFieldList(requiredData);
    } else {
      dispatch(createUpdateAuditTemplateActions.clearQuestionnarieDetails());
    }
  }, [sectionList, questionsList]);

  return (
    <>
      <BackDrop isLoading={isLoading} />
      <div className={styles.formComponetsContainer}>
        <div className={styles.formBuilderCompoents}>
          <Text heading="h2" text="Form Components" />
          <Text
            heading="span"
            text="Drag & drop items to create questionnaire"
            variant="grey"
          />
          <div className={styles.itemList}>
            <div className={styles.inputButtons}>
              {inputItem.map((item, index) => (
                <Button
                  description={item.name}
                  onDragStart={(e) => ondragstart(e, item.valueType)}
                  draggable={true}
                  variant="item"
                  key={`drag-&-drop-${index}`}
                  id={item.id}
                />
              ))}
            </div>
            <div className={styles.bottomButtonContainer}>
              <Button
                description="Next"
                size="small"
                variant="default"
                onClick={() => {
                  onCreateQuestion("next");
                }}
              />
              <Button
                description="Save & Quit"
                variant="preview"
                size="medium"
                onClick={() => {
                  onCreateQuestion("save&quit");
                }}
              />
              {/* <Button
                description="QUIT"
                variant="preview"
                size="medium"
                className="d-block"
                onClick={() => {
                  dispatch(createUpdateAuditTemplateActions.clearAllState());
                  history.push("/audit");
                }}
              /> */}
            </div>
          </div>
        </div>

        <div className={styles.formInputs}>
          <div className={styles.heading}>
            <Text
              heading="h2"
              text={`${templateName} Questionnaire Form`}
              variant="white"
            />
          </div>
          <div className={styles.inputContainer}>
            {inputFieldList?.map((listItem, Iindex) => {
              return (
                <React.Fragment
                  key={`questionnarie-section-main-wrapper-${Iindex}`}
                >
                  <div
                    key={`questionnarie-section-container-1-${Iindex}`}
                    // className={styles.sectionName}
                    className="row mt-2"
                  >
                    <div className="col-lg-7 col-md-5 col-12">
                      <AutoGrowInput
                        labelText="Section Name"
                        labelVariant="labelSmall"
                        variant="auditAssignmentInputOutlined"
                        value={listItem.sectionName}
                        maxLength={140}
                        name="sectionName"
                        required={true}
                        id={Iindex}
                        onChange={addSectionName}
                        onBlur={submitSection}
                      />
                      {listItem.isError && (
                        <Text
                          heading="span"
                          text={`${listItem.sectionName} is already exists`}
                          variant="error"
                        />
                      )}
                      {listItem?.sectionNameErr && (
                        <Text
                          heading="span"
                          text={listItem?.sectionNameErr}
                          variant="error"
                        />
                      )}
                    </div>
                    <div className="col-lg-2 col-md-3 col-5">
                      <Input
                        type="number"
                        labelText="Duration (in days)"
                        labelVariant="labelSmall"
                        required={true}
                        value={String(listItem.completionDuration)}
                        id={Iindex}
                        name="duration"
                        onChange={addSectionName}
                        onBlur={submitSection}
                        className={styles.smallInputField}
                        variant="auditAssignmentInputOutlined"
                        min="1"
                      />
                      {listItem?.completionDurationErr && (
                        <Text
                          heading="span"
                          text={listItem?.completionDurationErr}
                          variant="error"
                        />
                      )}
                    </div>
                    <div className="col-lg-2 col-md-3 col-5">
                      <Input
                        type="number"
                        labelVariant="labelSmall"
                        labelText="Buffer Period (in days)"
                        value={String(listItem.bufferPeriod)}
                        id={Iindex}
                        name="buffer"
                        onChange={addSectionName}
                        onBlur={submitSection}
                        className={styles.smallInputField}
                        variant="auditAssignmentInputOutlined"
                        min="0"
                      />
                      {listItem?.bufferPeriodErr && (
                        <Text
                          heading="span"
                          text={listItem?.bufferPeriodErr}
                          variant="error"
                        />
                      )}
                    </div>
                    {inputFieldList?.length > 1 && (
                      <div className="col-1">
                        <BsTrashFill
                          onClick={() =>
                            deleteSection(
                              listItem.id,
                              listItem.questionSectionId
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div
                    key={`questionnarie-section-container-2-${Iindex}`}
                    className={styles.inputSection}
                    onDragOver={(event) => ondragover(event)}
                    onDrop={(event) =>
                      drop(event, Iindex, listItem.sectionName)
                    }
                  >
                    {listItem?.inputs.map((fieldName, index) => {
                      const isEditing = fieldName?.question_id
                        ? fieldName?.question_id ===
                          currentEditFieldBackup?.data?.question_id
                        : true;
                      // fieldName?.question_id ===
                      //   currentEditFieldBackup?.data?.question_id ||
                      // (fieldName?.question_section_id ===
                      //   currentEditFieldBackup?.data?.question_section_id &&
                      //   index === currentEditFieldBackup?.index);
                      return (
                        <div
                          key={`question-data-${index}-${Iindex}`}
                          className="position-relative pt-3"
                        >
                          <div className={styles.fieldActions}>
                            <BsTrashFill
                              title="Delete Requirement"
                              onClick={() =>
                                deleteQuestion(
                                  fieldName?.id,
                                  fieldName.question_id,
                                  Iindex
                                )
                              }
                            />
                            {fieldName.question_id &&
                              (fieldName?.question_id ===
                                currentEditFieldBackup?.data?.question_id ||
                              (fieldName?.question_section_id ===
                                currentEditFieldBackup?.data
                                  ?.question_section_id &&
                                index === currentEditFieldBackup?.index) ? (
                                <>
                                  <MdCheck
                                    onClick={() => {
                                      if (
                                        !_.isEqual(
                                          fieldName,
                                          currentEditFieldBackup?.data
                                        )
                                      ) {
                                        handleSaveFieldChanges(Iindex, index);
                                      }
                                    }}
                                    title="Save changes"
                                    className={`
                                  ${styles.fieldActionsEditButton}
                                  ${
                                    !_.isEqual(
                                      fieldName,
                                      currentEditFieldBackup?.data
                                    )
                                      ? styles.fieldActionsEditButtonActive
                                      : ""
                                  }
                                  `}
                                  />
                                  <MdClose
                                    onClick={() => {
                                      onDiscardChange(Iindex, index);
                                    }}
                                    className={`
                                             ${styles.fieldActionsEditButton}
                                             ${styles.fieldActionsEditButtonActive}
                                             `}
                                    title="Discard all changes"
                                  />
                                </>
                              ) : (
                                <MdModeEdit
                                  title="Edit"
                                  className={styles.fieldActionsEditButton}
                                  onClick={() =>
                                    setCurrentEditFieldBackup({
                                      index,
                                      data: { ...fieldName },
                                    })
                                  }
                                />
                              ))}
                          </div>

                          <div className={`${styles.inputBody} row`}>
                            {fieldName.field_type !== "none" && (
                              <>
                                <div
                                  className={`${styles.inputField} col-12 col-md-6 col-lg-4`}
                                >
                                  <AutoGrowInput
                                    labelText="Requirement"
                                    variant="auditAssignmentInput"
                                    id={`${index},${Iindex}`}
                                    labelVariant="labelSmall"
                                    name="question"
                                    value={fieldName?.question}
                                    onChange={createRequirement}
                                    disabled={!isEditing}
                                  />
                                  {fieldName.error?.isError &&
                                    fieldName.error?.type ===
                                      "questionLabel" && (
                                      <Text
                                        heading="span"
                                        text={fieldName.error.message}
                                        variant="error"
                                      />
                                    )}
                                </div>
                                <div
                                  className={`${styles.inputField} col-12 col-md-6 col-lg-2`}
                                >
                                  <Input
                                    type="select"
                                    labelText="Data Type"
                                    labelVariant="labelSmall"
                                    variant="auditAssignmentInput"
                                    id={`${index},${Iindex}`}
                                    name="field_type"
                                    value={fieldName.field_type}
                                    valueForDropDown={dataTypes}
                                    onChange={createRequirement}
                                    placeholder="Select data type"
                                    className={styles.smallSelectField}
                                    disabled={!isEditing}
                                  />
                                </div>
                                <div
                                  className={`${styles.inputField} col-12 col-md-6 col-lg-2`}
                                >
                                  <Input
                                    type="file"
                                    labelText="Reference"
                                    labelVariant="labelSmall"
                                    name="reference_document"
                                    variant="auditAssignmentInput"
                                    onChange={createRequirement}
                                    id={`${index},${Iindex}`}
                                    className={styles.smallInputField}
                                    multiple={true}
                                    fileList={[
                                      ...(fieldName.reference_document || []),
                                      ...(fieldName?.reference_document_uploaded ||
                                        []),
                                    ]}
                                    onRemoveFile={(file_id, file_name) =>
                                      onRemoveFile(
                                        `${index},${Iindex}`,
                                        file_id,
                                        file_name
                                      )
                                    }
                                    disabled={!isEditing}
                                  />
                                </div>
                                {fieldName.field_type === "attachment" && (
                                  <>
                                    <div
                                      className={`${styles.inputField} col-12 col-md-6 col-lg-2`}
                                    >
                                      <Input
                                        type="text"
                                        labelText="Attach. Details"
                                        variant="auditAssignmentInput"
                                        id={`${index},${Iindex}`}
                                        labelVariant="labelSmall"
                                        name="attachment_details"
                                        placeholder="Attachment"
                                        value={
                                          fieldName.attachment_details || null
                                        }
                                        className={styles.smallInputField}
                                        onChange={createRequirement}
                                        disabled={!isEditing}
                                      />
                                      {fieldName.error?.isError &&
                                        fieldName.error?.type ===
                                          "attachmentDetails" &&
                                        !fieldName.attachment_details && (
                                          <Text
                                            heading="span"
                                            text={
                                              "Attachment Details is required."
                                            }
                                            variant="error"
                                          />
                                        )}
                                    </div>
                                    <div
                                      className={`${styles.inputField} col-12 col-md-6 col-lg-2`}
                                    >
                                      {/* <Input
                                        type="select"
                                        variant="auditAssignmentInput"
                                        labelText="Type"
                                        id={`${index},${Iindex}`}
                                        name="attachment_type"
                                        labelVariant="labelSmall"
                                        value={
                                          fieldName.attachment_type || null
                                        }
                                        className={styles.smallSelectField}
                                        valueForDropDown={
                                          checkpointAttachmentType
                                        }
                                        onChange={createRequirement}
                                        placeholder="Select"
                                        disabled={!isEditing}
                                      /> */}
                                      <MultiSelectInput
                                        name="attachment_type"
                                        labelVariant="labelSmall"
                                        labelText="Type"
                                        variant="auditAssignmentInput"
                                        menuPos="relative"
                                        value={[
                                          ...(fieldName?.attachment_type || []),
                                        ].map((value) => ({
                                          label: value.attachment_type,
                                          value: value.attachment_type,
                                        }))}
                                        options={checkpointAttachmentType}
                                        className={styles.smallSelectField}
                                        onChange={(e) =>
                                          onAttachmentTypeChange(
                                            e,
                                            `${index},${Iindex}`
                                          )
                                        }
                                        isDisabled={!isEditing}
                                      />
                                      {fieldName.error?.isError &&
                                        fieldName.error?.type ===
                                          "attachmentDetails" &&
                                        !fieldName.attachment_type && (
                                          <Text
                                            heading="span"
                                            text={
                                              "Attachment Format is required."
                                            }
                                            variant="error"
                                          />
                                        )}
                                    </div>
                                  </>
                                )}
                                {/* {fieldName.field_type === "date-range" && (
                                  <>
                                    <div
                                      className={`${styles.inputField} col-12 col-md-6 col-lg-4`}
                                    >
                                      <label
                                        className={`${styles.labelSmall} mb-3 d-block`}
                                      >
                                        Date Range
                                      </label>
                                      <RangePicker
                                        value={
                                          fieldName.start_date &&
                                          fieldName.end_date
                                            ? [
                                                moment(
                                                  fieldName?.start_date,
                                                  "YYYY/MM/DD"
                                                ),
                                                moment(
                                                  fieldName?.end_date,
                                                  "YYYY/MM/DD"
                                                ),
                                              ]
                                            : []
                                        }
                                        onChange={(date, formatStrings) =>
                                          onDateRangeChange(
                                            formatStrings,
                                            Iindex,
                                            index
                                          )
                                        }
                                        format="YYYY/MM/DD"
                                      />
                                      {fieldName.error?.isError &&
                                        fieldName.error?.type === "dateRange" &&
                                        fieldName.start_date === "" &&
                                        fieldName.end_date === "" && (
                                          <Text
                                            heading="span"
                                            text="Date range is required."
                                            variant="error"
                                          />
                                        )}
                                      {(fieldName.start_date_err ||
                                        fieldName.end_date_err) && (
                                        <Text
                                          heading="span"
                                          text={
                                            fieldName.start_date_err ||
                                            fieldName.end_date_err
                                          }
                                          variant="error"
                                        />
                                      )}
                                    </div>
                                  </>
                                )} */}
                                {/* {(fieldName.field_type === "text-field" ||
                                  fieldName.field_type === "answer") && (
                                  <div
                                    className={`${styles.inputField} col-md-6`}
                                  >
                                    <Input
                                      type="text"
                                      labelText="Answer"
                                      variant="auditAssignmentInput"
                                      id={`${index},${Iindex}`}
                                      name="answer_option"
                                      value={fieldName.answer_option}
                                      onChange={createRequirement}
                                      placeholder="Enter your answer"
                                    />
                                    {fieldName.error?.isError &&
                                      !fieldName.answer_option && (
                                        <Text
                                          heading="span"
                                          text="Answer is required."
                                          variant="error"
                                        />
                                      )}
                                  </div>
                                )} */}
                                {(fieldName.field_type === "checkbox" ||
                                  fieldName.field_type === "radio") && (
                                  <div
                                    className={`${styles.inputField} col-12 col-md-6 col-lg-3`}
                                  >
                                    <ExpectedAnswerInput
                                      expectedAnswers={fieldName.answer_option}
                                      setExpectedAnswers={(value) => {
                                        onExpectedAnswersChange(
                                          value,
                                          `${index},${Iindex}`
                                        );
                                      }}
                                      disabled={!isEditing}
                                    />
                                    {fieldName.error?.isError &&
                                      fieldName.error?.type ===
                                        "answerOption" && (
                                        <Text
                                          heading="span"
                                          text={
                                            fieldName?.error?.message ||
                                            "answer option is required"
                                          }
                                          variant="error"
                                        />
                                      )}
                                    {/* {fieldName.error?.isError &&
                                      !fieldName.answer_option && (
                                        <Text
                                          heading="span"
                                          text="Answer is required."
                                          variant="error"
                                        />
                                      )} */}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className={styles.addNewContainer}>
                      <BsPlusSquareFill
                        onClick={() => {
                          onCreateQuestion("addNewSection", Iindex);
                        }}
                      />
                      <Text
                        heading="span"
                        text="NEW REQUIREMENT"
                        variant="primary"
                        size="small"
                      />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div className={styles.addNewSection} onClick={addNewSection}>
              <BsPlusSquareFill />
              <Text
                heading="p"
                text="NEW SECTION"
                size="small"
                variant="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormComponents;
