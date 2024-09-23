import React, { useState, useMemo, useEffect } from "react";
import Modal from "@mui/material/Modal";
import styles from "./style.module.scss";
import { Input } from "../../../components/Inputs/Input.jsx";
import { MdClose } from "react-icons/md";
import IconButton from "../../../components/Buttons/IconButton";
import Button from "../../../components/Buttons/Button";
import CreatableSelect from "react-select/creatable";
import axiosInstance from "../../../../../apiServices";
import countryList from "react-select-country-list";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyDetails } from "../../../redux/actions";
import { toast } from "react-toastify";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { customStyle } from "Components/Audit/assets/reactSelectStyles/styles";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { validEmailRegex } from "Components/Audit/components/Helpers/string.helpers";

const initialState = {
  company_docname: null,
  company_name: "",
  register_id: "",
  company_type: "",
  company_country: "",
  company_pincode: "",
  phone_no: "",
  email_id: "",
};

const initialError = {
  companyErr: "",
  registerIdErr: "",
  companyTypeErr: "",
  companyCountryErr: "",
  companyPinCodeErr: "",
  phoneNoErr: "",
  emailIdErr: "",
};
export default function CreateCompany({ handleClose, open, data }) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState(initialState);
  const [compayType, setCompanyType] = useState([]);
  const [error, setError] = useState(initialError);
  const dispatch = useDispatch();

  //variable function to get country list
  const options = useMemo(
    () =>
      countryList()
        .getData()
        .filter(
          (item) =>
            item.value !== "AX" &&
            item.value !== "CI" &&
            item.value !== "CD" &&
            item.value !== "LA" &&
            item.value !== "KR" &&
            item.value !== "KW" &&
            item.value !== "KP" &&
            item.value !== "CW"
        ),
    []
  );
  const place = "Please Select";
  const state = useSelector((state) => state);

  //validation function
  const validateForm = (errors) => {
    let valid = true;
    Object.keys(errors).forEach((key) => {
      if (key !== "phoneNoErr" && key !== "emailIdErr") {
        if (errors[key].length > 0) {
          valid = false;
        }
      }
    });
    return valid;
  };

  // Function to change input fields value
  const dataFields = (event) => {
    const { name, value } = event.target;
    // if (name === "company_pincode") {
    //   pinCodeCheck(value);
    // }
    switch (name) {
      case "company_name":
        setError({
          ...error,
          companyErr:
            value.length === 0 || value.length < 2
              ? "Minimum 2 char required"
              : "",
        });
        break;
      case "register_id":
        setError({
          ...error,
          registerIdErr: value.length === 0 ? "please enter register Id" : "",
        });
        break;
      case "company_type":
        setError({
          ...error,
          companyTypeErr:
            value.length === 0 ? "please Select Company Type" : "",
        });
        break;
      case "phone_no":
        setError({
          ...error,
          phoneNoErr: value.length === 10 ? "" : "mobile must be 10 digit",
        });
        break;
      case "email_id":
        setError({
          ...error,
          emailIdErr: validEmailRegex.test(value) ? "" : "Email is not valid",
        });
        break;
    }
    if (name === "company_pincode") {
      if (fields.company_country === "") {
        setError({
          ...error,
          companyCountryErr: "please select country",
        });
      } else if (fields.company_country === "India") {
        pinCodeCheck(value);
        setFields({
          ...fields,
          company_pincode: value,
        });
      } else if (
        fields.company_country !== "India" &&
        fields.company_country !== ""
      ) {
        setFields({
          ...fields,
          company_pincode: value,
        });
      }
    } else {
      setFields({
        ...fields,
        [name]: removeWhiteSpaces(value),
      });
    }
  };

  // function to change company type dropDown
  const companyTypeChange = (value) => {
    setFields({
      ...fields,
      company_type: value?.value,
    });
  };

  // Function to change Country from Country DropDown
  const countryChange = (e) => {
    let countryvalue = countryList().getLabel(e.value) || e.value;
    if (countryvalue.length > 0) {
      setError({
        ...error,
        companyCountryErr: "",
      });
    }
    if (countryvalue === "India") {
      if (fields.company_pincode.length > 0) {
        pinCodeCheck(fields.company_pincode);
      }
      setFields({
        ...fields,
        company_country: countryvalue,
      });
    } else {
      setError({
        ...error,
        companyPinCodeErr: "",
        companyCountryErr: "",
      });
    }
    setFields({
      ...fields,
      company_country: countryvalue,
    });
  };

  // function to get company type list
  const companyCategory = () => {
    try {
      axiosInstance.get("audit.api.getCompanyType").then((res) => {
        if (res?.data?.message?.company_type) {
          const arr = [];
          res?.data?.message?.company_type.map((items) => {
            arr.push({
              label: items,
              value: items,
            });
          });
          setCompanyType(arr);
        }
      });
    } catch (err) {}
  };

  // function to validate pincode
  const pinCodeCheck = (pinCode) => {
    if (pinCode.length > 6 || pinCode.length < 6) {
      setError({
        ...error,
        companyPinCodeErr: "Invalid Pincode",
        companyCountryErr: "",
      });
    } else if (pinCode.length === 6) {
      setIsLoading(true);
      try {
        axiosInstance
          .post("audit.api.CheckPincode", {
            pincode: pinCode,
          })
          .then((res) => {
            if (res?.data?.message.status) {
              setError({
                ...error,
                companyPinCodeErr: "",
                companyCountryErr: "",
              });
              setIsLoading(false);
            } else {
              setError({
                ...error,
                companyPinCodeErr: "Invalid Pincode",
                companyCountryErr: "",
              });
              setIsLoading(false);
            }
          });
      } catch (err) {
        setIsLoading(false);
      }
    }
  };

  // function to Create company
  const createCompany = () => {
    setIsLoading(true);
    if (validateForm(error)) {
      try {
        axiosInstance.post("audit.api.createCompany", fields).then((res) => {
          if (res?.data?.message?.status) {
            handleClose();
            dispatch(setCompanyDetails(fields));
            setIsLoading(false);
            setFields({
              ...initialState,
            });
            toast.success(res?.data?.message?.status_response);
          } else {
            toast.error(
              res?.data?.message?.status_response || "something went wrong"
            );
            setIsLoading(false);
          }
        });
      } catch (err) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      toast.error("pleasae fill correct & required fields");
    }
  };

  const requiredFields = [
    "company_name",
    "register_id",
    "company_type",
    "company_country",
    "company_pincode",
  ];

  const isFormValid = requiredFields.every(
    (fieldName) =>
      fields[fieldName] !== "" &&
      fields[fieldName] !== " " &&
      fields[fieldName] !== null
  );

  //company category function call
  useEffect(() => {
    companyCategory();
  }, []);

  //edit data fields
  useEffect(() => {
    if (data && Object.keys(data)?.length > 0) {
      setFields({
        ...data,
      });
    }
  }, [data, state?.AuditReducer?.editState]);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setFields({
            ...initialState,
          });
          setError({
            ...initialError,
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
                setError({
                  ...initialError,
                });
                handleClose();
              }}
            />
          </div>

          <div className={styles.inputfields}>
            <div className="p-2">
              <Input
                labelText="Company Name"
                type="text"
                required={true}
                placeholder="Enter company Name"
                variant="createCompanyInputs"
                name="company_name"
                min={2}
                value={fields?.company_name}
                onChange={(e) => dataFields(e)}
              />
              {error?.companyErr !== "" && (
                <p className={styles.errors}>{error?.companyErr}</p>
              )}
            </div>
            <div className="p-2">
              <Input
                labelText="Register ID"
                type="text"
                required={true}
                placeholder="Enter ID"
                variant="createCompanyInputs"
                name="register_id"
                value={fields?.register_id}
                onChange={(e) => dataFields(e)}
              />
              {error?.registerIdErr !== "" && (
                <p className={styles.errors}>{error?.registerIdErr}</p>
              )}
            </div>
          </div>
          <div className={styles.inputfields}>
            <div className="p-2">
              <label className={`${styles.label} ${styles.required}`}>
                Country
              </label>
              <CreatableSelect
                styles={customStyle}
                options={options}
                value={{
                  label:
                    fields?.company_country?.length === 0
                      ? place
                      : fields?.company_country,
                  value:
                    fields?.company_country?.length === 0
                      ? place
                      : fields?.company_country,
                }}
                onChange={(e) => {
                  countryChange(e);
                }}
              />
              {error?.companyCountryErr !== "" && (
                <p className={styles.errors}>{error?.companyCountryErr}</p>
              )}
            </div>
            <div className="p-2">
              <Input
                labelText="Pincode"
                type="text"
                maxLength={fields?.company_country === "India" ? 6 : 12}
                placeholder="Enter"
                variant="createCompanyInputs"
                name="company_pincode"
                required={true}
                value={fields?.company_pincode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value || /^[0-9]{0,10}$/.test(value)) {
                    dataFields(e);
                  }
                }}
              />
              {error?.companyPinCodeErr !== "" && (
                <p className={styles.errors}>{error?.companyPinCodeErr}</p>
              )}
            </div>
          </div>

          <div className={styles.inputfields}>
            <div className="p-2">
              <label className={`${styles.label} ${styles.required}`}>
                Company Category
              </label>
              <CreatableSelect
                styles={customStyle}
                options={compayType}
                name="company_type"
                value={{
                  label:
                    fields?.company_type?.length === 0
                      ? place
                      : fields?.company_type,
                  value:
                    fields?.company_type?.length === 0
                      ? place
                      : fields?.company_type,
                }}
                onChange={companyTypeChange}
              />
              {error?.companyTypeErr !== "" && (
                <p className={styles.errors}>{error?.companyTypeErr}</p>
              )}
            </div>
            <div className="p-2">
              <Input
                labelText="Email Id"
                type="text"
                placeholder="email"
                variant="createCompanyInputs"
                name="email_id"
                value={fields?.email_id}
                onChange={(e) => dataFields(e)}
              />
              {error?.emailIdErr !== "" && (
                <p className={styles.errors}>{error?.emailIdErr}</p>
              )}
            </div>
          </div>
          <div className={styles.inputfields}>
            <div className="p-2">
              <Input
                labelText="Mobile No"
                type="text"
                placeholder="mobile no"
                variant="createCompanyInputs"
                maxLength={10}
                name="phone_no"
                pattern="[0-9]{10}"
                value={fields?.phone_no}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value || /^[0-9]{0,10}$/.test(value)) {
                    dataFields(e);
                  }
                }}
              />
              {error?.phoneNoErr !== "" && (
                <p className={styles.errors}>{error?.phoneNoErr}</p>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <div className="p-2">
              <Button
                description="SUBMIT"
                variant="submitBtn"
                disabled={!validateForm(error) || !isFormValid}
                onClick={() => createCompany()}
              />
            </div>
            <div className="p-2">
              <Button
                description="CANCEL"
                variant="cancelBtn"
                onClick={() => {
                  setFields({
                    ...initialState,
                  });
                  setError({
                    ...initialError,
                  });
                  handleClose();
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
