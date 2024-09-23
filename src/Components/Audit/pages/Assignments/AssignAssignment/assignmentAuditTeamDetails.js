import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { Input } from "../../../components/Inputs/Input";
import Text from "../../../components/Text/Text";
import IconButton from "../../../components/Buttons/IconButton";
import Button from "../../../components/Buttons/Button";
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai";
import Container from "../../../components/Containers";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router";
import axiosInstance from "../../../../../apiServices";
import { BACKEND_BASE_URL } from "../../../../../apiServices/baseurl";
import { useDispatch } from "react-redux";

import { setAssignmentDetail } from "../../../redux/actions";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
import { fetchUsersDetailById } from "Components/Audit/components/Helpers/data.helpers";
import isEmail from "validator/lib/isEmail";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { validEmailRegex } from "Components/Audit/components/Helpers/string.helpers";

function AssignmentAuditTeamDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const previousPath = history?.location?.state?.path;
  const [auditTeamDetails, setAuditTeamDetails] = useState([
    {
      team_member: "",
      team_member_email: "",
      designation: "",
      team_memberErr: "",
      team_member_emailErr: "",
      designationErr: "",
    },
  ]);
  const [errors, setErrors] = useState({
    branch_auditor_incharge: "",
    auditor_incharge_email: "",
  });
  const [auditorDetails, setAuditorDetails] = useState({
    branch_auditor_incharge: "",
    auditor_incharge_email: "",
  });

  const debouncedAuditorInchangeEmail = useDebounce(
    auditorDetails?.auditor_incharge_email,
    300
  );

  
  //form validate function
  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const isTeamDetailsAddMoreDisabled = auditTeamDetails?.some(
    (item) =>
      !item.team_member?.trim() ||
      !item.team_member_email?.trim() ||
      !validEmailRegex.test(item.team_member_email) ||
      !item.designation?.trim()
  );

  const onFieldsChange = (event) => {
    const { name, value } = event.target;
    const trimmedVlaue = value?.trim();
    switch (name) {
      case "auditor_incharge_email":
        setErrors({
          ...errors,
          auditor_incharge_email:
            trimmedVlaue === "" || trimmedVlaue === " "
              ? ""
              : validEmailRegex.test(trimmedVlaue)
              ? ""
              : "Email is not valid",
        });
        break;
    }
    setAuditorDetails({
      ...auditorDetails,
      [name]: removeWhiteSpaces(trimmedVlaue),
    });
  };

  // Audit Team Details functions ------>

  const auditTeamInputChange = (event, index) => {
    const { name, value } = event.target;
    const list = [...auditTeamDetails];
    list[index][name] = removeWhiteSpaces(value);
    if (name === "team_member_email") {
      if (validEmailRegex.test(value) && value && isEmail(value)) {
        fetchUsersDetailById(value).then((data) => {
          list[index].team_member = data?.full_name || "";
          list[index].designation = data?.designation || "";
          list[index].team_member_emailErr = "";
          setAuditTeamDetails([...list]);
        });
      } else {
        list[index].team_member_emailErr = "Invalid Email";
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
    setAuditTeamDetails([
      ...auditTeamDetails,
      {
        team_member: "",
        team_member_email: "",
        designation: "",
        team_memberErr: "",
        team_member_emailErr: "",
        designationErr: "",
      },
    ]);
  };

  const validateAuditTeamDetails = () => {
    let isValid = true;

    const updatedDetails = auditTeamDetails.map((detail) => {
      const { team_member, team_member_email, designation } = detail;
      const isAnyFieldFilled =
        team_member.trim() !== "" ||
        team_member_email.trim() !== "" ||
        designation.trim() !== "";
      if (isAnyFieldFilled) {
        const newDetail = {
          ...detail,
          team_memberErr: team_member.trim() === "" ? "Required" : "",
          team_member_emailErr:
            team_member_email.trim() === "" ? "Required" : "",
          designationErr: designation.trim() === "" ? "Required" : "",
        };
        if (
          team_member_email.trim() !== "" &&
          !validEmailRegex.test(team_member_email)
        ) {
          newDetail.team_member_emailErr = "Invalid Email";
        }
        if (
          newDetail.team_memberErr ||
          newDetail.team_member_emailErr ||
          newDetail.designationErr
        ) {
          isValid = false;
        }
        return newDetail;
      }
      return detail;
    });

    setAuditTeamDetails(updatedDetails);

    return isValid;
  };

  const callDataSubmitApi = () => {
    if (validateForm(errors) && validateAuditTeamDetails()) {
      submitData();
    } else {
      toast.error("please fill the valid and required fields");
    }
  };

  //function to check team detail data is empty or not
  const checkTeamDetailsData = () => {
    let arr = false;
    auditTeamDetails.map((item) => {
      if (
        item.team_member.length === 0 ||
        item.team_member_email.length === 0 ||
        item.designation.length === 0
      ) {
        arr = false;
      } else {
        arr = true;
      }
    });
    return arr;
  };

  //Data Submit api function
  const submitData = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("assignment_id", id);
    for (const key in auditorDetails) {
      formData.append(key, auditorDetails[key] || "");
    }
    formData.append(
      "auditor_team_details",
      checkTeamDetailsData() ? JSON.stringify(auditTeamDetails) : []
    );
    try {
      axiosInstance
        .post("audit.api.AddAuditorDetails", formData)
        .then((data) => {
          if (data?.data.message.status === true) {
            let status_res = data?.data?.message?.status_response;
            setIsLoading(false);
            history.replace({
              pathname: `${previousPath}/assignCheckList`,
              state: {
                path: previousPath,
              },
            });
            if (status_res) {
              toast.success(status_res);
            }
          } else {
            setIsLoading(false);
            toast.error("something went wrong please try again");
          }
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetAuditBasicDetail(id);
  }, []);

  useEffect(() => {
    if (
      debouncedAuditorInchangeEmail &&
      isEmail(debouncedAuditorInchangeEmail)
    ) {
      fetchUsersDetailById(debouncedAuditorInchangeEmail).then((data) => {
        setAuditorDetails({
          ...auditorDetails,
          branch_auditor_incharge: data?.full_name || "",
        });
      });
    }
  }, [debouncedAuditorInchangeEmail]);

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
      dispatch(setAssignmentDetail(apiResponse?.data?.message?.data));
      setAuditorDetails({
        branch_auditor_incharge:
          apiResponse?.data?.message?.data?.branch_auditor_incharge,
        auditor_incharge_email:
          apiResponse?.data?.message?.data?.auditor_incharge_email,
      });
      if (apiResponse?.data?.message?.data?.auditor_team_details.length > 0) {
        setAuditTeamDetails([
          ...apiResponse?.data?.message?.data?.auditor_team_details,
        ]);
      } else {
        setAuditTeamDetails([...auditTeamDetails]);
      }
    }
  };

  return (
    <>
      <BackDrop isLoading={isLoading} />
      <Container variant="content">
        <Text
          heading="h1"
          text="Audit Team Details"
          variant="stepperSubHeading"
        />
        <div className={styles.outerContainer}>
          <Container variant="content">
            <Text
              heading="h1"
              text="Manager Auditor Details"
              variant="stepperSubHeading"
            />
            <div className={`${styles.inputRow} ${styles.inputRowSpacing}`}>
              <div className={styles.flex6}>
                <Input
                  type="email"
                  variant="auditAssignmentInput"
                  labelText="Manager Auditor's email id"
                  placeholder="Enter Email Id here"
                  labelVariant="labelGreyMini"
                  name="auditor_incharge_email"
                  onChange={onFieldsChange}
                  value={auditorDetails.auditor_incharge_email}
                />
                {errors?.auditor_incharge_email?.length > 0 && (
                  <Text
                    heading="p"
                    variant="error"
                    text={errors.auditor_incharge_email}
                  />
                )}
              </div>
              <div className={styles.flex6}>
                <Input
                  variant="auditAssignmentInput"
                  labelText="branch audit incharge"
                  placeholder="Enter audit incharge name here"
                  labelVariant="labelGreyMini"
                  name="branch_auditor_incharge"
                  onChange={onFieldsChange}
                  value={auditorDetails.branch_auditor_incharge}
                />
                {errors?.branch_auditor_incharge?.length > 0 && (
                  <Text
                    heading="p"
                    variant="error"
                    text={errors.branch_auditor_incharge}
                  />
                )}
              </div>
            </div>
            <Text
              heading="p"
              text="Subordinate Auditor's Team  details"
              variant="stepperSubHeading"
            />
            <div>
              {auditTeamDetails.map((item, index) => {
                return (
                  <>
                    <div className={styles.inputRow}>
                      <div className={styles.flex6}>
                        <Input
                          type="email"
                          variant="auditAssignmentInput"
                          labelText="Subordinate Auditor's email id"
                          placeholder="Enter Email Id here"
                          labelVariant="labelGreyMini"
                          name="team_member_email"
                          value={item.team_member_email}
                          onChange={(event) =>
                            auditTeamInputChange(event, index)
                          }
                        />
                        {item?.team_member_emailErr?.length > 0 && (
                          <Text
                            heading="p"
                            variant="error"
                            text={item?.team_member_emailErr}
                          />
                        )}
                      </div>
                      <div className={styles.flex6}>
                        <Input
                          variant="auditAssignmentInput"
                          labelText="Subordinate Auditor's name"
                          placeholder="Enter name"
                          labelVariant="labelGreyMini"
                          name="team_member"
                          value={item.team_member}
                          onChange={(event) =>
                            auditTeamInputChange(event, index)
                          }
                        />
                        {item?.team_memberErr?.length > 0 && (
                          <Text
                            heading="p"
                            variant="error"
                            text={item?.team_memberErr}
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
                          labelText="Subordinate Auditor's's designation"
                          placeholder="Enter designation"
                          labelVariant="labelGreyMini"
                          name="designation"
                          value={item.designation || null}
                          onChange={(event) =>
                            auditTeamInputChange(event, index)
                          }
                        />
                        {item?.designationErr?.length > 0 && (
                          <Text
                            heading="p"
                            variant="error"
                            text={item?.designationErr}
                          />
                        )}
                      </div>
                    </div>
                    {auditTeamDetails?.length !== 1 && (
                      <IconButton
                        icon={<AiFillDelete />}
                        variant="removeIcon"
                        description="Remove"
                        onClick={() => removeAuditTeamFileds(index)}
                        size="small"
                      />
                    )}
                    {auditTeamDetails?.length - 1 === index && (
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
                  </>
                );
              })}
            </div>
          </Container>
          <div className={styles.buttonContainer}>
            <Button
              description="Save"
              onClick={() => {
                callDataSubmitApi();
              }}
            />
            <Button
              description="Cancel"
              variant="preview"
              onClick={() => {
                history.replace(`${previousPath}`);
              }}
            />
          </div>
        </div>
      </Container>
    </>
  );
}

export default AssignmentAuditTeamDetails;
