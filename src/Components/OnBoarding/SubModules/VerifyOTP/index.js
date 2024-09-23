import React, { useEffect, useState } from "react";
import "./style.css";
import RightImageBg from "../../../../assets/Images/Onboarding/RectangleOnboadign.png";
import comtech from "../../../../assets/Images/CapmTech.png";
import secmark from "../../../../assets/Images/secmark.png";

import { useDispatch, useSelector } from "react-redux";
import SideBarInputControl from "../SideBarInputControl";
import { actions as authActions } from "../../../Authectication/redux/actions";
import api from "../../../../apiServices";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import MobileStepper from "../mobileStepper";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { clearDashboardAnalytics } from "SharedComponents/Dashboard/redux/actions";
import { getAuditRole } from "Components/Authectication/components/Auth";

function VeryOTP({ history }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOTP] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberErr, setPhoneNumberErr] = useState("");
  const [isEnableSecureOTP, setIsEnabledSecureOTP] = useState(false);
  const [showChangeMobileSection, setShowChangeMobileSection] = useState(false);
  const [showResendSection, setShowResendSection] = useState(false);
  const initialMinute = 1;
  const initialSeconds = 0;
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [otpValid, setOtpInValid] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [values, setValues] = useState({
    countryCode: "+91",
  });

  const mobileNumber =
    state &&
    state.complianceOfficer &&
    state.complianceOfficer.personalInfo &&
    state.complianceOfficer.personalInfo?.mobile_number;

  const cntryCode =
    state &&
    state.complianceOfficer &&
    state.complianceOfficer.personalInfo &&
    state.complianceOfficer.personalInfo?.countrycode;

  const validateCountryCode = (e) => {
    let strr = e.target.value;
    let str = strr.replace(/\D/g, "");

    if (str === "") {
      str = "91";
    }
    if (str) setCountryCode(true);
    // api
    //   .post("/api/CountryCodeCheck", payload)
    //   .then(function (response) {
    //     // handle success

    //     if (response && response.data && response.data.Status === "True") {
    //       setCountryCode(true);
    //     } else {
    //       setCountryCode(false);
    //     }
    //   })
    //   .catch(function (error) {
    //     if (error) {
    //       toast.error(error);
    //     }
    //   });
  };

  const MobileValidate = (e) => {
    let payload = {
      mobile_no: e.target.value,
    };
    setIsLoading(true);
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
          setDisabled(true);
          setIsLoading(false);
        } else {
          if (e.target.value.length < 10 || e.target.value.length > 10) {
            setPhoneNumberErr("Mobile number is invalid");
            setDisabled(true);
          } else {
            setPhoneNumberErr("");
            setDisabled(false);
          }
        }
        setIsLoading(false);
      })
      .catch(function (error) {
        setIsLoading(false);
      });
  };
  const handelChange = (e) => {
    setDisabled(false);
    const { name, value } = e.target;
    const mobileNumberReg = /^[0-9]{0,10}$/;
    const otpRE = /^[0-9]{0,6}$/;
    if (e.target.name === "otp") {
      if (!mobileNumberReg.test(e.target.value)) {
        return "";
      }
    }
    if (name === "countryCode") {
      setCountryCode(true);
      const re = /[\d\+]+/;
      if (e.target.value && !re.test(e.target.value)) {
        return "";
      } else {
        setValues({ countryCode: e.target.value });
      }
    }
    if (name === "phoneNumber") {
      if (e.target.value?.length === 10) {
        MobileValidate(e);
      }
      if (!mobileNumberReg.test(value)) {
        return "";
      } else {
        localStorage.setItem("mobileNumber", e.target.value);
        setPhoneNumber(e.target.value);
      }
      if (value.length < 10) {
        setPhoneNumberErr("Mobile number is invalid");
      } else {
        setPhoneNumberErr("");
      }
    }
    if (name === "otp") {
      if (!otpRE.test(value)) {
        return "";
      }
      setOTP(value);
    }
  };

  const updateMobileNumber = () => {
    setShowChangeMobileSection(true);
    setIsEnabledSecureOTP(true);
  };

  const resendOTP = () => {
    setShowResendSection(false);
    let payload = {
      mobile_number: history.location?.state?.mobile_number
        ? history.location?.state?.mobile_number
        : phoneNumber !== ""
        ? phoneNumber
        : mobileNumber && (cntryCode || "") + mobileNumber,
    };
    setIsLoading(true);
    api
      .post("compliance.api.generateOtp", payload)
      .then(function (response) {
        // handle success
        if (
          response &&
          response.data &&
          response.data.message &&
          (response.data.message === true ||
            response.data.message.status === true)
        ) {
          toast.success(
            "The OTP has been sent to your registered mobile number"
          );
          setSeconds(59);
        } else {
          toast.error("something went wrong please try again !!!");
        }
        setIsLoading(false);
      })
      .catch(function (error) {
        setIsLoading(false);
      });
  };

  const updateMobileNumberAndSendOTP = () => {
    setSeconds(59);
    const mobileNumberReg = /^[0-9]{0,10}$/;
    if (
      phoneNumber === "" ||
      !mobileNumberReg.test(phoneNumber) ||
      phoneNumber.length < 10
    ) {
      return "";
    } else {
      setDisabled(true);
      setCountryCode(true);
    }
    sendOTPRequest("test");
  };

  const sendOTPRequest = (text) => {
    setDisabled(true);
    let payload = {
      mobile_number: history.location?.state?.mobile_number
        ? history.location?.state?.mobile_number
        : phoneNumber !== ""
        ? phoneNumber
        : mobileNumber && (cntryCode || "") + mobileNumber,
    };
    if (text === "test") {
      payload.mobile_number = phoneNumber;
    }
    setIsLoading(true);
    api
      .post("compliance.api.generateOtp", payload)
      .then(function (response) {
        // handle success
        if (
          response &&
          response.data &&
          response.data.message &&
          (response.data.message === true ||
            response.data.message.status === true)
        ) {
          setIsEnabledSecureOTP(true);
          setShowChangeMobileSection(false);
          toast.success(
            "The OTP has been sent to your registered mobile number"
          );
        } else {
          toast.error("something went wrong please try again !!!");
          setIsEnabledSecureOTP(false);
          setShowChangeMobileSection(false);
        }

        setIsLoading(false);
      })
      .catch(function (error) {
        if (error) {
          setIsEnabledSecureOTP(false);
          setIsLoading(false);
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

  useEffect(() => {
    const mobile_number = history.location?.state?.mobile_number;
    const typeOfValidation = history.location?.state?.type;
    if (typeOfValidation === "mobile-validation") {
      if (mobile_number !== null && mobile_number !== "") {
        setPhoneNumber(mobile_number);
      } else {
        setShowChangeMobileSection(true);
        setIsEnabledSecureOTP(true);
      }
    } else if (!cntryCode && !mobileNumber) {
      setShowChangeMobileSection(true);
      setIsEnabledSecureOTP(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const verifyOTP = () => {
    let payload = {};
    payload = {
      input_otp: otp,
    };
    if (otp !== "") {
      setIsLoading(true);
      api
        .post("compliance.api.verifyOtp", payload)
        .then(function (response) {
          if (
            response &&
            response.data &&
            response.data.message &&
            response.data?.message?.status === true
          ) {
            setOtpInValid(false);
            toast.success("Mobile number successfully verified.");

            api.get("compliance.api.getUserDetails").then((res) => {
              if (res.data && res.data.message && res.data.message.status) {
                const { message } = res.data;
                const { user_details } = message;
                const auditUserType = getAuditRole(
                  user_details?.user_type || []
                );
                user_details.auditUserType = auditUserType;
                let complianceOfficer, teamMember, approver;
                let userType = 0;
                complianceOfficer = user_details.user_type.filter(
                  (type) => type.user_type_no === 3
                );
                approver = user_details.user_type.filter(
                  (type) => type.user_type_no === 5
                );
                teamMember = user_details.user_type.filter(
                  (type) => type.user_type_no === 4
                );
                if (complianceOfficer.length !== 0) userType = 3;
                else if (approver.length !== 0) userType = 5;
                else if (teamMember.length !== 0) userType = 4;

                user_details.UserType = userType;

                if (
                  history.location?.state?.type === "mobile-validation" &&
                  history.location?.state?.token !== ""
                ) {
                  user_details.token = history.location?.state?.token;
                }
                dispatch(
                  authActions.signInRequestSuccess({
                    loginSuccess: true,
                    data: user_details,
                  })
                );
                dispatch(clearDashboardAnalytics());
                setTimeout(() => {
                  history.push("/dashboard-view");
                }, 3000);
                // setIsLoading(false)
              }
            });
          } else if (
            response &&
            response.data &&
            response.data.message &&
            response.data.message.status === false
          ) {
            setOtpInValid(true);
            toast.error("Please enter valid OTP.");
          }
          setIsLoading(false);
        })
        .catch(function (error) {
          if (error) {
            setOtpInValid(false);
            toast.error("Something went wrong. Please try again");
            setIsLoading(false);
          }
        });
    } else {
      toast.error("Enter OTP");
    }
  };

  return (
    <div className="row">
      {!(history.location?.state?.type === "mobile-validation") && (
        <div className="col-3 col-sm-4 col-md-4 col-xl-3 left-fixed">
          <div className="on-boarding">
            <SideBarInputControl currentStep={3} />
          </div>
        </div>
      )}
      <div
        className={`col-12 ${
          !(history.location?.state?.type === "mobile-validation") &&
          "padding-right"
        }`}
      >
        <img
          className="bottom-right-bg"
          src={RightImageBg}
          alt="RightImageBg"
        />
        <div className="get-main otp-mobile-py">
          <div className="container position-relative">
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
              <div className="d-block d-sm-none mobile-steper">
                <div className="row mobile-top-py">
                  <div className="col-8">
                    <MobileStepper currentStep={3} />
                  </div>
                </div>
              </div>
              <div className="wrapper_login">
                <p className="login_title">
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
                        We will send OTP on{" "}
                        {history.location?.state?.mobile_number
                          ? history.location?.state?.mobile_number
                          : showChangeMobileSection
                          ? phoneNumber
                          : mobileNumber && (cntryCode || "") + mobileNumber}
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
                      {isLoading ? (
                        <Dots />
                      ) : (
                        <button
                          disabled={disabled}
                          onClick={() => sendOTPRequest()}
                          className="btn save-details common-button"
                        >
                          SECURE NOW
                        </button>
                      )}
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
                            type="text"
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
                        {!countryCode && (
                          <p
                            className="input-error-message"
                            style={{ marginBottom: "0px" }}
                          >
                            Invalid country code
                          </p>
                        )}
                        {phoneNumberErr !== "" && (
                          <p
                            className="input-error-message"
                            style={{ position: "absolute" }}
                          >
                            {phoneNumberErr}
                          </p>
                        )}
                        {isLoading ? (
                          <Dots />
                        ) : (
                          <button
                            disabled={!countryCode || disabled}
                            onClick={() => {
                              updateMobileNumberAndSendOTP();
                            }}
                            className="btn save-details common-button"
                          >
                            Secure Now
                          </button>
                        )}
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
                      {history.location?.state?.mobile_number
                        ? history.location?.state?.mobile_number
                        : // : showChangeMobileSection
                          phoneNumber ||
                          (mobileNumber && (cntryCode || "") + mobileNumber)}
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
                        <p
                          className="input-error-message"
                          style={{ position: "absolute" }}
                        >
                          OTP is invalid
                        </p>
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
                          <b>Didn't receive an OTP?</b>
                        </span>
                        <span onClick={() => resendOTP()} className="resend">
                          RESEND
                        </span>
                      </p>
                    )}
                    {isLoading ? (
                      <Dots />
                    ) : (
                      <button
                        style={{ cursor: "pointer" }}
                        onClick={() => verifyOTP()}
                        className="btn save-details common-button mt-0"
                      >
                        VERIFY
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="bottom-logo-strip">
              <div className="row aligncenter">
                <div className="col-6"></div>
                <div className="col-6 d-none d-sm-block text-right">
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
  );
}

export default withRouter(VeryOTP);
