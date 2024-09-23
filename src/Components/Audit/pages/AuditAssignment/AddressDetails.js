import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import Text from "../../components/Text/Text";
import { Input } from "../../components/Inputs/Input";
import IconButton from "../../components/Buttons/IconButton.jsx";
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../components/Buttons/Button";
import axiosInstance from "../../../../apiServices";
import { toast } from "react-toastify";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";
import {
  setAssignmentDetail,
  setAuditAddressDetails,
} from "../../redux/actions";
import { useLocation } from "react-router";
import api from "Components/Audit/api";
import { fetchUsersDetailById } from "Components/Audit/components/Helpers/data.helpers";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import { validEmailRegex } from "Components/Audit/components/Helpers/string.helpers";
function AddressDetails({
  next,
  stepper,
  auditTeamDetails,
  setAuditTeamDetails,
  branchData,
  setBranchData,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    address_title: "",
    address_line1: "",
    pincode: "",
    state: "",
    city: "",
    branch_auditee_incharge: "",
    auditee_incharge_email: "",
  });
  const state = useSelector((state) => state);
  const assignmentDetails = useSelector(
    (state) => state?.AuditReducer?.assignmentDetail
  );
  const dispatch = useDispatch();

  const location = useLocation();
  const assignment_id =
    new URLSearchParams(location.search).get("id") ||
    state?.AuditReducer?.assignmentId;

  useEffect(() => {
    if (assignmentDetails && assignment_id) {
      setBranchData({
        ...branchData,
        address_title: assignmentDetails.address_title,
        address_line1: assignmentDetails.address_line1,
        pincode: assignmentDetails.pincode,
        state: assignmentDetails.state,
        city: assignmentDetails.city,
        branch_auditee_incharge: assignmentDetails.branch_auditee_incharge,
        auditee_incharge_email: assignmentDetails.auditee_incharge_email,
      });

      if (
        assignmentDetails.audit_team_details &&
        assignmentDetails.audit_team_details.length > 0
      ) {
        let teamDetailsTemp = assignmentDetails.audit_team_details?.map(
          (item) => {
            return {
              ...item,
              EmailErr: "",
              MobileErr: "",
              CountryCodeErr: "",
              DesignationErr: "",
              TeamMemberErr: "",
            };
          }
        );
        setAuditTeamDetails(teamDetailsTemp);
      }
    } else {
      setAuditTeamDetails(auditTeamDetails);
      setBranchData({
        ...branchData,
        address_title: "",
        address_line1: "",
        pincode: "",
        state: "",
        city: "",
        branch_auditee_incharge: "",
        auditee_incharge_email: "",
      });
    }
  }, [assignmentDetails, assignment_id]);


  const fetchAndSetUserDetailsByEmail = async () => {
    try {
      const { data, status } = await api.fetchUsersDetailByEmail(
        branchData.auditee_incharge_email
      );

      if (status === 200 && data?.message?.status) {
        const { full_name } = data?.message?.data;
        setBranchData({
          ...branchData,
          branch_auditee_incharge: full_name,
        });
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const requiredFields = [
    "address_title",
    "pincode",
    "state",
    "city",
    "branch_auditee_incharge",
    "auditee_incharge_email",
  ];

  const isFormValid = requiredFields.every(
    (fieldName) =>
      branchData[fieldName] !== "" &&
      branchData[fieldName] !== " " &&
      branchData[fieldName] !== null
  );

  const onBranchData = ({ target: { name, value } }) => {
    const updatedErrors = { ...errors };
    const validateEmptyValue = (fieldName, errorMessage) => {
      updatedErrors[fieldName] = value.length === 0 ? errorMessage : "";
    };
    let fields_name = {
      address_title: "Address title",
      address_line1: "Address Line 1",
      state: "State",
      city: "City",
      branch_auditee_incharge: "Auditee manager name",
    };
    switch (name) {
      case "address_title":
      case "state":
      case "city":
      case "branch_auditee_incharge":
        validateEmptyValue(name, `${fields_name?.[name]} can't be empty`);
        break;
      case "pincode":
        updatedErrors.pincode =
          value.length === 6 ? "" : "Please enter 6 digit pincode";
        break;
      case "auditee_incharge_email":
        updatedErrors.auditee_incharge_email = validEmailRegex.test(value)
          ? ""
          : "Email is not valid";
        break;
    }
    setErrors(updatedErrors);
    setBranchData({
      ...branchData,
      [name]: removeWhiteSpaces(value),
    });
  };

  // Audit Team Details functions ------>
  //function to set Audit team state
  const auditTeamInputChange = (event, index) => {
    const { name, value } = event.target;
    const list = [...auditTeamDetails];
    list[index][name] = removeWhiteSpaces(value);
    if (name === "team_member_email") {
      if (
        value?.trim() !== "" &&
        value?.trim() !== " " &&
        !validEmailRegex.test(value)
      ) {
        list[index].EmailErr = "Please enter valid email";
      } else if (
        assignmentDetails.audit_team_details?.find(
          (item) => item.team_member_email === value
        )
      ) {
        list[index].EmailErr = "Email already exists in Member Details";
      } else {
        list[index].EmailErr = "";
        fetchUsersDetailById(value).then((data) => {
          list[index].designation = data?.designation || "";
          list[index].team_member = data?.full_name || "";
          list[index].mobile_no = data?.mobile_no || "";
          setAuditTeamDetails([...list]);
        });
      }
    } else if (name === "mobile_no") {
      if (
        value?.length !== 10 &&
        value?.trim() !== "" &&
        value?.trim() !== " "
      ) {
        list[index].MobileErr = "Mobile number must be 10 digits";
      } else if (
        assignmentDetails.audit_team_details?.find(
          (item) => item.mobile_no === value
        )
      ) {
        list[index].MobileErr =
          "Mobile number already exists in Member Details";
      } else {
        list[index].MobileErr = "";
      }
    }
    setAuditTeamDetails(list);
  };

  //function to remove Audit team Details Field
  const removeAuditTeamFileds = (index) => {
    const list = [...auditTeamDetails];
    list.splice(index, 1);
    setAuditTeamDetails(list);
  };

  //function to add new Team Member Details
  const addTeamMemberField = () => {
    const isAnyFieldEmpty = auditTeamDetails.some((item) => {
      return (
        item.team_member?.trim().length === 0 ||
        item.team_member_email?.trim().length === 0 ||
        item.designation?.trim().length === 0 ||
        item.mobile_no?.trim().length === 0
      );
    });

    if (!isAnyFieldEmpty) {
      // Clear all the errors if all fields are filled
      const updatedAuditTeamDetails = auditTeamDetails.map((item) => {
        return {
          ...item,
          TeamMemberErr: "",
          EmailErr: "",
          DesignationErr: "",
          MobileErr: "",
        };
      });

      setAuditTeamDetails([
        ...updatedAuditTeamDetails,
        {
          team_member: "",
          team_member_email: "",
          designation: "",
          mobile_no: "",
          country_code: "91",
          EmailErr: "",
          MobileErr: "",
          CountryCodeErr: "",
          DesignationErr: "",
          TeamMemberErr: "",
        },
      ]);
    } else {
      setAuditTeamDetails([
        ...auditTeamDetails,
        {
          team_member: "",
          team_member_email: "",
          designation: "",
          mobile_no: "",
          country_code: "91",
          EmailErr: "",
          MobileErr: "",
          CountryCodeErr: "",
          DesignationErr: "",
          TeamMemberErr: "",
        },
      ]);
    }
  };

  //form validate function
  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  //pincode check function and set state & city
  const pinCodeCehck = async (val) => {
    try {
      setIsLoading(true);
      const data = await axiosInstance.post("audit.api.CheckPincode", {
        pincode: branchData?.pincode,
      });
      if (data?.data?.message.status === true) {
        setBranchData({
          ...branchData,
          pincode: val,
          state: data.data.message.state,
          city: data.data.message.city,
        });
        setErrors({
          ...errors,
          pincode: "",
        });
        setIsLoading(false);
      } else {
        setErrors({
          ...errors,
          pincode: "Invalid Pincode",
        });
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  //final data submit function
  const callDataSubmitApi = () => {
    const requiredFields = {
      address_title: "Please enter Address title",
      pincode: "Please enter pincode",
      state: "Please provide state",
      city: "Please provide city",
      branch_auditee_incharge: "Please provide branch auditee manager",
      auditee_incharge_email: "Please provide email for auditing manager",
    };
    for (const field in requiredFields) {
      if (
        !branchData[field] ||
        branchData[field]?.length === 0 ||
        branchData[field] === " "
      ) {
        toast.error(requiredFields[field]);
        setErrors({ ...errors, [field]: requiredFields[field] });
        return;
      }
    }
    if (validateForm(errors)) {
      if (CheckTeamDetailsValidation()) {
        submitData();
      } else {
        toast.error("please check team details");
      }
    } else {
      toast.error("Please fill the valid and required fields");
    }
  };

  //function to check team detail data is empty or not
  const checkTeamDetailsData = () => {
    let arr = false;
    auditTeamDetails?.map((item) => {
      if (
        item?.team_member.length === 0 ||
        item?.team_member_email.length === 0 ||
        item?.designation.length === 0
      ) {
        arr = false;
      } else if (item?.MobileErr?.length !== 0) {
        return (arr = false);
      } else if (item?.EmailErr?.length !== 0) {
        return (arr = false);
      } else {
        arr = true;
      }
    });
    return arr;
  };

  const CheckTeamDetailsValidation = () => {
    let isValid = true;
    let isAnyFieldFilled = false;

    const updatedAuditTeamDetails = auditTeamDetails.map((item) => {
      const { team_member, team_member_email, designation, mobile_no } = item;

      const updatedItem = {
        ...item,
        TeamMemberErr: "",
        EmailErr: "",
        DesignationErr: "",
        MobileErr: "",
      };

      if (
        team_member?.trim().length > 0 ||
        team_member_email?.trim().length > 0 ||
        designation?.trim().length > 0 ||
        mobile_no?.trim().length > 0
      ) {
        isAnyFieldFilled = true;

        if (team_member?.trim().length === 0) {
          updatedItem.TeamMemberErr = "This field is required";
          isValid = false;
        }

        if (team_member_email?.trim().length === 0) {
          updatedItem.EmailErr = "This field is required";
          isValid = false;
        }

        if (designation?.trim().length === 0) {
          updatedItem.DesignationErr = "This field is required";
          isValid = false;
        }

        if (mobile_no?.trim().length === 0) {
          updatedItem.MobileErr = "This field is required";
          isValid = false;
        }
      }

      return updatedItem;
    });
    if (!isAnyFieldFilled) {
      // If no field is filled, clear all the errors
      updatedAuditTeamDetails.forEach((item) => {
        item.TeamMemberErr = "";
        item.EmailErr = "";
        item.DesignationErr = "";
        item.MobileErr = "";
      });
    }
    setAuditTeamDetails(updatedAuditTeamDetails);
    return isValid;
  };

  //Data Submit api function
  const submitData = () => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("assignment_id", assignment_id);
    for (const key in branchData) {
      formData.append(key, branchData[key]);
    }

    formData.append("steps", 8);
    formData.append("assignemt_id", assignment_id ? assignment_id : "");
    // checkTeamDetailsData();
    formData.append(
      "audit_team_details",
      checkTeamDetailsData() ? JSON.stringify(auditTeamDetails) : []
    );
    // formData.append("audit_team_details", JSON.stringify(auditTeamDetails));

    try {
      axiosInstance
        .post("audit.api.AddAddressAndAuditorDetails", formData)
        .then((data) => {
          if (data?.data.message.status === true) {
            setIsLoading(false);
            dispatch(setAuditAddressDetails(branchData));
            next(stepper?.stepperAcitveSlide);
          } else {
            setIsLoading(false);
            toast.error(data?.data.message.status_response);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    } catch (err) {
      console.log("exception error", err);
    }
  };

  const isTeamDetailsAddMoreDisabled = auditTeamDetails?.some(
    (item) =>
      !item.team_member?.trim() ||
      !item.team_member_email?.trim() ||
      !validEmailRegex.test(item.team_member_email) ||
      !item.designation?.trim() ||
      !item.mobile_no ||
      item.mobile_no.length !== 10
  );

  //Fetch Assignment Details
  const fetchAndSetAuditBasicDetail = async (id) => {
    const apiResponse = await api.fetchAssignmentDetails(id);
    if (apiResponse?.data?.message?.status) {
      dispatch(setAssignmentDetail(apiResponse?.data?.message?.data));
    }
  };

  useEffect(() => {
    const _email = branchData.auditee_incharge_email;
    if (validEmailRegex.test(_email)) {
      fetchAndSetUserDetailsByEmail();
    }
  }, [branchData.auditee_incharge_email]);

  useEffect(() => {
    if (assignment_id) {
      fetchAndSetAuditBasicDetail(assignment_id);
    }
  }, [assignment_id]);

  return (
    <>
      <BackDrop isLoading={isLoading} />
      <Text heading="p" text="location" variant="stepperSubHeading" />
      <div className={styles.inputRow}>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="Address 1"
            required={true}
            placeholder="Eg. Street No./House No."
            labelVariant="labelGreyMini"
            name="address_title"
            onChange={onBranchData}
            value={branchData?.address_title}
          />
          {errors?.address_title.length > 0 && (
            <Text heading="p" variant="error" text={errors.address_title} />
          )}
        </div>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="Address 2"
            required={false}
            placeholder="Eg. Gali No./ Nearby location"
            labelVariant="labelGreyMini"
            name="address_line1"
            onChange={onBranchData}
            value={branchData?.address_line1}
          />
          {errors?.address_line1.length > 0 && (
            <Text heading="p" variant="error" text={errors.address_line1} />
          )}
        </div>
      </div>
      <div className={styles.inputRow}>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="pincode"
            required={true}
            placeholder="Enter 6 digit pincode"
            labelVariant="labelGreyMini"
            name="pincode"
            type="text"
            pattern="[0-9]{6}"
            onChange={(e) => {
              const value = e.target.value;
              if (!value || (/^[0-9]{0,6}$/.test(value) && value.length <= 6)) {
                onBranchData(e);
              }
            }}
            value={branchData?.pincode}
            onBlur={(event) => {
              pinCodeCehck(event.target.value);
            }}
          />
          {errors?.pincode.length > 0 && (
            <Text heading="p" variant="error" text={errors.pincode} />
          )}
        </div>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            labelText="District/City"
            required={true}
            placeholder="Enter district/city here"
            labelVariant="labelGreyMini"
            name="city"
            onChange={onBranchData}
            value={branchData?.city}
          />
          {errors?.city.length > 0 && (
            <Text heading="p" variant="error" text={errors.city} />
          )}
        </div>
      </div>
      <div className={`${styles.inputRow} ${styles.inputRowSpacing}`}>
        <div className={styles.flex6}>
          <Input
            type="text"
            variant="auditAssignmentInput"
            labelText="state"
            required={true}
            placeholder="Select State"
            labelVariant="labelGreyMini"
            name="state"
            onChange={onBranchData}
            value={branchData?.state}
          />
          {errors?.state.length > 0 && (
            <Text heading="p" variant="error" text={errors.state} />
          )}
        </div>
      </div>
      <Text
        heading="p"
        text="Manager Auditee details"
        variant="stepperSubHeading"
      />
      <div className={`${styles.inputRow} ${styles.inputRowSpacing}`}>
        <div className={styles.flex6}>
          <Input
            type="email"
            variant="auditAssignmentInput"
            labelText="Manager Auditee email id"
            required={true}
            placeholder="Enter Email Id here"
            labelVariant="labelGreyMini"
            name="auditee_incharge_email"
            onChange={onBranchData}
            value={branchData?.auditee_incharge_email}
          />
          {errors?.auditee_incharge_email.length > 0 && (
            <Text
              heading="p"
              variant="error"
              text={errors.auditee_incharge_email}
            />
          )}
        </div>
        <div className={styles.flex6}>
          <Input
            variant="auditAssignmentInput"
            required={true}
            labelText="Manager Auditee"
            placeholder="Enter audit incharge name here"
            labelVariant="labelGreyMini"
            name="branch_auditee_incharge"
            onChange={onBranchData}
            value={branchData?.branch_auditee_incharge}
          />
          {errors?.branch_auditee_incharge.length > 0 && (
            <Text
              heading="p"
              variant="error"
              text={errors.branch_auditee_incharge}
            />
          )}
        </div>
      </div>
      <Text
        heading="p"
        text="Subordinate Auditee details (Optional)"
        variant="stepperSubHeading"
      />
      <div>
        {auditTeamDetails?.map((item, index) => {
          return (
            <div key={index}>
              <div className={styles.inputRow}>
                <div className={styles.flex6}>
                  <Input
                    type="email"
                    variant="auditAssignmentInput"
                    labelText="team member's email id"
                    placeholder="Enter Email Id here"
                    labelVariant="labelGreyMini"
                    name="team_member_email"
                    value={item.team_member_email}
                    onChange={(event) => auditTeamInputChange(event, index)}
                  />
                  {item?.EmailErr?.length > 0 && (
                    <Text heading="p" variant="error" text={item.EmailErr} />
                  )}
                </div>
                <div className={styles.flex6}>
                  <Input
                    variant="auditAssignmentInput"
                    labelText="team member's name"
                    placeholder="Enter name"
                    labelVariant="labelGreyMini"
                    name="team_member"
                    value={item.team_member}
                    onChange={(event) => auditTeamInputChange(event, index)}
                  />
                  {item?.TeamMemberErr?.length > 0 && (
                    <Text
                      heading="p"
                      variant="error"
                      text={item.TeamMemberErr}
                    />
                  )}
                </div>
              </div>
              <div
                className={`${styles.inputRow} ${styles.inputRowSpacingTeamSection}`}
              >
                <div className={styles.flex6}>
                  <Input
                    type="text"
                    variant="auditAssignmentInput"
                    labelText="team member's designation"
                    placeholder="Enter designation"
                    labelVariant="labelGreyMini"
                    name="designation"
                    value={item.designation}
                    onChange={(event) => auditTeamInputChange(event, index)}
                  />
                  {item?.DesignationErr?.length > 0 && (
                    <Text
                      heading="p"
                      variant="error"
                      text={item.DesignationErr}
                    />
                  )}
                </div>
                <div className={styles.flex6}>
                  <div className="row align-items-baseline">
                    <div className="col-4">
                      <Input
                        variant="auditAssignmentInput"
                        labelText="code"
                        placeholder="91"
                        maxLength={3}
                        pattern="[0-9]{3}"
                        labelVariant="labelGreyMini"
                        type="text"
                        name="country_code"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!value || /^[0-9]{0,3}$/.test(value)) {
                            auditTeamInputChange(e, index);
                          }
                        }}
                        value={item?.country_code}
                      />
                    </div>
                    <div className="col-8">
                      <Input
                        type="text"
                        variant="auditAssignmentInput"
                        labelText="Team member's mobile number"
                        placeholder="Enter mobile number"
                        maxLength={10}
                        labelVariant="labelGreyMini"
                        pattern="[0-9]{10}"
                        name="mobile_no"
                        value={item.mobile_no}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!value || /^[0-9]{0,10}$/.test(value)) {
                            auditTeamInputChange(e, index);
                          }
                        }}
                      />
                      {item?.MobileErr?.length > 0 && (
                        <Text
                          heading="p"
                          variant="error"
                          text={item.MobileErr}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {auditTeamDetails.length !== 1 && (
                <IconButton
                  icon={<AiFillDelete />}
                  variant="removeIcon"
                  description="Remove"
                  onClick={() => removeAuditTeamFileds(index)}
                  size="small"
                />
              )}
              {auditTeamDetails.length - 1 === index && (
                <IconButton
                  icon={<AiFillPlusCircle />}
                  variant="addIcon"
                  disabledVariant="addIconDisabled"
                  description="ADD NEW MEMBER"
                  disabled={isTeamDetailsAddMoreDisabled}
                  onClick={addTeamMemberField}
                  size="small"
                />
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          description="Next"
          disabled={!validateForm(errors) || !isFormValid}
          onClick={() => {
            callDataSubmitApi();
          }}
        />
      </div>
    </>
  );
}

export default AddressDetails;
