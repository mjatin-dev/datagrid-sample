import React, { useEffect, useRef, useState } from "react";
import { Input } from "../../components/Inputs/Input";
import styles from "./style.module.scss";
import { BsTrashFill } from "react-icons/bs";
import Button from "../../components/Buttons/Button";
import axiosInstance from "../../../../apiServices";
import { toast } from "react-toastify";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";
import readXlsxFile from "read-excel-file";
import moment from "moment";
import {
  CreateMultipleAssignmentColumns,
  excelSchema,
} from "../../constants/Shared";
import Text from "Components/Audit/components/Text/Text";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import { AiFillPlusCircle } from "react-icons/ai";
import api from "Components/Audit/api";
import isEmail from "validator/lib/isEmail";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { formatedDate } from "Components/Audit/constants/CommonFunction";
import { validEmailRegex } from "Components/Audit/components/Helpers/string.helpers";

const dateFormat = "YYYY-MM-DD";
const CreateMultipleAssignment = ({
  setIsMultiple,
  setMultiAssignmentList,
  setMultipleAssignmentStep,
}) => {
  const inputFileRef = useRef(null);
  const [assignmentPayload, setAssignmentPayload] = useState(
    Array(2)
      .fill(0)
      .map((value, index) => {
        return {
          templateName: "",
          templateID: "",
          assignmentName: "",
          startDate: null,
          manager_auditee_email: "",
          manager_auditee_name: "",
          auditor_email: "",
          auditor_name: "",
          sub_auditee_email: "",
          sub_auditee_name: "",
          branchCode: "",
          location: "",
          isDisable: false,
          id: index,
          company: "",
          assignmentNameErr: "",
          dateErr: "",
          managerAuditeeEmailErr: "",
          managerAuditeeNameErr: "",
          auditorEmailErr: "",
          auditorNameErr: "",
          subAuditeeEmailErr: "",
          subAuditeeNameErr: "",
          branchErr: "",
          locationErr: "",
          companyErr: "",
        };
      })
  );

  const [addMoreDisabled, setAddMoreDisabled] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateNameList, setTemplateNameList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importError, setImportError] = useState([]);
  const [branchCodes, setBranchCode] = useState([]);

  const addMoreBranchRow = () => {
    setAssignmentPayload([
      ...assignmentPayload,
      {
        templateName: "",
        templateID: "",
        assignmentName: "",
        startDate: null,
        manager_auditee_email: "",
        manager_auditee_name: "",
        auditor_email: "",
        auditor_name: "",
        sub_auditee_email: "",
        sub_auditee_name: "",
        branchCode: "",
        location: "",
        isDisable: false,
        id: assignmentPayload.length + 1,
        company: "",
        assignmentNameErr: "",
        dateErr: "",
        managerAuditeeEmailErr: "",
        managerAuditeeNameErr: "",
        auditorEmailErr: "",
        auditorNameErr: "",
        subAuditeeEmailErr: "",
        subAuditeeNameErr: "",
        branchErr: "",
        locationErr: "",
        companyErr: "",
      },
    ]);
  };

  const handleInputChange = async (event, currentIndex) => {
    setAddMoreDisabled(false);
    setImportError([]);
    const { value, name } = event.target;
    const tempArray = [...assignmentPayload];
    if (name === "assignmentName") {
      tempArray[currentIndex].assignmentNameErr = "";
    } else if (name === "manager_auditee_email") {
      validEmailRegex.test(value)
        ? (tempArray[currentIndex].managerAuditeeEmailErr = "")
        : (tempArray[currentIndex].managerAuditeeEmailErr =
            "please enter a valid email");
    } else if (name === "manager_auditee_name") {
      tempArray[currentIndex].managerAuditeeNameErr = "";
    } else if (name === "auditor_email") {
      validEmailRegex.test(value)
        ? (tempArray[currentIndex].auditorEmailErr = "")
        : (tempArray[currentIndex].auditorEmailErr =
            "please enter a valid email");
    } else if (name === "auditor_name") {
      tempArray[currentIndex].auditorNameErr = "";
    } else if (name === "sub_auditee_email") {
      validEmailRegex.test(value)
        ? (tempArray[currentIndex].subAuditeeEmailErr = "")
        : (tempArray[currentIndex].subAuditeeEmailErr =
            "please enter a valid email");
    } else if (name === "sub_auditee_name") {
      tempArray[currentIndex].subAuditeeNameErr = "";
    } else if (name === "company") {
      tempArray[currentIndex].companyErr = "";
    } else if (name === "branchCode") {
      tempArray[currentIndex].branchErr = "";
    } else if (name === "location") {
      tempArray[currentIndex].locationErr = "";
    } else {
    }
    tempArray[currentIndex][name] = removeWhiteSpaces(value);
    setAssignmentPayload(tempArray);
  };

  const handleDateChange = (date, currentIndex) => {
    setAddMoreDisabled(false);
    const todayDate = moment().format("YYYY-MM-DD");
    const tempArray = [...assignmentPayload];
    tempArray[currentIndex]["startDate"] = date?.format("YYYY-MM-DD") || "";
    setAssignmentPayload(tempArray);
    if (moment(todayDate).isAfter(date?.format("YYYY-MM-DD"))) {
      tempArray[currentIndex]["dateErr"] = `please select ${formatedDate(
        todayDate
      )} or after ${formatedDate(todayDate)}`;
    } else {
      tempArray[currentIndex]["dateErr"] = "";
    }
  };

  const handleSelect = (event) => {
    const { value } = event.target;
    setTemplateName(value);

    const name = templateNameList.filter((item) => item.value === value)[0]
      ?.label;

    const updateAssignmentPayload = assignmentPayload.map((item) => {
      return { ...item, templateID: value, templateName: name || value };
    });

    setAssignmentPayload(updateAssignmentPayload);
  };

  const uploadFile = () => {
    inputFileRef.current.click();
  };

  const fetchUserDetails = (value, name, index) => {
    let tempArray = [...assignmentPayload];
    try {
      setIsLoading(true);
      api.fetchUsersDetailByEmail(value).then((res) => {
        if (res.status === 200 && res.data?.message?.status) {
          const { full_name } = res?.data?.message?.data;
          tempArray[index][name] = full_name;
          setIsLoading(false);
        } else {
          tempArray[index][name] = "";
          setIsLoading(false);
        }
        setAssignmentPayload(tempArray);
      });
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  /* Code can be used in future

    location:
                code && code.length > 0
                  ? code[0].branch_location
                  : item?.branch_location,
              locationID: code && code[0]?.branch_docname,
              branchCode: item?.branchCode,
              company:
                code && code.length > 0 ? code[0].company_name : item?.company,
  
  
  */
  const handleUploadFile = (event) => {
    readXlsxFile(event.target.files[0], { schema: excelSchema })
      .then((rows) => {
        if (rows?.rows?.length === 0) {
          toast.error("Imported file is empty!");
        } else if (rows?.errors?.length > 0) {
          setImportError(rows.errors);
        } else {
          setImportError([]);

          const rowValues = rows?.rows?.map((item, index) => {
            const code = branchCodes.filter(
              (value) => value.branch_code === item.branchCode
            );

            return {
              templateName: item?.template_name,
              assignmentName: item?.assignment_name,
              startDate: moment(item?.start_date).format("YYYY-MM-DD"),
              manager_auditee_email: item?.manager_auditee_email,
              manager_auditee_name: item?.manager_auditee_name,
              auditor_email: item?.auditor_email,
              auditor_name: item?.auditor_name,
              sub_auditee_email: item?.sub_auditee_email,
              sub_auditee_name: item?.sub_auditee_name,
              location: item?.branch_location,
              locationID: code && code[0]?.branch_docname,
              branchCode: item?.branchCode,
              company: item?.company,
              isDisable: code.length > 0 ? true : false,
              id: index,
              assignmentNameErr: "",
              dateErr: "",
              managerAuditeeEmailErr: "",
              managerAuditeeNameErr: "",
              auditorEmailErr: "",
              auditorNameErr: "",
              subAuditeeEmailErr: "",
              subAuditeeNameErr: "",
              branchErr: "",
              locationErr: "",
              companyErr: "",
            };
          });

          const id = templateNameList.filter(
            (item) => item.label.trim() === rowValues[0].templateName?.trim()
          )[0]?.value;

          if (id) {
            const updateRows = rowValues.map((item) => {
              return { ...item, templateID: id };
            });

            setTemplateName(rowValues[0].templateName?.trim());
            setTemplateNameList([rowValues[0].templateName.trim()]);
            setAssignmentPayload(updateRows);
          } else {
            toast.error(
              `${rowValues[0].templateName?.trim()} Template doesn't exist!`
            );
          }
        }
      })
      .catch((error) => toast.error(error));
  };

  const deleteRow = (id) => {
    if (assignmentPayload?.length > 1) {
      const temp = [...assignmentPayload];
      const removed = temp.filter((item) => item.id !== id);
      setAssignmentPayload(removed);
    }
  };

  // function to check date validation while Submiitting data or importing from excel
  const checkDateValidationError = () => {
    const todayDate = moment().format("YYYY-MM-DD");
    let arr = false;
    let temparr = [...assignmentPayload];
    assignmentPayload?.map((item, index) => {
      if (moment(todayDate).isAfter(item.startDate)) {
        temparr[index].dateErr = `Please select ${formatedDate(
          todayDate
        )} or after ${formatedDate(todayDate)}`;
        arr = true;
      }
    });
    assignmentPayload?.map((item, index) => {
      // debugger;
      if (item.startDate === "" || item.startDate === null) {
        temparr[index].dateErr = "Please select Date";
        arr = true;
      } else if (item.assignmentName === "" || item.assignmentName === " ") {
        temparr[index].assignmentNameErr = "Please fill assignment name";
        arr = true;
      } else if (
        item.manager_auditee_email === "" ||
        !validEmailRegex.test(
          item.manager_auditee_email || item.manager_auditee_email === " "
        )
      ) {
        temparr[index].managerAuditeeEmailErr = "Please fill valid email";
        arr = true;
      } else if (
        item.manager_auditee_name === "" ||
        item.manager_auditee_name === " "
      ) {
        temparr[index].managerAuditeeNameErr = "Please fill name";
        arr = true;
      } else if (
        item.auditor_email === "" ||
        !validEmailRegex.test(item.auditor_email) ||
        item.auditor_email === " "
      ) {
        temparr[index].auditorEmailErr = "Please fill valid email";
        arr = true;
      } else if (item.auditor_name === "" || item.auditor_name === " ") {
        temparr[index].auditorNameErr = "Please fill name";
        arr = true;
      } else if (
        item.sub_auditee_email === "" ||
        !validEmailRegex.test(item.sub_auditee_email) ||
        item.sub_auditee_email === " "
      ) {
        temparr[index].subAuditeeEmailErr = "Please fill valid email";
        arr = true;
      } else if (
        item.sub_auditee_name === "" ||
        item.sub_auditee_name === " "
      ) {
        temparr[index].subAuditeeNameErr = "Please fill name";
        arr = true;
      } else if (item.branchCode === "" || item.branchCode === " ") {
        temparr[index].branchErr = "Please fill branch code";
        arr = true;
      } else if (item.location === "" || item.location === " ") {
        temparr[index].locationErr = "Please fill location";
        arr = true;
      } else if (item.company === "" || item.company === " ") {
        temparr[index].companyErr = "Please fill company name";
        arr = true;
      }
    });
    setAssignmentPayload(temparr);
    return arr;
  };

  const handleNext = () => {
    if (templateName === "") {
      toast.error("Please select template!!");
      window.scrollTo(0, 0);
    } else if (checkDateValidationError()) {
      toast.error("please fill the required data");
    } else {
      setMultiAssignmentList(assignmentPayload);
      setMultipleAssignmentStep(1);
    }
  };

  // const handleOnBlur = (event, currentIndex) => {
  //   const tempArray = [...assignmentPayload];

  //   const { value } = event.target;
  //   const findCode = branchCodes.filter((item) => item.branch_code === value);
  //   if (findCode && findCode.length > 0) {
  //     tempArray[currentIndex]["location"] = findCode[0].branch_location;
  //     setAssignmentPayload(tempArray);

  //     tempArray[currentIndex]["locationID"] = findCode[0].branch_docname;
  //     setAssignmentPayload(tempArray);
  //   } else {
  //     tempArray[currentIndex]["location"] = "";
  //     setAssignmentPayload(tempArray);
  //   }
  // };

  const fetchTemplateNameList = () => {
    try {
      setIsLoading(true);
      axiosInstance.get("audit.api.getAuditTemplateList").then((response) => {
        if (response?.data?.message?.status === true) {
          const tempArray = [];
          response.data.message.at_list.map((item) => {
            tempArray.push({
              label: item.audit_template_name,
              value: item.audit_template_id,
            });
          });

          setTemplateNameList(tempArray);
          setIsLoading(false);
        } else {
          setTemplateNameList([]);
          setIsLoading(false);
        }
      });
    } catch (err) {
      setIsLoading(false);
      toast.error("something went wrong");
    }
  };

  const fetchBranchList = () => {
    try {
      axiosInstance
        .post("audit.api.getBranchDetails", {
          company: "",
        })
        .then((response) => {
          if (response?.data?.message?.status === true) {
            const { company_branch_list } = response?.data?.message;
            setBranchCode(company_branch_list);
          } else {
          }
        });
    } catch (err) {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    fetchTemplateNameList();
    fetchBranchList();
  }, []);

  return (
    <div>
      <BackDrop isLoading={isLoading} />

      {importError && importError?.length !== 0 && (
        <div className={styles.errorContainer}>
          <h5>Import Error</h5>
          <div className={styles.errorMessage}>
            {importError.map((error, index) => (
              <p key={index}>
                Row {error.row}. {error.column} is required
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between mt-4 ">
        <div className="d-flex align-items-center">
          <Input
            type="select"
            variant="auditAssignmentInput"
            labelText="Template Name"
            labelVariant="labelMultipleAssignment"
            placeholder="Select Template"
            name="templateId"
            className="ml-2"
            valueForDropDown={templateNameList}
            value={templateName || null}
            onChange={handleSelect}
          />
        </div>
        <div className="d-flex">
          <a
            href={`https://dev.compliancesutra.com/files/Multiple_Assignments_Format_sample.xlsx`}
            download={`${templateName}.xlsx`}
            style={{ marginRight: 10 }}
          >
            <Button
              description=" Download Template"
              size="large"
              disabled={!templateName && true}
            ></Button>
          </a>

          <Button
            description="Import Assignments"
            size="large"
            onClick={uploadFile}
            disabled={!templateName && true}
            //style={{ pointerEvents: templateName ? "" : "none" }}
          />
          <input
            type="file"
            hidden
            ref={inputFileRef}
            onChange={handleUploadFile}
          />
        </div>
      </div>

      {assignmentPayload &&
        assignmentPayload.length > 0 &&
        assignmentPayload.map((item, index) => {
          return (
            <>
              {assignmentPayload?.length > 1 && (
                <BsTrashFill
                  className="float-right mt-2"
                  style={{ cursor: "pointer" }}
                  disabled={assignmentPayload?.length === 1}
                  onClick={() => deleteRow(item.id)}
                />
              )}
              <div className="row mt-4" key={index}>
                <div className="col-4 col-md-3 col-lg-2">
                  <Input
                    type="text"
                    variant="inputMultipleAssignmentAudit"
                    labelText="Audit Name"
                    labelVariant="labelMultipleAssignmentAudit"
                    name="assignmentName"
                    required={true}
                    value={item.assignmentName}
                    onChange={(event) => handleInputChange(event, index)}
                  />
                  {item?.assignmentNameErr?.length > 0 && (
                    <Text
                      heading="p"
                      variant="error"
                      text={item?.assignmentNameErr}
                    />
                  )}
                </div>
                <div className="col-4 col-md-3 col-lg-2">
                  <Input
                    type="date"
                    variant="inputMultipleAssignmentAudit"
                    labelText="Start Date"
                    labelVariant="labelMultipleAssignmentAudit"
                    required={true}
                    name="startDate"
                    value={
                      item.startDate ? moment(item.startDate, dateFormat) : ""
                    }
                    onChange={(event) => handleDateChange(event, index)}
                  />
                  {item?.dateErr?.length > 0 && (
                    <Text heading="p" variant="error" text={item?.dateErr} />
                  )}
                </div>
                <div className="col-4 col-md-3 col-lg-2">
                  <Input
                    type="text"
                    variant="inputMultipleAssignmentAudit"
                    labelText="Manager Auditee Email"
                    required={true}
                    labelVariant="labelMultipleAssignmentAudit"
                    name="manager_auditee_email"
                    value={item.manager_auditee_email}
                    onChange={(event) => {
                      let _value = event.target.value;
                      if (isEmail(_value)) {
                        fetchUserDetails(_value, "manager_auditee_name", index);
                      }
                      handleInputChange(event, index);
                    }}
                  />
                  {item?.managerAuditeeEmailErr?.length > 0 && (
                    <Text
                      heading="p"
                      variant="error"
                      text={item?.managerAuditeeEmailErr}
                    />
                  )}
                </div>
                <div className="col-4 col-md-3 col-lg-2">
                  <Input
                    type="text"
                    variant="inputMultipleAssignmentAudit"
                    labelText="Manager Auditee Name"
                    labelVariant="labelMultipleAssignmentAudit"
                    name="manager_auditee_name"
                    value={item.manager_auditee_name}
                    onChange={(event) => handleInputChange(event, index)}
                    required={true}
                  />
                  {item?.managerAuditeeNameErr?.length > 0 && (
                    <Text
                      heading="p"
                      variant="error"
                      text={item?.managerAuditeeNameErr}
                    />
                  )}
                </div>
                <div className="col-4 col-md-3 col-lg-2">
                  <Input
                    type="text"
                    variant="inputMultipleAssignmentAudit"
                    labelText="Head of Auditor Email"
                    labelVariant="labelMultipleAssignmentAudit"
                    name="auditor_email"
                    value={item.auditor_email}
                    required={true}
                    onChange={(event) => {
                      let _value = event.target.value;
                      if (isEmail(_value)) {
                        fetchUserDetails(_value, "auditor_name", index);
                      }
                      handleInputChange(event, index);
                    }}
                  />
                  {item?.auditorEmailErr?.length > 0 && (
                    <Text
                      heading="p"
                      variant="error"
                      text={item?.auditorEmailErr}
                    />
                  )}
                </div>
                <div className="col-4 col-md-3 col-lg-2">
                  <Input
                    type="text"
                    variant="inputMultipleAssignmentAudit"
                    labelText="Head of Auditor Name"
                    labelVariant="labelMultipleAssignmentAudit"
                    name="auditor_name"
                    required={true}
                    value={item.auditor_name}
                    onChange={(event) => handleInputChange(event, index)}
                  />
                  {item?.auditorNameErr?.length > 0 && (
                    <Text
                      heading="p"
                      variant="error"
                      text={item?.auditorNameErr}
                    />
                  )}
                </div>
                <div className="col-4 col-md-3 col-lg-2">
                  <Input
                    type="text"
                    variant="inputMultipleAssignmentAudit"
                    labelText="SubAuditee Email"
                    labelVariant="labelMultipleAssignmentAudit"
                    required={true}
                    name="sub_auditee_email"
                    value={item.sub_auditee_email}
                    onChange={(event) => {
                      let _value = event.target.value;
                      if (isEmail(_value)) {
                        fetchUserDetails(_value, "sub_auditee_name", index);
                      }
                      handleInputChange(event, index);
                    }}
                  />
                  {item?.subAuditeeEmailErr?.length > 0 && (
                    <Text
                      heading="p"
                      variant="error"
                      text={item?.subAuditeeEmailErr}
                    />
                  )}
                </div>
                <div className="col-4 col-md-3 col-lg-2">
                  <Input
                    type="text"
                    variant="inputMultipleAssignmentAudit"
                    labelText="SubAuditee Name"
                    labelVariant="labelMultipleAssignmentAudit"
                    name="sub_auditee_name"
                    required={true}
                    value={item.sub_auditee_name}
                    onChange={(event) => handleInputChange(event, index)}
                  />
                  {item?.subAuditeeNameErr?.length > 0 && (
                    <Text
                      heading="p"
                      variant="error"
                      text={item?.subAuditeeNameErr}
                    />
                  )}
                </div>
                <div className="col-4 col-md-3 col-lg-2">
                  <Input
                    type="text"
                    variant="inputMultipleAssignmentAudit"
                    labelText="Company"
                    required={true}
                    labelVariant="labelMultipleAssignmentAudit"
                    name="company"
                    value={item.company}
                    onChange={(event) => handleInputChange(event, index)}
                    // disabled={item.isDisable}
                  />
                  {item?.companyErr?.length > 0 && (
                    <Text heading="p" variant="error" text={item?.companyErr} />
                  )}
                </div>
                <div className="col-4 col-md-3 col-lg-2 mt-2">
                  <Input
                    type="text"
                    variant="inputMultipleAssignmentAudit"
                    labelText="Branch Code"
                    labelVariant="labelMultipleAssignmentAudit"
                    name="branchCode"
                    required={true}
                    value={item.branchCode}
                    onChange={(event) => handleInputChange(event, index)}
                    // onBlur={(event) => handleOnBlur(event, index)}
                    // disabled={item.isDisable}
                  />
                  {item?.branchErr?.length > 0 && (
                    <Text heading="p" variant="error" text={item?.branchErr} />
                  )}
                </div>
                <div className="col-4 col-md-3 col-lg-2 mt-2">
                  <Input
                    type="text"
                    variant="inputMultipleAssignmentAudit"
                    labelText="Location"
                    labelVariant="labelMultipleAssignmentAudit"
                    name="location"
                    required={true}
                    value={item.location}
                    onChange={(event) => handleInputChange(event, index)}
                    // disabled={item.isDisable}
                  />
                  {item?.locationErr?.length > 0 && (
                    <Text
                      heading="p"
                      variant="error"
                      text={item?.locationErr}
                    />
                  )}
                </div>
              </div>
              <div className={styles.break}></div>
            </>
          );
        })}
      <IconButton
        icon={<AiFillPlusCircle />}
        variant="addIcon"
        // disabled={addMoreDisabled}
        description="ADD More"
        onClick={addMoreBranchRow}
        size="small"
      />
      <div className="d-flex mt-3">
        {/* <div>
          <Button
            description="cancel"
            size="largeNoBackground"
            onClick={() => setIsMultiple(false)}
          />
        </div> */}
        <div>
          <Button description="Next" size="large" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default CreateMultipleAssignment;
