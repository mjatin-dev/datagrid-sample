/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import Text from "../../../components/Text/Text";
import { Input } from "../../../components/Inputs/Input";
import Button from "../../../components/Buttons/Button";
import { BsTrashFill, BsPlusSquareFill } from "react-icons/bs";
import styles from "./style.module.scss";
import { BACKEND_BASE_URL } from "../../../../../apiServices/baseurl";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isEqual } from "lodash";
import { severity } from "../../../constants/DateTypes/severity";
import { useHistory } from "react-router";
import { createUpdateAuditTemplateActions } from "../../../redux/createUpdateTemplatesActions";
import axiosInstance from "../../../../../apiServices/index";
import auditApis from "../../../api";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { checkpointAttachmentType } from "../../../constants/DateTypes/fileType";
import AutoGrowInput from "../../../components/Inputs/AutoGrowInput";
import { MdCheck, MdClose, MdModeEdit } from "react-icons/md";
import MultiSelectInput from "Components/Audit/components/MultiSelectInput";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";

const CheckList = ({ next, stepper, templateId, isNewTemplate }) => {
  const [questionReferences, setQuestionReferences] = useState([]);
  const [currentEditFieldBackup, setCurrentEditFieldBackup] = useState({
    index: null,
    data: {},
  });
  const dispatch = useDispatch();
  const [checklist, setChecklist] = useState([]);
  const [checklistSectionList, setChecklistSectionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const checklistDetails = useSelector(
    (state) => state?.AuditReducer?.CreateUpdateAuditTemplate?.checklistDetails
  );
  const templateIdFromState = useSelector(
    (state) => state?.AuditReducer?.templateId
  );
  const {
    duration_of_completion: template_completion_duration,
    buffer_period: template_buffer_period,
  } = useSelector(
    (state) =>
      state?.AuditReducer?.CreateUpdateAuditTemplate?.auditScopeBasicDetails
        ?.basicDetails
  );

  const setChecklistDetails = useCallback(
    (payload) => {
      dispatch(createUpdateAuditTemplateActions.setChecklistDetails(payload));
    },
    [checklistDetails]
  );
  const history = useHistory();
  useEffect(() => {
    getQuestions();
  }, [templateId, stepper]);

  const getQuestions = async () => {
    try {
      const { data, status } = await auditApis.fetchQuestionList(
        templateId || templateIdFromState
      );
      const _list = data.message.Question_reference_options;
      if (
        data.message.status &&
        data.message?.Question_reference_options?.length > 0 &&
        status === 200
      ) {
        const list = _list
          .filter((values) => values.field_type === "attachment")
          .map((values) => {
            return { label: values.question, value: values?.question_id };
          });
        setQuestionReferences(list);
      } else {
        setQuestionReferences([]);
      }
    } catch (error) {}
  };

  const addNewSection = async () => {
    let isErrors = false;
    let isAddNewSection = false;
    let temp = [...checklistDetails];
    const tempLength = temp?.length || 0;
    if (tempLength >= 1) {
      const prevSection = temp[tempLength - 1];
      const prevSectionCheckpoints = prevSection?.checkListInput || [];
      const prevSectionCheckpointsLength = prevSectionCheckpoints?.length || 0;

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
      if (prevSectionCheckpointsLength > 0) {
        const lastCheckpoint =
          prevSectionCheckpoints[prevSectionCheckpointsLength - 1];

        if (lastCheckpoint && Object.keys(lastCheckpoint)?.length) {
          const isCheckpointUpdated =
            !lastCheckpoint?.check_point_id ||
            lastCheckpoint?.check_point_id ===
              currentEditFieldBackup?.data?.check_point_id
              ? await handleSaveFieldChanges(
                  tempLength - 1,
                  prevSectionCheckpointsLength - 1
                )
              : true;

          if (!isErrors && isCheckpointUpdated) {
            isAddNewSection = true;
          }
        }
      }
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
        checkListInput: [],
      });
    }

    setChecklistDetails(temp);
  };

  const addCheckListSectionName = async (event) => {
    let temp = [...checklistDetails];
    const { value, id, name } = event.target;
    temp[id].isError = false;
    if (name === "sectionName") {
      temp[id].sectionName = removeWhiteSpaces(value);
    } else if (name === "duration" && value !== 0 && value !== "0") {
      temp[id].completionDuration = value;
    } else if (name === "buffer") {
      temp[id].bufferPeriod = value;
    }

    setChecklistDetails(temp);
  };

  const submitChecklistSection = async (event) => {
    let temp = [...checklistDetails];
    const { id } = event.target;

    const { sectionName, completionDuration, bufferPeriod } = temp[id];

    temp[id].bufferPeriodErr =
      parseInt(bufferPeriod) > parseInt(template_buffer_period)
        ? `Buffer period should be ${
            parseInt(template_buffer_period) > 0 ? "less than or" : ""
          } equal to ${template_buffer_period} days`
        : bufferPeriod < 0
        ? "Buffer period can't be negative"
        : "";

    temp[id].completionDurationErr =
      completionDuration !== "" &&
      completionDuration !== null &&
      !isNaN(completionDuration)
        ? parseInt(completionDuration) > parseInt(template_completion_duration)
          ? `Duration should be ${
              parseInt(template_completion_duration) > 0 ? "less than or" : ""
            } equal to ${template_completion_duration} days.`
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
        audit_template_id: templateId || templateIdFromState,
        checklist_section: temp[id].sectionName,
        duration_of_completion: parseInt(temp[id].completionDuration) || 0,
        buffer_period: parseInt(temp[id].bufferPeriod) || 0,
        checklist_section_id: "",
      };
      let addSectionResponse = "";

      if (temp[id].questionSectionId === "") {
        addSectionResponse = await axiosInstance.post(
          `${BACKEND_BASE_URL}audit.api.AddCheckListSection`,
          payload
        );
      } else {
        payload.checklist_section_id = temp[id].questionSectionId
          ? temp[id].questionSectionId
          : "";

        addSectionResponse = await axiosInstance.post(
          `${BACKEND_BASE_URL}audit.api.UpdateCheckListSection`,
          payload
        );
      }

      if (addSectionResponse) {
        const { message } = addSectionResponse.data;

        if (message.status) {
          temp[id].questionSectionId =
            message?.checklist_section_id || temp[id].questionSectionId;
          temp[id].isError = false;
          if (temp[id].checkListInput?.length > 0) {
            temp[id].checkListInput[0].checklist_section_id =
              message?.checklist_section_id || temp[id].questionSectionId;
          }
          setChecklistDetails(temp);
        } else {
          temp[id].isError = true;
          setChecklistDetails(temp);
        }
      }
    }

    setChecklistDetails(temp);
  };

  const onAttachmentFormatChange = (values, id) => {
    const temp = [...checklistDetails];
    const splitId = id?.split(",");
    temp[splitId[1]].checkListInput[splitId[0]].attachment_format =
      values?.map((element) => ({ attachment_type: element.value })) || [];
    setChecklistDetails([...temp]);
  };

  const handleSaveFieldChanges = async (sectionIndex, fieldIndex) => {
    let temp = [...checklistDetails];
    const fieldToUpdate = temp[sectionIndex]?.checkListInput[fieldIndex];
    const formData = new FormData();
    let isErrors = false;
    if (fieldToUpdate && Object.keys(fieldToUpdate)?.length > 0) {
      if (
        fieldToUpdate.areaForVerfication === "" ||
        fieldToUpdate.areaForVerfication === " "
      ) {
        isErrors = true;
        fieldToUpdate.error = {
          isError: true,
          type: "areaForVerfication",
          message: "Checkpoint is required.",
        };
        toast.error("Checkpoint is required");
      } else if (fieldToUpdate.how_to_verify === " ") {
        isErrors = true;
        fieldToUpdate.error = {
          isError: true,
          type: "how_to_verify",
          message: "Please enter valid data",
        };
      } else if (fieldToUpdate.penalty === " ") {
        isErrors = true;
        fieldToUpdate.error = {
          isError: true,
          type: "penalty",
          message: "Please enter valid data",
        };
      }

      if (!isErrors) {
        //   if (regulatoryRef_uploaded && regulatoryRef_uploaded?.length > 0) {
        //     // append reference document to form data
        //     [...regulatoryRef_uploaded]?.forEach((file) => {
        //       formDataPayload.append(areaForVerfication, file);
        //     });
        //   }

        const payload = {
          checklist_section_id: fieldToUpdate.checklist_section_id,
          check_point: fieldToUpdate.areaForVerfication || "",
          consequence_of_non_compliance:
            fieldToUpdate.consequenceOfNonCompliance || "",
          check_point_id: fieldToUpdate.check_point_id,
          severity: fieldToUpdate.severity || "",
          documents_relied_upon: fieldToUpdate.documentReliedUpon,
          regulatory_description: fieldToUpdate.regulatoryDescription || "",
          start_date: fieldToUpdate.start_date || "",
          end_date: fieldToUpdate.end_date || "",
          attachment_format: fieldToUpdate.attachment_format || "",
          how_to_verify: fieldToUpdate.how_to_verify,
          penalty: fieldToUpdate.penalty,
          regulatoryRef_uploaded: fieldToUpdate?.regulatoryRef_uploaded || [],
        };

        for (const key in payload) {
          if (key === "regulatoryRef_uploaded" && payload[key]?.length > 0) {
            [...payload[key]]?.forEach((file) =>
              formData.append("regulatory_references", file)
            );
          } else if (key === "documents_relied_upon") {
            if (payload[key]?.length > 0) {
              let docs = payload[key]?.map((item) => ({
                question_id: item.value,
              }));
              formData.append(key, JSON.stringify(docs));
            } else {
              formData.append(key, "");
            }
          } else if (key === "attachment_format") {
            formData.append(key, JSON.stringify(payload[key]) || "");
          } else if (key !== "regulatoryRef_uploaded" && key !== "error") {
            formData.append(key, payload[key] || "");
          }
        }

        try {
          const { data, status } = await axiosInstance.post(
            "audit.api.AddChecklist",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (status === 200 && data?.message?.status) {
            if (data?.message?.status_response === "checklist created") {
              toast.success(
                `${fieldToUpdate?.areaForVerfication} successfully created.`
              );
              const recentlyUploadedFiles = data?.message?.updated_files || [];
              temp[sectionIndex].checkListInput[fieldIndex] = {
                ...fieldToUpdate,
                check_point_id: data?.message?.check_point_id,
                ...(recentlyUploadedFiles &&
                  recentlyUploadedFiles?.length > 0 && {
                    regulatoryRef: [
                      ...(currentEditFieldBackup?.data?.regulatoryRef || []),
                      ...recentlyUploadedFiles,
                    ],
                    regulatoryRef_uploaded: [],
                  }),
                error: {
                  isError: false,
                  type: "",
                  message: "",
                },
              };
            } else if (data?.message?.status_response === "checklist updated") {
              toast.success(
                `${fieldToUpdate?.areaForVerfication} successfully updated.`
              );
              const recenltyUploadedFiles = data?.message?.updated_files || [];
              if (recenltyUploadedFiles && recenltyUploadedFiles?.length > 0) {
                temp[sectionIndex].checkListInput[fieldIndex].regulatoryRef = [
                  ...(currentEditFieldBackup?.data?.regulatoryRef || []),
                  ...recenltyUploadedFiles,
                ];
                temp[sectionIndex].checkListInput[
                  fieldIndex
                ].regulatoryRef_uploaded = [];
              }
              fieldToUpdate.error = {
                isError: false,
                type: "",
                message: "",
              };
            }
            setCurrentEditFieldBackup({ index: null, data: {} });
            return true;
          } else {
            toast.error("Unable to update this checkpoint");
            temp[sectionIndex].checkListInput[fieldIndex] = {
              ...currentEditFieldBackup?.data,
            };
          }
          setChecklistDetails([...temp]);
          return false;
        } catch (error) {
          toast.error("Unable to save checkpoint.");
        }
      }
      if (isErrors) {
        setChecklistDetails([...temp]);
      }
      return false;
    }
  };

  const onDiscardChanges = (sectionIndex, fieldIndex) => {
    const temp = [...checklistDetails];
    temp[sectionIndex].checkListInput[fieldIndex] =
      currentEditFieldBackup?.data;
    setChecklistDetails([...temp]);
    setCurrentEditFieldBackup({ index: null, data: {} });
  };

  const onCreateCheckPoint = async (type, Index) => {
    const isIndex = Index !== null && Index !== undefined;
    let isAddNewRequirement = false;
    let temp = [...checklistDetails];
    let isErrors = false; // errors in question template
    let nextCount = 0,
      saveAndQuitCount = 0;
    if (isIndex && type === "addNewSection") {
      setIsLoading(true);
      const section = temp[Index];
      // validate questions
      const checkpoints = section?.checkListInput || [];
      const totalCheckpointsLength = checkpoints?.length || 0;
      const currentCheckpoint =
        totalCheckpointsLength >= 1
          ? checkpoints[totalCheckpointsLength - 1]
          : null;
      if (
        !section.sectionName ||
        section.sectionName === " " ||
        section.completionDuration === "" ||
        section.completionDuration === null ||
        isNaN(section.completionDuration)
      ) {
        toast.error("Please enter Section Name and Duration.");
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

      if (currentCheckpoint && Object.keys(currentCheckpoint)?.length > 0) {
        const isCheckpointUpdated =
          !currentCheckpoint?.check_point_id ||
          currentCheckpoint?.check_point_id ===
            currentEditFieldBackup?.data?.check_point_id
            ? await handleSaveFieldChanges(Index, totalCheckpointsLength - 1)
            : true;

        if (!isErrors && isCheckpointUpdated) {
          isAddNewRequirement = true;
          setIsLoading(false);
        } else {
          temp[Index].checkListInput[totalCheckpointsLength - 1] = {
            ...currentCheckpoint,
          };
        }
      }

      if (isAddNewRequirement || (totalCheckpointsLength === 0 && !isErrors)) {
        const { sectionName, questionSectionId } = temp[Index];
        temp[Index]?.checkListInput?.push({
          areaForVerfication: "",
          documentReliedUpon: "",
          regulatoryRef: "",
          checklist_section_id: questionSectionId || "",
          check_point_id: "",
          checklist_section: sectionName || "",
          consequenceOfNonCompliance: "",
          severity: "",
          regulatoryDescription: "",
          start_date: "",
          end_date: "",
          attachment_format: [],
          id: uuidv4(),
          how_to_verify: "",
          penalty: "",
          error: {
            isError: false,
            type: "",
            message: "",
          },
        });
      }
      setChecklistDetails([...temp]);
      setIsLoading(false);
    }
    if (!isIndex) {
      if (type === "next" || type === "save&quit") {
        const ChecklistRequests = [];
        // const lastSection = temp?.length > 0 ? temp[temp.length - 1] : null;
        temp.forEach(async (lastSection, secIndex) => {
          if (lastSection && Object.keys(lastSection)?.length > 0) {
            if (
              lastSection.sectionName === "" ||
              lastSection.completionDuration === ""
            ) {
              toast.error("Please enter section name,Duration.");
              isErrors = true;
            } else if (lastSection.bufferPeriodErr) {
              toast.error(lastSection.bufferPeriodErr);
              isErrors = true;
            } else if (lastSection.completionDurationErr) {
              toast.error(lastSection.completionDurationErr);
              isErrors = true;
            }

            if (lastSection?.checkListInput?.length > 0) {
              const lastCheckpoints = lastSection?.checkListInput || [];
              const lastCheckpoint =
                lastCheckpoints?.length > 0
                  ? lastCheckpoints[lastCheckpoints?.length - 1]
                  : null;
              if (lastCheckpoint && Object.keys(lastCheckpoint)) {
                const isCheckpointAlreadySaved = Boolean(
                  lastCheckpoint?.check_point_id
                );
                if (
                  !lastCheckpoint?.check_point_id ||
                  lastCheckpoint?.check_point_id ===
                    currentEditFieldBackup?.data?.check_point_id
                ) {
                  ChecklistRequests.push(
                    handleSaveFieldChanges(
                      secIndex,
                      lastCheckpoints?.length - 1,
                      "edit"
                    )
                  );
                }
                if (!isErrors && isCheckpointAlreadySaved) {
                  if (type === "next") {
                    nextCount++;
                  } else if (type === "save&quit") {
                    saveAndQuitCount++;
                  }
                }
              }
            }
          }
          if (!isErrors && lastSection?.checkListInput?.length === 0) {
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
        Promise.all(ChecklistRequests)
          .then((requestResponse) => {
            const isRequestError =
              requestResponse?.length > 0
                ? [...new Set(requestResponse)].includes(false)
                : false;
            const isValid =
              !isErrors &&
              (requestResponse?.length
                ? !isRequestError
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
            console.log("error", error);
          });
      }
    }
  };

  const removeChecklistSection = async (uid, sectionId) => {
    let temp = [...checklistDetails];
    if (uid && sectionId) {
      try {
        setIsLoading(true);
        const { data, status } = await auditApis.deleteChecklistSection(
          sectionId
        );
        if (status === 200 && data?.message?.status) {
          temp = [...temp].filter((element) => element?.id !== uid);
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
    setChecklistDetails(temp);
  };

  const deleteCheckpoint = async (uid, checkpointId, sectionIndex) => {
    let temp = [...checklistDetails];
    let checkListInputs = [...(temp[sectionIndex]?.checkListInput || [])];
    if (uid && checkpointId) {
      try {
        setIsLoading(true);
        const { data, status } = await auditApis.deleteCheckPoint(checkpointId);
        if (status === 200 && data?.message?.status) {
          checkListInputs = [...checkListInputs].filter(
            (element) => element.check_point_id !== checkpointId
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
    } else if (uid && !checkpointId) {
      checkListInputs = [...checkListInputs].filter(
        (element) => element.id !== uid
      );
    }

    temp[sectionIndex].checkListInput = [...checkListInputs];
    setChecklistDetails(temp);
  };

  const onRemoveFile = async (id, file_id, file_name) => {
    let temp = [...checklistDetails];
    if (id) {
      const splitId = id?.split(",");
      let tempCheckpoint = {
        ...(temp[splitId[1]].checkListInput[splitId[0]] || {}),
      };
      if (file_name && file_id) {
        tempCheckpoint.regulatoryRef = [
          ...(tempCheckpoint.regulatoryRef || []),
        ].filter((element) => element.file_id !== file_id);
        try {
          await auditApis.deleteFile(file_id);
        } catch (error) {}
      } else if (file_name && !file_id) {
        tempCheckpoint.regulatoryRef_uploaded = [
          ...(tempCheckpoint?.regulatoryRef_uploaded || []),
        ].filter((file) => file.name !== file_name);
      }
      temp[splitId[1]].checkListInput[splitId[0]] = { ...tempCheckpoint };
    }
    setChecklistDetails(temp);
  };

  const createRequirement = async (event) => {
    let temp = [...checklistDetails];

    const { name, value, id } = event.target;
    const splitId = id.split(",");
    let tempCheckpoint = temp[splitId[1]].checkListInput[splitId[0]] || {};
    if (name === "regulatoryRef") {
      const fileSizeLimit = 10 * 1024 * 1024; // 10 MB (adjust this value as needed)
      const files = Array?.from(event?.target?.files) || [];
      const validFiles = [...files].filter((uploadedFile) => {
        const isFileAlreadyExist = [
          ...(tempCheckpoint.regulatoryRef || []),
        ].find((file) => file.file_name === uploadedFile.name);
        if (isFileAlreadyExist) {
          toast.error(
            `${uploadedFile.name} already exists. Please rename to upload it again`
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
      tempCheckpoint.regulatoryRef_uploaded = validFiles || [];
    } else if (name === "severity") {
      tempCheckpoint[name] = value !== "Select" ? value : "";
    } else {
      tempCheckpoint[name] =
        typeof value === "string" ? removeWhiteSpaces(value) : value;
    }
    setChecklistDetails(temp);
  };

  const onSelect = (index, Iindex, value) => {
    let temp = [...checklistDetails];
    temp[Iindex].checkListInput[index].documentReliedUpon = value;
    setChecklistDetails(temp);
  };

  const getChecklistSectionData = async () => {
    if (templateId || templateIdFromState) {
      try {
        const { data, status } =
          await auditApis.fetchChecklistSectionFromTemplate(
            templateId || templateIdFromState
          );

        if (status === 200 && data?.message?.data) {
          const details = data?.message?.data;
          setChecklistSectionList(details);
        } else {
          setChecklistSectionList([]);
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    }
  };
  const getChecklistData = async () => {
    if (templateId || templateIdFromState) {
      try {
        const { data, status } = await auditApis.fetchChecklistFromTemplate(
          templateId || templateIdFromState
        );

        if (status === 200 && data.message.status) {
          const details = data?.message?.check_list || [];
          setChecklist(details);
        } else {
          setChecklist([]);
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    getChecklistSectionData();
    getChecklistData();
  }, []);

  useEffect(() => {
    if (
      (templateId || templateIdFromState) &&
      checklistSectionList &&
      checklistSectionList.length > 0
    ) {
      const requiredData = [...checklistSectionList].map((section) => {
        let checklistBySection =
          checklist?.length > 0
            ? [...checklist].filter(
                (element) =>
                  element.checklist_section === section?.checklist_section
              )
            : [];

        if (checklistBySection?.length > 0)
          checklistBySection = [...checklistBySection].map((element) => ({
            check_point_id: element?.check_point_id || "",
            checklist_section_id: element?.checklist_section_id || "",
            areaForVerfication: element?.check_point || "",
            documentReliedUpon:
              (element?.documents_relied_upon?.length > 0 &&
                element?.documents_relied_upon?.map((values) => {
                  return { label: values.question, value: values?.question_id };
                })) ||
              [],
            regulatoryRef: element?.checkpoint_reference_list || "",
            consequenceOfNonCompliance: "",
            severity: element.severity || [],
            regulatoryDescription: "",
            start_date: element.start_date || "",
            end_date: element?.end_date || "",
            attachment_format: element.attachment_format || "",
            id: uuidv4(),
            how_to_verify: element?.how_to_verify || "",
            penalty: element.penalty || "",
            error: {
              isError: false,
              type: "",
              message: "",
            },
          }));

        return {
          id: uuidv4(),
          sectionName: section?.checklist_section || "",
          completionDuration: section?.duration_of_completion,
          bufferPeriod: section?.buffer_period || 0,
          isError: false,
          questionSectionId: section?.name || "",
          questionnaireSection: "",
          checkListInput:
            checklistBySection?.length > 0 ? checklistBySection : [],
        };
      });
      setChecklistDetails(requiredData);
    } else {
      dispatch(createUpdateAuditTemplateActions.clearChecklistDetails());
    }
  }, [checklist, checklistSectionList]);
  return (
    <>
      <BackDrop isLoading={isLoading} />
      <div className={styles.heading}>
        <Text heading="h2" text="Checklist" variant="white" />
      </div>

      <div className={styles.checkListMainContainer}>
        <div className={styles.checkListContainer}>
          {checklistDetails?.length > 0 &&
            [...new Set(checklistDetails)].map((checkItem, Iindex) => {
              const checkpoints =
                checkItem?.checkListInput?.length > 0
                  ? [...new Set(checkItem.checkListInput)]
                  : [];
              return (
                <div
                  key={`checklist-section-${Iindex}`}
                  className={styles.sectionContainer}
                >
                  <div className="row my-2">
                    <div className="col-lg-7 col-md-5 col-12">
                      <AutoGrowInput
                        labelVariant="labelSmall"
                        variant="checklistInput"
                        labelText="Section Name"
                        name="sectionName"
                        maxLength={140}
                        required={true}
                        id={Iindex}
                        value={checkItem.sectionName}
                        onChange={addCheckListSectionName}
                        onBlur={submitChecklistSection}
                      />
                      {checkItem?.sectionNameErr && (
                        <Text
                          heading="span"
                          text={checkItem?.sectionNameErr}
                          variant="error"
                        />
                      )}
                    </div>
                    <div className="col-lg-2 col-md-3 col-5">
                      <Input
                        type="number"
                        labelVariant="labelSmall"
                        labelText="Duration (in days)"
                        value={checkItem.completionDuration}
                        id={Iindex}
                        name="duration"
                        required={true}
                        onChange={addCheckListSectionName}
                        onBlur={submitChecklistSection}
                        variant="checklistInput"
                        className={styles.smallInputField}
                        min="1"
                      />
                      {checkItem?.completionDurationErr && (
                        <Text
                          heading="span"
                          text={checkItem?.completionDurationErr}
                          variant="error"
                        />
                      )}
                    </div>
                    <div className="col-lg-2 col-md-3 col-5">
                      <Input
                        type="number"
                        labelVariant="labelSmall"
                        labelText="Buffer Period (in days)"
                        value={checkItem.bufferPeriod}
                        id={Iindex}
                        name="buffer"
                        onChange={addCheckListSectionName}
                        onBlur={submitChecklistSection}
                        variant="checklistInput"
                        className={styles.smallInputField}
                        min="0"
                      />
                      {checkItem?.bufferPeriodErr && (
                        <Text
                          heading="span"
                          text={checkItem?.bufferPeriodErr}
                          variant="error"
                        />
                      )}
                    </div>
                    {checklistDetails?.length > 1 && (
                      <div className="col-1">
                        <BsTrashFill
                          onClick={() =>
                            removeChecklistSection(
                              checkItem?.id,
                              checkItem?.questionSectionId
                            )
                          }
                        />
                      </div>
                    )}
                  </div>

                  {checkpoints?.map((checkInputs, index) => {
                    const isEditing = checkInputs?.check_point_id
                      ? checkInputs?.check_point_id ===
                        currentEditFieldBackup?.data?.check_point_id
                      : true;
                    return (
                      <div
                        key={`checklist-item-${index}${Iindex}`}
                        className={styles.checkListInputContainer}
                      >
                        <div className={styles.fieldActions}>
                          <BsTrashFill
                            onClick={() =>
                              deleteCheckpoint(
                                checkInputs?.id,
                                checkInputs?.check_point_id,
                                Iindex
                              )
                            }
                          />
                          {checkInputs?.check_point_id &&
                            (isEditing ? (
                              <>
                                <MdCheck
                                  onClick={() => {
                                    if (
                                      !isEqual(
                                        checkInputs,
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
                                    !isEqual(
                                      checkInputs,
                                      currentEditFieldBackup?.data
                                    )
                                      ? styles.fieldActionsEditButtonActive
                                      : ""
                                  }
                                  `}
                                />
                                <MdClose
                                  onClick={() => {
                                    onDiscardChanges(Iindex, index);
                                  }}
                                  className={`
                                             ${styles.fieldActionsEditButton}
                                             ${styles.fieldActionsEditButtonActive}
                                             `}
                                  title="Discard all changes"
                                />
                              </>
                            ) : (
                              <>
                                <MdModeEdit
                                  title="Edit"
                                  className={styles.fieldActionsEditButton}
                                  onClick={() =>
                                    setCurrentEditFieldBackup({
                                      index,
                                      data: { ...checkInputs },
                                    })
                                  }
                                />
                              </>
                            ))}
                        </div>
                        <div
                          className={`${styles.checkListInputs} row align-items-start`}
                        >
                          <div
                            className={`${styles.inputField} col-6 col-md-3 col-lg-3`}
                          >
                            {/* <Input
                              type="text"
                              labelText="Checkpoint"
                              variant="checklistInput"
                              labelVariant="labelSmall"
                              name="areaForVerfication"
                              onChange={createRequirement}
                              id={`${index},${Iindex}`}
                              value={checkInputs.areaForVerfication}
                            /> */}
                            <AutoGrowInput
                              name="areaForVerfication"
                              onChange={createRequirement}
                              id={`${index},${Iindex}`}
                              value={checkInputs.areaForVerfication}
                              labelText="Checkpoint"
                              labelVariant="labelSmall"
                              variant="checklistInput"
                              disabled={!isEditing}
                            />
                            {checkInputs.error?.isError &&
                              checkInputs.error?.type ===
                                "areaForVerfication" && (
                                <Text
                                  heading="span"
                                  text={checkInputs.error.message}
                                  variant="error"
                                />
                              )}
                          </div>

                          {/* <div className={`${styles.inputField} col-6 col-md-3 col-lg-2`}>
                          <Input
                            type="textarea"
                            labelText="Regulatory Description"
                            variant="checklistInput"
                            labelVariant="labelSmall"
                            name="regulatoryDescription"
                            onChange={createRequirement}
                            id={`${index},${Iindex}`}
                            value={checkInputs.regulatoryDescription}
                          />
                        </div> */}

                          <div
                            className={`${styles.inputField} col-6 col-md-3 col-lg-1`}
                          >
                            <Input
                              type="select"
                              labelText="Severity"
                              placeholder="Select"
                              variant="checklistInput"
                              valueForDropDown={severity}
                              labelVariant="labelSmall"
                              name="severity"
                              value={checkInputs.severity || null}
                              onChange={createRequirement}
                              id={`${index},${Iindex}`}
                              className={styles.smallSelectField}
                              disabled={!isEditing}
                              selectEnabled={true}
                            />
                          </div>

                          {/* <div className={`${styles.inputField} col-6 col-md-3 col-lg-2`}>
                          <Input
                            type="text"
                            labelText="Consequence of non compliance"
                            variant="checklistInput"
                            labelVariant="labelSmall"
                            name="consequenceOfNonCompliance"
                            onChange={createRequirement}
                            value={checkInputs.consequenceOfNonCompliance}
                            id={`${index},${Iindex}`}
                          />
                        </div> */}
                          {/* <div
                            className={`${styles.inputField} col-6 col-md-3 col-lg-2 d-flex flex-column justify-content-end`}
                          >
                            <Label
                              text="Date Range"
                              variant="createTemplateLabel"
                            />
                            <RangePicker
                              value={
                                checkInputs.start_date && checkInputs.end_date
                                  ? [
                                      moment(
                                        checkInputs?.start_date,
                                        "YYYY/MM/DD"
                                      ),
                                      moment(
                                        checkInputs?.end_date,
                                        "YYYY/MM/DD"
                                      ),
                                    ]
                                  : []
                              }
                              onChange={(date, formatStrings) => {
                                let temp = [...checklistDetails];
                                temp[Iindex].checkListInput[index].start_date =
                                  formatStrings[0];
                                temp[Iindex].checkListInput[index].end_date =
                                  formatStrings[1];

                                setChecklistDetails(temp);
                              }}
                              format="YYYY/MM/DD"
                            />
                          </div> */}

                          <div
                            className={`${styles.inputField} col-6 col-md-3 col-lg-1`}
                          >
                            {/* <Input
                              type="select"
                              labelText="Attachement"
                              placeholder="Select"
                              variant="checklistInput"
                              valueForDropDown={checkpointAttachmentType}
                              labelVariant="labelSmall"
                              name="attachment_format"
                              onChange={createRequirement}
                              id={`${index},${Iindex}`}
                              value={checkInputs.attachment_format || null}
                              className={styles.smallSelectField}
                              disabled={!isEditing}
                            /> */}
                            <MultiSelectInput
                              labelText="Attachment"
                              menuPos="relative"
                              variant="checklistInput"
                              labelVariant="labelSmall"
                              name="attachment_format"
                              isDisabled={!isEditing}
                              closeMenuOnScroll={true}
                              value={[
                                ...(checkInputs?.attachment_format || []),
                              ].map((value) => ({
                                label: value.attachment_type,
                                value: value.attachment_type,
                              }))}
                              onChange={(e) =>
                                onAttachmentFormatChange(
                                  e,
                                  `${index},${Iindex}`
                                )
                              }
                              isClearable={true}
                              options={checkpointAttachmentType}
                              components={{
                                MultiValue: ({ getValue, index }) => {
                                  const selectedValuesLength =
                                    getValue()?.length;
                                  return !index && selectedValuesLength;
                                },
                                ClearIndicator: ({ clearValue, ...rest }) => {
                                  return (
                                    <MdClose
                                      {...rest}
                                      onClick={() => clearValue()}
                                      className="cursor-pointer"
                                    />
                                  );
                                },
                              }}
                            />
                          </div>
                          <div
                            className={`${styles.inputField} col-6 col-md-3 col-lg-2`}
                          >
                            {/* <Input
                              type="text"
                              labelText="How to verify"
                              variant="checklistInput"
                              labelVariant="labelSmall"
                              name="how_to_verify"
                              placeholder="how to verify"
                              onChange={createRequirement}
                              id={`${index},${Iindex}`}
                              value={checkInputs.how_to_verify}
                            /> */}
                            <AutoGrowInput
                              labelText="How To Verify"
                              variant="checklistInput"
                              labelVariant="labelSmall"
                              name="how_to_verify"
                              placeholder="How to verify"
                              onChange={createRequirement}
                              id={`${index},${Iindex}`}
                              value={checkInputs.how_to_verify}
                              disabled={!isEditing}
                            />
                            {checkInputs.error?.isError &&
                              checkInputs.error?.type === "how_to_verify" && (
                                <Text
                                  heading="span"
                                  text={checkInputs.error.message}
                                  variant="error"
                                />
                              )}
                          </div>
                          <div
                            className={`${styles.inputField} col-6 col-md-3 col-lg-1`}
                          >
                            <Input
                              type="text"
                              labelText="Penalty"
                              variant="checklistInput"
                              labelVariant="labelSmall"
                              placeholder="Enter penalty"
                              name="penalty"
                              onChange={createRequirement}
                              id={`${index},${Iindex}`}
                              value={checkInputs.penalty}
                              className={styles.smallInputField}
                              disabled={!isEditing}
                            />
                            {checkInputs.error?.isError &&
                              checkInputs.error?.type === "penalty" && (
                                <Text
                                  heading="span"
                                  text={checkInputs.error.message}
                                  variant="error"
                                />
                              )}
                          </div>
                          <div
                            className={`${styles.addFileButton} col-6 col-md-3 col-lg-2`}
                          >
                            <Input
                              type="file"
                              labelText="Regulatory Ref."
                              name="regulatoryRef"
                              variant="checklistInput"
                              labelVariant="labelSmall"
                              onChange={createRequirement}
                              id={`${index},${Iindex}`}
                              multiple={true}
                              fileList={[
                                ...(checkInputs?.regulatoryRef_uploaded || []),
                                ...(checkInputs.regulatoryRef || []),
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
                            {/* {checkInputs?.regulatoryRef?.length > 0 &&
                              checkInputs?.regulatoryRef?.map((file) => {
                                const { file_name } = file;
                                const file_type = file_name.split(".")?.pop();
                                return (
                                  <>
                                    <div className="d-flex my-1">
                                      <div style={{ width: "10px" }}>
                                        <FileIcon
                                          extension={file_type}
                                          {...defaultStyles[file_type]}
                                        />
                                      </div>
                                      <Text
                                        heading="p"
                                        // size="small"
                                        className="ml-2"
                                        variant="stepperSubHeading"
                                        text={file_name || ""}
                                      />
                                    </div>
                                  </>
                                );
                              })} */}
                          </div>
                          <div
                            className={`${styles.inputField} col-6 col-md-3 col-lg-2`}
                          >
                            <MultiSelectInput
                              labelText="Document Relied Upon"
                              menuPos="relative"
                              options={questionReferences}
                              variant="checklistInput"
                              labelVariant="labelSmall"
                              isDisabled={!isEditing}
                              value={
                                checkInputs.documentReliedUpon
                                  ? [...checkInputs.documentReliedUpon].map(
                                      (element) => {
                                        return {
                                          label: element.label,
                                          value: element.value,
                                        };
                                      }
                                    )
                                  : []
                              }
                              onChange={(d) => {
                                onSelect(index, Iindex, d);
                              }}
                            />
                            {/* <Select
                              
                              styles={customSelectStyles}
                              name="colors"
                              
                            /> */}
                            {checkInputs.error?.isError &&
                              checkInputs.error?.type ===
                                "documentReliedUpon" && (
                                <Text
                                  heading="span"
                                  text={checkInputs.error.message}
                                  variant="error"
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className={styles.addNewCheckList}>
                    <BsPlusSquareFill
                      onClick={() =>
                        onCreateCheckPoint("addNewSection", Iindex)
                      }
                    />
                    <Text
                      heading="p"
                      text="NEW CHECKPOINT"
                      size="small"
                      variant="primary"
                    />
                  </div>
                </div>
              );
            })}
        </div>

        <div className={`${styles.addNewCheckList} mt-2`}>
          <BsPlusSquareFill onClick={() => addNewSection()} />
          <Text heading="p" text="NEW SECTION" size="small" variant="primary" />
        </div>
      </div>
      <div className={styles.saveTemplate}>
        <div>
          <Button
            description="NEXT"
            size="small"
            variant="default"
            onClick={() => {
              onCreateCheckPoint("next");
            }}
          />
        </div>
        <div>
          <Button
            description="Save & Quit"
            variant="preview"
            size="medium"
            onClick={() => {
              onCreateCheckPoint("save&quit");
            }}
          />
          {/* <Button
            description="QUIT"
            variant="preview"
            size="medium"
            className="ml-3"
            onClick={() => {
              dispatch(createUpdateAuditTemplateActions.clearAllState());
              history.push("/audit");
              // onCreateCheckPoint("save&quit");
            }}
          /> */}
        </div>
      </div>
    </>
  );
};

export default CheckList;
