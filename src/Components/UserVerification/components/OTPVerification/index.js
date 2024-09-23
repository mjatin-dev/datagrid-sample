import React, { useEffect, useState } from "react";
import "./otp.css";
import RightImageBg from "../../../../assets/Images/Onboarding/RectangleOnboadign.png";
import comtech from "../../../../assets/Images/CapmTech.png";
import secmark from "../../../../assets/Images/secmark.png";
import leftArrow from "../../../../assets/Icons/leftArrow.png";
import { useDispatch, useSelector } from "react-redux";
import SideBarInputControl from "../WebStepper.js";
import { actions as authActions } from "../../../Authectication/redux/actions";
import api from "../../../../apiServices";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import { clearDashboardAnalytics } from "SharedComponents/Dashboard/redux/actions";
import {
  getAuditRole,
  getUserType,
} from "Components/Authectication/components/Auth";
function VeryOTP({ history, currentStep }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [otp, setOTP] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberErr, setPhoneNumberErr] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isEnableSecureOTP, setIsEnabledSecureOTP] = useState(false);
  const [showChangeMobileSection, setShowChangeMobileSection] = useState(false);
  const [showResendSection, setShowResendSection] = useState(false);
  const initialMinute = 1;
  const initialSeconds = 0;
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [otpValid, setOtpInValid] = useState("");
  const [countryCode, setCountryCode] = useState(true);
  const [countryCodeCr, setCountryCodeCR] = useState("");
  const [values, setValues] = useState({
    countryCode: "+91",
  });

  const email =
    state &&
    state.users &&
    state.users.personalInfo &&
    state.users.personalInfo.formData &&
    state.users.personalInfo.formData.adminEmail;

  const mobile_number =
    state &&
    state.users &&
    state.users.personalInfo &&
    state.users.personalInfo.mobile_number;

  const countrycode =
    state &&
    state.users &&
    state.users.personalInfo &&
    state.users.personalInfo.countrycode;

  let tempMobileNumber =
    state &&
    state.users &&
    state.users.personalInfo &&
    state.users.personalInfo.formData &&
    state.users.personalInfo.formData.adminMobile;

  let initialCountryCode = "";
  initialCountryCode =
    state &&
    state.users &&
    state.users.personalInfo &&
    state.users.personalInfo.formData &&
    state.users.personalInfo.formData.countrycode;

  let countryCodeCR =
    state &&
    state.users.otpInfo &&
    state.users.otpInfo[0] &&
    state.users.otpInfo.length > 0 &&
    state.users.otpInfo[0][0] &&
    state.users.otpInfo[0][0].UserDetails &&
    state.users.otpInfo[0][0].UserDetails[0] &&
    state.users.otpInfo[0][0].UserDetails &&
    state.users.otpInfo[0][0].UserDetails[0].countrycode;

  useEffect(() => {
    if (countryCodeCR !== undefined && isEnableSecureOTP) {
      let concatCntryCode = `+${countryCodeCR}`;
      setCountryCodeCR(concatCntryCode);
    }
  }, [countryCodeCR, isEnableSecureOTP]);

  useEffect(() => {
    if (tempMobileNumber !== undefined) {
      setPhoneNumber(tempMobileNumber);
      setMobileNumber(tempMobileNumber);
    }
  }, [tempMobileNumber]);

  useEffect(() => {
    if (mobile_number !== undefined) {
      setMobileNumber(mobile_number);
    }
  }, [mobile_number]);
  const validateCountryCode = (e) => {
    let strr = e.target.value;
    let str = strr.replace(/\D/g, "");
    if (str === "") {
      str = "91";
    }
    if (str) setCountryCode(true);
  };

  const handelChange = (e) => {
    setOtpInValid(false);
    setCountryCode(true);
    const { name, value } = e.target;
    const mobileNumberReg = /^[0-9]{0,10}$/;
    const otpRE = /^[0-9]{0,6}$/;
    if (e.target.name === "otp") {
      if (!mobileNumberReg.test(e.target.value)) {
        return "";
      }
    }
    if (name === "phoneNumber") {
      if (value?.length === 10) {
        MobileValidate(e);
      }
      if (!mobileNumberReg.test(value)) {
        return "";
      } else {
        setPhoneNumber(value);
        setMobileNumber(value);
      }
      if (value.length < 10) {
        setPhoneNumberErr("Mobile number is invalid");
      } else {
        setPhoneNumberErr("");
      }
    }
    if (name === "countryCode") {
      const re = /[\d\+]+/;
      if (e.target.value && !re.test(e.target.value)) {
        return "";
      }
      setValues({ countryCode: e.target.value });
    }
    if (name === "otp") {
      if (!otpRE.test(value)) {
        return "";
      }
      setOTP(value);
    }
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
          setPhoneNumberErr("mobile already exist");
          // setDisabled(true);
        } else {
          if (e.target.value.length < 10 || e.target.value.length > 10) {
            setPhoneNumberErr("Mobile number is invalid");
            // setDisabled(true);
          } else {
            setPhoneNumberErr("");
            // setDisabled(false);
          }
        }
      })
      .catch(function (error) {
        if (error) {
        }
      });
  };

  const updateMobileNumber = () => {
    setShowChangeMobileSection(true);
    setIsEnabledSecureOTP(true);
    setPhoneNumber("");
  };

  const resendOTP = (value, emails) => {
    setShowResendSection(false);

    let payload = {
      mobile_number: countrycode + value,
    };
    api
      .post("compliance.api.generateOtp", payload)
      .then(function (response) {
        // handle success
        if (
          response &&
          response.data &&
          response.data.message &&
          response.data.message.status === true
        ) {
          setSeconds(60);
          toast.success(
            "The OTP has been sent to your registered mobile number"
          );
        } else if (
          response &&
          response.data &&
          response.data.message &&
          response.data.message.status === false &&
          response.data.message.status_response
        ) {
          toast.error(response.data.message.status_response);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      })
      .catch(function (error) {
        if (error) {
        }
      });
  };

  const sendOTPRequest = () => {
    let payload = {};
    payload = {
      mobile_number: !phoneNumber ? countrycode + mobile_number : phoneNumber,
    };

    api
      .post("compliance.api.generateOtp", payload)
      .then(function (response) {
        // handle success
        if (
          response &&
          response.data &&
          response.data.message &&
          response.data.message.status === true
        ) {
          setIsEnabledSecureOTP(true);
          setShowChangeMobileSection(false);
          toast.success(
            "The OTP has been sent to your registered mobile number"
          );
        } else if (
          response &&
          response.data &&
          response.data.message &&
          response.data.message.status === false &&
          response.data.message.status_response
        ) {
          toast.error(response.data.message.status_response);
          setIsEnabledSecureOTP(true);
          setShowChangeMobileSection(false);
        } else {
          toast.error("Something went wrong. Please try again.");
          setIsEnabledSecureOTP(true);
          setShowChangeMobileSection(false);
        }
      })
      .catch(function (error) {
        if (error) {
          setIsEnabledSecureOTP(false);
        }
      });
  };

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

  const verifyOTP = () => {
    const payload = {
      input_otp: otp,
    };
    if (otp !== "") {
      api
        .post("compliance.api.verifyOtp", payload)
        .then(function (response) {
          // handle success
          if (
            response &&
            response.data &&
            response.data?.message?.status === true
          ) {
            setOtpInValid(false);
            toast.success("OTP is verified successfully");
            api.get("compliance.api.getUserDetails").then((res) => {
              if (res.data && res.data.message && res.data.message.status) {
                const { message } = res.data;
                const { user_details } = message;
                // let complianceOfficer, teamMember, approver;
                // let userType = 0;
                // complianceOfficer = user_details.user_type.filter(
                //   (type) => type.user_type_no === 3
                // );
                // approver = user_details.user_type.filter(
                //   (type) => type.user_type_no === 5
                // );
                // teamMember = user_details.user_type.filter(
                //   (type) => type.user_type_no === 4
                // );
                // if (complianceOfficer.length !== 0) userType = 3;
                // else if (approver.length !== 0) userType = 5;
                // else if (teamMember.length !== 0) userType = 4;
                const { userType, isLicenseManager, isCEApprover } =
                  getUserType(user_details?.user_type || []);
                const auditUserType = getAuditRole(
                  user_details?.user_type || []
                );

                user_details.UserType = userType;
                user_details.isLicenseManager = isLicenseManager;
                user_details.isCEApprover = isCEApprover;
                user_details.auditUserType = auditUserType;
                dispatch(
                  authActions.signInRequestSuccess({
                    loginSuccess: true,
                    data: user_details,
                  })
                );
                dispatch(clearDashboardAnalytics());
                history.push("/dashboard-view");
                // if (userType === 3) {
                //   history.push("/dashboard-view");
                // } else {
                //   history.push("/dashboard");
                // }
              }
            });
          } else {
            setOtpInValid(true);
            toast.error(
              response?.data?.message?.message ||
                "Something went wrong. Please try again."
            );
          }
        })
        .catch(function (error) {
          if (error) {
            setOtpInValid(false);
          }
        });
    } else {
      toast.error("Enter OTP");
    }
  };

  return (
    <div className="row">
      <div className="col-3 left-fixed">
        <div className="on-boarding">
          <SideBarInputControl currentStep={2} />
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
              <div className="wrapper_login">
                <p className="login_title">
                  <img className="right-back-arrow" src={leftArrow} alt="" />{" "}
                  Let's secure your account
                  <br />
                  with verified mobile
                </p>

                {isEnableSecureOTP === false && (
                  <div>
                    <div className="send-otp">
                      <p className="disc-text">
                        This helps you prevent unauthorized access to your
                        account. And you don't have to remember any password
                      </p>
                      <p className="will-send-text">
                        We will send OTP on {countrycode + mobile_number}
                        <span className="space-mobile d-block d-sm-none">
                          <br />
                        </span>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => updateMobileNumber()}
                          className="change"
                        >
                          CHANGE
                        </span>
                      </p>
                      <button
                        style={{ cursor: "pointer" }}
                        onClick={() => sendOTPRequest()}
                        className="btn save-details common-button"
                      >
                        SECURE NOW
                      </button>
                    </div>
                  </div>
                )}
                {showChangeMobileSection && (
                  <div>
                    <div className="send-otp">
                      <p className="disc-text">
                        This helps you prevent unauthorized access to your
                        account. And you don't have to remember any password
                      </p>
                      <p className="will-send-text">We will send OTP on:</p>
                      <div className="form-group smallBtn">
                        <div className="d-flex">
                          <input
                            style={{
                              width: "45px",
                              fontWeight: "400",
                              fontSize: "13px",
                            }}
                            type="text"
                            className="form-control plus-pin"
                            id="countryCode"
                            name="countryCode"
                            maxLength="3"
                            value={values.countryCode}
                            onChange={handelChange}
                            onBlur={(e) => validateCountryCode(e)}
                          />
                          <input
                            style={{ fontWeight: "400", fontSize: "13px" }}
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={handelChange}
                            className={
                              "form-control input-mobile-box-otp" +
                              (phoneNumberErr !== "" ? "input-error" : "")
                            }
                            id="OTP"
                            maxLength={10}
                            placeholder="Enter mobile number"
                            required
                          />
                        </div>

                        {countryCode === false || values.countryCode === "" ? (
                          <p
                            className="input-error-message"
                            style={{ marginBottom: "0px" }}
                          >
                            Invalid country code
                          </p>
                        ) : null}

                        {phoneNumberErr !== "" && (
                          <p className="input-error-message">
                            {phoneNumberErr}
                          </p>
                        )}
                        <button
                          disabled={
                            !countryCode ||
                            (phoneNumber === "" && phoneNumberErr !== "") ||
                            phoneNumberErr !== ""
                          }
                          onClick={(e) => sendOTPRequest()}
                          className="btn save-details common-button"
                        >
                          Secure Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isEnableSecureOTP && !showChangeMobileSection && (
                  <div className="verify-otp">
                    <p className="disc-text">
                      Please enter the verification code sent to your phone no.
                    </p>
                    <p className="will-send-text">
                      {" "}
                      {countryCodeCr !== ""
                        ? countryCodeCr
                        : initialCountryCode}{" "}
                      {mobileNumber}{" "}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => updateMobileNumber()}
                        className="mobile-change"
                      >
                        CHANGE
                      </span>
                    </p>

                    <div className="form-group smallBtn">
                      <input
                        type="text"
                        className={
                          "form-control " +
                          (otp !== "" && otpValid === true
                            ? "input-error"
                            : "") +
                          (otp !== "" && otpValid === false
                            ? " success-input-form-control"
                            : "")
                        }
                        value={otp}
                        name="otp"
                        onChange={handelChange}
                        id="OTP"
                        maxLength={6}
                        placeholder="Enter 6 digit OTP"
                        required
                      />
                      {otp !== "" && otpValid === true && (
                        <p className="input-error-message">Invalid OTP</p>
                      )}
                    </div>
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
                          Didn't receive an OTP?
                        </span>
                        <span
                          onClick={() => resendOTP(mobileNumber, email)}
                          className="resend"
                        >
                          RESEND
                        </span>
                      </p>
                    )}
                    <button
                      onClick={() => verifyOTP(mobileNumber)}
                      className="btn save-details common-button mt-0"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>
              <div className="bottom-logo-strip">
                <div className="row aligncenter">
                  <div className="col-6"></div>
                  <div className="col-6 d-none d-sm-block text-right">
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
  );
}

export default withRouter(VeryOTP);
