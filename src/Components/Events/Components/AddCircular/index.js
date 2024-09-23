import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CreatableSelect from "react-select/creatable";
import Dropzone from "react-dropzone";
import styles from "./style.module.scss";
import inputStyles from "Components/Audit/components/Inputs/style.module.scss";
import DatePicker from "antd/lib/date-picker";
import IconButton from "@mui/material/IconButton";
import uploadIcon from "../../../../assets/Icons/uploadIcon.svg";
import Button from "Components/Audit/components/Buttons/Button";
import { MdError, MdKeyboardArrowLeft } from "react-icons/md";
import dashboardStyles from "SharedComponents/Dashboard/styles.module.scss";
import constant, {
  selectInputCustomStyles,
} from "CommonModules/sharedComponents/constants/constant";
import dashboardApis from "Components/OnBoarding/SubModules/DashBoardCO/api/index";
import calendarIcon from "../../../../assets/Icons/calanderIcon.svg";
import FrappeSelectInput from "CommonModules/sharedComponents/Inputs/FrappeInputs/FrappeSelectInput";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import AddQuestion from "./AddQuestion";
import {
  convertHtmlToString,
  isHTML,
  removeWhiteSpaces,
} from "CommonModules/helpers/string.helpers";
import moment from "moment";
import NewTaskModel from "Components/ProjectManagement/components/AddNewTask/TaskModel";
import { useDispatch, useSelector } from "react-redux";
import { eventsModuleActions } from "Components/Events/redux/actions";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";
import { isEqual } from "lodash";
import {
  getApprovedComplianceEvents,
  getApprovedLicenses,
  getTopicList,
  getIssuerList,
  getTemplateList,
  getQuestionList,
  getTaskTemplateDetails,
  getSingleQuestion,
} from "Components/Events/api";
import isURL from "validator/lib/isURL";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import {
  getMaxFilesAndGenerateError,
  onDropRejection,
} from "CommonModules/helpers/file.helper";
import { toast } from "react-toastify";
import CreateNewLicense from "Components/Events/pages/LicensePage/CreateNewLicense";
import { FileDocumentDetailsBox } from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/File";
import { convertFromHTML } from "draft-js";
import ConfirmationModal from "./ConfirmationModal";
import RejectionCommentModal from "./RejectionCommentModal";
const calendarImage = <img src={calendarIcon} alt="calendar" />;
const AddComplianceEvent = lazy(() => import("../AddComplianceEvent"));
const SunEditor = lazy(() => import("SharedComponents/SunEditor"));
const getTemplateIndex = (id = "", seperator = "-") =>
  id ? parseInt(id.split(seperator).pop()) : null;

const mapHtmlToString = (item) => {
  if (item?.label && isHTML(item?.label)) {
    return {
      ...item,
      label: convertHtmlToString(item?.label),
    };
  } else {
    return item;
  }
};

const AddCircular = ({ handleCloseAddCircular, editData }) => {
  const [isShowConfirmationModal, setIsShowConfirmationModal] = useState(false);
  const { isCEApprover, userDetails } = useGetUserRoles();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [licenseOptions, setLicenseOptions] = useState([]);
  const [complianceEventOptions, setComplianceEventOptions] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    isValidate: false,
    circular_link_error: "",
  });
  const [issuerOptions, setIssuerOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [questionOptions, setQuestionOptions] = useState([]);
  const [fieldsBackup, setFieldsBackup] = useState({
    overview: "",
    questions: [],
    complianceEvents: [],
    templates: [],
    licenses: [],
    circular_id: null,
    temp_circular_id: null,
    title: "",
    topic: null,
    date_of_issued: null,
    implementation_date: null,
    update_issued_by: [],
    circular_number: "",
    circular_link: "",
    send_notification: false,
    file_details: [],
  });
  const [fieldInputs, setFieldInputs] = useState({
    overview: "",
    questions: [],
    complianceEvents: [],
    templates: [],
    licenses: [],
    circular_id: null,
    temp_circular_id: null,
    title: "",
    topic: null,
    date_of_issued: null,
    implementation_date: null,
    update_issued_by: [],
    circular_number: "",
    circular_link: "",
    send_notification: false,
    file_details: [],
  });
  const containerRef = useRef();
  const scrollableHeight = useScrollableHeight(containerRef, 64, []);
  const [isShowAddQuestion, setIsShowAddQuestion] = useState(false);
  const [isShowAddTaskDetails, setIsShowAddTaskDetails] = useState(false);
  const [editDataForTaskDetails, setEditDataForTaskDetails] = useState({
    subject: "",
  });
  const [isShowAddComplianceEvent, setIsShowAddComplianceEvent] =
    useState(false);
  const [editDataForComplianceEvent, setEditDataForComplianceEvent] = useState({
    name_of_the_subtask: "",
  });
  const [isShowAddLicense, setIsShowAddLicense] = useState(false);
  const [editDataForLicense, setEditDataForLicense] = useState({});
  const [editDataForQuestion, setEditDataForQuestion] = useState({
    question: "",
    createId: "",
  });
  const dispatch = useDispatch();
  const isSavingData = useSelector(
    (state) => state?.eventsModuleReducer?.circular?.isSavingData
  );
  const selectedUserEmail =
    useSelector((state) => state?.eventsModuleReducer?.selectedUser?.email) ||
    userDetails.email;
  const isRejectionCommentModalVisible = useSelector(
    (state) => state?.eventsModuleReducer?.rejectionCommentModal?.visible
  );
  const isEditingEnabled =
    editData?.circular_id || editData?.temp_circular_id || editData?.title;
  const isUpdated = !isEqual(fieldInputs, fieldsBackup);

  const handleOverviewChange = (content) =>
    setFieldInputs((prev) => ({ ...prev, overview: content }));
  // function to set questions
  const handleSetQuestions = (questions) =>
    setFieldInputs({ ...fieldInputs, questions });
  // function to set templates
  const handleSetTemplates = (templates) =>
    setFieldInputs({ ...fieldInputs, templates });
  // function to set licenses
  const handleSetLicenses = (licenses) =>
    setFieldInputs({ ...fieldInputs, licenses });
  // function to set compliance events
  const handleSetComplianceEvents = (complianceEvents) =>
    setFieldInputs({ ...fieldInputs, complianceEvents });
  // function to close the add question modal
  const handleAddQuestionClose = useCallback(
    (canceledIndex) => {
      if (canceledIndex) {
        // remove the created license if user closes the modal
        const questionIndex = getTemplateIndex(canceledIndex);
        const _questions = [...fieldInputs.questions];
        _questions[questionIndex] = null;
        handleSetQuestions(_questions);
      }
      setEditDataForQuestion({ question: "", createId: null });
      setIsShowAddQuestion(false);
    },
    [fieldInputs.questions]
  );
  // function to handle onCreateOption in task template input
  const onCreateOptionForTaskDetails = (inputValue, index) => {
    setEditDataForTaskDetails((prev) => ({
      ...prev,
      subject: inputValue,
      createId: `template-${index}`,
    }));
    const _templates = [...fieldInputs.templates];
    _templates.splice(index, 1, {
      label: inputValue,
      value: inputValue,
      id: `template-${index}`,
    });
    handleSetTemplates(_templates);
    setIsShowAddTaskDetails(true);
  };
  const onEditOptionForTaskDetails = async (data, index) => {
    const templateId = data.value;
    if (templateId) {
      try {
        const { data, status } = await getTaskTemplateDetails(templateId);
        if (status === 200 && data?.message?.status) {
          const details = data?.message?.task_template_details[0] || null;
          if (details)
            setEditDataForTaskDetails({
              ...details,
              createId: `template-${index}`,
              circulars: details.circular,
              frequency: details.frequency
                ? { value: details.frequency, label: details.frequency }
                : null,
              subject: details?.task_name || "",
              impactFileDetails: details.impact_files || [],
              riskRating: {
                value: details?.risk_rating ? details?.risk_rating : "",
                label: details?.risk_rating ? details?.risk_rating : "",
              },
              file_details: details.attached_files,
              frequency_end_date:
                details?.frequencyenddate || details?.frequencyEndDate || "",
              repeat_on_holiday: details.repeatOnHoliday || "",
            });
          setIsShowAddTaskDetails(true);
        } else {
          toast.error(data?.message?.status_response);
        }
      } catch (error) {}
    }
  };

  const onEditOptionForQuestion = async (data, index) => {
    const questionId = data.value;
    if (index === undefined || index === null)
      index = fieldInputs.questions?.length || 0;
    if (questionId) {
      // fetch question details
      try {
        const { data, status } = await getSingleQuestion(questionId);
        if (status === 200 && data?.message?.status) {
          const question_details = data?.message?.question_details;
          const _editDataForQuestion = {};
          _editDataForQuestion.question = question_details.question;
          _editDataForQuestion.options = question_details.options?.map(
            (item) => ({
              label: item.option,
              value: item.option,
              selected: !!item.is_correct,
            })
          );
          _editDataForQuestion.createId = `question-${index}`;
          _editDataForQuestion.question_id = question_details.question_id;
          setEditDataForQuestion(_editDataForQuestion);
          setIsShowAddQuestion(true);
        } else {
          toast.error(data?.message?.status_response);
        }
      } catch (error) {
        toast.error("Something went wrong!!");
      }
    }
  };

  const onCreateOptionForQuestion = (inputValue, index) => {
    if (index === undefined || index === null)
      index = fieldInputs.questions?.length || 0;
    setEditDataForQuestion((prev) => ({
      ...prev,
      question: inputValue,
      createId: `question-${index}`,
    }));
    const _questions = [...fieldInputs.questions];
    _questions.splice(index, 1, {
      label: inputValue,
      value: inputValue,
      id: `question-${index}`,
    });
    handleSetQuestions(_questions);
    setIsShowAddQuestion(true);
  };
  const onCreateOptionForLicense = (inputValue, index) => {
    setEditDataForLicense({
      license_name: inputValue,
      createId: `license-${index}`,
    });
    const _licenses = [...fieldInputs.licenses];
    _licenses.splice(index, 1, {
      label: inputValue,
      value: inputValue,
      id: `license-${index}`,
    });
    handleSetLicenses(_licenses);
    setIsShowAddLicense(true);
  };

  const onCreateOptionForComplianceEvent = (inputValue, index) => {
    if (!index) index = fieldInputs.complianceEvents?.length || 0;
    setEditDataForComplianceEvent({
      name_of_the_subtask: inputValue,
      createId: `compliance-event-${index}`,
    });
    const _complianceEvents = [...fieldInputs.complianceEvents];
    _complianceEvents.splice(index, 1, {
      label: inputValue,
      value: inputValue,
      id: `compliance-event-${index}`,
    });
    handleSetComplianceEvents(_complianceEvents);
    setIsShowAddComplianceEvent(true);
  };

  // function to fetch approved license list
  const fetchApprovedLicenseList = async () => {
    try {
      const { data, status } = await getApprovedLicenses({
        email_id: selectedUserEmail,
      });
      if (status === 200 && data?.message?.status) {
        let _list = data?.message?.license_list || [];
        if (_list?.length > 0)
          _list = _list.map((item) => ({
            label: item.display_name,
            value: item.name,
          }));
        setLicenseOptions(_list);
      } else {
        setLicenseOptions([]);
      }
    } catch (error) {
      setLicenseOptions([]);
    }
  };
  // function to fetch approved compliance event list
  const fetchApprovedComplianceEventList = async () => {
    try {
      const { data, status } = await getApprovedComplianceEvents({
        email_id: selectedUserEmail,
      });
      if (status === 200 && data?.message?.status) {
        let _list = data?.message?.ce_list || [];
        if (_list?.length > 0)
          _list = _list.map((item) => ({
            label: item.name_of_the_subtask,
            value: item.name,
          }));
        setComplianceEventOptions(_list);
      } else {
        setComplianceEventOptions([]);
      }
    } catch (error) {
      setComplianceEventOptions([]);
    }
  };
  // function to fetch issuer list
  const fetchIssuerList = async () => {
    try {
      const { data, status } = await getIssuerList();
      if (status === 200 && data?.message?.status) {
        let _list = data?.message?.issuer_list || [];
        if (_list)
          _list = _list.map((item) => ({ value: item.name, label: item.name }));
        setIssuerOptions(_list);
      } else {
        setIssuerOptions([]);
      }
    } catch (error) {
      setIssuerOptions([]);
    }
  };
  // function to fetch topics
  const fetchTopicList = async () => {
    try {
      const { data, status } = await getTopicList();
      if (status === 200 && data?.message?.status) {
        let _list = data?.message?.issuer_list || [];
        if (_list)
          _list = _list.map((item) => ({ value: item.name, label: item.name }));
        setTopicOptions(_list);
      } else {
        setTopicOptions([]);
      }
    } catch (error) {
      setTopicOptions([]);
    }
  };
  const fetchTemplateList = async () => {
    try {
      const { data, status } = await getTemplateList({
        email_id: selectedUserEmail,
      });
      if (status === 200 && data?.message?.status) {
        let _list = data?.message?.task_template_list || [];
        if (_list)
          _list = _list.map((item) => ({
            value: item.id,
            label: item.task_name,
          }));
        setTemplateOptions(_list);
      } else {
        setTemplateOptions([]);
      }
    } catch (error) {
      setTemplateOptions([]);
    }
  };
  const fetchQuestionList = async () => {
    try {
      const { data, status } = await getQuestionList({
        email_id: selectedUserEmail,
      });
      if (status === 200 && data?.message?.status) {
        let _list = data?.message?.question_list[0] || [];
        if (_list)
          _list = _list.map((item) => ({
            value: item.id,
            label: isHTML(item.question)
              ? convertHtmlToString(item.question)
              : item.question,
          }));
        setQuestionOptions(_list);
      } else {
        setQuestionOptions([]);
      }
    } catch (error) {
      setQuestionOptions([]);
    }
  };

  const createDataPayload = useCallback(() => {
    const _payload = {
      ...fieldInputs,
      licenses: fieldInputs.licenses?.map((item) =>
        typeof item === "string" ? item : item.value || item.label
      ),
      complianceEvents: fieldInputs.complianceEvents?.map((item) =>
        typeof item === "string" ? item : item.value || item.label
      ),
      templates: fieldInputs.templates?.map((item) =>
        typeof item === "string" ? item : item.value || item.label
      ),
      questions: fieldInputs.questions?.map((item) =>
        typeof item === "string" ? item : item.value || item.label
      ),
      topic: fieldInputs.topic?.map((item) =>
        typeof item === "string" ? item : item.value || item.label
      ),
    };
    const formData = new FormData();
    Object.keys(_payload)
      ?.filter((key) => key !== "file_details")
      .forEach((key) => {
        if (typeof _payload[key] === "object") {
          formData.append(key, JSON.stringify(_payload[key]));
        } else {
          formData.append(key, _payload[key]);
        }
      });
    uploadedFiles.forEach((file) => {
      formData.append("file_details", file);
    });

    return formData;
  }, [fieldInputs, uploadedFiles]);

  const handleRemoveAttachement = async (file_id, file_name) => {
    if (file_id && file_name) {
      // remove file from database
      try {
        const { data, status } = await dashboardApis.deleteFile(file_id);
        if (status === 200 && data?.message?.status) {
          toast.success(`${file_name} has been deleted successfully!`);
          setFieldInputs({
            ...fieldInputs,
            file_details: [...fieldInputs.file_details].filter(
              (f) => f.file_name !== file_name
            ),
          });
        } else {
          toast.error(
            data?.message?.status_response || "Something went wrong!!"
          );
        }
      } catch (error) {
        toast.error("Something went wrong!!");
      }
    } else if (!file_id && file_name) {
      // remove uploaded files
      setUploadedFiles((prev) => [...prev].filter((f) => f.name !== file_name));
    }
  };

  const validateFieldInputs = useCallback(() => {
    const {
      // implementation_date,
      // complianceEvents,
      overview,
      // licenses,
      title,
      topic,
      date_of_issued,
      update_issued_by,
      circular_number,
      circular_link,
    } = fieldInputs;
    let licenses = fieldInputs.licenses;
    licenses = licenses?.filter((i) => i) || [];

    const blockContent = convertFromHTML(overview || "<p></p>");
    const isValidOverview = blockContent?.contentBlocks?.length > 0;

    const isValidCircularLink = !!(circular_link && isURL(circular_link));

    setFieldErrors({
      isValidate:
        !title ||
        title === " " ||
        !topic ||
        !date_of_issued ||
        !update_issued_by ||
        !circular_number ||
        circular_number === " " ||
        !circular_link ||
        circular_link === " " ||
        !isValidCircularLink ||
        !licenses?.length ||
        !overview ||
        !isValidOverview,

      circular_link_error: circular_link
        ? !isValidCircularLink
          ? "Circular link must be a valid URL"
          : ""
        : "",
    });
  }, [
    fieldInputs?.overview,
    fieldInputs?.licenses,
    fieldInputs?.topic,
    fieldInputs?.title,
    fieldInputs?.date_of_issued,
    fieldInputs?.update_issued_by,
    fieldInputs?.circular_number,
    fieldInputs?.circular_link,
  ]);

  // initially load all options for select inputs
  useEffect(() => {
    fetchApprovedComplianceEventList();
    fetchApprovedLicenseList();
    fetchTopicList();
    fetchIssuerList();
    fetchTemplateList();
    fetchQuestionList();
  }, []);

  // initially set the form if there is editData
  useEffect(() => {
    if (editData && Object.keys(editData)?.length > 0) {
      // const templates = [...(editData.templates || [])].map((item) => {
      //   if (typeof item === "string") {
      //     return (
      //       templateOptions?.find((data) => data.value === item) || {
      //         label: item,
      //         value: item,
      //       }
      //     );
      //   }
      //   return item;
      // });
      // const questions = [...(editData.questions || [])].map((item) => {
      //   if (typeof item === "string") {
      //     return (
      //       questionOptions?.find((data) => data.value === item) || {
      //         label: item,
      //         value: item,
      //       }
      //     );
      //   }
      //   return item;
      // });
      setFieldInputs((prev) => ({
        ...prev,
        ...editData,
      }));
      setFieldsBackup((prev) => ({
        ...prev,
        ...editData,
      }));
    }
  }, [editData]);

  useEffect(() => {
    validateFieldInputs();
  }, [validateFieldInputs]);

  return (
    <div>
      {isRejectionCommentModalVisible && <RejectionCommentModal />}
      {/* Header */}
      {isShowConfirmationModal && (
        <ConfirmationModal
          visible={isShowConfirmationModal}
          onClose={() => setIsShowConfirmationModal(false)}
          onConfirm={handleCloseAddCircular}
        />
      )}
      {isShowAddQuestion && (
        <AddQuestion
          visible={isShowAddQuestion}
          onClose={handleAddQuestionClose}
          editData={editDataForQuestion}
          // handleSaveQuestion={handleSaveQuestion}
          onQuestionCreated={({ question, createId, question_id }) => {
            if (
              createId &&
              question_id &&
              editDataForQuestion?.question &&
              question
            ) {
              const questionIndex = getTemplateIndex(createId);
              const _questions = [...fieldInputs.questions];
              _questions[questionIndex].label = question;
              _questions[questionIndex].value = question_id;
              handleSetQuestions(_questions);
              fetchQuestionList();
            }
            setEditDataForQuestion({ question: "", createId: "" });
            setIsShowAddQuestion(false);
          }}
        />
      )}
      <Suspense fallback={<BackDrop isLoading />}>
        {isShowAddLicense && (
          <CreateNewLicense
            open={isShowAddLicense}
            isCreateLicenseForCircular={true}
            isAddParentLicense
            handleClose={(canceledIndex) => {
              if (canceledIndex) {
                // remove the created license if user closes the modal
                const licenseIndex = getTemplateIndex(canceledIndex);
                const _licenses = [...fieldInputs.licenses];
                _licenses[licenseIndex] = null;
                handleSetLicenses(_licenses);
              }
              setIsShowAddLicense(false);
              setEditDataForLicense({ license_name: "", createId: null });
            }}
            // isAddSubLicene={false}
            editdata={editDataForLicense}
            onCreatedLicense={({ license_name, createId, license_id }) => {
              if (
                createId &&
                license_id &&
                editDataForLicense.license_name &&
                license_name
              ) {
                const licenseIndex = getTemplateIndex(createId);
                const _licenses = [...fieldInputs.licenses];
                _licenses[licenseIndex].label = license_name;
                _licenses[licenseIndex].value = license_id;
                handleSetLicenses(_licenses);
                fetchApprovedLicenseList();
              }
            }}
          />
        )}
        {isShowAddComplianceEvent && (
          <AddComplianceEvent
            showTask={isShowAddComplianceEvent}
            isCreateEventForCircular
            onClose={(canceledIndex = "") => {
              if (canceledIndex) {
                // remove the created event if user closes the modal
                const complianceEventIndex = getTemplateIndex(canceledIndex);
                const _complianceEvents = [...fieldInputs.complianceEvents];
                _complianceEvents.splice(complianceEventIndex, 1);
                handleSetComplianceEvents(_complianceEvents);
              }
              setIsShowAddComplianceEvent(false);
              setEditDataForComplianceEvent({
                name_of_the_subtask: "",
                createId: null,
              });
            }}
            editData={editDataForComplianceEvent}
            onEventCreated={({
              name_of_the_subtask,
              createId,
              compliance_event_id,
            }) => {
              if (
                createId &&
                compliance_event_id &&
                editDataForComplianceEvent?.name_of_the_subtask &&
                name_of_the_subtask
              ) {
                const complianceEventIndex = getTemplateIndex(createId);
                const _complianceEvents = [...fieldInputs.complianceEvents];
                // _templates[templateIndex] = { label: subject, value: subject };
                _complianceEvents[complianceEventIndex].label =
                  name_of_the_subtask;
                _complianceEvents[complianceEventIndex].value =
                  compliance_event_id;
                handleSetComplianceEvents(_complianceEvents);
                fetchApprovedComplianceEventList();
                fetchApprovedLicenseList();
              }
            }}
          />
        )}
      </Suspense>
      <NewTaskModel
        showTask={isShowAddTaskDetails}
        onClose={(canceledIndex = "") => {
          if (canceledIndex) {
            // remove the created template if user closes the modal
            const templateIndex = getTemplateIndex(canceledIndex);
            const _templates = [...fieldInputs.templates];
            _templates[templateIndex] = null;
            handleSetTemplates(_templates);
          }
          setIsShowAddTaskDetails(false);
          setEditDataForTaskDetails({ subject: "", createId: null });
        }}
        editData={editDataForTaskDetails}
        isEdit={!!editDataForTaskDetails?.name}
        isCreateTemplate
        onCreateTemplate={({ template_id, subject, createId }) => {
          // if task name has been changed then update the task name in template values
          if (
            createId &&
            editDataForTaskDetails.subject &&
            subject &&
            template_id
          ) {
            const templateIndex = getTemplateIndex(createId);
            const _templates = [...fieldInputs.templates];
            // _templates[templateIndex] = { label: subject, value: subject };
            _templates[templateIndex].label = subject;
            _templates[templateIndex].value = template_id;
            handleSetTemplates(_templates);
            fetchTemplateList();
          }
          setIsShowAddTaskDetails(false);
          setEditDataForTaskDetails({ subject: "", createId: null });
        }}
      />
      <div
        className={`${dashboardStyles.dashboardHeaderContainer} justify-content-start justify-content-md-between m-0 mb-2 px-0`}
      >
        <div className="d-flex align-items-center w-50">
          <IconButton
            color="inherit"
            onClick={() => {
              // handleCloseAddCircular();
              setIsShowConfirmationModal(true);
            }}
            disableTouchRipple
            size="medium"
            className="mr-2"
          >
            <MdKeyboardArrowLeft />
          </IconButton>
          <p
            className={`${dashboardStyles.dashboardHeaderTitle} ${dashboardStyles.dashboardHeaderTitleActive} truncate `}
            title={editData?.title || "Add Circular"}
          >
            {editData?.title || "Add Circular"}
          </p>
        </div>
        {/* Admin logic for circular approval, rejection and comment */}
        {isSavingData ? (
          <Dots />
        ) : isCEApprover &&
          isEditingEnabled &&
          editData?.status !== "Approved" ? (
          <div className="d-flex align-items-center justify-content-end">
            <Button
              disabled={fieldErrors.isValidate}
              onClick={() => {
                dispatch(
                  eventsModuleActions.setCommentModal({
                    visible: true,
                    commentDetails: {
                      doctype: "Pending Circular",
                      docname: editData?.temp_circular_id,
                    },
                  })
                );
              }}
              description="Comment"
            />
            <Button
              disabled={fieldErrors.isValidate}
              onClick={() => {
                const statusUpdatePayload = {
                  temp_circular_id: editData?.temp_circular_id,
                  status: "Approved",
                  comments: "",
                };
                // if circular is updated and approve button is clicked
                if (isUpdated) {
                  dispatch(
                    eventsModuleActions.addUpdateCircularRequest({
                      data: createDataPayload(),
                      dataForStatusUpdate: statusUpdatePayload,
                    })
                  );
                } else {
                  dispatch(
                    eventsModuleActions.setCircularStatusRequest(
                      statusUpdatePayload
                    )
                  );
                }
              }}
              description="Approve"
              className={`mx-2 ${styles.successButton}`}
            />
            <Button
              disabled={
                editData.status === "Rejected" || fieldErrors.isValidate
              }
              onClick={() => {
                const statusUpdatePayload = {
                  temp_circular_id: editData?.temp_circular_id,
                  status: "Rejected",
                  comments: "",
                };
                // if circular is updated and reject button is clicked
                if (isUpdated) {
                  dispatch(
                    eventsModuleActions.addUpdateCircularRequest({
                      data: createDataPayload(),
                      dataForStatusUpdate: statusUpdatePayload,
                      name: "Circular",
                    })
                  );
                } else {
                  // open modal to add reason of rejection
                  dispatch(
                    eventsModuleActions.setRejectionCommentModal({
                      visible: true,
                      rejectionDetails: statusUpdatePayload,
                      name: "Circular",
                    })
                  );
                  // dispatch(
                  //   eventsModuleActions.setCircularStatusRequest(
                  //     statusUpdatePayload
                  //   )
                  // );
                }
              }}
              description="Reject"
              className={styles.dangerButton}
            />
          </div>
        ) : (
          <Button
            disabled={fieldErrors.isValidate}
            onClick={() => {
              dispatch(
                eventsModuleActions.addUpdateCircularRequest({
                  data: createDataPayload(),
                })
              );
            }}
            description="Save"
          />
        )}
      </div>

      {/* Field Inputs */}
      <div
        ref={containerRef}
        style={{ height: scrollableHeight, overflow: "hidden auto" }}
        className="mt-3 pr-1"
      >
        <div className="row" style={{ rowGap: "1rem" }}>
          <div className="col-6">
            <label
              htmlFor="addCircularTitle"
              className="add-edit-project-labels required"
            >
              Circular Title
            </label>
            <input
              type="text"
              id="addCircularTitle"
              required
              maxLength={200}
              className="modal-input"
              name="circular_title"
              value={fieldInputs.title}
              onChange={(e) => {
                setFieldInputs({
                  ...fieldInputs,
                  title: removeWhiteSpaces(e.target.value),
                });
              }}
            />
          </div>
          <div className="col-6">
            <label className="add-edit-project-labels required">
              Topics for the Circular
            </label>
            <CreatableSelect
              isMulti={true}
              //   isDisabled={!fieldInputs.end_date}
              styles={selectInputCustomStyles}
              isClearable={true}
              hideSelectedOptions
              options={topicOptions}
              onChange={(selection) => {
                setFieldInputs({
                  ...fieldInputs,
                  topic: selection,
                });
              }}
              // value={
              //   fieldInputs.topic
              //     ? typeof fieldInputs.topic === "string"
              //       ? [
              //           {
              //             label: fieldInputs.topic,
              //             value: fieldInputs.topic,
              //           },
              //         ]
              //       : fieldInputs.topic
              //     : null
              // }
              value={[...(fieldInputs.topic || [])].map((item) => {
                if (typeof item === "string") {
                  return { label: item, value: item };
                }
                return item;
              })}
            />
          </div>
          <div className="col-6">
            <label className="add-edit-project-labels required">
              Date of issued
            </label>
            <DatePicker
              className="modal-input"
              name="date_of_issued"
              format="DD MMMM Y"
              suffixIcon={calendarImage}
              disabledDate={(current) => {
                let customDate = moment().format("YYYY-MM-DD");
                return (
                  moment(customDate, "YYYY-MM-DD").diff(current, "days") < 0
                );
              }}
              value={
                (fieldInputs?.date_of_issued &&
                  moment(fieldInputs?.date_of_issued, "YYYY-MM-DD")) ||
                null
              }
              onChange={(value) =>
                setFieldInputs({
                  ...fieldInputs,
                  date_of_issued: value?.format("YYYY-MM-DD") || "",
                  ...(fieldInputs?.implementation_date &&
                    value.isAfter(fieldInputs?.implementation_date) && {
                      implementation_date: null,
                    }),
                })
              }
            />
            {/* {fieldErrors?.activate_the_subtask !== "" && (
                  <p className="add-project-err-msg">
                    <MdError />
                    &nbsp;
                    {fieldErrors?.activate_the_subtask}
                  </p>
                )} */}
          </div>
          <div className="col-6">
            <label className="add-edit-project-labels">Compliance Events</label>
            <CreatableSelect
              isMulti={true}
              isValidNewOption={(inputStr) => {
                return inputStr && removeWhiteSpaces(inputStr) !== " ";
              }}
              styles={selectInputCustomStyles}
              isClearable={true}
              options={complianceEventOptions}
              onCreateOption={onCreateOptionForComplianceEvent}
              value={fieldInputs.complianceEvents}
              // value={[...(fieldInputs.complianceEvents || [])].map((item) => {
              //   if (typeof item === "string") {
              //     return (
              //       complianceEventOptions?.find(
              //         (data) => data.value === item
              //       ) || { label: item, value: item }
              //     );
              //   }
              //   return item;
              // })}
              // isValidNewOption={(inputStr) => {
              //   return inputStr && removeWhiteSpaces(inputStr) !== " ";
              // }}
              // onCreateOption={(inputValue) => {

              // }}
              // onChange={(selectedOptions) => {
              //   setFieldInputs((prev) => ({
              //     ...prev,
              //     complianceEvents: selectedOptions,
              //   }));
              // }}
              onChange={handleSetComplianceEvents}
            />
          </div>

          <div className="col-6">
            <label className="add-edit-project-labels">
              Implementation Date
            </label>
            <DatePicker
              className="modal-input"
              name="implementation_date"
              format="DD MMMM Y"
              disabled={!fieldInputs.date_of_issued}
              suffixIcon={calendarImage}
              disabledDate={(current) => {
                let customDate =
                  fieldInputs.date_of_issued || moment().format("YYYY-MM-DD");
                return current && current < moment(customDate, "YYYY-MM-DD");
              }}
              value={
                (fieldInputs?.implementation_date &&
                  moment(fieldInputs?.implementation_date, "YYYY-MM-DD")) ||
                null
              }
              onChange={(value) =>
                setFieldInputs({
                  ...fieldInputs,
                  implementation_date: value?.format("YYYY-MM-DD") || "",
                })
              }
            />
            {/* {fieldErrors?.activate_the_subtask !== "" && (
                  <p className="add-project-err-msg">
                    <MdError />
                    &nbsp;
                    {fieldErrors?.activate_the_subtask}
                  </p>
                )} */}
          </div>
          <div className="col-6">
            <label className="add-edit-project-labels required">Issuer</label>
            <CreatableSelect
              isMulti={false}
              isValidNewOption={(inputStr) => {
                return inputStr && removeWhiteSpaces(inputStr) !== " ";
              }}
              styles={selectInputCustomStyles}
              isClearable={true}
              hideSelectedOptions
              options={issuerOptions}
              onChange={(selection) => {
                setFieldInputs({
                  ...fieldInputs,
                  update_issued_by: selection?.value || null,
                });
              }}
              value={
                fieldInputs.update_issued_by
                  ? typeof fieldInputs.update_issued_by === "string"
                    ? {
                        label: fieldInputs.update_issued_by,
                        value: fieldInputs.update_issued_by,
                      }
                    : fieldInputs.update_issued_by
                  : null
              }
            />
          </div>

          <div className="col-6">
            <label className="add-edit-project-labels required">
              Circular Number
            </label>
            <input
              type="text"
              required
              maxLength={200}
              className="modal-input"
              name="circular_number"
              value={fieldInputs?.circular_number}
              onChange={(e) => {
                setFieldInputs({
                  ...fieldInputs,
                  circular_number: removeWhiteSpaces(e.target.value),
                });
              }}
            />
          </div>
          <div className="col-6">
            <label className="add-edit-project-labels required">
              Circular Link
            </label>
            <input
              type="text"
              required
              maxLength={200}
              className="modal-input"
              name="circular_link"
              value={fieldInputs.circular_link}
              onChange={(e) => {
                setFieldInputs({
                  ...fieldInputs,
                  circular_link: removeWhiteSpaces(e.target.value),
                });
              }}
            />
            {fieldErrors?.circular_link_error !== "" && (
              <p className="add-project-err-msg">
                <MdError />
                &nbsp;
                {fieldErrors?.circular_link_error}
              </p>
            )}
            <div className="d-flex align-items-center mt-2">
              <input
                type="checkbox"
                id="addCircularSendNotificationFlag"
                required
                className="modal-input mr-2"
                name="circular_send_notification"
                onChange={(e) => {
                  setFieldInputs({
                    ...fieldInputs,
                    send_notification: e.target.checked,
                  });
                }}
                checked={fieldInputs.send_notification}
                style={{ width: "fit-content" }}
              />
              <label
                htmlFor="addCircularSendNotificationFlag"
                className="add-edit-project-labels mb-0 "
              >
                Send Notification
              </label>
            </div>
          </div>

          <div className="col-6">
            <label className="add-edit-project-labels required">
              License - Sublicense Details
            </label>
            <FrappeSelectInput
              title="License"
              options={licenseOptions}
              isCreatableSelect
              onCreateOption={onCreateOptionForLicense}
              values={[...(fieldInputs.licenses || [])].map((item) => {
                if (typeof item === "string") {
                  return (
                    licenseOptions.find((data) => data.value === item) || {
                      label: item,
                      value: item,
                    }
                  );
                }
                return item;
              })}
              setValues={handleSetLicenses}
            />
          </div>
          <div className="col-6">
            <label className="add-edit-project-labels">Task Details</label>
            <FrappeSelectInput
              title="Task"
              isCreatableSelect
              onEditOption={onEditOptionForTaskDetails}
              onCreateOption={onCreateOptionForTaskDetails}
              values={fieldInputs.templates}
              // values={[...(fieldInputs.templates || [])].map((item) => {
              //   if (typeof item === "string") {
              //     return (
              //       templateOptions?.find((data) => data.value === item) || {
              //         label: item,
              //         value: item,
              //       }
              //     );
              //   }
              //   return item;
              // })}
              setValues={handleSetTemplates}
              options={templateOptions}
            />
          </div>
          <div className="col-12">
            <label className="add-edit-project-labels required">
              Gist/Overview
            </label>
            <Suspense fallback={<BackDrop isLoading />}>
              <SunEditor
                value={fieldInputs.overview}
                onChange={(content) => {
                  handleOverviewChange(content);
                }}
              />
            </Suspense>
          </div>
          <div className="col-12">
            <label className="add-edit-project-labels">Question</label>
            <FrappeSelectInput
              title="Question"
              isCreatableSelect
              onCreateOption={onCreateOptionForQuestion}
              onEditOption={onEditOptionForQuestion}
              values={fieldInputs.questions.map(mapHtmlToString)}
              // values={[...(fieldInputs.questions || [])].map((item) => {
              //   if (typeof item === "string") {
              //     return (
              //       questionOptions?.find((data) => data.value === item) || {
              //         label: item,
              //         value: item,
              //       }
              //     );
              //   }
              //   return item;
              // })}
              setValues={handleSetQuestions}
              options={questionOptions}
            />
          </div>
          <div className="col-6">
            <label className="add-edit-project-labels">Attachement</label>
            <Dropzone
              onDropRejected={onDropRejection}
              maxSize={10485760}
              accept={[
                ".pdf",
                ".xls",
                ".xlsx",
                ".odt",
                ".ppt",
                ".pptx",
                ".txt",
                ".doc",
                ".docx",
                ".rtf",
                ".zip",
                ".mp4",
                ".jpg",
                ".csv",
                ".jpeg",
                ".png",
              ]}
              multiple={true}
              onDrop={(acceptedFiles) => {
                const files = [...acceptedFiles];
                const validFiles = [...files].filter((uploadedFile) => {
                  const isFileAlreadyExist = [
                    ...uploadedFiles,
                    ...(fieldInputs?.file_details || []),
                  ].find(
                    (file) =>
                      (file?.file_name || file?.name) === uploadedFile.name
                  );
                  if (isFileAlreadyExist)
                    toast.error(`${uploadedFile.name} is already uploaded.`);
                  return !isFileAlreadyExist;
                });
                const _files = getMaxFilesAndGenerateError([
                  ...uploadedFiles,
                  ...validFiles,
                ]);
                setUploadedFiles(_files);
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className={inputStyles.labelContainer}>
                      <label
                        className={`${inputStyles.uploadFileLabel}  ${inputStyles["task-model-big"]}`}
                      >
                        <div className="d-flex flex-column align-items-center justify-content-center">
                          <img src={uploadIcon} alt="upload" />
                          <p
                            className={`${styles.instructionMessage} ${styles.instructionMessageActive}`}
                          >
                            Drag & Drop Upload File
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>
            <p className={styles.instructionMessage}>
              {constant.maxFileSizeWarnning}
            </p>
            <div
              className="d-flex align-items-center flex-wrap"
              style={{ gap: ".5rem" }}
            >
              {[...uploadedFiles, ...fieldInputs.file_details].map(
                (item, index) => {
                  return (
                    <FileDocumentDetailsBox
                      file={item}
                      key={`circular-attachement-${
                        item?.file_id || item?.file_name || item?.name || index
                      }`}
                      deleteUploadedFile={handleRemoveAttachement}
                      isShowDeleteButton={editData?.status !== "Approved"}
                    />
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCircular;
