/* eslint-disable no-useless-escape */
import React, { useState } from "react";
import "./style.css";
import RightImageBg from "../../../../assets/Images/Onboarding/RectangleOnboadign.png";
import comtech from "../../../../assets/Images/CapmTech.png";
import secmark from "../../../../assets/Images/secmark.png";
import { useDispatch, useSelector } from "react-redux";
import { checkPersonalDetailsForm } from "../../utils.js";
import { actions as personalDetailsAction } from "../../redux/actions";
import { withRouter } from "react-router-dom";
import SideBarInputControl from "../SideBarInputControl";
import api from "../../../../apiServices";
import { toast } from "react-toastify";
import MobileStepper from "../mobileStepper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import validator from "validator";
import Dots from "CommonModules/sharedComponents/Loader/Dots";

function PersonalDetails({ history }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const emailVerificationData = state?.complianceOfficer?.emailVerificationData;
  const personalInfo = state?.complianceOfficer?.personalInfo;
  const isLoading = state?.complianceOfficer?.loader;
  const email = emailVerificationData?.email;
  const key = emailVerificationData?.key;
  const [visible, setVisibility] = useState(false);
  const [visibal, setVisibiliti] = useState(false);

  const Icon = (
    <FontAwesomeIcon
      icon={visible ? "eye-slash" : "eye"}
      onClick={() => setVisibility((visiblity) => !visiblity)}
    />
  );
  const InputType = visible ? "text" : "password";

  const Iconic = (
    <FontAwesomeIcon
      icon={visibal ? "eye-slash" : "eye"}
      onClick={() => setVisibiliti((visiblity) => !visiblity)}
    />
  );
  const ConfirmInputType = visibal ? "text" : "password";

  // const quote_id = state && state.auth && state.auth.quote_id;
  const [isValidate, setIsValidate] = useState(false);
  const [values, setValues] = useState({
    fullName: personalInfo?.full_name || "",
    mobileNumber: personalInfo?.mobile_number || "",
    countryCode: personalInfo?.countrycode || "+91",
    companyName: personalInfo?.company_name || "",
    designation: personalInfo?.designation || "",
    password: personalInfo?.password || "",
    confirmPassword: personalInfo?.confirm_password || "",
  });
  const [errors, setErrors] = useState({
    passwordErr: "",
    confirmPasswordErr: "",
    companyErr: "",
    mobileNumErr: "",
    countryCodeErr: "",
    designationErr: "",
    nameErr: "",
  });
  const [isCompanyNameValid, setIsCompanyNameValid] = useState(true);
  const [isMobileValid, setIsMobileValid] = useState(true);
  const [passwordState, setPasswordState] = useState({
    minlength: false,
    uppercaseandlowercase: false,
    alphabetsandigit: false,
  });

  const onChangeHandler = (name) => (event) => {
    const value = event.target.value;
    const nameRegex = /^[a-z|A-Z_ ]*$/;
    const companyRegex = /^(?=.*\S).+$/;
    const countryCodeRegex = /[\d\+]+/;
    const mobileNumberReg = /^[0-9]{0,10}$/;
    if (name === "companyName") {
      validateCompanyName(event);
    }
    if (
      (name === "fullName" || name === "designation") &&
      !/^[a-zA-Z ]{0,56}$/.test(value)
    ) {
      return;
    }

    setErrors({
      ...errors,

      ...(name === "fullName" && {
        nameErr:
          value === "" || !value.trim() || !nameRegex.test(value)
            ? "Full Name is required"
            : "",
      }),

      ...(name === "designation" && {
        designationErr:
          value === "" || !value.trim() || !nameRegex.test(value)
            ? "Please enter valid designation"
            : value?.length < 2
            ? "Designation should contain minimum 2 characters"
            : "",
      }),

      ...(name === "companyName" && {
        companyErr:
          value === "" || !value.trim() || !companyRegex.test(value)
            ? "Please enter valid company name"
            : "",
      }),

      ...(name === "countryCode" && {
        countryCodeErr:
          value === "" || !countryCodeRegex.test(value)
            ? "Please enter valid country code"
            : "",
      }),

      ...(name === "mobileNumber" && {
        mobileNumErr:
          value === "" || !validator.isMobilePhone(value)
            ? "Please enter valid mobile number"
            : "",
      }),
    });

    if (name === "mobileNumber") {
      if (event.target.value.length === 10) {
        MobileValidate(event);
      }
    }

    let passwordRE =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,16}$/;
    if (name === "mobileNumber") {
      if (!mobileNumberReg.test(event.target.value)) {
        return "";
      }
    }
    if (name === "password") {
      let minlength = "minlength";
      let alphabetsandigit = "alphabetsandigit";
      let uppercaseandlowercase = "uppercaseandlowercase";
      let inputKey = "passwordErr";
      if (!passwordRE.test(event.target.value)) {
        setErrors({ ...errors, [inputKey]: "Password is invalid" });
      } else {
        setErrors({ ...errors, [inputKey]: "" });
      }
      if (event.target.value.length < 8) {
        setPasswordState((prevState) => ({ ...prevState, [minlength]: false }));
      } else {
        setPasswordState((prevState) => ({ ...prevState, [minlength]: true }));
      }

      let uppercaseandlowercaseRE =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (uppercaseandlowercaseRE.test(event.target.value)) {
        setPasswordState((prevState) => ({
          ...prevState,
          [alphabetsandigit]: true,
          [uppercaseandlowercase]: true,
        }));
      } else {
        if (/^[a-z]*$/.test(event.target.value)) {
          setPasswordState((prevState) => ({
            ...prevState,
            [alphabetsandigit]: false,
            [uppercaseandlowercase]: false,
          }));
        } else if (
          /^[a-zA-Z]*$/.test(event.target.value) &&
          /(?=.*?[A-Z])(?=.*?[a-z])./.test(event.target.value)
        ) {
          setPasswordState((prevState) => ({
            ...prevState,
            [alphabetsandigit]: false,
            [uppercaseandlowercase]: true,
          }));
        } else if (
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]/.test(event.target.value)
        ) {
          setPasswordState((prevState) => ({
            ...prevState,
            [alphabetsandigit]: true,
            [uppercaseandlowercase]: true,
          }));
        } else if (/(?=.*?[A-Za-z])(?=.*?[0-9])/.test(event.target.value)) {
          setPasswordState((prevState) => ({
            ...prevState,
            [alphabetsandigit]: true,
            [uppercaseandlowercase]: false,
          }));
        } else {
          setPasswordState((prevState) => ({
            ...prevState,
            [alphabetsandigit]: false,
            [uppercaseandlowercase]: false,
          }));
        }
      }
    }
    if (name === "confirmPassword") {
      let inputKey = "confirmPasswordErr";
      if (!passwordRE.test(event.target.value)) {
        setErrors({ ...errors, [inputKey]: "Confirm password is invalid" });
      } else {
        setErrors({ ...errors, [inputKey]: "" });
      }
    }
    // MobileadnCompanyCheck("mobileNumber");
    setValues({ ...values, [name]: removeWhiteSpaces(event.target.value) });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };
  const onSubmit = () => {
    
    setIsValidate(true);
    // if (values?.companyName === "" || values?.companyName === " ") {
    //   setIsValidate(true);
    //   setErrors({
    //     ...errors,
    //     companyErr: "please enter company name",
    //   });
    //   return;
    // }
    if (values.mobileNumber.length < 10 || values.mobileNumber.length > 10) {
      setIsValidate(true);
      setErrors({
        ...errors,
        mobileNumErr: "please enter valid mobile number",
      });
      return;
    }

    if (checkPersonalDetailsForm(values)) {
      return;
    }
    if (
      errors.passwordErr !== "" ||
      errors.confirmPasswordErr !== "" ||
      errors.countryCodeErr === "true"
    ) {
      return "";
    }
    
    if(values?.companyName===''){
      values.companyName = null;
    }
    // return '';
    setIsValidate(false);
    if (email) {
      localStorage.setItem("mobileNumber", values.mobileNumber);
      // localStorage.setItem("company_exists", values?.companyName ? true : false);

      // return;
      dispatch(
        personalDetailsAction.insUpdateDeletAPIRequest({
          email: email.replace(/ /g, "+"),
          token: key,
          full_name: values.fullName,
          company_name: values?.companyName,
          mobile_number: values.mobileNumber,
          designation: values.designation,
          password: values.password,
          confirm_password: values.password,
          countrycode: values.countryCode || "+91",
          history: history,
        })
      );
    } else {
      toast.error("Please verify your email");
      return "";
    }
  };

  const validateCompanyName = (e) => {
    let payload = {
      company_name: e.target.value,
    };
    api
      .post("compliance.api.avabilityCheck", payload)
      .then(function (response) {
        // handle success
        if (
          response &&
          response.data &&
          response.data.message.status === true
        ) {
          setIsCompanyNameValid(false);
        } else {
          setIsCompanyNameValid(true);
        }
      })
      .catch(function (error) {
        if (error) {
          setIsCompanyNameValid(false);
        }
      });
  };

  const MobileValidate = (e) => {
    let payload = {
      mobile_no: e.target.value,
    };
    api
      .post("compliance.api.avabilityCheck", payload)
      .then(function (response) {
        // handle success
        if (
          response &&
          response.data &&
          response.data.message.status === true
        ) {
          setIsMobileValid(false);
        } else {
          setIsMobileValid(true);
        }
      })
      .catch(function (error) {
        if (error) {
          setIsCompanyNameValid(false);
        }
      });
  };

  return (
    <div className="row get-mobile-personal-detail">
      <div className="col-3 col-sm-4 col-md-4 col-xl-3 left-fixed">
        <div className="on-boarding">
          <SideBarInputControl currentStep={1} />
        </div>
      </div>
      <div className="col-12 padding-right">
        <img
          className="bottom-right-bg"
          src={RightImageBg}
          alt="RightImageBg"
        />
        <div className="get-main-personal-detail">
          <div className="container position-relative">
            <div className="">
              <div className="get-started-header">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="header_logo">
                      <img
                        src={comtech}
                        alt="COMPLIANCE SUTRA"
                        title="COMPLIANCE SUTRA"
                      />
                      <span className="camp">COMPLIANCE SUTRA</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-block d-sm-none mobile-steper ">
                <MobileStepper currentStep={1} />
              </div>
              <div className="bottom-logo-strip-parent-fix">
                <div className="wrapper_login">
                  <p className="login_title">Tell us a bit about yourself</p>
                  <div className="form_section about-your-self">
                    <div className="row">
                      <div className="col-md-6 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="FullName">Full Name </label>
                          <input
                            type="text"
                            className={
                              "form-control " +
                              (isValidate && values.fullName === ""
                                ? "input-error"
                                : "") +
                              (values.fullName !== ""
                                ? " activeForm-control"
                                : "")
                            }
                            id="FullName"
                            placeholder="Enter your full name"
                            value={values.fullName}
                            onChange={onChangeHandler("fullName")}
                            onKeyPress={(e) => handleKeyDown(e)}
                          />
                          {(isValidate || errors.nameErr) && (
                            <p className="input-error-message">
                              {errors.nameErr}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="MobileNumber">Mobile Number</label>
                          <div className="d-flex">
                            <input
                              type="text"
                              className={
                                "form-control plus-pin" +
                                (values.countryCode !== "" &&
                                errors.countryCodeErr === "true"
                                  ? " invalid-plus-pin"
                                  : " ") +
                                (values.countryCode !== "" &&
                                errors.countryCodeErr === ""
                                  ? " countryCode-sucess"
                                  : " ")
                              }
                              id="countryCode"
                              name="countryCode"
                              maxLength="3"
                              value={values.countryCode}
                              onChange={onChangeHandler("countryCode")}
                              // onBlur={(e) => validateCountryCode(e)}
                            />
                            <input
                              type="Number"
                              className={
                                "form-control " +
                                (values.mobileNumber !== "" &&
                                values.mobileNumber.length < 10 &&
                                values.mobileNumber.length > 10
                                  ? " mobile-input-invalid-control"
                                  : " ") +
                                " dropdown-phone" +
                                ((isValidate && values.mobileNumber === "") ||
                                (isValidate &&
                                  values.mobileNumber !== "" &&
                                  values.mobileNumber.length < 10 &&
                                  values.mobileNumber.length > 10)
                                  ? " input-error"
                                  : "") +
                                (values.mobileNumber.length === 10
                                  ? " success-input-form-control"
                                  : "")
                              }
                              id="MobileNumber"
                              placeholder="Enter your mobile number"
                              name="mobileNumber"
                              value={values.mobileNumber}
                              onChange={onChangeHandler("mobileNumber")}
                              onKeyPress={(e) => handleKeyDown(e)}
                              maxLength="10"
                            />
                          </div>

                          {values.countryCode !== "" &&
                            errors.countryCodeErr === "true" && (
                              <p className="input-error-message">
                                Invalid country code
                              </p>
                            )}
                          {(isValidate || errors.mobileNumErr) && (
                            <p className="input-error-message">
                              {errors.mobileNumErr}
                            </p>
                          )}

                          {!isMobileValid && (
                            <p className="input-error-message">
                              Mobile number already exists
                            </p>
                          )}

                          {values.mobileNumber !== "" &&
                            values.mobileNumber.length > 10 && (
                              <p className="input-error-message">
                                Mobile number can't be more then 10 digit
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="col-md-6 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="CompanyName">Company Name</label>
                          <input
                            type="text"
                            maxLength={140}
                            className={
                              "form-control " +
                              (isValidate && values.companyName === ""
                                ? "input-error"
                                : "") +
                              (values.companyName !== "" &&
                                " activeForm-control") +
                              (values.companyName !== "" && !isCompanyNameValid
                                ? " input-error "
                                : "")
                            }
                            id="CompanyName"
                            placeholder="Enter your company name"
                            value={values.companyName}
                            onChange={onChangeHandler("companyName")}
                            onKeyPress={(e) => handleKeyDown(e)}
                          />
                          {(isValidate || errors.companyErr) && (
                            <p className="input-error-message">
                              {errors.companyErr}
                            </p>
                          )}
                          {values.companyName !== "" && !isCompanyNameValid && (
                            <p className="input-error-message">
                              Company already exists
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="Company Email">Designation</label>
                          <input
                            type="text"
                            className={
                              "form-control " +
                              (isValidate && values.designation === ""
                                ? "input-error"
                                : "") +
                              (values.designation !== ""
                                ? " activeForm-control"
                                : " ")
                            }
                            minLength={2}
                            maxLength={50}
                            id="Designation"
                            placeholder="e.g. Compliance officer, Team Leader"
                            value={values.designation}
                            onChange={onChangeHandler("designation")}
                            onKeyPress={(e) => handleKeyDown(e)}
                          />

                          {(isValidate || errors.designationErr) && (
                            <p className="input-error-message">
                              {errors.designationErr}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="Company Email">Password</label>
                          <div className="position-relative">
                            <input
                              type={InputType}
                              className={
                                "form-control " +
                                (values.password !== "" &&
                                  values.confirmPassword !== "" &&
                                  values.confirmPassword !== values.password &&
                                  " input-error") +
                                ((isValidate && values.password === "") ||
                                (values.password !== "" &&
                                  errors.passwordErr !== "")
                                  ? "input-error"
                                  : "") +
                                (values.password !== ""
                                  ? " input-not-blank"
                                  : " ") +
                                (values.password !== "" &&
                                errors.passwordErr === ""
                                  ? " password-success "
                                  : " ")
                              }
                              id="Password"
                              autoComplete="off"
                              placeholder="Enter 8-16 digit password"
                              value={values.password}
                              onChange={onChangeHandler("password")}
                              onKeyPress={(e) => handleKeyDown(e)}
                              maxLength={16}
                            />
                            <span className="password-toggle-icon">{Icon}</span>
                          </div>

                          {isValidate && values.password === "" && (
                            <p className="input-error-message">
                              Please enter password
                            </p>
                          )}
                          {values.password !== "" &&
                            errors &&
                            errors.passwordErr !== "" && (
                              <p className="input-error-message">
                                Password is invalid
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="col-12 d-block d-sm-none">
                        <ul className="Instruction">
                          <li>
                            <div
                              className={
                                passwordState.minlength === false
                                  ? "error"
                                  : "green-dot"
                              }
                            ></div>
                            At least 8-16 characters—the more characters, the
                            better
                          </li>
                          <li>
                            <div
                              className={
                                passwordState.uppercaseandlowercase === false
                                  ? "error"
                                  : "green-dot"
                              }
                            ></div>
                            A mixture of both uppercase and lowercase letters
                          </li>
                          <li>
                            <div
                              className={
                                passwordState.alphabetsandigit === false
                                  ? "error"
                                  : "green-dot"
                              }
                            ></div>
                            A mixture of letters and numbers
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="ConfirmPassword">
                            Confirm Password
                          </label>
                          <div className="position-relative">
                            <input
                              type={ConfirmInputType}
                              className={
                                "form-control " +
                                (values.confirmPassword !== "" &&
                                  values.confirmPassword !== values.password &&
                                  " input-error") +
                                ((isValidate &&
                                  values.confirmPassword === "") ||
                                (values.confirmPassword !== "" &&
                                  errors.confirmPasswordErr !== "")
                                  ? "input-error" +
                                    (values.confirmPassword !==
                                      values.password && " input-error ")
                                  : "") +
                                "" +
                                (values.confirmPassword !== ""
                                  ? " input-not-blank"
                                  : " ") +
                                (values.confirmPassword !== "" &&
                                errors.confirmPasswordErr === "" &&
                                values.confirmPassword === values.password
                                  ? " password-success "
                                  : "")
                              }
                              id="ConfirmPassword"
                              placeholder="Repeat Password"
                              autoComplete="off"
                              value={values.confirmPassword}
                              onChange={onChangeHandler("confirmPassword")}
                              onKeyPress={(e) => handleKeyDown(e)}
                              maxLength={16}
                            />

                            <span className="password-toggle-icon">
                              {Iconic}
                            </span>
                          </div>

                          {isValidate && values.confirmPassword === "" && (
                            <p className="input-error-message">
                              Please enter confirm password
                            </p>
                          )}
                          {values.confirmPassword !== "" &&
                            values.password !== "" &&
                            values.confirmPassword !== values.password && (
                              <p className="input-error-message">
                                Password don't match
                              </p>
                            )}
                        </div>
                      </div>
                      {values.password !== "" && (
                        <div className="col-12 d-none d-sm-block">
                          <ul className="Instruction">
                            <li>
                              <div
                                className={
                                  passwordState.minlength === false
                                    ? "error"
                                    : "green-dot"
                                }
                              ></div>
                              At least 8-16 characters—the more characters,{" "}
                              <br></br> the better
                            </li>
                            <li>
                              <div
                                className={
                                  passwordState.uppercaseandlowercase === false
                                    ? "error"
                                    : "green-dot"
                                }
                              ></div>
                              A mixture of both uppercase and lowercase letters
                            </li>
                            <li>
                              <div
                                className={
                                  passwordState.alphabetsandigit === false
                                    ? "error"
                                    : "green-dot"
                                }
                              ></div>
                              A mixture of letters and numbers
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bottom-logo-strip personal-details">
                <div className="row align-items-center">
                  <div className="col-12"></div>
                  <div className="col-6">
                    {isLoading ? (
                      <Dots />
                    ) : (
                      <button
                        onClick={() => {
                          if (
                            personalInfo &&
                            Object?.keys(personalInfo)?.length > 0
                          ) {
                            history.push("/company-details");
                          } else {
                            onSubmit();
                          }
                        }}
                        className="btn save-details common-button btn-width"
                        style={{ width: 134 }}
                      >
                        {personalInfo && Object?.keys(personalInfo)?.length > 0
                          ? "Next"
                          : "SAVE DETAILS"}
                      </button>
                    )}
                  </div>
                  <div className="col-6 text-right d-none d-sm-block">
                    <span className="powerBy">Powered by</span>
                    <img
                      className="header_logo footer-logo-secmark"
                      src={secmark}
                      alt="SECMARK"
                      title="SECMARK"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(PersonalDetails);
