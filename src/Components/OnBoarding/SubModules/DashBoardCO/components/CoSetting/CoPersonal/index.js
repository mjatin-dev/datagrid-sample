/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import { Modal } from "react-responsive-modal";
import closeBlack from "../../../../../../../assets/Icons/closeBlack.png";
import { actions as coActions } from "../../../redux/actions";
import validator from "validator";
import api from "../../../../../../../apiServices";
import { toast } from "react-toastify";
import {
  removeOnlySpaces,
  removeWhiteSpaces,
} from "../../../../../../../CommonModules/helpers/string.helpers";
import { isEqual } from "lodash";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";
import { actions as authActions } from "Components/Authectication/redux/actions";
import { userTypeNumbers } from "SharedComponents/Constants";
function CoSettingRightGrid({ handleClose, history }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const [isValidate, setIsValidate] = useState(false);
  const [valuesBackup, setValuesBackup] = useState(null);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [otpValid, setOtpInValid] = useState("");
  const [otp, setOtp] = useState("");
  const [showResendSection, setShowResendSection] = useState(false);

  const [values, setValues] = useState({
    full_name: "",
    designation: "",
    email: "",
    mobile_no: "",
    countrycode: "",
    userRole: "",
  });
  const [inputErrors, setInputErrors] = useState({
    full_name_err: "",
    designation_error: "",
    email_error: "",
    mobile_no_error: "",
    countrycode_err: "",
  });
  const [isValidEmail, setIsValidEmail] = useState(null);

  const [valuesChanged, setValuesChanged] = useState(false);
  const [otpModal, setOtpModal] = useState(false);

  const [mobileErr, setMobileErr] = useState("");
  const [verifyPassword, setVerifyPassword] = useState({
    password: "",
    passwordError: "",
  });
  const loggedUser = state && state.auth && state.auth.loginInfo;
  const { isTaskManagementUser, isLicenseManager, isCEApprover } =
    useGetUserRoles();
  const isLoading = state?.taskReport?.loader;
  const [userInfoBackup, setUserInfoBackup] = useState(null);
  useEffect(() => {
    dispatch(
      coActions.availabilityCheckequest({
        loginID: loggedUser.email,
        loginty: "AdminEmail",
      })
    );
  }, []);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
      }
      if (seconds === 0) {
        if (minutes === 0) {
          setShowResendSection(true);
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  const verfiyEmail = async (email) => {
    if (validator.isEmail(email)) {
      if (email !== valuesBackup.email) {
        let payload = {
          loginID: email,
          pwd: "",
          rememberme: 0,
          loginty: "AdminEmail",
        };
        return await api
          .post("/api/availabilityCheck", payload)
          .then(function (response) {
            if (response && response.data && response.data.Status === "True") {
              setIsValidEmail(false);
              return false;
            } else {
              setIsValidEmail(true);
              return true;
            }
          })
          .catch(function (error) {
            if (error) {
              return false;
            }
          });
      } else {
        setIsValidEmail(true);
      }
    }
  };

  useEffect(() => {
    const _name =
      state &&
      state.taskReport &&
      state.taskReport.userAvailability &&
      state.taskReport.userAvailability.availabilityInfo &&
      state.taskReport.userAvailability.availabilityInfo.full_name;
    const _designation =
      state &&
      state.taskReport &&
      state.taskReport.userAvailability &&
      state.taskReport.userAvailability.availabilityInfo &&
      state.taskReport.userAvailability.availabilityInfo.designation;
    const _email =
      state &&
      state.taskReport &&
      state.taskReport.userAvailability &&
      state.taskReport.userAvailability.availabilityInfo &&
      state.taskReport.userAvailability.availabilityInfo.email;
    const _mobile =
      state &&
      state.taskReport &&
      state.taskReport.userAvailability &&
      state.taskReport.userAvailability.availabilityInfo &&
      state.taskReport.userAvailability.availabilityInfo.mobile_no;

    const _userRole =
      state &&
      state.taskReport &&
      state.taskReport.userAvailability &&
      state.taskReport.userAvailability.availabilityInfo &&
      state.taskReport.userAvailability.availabilityInfo.user_type;
    const _userInfo =
      state &&
      state.taskReport &&
      state.taskReport.userAvailability &&
      state.taskReport.userAvailability.availabilityInfo;

    let userObj = {
      full_name: _name !== "" && _name !== undefined ? _name : "",
      designation:
        _designation !== "" && _designation !== undefined ? _designation : "",
      email: _email !== "" && _email !== undefined ? _email : "",
      mobile_no: _mobile !== "" && _mobile !== undefined ? Number(_mobile) : "",
      countrycode:
        _userInfo !== "" && _userInfo !== undefined
          ? _userInfo.countrycode
          : "",

      userRole: _userRole !== "" && _userRole !== undefined ? _userRole : "",
    };

    // if (loggedUser.UserName && _name && loggedUser.UserName !== _name) {
    //   dispatch(authActions.updateUserName(_name));
    // }

    setValues(userObj);
    setValuesBackup(userObj);
    setUserInfoBackup(_userInfo);
  }, [state.taskReport.userAvailability]);

  const onSubmit = () => {
    if (
      removeOnlySpaces(values.full_name) === "" ||
      values.mobile_no === "" ||
      values.mobile_no.length < 10 ||
      values.mobile_no.length > 10 ||
      removeOnlySpaces(values.email) === "" ||
      !validator.isEmail(values.email) ||
      (isValidEmail !== null && !isValidEmail) ||
      removeOnlySpaces(values.designation) === "" ||
      removeOnlySpaces(values.countrycode) === ""
    ) {
      setIsValidate(true);
    } else {
      if (
        values.email === valuesBackup.email &&
        values.mobile_no === valuesBackup.mobile_no &&
        values.countrycode === valuesBackup.countrycode
      ) {
        setIsValidate(false);
        handleFinalSubmit();
      } else {
        if (!otpValid && mobileErr === "") {
          setOtpModal(true);
          setOtpInValid(false);
          sendOTPRequest();
          setSeconds(59);
        }
      }
    }
  };

  const manageData = () => {
    if (handleClose === undefined) {
      history.push("/settings");
    } else {
      handleClose();
    }
  };

  const resendOTP = () => {
    setShowResendSection(false);
    dispatch(coActions.generateOtp({ mobile_number: values.mobile_no }));
    setSeconds(59);
  };

  const handleFinalSubmit = () => {
    let payload = {
      full_name: values.full_name,
      mobile_no: values.mobile_no,
      adminEmail: values.email,
      userType: values.email !== valuesBackup.email ? 9 : 1,
      actionFlag: 2,
      designation: values.designation,
      userID: userInfoBackup.UserID,
      countrycode: values.countrycode,
    };
    dispatch(coActions.coDetailsInsUpdDelRequest(payload));
    setValuesChanged(false);
  };

  useEffect(() => {
    const regex = /^[a-z|A-Z_ ]*$/;
    let _errors = { ...inputErrors };
    _errors = {
      ..._errors,
      full_name_err: !values?.full_name
        ? "Full name is required."
        : !regex.test(values.full_name)
        ? "Please enter valid name"
        : "",
      designation_error: !values?.designation
        ? "Designation is required."
        : !regex.test(values.designation)
        ? "Please enter valid designation"
        : values?.designation?.length < 2
        ? "Designation should contain minimum 2 characters"
        : "",
      email_error: !values?.email
        ? "Email id is required."
        : !validator.isEmail(values.email)
        ? "Please enter valid email id"
        : "",
      mobile_no_error: !values?.mobile_no
        ? "Mobile Number is required."
        : String(values.mobile_no)?.length !== 10
        ? "Please enter valid mobile number"
        : "",
      countrycode_err: !values.countrycode
        ? "Country code is required"
        : !/^(\+?\d{1,3}|\d{1,4})$/.test(values.countrycode)
        ? "Please enter valid country code"
        : "",
    };

    if (
      valuesBackup?.mobile_no !== values?.mobile_no &&
      validator.isMobilePhone(String(values.mobile_no)) &&
      String(values.mobile_no).length === 10
    ) {
      avabilityCheck(values.mobile_no);
    }
    if (
      validator.isEmail(values.email) &&
      valuesBackup?.email !== values.email
    ) {
      verfiyEmail(values.email);
    }
    setInputErrors({ ..._errors });
  }, [values]);

  const onChangeHandler = (name) => (e) => {
    const { value } = e.target;
    const _values = {
      ...values,
      ...(name === "mobile_no"
        ? { mobile_no: (value && Number(value)) || "" }
        : name === "full_name" || name === "designation"
        ? {
            [name]: /^[a-zA-Z ]{0,40}$/.test(String(value))
              ? removeWhiteSpaces(String(value))
              : values[name],
          }
        : { [name]: String(value) }),
    };
    setValues({ ..._values });
    setValuesChanged(!isEqual(valuesBackup, _values) ? true : false);
  };

  const avabilityCheck = async (mobile_no) => {
    try {
      const { data, status } = await api.post("compliance.api.avabilityCheck", {
        mobile_no,
      });
      if (status === 200 && data?.message?.status) {
        setInputErrors({
          ...inputErrors,
          mobile_no_error: "Mobile number already registered",
        });
      } else {
        setInputErrors({
          ...inputErrors,
          mobile_no_error: "",
        });
      }
    } catch (error) {}
  };

  const verifyOTP = () => {
    let payload = {};
    payload = {
      input_otp: otp,
    };
    if (otp !== "") {
      api
        .post("compliance.api.verifyOtp", payload)
        .then(function (response) {
          // handle success
          if (response && response.data && response.data.message.status) {
            setOtpInValid(false);
            setOtpModal(false);
            setOtp("");
            handleFinalSubmit();
          } else {
            toast.error("Invalid OTP");
            setOtpInValid(false);
          }
        })
        .catch(function (error) {
          if (error) {
            setOtpInValid(true);
            toast.error("Invalid OTP");
          }
        });
    } else {
      toast.error("Enter OTP");
    }
  };

  const sendOTPRequest = () => {
    if (valuesBackup?.mobile_no === values.mobile_no) {
      setMobileErr("the no you typed is already saved");
      setValuesChanged(false);
    } else {
      dispatch(coActions.generateOtp({ mobile_number: values.mobile_no }));
    }
    setSeconds(59);
  };
  return (
    <div className="co-manangment-grid mt-4">
      {isLoading ? (
        <Dots />
      ) : (
        <>
          {otpModal && !otpValid && (
            <Modal
              blockScroll={false}
              classNames={{
                overlayAnimationIn: "",
                overlayAnimationOut: "",
                modalAnimationIn: "",
                modalAnimationOut: "",
                modal: "customPersonalOTPModal",
              }}
              open={otpModal}
              center={true}
              showCloseIcon={false}
              onClose={() => {
                setOtpModal(false);
                setOtp("");
              }}
              modalId="customPersonalOTPModal"
              styles={{ width: 373, height: 210, overflow: "hidden" }}
              // onOverlayClick={() => setOtpModal(false)}
            >
              <div className="capmtech-review-model confirm-model">
                <div className="confirm-title-model">
                  Enter OTP to confirm changes
                </div>
                <div className="confirm-title-desc">
                  Sent to +91{values.mobile_no}
                </div>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control  input-not-blank "
                    placeholder="Enter 6 digit OTP"
                    value={otp}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value || /(^[0][1-9]+)|([1-9]\d*)$/.test(value)) {
                        setOtp(e.target.value);
                      }
                    }}
                    maxLength={6}
                  />

                  {!showResendSection && (
                    <p style={{ display: "flex" }} className="Resend-OTP-in">
                      {" "}
                      Resend OTP in:
                      <span className="second">
                        {minutes === 0 && seconds === 0 ? null : (
                          <p
                            style={{ fontStyle: "bold" }}
                            className="count-text-sec"
                          >
                            {" "}
                            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                          </p>
                        )}
                      </span>
                    </p>
                  )}
                  {showResendSection && (
                    <p>
                      {" "}
                      <span className="resend-text">
                        <b>Didn't receive an OTP?</b>
                      </span>
                      <span onClick={() => resendOTP()} className="resend">
                        RESEND
                      </span>
                    </p>
                  )}
                  {verifyPassword.passwordError !== "" && (
                    <p className="input-error-message">{"invalid password"}</p>
                  )}
                </div>
                <div className="d-flex">
                  {otp !== "" ? (
                    <button
                      class="btn save-details common-button btn-width"
                      onClick={() => verifyOTP()}
                    >
                      submit otp
                    </button>
                  ) : (
                    <button
                      class="btn save-details common-button btn-width"
                      disabled
                    >
                      submit otp
                    </button>
                  )}
                  <div
                    className="cancel-link-model"
                    onClick={() => {
                      setOtpModal(false);
                      setOtp("");
                    }}
                  >
                    Cancel
                  </div>
                </div>
              </div>
            </Modal>
          )}
          <div className="d-flex">
            {/* <div className="col-10 col-sm-12 col-md-12 col-xl-12 pl-0">
          <div className="personal-mgt-title">Personal</div>
        </div> */}
            <div className="d-block d-sm-none">
              <img
                className="close-icon-personal"
                src={closeBlack}
                alt="close Black"
                onClick={() => {
                  manageData();
                }}
              />
            </div>
          </div>
          <form className="">
            <div className="form-row">
              <label className="col-form-label" htmlFor="name">
                Full Name:
              </label>
              <div>
                <input
                  type="text"
                  className={
                    "form-control right-input-row " +
                    (inputErrors.full_name_err ? "input-error" : "")
                  }
                  value={values.full_name}
                  placeholder="Enter your name"
                  id="name"
                  onBlur={(e) => {
                    const name = e.target.value;
                    setValues({ ...values, full_name: name?.trim() });
                  }}
                  onChange={onChangeHandler("full_name")}
                />
                {inputErrors.full_name_err && (
                  <p className="input-error-message absPosition">
                    {inputErrors.full_name_err}
                  </p>
                )}
              </div>
            </div>
            <div className="form-row">
              <label className="col-form-label" htmlFor="designation">
                Role:
              </label>
              <div>
                {/* {is_task_manager_user_false ? (
                  <input
                    type="text"
                    className={"form-control right-input-row"}
                    disabled
                    value={
                      [...(values?.userRole || [])]?.find(
                        (role) => role.user_type_no === loggedUser.UserType
                      )?.role || values?.userRole[0]?.role
                    }
                  />
                ) : (
                  <input
                    type="text"
                    className={"form-control right-input-row"}
                    disabled
                    value={"Task Management User"}
                  />
                )} */}
                <input
                  type="text"
                  className={"form-control right-input-row"}
                  disabled
                  value={
                    isLicenseManager
                      ? [...(values?.userRole || [])]?.find(
                          (role) =>
                            role.user_type_no === userTypeNumbers.licenseManager
                        )?.role ||
                        values.userRole[0]?.role ||
                        ""
                      : isCEApprover
                      ? [...(values?.userRole || [])]?.find(
                          (role) =>
                            role.user_type_no === userTypeNumbers.ceApprover
                        )?.role ||
                        values.userRole[0]?.role ||
                        ""
                      : isTaskManagementUser
                      ? "Task Management User"
                      : [...(values?.userRole || [])]?.find(
                          (role) => role.user_type_no === loggedUser.UserType
                        )?.role || values?.userRole[0]?.role
                  }
                />
              </div>
            </div>
            <div className="form-row">
              <label className="col-form-label" htmlFor="designation">
                Designation:
              </label>
              <div>
                <input
                  type="text"
                  className={
                    "form-control right-input-row " +
                    (inputErrors.designation_error ? "input-error" : "")
                  }
                  maxLength={50}
                  value={values.designation}
                  onBlur={(e) => {
                    const designation = e.target.value;
                    setValues({ ...values, designation: designation?.trim() });
                  }}
                  placeholder="Enter your designation"
                  id="designation"
                  onChange={onChangeHandler("designation")}
                />
                {inputErrors.designation_error && (
                  <p className="input-error-message absPosition">
                    {inputErrors.designation_error}
                  </p>
                )}
              </div>
            </div>
            <div className="form-row">
              <label className="col-form-label" htmlFor="email">
                Email-Id:
              </label>
              <div>
                <input
                  type="text"
                  disabled
                  className={`form-control right-input-row ${
                    inputErrors.email_error ? "input-error" : ""
                  }`}
                  value={values.email}
                  placeholder="Enter your email id"
                  id="email"
                  onChange={onChangeHandler("email")}
                />
                {inputErrors.email_error && (
                  <p className="input-error-message absPosition">
                    {inputErrors.email_error}
                  </p>
                )}
              </div>
            </div>
            <div className="form-row">
              <label className="col-form-label" htmlFor="mobile">
                Mobile Number:
              </label>
              <div className="d-flex">
                <div className="pin-no">
                  <input
                    type="text"
                    className={
                      "form-control right-input-row contact-no-pin" +
                      (inputErrors.mobile_no_error ? "input-error" : "")
                    }
                    style={{ width: "50px" }}
                    value={values.countrycode}
                    placeholder="+91"
                    id="countrycode"
                    onChange={onChangeHandler("countrycode")}
                    maxLength="3"
                    // max="999"
                    min="0"
                    onBlur={(e) => {
                      const _countryCode = e.target.value;
                      setInputErrors({
                        ...inputErrors,
                        countrycode_err: !/^(\+?\d{1,3}|\d{1,4})$/.test(
                          _countryCode
                        )
                          ? "Please enter valid country code"
                          : "",
                      });
                    }}
                  />
                  {isValidate && values.countrycode === "" && (
                    <p className="input-error-message absPosition">
                      Country Code required
                    </p>
                  )}
                  {inputErrors.countrycode_err && (
                    <p className="input-error-message absPosition">
                      Please enter valid country code.
                    </p>
                  )}
                </div>

                <div>
                  <input
                    inputmode="Number"
                    style={{ paddingLeft: "0.75rem" }}
                    className={
                      "form-control right-input-row contact-input-box" +
                      (isValidate &&
                      (values.mobile_no === "" || values.mobile_no.length < 10)
                        ? "input-error"
                        : "")
                    }
                    value={values.mobile_no}
                    placeholder="Enter your mobile no"
                    id="mobile"
                    onChange={onChangeHandler("mobile_no")}
                    maxLength="10"
                  />
                  {inputErrors.mobile_no_error && (
                    <p className="input-error-message absPosition">
                      {inputErrors.mobile_no_error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
          <div className="bottom-logo-strip personal-details">
            <div className="row aligncenter">
              {/* <div class="col-12">
                        <div className="form-row">
                           <label className="col-form-label" for="name">Confirm password:</label>
                           <input type="text" className="form-control right-input-row" placeholder="Enter your password" name="name" />
                        </div>
                     </div> */}
              {/* <div class="col-12">
                        <button class="btn save-changes-btn">save changes</button>
                    </div> */}
              <div className="col-12 col-sm-12 col-md-12 col-xl-12 flex">
                <button
                  className={
                    valuesChanged !== false && mobileErr === ""
                      ? "btn save-changes-blue-btn"
                      : "btn save-changes-btn"
                  }
                  style={{ backgroundColor: "#e4e4e4" }}
                  disabled={
                    valuesChanged === false ||
                    inputErrors.full_name_err ||
                    inputErrors.email_error ||
                    inputErrors.mobile_no_error ||
                    inputErrors.designation_error ||
                    inputErrors.countrycode_err
                  }
                  onClick={() => onSubmit()}
                >
                  save changes
                </button>

                {valuesChanged && (
                  <div
                    className="discard-label-link"
                    onClick={() => {
                      setValues(valuesBackup);
                      setValuesChanged(false);
                      setIsValidate(false);
                      setMobileErr("");
                    }}
                  >
                    discard changes
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default CoSettingRightGrid;
