/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from "react";
import "./style.css";
import api from "../../../../../../../apiServices";
import closeBlack from "../../../../../../../assets/Icons/closeBlack.png";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeactivateAccount from "SharedComponents/AccountDeactivate";

function CoSetting({ handleClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const state = useSelector((state) => state);
  const auth = state && state.auth;

  const [errors, setErrors] = useState({
    currentPasswordErr: "",
    newPasswordErr: "",
    confirmPasswordErr: "",
  });
  const [isValidate, setIsValidate] = useState(false);
  const [passwordState, setPasswordState] = useState({
    minlength: false,
    uppercaseandlowercase: false,
    alphabetsandigit: false,
  });
  const [showSectionTitle, setShowSectionTitle] = useState("Security");
  const [section, setSection] = useState("security");
  // const [twoFactortAuth, setTwoFactorAuth] = useState(false);
  const [close, setClose] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({
    currentPassword: false,
    newPassowrd: false,
    confirmPassword: false,
  });
  const isValidatePassword =
    !passwordState?.alphabetsandigit ||
    !passwordState?.minlength ||
    !passwordState.uppercaseandlowercase;

  const onChanePasswordClick = () => {
    setShowSectionTitle("Change Password");
    setSection("change-password");
    setClose(true);
  };

  const onCancelButtonClick = () => {
    setPasswordState({
      minlength: false,
      uppercaseandlowercase: false,
      alphabetsandigit: false,
    });
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setValues({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowSectionTitle("Security");
    setSection("security");
    setClose(false);
  };

  const onChangeHandler = (name) => (event) => {
    let passwordRE =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,16}$/;

    if (name === "newPassword") {
      let minlength = "minlength";
      let alphabetsandigit = "alphabetsandigit";
      let uppercaseandlowercase = "uppercaseandlowercase";
      let inputKey = "newPasswordErr";
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
        setErrors({ ...errors, [inputKey]: "Password is invalid" });
      } else {
        setErrors({ ...errors, [inputKey]: "" });
      }
    }
    setValues({ ...values, [name]: event.target.value });
  };

  const onSavePassword = () => {
    setIsValidate(true);
    if (
      values.currentPassword === "" ||
      values.newPassword === "" ||
      values.confirmPassword === "" ||
      errors.currentPasswordErr !== "" ||
      errors.newPasswordErr !== "" ||
      errors.confirmPasswordErr !== "" ||
      values.newPassword !== values.confirmPassword ||
      values.currentPassword === values.confirmPassword
    ) {
      if (values.currentPassword === values.confirmPassword) {
        toast.error("New Password can't be same as current password.");
      }
      return "";
    }
    setIsValidate(false);
    const payload = {
      user:
        auth &&
        auth.loginInfo &&
        (auth.loginInfo.EmailID || auth.loginInfo.email),
      new_password: values.newPassword,
      old_password: values.currentPassword,
      logout_all_sessions: 1,
    };
    api
      .post("compliance.api.changePassword", payload)
      .then(function (response) {
        if (response && response.data && response.data.message) {
          if (response.data.message.status === true) {
            toast.success(response.data.message.status_response);
            setValues({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            setTimeout(() => {
              setShowSectionTitle("Security");
              setSection("security");
            }, 1000);
          } else {
            if (response.data.message.status === false) {
              toast.error(response.data.message.status_response);
            }
          }
        }
      })
      .catch(function (error) {
        if (error) {
        }
      });
  };

  const handleKeyPress = (e, name) => {
    if (e.charCode === 13) {
      if (
        (errors.newPasswordErr === errors.confirmPasswordErr &&
          values.newPassword === values.confirmPassword) ||
        (errors.currentPasswordErr !== "invalid" &&
          values.currentPassword !== "")
      ) {
        onSavePassword();
      } else {
        // handleVerifyModalAction();
      }
    }
  };

  return (
    <div className="co-security mt-4">
      <DeactivateAccount open={isOpen} close={() => setIsOpen(false)} />
      <div className="d-flex">
        {/* <div className="col-10 col-sm-12 col-md-12 col-xl-12 pl-0">
          <div className="personal-mgt-title">{showSectionTitle}</div>
        </div> */}
        <div className="d-block d-sm-none">
          <img
            className="close-icon-personal"
            src={closeBlack}
            alt="close Black"
            onClick={() => {
              close === false ? handleClose(true) : onCancelButtonClick();
            }}
          />
        </div>
      </div>
      {/* <div className="personal-mgt-title">{showSectionTitle}</div> */}
      {/* <div class="border-header d-none d-sm-block"></div> */}
      {section === "security" && (
        <div className="scroll-sction">
          <div className="channel-div">
            <p className="cheading">Account Password</p>
            <div className="row mar-bottom my-3">
              <div className="col-12 col-sm-6 col-md-6 col-xl-6">
                <div className="notification-div-flex">
                  <p className="password-text mb-0">
                    Change the password of your account
                  </p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-xl-6">
                <p
                  onClick={() => onChanePasswordClick()}
                  style={{
                    marginTop: 0,
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                  className="change-password"
                >
                  change password
                </p>
              </div>
            </div>
            <div className="row mar-bottom">
              <div className="col-12 col-sm-6 col-md-6 col-xl-6">
                <div className="notification-div-flex">
                  <p className="password-text mb-0">Deactivate your account</p>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-xl-6">
                <p
                  onClick={() => setIsOpen(true)}
                  style={{
                    marginTop: 0,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    color: "red",
                  }}
                  className="change-password"
                >
                  Deactivate account
                </p>
              </div>
            </div>
          </div>
          {/* <div className="channel-div">
            <p className="cheading">2 Factor Authentication (2FA)</p>
            <div className="row mar-bottom">
              <div className="col-9">
                <div className="">
                  <p className="bolder-text">Enable 2FA Authentication</p>
                  <p className="normal-text">Every time you log in we will send you a OTP on your registered
                  mobile number
            </p>
                </div>
              </div>
              <div className="col-3">
                <div className="check-box">
                  <label class="switch" id="email">
                    <input
                      onClick={(e) => onSliderChange(e, "TwoWayAuth")}
                      checked={twoFactortAuth}
                      htmlFor="email" type="checkbox" />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      )}
      {section === "change-password" && (
        <div className="channel-div">
          <div className="row mar-bottom change-pass-Co-setting">
            <div className="col-12 d-block d-sm-none">
              <div className="account-password-title">Account Password</div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-xl-6">
              <div className="notification-div-flex">
                <p className="password-text">Current Password</p>

                <div className="form-group" style={{ height: "45px" }}>
                  <div className="position-relative">
                    <input
                      maxLength={16}
                      type={
                        visiblePassword.currentPassword ? "text" : "password"
                      }
                      value={values.currentPassword}
                      autoComplete="off"
                      placeholder="Enter  password"
                      // onBlur={(e) => handleVerifyModalAction(e)}
                      onChange={onChangeHandler("currentPassword")}
                      className={
                        "form-control " +
                        (values.currentPassword !== "" &&
                          errors &&
                          errors.currentPasswordErr === "invalid" &&
                          " input-error") +
                        (values.currentPassword !== "" &&
                          errors &&
                          errors.currentPasswordErr === "" &&
                          " password-success")
                      }
                      onKeyPress={(e) => handleKeyPress(e, "currentPassword")}
                    />
                    {values.currentPassword &&
                      values.currentPassword !== "" && (
                        <span
                          className="password-toggle-icon"
                          onClick={() =>
                            setVisiblePassword((value) => ({
                              ...value,
                              currentPassword: !value.currentPassword,
                            }))
                          }
                        >
                          <FontAwesomeIcon
                            icon={
                              visiblePassword.currentPassword
                                ? "eye-slash"
                                : "eye"
                            }
                          />
                        </span>
                      )}
                  </div>
                  {values.currentPassword !== "" &&
                    errors &&
                    errors.currentPasswordErr === "invalid" && (
                      <p className="input-error-message">
                        You have entered wrong password
                      </p>
                    )}
                  {isValidate && values.currentPassword === "" && (
                    <p className="input-error-message absPosition">
                      Please enter current password
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row mar-bottom change-pass-Co-setting">
            <div className="col-12 col-sm-6 col-md-6 col-xl-6">
              <div className="notification-div-flex">
                <p className="password-text">New Password</p>
                <div className="form-group " style={{ height: "50px" }}>
                  <div className="position-relative">
                    <input
                      maxLength={16}
                      disabled={
                        values.currentPassword === "" ||
                        errors.currentPasswordErr !== ""
                      }
                      type={visiblePassword.newPassowrd ? "text" : "password"}
                      autoComplete="off"
                      placeholder="Enter password"
                      onChange={onChangeHandler("newPassword")}
                      value={values.newPassword}
                      className={
                        "form-control " +
                        (values.newPassword !== "" &&
                          values.confirmPassword !== values.newPassword &&
                          " input-error") +
                        (values.confirmPassword === "" ||
                        (values.confirmPassword !== "" &&
                          errors.confirmPasswordErr !== "")
                          ? "input-error" +
                            (values.confirmPassword !== values.newPassword &&
                              " input-error ")
                          : "") +
                        "" +
                        (values.confirmPassword !== ""
                          ? " input-not-blank"
                          : " ") +
                        (values.newPassword !== "" &&
                        values.confirmPassword === values.newPassword
                          ? " password-success "
                          : "")
                      }
                    />
                    {values.newPassword && values.newPassword !== "" && (
                      <span
                        className="password-toggle-icon"
                        onClick={() =>
                          setVisiblePassword((value) => ({
                            ...value,
                            newPassowrd: !value.newPassowrd,
                          }))
                        }
                      >
                        <FontAwesomeIcon
                          icon={
                            visiblePassword.newPassowrd ? "eye-slash" : "eye"
                          }
                        />
                      </span>
                    )}
                  </div>
                  {values.newPassword !== "" &&
                    errors &&
                    errors.newPasswordErr !== "" && (
                      <p className="input-error-message absPosition">
                        Password is invalid
                      </p>
                    )}
                  {isValidate && values.newPassword === "" && (
                    <p className="input-error-message absPosition">
                      Please enter new password
                    </p>
                  )}
                </div>
              </div>
              <ul className="Instruction">
                <li>
                  <div
                    className={
                      passwordState.minlength === false ? "error" : "green-dot"
                    }
                  ></div>
                  At least 8-16 characters—the more characters, the better
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
          </div>
          <div className="row mar-bottom change-pass-Co-setting">
            <div
              className="col-12 col-sm-6 col-md-6 col-xl-6"
              style={{ height: "70px" }}
            >
              <div className="notification-div-flex">
                <p className="password-text">Confirm Password</p>
                <div className="form-group">
                  <div className="position-relative">
                    <input
                      maxLength={16}
                      disabled={
                        values.currentPassword === "" ||
                        errors.currentPasswordErr !== ""
                      }
                      autoComplete="off"
                      placeholder="Enter password"
                      onChange={onChangeHandler("confirmPassword")}
                      value={values.confirmPassword}
                      type={
                        visiblePassword.confirmPassword ? "text" : "password"
                      }
                      onKeyPress={handleKeyPress}
                      className={
                        "form-control " +
                        (values.newPassword !== "" &&
                          values.confirmPassword !== values.newPassword &&
                          " input-error") +
                        (values.confirmPassword === "" ||
                        (values.confirmPassword !== "" &&
                          errors.confirmPasswordErr !== "")
                          ? "input-error" +
                            (values.confirmPassword !== values.newPassword &&
                              " input-error ")
                          : "") +
                        "" +
                        (values.confirmPassword !== ""
                          ? " input-not-blank"
                          : " ") +
                        (values.confirmPassword !== "" &&
                        values.confirmPassword === values.newPassword
                          ? " password-success "
                          : "")
                      }
                    />
                    {values.confirmPassword &&
                      values.confirmPassword !== "" && (
                        <span
                          className="password-toggle-icon"
                          onClick={() =>
                            setVisiblePassword((value) => ({
                              ...value,
                              confirmPassword: !value.confirmPassword,
                            }))
                          }
                        >
                          <FontAwesomeIcon
                            icon={
                              visiblePassword.confirmPassword
                                ? "eye-slash"
                                : "eye"
                            }
                          />
                        </span>
                      )}
                  </div>
                  {/* {values.confirmPassword !== "" && errors && errors.confirmPasswordErr !== "" && <p className="input-error-message">
                    Password is invalid
                </p>} */}
                  {isValidate && values.confirmPassword === "" && (
                    <p className="input-error-message absPosition">
                      Please enter confirm password
                    </p>
                  )}
                  {values.confirmPassword !== "" &&
                    values.confirmPassword.length > 8 &&
                    values.newPassword !== "" &&
                    values.confirmPassword !== values.newPassword && (
                      <p className="input-error-message absPosition">
                        Password don't match
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="co-sequrity-bottom">
            <div class="bottom-logo-strip personal-details d-block d-sm-none">
              <div class="row aligncenter">
                <div class="col-12 col-sm-12 col-md-12 col-xl-12 flex">
                  <button
                    disabled={
                      values.newPassword === "" ||
                      isValidatePassword ||
                      values.confirmPassword === "" ||
                      values.newPassword !== values.confirmPassword
                    }
                    onClick={() => onSavePassword()}
                    className={
                      values.newPassword === "" ||
                      isValidatePassword ||
                      values.confirmPassword === "" ||
                      values.newPassword !== values.confirmPassword
                        ? "btn save-changes-btn"
                        : "btn save-changes-blue-btn"
                    }
                  >
                    Save Password
                  </button>
                  <div
                    style={{ paddingTop: 10, paddingLeft: 30 }}
                    onClick={() => onCancelButtonClick()}
                    className="discard-label-link"
                  >
                    Cancel
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-none d-sm-block">
            <div className="row">
              <div className="col-2">
                <button
                  disabled={
                    values.newPassword === "" ||
                    values.confirmPassword === "" ||
                    values.newPassword !== values.confirmPassword ||
                    isValidatePassword
                  }
                  onClick={() => onSavePassword()}
                  className={
                    values.newPassword === "" ||
                    values.confirmPassword === "" ||
                    values.newPassword !== values.confirmPassword ||
                    isValidatePassword
                      ? "btn save-changes-btn"
                      : "btn save-changes-blue-btn"
                  }
                  style={{ backgroundColor: "#e4e4e4" }}
                >
                  Save Password
                </button>
              </div>
              <div className="col-2">
                <div
                  style={{ paddingTop: 10, paddingLeft: 30 }}
                  onClick={() => onCancelButtonClick()}
                  className="discard-label-link"
                >
                  Cancel
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CoSetting;
