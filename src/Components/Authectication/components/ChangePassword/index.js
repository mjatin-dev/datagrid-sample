/* eslint-disable no-useless-escape */
import React, { useState } from "react";
import "./style.css";
import comtech from "../../../../assets/Images/CapmTech.png";
import secmark from "../../../../assets/Images/secmark.png";
import RightImageBg from "../../../../assets/Images/Onboarding/RectangleOnboadign.png";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
// import { toast } from "react-toastify";
import SideBar from "../../../OnBoarding/SubModules/SideBar";
import { actions as signInSignUpActions } from "../../../Authectication/redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import apiServices from "../../../../apiServices";
function ChangePassword({ history }) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const email = new URLSearchParams(window.location.search)
    .get("email")
    .replace(" ", "+");
  const key = new URLSearchParams(window.location.search).get("key");

  const [values, setValues] = useState({
    password: "",
    newpassword: "",
  });
  const [errors, setErrors] = useState({
    passwordErr: "",
    newpasswordErr: "",
  });
  const [isValidate, setIsValidate] = useState(false);
  const [passwordState, setPasswordState] = useState({
    minlength: false,
    uppercaseandlowercase: false,
    alphabetsandigit: false,
  });
  const onChangeHandler = (name) => (event) => {
    let passwordReg =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,16}$/;
    if (name === "password") {
      let inputKey = "passwordErr";
      let minlength = "minlength";
      let alphabetsandigit = "alphabetsandigit";
      let uppercaseandlowercase = "uppercaseandlowercase";
      if (!passwordReg.test(event.target.value)) {
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

    if (name === "newpassword") {
      let inputKey = "newpasswordErr";
      if (!passwordReg.test(event.target.value)) {
        setErrors({ ...errors, [inputKey]: "Password is invalid" });
      } else {
        setErrors({ ...errors, [inputKey]: "" });
      }
    }

    setValues({ ...values, [name]: event.target.value });
  };

  const onSubmit = () => {
    setIsValidate(true);
    if (
      errors.passwordErr !== "" ||
      errors.newpasswordErr !== "" ||
      values.password === "" ||
      values.newpassword === "" ||
      !email ||
      !key
    ) {
      return;
    }
    setIsValidate(false);
    dispatch(
      signInSignUpActions.updatePasswordRequest({
        user: email,
        key,
        new_password: values.newpassword,
        history,
      })
    );
  };
  // useEffect(() => {
  //   let email = "";
  //   const location = window.location.href.split("=");
  //   email = location[1];
  //   validateLinkExpiration(email);
  // }, []);

  // const validateLinkExpiration = (email) => {
  //   let obj = {
  //     email: email,
  //     invitation: "A",
  //   };
  //   if (email !== "") {
  //     apiServices
  //       .post("compliance.api.getEmailBody", obj)
  //       .then(function (response) {
  //         if (response && response.data.message.status === true) {
  //         } else {
  //           toast.success("The link you followed expired");
  //         }
  //       })
  //       .catch(function (error) {
  //         if (error) {
  //         }
  //       });
  //   }
  // };

  return (
    <div className="row">
      <div className="col-3 col-sm-4 col-md-4 col-xl-3 left-fixed">
        <div className="on-boarding">
          <SideBar />
        </div>
      </div>
      <div className="col-12 padding-right">
        <img
          className="bottom-right-bg"
          src={RightImageBg}
          alt="RightImageBg"
        />
        <div className="get-main">
          <div className="container">
            <div className="">
              <div className="get-started-header">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="header_logo">
                      {/* <a href="#" style={{'cursor': 'auto'}}> */}
                      <img
                        src={comtech}
                        alt="COMPLIANCE SUTRA"
                        title="COMPLIANCE SUTRA"
                      />
                      <span className="camp">COMPLIANCE SUTRA</span>
                      {/* </a> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="comtech_new_password newPass_form_wrapper">
                <p className="comtech_new_password_title">
                  Reset your password
                </p>
                <div className="newPass_form_wrapper">
                  <div className="form-group">
                    <label htmlFor="Company Email">New Password</label>
                    <div
                      className="position-relative"
                      style={{ width: "fit-content" }}
                    >
                      <input
                        type={isShowPassword ? "text" : "password"}
                        maxLength={16}
                        className={
                          "form-control " +
                          (values.password !== "" && " activeForm-control ") +
                          (values.password !== "" &&
                            values.newpassword !== "" &&
                            values.password !== values.newpassword &&
                            " input-error  ") +
                          (errors &&
                            errors.passwordErr !== "" &&
                            " input-error ") +
                          (isValidate &&
                            values.password === "" &&
                            " input-error ") +
                          (values.password !== "" &&
                            errors &&
                            errors.passwordErr === "" &&
                            " password-success-input ")
                        }
                        placeholder="Enter your new password"
                        value={values.password}
                        onChange={onChangeHandler("password")}
                      />
                      <span
                        className="password-toggle-icon"
                        onClick={() => {
                          setIsShowPassword(!isShowPassword);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={isShowPassword ? "eye-slash" : "eye"}
                        />
                      </span>
                    </div>
                    {values.password !== "" &&
                      errors &&
                      errors.passwordErr !== "" && (
                        <p className="input-error-message">
                          Password is invalid
                        </p>
                      )}

                    {isValidate && values.password === "" && (
                      <p className="input-error-message">
                        New password is required
                      </p>
                    )}
                    <ul className="Instruction">
                      <li>
                        <div
                          className={
                            passwordState.minlength === false
                              ? "error"
                              : "green-dot"
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
                  <div className="form-group">
                    <label htmlFor="Company Email">Confirm New Password</label>
                    <div
                      className="position-relative"
                      style={{ width: "fit-content" }}
                    >
                      <input
                        type={isShowConfirmPassword ? "text" : "password"}
                        maxLength={16}
                        className={
                          "form-control " +
                          (errors &&
                            errors.newpasswordErr !== "" &&
                            " input-error ") +
                          (values.password !== values.newpassword &&
                            values.newpassword !== "" &&
                            " input-error ") +
                          (values.password === " " && " input-error") +
                          (isValidate &&
                            values.newpassword === "" &&
                            " input-error ") +
                          (values.newpassword !== "" &&
                            values.password === values.newpassword &&
                            " password-success-input activeForm-control")
                        }
                        placeholder="Re-Enter your password"
                        value={values.newpassword}
                        onChange={onChangeHandler("newpassword")}
                      />
                      <span
                        className="password-toggle-icon"
                        onClick={() => {
                          setIsShowConfirmPassword(!isShowConfirmPassword);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={isShowConfirmPassword ? "eye-slash" : "eye"}
                        />
                      </span>
                    </div>

                    {isValidate && values.newpassword === "" && (
                      <p className="input-error-message">
                        Confirm password is required
                      </p>
                    )}

                    {values.password !== "" &&
                      values.newpassword !== "" &&
                      values.password !== values.newpassword && (
                        <p className="input-error-message">
                          Password don't match
                        </p>
                      )}
                  </div>

                  <button
                    style={{ cursor: "pointer" }}
                    type="submit"
                    onClick={() => onSubmit()}
                    className="btn common-button-newPassword"
                  >
                    Save Password
                  </button>
                </div>
              </div>
              <div className="bottom-logo-strip">
                <div className="row aligncenter">
                  <div className="col-md-12 col-xs-12 d-none d-sm-block text-right">
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

export default withRouter(ChangePassword);
