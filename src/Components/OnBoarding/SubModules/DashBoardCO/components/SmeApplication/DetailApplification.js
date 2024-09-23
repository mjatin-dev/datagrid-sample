import "./style.css";
import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import Container from "SharedComponents/Containers";
import CrossIcon from "../../../../../../assets/Icons/crossIconSme.svg";
import Comments from "../../../../../../assets/Icons/comment.svg";
import BackArrow from "../../../../../../assets/Icons/backArrowSme.svg";
import { useParams } from "react-router-dom";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";
import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import moment from "moment";
import downloadIcon from "../../../../../../assets/Icons/EditorIcons/download (1) 1.png";
import fileIcon from "../../../../../../assets/Icons/EditorIcons/Group.png";
import { fileDownload } from "CommonModules/helpers/file.helper";
import { Backdrop, CircularProgress } from "@mui/material";

function DetailAplication() {
  const [show, setShow] = useState("");
  const [status, setStatus] = useState("");
  const [anwserId, setAnwserId] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState("");
  const [commentList, setCommentList] = useState();

  const setComments = (type, formId) => {
    setShow(type);
    setFormId(formId);
    const filter = DetailList.find((item) => item.id === formId);
    setCommentList(filter.commments);
  };

  const params = useParams();

  const [DetailList, setDetailList] = useState([]);

  useEffect(() => {
    getApplications(params.id);
  }, [params.id]);

  const getApplications = async (id) => {
    setLoading(true);
    const submit = await axiosInstance.post(
      `compliance.api.GetSmeApplicationDetails`,
      {
        answer_id: id,
      }
    );
    if (submit.status === 200) {
      setStatus(submit.data.message.status);
      setAnwserId(submit.data.message.answer_id);
      const details = submit.data.message.answer.map((item) => {
        return {
          id: item?.form_id,
          fieldName: item?.question,
          fieldValue:
            item?.type?.type === "Address"
              ? item?.answer
              : item?.answer
              ? item?.answer
              : "-",
          file_details: item?.file_details ? item?.file_details : "-",
          requirements: "+Add more requirements",
          commments: item?.comments || [],
          type: item?.type?.type,
        };
      });
      setDetailList(details);
    } else {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const updateSMEstatus = async (status) => {
    const submit = await axiosInstance.post(
      `compliance.api.SetSmeApplicationStatus`,
      {
        answer_id: anwserId,
        status,
      }
    );
    if (submit.status === 200) {
      getApplications(params.id);
    } else {
      toast.error("Something went wrong");
    }
  };

  const submitComment = async () => {
    const submit = await axiosInstance.post(
      `compliance.api.SetSmeApplicationComments`,
      {
        answer_id: anwserId,
        comment: newComment,
        form_id: formId,
      }
    );
    if (submit.status === 200) {
      getApplications(params.id);
      setShow("");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => setLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container className="detail-application-main-div" variant="main">
        <>
          <div className="detail-application-head-div">
            <span style={{ display: "flex" }}>
              <Link to={"/smeApplication"}>
                <img
                  className="back-arrow-div"
                  src={BackArrow}
                  alt="BackArrow"
                />
              </Link>
              <p className="smeApplicationTitle">SME Application Form</p>
            </span>

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {/* <button
                className="smeDetailBtn"
                style={{ backgroundColor: "#7A73FF" }}
              >
                Add More
              </button> */}

              {status === "Approved" ? (
                <button
                  className="smeDetailBtn"
                  style={{ backgroundColor: "#7BB079" }}
                >
                  APPROVED
                </button>
              ) : (
                <button
                  className="smeDetailBtn"
                  style={{ backgroundColor: "#7BB079" }}
                  onClick={() => updateSMEstatus("Approved")}
                >
                  APPROVE
                </button>
              )}

              {status === "Rejected" ? (
                <button
                  className="smeDetailBtn"
                  style={{ backgroundColor: "#EB2929" }}
                >
                  REJECTED
                </button>
              ) : (
                <button
                  className="smeDetailBtn"
                  style={{ backgroundColor: "#EB2929" }}
                  onClick={() => updateSMEstatus("Rejected")}
                >
                  REJECT
                </button>
              )}
            </div>
          </div>
          <div className="form-div">
            {DetailList.map((el) => {
              return (
                <div className="detail-step-div">
                  <div style={{ flex: 1 }}>
                    <span className="flex-rows">
                      <p
                        className="smeDetailKey-p"
                        style={{ minWidth: "200px" }}
                      >
                        {el.fieldName}
                      </p>
                      <p className="smeDetailColon">:</p>
                      {el.type === "Address" ? (
                        el.fieldValue && (
                          <p
                            className="smeDetailValue-p"
                            style={{ color: "#2C2738" }}
                          >
                            {el?.fieldValue
                              ? ` ${JSON.parse(el?.fieldValue)?.streetAddress},
                           ${JSON.parse(el?.fieldValue)?.streetAddressLine2},
                           ${JSON.parse(el?.fieldValue)?.city},
                           ${JSON.parse(el?.fieldValue)?.postalCode}`
                              : "-"}
                          </p>
                        )
                      ) : el.type === "Attachment" ? (
                        typeof el?.file_details == "object" &&
                        el?.file_details?.length > 0 ? (
                          <div className="attachmentScroll ">
                            {el?.file_details &&
                              el?.file_details?.map((item, index) => (
                                <button
                                  className="fileDownloadButton"
                                  onClick={() => {
                                    fileDownload(item.file_id);
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={downloadIcon}
                                      width="20px"
                                      height="20px"
                                    />
                                    <span
                                      style={{
                                        marginLeft: "10px",
                                        marginRight: "10px",
                                      }}
                                    >
                                      Attachment {index + 1}.{item?.file_type}
                                    </span>
                                  </span>

                                  <img
                                    src={fileIcon}
                                    width="20px"
                                    height="20px"
                                  />
                                </button>
                              ))}
                          </div>
                        ) : (
                          "-"
                        )
                      ) : (
                        <p
                          className="smeDetailValue-p"
                          style={{ color: "#2C2738" }}
                        >
                          {el?.type === "Date"
                            ? moment(el.fieldValue).format("YYYY-DD-MM") !==
                              "Invalid date"
                              ? moment(el.fieldValue).format("YYYY-DD-MM")
                              : "-"
                            : el.fieldValue}
                        </p>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="flex-rows">
                      <div className="d-flex justify-content-between">
                        {/* <Link to={"/new-requirements"}>
                          <button className="smeDeatail-Btn">
                            {el.requirements}
                          </button>
                        </Link> */}
                        <div className="smeDetail-hr" />
                      </div>

                      <button
                        className="smeDeatail-Btn"
                        style={{
                          marginRight: "30px",
                          marginLeft: "30px",
                          textAlign: "center",
                          width: "200px",
                        }}
                        onClick={() => {
                          el.commments.length > 0
                            ? setComments("Comments", el.id)
                            : setComments("AddComments", el.id);
                        }}
                      >
                        {el.commments.length > 0
                          ? `Comments - ${el.commments.length}`
                          : "+Add Comments"}
                      </button>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* <div className="detail-step-div">
            <div className="d-flex justify-content-between">
              <div style={{ width: "55%" }}>
                <span className="flex">
                  <p className="smeDetailKey-p">Qualification</p>
                  <p className="smeDetailColon">:</p>
                  <p className="smeDetailValue-p" style={{ color: "#2C2738" }}>
                    BCA
                  </p>
                  <div className="qulification-div">
                    <div style={{ display: "flex" }}>
                      <img
                        className="pdf-file-img"
                        src={FileSmeIcon}
                        alt="FileSmeIcon"
                      />
                      <p style={{ fontSize: "16px", marginTop: "10px" }}>
                        file.Pdf
                      </p>
                    </div>
                    <img
                      className="pdf-file-img"
                      src={DowloadIcon}
                      alt="DowloadIcon"
                    />
                  </div>
                </span>
              </div>

              <div style={{ width: "41%" }}>
                <span className="d-flex justify-content-around">
                  <div
                    className="d-flex justify-content-between"
                    style={{ width: "54%" }}
                  >
                 
                    <div className="smeDetail-hr" />
                  </div>
                  <button
                    className="smeDeatail-Btn"
                    style={{
                      marginRight: "50px",
                    }}
                  >
                    Comments - 3
                  </button>
                </span>
              </div>
            </div>
          </div> */}

          {/* <div className="social-media-div">
            <div className="d-flex justify-content-between">
              <div style={{ width: "41%" }}>
                <span className="flex">
                  <p className="smeDetailKey-p">Social media</p>
                  <p className="smeDetailColon">:</p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <img
                      src={FacebookIcon}
                      width={"60px"}
                      style={{ marginLeft: "-15px" }}
                      height={"60px"}
                      alt="FacebookIcon"
                    />
                    <img
                      src={LinkedInIcon}
                      width={"60px"}
                      height={"60px"}
                      alt="LinkedInIcon"
                    />
                    <img
                      src={GoogleIcon}
                      width={"60px"}
                      height={"60px"}
                      alt="GoogleIcon"
                    />
                  </div>
                </span>
              </div>

              <div style={{ width: "41%" }}>
                <span className="d-flex justify-content-around">
                  <div
                    className="d-flex justify-content-between"
                    style={{ width: "54%" }}
                  >
               
                    <div className="smeDetail-hr" />
                  </div>

                  <button
                    className="smeDeatail-Btn"
                    style={{
                      marginRight: "27px",
                    }}
                  >
                    +Add Comments
                  </button>
                </span>
              </div>
            </div>
          </div> */}

          {/* <div style={{ width: "calc(100% - 4rem)", margin: "auto" }}>
            <span style={{ display: "flex" }}>
              <p className="requirement-note-p"> Note :</p>
              <p
                style={{
                  color: "#2C2738",
                  fontWeight: "500",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                }}
              >
                "Please provide the missing document for further processing.
              </p>
            </span>
            <span>
              <ul>
                <li style={{ color: "#B3ABC4" }}>
                  <span style={{ display: "flex" }}>
                    <p className="requirement-li">
                      Ralph Edwards was moved from Interview to Rejected.
                    </p>

                    <p className="requirement-li-2">24 May 2023</p>
                  </span>
                </li>
                <li style={{ color: "#B3ABC4" }}>
                  <span style={{ display: "flex" }}>
                    <p className="requirement-li">
                      Ralph Edwards was moved from Interview to Rejected.
                    </p>
                    <p className="requirement-li-2">24 May 2023</p>
                  </span>
                </li>
                <li style={{ color: "#B3ABC4" }}>
                  <span style={{ display: "flex" }}>
                    <p className="requirement-li">
                      Ralph Edwards was moved from Interview to Rejected.
                    </p>
                    <p className="requirement-li-2">24 May 2023</p>
                  </span>
                </li>
              </ul>
            </span>
            <a className="requirement-see-more" href="/">
              See more
            </a>{" "}
            <br />
            <button className="Send-requirements-btn">
              Send requirements to SME
            </button>
            <div />
          </div> */}
        </>
      </Container>

      {show === "Comments" && (
        <div className="add-edit-modal">
          <div className="comment-model-div">
            <div className="d-flex justify-content-between">
              <span className="d-flex">
                <img
                  src={Comments}
                  style={{
                    cursor: "pointer",
                    padding: "20px",
                  }}
                />

                <p style={{ marginTop: "22px", marginLeft: "-13px" }}>
                  Comments
                </p>
              </span>

              <img
                src={CrossIcon}
                onClick={() => {
                  setShow("");
                }}
                style={{
                  cursor: "pointer",
                  padding: "20px",
                }}
              />
            </div>

            <div
              style={{
                width: "100%",
                padding: "20px",
                paddingTop: "0px",
              }}
            >
              <textarea
                className="comment-text-area"
                placeholder="Enter comments"
                value={newComment}
                onChange={(event) => {
                  setNewComment(event.target.value);
                }}
              />
            </div>

            <button
              className="smeDetailBtn"
              style={{ backgroundColor: "#7BB079", marginBottom: 10 }}
              onClick={submitComment}
            >
              submit
            </button>
            {commentList.map((value) => {
              return (
                <div
                  style={{
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    display: "flex",
                  }}
                >
                  <div className="model-jc-div">
                    {getInitialName(value?.added_by_name)}
                  </div>
                  <div className="smetooltip">
                    <p className="comment-model-p ">
                      {value?.comment ? value?.comment : "-"}
                    </p>
                    <span class="smetooltiptext">{value?.comment}</span>
                  </div>
                  <p className="comment-model-date">
                    {" "}
                    {value?.added_time
                      ? moment(value?.added_time).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )
                      : "-"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {show === "AddComments" && (
        <div className="add-edit-modal">
          <div className="add-comment-modal">
            <div className="d-flex justify-content-between">
              <span className="d-flex">
                <img
                  src={Comments}
                  style={{
                    cursor: "pointer",
                    padding: "20px",
                  }}
                />

                <p
                  style={{
                    marginTop: "22px",
                    marginLeft: "-13px",
                  }}
                  onClick={() => {
                    setShow("");
                  }}
                >
                  +Add Comments
                </p>
              </span>
            </div>

            <div
              style={{
                width: "100%",
                padding: "20px",
                paddingTop: "0px",
              }}
            >
              <textarea
                className="comment-text-area"
                placeholder="Enter comments"
                value={newComment}
                onChange={(event) => {
                  setNewComment(event.target.value);
                }}
              />
            </div>
            <button
              className="smeDetailBtn"
              style={{ backgroundColor: "#7BB079", marginBottom: 10 }}
              onClick={submitComment}
            >
              submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default withRouter(DetailAplication);
