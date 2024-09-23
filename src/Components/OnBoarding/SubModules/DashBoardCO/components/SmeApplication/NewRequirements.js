import "./style.css";
import React, { useEffect, useRef, useState } from "react";
import { withRouter, Link, useHistory } from "react-router-dom";
import Container from "SharedComponents/Containers";
import BackArrow from "../../../../../../assets/Icons/backArrowSme.svg";
import ShortAnswer from "./FormFields/ShortAnswers";
import Checkbox from "./FormFields/Checkboxs";
import TextField from "./FormFields/TextFields";
import Attachment from "./FormFields/Attachments";
import Button from "Components/Audit/components/Buttons/Button";
import LongAnswer from "./FormFields/LongAnswers";
import Dropdown from "./FormFields/Dropdowns";
import Radio from "./FormFields/Radio";
import Date from "./FormFields/Date";
import { Alert } from "antd";
import DateRange from "./FormFields/DateRange";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";
import { Modal } from "antd";
import { useDispatch } from "react-redux";
import { setPreviewQuestions } from "../SmeOnBoarding/redux/actions";
import SmeOnBoardingPreview from "../SmeOnBoarding/SmeOnBoardingPreview";
import { Edit } from "@mui/icons-material";
import DeleteIcon from "../../../../../../assets/Icons/deleteIcon-requirement.svg";
import cross from "../../../../../../assets/Icons/closeIcon1.png";
import FirstLastName from "./FormFields/FirstLastName";
import PAN from "./FormFields/PAN";
import Price from "./FormFields/Price";
import PhoneNumber from "./FormFields/PhoneNumber";
import URL from "./FormFields/URL";
import Address from "./FormFields/Address";
import LikertScale from "./FormFields/LikertScale";
import HeaderTabsForEventPage from "Components/Events/Components/HeaderTabs";

function NewRequirement() {
  const divRef = useRef();
  const ref = useRef(null);
  const dispatch = useDispatch();
  let history = useHistory();
  const divHeight = useRef(null);
  const [selectedTab, setSelectedTab] = useState("template");
  const [divHeightScroll, setDivHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState([
    {
      question: "",
      isRequired: false,
      form_id: "",
      type: {
        type: "",
        value: "",
        options: {
          style: "",
          description: "",
          includeTime: "",
          includeYear: "",
          allowFileTypes: "",
          maxFiles: 0,
          fileSize: "",
          responseValidation: {},
        },
      },
    },
  ]);
  const [errors, setErrors] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const FormComponentsTabsList = [
    {
      id: 1,
      tabName: "Date Range",
      html: <input type="text" placeholder="test" />,
    },
    {
      id: 2,
      tabName: "Checkbox",
    },
    {
      id: 3,
      tabName: "Text Field",
    },
    {
      id: 4,
      tabName: "Radio",
    },
    {
      id: 5,
      tabName: "Attachment",
    },
    {
      id: 6,
      tabName: "Date",
    },
    {
      id: 7,
      tabName: "Long answer",
    },
    {
      id: 8,
      tabName: "Short answer",
    },
    {
      id: 9,
      tabName: "Dropdown",
    },
    {
      id: 10,
      tabName: "First / Last Name",
    },
    // {
    //   id: 11,
    //   tabName: "Likert Scale",
    // },
    {
      id: 12,
      tabName: "Phone Number",
    },

    {
      id: 13,
      tabName: "Price",
    },
    {
      id: 14,
      tabName: "Address",
    },
    {
      id: 15,
      tabName: "URL",
    },
    {
      id: 16,
      tabName: "PAN",
    },
  ];

  const ondragstart = (event, value) => {
    event.dataTransfer.setData("value", value);
  };

  const ondragover = (event) => {
    event.target.classList.add("dragging");
    event.preventDefault();
  };

  const drop = (event, index) => {
    event.target.classList.remove("dragging");
    const temp = [...questions];
    const valueType = event.dataTransfer.getData("value");
    temp[index].type.type = valueType;
    setQuestions(temp);
  };

  const addQuestion = () => {
    const temp = [
      ...questions,
      {
        question: "",
        isRequired: false,
        form_id: "",
        type: {
          type: "",
          value: "",
          options: {
            style: "",
            description: "",
            includeTime: "",
            includeYear: "",
            allowFileTypes: "",
            maxFiles: 0,
            fileSize: "",
            responseValidation: {},
          },
        },
      },
    ];

    setQuestions(temp);
  };

  const setInputs = (event, index, type, option = "") => {
    console.log("event", event);
    const temp = [...questions];
    if (type === "question") {
      temp[index].question = event.target.value;
    }

    if (type === "required") {
      temp[index].isRequired = !temp[index].isRequired;
    }

    if (type === "checkbox" || type === "radio" || type === "dropdown") {
      if (option === "") temp[index].type.value = event.toString();

      if (option) {
        switch (option) {
          case "description":
            temp[index].type.options = {
              ...temp[index].type.options,
              description: event,
            };
            break;

          case "style":
            temp[index].type.options = {
              ...temp[index].type.options,
              style: event,
            };
            break;

          case "responseValidation":
            temp[index].type.options = {
              ...temp[index].type.options,
              responseValidation: event,
            };
            break;

          default:
            break;
        }
      }
    }
    if (
      type === "textfield" ||
      type === "longanswer" ||
      type === "shortanswer" ||
      type === "price" ||
      type === "firstLastName"
    ) {
      if (option === "") temp[index].type.value = event;

      if (option) {
        switch (option) {
          case "description":
            temp[index].type.options = {
              ...temp[index].type.options,
              description: event,
            };
            break;

          case "style":
            temp[index].type.options = {
              ...temp[index].type.options,
              style: event,
            };
            break;

          case "responseValidation":
            temp[index].type.options = {
              ...temp[index].type.options,
              responseValidation: event,
            };
            break;

          default:
            break;
        }
      }
    }

    if (type === "date" || type === "daterange") {
      if (option) {
        switch (option) {
          case "description":
            temp[index].type.options = {
              ...temp[index].type.options,
              description: event,
            };
            break;

          case "style":
            temp[index].type.options = {
              ...temp[index].type.options,
              style: event,
            };
            break;

          case "time":
            temp[index].type.options = {
              ...temp[index].type.options,
              includeTime: event,
            };
            break;

          case "year":
            temp[index].type.options = {
              ...temp[index].type.options,
              includeYear: event,
            };
            break;

          case "responseValidation":
            temp[index].type.options = {
              ...temp[index].type.options,
              responseValidation: event,
            };
            break;

          default:
            break;
        }
      }
    }

    if (type === "attachment") {
      if (option === "") temp[index].type.value = event;
      if (option) {
        switch (option) {
          case "allowFileTypes":
            temp[index].type.options = {
              ...temp[index].type.options,
              allowFileTypes: event,
            };
            break;

          case "maxFiles":
            temp[index].type.options = {
              ...temp[index].type.options,
              maxFiles: event,
            };
            break;

          case "fileSize":
            temp[index].type.options = {
              ...temp[index].type.options,
              fileSize: event,
            };
            break;
        }
      }
    }

    setQuestions(temp);
  };

  const deleteInputs = (index) => {
    const temp = [...questions];
    temp[index].type = {
      type: "",
      value: "",
      options: {
        style: "",
        description: "",
        responseValidation: {},
      },
    };
    setQuestions(temp);
  };

  const deleteQuestion = async (index) => {
    const temp = [...questions];
    const filter = temp.filter((item, i) => i !== index);
    setQuestions(filter);
  };

  const deleteQuestionEdit = async (index) => {
    const temp = [...questions];
    const deleteAPI = await axiosInstance.post(
      `compliance.api.DeleteSmeFormComponent`,
      { form_id: temp[index].form_id }
    );

    if (deleteAPI.data.message.success) {
      const filter = temp.filter((item, i) => i !== index);
      setQuestions(filter);
    } else {
      toast.error(deleteAPI.data.message.status_response);
    }
  };

  const validateQuestions = (preview = false) => {
    const array = [...questions];
    let listOfErros = [];
    setErrors([]);
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      const number = index + 1;

      if (element.question === "" || element.question.trim() === "") {
        listOfErros.push({ question: number, message: "Question is required" });
      }

      if (element.type.type === "") {
        listOfErros.push({
          question: number,
          message: "Input Field is required",
        });
      }

      if (
        element?.type?.type === "Checkbox" ||
        element?.type?.type === "Radio" ||
        element?.type?.type === "Dropdown"
      ) {
        if (element?.type?.value === "")
          listOfErros.push({
            question: number,
            message: "At least one option is required",
          });
      }
    }

    ref.current.scrollTo({ top: 0, behavior: "smooth" });
    if (listOfErros.length === 0) {
      if (preview) {
        setOpen(true);
      } else {
        submitQuestions();
      }
    }

    setErrors(listOfErros);
  };

  const submitQuestions = async () => {
    const payload = questions.map((item, index) => {
      return {
        ...item,
        order_seq: index + 1,
        form_id: item?.form_id ? item?.form_id : null,
      };
    });
    const submit = await axiosInstance.post(
      `compliance.api.UpdateSmeFormComponents`,
      { questions: payload }
    );

    if (submit.data.message.success) {
      getQuestions();
      !isEdit
        ? toast.success("Template created successfully")
        : toast.success("Template Edit successfully");
      if (!isEdit) {
        setQuestions([
          {
            question: "",
            isRequired: false,
            form_id: "",
            type: {
              type: "",
              value: "",
              options: {
                style: "",
                description: "",
                includeTime: "",
                includeYear: "",
                allowFileTypes: "",
                maxFiles: 0,
                fileSize: "",
                responseValidation: {},
              },
            },
          },
        ]);
      }
    } else {
      toast.error("Something went wrong");
    }
  };

  const getQuestions = async () => {
    setErrors([]);
    const submit = await axiosInstance.get(
      `compliance.api.GetSmeFormComponents`
    );

    if (submit.status === 200) {
      setIsEdit(true);
      setQuestions(submit.data.message);
    } else {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (divHeight?.current) {
      const height = divHeight?.current?.getBoundingClientRect().height;
      setDivHeight(height);
    }
  }, []);
  return (
    <>
      <div className="d-flex">
        <div className="formComponent-MainDiv">
          <p className="formComponent-Title">Form Components</p>
          <p className="drag-drop-para">
            Drag & drop items to create requirement
          </p>
          <div className="sme__newRequiremnets__main">
            {FormComponentsTabsList.map((el, index) => {
              return (
                <div className="sme_newRequiremnets_btns">
                  <Button
                    size="large"
                    className="form-tab-name"
                    style={{ textAlign: "left" }}
                    description={el.tabName}
                    draggable={true}
                    onDragStart={(e) => ondragstart(e, el.tabName)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <Container variant="main" className="requirement-title">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem 2rem",
            }}
          >
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
                  history.push("/smeApplication");
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
                }}
              >
                Template
              </div>
            </div> */}

            <HeaderTabsForEventPage defaultTabIndex={2} />
            <div>
              {isEdit ? (
                <img
                  src={cross}
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setErrors([]);
                    setIsEdit(false);
                    setQuestions([
                      {
                        question: "",
                        isRequired: false,
                        type: {
                          type: "",
                          value: "",
                          options: {
                            style: "",
                            description: "",
                            includeTime: "",
                            includeYear: "",
                            allowFileTypes: "",
                            maxFiles: 0,
                            fileSize: "",
                            responseValidation: {},
                          },
                        },
                      },
                    ]);
                  }}
                />
              ) : (
                <Edit
                  style={{ fontSize: "2rem", cursor: "pointer" }}
                  onClick={getQuestions}
                />
              )}
            </div>
          </div>

          <div className="newRequirement-div" ref={divHeight}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div onClick={() => history.goBack()}>
                <img
                  className="back-arrow-div"
                  src={BackArrow}
                  alt="BackArrow"
                />
              </div>
              <p className="smeApplicationTitle">
                {isEdit ? "Edit" : "New"} Requirements
              </p>
            </div>
            <button
              onClick={() => validateQuestions(true)}
              className="preview-btn-requirement"
            >
              Preview
            </button>
          </div>
          <div className="new-req-box" ref={ref}>
            {errors?.length > 0 && (
              <Alert
                message="Error"
                description={
                  <>
                    {errors.map((item) => (
                      <>
                        Question {item.question}: {item.message} <br />
                      </>
                    ))}
                  </>
                }
                type="error"
                showIcon
                className="error-div"
              />
            )}

            <div className="form-builder-main-container">
              <>
                {questions.map((item, index) => {
                  return (
                    <>
                      <div className="questionName-div">
                        <div style={{ display: "flex" }}>
                          <p
                            className="newRequirement-p"
                            style={{
                              paddingTop: "5px",
                            }}
                          >
                            Question name
                          </p>
                          {((!isEdit && index !== 0) ||
                            (isEdit && !item?.static_field)) && (
                            <img
                              src={DeleteIcon}
                              width={"30px"}
                              height={"30px"}
                              alt="DeleteIcon"
                              style={{ cursor: "pointer", marginLeft: 5 }}
                              onClick={() => {
                                isEdit
                                  ? deleteQuestionEdit(index)
                                  : deleteQuestion(index);
                              }}
                            />
                          )}
                        </div>

                        <span style={{ display: "flex" }}>
                          <p className="questionName-p">Required field</p>
                          <label className="switch">
                            <input
                              type="checkbox"
                              onChange={(event) =>
                                setInputs(event, index, "required")
                              }
                              checked={item?.isRequired}
                            />
                            <span className="smeSlider round"></span>
                          </label>
                        </span>
                      </div>

                      <div
                        style={{
                          width: "calc(100% - 4rem)",
                          margin: "auto",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Are you registered gift city ?"
                          className="questionName-input"
                          value={item.question}
                          onChange={(event) =>
                            setInputs(event, index, "question")
                          }
                          maxLength={150}
                        />

                        <div
                          ref={divRef}
                          className={
                            item.type.type !== ""
                              ? `sme__dropZoneBox`
                              : "sme__dropZone"
                          }
                          onDragOver={(event) => ondragover(event)}
                          onDragLeave={(event) => {
                            event.preventDefault();
                            event.target.classList.remove("dragging");
                          }}
                          onDrop={(event) => drop(event, index)}
                        >
                          {item.type.type === "" && (
                            <p className="sme__dropZone_p">
                              Drop Your requirements here
                            </p>
                          )}
                          {item.type.type === "Short answer" && (
                            <ShortAnswer
                              index={index}
                              data={item}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "Checkbox" && (
                            <Checkbox
                              data={item}
                              index={index}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "Date Range" && (
                            <DateRange
                              index={index}
                              data={item}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "Text Field" && (
                            <TextField
                              index={index}
                              data={item}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "Attachment" && (
                            <Attachment
                              index={index}
                              data={item}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "Long answer" && (
                            <LongAnswer
                              index={index}
                              data={item}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "First / Last Name" && (
                            <FirstLastName
                              index={index}
                              data={item}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}

                          {item.type.type === "Dropdown" && (
                            <Dropdown
                              data={item}
                              index={index}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "Radio" && (
                            <Radio
                              data={item}
                              index={index}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "PAN" && (
                            <PAN
                              data={item}
                              index={index}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "Price" && (
                            <Price
                              data={item}
                              index={index}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "Phone Number" && (
                            <PhoneNumber
                              data={item}
                              index={index}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "URL" && (
                            <URL
                              data={item}
                              index={index}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {/* {item.type.type === "Likert Scale" && (
                            <LikertScale
                              data={item}
                              index={index}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )} */}
                          {item.type.type === "Address" && (
                            <Address
                              data={item}
                              index={index}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                          {item.type.type === "Date" && (
                            <Date
                              data={item}
                              index={index}
                              setInputs={setInputs}
                              deleteInputs={deleteInputs}
                            />
                          )}
                        </div>
                      </div>
                    </>
                  );
                })}
                <div style={{ paddingLeft: 30 }}>
                  <button
                    className="addQuestion-para"
                    onClick={() => addQuestion()}
                  >
                    {" "}
                    +Add question
                  </button>
                </div>
              </>

              <div style={{ paddingLeft: 30 }}>
                <div style={{ display: "flex", marginTop: 20 }}>
                  <button
                    className="requirement-send-btn"
                    onClick={() => validateQuestions(false)}
                  >
                    Send
                  </button>
                  <button className="requirement-cancel-btn"> Cancel </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Modal
        width={1000}
        title="Preview"
        onCancel={() => setOpen(false)}
        centered
        open={open}
        footer={null}
      >
        <SmeOnBoardingPreview data={questions} />
      </Modal>
    </>
  );
}

export default withRouter(NewRequirement);
