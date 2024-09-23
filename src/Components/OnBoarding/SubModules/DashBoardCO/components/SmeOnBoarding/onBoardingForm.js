/* eslint-disable default-case */
import React, { useEffect, useMemo, useState } from "react";
import styles from "./style.module.scss";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";
import DateRange from "./InputFields/DateRangeInput";
import Checkbox from "./InputFields/CheckboxsInput";
import ShortAnswer from "./InputFields/ShortAnswersInput";
import Attachment from "./InputFields/AttachmentsInput";
import LongAnswer from "./InputFields/LongAnswersInput";
import Dropdowns from "./InputFields/DropdownsInput";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "./InputFields/RadioInput";
import Date from "./InputFields/DateInput";
import ApplicationSuccess from "./ApplicationSuccess";
import URLInput from "./InputFields/URLInput";
import PriceInput from "./InputFields/PriceInput";
import PANInput from "./InputFields/PANInput";
import FirstLastNameInput from "./InputFields/FirstLastNameInput";
import PhoneNumber from "./InputFields/PhoneNumber";
import AddressInput from "./InputFields/AddressInput";

import { useForm } from "react-hook-form";
import { FaLastfmSquare } from "react-icons/fa";

function OnBoardingForm() {
  const [questions, setQuestions] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [customErrors, setCustomErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const isEmptyObject = (obj) => {
    return Object?.keys(obj)?.length === 0;
  };
  const validateQuestions = () => {
    const array = [...questions];
    setCustomErrors({});
    const errors = {};
    array?.map((field) => {
      if (field?.type?.type === "Date Range") {
        if (field?.isRequired && !field?.answer) {
          errors[field?.form_id] = { message: "Field is Required" };
        }
      }
      if (field?.type?.type === "Date") {
        if (field?.isRequired && !field?.answer) {
          errors[`${field?.form_id}-date`] = {
            message: "Date is Required",
          };
          errors[`${field?.form_id}-time`] = {
            message: "Time is Required",
          };
        } else {
          if (field?.answer) {
            const temp = JSON.parse(field?.answer);
            if (field?.isRequired && !temp?.date) {
              errors[`${field?.form_id}-date`] = {
                message: "Date is Required",
              };
            }
            if (field?.isRequired && !temp?.time) {
              errors[`${field?.form_id}-time`] = {
                message: "Time is Required",
              };
            }
          }
        }
      }

      if (field?.type?.type === "Attachment") {
        if (field?.isRequired && !field?.file_details) {
          errors[field?.form_id] = { message: "Field is Required" };
        }
      }
      if (field?.type?.type === "Address") {
        if (field?.isRequired && !field?.answer) {
          errors[`${field?.form_id}-streetAddressLine2`] = {
            message: "Street Address Line 2 is Required",
          };
          errors[`${field?.form_id}-streetAddress`] = {
            message: "Street Address is Required",
          };
          errors[`${field?.form_id}-region`] = {
            message: "Region is Required",
          };
          errors[`${field?.form_id}-postalCode`] = {
            message: "Postal / Zip Code is Required",
          };
          errors[`${field?.form_id}-city`] = {
            message: "City is Required",
          };
          errors[`${field?.form_id}-country`] = {
            message: "Country is Required",
          };
        } else {
          if (field?.answer) {
            const temp = JSON.parse(field?.answer);
            if (field?.isRequired && !temp?.streetAddressLine2) {
              errors[`${field?.form_id}-streetAddressLine2`] = {
                message: "Street Address Line 2 is Required",
              };
            } else if (
              temp?.streetAddressLine2 &&
              temp?.streetAddressLine2?.trim() === ""
            ) {
              errors[`${field?.form_id}-streetAddressLine2`] = {
                message: "Street Address Line 2 can't be just empty space",
              };
            }
            if (field?.isRequired && !temp?.streetAddress) {
              errors[`${field?.form_id}-streetAddress`] = {
                message: "Street Address is Required",
              };
            } else if (
              temp?.streetAddress &&
              temp?.streetAddress?.trim() === ""
            ) {
              errors[`${field?.form_id}-streetAddress`] = {
                message: "Street Address can't be just empty space",
              };
            }
            if (field?.isRequired && !temp?.region) {
              errors[`${field?.form_id}-region`] = {
                message: "Region is Required",
              };
            } else if (temp?.region && temp?.region?.trim() === "") {
              errors[`${field?.form_id}-region`] = {
                message: "Region can't be just empty space",
              };
            }
            if (field?.isRequired && !temp?.postalCode) {
              errors[`${field?.form_id}-postalCode`] = {
                message: "Postal / Zip Code is Required",
              };
            } else if (temp?.postalCode && temp?.postalCode?.trim() === "") {
              errors[`${field?.form_id}-postalCode`] = {
                message: "Postal / Zip Code can't be just empty space",
              };
            }
            if (field?.isRequired && !temp?.city) {
              errors[`${field?.form_id}-city`] = {
                message: "City is Required",
              };
            } else if (temp?.city && temp?.city?.trim() === "") {
              errors[`${field?.form_id}-city`] = {
                message: "City can't be just empty space",
              };
            }
            if (field?.isRequired && !temp?.country) {
              errors[`${field?.form_id}-country`] = {
                message: "Country is Required",
              };
            } else if (temp?.country && temp?.country?.trim() === "") {
              errors[`${field?.form_id}-country`] = {
                message: "Country can't be just empty space",
              };
            }
          }
        }
      }
      if (
        field?.type?.type === "Checkbox" ||
        field?.type?.type === "Dropdown"
      ) {
        if (field?.isRequired && !field?.answer) {
          errors[field?.form_id] = { message: "Field is Required" };
        } else {
          if (field?.answer) {
            if (field?.type?.options?.responseValidation) {
              const selectedItems =
                field?.type?.type === "Dropdown"
                  ? field?.answer
                  : field?.answer?.split(",");
              switch (field?.type?.options?.responseValidation?.validation) {
                case "Select at least":
                  if (
                    selectedItems?.length <
                    parseInt(field?.type?.options?.responseValidation?.number)
                  ) {
                    errors[field?.form_id] = {
                      message:
                        field?.type?.options?.responseValidation?.customError ||
                        `Select at least ${field?.type?.options?.responseValidation?.number}`,
                    };
                  }

                  break;
                case "Select at most":
                  if (
                    selectedItems?.length >
                    parseInt(field?.type?.options?.responseValidation?.number)
                  ) {
                    errors[field?.form_id] = {
                      message:
                        field?.type?.options?.responseValidation?.customError ||
                        `Select at most ${field?.type?.options?.responseValidation?.number}`,
                    };
                  }
                  break;
                case "Select exactly":
                  if (
                    selectedItems?.length !==
                    parseInt(field?.type?.options?.responseValidation?.number)
                  ) {
                    errors[field?.form_id] = {
                      message:
                        field?.type?.options?.responseValidation?.customError ||
                        `Select exactly ${field?.type?.options?.responseValidation?.number}`,
                    };
                  }
                  break;
              }
            }
          }
        }
      }
      if (
        field?.type?.type === "Short answer" ||
        field?.type?.type === "Text Field" ||
        field?.type?.type === "Long answer"
      ) {
        if (field?.isRequired && !field?.answer) {
          errors[field?.form_id] = { message: "Field is Required" };
        } else {
          if (field?.answer) {
            if (field?.answer && field?.answer?.trim() === "") {
              errors[field?.form_id] = {
                message: "Input can't be just empty space",
              };
            }

            const value = field?.answer;
            if (
              field?.type?.options?.responseValidation?.validation ===
                "Number" &&
              isNaN(value)
            ) {
              errors[field?.form_id] = {
                message: `Must be a number`,
              };
            }
            switch (field?.type?.options?.responseValidation?.option) {
              case "Greater than":
                if (
                  value <=
                  parseInt(field?.type?.options?.responseValidation?.number)
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Value must be greater than ${field?.type?.options?.responseValidation?.number}`,
                  };
                }
                break;
              case "Greater than or equal to":
                if (
                  value <
                  parseInt(field?.type?.options?.responseValidation?.number)
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Value must be greater than or equal to ${field?.type?.options?.responseValidation?.number}`,
                  };
                }

                break;
              case "Less than":
                if (
                  value >=
                  parseInt(field?.type?.options?.responseValidation?.number)
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Value must be less than ${field?.type?.options?.responseValidation?.number}`,
                  };
                }
                break;
              case "Less than or equal to":
                if (
                  value >
                  parseInt(field?.type?.options?.responseValidation?.number)
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Value must be less than or equal to ${field?.type?.options?.responseValidation?.number}`,
                  };
                }

                break;
              case "Equal to":
                if (
                  value !=
                  parseInt(field?.type?.options?.responseValidation?.number)
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Value must equal to ${field?.type?.options?.responseValidation?.number}`,
                  };
                }

                break;
              case "Not equal to":
                if (
                  value ==
                  parseInt(field?.type?.options?.responseValidation?.number)
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Value must not equal to ${field?.type?.options?.responseValidation?.number}`,
                  };
                }

                break;

              case "Is number":
                if (isNaN(parseInt(value))) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Value must be a number`,
                  };
                }

                break;
              case "Whole number":
                if (!Number.isInteger(parseInt(value))) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Value must be a whole number`,
                  };
                }
                break;
              case "Maximum character count":
                if (
                  value?.length >
                  parseInt(field?.type?.options?.responseValidation?.number)
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      "Too Long!",
                  };
                }
                break;
              case "Minimum character count":
                if (
                  value?.length <
                  parseInt(field?.type?.options?.responseValidation?.number)
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      "Too Short!",
                  };
                }
                break;
              case "Contains":
                if (
                  !value?.includes(
                    field?.type?.options?.responseValidation?.number
                  )
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Must contain the word '${field?.type?.options?.responseValidation?.number}'.`,
                  };
                }
                break;

              case "Doesn’t contains":
                if (
                  value?.includes(
                    field?.type?.options?.responseValidation?.number
                  )
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Doesn’t contain the word '${field?.type?.options?.responseValidation?.number}'.`,
                  };
                }
                break;
              case "Matches":
                if (
                  value !== field?.type?.options?.responseValidation?.number
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Must contain the word '${field?.type?.options?.responseValidation?.number}'.`,
                  };
                }
                break;
              case "Doesn’t matches":
                if (
                  value === field?.type?.options?.responseValidation?.number
                ) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Doesn’t contain the word '${field?.type?.options?.responseValidation?.number}'.`,
                  };
                }
                break;
              case "URL":
                const urlRegex = new RegExp(
                  `^(https?://)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*/?$`
                );
                if (!urlRegex.test(value)) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Enter correct URL!`,
                  };
                }
                break;
              case "Email":
                const emailRegex =
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!emailRegex.test(value)) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Enter correct Email!`,
                  };
                }
                break;
              case "Mobile":
                const mobileRegex = new RegExp(
                  "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
                );
                if (!mobileRegex.test(value)) {
                  errors[field?.form_id] = {
                    message:
                      field?.type?.options?.responseValidation?.customError ||
                      `Enter correct number!`,
                  };
                }
                break;
            }
          }
        }
      }
      if (field?.type?.type === "Radio") {
        if (field?.isRequired && !field?.answer) {
          errors[field?.form_id] = { message: "Field is Required" };
        }
      }
    });
    setCustomErrors(errors);
    if (!isEmptyObject(errors)) {
      return false;
    } else {
      return true;
    }
  };
  const onSubmit = async () => {
    setLoading(true);
    const data = questions?.map((item) => ({
      ...item,
      answer: item?.answer ? item.answer : "",
    }));
    if (validateQuestions()) {
      const submit = await axiosInstance.post(
        `compliance.api.SubmitSmeApplication`,
        { questions: data }
      );
      console.log("submit?.data", submit?.data);
      if (submit?.data?.message?.success) {
        setIsSubmited(true);
      } else {
        toast.error(
          submit?.data?.message?.success_response || "Something went wrong"
        );
        setIsSubmited(false);
      }
    }
    setLoading(false);
  };
  const getQuestions = async () => {
    setLoading(true);
    const submit = await axiosInstance.get(
      `compliance.api.GetSmeFormComponents`
    );

    if (submit.status === 200) {
      setQuestions(submit.data.message);
    } else {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const handleOnChange = (event, index, type = "") => {
    const temp = [...questions];
    if (type === "checkbox") {
      if (event.target.checked) {
        const convertStringToArray = temp[index].answer
          ? temp[index].answer.split(",")
          : [];
        convertStringToArray.push(event.target.value);
        temp[index].answer = convertStringToArray.toString();
      } else {
        const convertStringToArray = temp[index].answer.split(",");
        const result = convertStringToArray.filter(
          (item) => item !== event.target.value
        );
        temp[index].answer = result.toString();
      }
    } else if (type === "address") {
      temp[index].answer = JSON.stringify(event);
    } else if (type === "firstLastName") {
      temp[index].answer = `${event.firstName} ${event.lastName}`;
    } else if (type === "dropdown") {
      temp[index].answer = event;
    } else if (type === "radio") {
      temp[index].answer = event.target.value;
    } else if (type === "Date") {
      if (event) {
        temp[index].answer = JSON.stringify(event);
        //  `${event.date}${event.time && "," + event?.time}`;
      } else {
        temp[index].answer = "";
      }
    } else if (type === "DateRange") {
      if (event) {
        const value = event?.toString();
        temp[index].answer = value === "," ? "" : value;
      } else {
        temp[index].answer = "";
      }
    } else {
      temp[index].answer = type !== "Date" ? event.target.value : event;
    }
    setQuestions(temp);
    validateQuestions();
  };
  const pinCodeCehck = async (val, form_id) => {
    try {
      setLoading(true);
      const data = await axiosInstance.post("audit.api.CheckPincode", {
        pincode: val,
      });
      if (data?.data?.message.status === true) {
        setLoading(false);
      } else {
        setCustomErrors({
          ...customErrors,
          [`${form_id}-postalCode`]: {
            message: "Invalid Postal / Zip Code",
          },
        });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const onError = (errors) => {
    const fieldError = Object.values(errors)[0];
    if (fieldError?.type === "required") {
      validateQuestions();
    }
  };

  const handleFileUpload = async (event, index) => {
    setLoading(true);
    const temp = [...questions];
    const formData = new FormData();
    event?.map((file) => {
      formData.append("file_details", file);
    });
    const submit = await axiosInstance.post(
      `compliance.api.UploadSmeApplicationFiles`,
      formData
    );

    if (submit.status === 200) {
      temp[index].answer = "";
      temp[index].file_details = submit?.data?.message?.success_response;
      setQuestions(temp);
      validateQuestions();
      setLoading(false);
    } else {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };
  const handleDeleteFile = async (file_id, index) => {
    setLoading(true);

    const temp = [...questions];
    const submit = await axiosInstance.post("compliance.api.DeleteFile", {
      file_id,
    });

    if (submit.status === 200) {
      setLoading(false);
      const tempArray = temp[index]?.file_details;
      const updatedArray = tempArray?.filter(
        (item) => item?.file_id !== file_id
      );
      temp[index].file_details = updatedArray;
      setQuestions(temp);
      validateQuestions();
    } else {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getQuestions();
    setIsSubmited(false);
  }, []);
  return isSubmited ? (
    <ApplicationSuccess />
  ) : (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => setLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className={styles.smeOnBoardingMain}>
          <h4 className="mt-3">onBoarding Process</h4>
          <div className={styles.smeFormGroup}>
            <div className="row">
              <div className="col-lg-8">
                {questions?.length > 0
                  ? questions?.map((item, index) => {
                      return (
                        <div key={index}>
                          {item.type.type === "Short answer" && (
                            <ShortAnswer
                              index={index}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              item={item}
                              form_id={item?.form_id}
                              customErrors={customErrors}
                              register={register}
                              handleOnChange={(event) =>
                                handleOnChange(event, index)
                              }
                            />
                          )}

                          {item.type.type === "Text Field" && (
                            <ShortAnswer
                              index={index}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              item={item}
                              form_id={item?.form_id}
                              customErrors={customErrors}
                              register={register}
                              handleOnChange={(event) =>
                                handleOnChange(event, index)
                              }
                            />
                          )}

                          {item.type.type === "Long answer" && (
                            <LongAnswer
                              index={index}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              item={item}
                              form_id={item?.form_id}
                              customErrors={customErrors}
                              error={errors}
                              register={register}
                              handleOnChange={(event) =>
                                handleOnChange(event, index)
                              }
                            />
                          )}

                          {item.type.type === "Checkbox" && (
                            <Checkbox
                              index={index}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              item={item}
                              form_id={item?.form_id}
                              error={customErrors}
                              register={register}
                              handleOnChange={(event) =>
                                handleOnChange(event, index, "checkbox")
                              }
                              options={item?.type?.value}
                            />
                          )}
                          {item.type.type === "Date Range" && (
                            <DateRange
                              index={1}
                              item={item}
                              form_id={item?.form_id}
                              error={customErrors}
                              register={register}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              handleOnChange={(event) =>
                                handleOnChange(event, index, "DateRange")
                              }
                            />
                          )}

                          {item.type.type === "Attachment" && (
                            <Attachment
                              index={index}
                              item={item}
                              form_id={item?.form_id}
                              error={customErrors}
                              register={register}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              handleDeleteFile={(id) =>
                                handleDeleteFile(id, index)
                              }
                              handleFileUpload={(event) =>
                                handleFileUpload(event, index)
                              }
                            />
                          )}

                          {item.type.type === "Dropdown" && (
                            <Dropdowns
                              index={1}
                              item={item}
                              form_id={item?.form_id}
                              error={customErrors}
                              register={register}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              handleOnChange={(event) =>
                                handleOnChange(event, index, "dropdown")
                              }
                              options={
                                item?.type?.value?.split(",")?.map((item) => ({
                                  value: item,
                                  label: item,
                                })) || []
                              }
                            />
                          )}
                          {item.type.type === "Radio" && (
                            <Radio
                              item={item}
                              form_id={item?.form_id}
                              error={customErrors}
                              register={register}
                              index={1}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item?.question}*`
                                  : item?.question
                              }
                              handleOnChange={(event) =>
                                handleOnChange(event, index, "radio")
                              }
                              options={item?.type?.value}
                            />
                          )}
                          {item.type.type === "Date" && (
                            <Date
                              item={item}
                              form_id={item?.form_id}
                              error={customErrors}
                              register={register}
                              index={1}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              handleOnChange={(event) =>
                                handleOnChange(event, index, "Date")
                              }
                            />
                          )}
                          {item.type.type === "URL" && (
                            <URLInput
                              item={item}
                              form_id={item?.form_id}
                              error={errors}
                              register={register}
                              index={1}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              handleOnChange={(event) =>
                                handleOnChange(event, index)
                              }
                            />
                          )}
                          {item.type.type === "Price" && (
                            <PriceInput
                              index={1}
                              item={item}
                              form_id={item?.form_id}
                              error={errors}
                              register={register}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              handleOnChange={(event) =>
                                handleOnChange(event, index)
                              }
                            />
                          )}
                          {item.type.type === "Phone Number" && (
                            <PhoneNumber
                              index={1}
                              item={item}
                              form_id={item?.form_id}
                              error={errors}
                              register={register}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              handleOnChange={(event) =>
                                handleOnChange(event, index)
                              }
                            />
                          )}
                          {item.type.type === "First / Last Name" && (
                            <FirstLastNameInput
                              index={index}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              item={item}
                              form_id={item?.form_id}
                              error={errors}
                              register={register}
                              handleOnChange={(event) =>
                                handleOnChange(event, index, "firstLastName")
                              }
                            />
                          )}
                          {item.type.type === "PAN" && (
                            <PANInput
                              index={1}
                              item={item}
                              form_id={item?.form_id}
                              error={errors}
                              register={register}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              handleOnChange={(event) =>
                                handleOnChange(event, index)
                              }
                            />
                          )}
                          {item.type.type === "Address" && (
                            <AddressInput
                              pinCodeCheck={(val) =>
                                pinCodeCehck(val, item?.form_id)
                              }
                              index={1}
                              item={item}
                              form_id={item?.form_id}
                              error={customErrors}
                              register={register}
                              styleType={
                                item?.type?.options?.style || "Style 01"
                              }
                              label={
                                item?.isRequired
                                  ? `${item.question}*`
                                  : item?.question
                              }
                              handleOnChange={(event) =>
                                handleOnChange(event, index, "address")
                              }
                            />
                          )}
                        </div>
                      );
                    })
                  : !loading && (
                      <h6 className="mt-3">
                        No questions found. Please contact admin.
                      </h6>
                    )}
              </div>
            </div>
            {questions?.length > 0 && (
              <button
                type="submit"
                className={
                  isEmptyObject(customErrors) && isEmptyObject(errors)
                    ? styles.submitBtn
                    : styles.submitBtnDisable
                }
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

export default OnBoardingForm;
