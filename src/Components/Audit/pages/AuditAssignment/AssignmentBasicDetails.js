import React, { useEffect, useState } from "react";
import Text from "../../components/Text/Text";
import { Input } from "../../components/Inputs/Input";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuditAssignmentDetails,
  setAssignmentId,
  setTemplateId,
  setAssignmentDetail,
} from "../../redux/actions";
import axiosInstance from "../../../../apiServices";
import Button from "../../components/Buttons/Button";
import { toast } from "react-toastify";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";
import moment from "moment";
import { useLocation } from "react-router";
import { BACKEND_BASE_URL } from "../../../../apiServices/baseurl";
import { createUpdateAuditTemplateActions } from "../../redux/createUpdateTemplatesActions";
import api from "Components/Audit/api";
import isEmail from "validator/lib/isEmail";
import CreatableSelect from "react-select/creatable";
import CompanyConfirmationPopUp from "./CompanyConfirmationPopUp";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { validEmailRegex } from "Components/Audit/components/Helpers/string.helpers";
function AssignmentBasicDetails({ next, stepper, values, setValues }) {
  const [templateNames, setTemplateNames] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [confirmationData, setConfirmationData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [companyModal, setComapnyModal] = useState(false);
  const [errors, setErrors] = useState({
    audit_template_name: "",
    audit_name: "",
    company_name: "",
    audit_scope: "",
    audit_description: "",
    start_date: "",
    audit_deadline: "",
    buffer_duration: "",
    auditor_firm_name: "",
    auditor_name: "",
    auditor_email: "",
    auditor_designation: "",
    auditor_mobile_no: "",
    auditor_mobile_country_code: "",
  });
  const dispatch = useDispatch();

  const { duration_of_completion, buffer_period, audit_template_id } =
    useSelector(
      (state) =>
        state?.AuditReducer?.CreateUpdateAuditTemplate?.auditScopeBasicDetails
          ?.basicDetails
    );
  const durationOfCompletion = useSelector(
    (state) =>
      state?.AuditReducer?.CreateUpdateAuditTemplate?.auditScopeBasicDetails
        ?.basicDetails.duration_of_completion
  );
  const bufferPeriod = useSelector(
    (state) =>
      state?.AuditReducer?.CreateUpdateAuditTemplate?.auditScopeBasicDetails
        ?.basicDetails.buffer_period
  );
  const location = useLocation();
  const assignment_id = new URLSearchParams(location.search).get("id");
  const auditTemplateId = location.state?.audit_template_id;

  // custom style for dropdown
  const customStyle = {
    control: (styles) => ({
      ...styles,
      width: "100%",
      height: "45px",
      borderRadius: "4px",
      background: "#f6f9fb",
    }),
  };

  const comapnyModalopen = (value) => {
    setComapnyModal(true);
    setConfirmationData(value);
  };
  const companyModalClose = () => {
    setComapnyModal(false);
  };

  const onCompanyNameChange = (event) => {
    let check = companyList.filter(
      (item) => item?.value === event.value
    ).length;
    if (!check) {
      comapnyModalopen(event.value);
    } else {
      setValues({
        ...values,
        company_name: event.value,
      });
      setErrors({
        ...errors,
        company_name:
          event.value?.length === 0 || event.value?.length < 2
            ? "company name can't be empty"
            : "",
      });
    }
  };

  const getAuditCompanyList = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "audit.api.getCompanyDetails"
      );
      if (status === 200 && data && data.message && data.message.status) {
        const company = data?.message?.company_list?.map((item) => {
          return {
            label: item.Company_name,
            value: item.Company_name,
          };
        });
        setCompanyList(company);
      } else {
        setCompanyList([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (assignment_id) {
      fetchAndSetAuditBasicDetail(assignment_id);
    } else {
      setAssignmentDetail({});
    }
  }, []);

  useEffect(() => {
    console.log({ duration_of_completion, buffer_period, assignment_id });
  }, [audit_template_id, assignment_id]);

  useEffect(() => {
    getAuditCompanyList();
    fetchTemplateNames();
  }, []);

  //Fetch Assignment Details
  const fetchAndSetAuditBasicDetail = async (id) => {
    const apiResponse = await axiosInstance.get(
      `${BACKEND_BASE_URL}audit.api.AssignmentDetails`,
      {
        params: {
          assignment_id: id,
        },
      }
    );
    if (apiResponse?.data?.message?.status === true) {
      const {
        audit_name,
        auditor_name,
        company_name,
        audit_scope,
        auditor_firm_name,
        duration_of_completion,
        auditor_email_id,
        designation,
        audit_template_name,
        auditor_mobile_no,
        buffer_period,
        start_date,
        description,
        audit_template_id,
        country_code,
      } = apiResponse?.data?.message?.data;
      setValues({
        ...values,
        audit_template_name: audit_template_id || "",
        audit_name: audit_name || "",
        audit_scope: audit_scope || "",
        audit_description: description || "",
        company_name: company_name || "",
        audit_deadline: duration_of_completion || durationOfCompletion,
        buffer_duration: buffer_period || bufferPeriod,
        auditor_name: auditor_name || "",
        auditor_firm_name: auditor_firm_name || "",
        auditor_email: auditor_email_id || "",
        auditor_mobile_no: auditor_mobile_no || "",
        auditor_designation: designation || "",
        auditor_mobile_country_code: country_code || "91",
        start_date: start_date || "",
        audit_template_id,
      });

      dispatch(setAssignmentDetail(apiResponse?.data?.message?.data));
      //setAssignmentDetail(apiResponse?.data?.message?.data);
    }
  };

  const dateFormat = "YYYY-MM-DD";

  //form validate function
  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  //Function to fetch Template names
  const fetchTemplateNames = () => {
    try {
      setIsLoading(true);
      axiosInstance.get("audit.api.getAuditTemplateList").then((response) => {
        if (response?.data?.message?.status === true) {
          const arr1 = [];

          response.data.message.at_list?.map((item) => {
            arr1.push({
              label: item.audit_template_name,
              value: item.audit_template_id,
            });
          });

          setTemplateNames(arr1);
          setIsLoading(false);
        } else {
          setTemplateNames([]);
          setIsLoading(false);
        }
      });
    } catch (err) {
      setIsLoading(false);
      toast.error("something went wrong");
    }
  };

  //function to set form values and to check fileds validation
  const formValues = (event) => {
    const { name, value } = event.target;
    const newErrors = { ...errors };

    const field_name = {
      audit_template_name: "Template name",
      audit_name: "Audit name",
      company_name: "Company name",
      audit_scope: "Audit scope",
      audit_description: "Audit description",
      auditor_mobile_country_code: "Mobile number",
      auditor_firm_name: "Firm name",
      auditor_name: "Auditor name",
      auditor_designation: "Auditor designation",
    };

    switch (name) {
      case "audit_template_name":
      case "audit_name":
      case "company_name":
      case "audit_scope":
      case "audit_description":
      case "auditor_mobile_country_code":
      case "auditor_firm_name":
      case "auditor_name":
      case "auditor_designation":
        newErrors[name] =
          value?.length === 0 ? `${field_name?.[name]} can't be empty` : "";
        break;
      case "audit_deadline":
        newErrors[name] =
          value?.length === 0
            ? "Audit deadline can't be empty"
            : parseInt(value) > parseInt(duration_of_completion)
            ? `Audit deadline should be less than ${parseInt(
                duration_of_completion
              )} days`
            : "";
        break;
      case "buffer_duration":
        newErrors[name] =
          value?.length === 0
            ? "Buffer duration can't be empty"
            : parseInt(value) > parseInt(buffer_period)
            ? `Buffer duration should be less than ${parseInt(
                buffer_period
              )} days`
            : "";
        break;
      case "auditor_email":
        newErrors[name] = validEmailRegex.test(value)
          ? ""
          : "Email is not valid";
        break;
      case "auditor_mobile_no":
        newErrors[name] =
          value.length === 10 ? "" : "Mobile no must be 10 digits";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    setValues({
      ...values,
      [name]: removeWhiteSpaces(value),
    });
  };

  const onDateChange = (date, dateString) => {
    const todayDate = moment().format("YYYY-MM-DD");
    setValues({
      ...values,
      start_date: date?.format("YYYY-MM-DD") || "",
    });
    if (moment(todayDate).isAfter(dateString)) {
      setErrors({
        ...errors,
        start_date: `Please select ${todayDate} or after ${todayDate}`,
      });
    } else {
      setErrors({
        ...errors,
        start_date: "",
      });
    }
  };

  const requiredFields = [
    "audit_template_name",
    "audit_template_name",
    "audit_scope",
    "audit_deadline",
    "buffer_duration",
    "auditor_firm_name",
    "start_date",
    "auditor_name",
    "auditor_email",
    "auditor_designation",
    "auditor_mobile_no",
    "auditor_mobile_country_code",
  ];

  const isFormValid = requiredFields.every(
    (fieldName) =>
      values[fieldName] !== "" &&
      values[fieldName] !== " " &&
      values[fieldName] !== null
  );

  const dataSubmitAPicall = async () => {
    const payload = {
      audit_template_id: values?.audit_template_name,
      audit_template_name: values?.audit_template_name,
      audit_name: values?.audit_name,
      audit_category: values?.audit_scope,
      description: values?.audit_description,
      company_name: values?.company_name,
      duration_of_completion: values?.audit_deadline,
      buffer_period: values?.buffer_duration,
      auditor_name: values?.auditor_name,
      auditor_firm_name: values?.auditor_firm_name,
      auditor_email_id: values?.auditor_email,
      auditor_mobile_no: values?.auditor_mobile_no,
      designation: values?.auditor_designation,
      start_date: values?.start_date,
      country_code: values?.auditor_mobile_country_code,
      steps: 3,
      assignment_id: assignment_id
        ? assignment_id
        : values?.assignment_id
        ? values?.assignment_id
        : "",
    };
    try {
      const data = await axiosInstance.post("audit.api.Assignment", payload);
      dispatch(setAssignmentId(data?.data?.message.assignment_id));
      dispatch(setTemplateId(payload.audit_template_id));
      if (data?.data?.message.status === true) {
        setValues({
          ...values,
          assignment_id: data?.data?.message?.assignment_id || "",
        });
        setIsLoading(false);
        next(stepper?.stepperAcitveSlide);
      } else {
        setIsLoading(false);
        toast.error(data?.data?.message.status_response);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const submitData = () => {
    const requiredFields = {
      audit_template_name: "Please select any template",
      audit_name: "Audit name can't be empty",
      company_name: "Company name can't be empty",
      audit_scope: "Audit scope can't be empty",
      audit_deadline: "Audit deadline can't be empty",
      buffer_duration: "Buffer duration can't be empty",
      auditor_firm_name: "Auditor firm name can't be empty",
      auditor_name: "Auditor name can't be empty",
      start_date: "Please Select start date",
      auditor_email: "Auditor email can't be empty",
      auditor_designation: "Auditor designation can't be empty",
      auditor_mobile_no: "Auditor mobile no can't be empty",
      auditor_mobile_country_code: "Country code Required",
    };

    for (const field in requiredFields) {
      if (
        values[field]?.length === 0 ||
        values[field] === " " ||
        values[field] === null
      ) {
        toast.error(requiredFields[field]);
        setErrors({
          ...errors,
          [field]: requiredFields[field],
        });
        return;
      }
    }
    if (validateForm(errors)) {
      setIsLoading(true);
      // dispatch(createUpdateAuditTemplateActions.clearAllState());
      dataSubmitAPicall();
    } else {
      toast.error("Please fill in the required fields");
    }
  };

  const fetchAndSetAuditorsDetails = async () => {
    try {
      const { data, status } = await api.fetchUsersDetailByEmail(
        values?.auditor_email
      );

      if (status === 200 && data?.message?.status) {
        const { full_name, company_name, designation, mobile_no } =
          data?.message?.data;
        setValues({
          ...values,
          auditor_name: full_name || "",
          auditor_designation: designation || values.auditor_designation || "",
          auditor_firm_name: company_name || values.auditor_firm_name || "",
          auditor_mobile_no: mobile_no || values.auditor_mobile_no || "",
        });
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (auditTemplateId || values?.audit_template_name) {
      dispatch(
        createUpdateAuditTemplateActions.getAuditScopeBasicDetails(
          auditTemplateId || values?.audit_template_name
        )
      );

      setErrors({
        ...errors,
        audit_deadline: "",
        buffer_duration: "",
      });
    }
  }, [values?.audit_template_name, auditTemplateId]);

  useEffect(() => {
    setValues({
      ...values,
      audit_deadline: audit_template_id ? duration_of_completion : null,
      buffer_duration: audit_template_id ? buffer_period : null,
      audit_template_name: audit_template_id ? audit_template_id : null,
      audit_template_id: audit_template_id || null,
    });
  }, [duration_of_completion, buffer_period, audit_template_id]);

  useEffect(() => {
    const _email = values?.auditor_email;
    if (isEmail(_email)) {
      fetchAndSetAuditorsDetails();
    }
  }, [values?.auditor_email]);

  return (
    <>
      <CompanyConfirmationPopUp
        open={companyModal}
        setValues={setValues}
        values={values}
        errors={errors}
        setCompanyList={setCompanyList}
        companyList={companyList}
        eventVlaue={confirmationData}
        handleClose={companyModalClose}
        setErrors={setErrors}
      />
      <BackDrop isLoading={isLoading} />
      <Text
        heading="p"
        text="add basic audit details"
        variant="stepperSubHeading"
      />
      <div className={styles.inputRow}>
        <div className={styles.flex6}>
          <Input
            type="select"
            variant="auditAssignmentInput"
            labelText="Audit Template"
            required={true}
            placeholder="Select template"
            labelVariant="labelGreyMini"
            onChange={formValues}
            name="audit_template_name"
            value={
              values?.audit_template_name ||
              location?.state?.audit_template_id ||
              null
            }
            valueForDropDown={templateNames}
          />
          {errors.audit_template_name.length > 0 && (
            <Text
              heading="p"
              variant="error"
              text={errors.audit_template_name}
            />
          )}
        </div>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="audit name"
            placeholder="Name of Audit"
            labelVariant="labelGreyMini"
            name="audit_name"
            required={true}
            value={values?.audit_name}
            onChange={formValues}
          />
          {errors.audit_name.length > 0 && (
            <Text heading="p" variant="error" text={errors.audit_name} />
          )}
        </div>
      </div>
      <div className={styles.inputRow}>
        <div className={styles.flex6}>
          <Text
            heading="label"
            text="Company Name"
            variant="labels"
            required={true}
          />
          <CreatableSelect
            placeholder="select"
            styles={customStyle}
            value={[
              {
                label: values?.company_name || "select",
                value: values?.company_name || "select",
              },
            ]}
            options={companyList}
            onChange={onCompanyNameChange}
          />
          {errors.company_name.length > 0 && (
            <Text heading="p" variant="error" text={errors.company_name} />
          )}
        </div>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="audit scope"
            placeholder="Enter audit scope"
            required={true}
            labelVariant="labelGreyMini"
            name="audit_scope"
            type="text"
            maxLength={50}
            value={values?.audit_scope}
            onChange={formValues}
          />
          {errors.audit_scope.length > 0 && (
            <Text heading="p" variant="error" text={errors.audit_scope} />
          )}
        </div>
      </div>
      <div className={styles.inputRow}>
        <div className={styles.flex12}>
          <Input
            type="textarea"
            variant="auditAssignmentInput"
            labelText="brief description"
            placeholder="Write a short brief about the audit to be done"
            labelVariant="labelGreyMini"
            name="audit_description"
            value={values?.audit_description}
            onChange={formValues}
          />
          {errors.audit_description.length > 0 && (
            <Text heading="p" variant="error" text={errors.audit_description} />
          )}
        </div>
      </div>
      <div className={`${styles.inputRow}`}>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="Audit Deadline"
            placeholder="Enter days"
            required={true}
            maxLength={3}
            pattern="[0-9]{3}"
            type="text"
            labelVariant="labelGreyMini"
            name="audit_deadline"
            value={values?.audit_deadline}
            onChange={(e) => {
              const value = e.target.value;
              if (
                !value ||
                (/^[0-9]{0,3}$/.test(value) && value !== 0 && value !== "0")
              ) {
                formValues(e);
              }
            }}
            className="mb-3"
          />
          {errors.audit_deadline.length > 0 && (
            <Text heading="p" variant="error" text={errors.audit_deadline} />
          )}
        </div>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="Buffer duration"
            placeholder="Select buffer period"
            required={true}
            maxLength={3}
            pattern="[0-9]{3}"
            type="text"
            labelVariant="labelGreyMini"
            name="buffer_duration"
            value={values?.buffer_duration}
            onChange={(e) => {
              const value = e.target.value;
              if (!value || /^[0-9]{0,3}$/.test(value)) {
                formValues(e);
              }
            }}
            className="mb-3"
          />
          {errors.buffer_duration.length > 0 && (
            <Text heading="p" variant="error" text={errors.buffer_duration} />
          )}
        </div>
      </div>
      <div className={`${styles.inputRow} ${styles.inputRowSpacing}`}>
        <div className={styles.flex6}>
          <Input
            type="date"
            onChange={onDateChange}
            labelText="Start date"
            required={true}
            format="DD MMM YYYY"
            labelVariant="labelGreyMini"
            variant="auditAssignmentInput"
            value={values?.start_date && moment(values?.start_date, dateFormat)}
          />
          {errors.start_date.length > 0 && (
            <Text heading="p" variant="error" text={errors.start_date} />
          )}
        </div>
      </div>
      <Text
        heading="p"
        text="Head of auditor details"
        variant="stepperSubHeading"
      />
      <div className={styles.inputRow}>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="Auditor's email ID"
            required={true}
            placeholder="Enter Email ID here"
            labelVariant="labelGreyMini"
            type="email"
            name="auditor_email"
            onChange={formValues}
            value={values?.auditor_email}
          />
          {errors.auditor_email.length > 0 && (
            <Text heading="p" text={errors.auditor_email} variant="error" />
          )}
        </div>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="Auditor's name"
            placeholder="Name of the Auditor"
            required={true}
            labelVariant="labelGreyMini"
            name="auditor_name"
            onChange={formValues}
            value={values?.auditor_name}
          />
          {errors.auditor_name.length > 0 && (
            <Text heading="p" variant="error" text={errors.auditor_name} />
          )}
        </div>
      </div>
      <div className={styles.inputRow}>
        <div className={styles.flex6}>
          <Input
            type="text"
            variant="auditAssignmentInput"
            labelText="Auditor's designation"
            required={true}
            placeholder="Enter Designation"
            labelVariant="labelGreyMini"
            name="auditor_designation"
            onChange={formValues}
            value={values?.auditor_designation || null}
          />
          {errors.auditor_designation.length > 0 && (
            <Text
              heading="p"
              variant="error"
              text={errors.auditor_designation}
            />
          )}
        </div>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="Auditor's firm name"
            required={true}
            placeholder="Eg. NK CA Associates"
            labelVariant="labelGreyMini"
            name="auditor_firm_name"
            onChange={formValues}
            value={values?.auditor_firm_name}
          />
          {errors.auditor_firm_name.length > 0 && (
            <Text variant="error" heading="p" text={errors.auditor_firm_name} />
          )}
        </div>
      </div>

      <div className={styles.inputRow}>
        <div className={styles.flex6}>
          <div className="row">
            <div className="col-4">
              <Input
                variant="auditAssignmentInput"
                labelText="code"
                required={true}
                placeholder="91"
                maxLength={3}
                pattern="[0-9]{3}"
                labelVariant="labelGreyMini"
                type="text"
                name="auditor_mobile_country_code"
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value || /^[0-9]{0,10}$/.test(value)) {
                    formValues(e);
                  }
                }}
                value={values?.auditor_mobile_country_code}
              />
            </div>
            <div className="col-8">
              <Input
                variant="auditAssignmentInput"
                labelText="Mobile number"
                required={true}
                placeholder="Type 10 digit number"
                maxLength={10}
                labelVariant="labelGreyMini"
                type="text"
                name="auditor_mobile_no"
                pattern="[0-9]{10}"
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value || /^[0-9]{0,10}$/.test(value)) {
                    formValues(e);
                  }
                }}
                value={values?.auditor_mobile_no}
              />
              {errors.auditor_mobile_no.length > 0 && (
                <Text
                  heading="p"
                  variant="error"
                  text={errors.auditor_mobile_no}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          description="Next"
          disabled={!validateForm(errors) || !isFormValid}
          onClick={() => {
            submitData();
          }}
        />
      </div>
    </>
  );
}

export default AssignmentBasicDetails;
