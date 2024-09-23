import React, { useState } from "react";
import "./style.css";
import comtech from "../../../../assets/Images/CapmTech.png";
import secmark from "../../../../assets/Images/secmark.png";
import RightImageBg from "../../../../assets/Images/Onboarding/RectangleOnboadign.png";
import SideBar from "../../../OnBoarding/SubModules/SideBar";
import validator from "validator";
import api from "../../../../apiServices";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";

function ForgotPassword({ history }) {
  const [values, setValues] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    emailErr: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const onChangeHandler = (name) => (event) => {
    if (name === "email") {
      let inputKey = "emailErr";
      if (!validator.isEmail(event.target.value)) {
        setErrors({ ...errors, [inputKey]: "Email is invalid" });
      } else {
        setErrors({ ...errors, [inputKey]: "" });
      }
    }

    setValues({ ...values, [name]: event.target.value });
  };

  const onSubmit = () => {
    if (errors.emailErr !== "" || values.email === "") {
      // scrollToElement('.input-error');
      toast.error("Email is required");
      return;
    }
    let payload = {
      email: values.email,
    };
    try {
      setIsLoading(true);
      api
        .post("/compliance.api.sendResetPasswordEmail", payload)
        .then(function (response) {
          if (
            response &&
            response.data &&
            response.data.message.status === true
          ) {
            toast.success(
              "The reset password link has been sent to your email account successfully"
            );
            setIsLoading(false);
            //sendResetPasswordEmail(values.email);
          } else {
            toast.error(
              response.data.message.status_response ||
                "Email is not available please register account"
            );
            setIsLoading(false);
          }
        })
        .catch(function (error) {
          setIsLoading(false);
          if (error) {
          }
        });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const redirectToSignupScreen = () => {
    return history.push("/sign-up");
  };
  return (
    <>
      <BackDrop isLoading={isLoading} />
      <div className="row forgot-pass-mobile">
        <div className="col-3 col-sm-4 col-md-4 col-xl-3 left-fixed">
          <div className="on-boarding">
            <SideBar />
            {/* <SideBarInputControl /> */}
          </div>
        </div>
        <div className="col-12 padding-right">
          <img
            className="bottom-right-bg"
            src={RightImageBg}
            alt="RightImageBg"
          />
          <div className="get-main">
            <div className="container position-relative">
              <div className="forgot-pass-top">
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
                <div className="comtech_forgot forgot_form_wrapper">
                  <p className="comtech_forgot_title">Forgot Password</p>
                  <div className="forgot_form_wrapper">
                    <div className="form-group">
                      <label htmlFor="Company Email">Registered Email</label>
                      <input
                        type="text"
                        className={
                          "form-control" +
                          (errors &&
                          values.email !== "" &&
                          errors.emailErr !== ""
                            ? " input-error"
                            : "") +
                          // (setErrors("") ? " jhd" : "non")
                          // +  (setErrors(""))
                          (values.email !== "" && errors.emailErr === ""
                            ? " success-form-control"
                            : "")
                        }
                        placeholder="Enter your registered email"
                        value={values.email}
                        onChange={onChangeHandler("email")}
                      />
                      {errors &&
                        values.email !== "" &&
                        errors.emailErr !== "" && (
                          <p className="input-error-message">
                            Email is invalid
                          </p>
                        )}
                    </div>

                    <button
                      style={{ cursor: "pointer" }}
                      type="submit"
                      onClick={() => onSubmit()}
                      className="btn common-button-forgot"
                      disabled={errors.emailErr !== "" || values.email === ""}
                    >
                      Send Link
                    </button>
                    <p className="activate-link">
                      We will send a password reset link on your email
                    </p>
                  </div>
                </div>
                <div className="bottom-logo-strip">
                  <div className="row align-items-center">
                    <div className="col-md-6 col-xs-12 ">
                      <p
                        onClick={() => redirectToSignupScreen()}
                        style={{ cursor: "pointer" }}
                        className="account-link"
                      >
                        Don't have an account?
                        <span className="login-link ml-2">SIGNUP</span>
                      </p>
                    </div>
                    <div className="col-md-6 col-xs-12 d-none d-sm-block text-right">
                      {/* <a href="#" style={{'cursor': 'auto'}}> */}
                      <span className="powerBy">Powered by</span>
                      <img
                        className="header_logo footer-logo-secmark"
                        src={secmark}
                        alt="SECMARK"
                        title="SECMARK"
                      />
                      {/* </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withRouter(ForgotPassword);
