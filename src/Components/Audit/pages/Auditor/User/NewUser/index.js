/* eslint-disable default-case */
import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import styles from "./style.module.scss";
import { Input } from "../../../../components/Inputs/Input.jsx";
import { MdClose } from "react-icons/md";
import IconButton from "../../../../components/Buttons/IconButton";
import Button from "../../../../components/Buttons/Button";
import CreatableSelect from "react-select/creatable";
import axiosInstance from "../../../../../../apiServices";
import { useDispatch, useSelector } from "react-redux";
import { setEditState } from "../../../../redux/actions";
import { toast } from "react-toastify";
import BackDrop from "../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { actions as signInSignUpActions } from "../../../../../Authectication/redux/actions";

import Select from "react-select";
import { validEmailRegex } from "Components/Audit/components/Helpers/string.helpers";

const initialState = {
  user_docname: null,
  first_name: "",
  expertise: "",
  company: "",
  phone: "",
  email: "",
  role: "",
};

// custom style for dropdown
const customStyle = {
  control: (styles) => ({
    ...styles,
    width: "100%",
    height: "45px",
    borderRadius: "6px",
    background: "#f6f9fb",
    border: "0px",
    "&:hover": {
      outline: "2px solid #6c5dd3 !important",
      boxShadow: "0 0 4px rgb(165 165 165 / 71%)",
      border: "0px",
      borderColor: "transparent",
    },
    "&:focus": {
      outline: "2px solid #6c5dd3 !important",
      boxShadow: "0 0 4px rgb(165 165 165 / 71%)",
      border: "0px",
      borderColor: "transparent",
    },
  }),
};
export default function CreateUser({ handleClose, open, data }) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState(initialState);
  const [userRoles, setuserRoles] = useState([]);

  const [companyListData, setCompanyList] = useState([]);
  const [experList, setExpertList] = useState([]);
  const [error, setError] = useState({
    userNameErr: "",
    expertiseErr: "",
    companyNameErr: "",
    phoneNoErr: "",
    emailIdErr: "",
  });

  const dispatch = useDispatch();

  const state = useSelector((state) => state);

  const FecthUserRoleList = () => {
    try {
      axiosInstance.get("compliance.api.getUserRoles").then((res) => {
        if (res?.status === 200) {
          let userList = res?.data?.message
            .filter((item) => item?.audit === 1)
            .map((items) => {
              return {
                label: items?.role,
                value: items?.role,
              };
            });
          setuserRoles(userList || []);
        }
      });
    } catch (err) {
      toast.error(err);
    }
  };
  //function to get Existing company list
  const companyList = () => {
    try {
      axiosInstance.get("audit.api.getCompanyDetails").then((res) => {
        if (res?.data?.message?.company_list) {
          const arr = [];
          res?.data?.message?.company_list.map((items) => {
            arr.push({
              label: items.Company_name,
              value: items.company_id,
            });
          });
          setCompanyList(arr);
        }
      });
    } catch (err) {}
  };
  //form validate function
  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  // Function to change input fields value
  const dataFields = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "first_name":
        setError({
          ...error,
          userNameErr: value.length === 0 ? "please enter User Name" : "",
        });
        break;
      case "expertise":
        setError({
          ...error,
          expertiseErr: value.length === 0 ? "please enter expertise" : "",
        });
        break;
      case "company":
        setError({
          ...error,
          companyNameErr: value.length === 0 ? "please Select Company" : "",
        });
        break;
      case "phone":
        setError({
          ...error,
          phoneNoErr: value.length === 10 ? "" : "mobile must be 10 digit",
        });
        break;
      case "email":
        setError({
          ...error,
          emailIdErr: validEmailRegex.test(value) ? "" : "Email is not valid",
        });
        break;
    }
    setFields({
      ...fields,
      [name]: value,
    });
  };

  //function to get Expertise list
  const expertiseList = () => {
    try {
      axiosInstance.get("audit.api.GetExpertiseList").then((res) => {
        if (res?.data?.message?.status_response) {
          const arr = [];
          res?.data?.message?.status_response.map((items) => {
            arr.push({
              label: items.name,
              value: items.name,
            });
          });
          setExpertList(arr);
        }
      });
    } catch (err) {}
  };

  //company change dropdown function
  const companyChange = (event) => {
    setFields({
      ...fields,
      company: event.label,
    });
  };

  //expertise dropDown Change
  const expertiseChange = (event) => {
    setFields({
      ...fields,
      expertise: event.label,
    });
  };

  // function to Create company
  const createUser = () => {
    setIsLoading(true);
    if (validateForm(error)) {
      const formData = new FormData();
      for (const key in fields) {
        formData.append(key, fields[key]);
      }
      try {
        axiosInstance
          .post("audit.api.createRolewiseUser", formData)
          .then((res) => {
            if (res?.data?.message?.status) {
              handleClose();
              dispatch(setEditState(!state?.AuditReducer?.editState));
              setIsLoading(false);
              toast.success(res?.data?.message?.status_response);
              setFields({
                ...initialState,
              });
            } else {
              toast.error(res?.data?.message?.status_response);
              setIsLoading(false);
            }
          })
          .catch((error) => toast.error("somethingh went wrong", error));
      } catch (err) {
        setIsLoading(false);
        toast.error("somethingh went wrong", err);
      }
    } else {
      toast.error("pleasae fill the required fields");
    }
  };

  //company category function call
  useEffect(() => {
    companyList();
    FecthUserRoleList();
  }, []);

  useEffect(() => {
    expertiseList();
  }, [state?.AuditReducer?.editState]);

  //edit data fields
  useEffect(() => {
    if (data && Object.keys(data)?.length > 0) {
      setFields({
        ...data,
      });
    }
  }, [data, state?.AuditReducer?.editState]);

  useEffect(() => {
    if (!userRoles || userRoles?.length === 0) {
      dispatch(signInSignUpActions.getUserRolesRequest());
    }
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setFields({
            ...initialState,
          });
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.box}>
          <BackDrop isLoading={isLoading} />
          <div className={styles.closeBtn}>
            <IconButton
              icon={<MdClose />}
              variant="exitBtn"
              onClick={() => {
                setFields({
                  ...initialState,
                });
                handleClose();
              }}
            />
          </div>

          <div className="row">
            <div className="col-6">
              <Input
                labelText="User Name"
                type="text"
                placeholder="Enter Name"
                variant="auditAssignmentInput"
                name="first_name"
                value={fields.first_name}
                onChange={(e) => dataFields(e)}
              />
              {error.userNameErr !== "" && (
                <p className={styles.errors}>{error.userNameErr}</p>
              )}
            </div>
            <div className="col-6">
              <Input
                labelText="Email ID"
                type="text"
                placeholder="Enter Email ID"
                variant="auditAssignmentInput"
                name="email"
                value={fields.email}
                onChange={(e) => dataFields(e)}
              />
              {error.emailIdErr !== "" && (
                <p className={styles.errors}>{error.emailIdErr}</p>
              )}
            </div>
          </div>
          <div className="row my-3">
            <div className="col-6">
              <Input
                labelText="Mobile No"
                type="text"
                placeholder="Enter Mobile Number"
                variant="auditAssignmentInput"
                name="phone"
                value={fields.phone}
                onChange={(e) => dataFields(e)}
              />
              {error.phoneNoErr !== "" && (
                <p className={styles.errors}>{error.phoneNoErr}</p>
              )}
            </div>
            <div className="col-6">
              <label className={styles.label}>Expertise</label>
              <CreatableSelect
                styles={customStyle}
                options={experList}
                placeholder="Select Expertise"
                value={{
                  label: fields?.expertise || "",
                  value: fields?.expertise || "",
                }}
                onChange={expertiseChange}
              />
              {error.expertiseErr !== "" && (
                <p className={styles.errors}>{error.expertiseErr}</p>
              )}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-6">
              <label className={styles.label}>Company Name</label>
              <CreatableSelect
                styles={customStyle}
                options={companyListData}
                value={{
                  label: fields?.company || "",
                  value: fields?.company || "",
                }}
                onChange={companyChange}
              />
              {error.companyNameErr !== "" && (
                <p className={styles.errors}>{error.companyNameErr}</p>
              )}
            </div>
            <div className="col-6">
              <label className={styles.label}>Role</label>
              <Select
                styles={customStyle}
                options={userRoles}
                placeholder="Select role"
                value={
                  fields.role
                    ? {
                        label: fields.role,
                        value: fields.role,
                      }
                    : null
                }
                onChange={(option) => {
                  setFields({ ...fields, role: option.value });
                }}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <div className="p-2">
              <Button
                description="CANCEL"
                variant="cancelBtn"
                onClick={() => {
                  setFields({
                    ...initialState,
                  });
                  handleClose();
                }}
              />
            </div>
            <div className="p-2">
              <Button
                description="SUBMIT"
                variant="submitBtn"
                onClick={() => createUser()}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
