import React, { useCallback, useEffect, useState } from "react";
import "./style.css";
import { DatePicker, TimePicker } from "antd";
import calanderIcon from "../../../../assets/Icons/calanderIcon.svg";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getSubLicenseListForManager } from "../../api/index";
import CreateNewLicense from "../../pages/LicensePage/CreateNewLicense";
import moment from "moment";
import { MdEdit, MdError } from "react-icons/md";
import auditApis from "Components/Audit/api/index";
import CreatableSelect from "react-select/creatable";
import {
  getProjectDateFormat,
  isAfter,
  isBefore,
  isBeforeToday,
} from "Components/ProjectManagement/components/date.helpers";
import { toast } from "react-toastify";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { isEmpty, isEqual } from "lodash";
import { DailyModalForEvents } from "SharedComponents/FrequencyModals/FrequencyModal";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import { FileDocumentDetailsBox } from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/File";
import DescriptionTab from "CommonModules/sharedComponents/CreateTaskActionsTabs/DescriptionTab";
import { IconButton } from "@mui/material";
import AttachementTab from "CommonModules/sharedComponents/CreateTaskActionsTabs/AttachementTab";
import ImpactTab from "CommonModules/sharedComponents/CreateTaskActionsTabs/ImpactTab";
import RegulatoryRefTab from "CommonModules/sharedComponents/CreateTaskActionsTabs/RegulatoryRefTab";
import { UpdatesListItem } from "Components/Updates";
import axiosInstance from "apiServices";
import Button from "../../../Audit/components/Buttons/Button";
import {
  // disabledHoursInEventEndTime,
  // disabledMinutesInEventEndTime,
  isValidEndTime,
} from "CommonModules/helpers/Date.helper";
// import AddComment from "../CommentModal";
import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";
import { eventsModuleActions } from "Components/Events/redux/actions";
import RejectionCommentModal from "../AddCircular/RejectionCommentModal";
// import "Components/OnBoarding/SubModules/DashBoardCO/components/DashBoardView/component/AnalyticsList/table.scss";
const initialState = {
  activate_the_subtask: "",
  disable_repeat: 0,
  license_list: [],
  compliance_event_id: "",
  name_of_the_subtask: "",
  start_date: "",
  end_date: "",
  frequency: { value: "None", label: "None" },
  weekly_repeat_day: "",
  repeat_on_day: "",
  file_details: [],
  description: "",
  end_time: "",
  repeat_on_holiday: "",
  repeat_on_every: "",
  frequency_end_date: "",
  repeat_on_month: "",
  impact: "",
  impactFileDetails: [],
  circulars: [],
  deadline_days_after_the_start_date: null,
  extend_deadline_date: null,
  deadline_day_of_the_month: 1,
  due_date_before: null,
  riskRating: "Low",
};

const errorsInitialState = {
  isValidate: false,
  start_date: "",
  end_date: "",
  name_of_the_subtask: "",
};

const customStyles = {
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
    value: "Weekly",
    label: "Weekly",
    isDisabled: false,
  },
  {
    id: 4,
    value: "Monthly",
    label: "Monthly",
    isDisabled: false,
  },
  {
    id: 5,
    value: "Quarterly",
    label: "Quarterly",
    isDisabled: false,
  },
  {
    id: 6,
    value: "Half-yearly",
    label: "Half-yearly",
    isDisabled: false,
  },
  {
    id: 7,
    value: "Yearly",
    label: "Yearly",
    isDisabled: false,
  },
];
const createTaskActions = {
  description: "Description",
  attachFile: "Attach File",
  impact: "Impact",
  regulatoryRef: "Regulatory Reference",
};
const AddComplianceEvent = ({
  showTask,
  onClose,
  editData,
  isEdit = false,
  onSuccessEvent,
  isCreateEventForCircular = false,
  onEventCreated = () => {},
}) => {
  const [endTimeValidation, setEndTimeValidation] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [frequencyList, setFrequencyList] = useState(frequencyOptions);
  const [fieldInputs, setFieldInputs] = useState({
    ...initialState,
    ...(editData && Object.keys(editData).length && editData),
  });
  const [fieldBackup, setFieldBackup] = useState(editData || initialState);
  const [selectionType, setSelectionType] = useState(
    createTaskActions.description
  );
  const isRejectionCommentModalVisible = useSelector(
    (state) => state?.eventsModuleReducer?.rejectionCommentModal?.visible
  );
  const dispatch = useDispatch();
  const [licenseOptions, setLicenseOptions] = useState([]);
  const [addLicenseModalEditState, setAddLicenseModalEditState] = useState({
    isAddSubLicene: false,
    isAddParentLicense: true,
    isEdit: false,
    isEditChild: false,
    isRename: false,
    isShow: false,
    editData: {
      license_name: "",
    },
  });
  const { isCEApprover } = useGetUserRoles();
  const [updates, setUpdates] = useState([]);
  // const [isShowCommentModal, setIsShowCommentModal] = useState(false);
  const [editSelectionType, setEditSelectionType] = useState("");
  const [deadlineValidation, setDeadlineValidation] = useState("");
  const [latestLicenseActivationDate, setLatestLicenseActivationDate] =
    useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [frequencyModals, setFrequencyModals] = useState(false);
  // const [endTimeValidation, setEndTimeValidation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState(errorsInitialState);
  const isTaskUpdated =
    isEdit && (!isEqual(fieldInputs, fieldBackup) || fileList?.length > 0);

  const dateValidations = useSelector(
    (state) =>
      state?.ProjectManagementReducer?.modalsStatus?.taskModal?.dateValidations
  );

  const handleOpenAddLicense = (editData) => {
    setAddLicenseModalEditState((prev) => ({
      ...prev,
      isShow: true,
      editData,
    }));
  };
  // to change the frequency
  const FrequencyChange = (event) => {
    if (event) {
      setFieldInputs({
        ...fieldInputs,
        frequency: event,
        ...(fieldInputs?.frequency?.value !== event?.value && {
          weekly_repeat_day: "",
          repeat_on_day: "",
          repeat_on_holiday: "",
          repeat_on_every: "",
          frequency_end_date: "",
          repeat_on_month: "",
          deadline_days_after_the_start_date: null,
          extend_deadline_date: null,
          deadline_day_of_the_month: 1,
          due_date_before: null,
        }),
      });
      if (event.value !== "None") setFrequencyModals(true);
    } else {
      setFieldInputs({
        ...fieldInputs,
        frequency: { value: "", label: "" },
        weekly_repeat_day: "",
        repeat_on_day: "",
        repeat_on_holiday: "",
        repeat_on_every: "",
        frequency_end_date: "",
        repeat_on_month: "",
        deadline_days_after_the_start_date: null,
        extend_deadline_date: null,
        deadline_day_of_the_month: 1,
        due_date_before: null,
      });
    }
  };
  const handleActionTabClose = useCallback(() => {
    setEditSelectionType("");
  }, [editSelectionType, selectionType]);

  const calanderimg = <img src={calanderIcon} alt="calander" />;

  // handle submit
  const onSubmit = (statusPayload = null) => {
    setIsLoading(true);

    let formData = new FormData();
    const allInputs = Object.keys(fieldInputs);
    fileList.forEach((file) => {
      formData.append("file_details", file);
    });
    // if (isEdit) formData.append("isEdit", );
    // if (!isEdit) formData.append("isEdit", true);
    allInputs.forEach((key) => {
      if (key !== "file_details") {
        if (typeof fieldInputs[key] === "object") {
          if (key === "impact" && fieldInputs[key].length) {
            formData.append(
              key,
              fieldInputs[key]?.length > 0 ? fieldInputs[key][0].reference : ""
            );
          } else if (key === "impactFileDetails" && fieldInputs[key].length) {
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
          } else if (key === "license_list" && fieldInputs[key]?.length > 0) {
            const licenses = [...(fieldInputs.license_list || [])].map(
              (item) => item.value
            );
            formData.append(key, JSON.stringify(licenses));
          } else {
            formData.append(
              key,
              fieldInputs[key] ? JSON.stringify(fieldInputs[key]) : ""
            );
          }
        } else if (key === "frequency" && fieldInputs[key]?.value === "None") {
          formData.append(key, "None");
        } else if (key === "disable_repeat") {
          formData.append(key, fieldInputs[key] === "De-active" ? 1 : 0);
        }
        // else if (key === "internal_deadline_day") {
        //   if (!["Weekly", "Daily"].includes(fieldInputs.frequency?.value)) {
        //     // formData.append(
        //     //   "deadline_days_after_the_start_date",
        //     //   fieldInputs[key]
        //     // );
        //     formData.append("due_date_before", fieldInputs[key]);
        //   }
        // }
        else if (key === "end_date") {
          formData.append(
            key,
            fieldInputs[key] || fieldInputs.frequency_end_date
          );
        } else if (!isEmpty(fieldInputs[key]) || fieldInputs[key]) {
          formData.append(key, fieldInputs[key] ? fieldInputs[key] : "");
        }
      }
    });
    handleComplianceEventSubmit(formData, statusPayload);
  };

  const handleUpdateStatus = async (statusPayload = null) => {
    try {
      if (statusPayload && Object.keys(statusPayload).length > 0) {
        const { data, status } = await axiosInstance.post(
          "compliance.api.setComplianceStatus",
          statusPayload
        );
        if (status === 200 && data?.message?.status) {
          toast.success(data?.message?.status_response);
          if (onSuccessEvent) onSuccessEvent();
          handleOnClose();
        } else {
          toast.error(data?.message?.status_response);
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleComplianceEventSubmit = async (payload, statusPayload = null) => {
    try {
      const { status, data } = await axiosInstance.post(
        "compliance.api.setComplianceEvents",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const isEdit = Boolean(payload.get("compliance_event_id"));

      if (status === 200 && data?.message?.status) {
        const pending_compliance_id = data?.message?.pending_compliance_id;

        if (statusPayload) {
          // call status update api here
          if (statusPayload.status === "Rejected") {
            dispatch(
              eventsModuleActions.setRejectionCommentModal({
                visible: true,
                rejectionDetails: statusPayload,
                name: "ComplianceEvent",
              })
            );
            setIsLoading(false);
          } else {
            handleUpdateStatus(statusPayload);
          }
        } else {
          toast.success(
            `Compliance Event ${isEdit ? "updated" : "added"} successfully!`
          );
          if (isCreateEventForCircular) {
            onEventCreated({
              name_of_the_subtask: payload?.get("name_of_the_subtask"),
              createId: fieldInputs?.createId,
              compliance_event_id: pending_compliance_id,
            });
          } else if (onSuccessEvent) onSuccessEvent();
          handleOnClose();
          setIsLoading(false);
        }
      } else {
        toast.error(data.message?.status_response || "Something went wrong!");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong!");
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

  const validateFormFields = () => {
    const {
      start_date,
      end_date,
      name_of_the_subtask,
      project_id,
      frequency,
      weekly_repeat_day,
      license_list,
      activate_the_subtask,
      repeat_on_holiday,
      // repeat_on_day,
    } = fieldInputs;

    const isValidateActivateSubTaskOnDate =
      activate_the_subtask &&
      latestLicenseActivationDate &&
      moment(activate_the_subtask, "YYYY-MM-DD").isBefore(
        latestLicenseActivationDate
      );
    const isStartDateBeforeActivationDate = Boolean(
      activate_the_subtask &&
        start_date &&
        moment(start_date, "YYYY-MM-DD").isBefore(activate_the_subtask)
    );

    setFieldErrors({
      ...fieldErrors,
      isValidate:
        (name_of_the_subtask === "" && isEdit) ||
        frequency?.value === "" ||
        !frequency ||
        name_of_the_subtask === "" ||
        name_of_the_subtask === " " ||
        start_date === "" ||
        // end_date === "" ||
        deadlineValidation !== "" ||
        license_list?.length === 0 ||
        activate_the_subtask === "" ||
        (isEdit && frequency?.value === "Weekly" && weekly_repeat_day === "") ||
        (frequency?.value === "Weekly" && weekly_repeat_day === "") ||
        (frequency?.value === "Daily" && repeat_on_holiday === "") ||
        // (end_date && isBeforeToday(end_date)) ||
        // (start_date && isBeforeToday(start_date)) ||
        (start_date &&
          end_date &&
          isAfter(dateValidations?.end_date || end_date, start_date)) ||
        endTimeValidation ||
        isValidateActivateSubTaskOnDate ||
        isStartDateBeforeActivationDate,
      //   ||
      // (isEdit &&
      //   frequency?.value !== "Weekly" &&
      //   frequency?.value !== "Daily" &&
      //   frequency?.value !== "None" &&
      //   repeat_on_day === "") ||
      // (frequency?.value !== "Weekly" &&
      //   frequency?.value !== "Daily" &&
      //   frequency?.value !== "None" &&
      //   repeat_on_day === "") ||
      // (frequency?.value !== "Weekly" &&
      //   frequency?.value !== "Daily" &&
      //   frequency?.value !== "None" &&
      //   !repeat_on_day),
      start_date:
        start_date !== "" && !isEdit
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
            : isStartDateBeforeActivationDate
            ? "Start date should not be prior to " +
              moment(activate_the_subtask, "YYYY-MM-DD").format("DD MMM YYYY")
            : ""
          : "",
      end_date:
        // end_date !== "" && !isEdit
        end_date !== ""
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
      weekly_repeat_day:
        frequency?.value === "Weekly" && weekly_repeat_day === ""
          ? "Please select weekly repeat day"
          : "",

      activate_the_subtask: isValidateActivateSubTaskOnDate
        ? "Activate Sub task on date should be on or after " +
          moment(latestLicenseActivationDate, "YYYY-MM-DD").format(
            "DD MMM YYYY"
          )
        : "",
      //   activate_the_subtask === "" ? "This is required field" : "",
      // license_list: license_list?.length === 0 ? "Please select licenses" : "",
      // repeat_on_day:
      //   frequency?.value !== "Weekly" &&
      //   frequency?.value !== "Daily" &&
      //   frequency?.value !== "None"
      //     ? !repeat_on_day
      //       ? "month day is required"
      //       : ""
      //     : "",
    });
  };

  // const getInternalDate = (event, days) => {
  //   const value =
  //     event?.target?.value || (days !== null && days !== undefined ? days : "");
  //   if (value >= 0 && value <= 31) {
  //     const { start_date, end_date } = fieldInputs;
  //     if (start_date === "") {
  //       toast.error("Please enter start date");
  //     } else if (end_date === "") {
  //       toast.error("Please enter due date");
  //     } else {
  //       let newDate = moment(end_date, "YYYY-MM-DD");
  //       newDate = newDate.subtract(value, "days");
  //       if (newDate < moment(start_date)) {
  //         setDeadlineValidation(
  //           "Internal dealine date can't be less than start date."
  //         );
  //         setFieldInputs({
  //           ...fieldInputs,
  //           internal_deadline_day: value,
  //         });
  //       } else {
  //         setDeadlineValidation("");
  //         setFieldInputs({
  //           ...fieldInputs,
  //           internal_deadline_day: value,
  //           internal_deadline_date: newDate.format("YYYY-MM-DD"),
  //         });
  //       }
  //     }
  //   } else {
  //     setFieldInputs({
  //       ...fieldInputs,
  //       internal_deadline_day: 0,
  //     });
  //   }
  // };

  const fetchLicenses = async () => {
    try {
      const { status, data } = await getSubLicenseListForManager();
      if (status === 200 && data?.message?.status) {
        const sub_license_list = data?.message?.sub_license_list || [];
        let licenses = [];
        sub_license_list?.forEach((item) => {
          licenses.push({
            label: item.license_display,
            value: item.license_id,
            activation_date: item.activation_date,
          });
        });
        setLicenseOptions(licenses);
      } else {
        setLicenseOptions([]);
      }
    } catch (error) {
      setLicenseOptions([]);
    }
  };
  const handleOnClose = (createId = "") => {
    setFieldErrors(errorsInitialState);
    setFieldInputs(initialState);
    setFileList([]);
    setLatestLicenseActivationDate(null);
    onClose(createId);
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length) {
      setFieldInputs({
        ...initialState,
        ...editData,
      });
      setFieldBackup({
        ...initialState,
        ...editData,
      });
    }
  }, [editData]);

  useEffect(() => {
    let license_list = fieldInputs?.license_list;
    license_list = [
      ...new Set([...license_list].map((item) => item.activation_date)),
    ].filter((item) => item);
    license_list = license_list.sort((a, b) => new Date(b) - new Date(a));
    const latestDate = license_list[0]
      ? moment(license_list[0], "YYYY-MM-DD")
      : null;
    if (latestDate?.isSameOrAfter(moment().format("YYYY-MM-DD"))) {
      setLatestLicenseActivationDate(latestDate);
    } else {
      setLatestLicenseActivationDate(null);
    }
  }, [fieldInputs.license_list]);
  // useEffect(() => {
  //   if (
  //     // fieldInputs.internal_deadline_day !== 0 &&
  //     !fieldInputs.internal_deadline_day &&
  //     // fieldInputs.internal_deadline_day !== undefined &&
  //     fieldInputs?.end_date &&
  //     fieldInputs?.start_date
  //   )
  //     getInternalDate(null, 0);
  //   else if (
  //     fieldInputs.internal_deadline_day &&
  //     fieldInputs?.end_date &&
  //     fieldInputs?.start_date
  //   )
  //     getInternalDate(null, fieldInputs.internal_deadline_day);
  // }, [fieldInputs.end_date, fieldInputs.start_date]);

  useEffect(() => {
    validateFormFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fieldInputs?.end_date,
    fieldInputs?.start_date,
    fieldInputs?.name_of_the_subtask,
    fieldInputs?.frequency,
    fieldInputs?.repeat_on_day,
    fieldInputs?.repeat_on_holiday,
    fieldInputs?.weekly_repeat_day,
    endTimeValidation,
    fieldInputs?.approver,
    fieldInputs?.license_list,
    fieldInputs?.activate_the_subtask,
    deadlineValidation,
    latestLicenseActivationDate,
  ]);
  useEffect(() => {
    if (isEdit && editData?.frequency?.value) {
      const findValue = frequencyList.find(
        (item) => item.value === editData.frequency.value
      );
      const filterValue = frequencyList.map((item) => {
        return {
          ...item,
          isDisabled: item?.id >= findValue?.id ? false : true,
        };
      });
      setFrequencyList(filterValue);
    } else {
      setFrequencyList(frequencyOptions);
    }
  }, [editData?.frequency?.value]);

  useEffect(() => {
    if (showTask) fetchLicenses();
  }, [showTask]);

  return !showTask ? null : (
    <>
      <div className="add-edit-modal">
        <BackDrop isLoading={isLoading} />
        {isRejectionCommentModalVisible && (
          <RejectionCommentModal onReject={handleUpdateStatus} />
        )}
        {/* <AddComment
          visible={isShowCommentModal}
          onClose={() => setIsShowCommentModal(false)}
          commentDetails={{
            doctype: "Pending Compliance Events",
            docname: editData.temp_compliance_id
          }}
        /> */}
        {addLicenseModalEditState.isShow && (
          <CreateNewLicense
            open={addLicenseModalEditState.isShow}
            isAddSubLicene={addLicenseModalEditState.isAddSubLicene}
            isAddParentLicense={addLicenseModalEditState.isAddParentLicense}
            isEdit={addLicenseModalEditState.isEdit}
            isEditChild={addLicenseModalEditState.isEditChild}
            editdata={addLicenseModalEditState.editData}
            isFromEventPage={true}
            refreshFn={fetchLicenses}
            onAddLicenseSuccessEvent={(licenseName) => {
              setFieldInputs({
                ...fieldInputs,
                license_list: [
                  ...fieldInputs?.license_list,
                  { value: licenseName, label: licenseName },
                ],
              });
            }}
            handleClose={() => {
              setAddLicenseModalEditState((prev) => ({
                ...prev,
                isShow: false,
                editData: { license_name: "" },
              }));
            }}
          />
        )}

        <DailyModalForEvents
          open={frequencyModals}
          setOpen={setFrequencyModals}
          frequency={fieldInputs.frequency}
          setFieldInputs={setFieldInputs}
          fieldInputs={fieldInputs}
        />

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
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="mb-0">
                {isEdit ? "Edit" : "Add"}&nbsp;Compliance Event
              </h6>

              {isCEApprover &&
                fieldInputs?.status &&
                fieldInputs.status !== "Approved" &&
                editData?.disable_repeat !== "De-active" && (
                  <div className="d-flex align-items-center justify-content-between">
                    <Button
                      onClick={() => {
                        // setIsShowCommentModal(true);
                        dispatch(
                          eventsModuleActions.setCommentModal({
                            visible: true,
                            commentDetails: {
                              doctype: "Pending Compliance Events",
                              docname: editData.temp_compliance_id,
                            },
                          })
                        );
                      }}
                      description="Comment"
                    />
                    <Button
                      onClick={() => {
                        const payload = {
                          temp_compliance_id: fieldInputs.temp_compliance_id,
                          status: "Approved",
                          comments: "",
                        };
                        if (isTaskUpdated) {
                          onSubmit(payload);
                        } else {
                          handleUpdateStatus(payload);
                        }
                      }}
                      disabled={fieldErrors?.isValidate}
                      description="Approve"
                      className="mx-2 successButton"
                    />
                    <Button
                      disabled={
                        editData.status === "Rejected" ||
                        fieldErrors?.isValidate
                      }
                      onClick={() => {
                        const payload = {
                          temp_compliance_id: fieldInputs.temp_compliance_id,
                          status: "Rejected",
                          comments: "",
                        };
                        if (isTaskUpdated) {
                          onSubmit(payload);
                        } else {
                          // handleUpdateStatus(payload);
                          dispatch(
                            eventsModuleActions.setRejectionCommentModal({
                              visible: true,
                              rejectionDetails: payload,
                              name: "ComplianceEvent",
                            })
                          );
                        }
                      }}
                      description="Reject"
                      className="dangerButton"
                    />
                  </div>
                )}
            </div>

            <input
              type="text"
              autoFocus
              required
              maxLength={100}
              className="modal-input"
              name="project_name"
              value={fieldInputs?.name_of_the_subtask}
              onChange={(e) => {
                setFieldInputs({
                  ...fieldInputs,
                  name_of_the_subtask: removeWhiteSpaces(e.target.value),
                });
              }}
              placeholder="Compliance Event*"
            />
            <div className="row mt-3">
              <div className="col-4">
                <label className="add-edit-project-labels required">
                  Activate Sub-Task On
                </label>
                <DatePicker
                  placeholder="Activate Sub-Task On"
                  className="modal-input"
                  name="activate_the_subtask"
                  // inputReadOnly
                  format="DD MMMM Y"
                  disabledDate={(current) => {
                    let customDate =
                      latestLicenseActivationDate ||
                      moment().format("YYYY-MM-DD");
                    return (
                      current && current < moment(customDate, "YYYY-MM-DD")
                    );
                  }}
                  suffixIcon={calanderimg}
                  value={
                    (fieldInputs?.activate_the_subtask &&
                      moment(
                        fieldInputs?.activate_the_subtask,
                        "YYYY-MM-DD"
                      )) ||
                    null
                  }
                  onChange={(value) =>
                    setFieldInputs({
                      ...fieldInputs,
                      activate_the_subtask: value?.format("YYYY-MM-DD") || "",
                    })
                  }
                />
                {fieldErrors?.activate_the_subtask !== "" && (
                  <p className="add-project-err-msg">
                    <MdError />
                    &nbsp;
                    {fieldErrors?.activate_the_subtask}
                  </p>
                )}
              </div>
              <div className="col-4">
                <label className="add-edit-project-labels required">
                  License Details
                </label>
                <CreatableSelect
                  isMulti={true}
                  onChange={(selectedOptions) => {
                    setFieldInputs({
                      ...fieldInputs,
                      license_list: selectedOptions,
                    });
                  }}
                  value={fieldInputs.license_list}
                  placeholder="License"
                  styles={customStyles}
                  isClearable={true}
                  options={licenseOptions}
                  onCreateOption={(inputValue) => {
                    handleOpenAddLicense({
                      license_name: inputValue,
                    });
                  }}
                />
              </div>
              <div className="col-md-4 col-lg-4 col-sm-4">
                <label className="add-edit-project-labels">End Time</label>
                <TimePicker
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
            <div className="row mt-3">
              <div className="col-md-4 col-lg-4 col-sm-4">
                <DatePicker
                  placeholder="Start Date*"
                  className="modal-input"
                  name="start_date"
                  format="DD MMMM Y"
                  disabled={!fieldInputs?.activate_the_subtask}
                  disabledDate={(current) => {
                    let customDate = fieldInputs.activate_the_subtask
                      ? moment(fieldInputs.activate_the_subtask).format(
                          "YYYY-MM-DD"
                        )
                      : moment().format("YYYY-MM-DD");
                    return current.isBefore(customDate);
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
                  placeholder="End Date"
                  className="modal-input"
                  suffixIcon={calanderimg}
                  disabled={!fieldInputs?.activate_the_subtask}
                  format="DD MMMM Y"
                  disabledDate={(current) => {
                    let customDate = fieldInputs.activate_the_subtask
                      ? moment(fieldInputs.activate_the_subtask).format(
                          "YYYY-MM-DD"
                        )
                      : moment().format("YYYY-MM-DD");
                    return current.isBefore(customDate);
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
                      frequency_end_date: end_date,
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
                    &nbsp;
                    {fieldErrors?.end_date}
                  </p>
                )}
              </div>

              {/* <div className="col-md-4 col-lg-4 col-sm-4">
                <TimePicker
                  className="modal-input"
                  placeholder="End Time"
                  value={
                    fieldInputs.end_time
                      ? moment(fieldInputs.end_time, "hh:mm A")
                      : null
                  }
                  use12Hours
                  format="hh:mm A"
                  onChange={(time, timeString) => {
                    const startDay = new Date(
                      moment(fieldInputs?.start_date, "YYYY-MM-DD")
                    ).getDate();
                    const endDay = new Date(
                      moment(fieldInputs?.end_date, "YYYY-MM-DD")
                    ).getDate();
                    if (startDay == endDay) {
                      const selectedTime = parseInt(
                        moment(timeString, ["h:mm A"]).format("HH")
                      );
                      const currentTime = parseInt(new Date().getHours());
                      if (selectedTime < currentTime) {
                        setFieldInputs({
                          ...fieldInputs,
                          end_time: null,
                        });
                        setEndTimeValidation(true);
                      } else {
                        setFieldInputs({
                          ...fieldInputs,
                          end_time: timeString || null,
                        });
                        setEndTimeValidation(false);
                      }
                    } else {
                      setFieldInputs({
                        ...fieldInputs,
                        end_time: timeString || null,
                      });
                      setEndTimeValidation(false);
                    }
                  }}
                />
                {endTimeValidation && (
                  <p style={{ fontSize: 10, color: "red" }}>
                    End Time must be prior or equal to current time.
                  </p>
                )}
              </div> */}
              <div className="col-sm-4 col-lg-4 col-md-4 d-flex justify-content-end">
                <div style={{ width: 255 }}>
                  <Select
                    isMulti={false}
                    placeholder="Frequency*"
                    styles={customStyles}
                    isClearable={true}
                    options={frequencyList}
                    onChange={FrequencyChange}
                    value={
                      (fieldInputs?.frequency?.label &&
                        fieldInputs.frequency) ||
                      null
                    }
                  />
                </div>
              </div>
            </div>

            {/* <div className="row">
              <div className="col">
                <label className="add-edit-project-labels mt-4">
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
              <div className="col-4">
                {/* <label className="add-edit-project-labels">Risk Rating</label> */}
                <Select
                  isMulti={false}
                  onChange={(selectedOptions) => {
                    setFieldInputs({
                      ...fieldInputs,
                      riskRating: selectedOptions?.value || null,
                    });
                  }}
                  value={
                    fieldInputs?.riskRating
                      ? {
                          value: fieldInputs.riskRating,
                          label: fieldInputs.riskRating,
                        }
                      : null
                  }
                  placeholder="Risk Rating"
                  styles={customStyles}
                  isClearable={true}
                  options={[
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                  ]}
                  onCreateOption={(inputValue) => {
                    handleOpenAddLicense({
                      license_name: inputValue,
                    });
                  }}
                />
              </div>
              {/* <div className="col-sm-6 col-lg-6 col-md-6 d-flex justify-content-between">
                <label>
                  Internal Deadline <br />
                  <span
                    style={{
                      color: "#ff5858",
                      fontSize: "12px",
                    }}
                  >
                    (No of days before due date)
                  </span>
                </label>
                <div>
                  <input
                    className="frequecny-input"
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
                      (fieldInputs.start_date &&
                        fieldInputs.end_date &&
                        moment(fieldInputs.start_date).isSame(
                          fieldInputs.end_date
                        ))
                    }
                  />
                </div>
                <div style={{ width: 140 }}>
                  <DatePicker
                    disabled={true}
                    format="DD MMMM Y"
                    value={
                      fieldInputs.internal_deadline_date
                        ? moment(
                            fieldInputs.internal_deadline_date,
                            "YYYY-MM-DD"
                          )
                        : null
                    }
                  />
                  {deadlineValidation !== "" && (
                    <p style={{ fontSize: 10, color: "red" }}>
                      {deadlineValidation}
                    </p>
                  )}
                </div>
              </div> */}
            </div>
            {isEdit && (
              <div className="row mt-4">
                <div className="col-3 d-flex align-items-center justify-content-between">
                  <label
                    className="add-edit-project-labels mb-0"
                    htmlFor="comp-event-disable-repeat-toggle"
                  >
                    Disable Repeat
                  </label>
                  <input
                    onChange={(e) => {
                      setFieldInputs({
                        ...fieldInputs,
                        disable_repeat: e.target.checked
                          ? "De-active"
                          : "Active",
                      });
                    }}
                    type="checkbox"
                    checked={fieldInputs.disable_repeat === "De-active"}
                    id="comp-event-disable-repeat-toggle"
                  />
                </div>
              </div>
            )}
            {/* <div className="row mt-4">
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
            </div> */}

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
              {Object.keys(createTaskActions).map((key) => {
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
                            key={`compliance-event-file-${
                              file.file_id ||
                              file.name ||
                              file.file_name ||
                              file.fileName
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
                            key={`compliance-event-impact-file-${
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

            <div className="d-flex mt-5 justify-content-center">
              <div className="mr-2">
                {!isEdit ? (
                  <button
                    className="add-edit-project-submit-btn"
                    onClick={() => onSubmit()}
                    disabled={fieldErrors?.isValidate}
                    style={{
                      ...((fieldErrors?.isValidate ||
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
                    onClick={() => onSubmit()}
                    disabled={
                      fieldErrors?.isValidate || (isEdit && !isTaskUpdated)
                    }
                    style={{
                      ...((fieldErrors?.isValidate ||
                        (isEdit && !isTaskUpdated)) && {
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
                  onClick={() => handleOnClose(fieldInputs?.createId)}
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
};

// const isBeforeToday = (date) => {
//   const todayDate = moment().format("YYYY-MM-DD");
//   return moment(todayDate).isAfter(date);
// };

export default AddComplianceEvent;
