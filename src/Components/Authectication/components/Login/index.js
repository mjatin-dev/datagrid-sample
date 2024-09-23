import React, { useState } from "react";
import "./styles.css";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import comtech from "../../../../assets/Images/CapmTech.png";
import secmark from "../../../../assets/Images/secmark.png";
import RightImageBg from "../../../../assets/Images/Onboarding/RectangleOnboadign.png";
import SideBar from "../../../OnBoarding/SubModules/SideBar";
import { actions as signInSignUpActions } from "../../redux/actions";
import validator from "validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import Auth from "../Auth";
import { useSelector } from "react-redux";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { Link } from "react-router-dom";

function Login({ history }) {
  const dispatch = useDispatch();
  const [visible, setVisibility] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const Icon = (
    <FontAwesomeIcon
      icon={visible ? "eye-slash" : "eye"}
      onClick={() => setVisibility((visiblity) => !visiblity)}
    />
  );
  const InputType = visible ? "text" : "password";

  const [values, setValues] = useState({
    LoginId: "",
    Pwd: "",
    rememberme: 0,
    Loginty: "AdminEmail",
  });

  const [errors, setErrors] = useState({
    emailErr: "",
    passwordErr: "",
  });

  const onChangeHandler = (name) => (event) => {
    if (name === "LoginId") {
      let inputKey = "emailErr";
      if (!validator.isEmail(event.target.value)) {
        setErrors({ ...errors, [inputKey]: "Email is invalid" });
      } else {
        setErrors({ ...errors, [inputKey]: "" });
      }
    }

    setValues({ ...values, [name]: event.target.value });
  };

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      onSubmit();
    }
  };

  const onSubmit = () => {
    if (values.LoginId === "" || values.Pwd === "" || errors.emailErr !== "") {
      toast.error("Email and Password are required.");
      return;
    }
    dispatch(
      signInSignUpActions.signInRequest({
        email: values.LoginId,
        password: values.Pwd,
        history: history,
      })
    );
    // dispatch(signInSignUpActions.signInRequestSuccess({ loginSuccess: true }));
  };

  const redirectToForgotPasswordScreen = () => {
    return history.push("/forgot-password");
  };
  const redirectToSignupScreen = () => {
    return history.push("/sign-up");
  };
  return (
    <div className="row get-login-mobile">
      <Auth />
      <ToastContainer />
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
        <div className="get-main-login">
          <div className="container position-relative">
            <div className="">
              <div className="get-started-header">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="header_logo">
                      <Link to="/">
                        <img
                          src={comtech}
                          alt="COMPLIANCE SUTRA"
                          title="COMPLIANCE SUTRA"
                        />
                        <span className="camp">COMPLIANCE SUTRA</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="comtech_login comtech_form_wrapper">
                <p className="comtech_login_title">
                  Login to COMPLIANCE SUTRA!
                </p>
                <div className="comtech_form_wrapper">
                  <div className="form-group">
                    <label htmlFor="Company Email">Company Email</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className={
                          "form-control" +
                          (errors && errors.emailErr !== ""
                            ? " input-error error-msg-border"
                            : " ") +
                          // ( values && values.LoginId !== "" ? "  succes-input-borde" : " 11-1succes-input-border")
                          (values && values.LoginId === ""
                            ? ""
                            : " countryCode-sucess   ") +
                          (errors.emailErr === "" && " activeForm-control")
                        }
                        placeholder="Enter your company email"
                        value={values.LoginId}
                        onChange={onChangeHandler("LoginId")}
                      />
                    </div>
                    {errors && errors.emailErr !== "" && (
                      <p className="input-error-message">Email is invalid</p>
                    )}
                    {/* {values && values.LoginId === "" && <p className="input-error-message">
                                            Company email is required
                                     </p>} */}
                  </div>
                  <div className="form-group">
                    <label htmlFor="Company Email">Password</label>
                    <div className="input-wrapper">
                      <input
                        type={InputType}
                        className={
                          "form-control" +
                          (errors && errors.passwordErr !== ""
                            ? " error-msg-border"
                            : "") +
                          (values && values.Pwd === ""
                            ? ""
                            : " activeForm-control")
                        }
                        placeholder="Enter your password"
                        value={values.Pwd}
                        onChange={onChangeHandler("Pwd")}
                        onKeyPress={handleKeyPress}
                      />
                      <span className="password-toggle-ico">{Icon}</span>
                    </div>
                  </div>

                  <div className="d-flex login-forgot w-75">
                    {isLoading ? (
                      <Dots justify="start" className="mt-3 ml-2" />
                    ) : (
                      <>
                        <button
                          style={{ cursor: "pointer" }}
                          type="submit"
                          onClick={() => onSubmit()}
                          className="btn common-button-login"
                          disabled={
                            values.LoginId === "" ||
                            values.Pwd === "" ||
                            errors.emailErr !== ""
                          }
                        >
                          Login
                        </button>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => redirectToForgotPasswordScreen()}
                          className="forgot-pass"
                        >
                          {" "}
                          FORGOT PASSWORD
                        </span>
                      </>
                    )}
                    {/* <Dots/> */}
                  </div>
                </div>
              </div>
              {/* <div className="login-bottom"> */}
              <div className="bottom-logo-strip">
                <div className="row aligncenter">
                  <div className="col-md-6 col-xs-12">
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
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Login);
