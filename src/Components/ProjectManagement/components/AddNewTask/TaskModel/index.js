import React, { useCallback, useEffect, useState } from "react";
import "./style.css";
import { DatePicker, TimePicker } from "antd";
import calanderIcon from "../../../../../assets/Icons/calanderIcon.svg";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import auditApis from "../../../../Audit/api/index";
import { MdEdit, MdError } from "react-icons/md";
import { addAndUpdateTaskRequest } from "../../../redux/actions";
import validator from "validator";
import constant from "CommonModules/sharedComponents/constants/constant";
import {
  getProjectDateFormat,
  isAfter,
  isBefore,
  isBeforeToday,
} from "../../date.helpers";
import { toast } from "react-toastify";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import axiosInstance from "apiServices";
import { isEqual } from "lodash";
// import DailyModal from "SharedComponents/FrequencyModals/FrequencyModal";
// import NotifyModal from "SharedComponents/FrequencyModals/NotifyModal";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import { FileDocumentDetailsBox } from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/File";
import useAccount from "SharedComponents/Hooks/Account.hook";
import { filterUsersListFor } from "CommonModules/helpers/tasks.helper";
import DescriptionTab from "CommonModules/sharedComponents/CreateTaskActionsTabs/DescriptionTab";
import { IconButton } from "@mui/material";
import AttachementTab from "CommonModules/sharedComponents/CreateTaskActionsTabs/AttachementTab";
import ImpactTab from "CommonModules/sharedComponents/CreateTaskActionsTabs/ImpactTab";
import RegulatoryRefTab from "CommonModules/sharedComponents/CreateTaskActionsTabs/RegulatoryRefTab";
import TaskEditDeleteOptionsModal from "../../Modals/TaskEditDeleteOptionsModal";
import { UpdatesListItem } from "Components/Updates";
import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";
import {
  // disabledHoursInEventEndTime,
  // disabledMinutesInEventEndTime,
  isValidEndTime,
} from "CommonModules/helpers/Date.helper";
import TemplateEditOptionsModal from "../../Modals/TemplateEditOptionsModal";

const initialState = {
  task_id: null,
  project_id: null,
  milestone_id: null,
  task_list_id: null,
  subject: "",
  start_date: "",
  end_date: "",
  assign_to: "",
  comments: "",
  frequency: { value: "None", label: "None" },
  weekly_repeat_day: "",
  repeat_on_day: "",
  file_details: [],
  description: "",
  end_time: "",
  notify_on: [],
  internal_deadline_day: 0,
  internal_deadline_date: "",
  cc: "",
  approver: "",
  repeat_on_holiday: "yes", // yes, before, after
  repeat_on_every: {
    count: 1,
    type: "day", // day, week, month, year, half_year, quater
    repeatOnWeek: "",
    repeatOnMonth: null,
  },
  frequency_end_date: "",
  impact: "",
  impactFileDetails: [],
  circulars: [],
  riskRating: "",
  internal_license_tag: "",
};

const repeatOnMonthOptions = [
  {
    label: "Monthly on last day",
    value: "last-day",
  },
  {
    label: "Monthly on the last friday",
    value: "last-friday",
  },
];
const repeatOnEveryTypeOptions = [
  {
    id: 1,
    value: "day",
    label: "Day",
    isDisabled: false,
  },
  {
    id: 2,
    value: "week",
    label: "Week",
    isDisabled: false,
  },
  {
    id: 3,
    value: "month",
    label: "Month",
    isDisabled: false,
  },
  {
    id: 4,
    value: "quater",
    label: "Quarter",
    isDisabled: false,
  },
  {
    id: 5,
    value: "half_year",
    label: "Half-Year",
    isDisabled: false,
  },
  {
    id: 6,
    value: "year",
    label: "Year",
    isDisabled: false,
  },
];

const repeatOnHolidayOptions = [
  {
    value: "Yes",
    label: "Display on Holiday",
  },
  {
    value: "Before",
    label: "Display before Holiday",
  },
  {
    value: "After",
    label: "Display after Holiday",
  },
  {
    value: "No",
    label: "Do not display",
  },
];

const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  control: (provided, state) => ({
    ...provided,
    boxShadow: "none",
    border: "2px solid #e2e2e2",
    borderRadius: "6px",
    "&:hover, &:focus": {
      border: "2px solid #7a73ff",
    },
    ...(state.isFocused && { border: "2px solid #7a73ff" }),
  }),
};
const frequencyMappingToRepeatOnEveryType = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
  year: "Yearly",
};

let frequencyOptions = [
  {
    id: 1,
    value: "None",
    label: "None",
    isDisabled: false,
  },
  {
    id: 2,
    value: "Daily",
    label: "Daily",
    isDisabled: false,
  },
  {
    id: 3,
    label: "Weekly on ",
    value: "Weekly",
    isDisabled: false,
    appendDayName: true,
  },
  {
    id: 4,
    label: "Monthly on the last ",
    value: "Monthly",
    isDisabled: false,
    appendDayName: true,
  },
  {
    id: 5,
    label: "Annually on ",
    value: "Yearly",
    isDisabled: false,
    appendDate: true,
  },
  {
    id: 6,
    label: "Custom",
    value: "Custom",
    isDisabled: false,
  },
];
const createTaskActions = {
  description: "Description",
  attachFile: "Attach File",
  impact: "Impact",
  regulatoryRef: "Regulatory Reference",
};
function NewTaskModel({
  showTask,
  onClose,
  editData,
  isEdit,
  isCreateTemplate = false,
  onCreateTemplate = () => {},
}) {
  const [fileList, setFileList] = useState([]);
  const [frequencyList, setFrequencyList] = useState(frequencyOptions);
  const [fieldInputs, setFieldInputs] = useState({
    ...initialState,
    ...editData,
  });
  const [isShowEditOptions, setIsShowEditOptions] = useState(false);
  const [isShowEditOptionsForTemplate, setIsShowEditOptionsForTemplate] =
    useState(false);
  const [isShowDeleteOptions, setIsShowDeleteOptions] = useState(false);
  const [fieldBackup, setFieldBackup] = useState(editData || initialState);
  const [isValidateEmail, setIsValidateEmail] = useState(false);
  const [isValidateEmailCC, setIsValidateEmailCC] = useState(false);
  const [isValidateEmailApprover, setIsValidateEmailApprover] = useState(false);
  const [selectionType, setSelectionType] = useState(
    createTaskActions.description
  );
  const [repeatOnEveryTypeList, setRepeatOnEveryTypeList] = useState(
    repeatOnEveryTypeOptions
  );
  const [updates, setUpdates] = useState([]);
  const [createActions, setCreateActions] = useState(createTaskActions);
  const [editSelectionType, setEditSelectionType] = useState("");
  const [deadlineValidation, setDeadlineValidation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyExistingEmails, setAlreadyExistingEmails] = useState([]);
  // const [frequencyModals, setFrequencyModals] = useState(false);
  // const [notifyMe, setNotifyMe] = useState(false);
  const [endTimeValidation, setEndTimeValidation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    isValidate: true,
    start_date: "",
    end_date: "",
    subject: "",
    emailErr: "",
  });
  const { isTaskManagementUser } = useGetUserRoles();
  const isAssignToUpdated =
    isEdit && fieldInputs?.assign_to !== fieldBackup?.assign_to;
  const isTaskUpdated =
    isEdit &&
    (!isEqual(fieldInputs, fieldBackup) ||
      fileList?.length > 0 ||
      isAssignToUpdated);

  const dateValidations = useSelector(
    (state) =>
      state?.ProjectManagementReducer?.modalsStatus?.taskModal?.dateValidations
  );
  const userDetail = useAccount();
  const dispatch = useDispatch();

  // to change the frequency
  const FrequencyChange = (event) => {
    if (event) {
      // get the type for repeat on every
      const repeatOnEveryType = Object.keys(
        frequencyMappingToRepeatOnEveryType
      ).find((key) => frequencyMappingToRepeatOnEveryType[key] === event.value);
      setFieldInputs({
        ...fieldInputs,
        frequency: event,
        ...(repeatOnEveryType && {
          repeat_on_every: {
            ...fieldInputs.repeat_on_every,
            count: 1,
            type: repeatOnEveryType,
            // set calculated day from selected frequency
            ...(repeatOnEveryType === "month" && {
              repeatOnMonth: event?.calculatedDay || null,
              repeatOnWeek: "",
            }),
            ...(repeatOnEveryType === "week" && {
              repeatOnWeek: event?.calculatedDay || null,
              repeatOnMonth: "",
            }),
            ...(repeatOnEveryType !== "month" &&
              repeatOnEveryType !== "week" && {
                repeatOnWeek: "",
                repeatOnMonth: "",
              }),
          },
        }),
      });
    } else {
      setFieldInputs({
        ...fieldInputs,
        frequency: { value: "", label: "" },
      });
    }
  };
  // close action tab - Description, Attach File, Impact, Regulatory References
  const handleActionTabClose = useCallback(() => {
    setEditSelectionType("");
  }, [editSelectionType, selectionType]);

  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data || {}
  );

  const calanderimg = <img src={calanderIcon} alt="calander" />;
  const usersList = useSelector(
    (state) => state?.ProjectManagementReducer?.usersList
  );

  const usersListForAssignTo = filterUsersListFor(
    "assign_to",
    usersList,
    fieldInputs.assign_to,
    fieldInputs.approver,
    fieldInputs.cc
  );
  const usersListForApprover = filterUsersListFor(
    "approver",
    usersList,
    fieldInputs.assign_to,
    fieldInputs.approver,
    fieldInputs.cc
  );
  const usersListForCC = filterUsersListFor(
    "cc",
    usersList,
    fieldInputs.assign_to,
    fieldInputs.approver,
    fieldInputs.cc,
    userDetail.email,
    currentOpenedTask,
    isEdit
  );

  // handle submit
  const onSubmit = async () => {
    setIsLoading(true);

    let formData = new FormData();
    const allInputs = Object.keys(fieldInputs);
    fileList.forEach((file) => {
      formData.append("file_details", file);
    });
    if (isEdit) formData.append("isEdit", isAssignToUpdated);
    if (!isEdit) formData.append("isEdit", true);
    allInputs.forEach((key) => {
      if (key !== "file_details") {
        if (typeof fieldInputs[key] === "object") {
          if (key === "impact") {
            formData.append(
              key,
              fieldInputs[key]?.length > 0 ? fieldInputs[key][0].reference : ""
            );
          } else if (key === "impactFileDetails") {
            fieldInputs[key]
              .filter((item) => !item?.file_id)
              .forEach((file) => {
                formData.append("impact_file_details", file);
              });
          } else if (key === "frequency") {
            formData.append("frequency", fieldInputs[key]?.value);
          } else if (key === "circulars" && fieldInputs[key]?.length > 0) {
            const _circulars = [...fieldInputs?.circulars].map(
              (item) => item.name
            );
            formData.append(key, JSON.stringify(_circulars));
          } else if (key === "riskRating") {
            if (fieldInputs[key]?.value) {
              formData.append(key, fieldInputs[key]?.value);
            }
          } else {
            formData.append(
              key,
              fieldInputs[key] ? JSON.stringify(fieldInputs[key]) : ""
            );
          }
        } else if (key === "frequency" && fieldInputs[key]?.value === "None") {
          formData.append(key, "None");
        } else {
          formData.append(key, fieldInputs[key] ? fieldInputs[key] : "");
        }
      }
    });
    if (isCreateTemplate) {
      try {
        const { data, status } = await axiosInstance.post(
          "compliance.api.CreateTaskTemplteEntry",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (status === 200 && data?.message?.status) {
          setIsLoading(false);
          const task_template = data?.message?.task_template;
          onCreateTemplate({
            template_id: task_template,
            subject: fieldInputs.subject,
            createId: fieldInputs.createId,
          });
          setFieldErrors({});
          setFieldInputs({});
          setFileList([]);
          setAlreadyExistingEmails([]);
          setIsLoading(false);
          setEndTimeValidation(false);
        } else {
          toast.error(data?.message?.status_response);
          setIsLoading(false);
        }
      } catch (error) {
        toast.error("Error on Template creation");
        setIsLoading(false);
        console.log(error);
      }
    } else {
      dispatch(addAndUpdateTaskRequest({ formData }));
      setFieldErrors({});
      setFieldInputs({});
      setFileList([]);
      setAlreadyExistingEmails([]);
      setIsLoading(false);
      setEndTimeValidation(false);
      if (!isCreateTemplate) onClose();
    }
  };

  const onRemoveFile = async (file_id, file_name) => {
    let tempFilesDetails = [...(fieldInputs?.file_details || [])];
    let tempFileList = [...fileList];

    if (file_name && file_id) {
      tempFilesDetails = [...(tempFilesDetails || [])].filter(
        (element) => element.file_id !== file_id
      );
      try {
        await auditApis.deleteFile(file_id);
        setFieldInputs({
          ...fieldInputs,
          file_details: [...tempFilesDetails],
        });
      } catch (error) {}
    } else if (file_name && !file_id) {
      tempFileList = [...(tempFileList || [])].filter(
        (file) => file.name !== file_name
      );
      setFileList([...tempFileList]);
    }
  };
  const onRemoveFileFromImpact = async (file_id, file_name) => {
    let tempFilesDetails = [...(fieldInputs?.impactFileDetails || [])];
    // let tempFileList = [...fileList];

    if (file_name && file_id) {
      tempFilesDetails = [...(tempFilesDetails || [])].filter(
        (element) => element.file_id !== file_id
      );
      try {
        await auditApis.deleteFile(file_id);
        setFieldInputs({
          ...fieldInputs,
          impactFileDetails: [...tempFilesDetails],
        });
      } catch (error) {}
    } else if (file_name && !file_id) {
      tempFilesDetails = [...(tempFilesDetails || [])].filter(
        (file) => file.name !== file_name
      );
      // setFileList([...tempFileList]);
      setFieldInputs({
        ...fieldInputs,
        impactFileDetails: [...tempFilesDetails],
      });
    }
  };

  const checkEmailAvailability = async (email, type) => {
    // validateFormFields();
    try {
      const { data, status } = await axiosInstance.post(
        "compliance.api.avabilityCheck",
        { email }
      );
      if (status === 200 && data.message.status) {
        if (type === "assign") {
          setIsValidateEmail(true);
        }
        if (type === "cc") {
          setIsValidateEmailCC(true);
        }
        if (type === "approver") {
          setIsValidateEmailApprover(true);
        }
        if (!alreadyExistingEmails.includes(email)) {
          setAlreadyExistingEmails([...alreadyExistingEmails, email]);
        }
      } else {
        type === "assign" && setIsValidateEmail(false);
        type === "cc" && setIsValidateEmailCC(false);
        type === "approver" && setIsValidateEmailApprover(false);
        if (alreadyExistingEmails.includes(email)) {
          setAlreadyExistingEmails(
            [...alreadyExistingEmails].filter((item) => item !== email)
          );
        }
      }
    } catch (error) {
      if (type === "assign") setIsValidateEmail(true);
      if (type === "cc") setIsValidateEmailCC(true);
      if (type === "approver") setIsValidateEmailApprover(true);
      if (!alreadyExistingEmails.includes(email)) {
        setAlreadyExistingEmails([...alreadyExistingEmails, email]);
      }
    }
  };

  // function to change dropdownvalue
  const handleDropDownChange = (val, type, isMulti = true) => {
    if (!isEdit && isMulti) {
      const arr2 = [];
      let count = 0;
      let alreadyExistingCount = 0;
      if (val && val?.length > 0) {
        val?.forEach((label) => {
          arr2.push(label.value);
        });
      }
      arr2.forEach((item) => {
        if (!validator.isEmail(item)) {
          count++;
        }
        if (alreadyExistingEmails.includes(item)) {
          alreadyExistingCount++;
        }
      });
      setFieldErrors({
        ...fieldErrors,
        emailErr:
          count > 0
            ? "Please enter valid email"
            : alreadyExistingCount > 0
            ? "Email already exists"
            : "",
      });
      setIsValidateEmail(count > 0 || alreadyExistingCount > 0);
      setFieldInputs({
        ...fieldInputs,
        [type]: arr2 || "",
      });
    } else if (isEdit || !isMulti) {
      setFieldInputs({ ...fieldInputs, [type]: val?.value || null });
      setIsValidateEmailCC(false);
      setIsValidateEmailApprover(false);
    }
  };

  const validateFormFields = () => {
    const {
      start_date,
      end_date,
      subject,
      project_id,
      frequency,
      assign_to,
      internal_license_tag,
      repeat_on_every,
    } = fieldInputs;
    setFieldErrors({
      ...fieldErrors,
      isValidate:
        (subject === "" && isEdit) ||
        frequency?.value === "" ||
        !frequency?.value ||
        subject === "" ||
        subject === " " ||
        start_date === "" ||
        end_date === "" ||
        internal_license_tag === " " ||
        deadlineValidation !== "" ||
        (repeat_on_every?.type === "week" && !repeat_on_every.repeatOnWeek) ||
        (frequency?.value === "Custom" &&
          (!repeat_on_every?.type || !parseInt(repeat_on_every?.count || 0))) ||
        (start_date &&
          end_date &&
          isAfter(dateValidations?.end_date || end_date, start_date)) ||
        (!isCreateTemplate &&
          ((isEdit && assign_to?.length === 0) ||
            !assign_to ||
            assign_to?.length === 0)) ||
        isValidateEmail ||
        isValidateEmailApprover ||
        isValidateEmailCC ||
        endTimeValidation,
      start_date:
        start_date && start_date !== "" && !isEdit
          ? isBeforeToday(start_date)
            ? "Start date should not be prior to today date."
            : project_id &&
              (isBefore(dateValidations?.start_date, start_date) ||
                isAfter(dateValidations?.end_date, start_date))
            ? "Start Date should be between " +
              getProjectDateFormat(dateValidations?.start_date) +
              " to " +
              getProjectDateFormat(dateValidations?.end_date)
            : end_date !== "" && isAfter(end_date, start_date)
            ? "Start date should not be later to end date"
            : ""
          : "",
      end_date:
        end_date !== "" && !isEdit
          ? isBeforeToday(end_date)
            ? "End date should not be prior to today date."
            : project_id &&
              (isAfter(dateValidations?.end_date, end_date) ||
                isBefore(dateValidations?.start_date, end_date))
            ? "End Date should be between " +
              getProjectDateFormat(dateValidations?.start_date) +
              " to " +
              getProjectDateFormat(dateValidations?.end_date)
            : start_date !== "" && isBefore(start_date, end_date)
            ? "End date should not be prior to start date"
            : ""
          : "",
      emailErr: isValidateEmail ? "Email already exists" : "",
      emailErrCC: isValidateEmailCC ? "Email already exists" : "",
      emailErrApprover: isValidateEmailApprover ? "Email already exists" : "",
      // end_time:
    });
  };

  // const notifyUpdate = (payload) => {
  //   setFieldInputs({
  //     ...fieldInputs,
  //     notify_on: [payload],
  //   });
  //   setNotifyMe(false);
  // };

  // Calculate internal deadline date from end_date
  const getInternalDate = (event, days) => {
    const value =
      event?.target?.value || (days !== null && days !== undefined ? days : "");
    if (value >= 0 && value <= 31) {
      let { start_date, end_date: endDate } = fieldInputs;
      if (start_date === "") {
        toast.error("Please enter start date");
      } else if (endDate === "") {
        toast.error("Please enter due date");
      } else {
        const end_date = moment(endDate, "YYYY-MM-DD");
        let newDate = moment(endDate, "YYYY-MM-DD");
        newDate.subtract(value || 0, "days");
        start_date = moment(start_date, "YYYY-MM-DD");
        const diff = end_date?.diff(start_date, "days");

        if (start_date !== end_date && diff >= 0 && diff < value) {
          setDeadlineValidation(
            `Internal deadline can't be greater than ${diff} ${
              diff ? "day" + (diff > 1 ? "s" : "") : ""
            }`
          );
          setFieldInputs({
            ...fieldInputs,
            internal_deadline_day: value,
            internal_deadline_date: null,
          });
        } else if (start_date === end_date) {
          setDeadlineValidation("");
          setFieldInputs({
            ...fieldInputs,
            internal_deadline_day: 0,
            internal_deadline_date: start_date,
          });
        } else {
          setDeadlineValidation("");
          setFieldInputs({
            ...fieldInputs,
            internal_deadline_day: value,
            internal_deadline_date: newDate.format("YYYY-MM-DD"),
          });
        }
      }
    } else {
      setFieldInputs({
        ...fieldInputs,
        internal_deadline_day: 0,
        internal_deadline_date: null,
      });
    }
  };

  const setRiskRating = (event) => {
    setFieldInputs({
      ...fieldInputs,
      riskRating: event,
    });
  };

  useEffect(() => {
    setFieldInputs({
      ...initialState,
      ...editData,
    });
    setFieldBackup({
      ...initialState,
      ...editData,
    });
  }, [editData]);
  useEffect(() => {
    if (
      // fieldInputs.internal_deadline_day !== 0 &&
      !fieldInputs.internal_deadline_day &&
      // fieldInputs.internal_deadline_day !== undefined &&
      fieldInputs?.end_date &&
      fieldInputs?.start_date
    )
      getInternalDate(null, 0);
    else if (
      fieldInputs.internal_deadline_day &&
      fieldInputs?.end_date &&
      fieldInputs?.start_date
    )
      getInternalDate(null, fieldInputs.internal_deadline_day);
  }, [fieldInputs.end_date, fieldInputs.start_date]);

  useEffect(() => {
    validateFormFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fieldInputs?.end_date,
    fieldInputs?.start_date,
    fieldInputs?.subject,
    fieldInputs?.frequency,
    // fieldInputs?.repeat_on_day,
    // fieldInputs?.weekly_repeat_day,
    fieldInputs?.assign_to,
    fieldInputs?.internal_license_tag,
    fieldInputs?.approver,
    fieldInputs?.repeat_on_every,
    endTimeValidation,
    deadlineValidation,
    isValidateEmail,
    isValidateEmailApprover,
    isValidateEmailCC,
  ]);

  useEffect(() => {
    const isUpdateLabel = Boolean(fieldInputs.end_date);
    const isDisableFrequency = Boolean(
      isEdit &&
        editData?.frequency?.value &&
        editData?.frequency?.value !== frequencyOptions[0].value
    );
    if (isUpdateLabel || isDisableFrequency) {
      let date = "",
        dayName = "",
        dateString = "",
        currentFrequency = null;
      if (isUpdateLabel) {
        date = moment(fieldInputs.end_date);
        dayName = date.format("dddd");
        dateString = date.format("MMMM DD");
      }
      if (isDisableFrequency) {
        currentFrequency = frequencyList.find(
          (item) => item.value === editData.frequency.value
        );
      }

      const _tempFrequencyList = frequencyOptions.map((item) => {
        return {
          ...item,
          ...((item?.appendDayName || item?.appendDate) &&
            isUpdateLabel && {
              label: item.label + (item.appendDayName ? dayName : dateString),
              ...(item.value === "Monthly"
                ? {
                    calculatedDay: "last-" + dayName?.toLowerCase(),
                  }
                : {
                    calculatedDay: item.appendDayName ? dayName : dateString,
                  }),
            }),
          ...(isDisableFrequency &&
            currentFrequency && {
              isDisabled: item?.id >= currentFrequency?.id ? false : true,
            }),
        };
      });
      setFrequencyList(_tempFrequencyList);
    }
  }, [fieldInputs.end_date, editData?.frequency?.value, isEdit]);
  useEffect(() => {
    setCreateActions({
      description: "Description",
      attachFile: "Attach File",
      impact: "Impact",
      ...(!isTaskManagementUser && { regulatoryRef: "Regulatory Reference" }),
    });
  }, [isTaskManagementUser]);

  useEffect(() => {
    const repeatOnEveryType = editData?.repeat_on_every?.type;
    const selectedRepeatOnEveryType = repeatOnEveryType
      ? repeatOnEveryTypeOptions.find(
          (item) => item.value === repeatOnEveryType
        )
      : null;
    if (
      isEdit &&
      fieldInputs.frequency?.value === "Custom" &&
      repeatOnEveryType &&
      selectedRepeatOnEveryType
    ) {
      setRepeatOnEveryTypeList((prevList) =>
        prevList.map((item) => ({
          ...item,
          isDisabled: item.id < selectedRepeatOnEveryType.id,
        }))
      );
    }
  }, [fieldInputs.frequency, isEdit, editData?.repeat_on_every?.type]);

  return !showTask ? null : (
    <>
      <div className="add-edit-modal">
        <BackDrop isLoading={isLoading} />

        <TaskEditDeleteOptionsModal
          isShowChooseDeleteOptions={isShowDeleteOptions}
          isShowChooseEditOptions={isShowEditOptions}
          setFieldInputs={setFieldInputs}
          handleSave={onSubmit}
          handleClose={() => {
            setIsShowEditOptions(false);
            setIsShowDeleteOptions(false);
          }}
        />
        {isShowEditOptionsForTemplate && (
          <TemplateEditOptionsModal
            handleClose={() => setIsShowEditOptionsForTemplate(false)}
            handleSave={onSubmit}
            isShowChooseEditOptions={isShowEditOptionsForTemplate}
            setFieldInputs={setFieldInputs}
            fieldBackup={fieldBackup}
          />
        )}
        {/* <DailyModal
          open={frequencyModals}
          setOpen={setFrequencyModals}
          frequency={fieldInputs.frequency}
          setFieldInputs={setFieldInputs}
          fieldInputs={fieldInputs}
        /> */}
        {/* <NotifyModal
          notifyMe={notifyMe}
          setNotifyMe={setNotifyMe}
          notifyUpdate={notifyUpdate}
          notifyOn={fieldInputs.notifyOn}
          fieldInputs={fieldInputs}
        /> */}
        <DescriptionTab
          visible={editSelectionType === createTaskActions.description}
          setFieldsInputs={setFieldInputs}
          fieldInputs={fieldInputs}
          onClose={handleActionTabClose}
        />
        <AttachementTab
          visible={editSelectionType === createTaskActions.attachFile}
          fieldInputs={fieldInputs}
          setFileList={setFileList}
          fileList={fileList}
          onClose={handleActionTabClose}
        />
        <ImpactTab
          visible={editSelectionType === createTaskActions.impact}
          fieldInputs={fieldInputs}
          setFieldInputs={setFieldInputs}
          onClose={handleActionTabClose}
        />
        <RegulatoryRefTab
          visible={editSelectionType === createTaskActions.regulatoryRef}
          onClose={handleActionTabClose}
          fieldInputs={fieldInputs}
          setFieldInputs={setFieldInputs}
          updates={updates}
          setUpdates={setUpdates}
          isSelected={createTaskActions.regulatoryRef === selectionType}
        />
        <div
          className="add-edit-project-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="add-edit-main-container position-relative"
            id="formMain"
          >
            <input
              type="text"
              id="firstField"
              autoFocus
              required
              maxLength={100}
              className="modal-input"
              name="project_name"
              value={fieldInputs?.subject}
              onChange={(e) => {
                setFieldInputs({
                  ...fieldInputs,
                  subject: removeWhiteSpaces(e.target.value),
                });
              }}
              placeholder="Task Name*"
            />
            <div className="row mt-3">
              <div className="col-md-4 col-lg-4 col-sm-4">
                <DatePicker
                  disabled={isEdit}
                  placeholder="Start Date*"
                  className="modal-input"
                  name="start_date"
                  format="DD MMMM Y"
                  disabledDate={(current) => {
                    let customDate = moment().format("YYYY-MM-DD");
                    return (
                      current && current < moment(customDate, "YYYY-MM-DD")
                    );
                  }}
                  suffixIcon={calanderimg}
                  value={
                    (fieldInputs?.start_date &&
                      moment(fieldInputs?.start_date, "YYYY-MM-DD")) ||
                    null
                  }
                  onChange={(value) => {
                    const start_date = value?.format("YYYY-MM-DD") || "";
                    setFieldInputs({
                      ...fieldInputs,
                      start_date,
                      frequency_end_date: null,
                    });
                    if (fieldInputs?.end_time)
                      setEndTimeValidation(
                        !isValidEndTime(
                          start_date,
                          fieldInputs?.end_date,
                          fieldInputs?.end_time
                        )
                      );
                  }}
                />
                {fieldErrors?.start_date !== "" && (
                  <p className="add-project-err-msg">
                    <MdError />
                    &nbsp;
                    {fieldErrors?.start_date}
                  </p>
                )}
              </div>
              <div className="col-md-4 col-lg-4 col-sm-4">
                <DatePicker
                  // disabled={isEdit}
                  placeholder="Due Date*"
                  className="modal-input"
                  suffixIcon={calanderimg}
                  format="DD MMMM Y"
                  disabledDate={(current) => {
                    let customDate = editData?.end_date
                      ? editData?.end_date
                      : moment().format("YYYY-MM-DD");
                    return (
                      current && current < moment(customDate, "YYYY-MM-DD")
                    );
                  }}
                  value={
                    (fieldInputs?.end_date &&
                      moment(fieldInputs?.end_date, "YYYY-MM-DD")) ||
                    null
                  }
                  onChange={(value) => {
                    const end_date = value?.format("YYYY-MM-DD") || "";
                    setFieldInputs({
                      ...fieldInputs,
                      end_date,
                    });
                    if (fieldInputs?.end_time)
                      setEndTimeValidation(
                        !isValidEndTime(
                          fieldInputs?.start_date,
                          end_date,
                          fieldInputs?.end_time
                        )
                      );
                  }}
                />
                {fieldErrors?.end_date !== "" && (
                  <p className="add-project-err-msg">
                    <MdError />
                    &nbsp;
                    {fieldErrors?.end_date}
                  </p>
                )}
              </div>

              <div className="col-md-4 col-lg-4 col-sm-4">
                <TimePicker
                  disabled={isEdit}
                  className="modal-input"
                  placeholder="End Time"
                  value={
                    fieldInputs.end_time
                      ? moment(fieldInputs.end_time, "hh:mm A")
                      : null
                  }
                  use12Hours
                  format="hh:mm A"
                  // disabledTime={() => {
                  //   const startDate = fieldInputs?.start_date
                  //     ? moment(fieldInputs.start_date, "YYYY-MM-DD")
                  //     : null;
                  //   const endDate = fieldInputs?.end_date
                  //     ? moment(fieldInputs.end_date, "YYYY-MM-DD")
                  //     : null;
                  //   const today = moment().format("YYYY-MM-DD");
                  //   return {
                  //     ...(startDate?.isSame(today) &&
                  //       endDate?.isSame(today) && {
                  //         disabledHours: disabledHoursInEventEndTime,
                  //         disabledMinutes: disabledMinutesInEventEndTime,
                  //       }),
                  //   };
                  // }}
                  // hideDisabledOptions
                  onChange={(time, timeString) => {
                    setFieldInputs({
                      ...fieldInputs,
                      end_time: timeString || null,
                    });
                    setEndTimeValidation(
                      timeString
                        ? !isValidEndTime(
                            fieldInputs?.start_date,
                            fieldInputs?.end_date,
                            timeString || null
                          )
                        : false
                    );
                    // const hour = time.format("H");
                    // const minute = time.format("mm");
                    // console.log({ hour, minute });
                    // const startDay = new Date(
                    //   moment(fieldInputs?.start_date, "YYYY-MM-DD")
                    // ).getDate();
                    // const endDay = new Date(
                    //   moment(fieldInputs?.end_date, "YYYY-MM-DD")
                    // ).getDate();
                    // if (startDay === endDay) {
                    //   const selectedTime = parseInt(
                    //     moment(timeString, ["h:mm A"]).format("HH")
                    //   );
                    //   const currentTime = parseInt(new Date().getHours());
                    //   if (selectedTime < currentTime) {
                    //     setFieldInputs({
                    //       ...fieldInputs,
                    //       end_time: null,
                    //     });
                    //     setEndTimeValidation(true);
                    //   } else {
                    //     setFieldInputs({
                    //       ...fieldInputs,
                    //       end_time: timeString || null,
                    //     });
                    //     setEndTimeValidation(false);
                    //   }
                    // } else {
                    //   setFieldInputs({
                    //     ...fieldInputs,
                    //     end_time: timeString || null,
                    //   });
                    //   setEndTimeValidation(false);
                    // }
                  }}
                />
                {endTimeValidation && (
                  <p className="add-project-err-msg">
                    <MdError />
                    &nbsp;End Time must be after or equal to current time.
                  </p>
                )}
              </div>
            </div>

            {/* <div className="row">
              <div className="col">
                <label className="add-edit-project-labels mt-3">
                  Frequency *
                </label>
                <div className="add-new-task-radio-btn pl-0 d-flex align-items-center justify-content-center">
                  <RadioGroup
                    row
                    aria-label="frequency"
                    name="row-radio-buttons-group"
                    value={fieldInputs?.frequency || "None"}
                    onClick={FrequencyChange}
                  >
                    {frequencyList.map((item) => {
                      const isDisabled =
                        isEdit &&
                        item.id <
                          frequencyList.find(
                            (el) => el.value === editData?.frequency
                          )?.id;

                      return (
                        <FormControlLabel
                          disabled={isDisabled}
                          value={item.value}
                          control={<Radio />}
                          label={item.value}
                        />
                      );
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div> */}

            <div className="row mt-4">
              <div className="col-sm-4 col-lg-4 col-md-4 d-flex justify-content-start">
                <Select
                  isMulti={false}
                  placeholder="Frequency*"
                  isDisabled={!fieldInputs.end_date}
                  styles={customStyles}
                  isClearable={true}
                  options={frequencyList}
                  onChange={FrequencyChange}
                  value={
                    (fieldInputs?.frequency?.label && fieldInputs.frequency) ||
                    null
                  }
                />
              </div>
              <div className="col-sm-8 col-lg-8 col-md-8">
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <label className="mb-0 d-block">
                    Internal Deadline&nbsp;
                    <span className="text-danger">
                      (No of days before due date)
                    </span>
                  </label>
                  <div>
                    <input
                      className="modal-input modal-input--small"
                      onChange={(event) => getInternalDate(event)}
                      value={fieldInputs?.internal_deadline_day}
                      type="number"
                      style={{
                        background: `${
                          fieldInputs.start_date === "" ||
                          fieldInputs.end_date === ""
                            ? "whitesmoke"
                            : ""
                        }`,
                      }}
                      disabled={
                        fieldInputs.start_date === "" ||
                        fieldInputs.end_date === "" ||
                        isEdit
                      }
                    />
                  </div>
                  <div style={{ width: 140 }}>
                    <DatePicker
                      disabled={true}
                      format="DD MMMM Y"
                      className="modal-input"
                      placeholder="Internal Deadline"
                      value={
                        fieldInputs.internal_deadline_date
                          ? moment(
                              fieldInputs.internal_deadline_date,
                              "YYYY-MM-DD"
                            )
                          : null
                      }
                    />
                  </div>
                </div>
                {deadlineValidation !== "" && (
                  <p className="add-project-err-msg">
                    <MdError />
                    &nbsp;{deadlineValidation}
                  </p>
                )}
              </div>
              {/* {false && (
                <div className="col-sm-6 col-lg-6 col-md-6 d-flex align-items-center">
                  <label>
                    Notify me <br />
                    (before deadline of)
                  </label>
                  <div className="d-flex">
                    {fieldInputs?.notify_on?.length > 0 ? (
                      <button
                        className="add-edit-project-notify-active-btn ml-2"
                        onClick={() => setNotifyMe(true)}
                      >
                        {
                          fieldInputs.notify_on[
                            fieldInputs.notify_on.length - 1
                          ].time
                        }{" "}
                        {
                          fieldInputs.notify_on[
                            fieldInputs.notify_on.length - 1
                          ].frequency
                        }{" "}
                        before
                      </button>
                    ) : (
                      <button
                        className="add-edit-project-notify-btn ml-2"
                        onClick={() => setNotifyMe(true)}
                        disabled={
                          !fieldInputs.start_date ||
                          !fieldInputs.end_date ||
                          !fieldInputs.internal_deadline_date
                        }
                      >
                        Notify me on
                      </button>
                    )}
                  </div>
                </div>
              )} */}
            </div>
            {/* Custom Frequency Options and Inputs */}
            {fieldInputs?.frequency?.value === "Custom" && (
              <>
                <div className="row mt-4 align-items-center">
                  <div className="col-4">
                    <label className="mb-0 required">Repeat on every</label>
                  </div>
                  <div className="col-1">
                    <input
                      type="number"
                      required
                      // maxLength={100}
                      className="modal-input modal-input--small"
                      name="repeat_on_every_day"
                      // value={fieldInputs?.repeat_on_every?.day}
                      value={fieldInputs?.repeat_on_every?.count}
                      onChange={(e) => {
                        setFieldInputs({
                          ...fieldInputs,
                          repeat_on_every: {
                            ...fieldInputs.repeat_on_every,
                            count: e.target.value,
                            // removeWhiteSpaces(e.target.value)
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <Select
                      isMulti={false}
                      styles={customStyles}
                      isClearable={true}
                      options={repeatOnEveryTypeList}
                      onChange={(option) => {
                        setFieldInputs({
                          ...fieldInputs,
                          repeat_on_every: {
                            ...fieldInputs.repeat_on_every,
                            type: option?.value || "",
                            // ...(option.value !== "month" && {
                            //   repeatOnMonth: null,
                            // }),
                          },
                        });
                      }}
                      value={
                        repeatOnEveryTypeOptions.find(
                          (item) =>
                            item.value === fieldInputs?.repeat_on_every?.type
                        ) || null
                      }
                    />
                  </div>
                </div>
                {fieldInputs?.repeat_on_every?.type === "month" && (
                  <div className="row mt-4 align-items-center">
                    <div className="col-4"></div>
                    <div className="col-4">
                      <Select
                        isMulti={false}
                        styles={customStyles}
                        isClearable={true}
                        options={repeatOnMonthOptions}
                        onChange={(option) => {
                          setFieldInputs({
                            ...fieldInputs,
                            repeat_on_every: {
                              ...fieldInputs?.repeat_on_every,
                              repeatOnMonth: option?.value || "",
                            },
                          });
                        }}
                        value={
                          repeatOnMonthOptions.find(
                            (item) =>
                              item.value ===
                              fieldInputs?.repeat_on_every?.repeatOnMonth
                          ) || null
                        }
                      />
                    </div>
                  </div>
                )}
                {fieldInputs?.repeat_on_every?.type === "week" && (
                  <div className="row mt-4 align-items-center">
                    <div className="col-4">Repeat on</div>
                    <div className="col-4 d-flex align-items-center justify-content-between">
                      {constant.weekDays.map((weekDay) => {
                        return (
                          <div
                            onClick={() =>
                              setFieldInputs({
                                ...fieldInputs,
                                repeat_on_every: {
                                  ...fieldInputs.repeat_on_every,
                                  repeatOnWeek: weekDay,
                                },
                              })
                            }
                            className={`initial-name__container cursor-pointer task-modal__week-day ${
                              fieldInputs?.repeat_on_every?.repeatOnWeek ===
                              weekDay
                                ? "task-modal__week-day--selected"
                                : ""
                            }`}
                          >
                            <span className="initial-name week-day__name">
                              {weekDay[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
            {fieldInputs?.frequency?.value &&
              fieldInputs?.frequency?.value !== "None" && (
                <>
                  {/* If due date is holiday input */}
                  <div className="row mt-4 align-items-center">
                    <div className="col-4">
                      <lable className="mb-0">If Due date is holiday</lable>
                    </div>

                    <div className="col-4">
                      <Select
                        isMulti={false}
                        styles={customStyles}
                        isClearable={true}
                        options={repeatOnHolidayOptions}
                        onChange={(option) =>
                          setFieldInputs({
                            ...fieldInputs,
                            repeat_on_holiday: option?.value || "",
                          })
                        }
                        value={
                          repeatOnHolidayOptions.find(
                            (item) =>
                              item.value === fieldInputs?.repeat_on_holiday
                          ) || null
                        }
                      />
                    </div>
                  </div>
                  {/* End Frequency input */}
                  <div className="row mt-4 align-items-center">
                    <div className="col-4">
                      <lable className="mb-0">End Frequency on</lable>
                    </div>

                    <div className="col-4">
                      <DatePicker
                        className="modal-input"
                        suffixIcon={calanderimg}
                        format="DD MMMM Y"
                        disabledDate={(current) => {
                          let customDate = moment().format("YYYY-MM-DD");
                          return (
                            current &&
                            current < moment(customDate, "YYYY-MM-DD")
                          );
                        }}
                        value={
                          (fieldInputs?.frequency_end_date &&
                            moment(
                              fieldInputs?.frequency_end_date,
                              "YYYY-MM-DD"
                            )) ||
                          null
                        }
                        onChange={(value) =>
                          setFieldInputs({
                            ...fieldInputs,
                            frequency_end_date:
                              value?.format("YYYY-MM-DD") || "",
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            {/* Assign Users - Assign To, Approver, CC */}
            {!isCreateTemplate && (
              <div className="row mt-4">
                <div className="col-sm-12 col-lg-4">
                  <CreatableSelect
                    isMulti={!isEdit}
                    onChange={(event) =>
                      handleDropDownChange(event, "assign_to", true)
                    }
                    placeholder="Assign To*"
                    styles={customStyles}
                    isClearable={true}
                    options={usersListForAssignTo}
                    isValidNewOption={(inputStr) => {
                      return (
                        validator.isEmail(inputStr) &&
                        !usersList.find((item) => item.value === inputStr)
                      );
                    }}
                    value={[
                      ...((fieldInputs.assign_to &&
                      typeof fieldInputs.assign_to === "string"
                        ? [fieldInputs.assign_to]
                        : fieldInputs.assign_to) || []),
                    ].map(
                      (item) =>
                        [...(usersListForAssignTo || [])].find(
                          (user) => user.value === item
                        ) || {
                          value: item,
                          label: item,
                        }
                    )}
                    onCreateOption={(inputValue) => {
                      if (validator.isEmail(inputValue)) {
                        checkEmailAvailability(inputValue, "assign");
                      }
                      setFieldInputs({
                        ...fieldInputs,
                        assign_to: !isEdit
                          ? [
                              ...((fieldInputs.assign_to &&
                              typeof fieldInputs.assign_to === "string"
                                ? [fieldInputs.assign_to]
                                : fieldInputs.assign_to) || []),
                              inputValue,
                            ]
                          : inputValue,
                      });
                    }}
                  />
                  {fieldErrors?.emailErr !== "" && (
                    <p className="add-project-err-msg">
                      &nbsp;
                      {fieldErrors?.emailErr}
                    </p>
                  )}
                </div>
                <div className="col-sm-12 col-lg-4">
                  <CreatableSelect
                    isMulti={false}
                    onChange={(event) =>
                      handleDropDownChange(event, "approver", false)
                    }
                    placeholder="Approver"
                    styles={customStyles}
                    isClearable={true}
                    options={usersListForApprover || []}
                    isValidNewOption={(inputStr) => {
                      return (
                        validator.isEmail(inputStr) &&
                        !usersList.find((item) => item.value === inputStr)
                      );
                    }}
                    value={[
                      ...((fieldInputs.approver &&
                      typeof fieldInputs.approver === "string"
                        ? [fieldInputs.approver]
                        : fieldInputs.approver) || []),
                    ].map(
                      (item) =>
                        [...(usersListForApprover || [])].find(
                          (user) => user.value === item
                        ) || {
                          value: item,
                          label: item,
                        }
                    )}
                    onCreateOption={(inputValue) => {
                      if (validator.isEmail(inputValue)) {
                        checkEmailAvailability(inputValue, "approver");
                      }
                      setFieldInputs({
                        ...fieldInputs,
                        // approver: !isEdit
                        //   ? [
                        //       ...((fieldInputs.approver &&
                        //       typeof fieldInputs.approver === "string"
                        //         ? [fieldInputs.approver]
                        //         : fieldInputs.approver) || []),
                        //       inputValue,
                        //     ]
                        //   : inputValue,
                        approver: inputValue,
                      });
                    }}
                  />
                  {fieldErrors?.emailErrApprover !== "" && (
                    <p className="add-project-err-msg">
                      &nbsp;
                      {fieldErrors?.emailErrApprover}
                    </p>
                  )}
                </div>
                <div className="col-sm-12 col-lg-4">
                  <CreatableSelect
                    isMulti={false}
                    placeholder="CC"
                    onChange={(event) => {
                      handleDropDownChange(event, "cc", false);
                    }}
                    styles={customStyles}
                    isClearable={true}
                    options={usersListForCC || []}
                    isValidNewOption={(inputStr) => {
                      return (
                        validator.isEmail(inputStr) &&
                        !usersList.find((item) => item.value === inputStr)
                      );
                    }}
                    value={[
                      ...((fieldInputs.cc && typeof fieldInputs.cc === "string"
                        ? [fieldInputs.cc]
                        : fieldInputs.cc) || []),
                    ].map(
                      (item) =>
                        [...(usersListForCC || [])].find(
                          (user) => user.value === item
                        ) || {
                          value: item,
                          label: item,
                        }
                    )}
                    onCreateOption={(inputValue) => {
                      if (validator.isEmail(inputValue)) {
                        checkEmailAvailability(inputValue, "cc");
                      }
                      setFieldInputs({
                        ...fieldInputs,
                        // cc: !isEdit
                        //   ? [
                        //       ...((fieldInputs.cc &&
                        //       typeof fieldInputs.cc === "string"
                        //         ? fieldInputs.cc
                        //         : fieldInputs.cc) || ""),
                        //       inputValue,
                        //     ]
                        //   : inputValue,
                        cc: inputValue,
                      });
                    }}
                  />
                  {fieldErrors?.emailErrCC !== "" && (
                    <p className="add-project-err-msg">
                      &nbsp;
                      {fieldErrors?.emailErrCC}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Description - Attachment - Impact - References */}
            <div className="row mt-4">
              <div className="col-sm-12 col-lg-4">
                <div style={{ width: 255 }}>
                  <Select
                    isMulti={false}
                    placeholder="Risk Rating"
                    styles={customStyles}
                    isClearable={true}
                    options={[
                      { value: "Low", label: "Low" },
                      { value: "Medium", label: "Medium" },
                      { value: "High", label: "High" },
                    ]}
                    onChange={(event) => {
                      setRiskRating(event);
                    }}
                    value={
                      (fieldInputs?.riskRating?.label &&
                        fieldInputs.riskRating) ||
                      null
                    }
                  />
                </div>
              </div>
              <div className="col-sm-12 col-lg-4">
                <input
                  type="text"
                  maxLength={10}
                  className="modal-input"
                  name="internal_license_tag"
                  value={fieldInputs?.internal_license_tag}
                  onChange={(e) => {
                    setFieldInputs({
                      ...fieldInputs,
                      internal_license_tag: removeWhiteSpaces(e.target.value),
                    });
                  }}
                  placeholder="Internal License Name"
                />
              </div>
            </div>
            {/* <div className="row">
              <div className="col-sm-12 col-lg-12 col-md-12">
                <div>
                  <label
                    className="mt-3 cursor-pointer"
                    style={{
                      color: `${selectionType === "description" ? "blue" : ""}`,
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectionType("description")}
                  >
                    Task description
                  </label>{" "}
                  <label
                    className="mt-3 ml-4 cursor-pointer"
                    style={{
                      color: `${selectionType === "attach" ? "blue" : ""}`,
                    }}
                    onClick={() => setSelectionType("attach")}
                  >
                    Attach files
                  </label>
                  <label
                    className="mt-3 ml-4 cursor-pointer"
                    style={{
                      color: `${selectionType === "impact" ? "blue" : ""}`,
                    }}
                    onClick={() => setSelectionType("impact")}
                  >
                    Impact
                  </label>
                  <label
                    className="mt-3 ml-4 cursor-pointer"
                    style={{
                      color: `${selectionType === "updates" ? "blue" : ""}`,
                    }}
                    onClick={() => setSelectionType("updates")}
                  >
                    Updates
                  </label>
                </div>

                {selectionType === "description" && (
                  <textarea
                    rows={5}
                    value={fieldInputs.description}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E2E2",
                      borderRadius: 10,
                      width: "100%",
                    }}
                    onChange={(event) =>
                      setFieldInputs({
                        ...fieldInputs,
                        description: event.target.value,
                      })
                    }
                  />
                )}
                {selectionType === "attach" && (
                  <div className="row">
                    <div className="col-3">
                      {" "}
                      <Dropzone
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
                          const validFiles = [...files].filter(
                            (uploadedFile) => {
                              const isFileAlreadyExist = [
                                ...fileList,
                                ...(fieldInputs?.file_details || []),
                              ].find(
                                (file) =>
                                  (file?.file_name || file?.name) ===
                                  uploadedFile.name
                              );
                              if (isFileAlreadyExist)
                                toast.error(
                                  `${uploadedFile.name} is already uploaded.`
                                );
                              return !isFileAlreadyExist;
                            }
                          );
                          setFileList((prevFiles) => [
                            ...prevFiles,
                            ...validFiles,
                          ]);
                        }}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div className={inputStyles.labelContainer}>
                                <label
                                  className={`${inputStyles.uploadFileLabel}  ${inputStyles["task-model"]} `}
                                >
                                  <MdFileUpload
                                    className={inputStyles.uploadIcon}
                                  />
                                  &nbsp;Upload
                                </label>
                              </div>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </div>
                    <div className="col-9">
                      {" "}
                      {[...fileList, ...(fieldInputs?.file_details || [])]
                        ?.length > 0 && (
                        <div className={`${inputStyles.fileContainer}`}>
                          {[...fileList, ...(fieldInputs?.file_details || [])]
                            .filter((file) => file)
                            .map((item, index) => {
                              return (
                                <FileDocumentDetails
                                  file={item}
                                  isShowUser={true}
                                  currentOpenedTask={currentOpenedTask}
                                  deleteUploadedFile={(index) => {
                                    onRemoveFile(
                                      item.file_id,
                                      item.name || item.file_name
                                    );
                                  }}
                                  hasWorkPermissionOnTask={
                                    hasWorkPermissionOnTask
                                  }
                                  height="21px"
                                  isShowDeleteButton={true}
                                  userDetail={userDetail}
                                  isTaskNotOpen={true}
                                />
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selectionType === "impact" && (
                  <TaskImpactTab
                    fieldInputs={fieldInputs}
                    setFieldInputs={setFieldInputs}
                  />
                )}
                {selectionType === "updates" && (
                  <TaskUpdatesTab
                    fieldInputs={fieldInputs}
                    setFieldInputs={setFieldInputs}
                  />
                )}
              </div>
            </div> */}

            <div className="project__actions d-flex align-items-center justify-content-between my-3">
              {Object.keys(createActions).map((key) => {
                const title = createTaskActions[key];
                return (
                  <button
                    onClick={() => {
                      setSelectionType(title);
                      if (
                        (title === createTaskActions.description &&
                          !fieldInputs.description) ||
                        (title === createTaskActions.attachFile &&
                          fileList?.length === 0 &&
                          fieldInputs.file_details?.length === 0) ||
                        (title === createTaskActions.impact &&
                          (!fieldInputs.impact ||
                            fieldInputs.impact?.length === 0) &&
                          !(fieldInputs.impactFileDetails?.length > 0)) ||
                        (title === createTaskActions.regulatoryRef &&
                          !(fieldInputs?.circulars?.length > 0))
                      ) {
                        setEditSelectionType(title);
                      }
                    }}
                    className={`project-management__button project-management__button--${
                      selectionType === title ? "primary" : "outlined"
                    }`}
                  >
                    {title}
                  </button>
                );
              })}
            </div>
            {/* Data for each action */}
            <div className="project__actions-details">
              {(selectionType === createTaskActions.description
                ? Boolean(fieldInputs.description)
                : selectionType === createTaskActions.attachFile
                ? fileList?.length > 0 || fieldInputs.file_details?.length > 0
                : selectionType === createTaskActions.impact
                ? typeof fieldInputs?.impact === "object"
                  ? fieldInputs?.impact?.length > 0 ||
                    fieldInputs.impactFileDetails?.length > 0
                  : Boolean(fieldInputs?.impact) ||
                    fieldInputs.impactFileDetails?.length > 0
                : selectionType === createTaskActions.regulatoryRef
                ? fieldInputs?.circulars?.length > 0
                : false) && (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <p className="project__information-text project__information-text--active">
                      {selectionType}:
                    </p>
                    <IconButton
                      size="small"
                      onClick={() => setEditSelectionType(selectionType)}
                    >
                      <MdEdit />
                    </IconButton>
                  </div>
                </>
              )}
              {selectionType === createTaskActions.description &&
                fieldInputs.description && (
                  <div className="project__information-container">
                    <p className="project__information-text">
                      {fieldInputs.description}
                    </p>
                  </div>
                )}
              {selectionType === createTaskActions.attachFile &&
                (fileList?.length > 0 ||
                  fieldInputs.file_details?.length > 0) && (
                  <div
                    className="d-flex align-items-center flex-wrap"
                    style={{ gap: ".5rem" }}
                  >
                    {[...fileList, ...(fieldInputs.file_details || [])]?.map(
                      (file, index) => {
                        return (
                          <FileDocumentDetailsBox
                            file={file}
                            key={`task-file-${
                              file.file_id || file.name || file.file_name
                            }`}
                            deleteUploadedFile={onRemoveFile}
                          />
                        );
                      }
                    )}
                  </div>
                )}
              {selectionType === createTaskActions.impact && (
                <>
                  {fieldInputs?.impact && (
                    <div
                      className="project__information-container"
                      dangerouslySetInnerHTML={{
                        __html: fieldInputs.impact,
                      }}
                    ></div>
                  )}
                  {fieldInputs?.impactFileDetails?.length > 0 && (
                    <div
                      className="d-flex align-items-center flex-wrap mt-2"
                      style={{ gap: ".5rem" }}
                    >
                      {fieldInputs.impactFileDetails?.map((file, index) => {
                        return (
                          <FileDocumentDetailsBox
                            file={file}
                            key={`task-impact-file-${
                              file.file_id ||
                              file.name ||
                              file.file_name ||
                              file.fileName
                            }`}
                            deleteUploadedFile={onRemoveFileFromImpact}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {selectionType === createTaskActions.regulatoryRef &&
                fieldInputs?.circulars?.length > 0 && (
                  <div className="project__information-container">
                    {
                      // [...updates]
                      //   .filter((item) =>
                      //     fieldInputs?.circulars?.includes(item?.name)
                      //   )
                      fieldInputs?.circulars?.map((item, index) => {
                        return (
                          <UpdatesListItem
                            index={index}
                            item={item}
                            isShowCheckboxInput={false}
                          />
                        );
                      })
                    }
                  </div>
                )}
            </div>

            {/* Save and Cancel button */}
            <div className="d-flex mt-3 justify-content-center">
              <div className="mr-2">
                {!isEdit ? (
                  <button
                    className="add-edit-project-submit-btn"
                    onClick={onSubmit}
                    disabled={
                      fieldErrors?.isValidate ||
                      isValidateEmail ||
                      (isEdit && !isTaskUpdated)
                    }
                    style={{
                      ...((fieldErrors?.isValidate ||
                        isValidateEmail ||
                        (isEdit && !isTaskUpdated)) && {
                        opacity: "0.7",
                      }),
                    }}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    className="add-edit-project-submit-btn"
                    onClick={() => {
                      if (isCreateTemplate) {
                        setIsShowEditOptionsForTemplate(true);
                      } else {
                        if (
                          isEdit &&
                          (editData?.frequency?.value === "None" ||
                            editData?.frequency === "None" ||
                            !editData?.frequency?.value)
                        ) {
                          onSubmit();
                        } else {
                          setIsShowEditOptions(true);
                        }
                      }
                    }}
                    disabled={fieldErrors?.isValidate || isValidateEmail}
                    style={{
                      ...((fieldErrors?.isValidate || isValidateEmail) && {
                        opacity: "0.7",
                      }),
                    }}
                  >
                    Update
                  </button>
                )}
              </div>
              <div className="">
                <button
                  className="add-edit-project-cancel-btn"
                  onClick={() => {
                    setFieldErrors({});
                    setFieldInputs({});
                    setFileList([]);
                    setAlreadyExistingEmails([]);
                    onClose(!isEdit && fieldInputs?.createId);
                    setEndTimeValidation(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewTaskModel;
