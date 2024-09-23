import "./style.css";
import React, { useEffect, useState } from "react";
import { withRouter, Link, useHistory } from "react-router-dom";
import Container from "SharedComponents/Containers";
import ArrowRight from "../../../../../../assets/Icons/arrowRight.svg";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";
import HeaderTabsForEventPage from "Components/Events/Components/HeaderTabs";

function ApplicationForm() {
  const [selectedTab, setSelectedTab] = useState("applicationForm");
  const history = useHistory();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getApplications();
  }, []);

  const getApplications = async () => {
    const submit = await axiosInstance.get(`compliance.api.SmeApplicationList`);
    if (submit.status === 200) {
      setApplications(submit.data.message);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {/* <Container variant="main" className="ApplicationForm-main-div"> */}
      <Container variant="main">
        <Container variant="container">
          <Container variant="content">
            {/* <div className="smeToggleButtonBox">
          <div
            className="smeFormButton"
            style={
              selectedTab === "applicationForm"
                ? {
                    color: "#ffffff",
                    backgroundColor: "#7A73FF",
                  }
                : {}
            }
            onClick={() => {
              setSelectedTab("applicationForm");
            }}
          >
            Application form
          </div>
          <div
            className="smeTemplateButton"
            style={
              selectedTab === "template"
                ? {
                    color: "#ffffff",
                    backgroundColor: "#7A73FF",
                  }
                : {}
            }
            onClick={() => {
              setSelectedTab("template");
              history.push("/new-requirements");
            }}
          >
            Template
          </div>
        </div> */}
            <div className="smeApplicationTitle-div">
              <HeaderTabsForEventPage defaultTabIndex={0} />
              {/* <p className="smeApplicationTitle mt-3">SME Application Form</p> */}
            </div>

            <div className="ApplicationForm-table-header d-none d-md-flex mt-md-3 mb-md-2 project-management__project-header project-management__project-data-container align-items-left justify-content-between w-100">
              <p
                style={{ textAlign: "revert", flex: "0.14" }}
                className="project-data-container__item wide"
              >
                Domain Name
              </p>
              <p
                style={{ textAlign: "revert", flex: "0.17" }}
                className="project-data-container__item wide-2"
              >
                Full Name
              </p>
              <p
                style={{ textAlign: "revert", flex: "0.2" }}
                className="project-data-container__item wide-2"
              >
                Mobile Number
              </p>
              <p
                style={{ textAlign: "revert" }}
                className="project-data-container__item wide-flex-2"
              >
                Email Id
              </p>
              <p
                style={{ textAlign: "revert" }}
                className="project-data-container__item wide"
              >
                Country
              </p>
              <p
                style={{ textAlign: "revert" }}
                className="project-data-container__item wide"
              >
                State
              </p>
              <p
                style={{ textAlign: "revert" }}
                className="project-data-container__item wide"
              >
                Pincode
              </p>
              {/* <p
            style={{ textAlign: "revert", flex: "0.23" }}
            className="project-data-container__item wide-flex-2"
          >
            Qualification
          </p> */}
            </div>
            {applications?.length > 0 &&
              applications.map((item, index) => {
                return (
                  <div
                    style={{
                      marginTop: "20px",
                      textAlign: "inherit",
                      // width: "calc(100% - 4rem)",
                      margin: "auto",
                    }}
                    className="d-none d-md-flex mt-md-3 mb-md-2 project-management__project-data-container d-flex  justify-content-between"
                  >
                    <p
                      style={{
                        textAlign: "revert",
                        paddingTop: "9px",
                        flex: "0.137",
                      }}
                      className="project-data-container__item wide"
                    >
                      {item?.answer?.find(
                        (value) =>
                          value?.question?.toLowerCase() === "domain name"
                      )?.answer || "-"}
                    </p>
                    <p
                      style={{ textAlign: "revert", paddingTop: "9px" }}
                      className="project-data-container__item wide"
                    >
                      {item?.answer?.find(
                        (value) =>
                          value?.question?.toLowerCase() === "first name" ||
                          value?.question?.toLowerCase() === "last name" ||
                          value?.question?.toLowerCase() === "full name"
                      )?.answer || "-"}
                    </p>
                    <p
                      style={{
                        textAlign: "revert",
                        paddingTop: "9px",
                        flex: "0.174",
                      }}
                      className="project-data-container__item wide"
                    >
                      {item?.answer?.find(
                        (value) =>
                          value?.question?.toLowerCase() === "mobile number" ||
                          value?.question?.toLowerCase() === "phone number"
                      )?.answer || "-"}
                    </p>
                    <p
                      style={{ textAlign: "revert", paddingTop: "9px" }}
                      className="project-data-container__item wide-flex-2"
                    >
                      {item?.answer?.find(
                        (value) =>
                          value?.question?.toLowerCase() === "email" ||
                          value?.question?.toLowerCase() === "email id" ||
                          value?.question?.toLowerCase() === "email address"
                      )?.answer || "-"}
                    </p>
                    <p
                      style={{ textAlign: "revert", paddingTop: "9px" }}
                      className="project-data-container__item wide"
                    >
                      {item?.answer?.find(
                        (value) => value?.question?.toLowerCase() === "country"
                      )?.answer || "-"}
                    </p>
                    <p
                      style={{ textAlign: "revert", paddingTop: "9px" }}
                      className="project-data-container__item wide"
                    >
                      {item?.answer?.find(
                        (value) => value?.question?.toLowerCase() === "state"
                      )?.answer || "-"}
                    </p>
                    <p
                      style={{ textAlign: "revert", paddingTop: "9px" }}
                      className="project-data-container__item wide"
                    >
                      {item?.answer?.find(
                        (value) =>
                          value?.question?.toLowerCase() === "pin code" ||
                          value?.question?.toLowerCase() === "pincode"
                      )?.answer || "-"}
                    </p>
                    <div className="flex">
                      {/* <button className="application-bca-btn">BCA</button>
                  <button className="application-mca-btn"> MCA</button> */}
                      <Link to={`/detail-application/${item?.answer_id}`}>
                        <img
                          src={ArrowRight}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </Link>
                    </div>
                  </div>
                );
              })}
          </Container>
        </Container>
      </Container>
    </>
  );
}

export default withRouter(ApplicationForm);
