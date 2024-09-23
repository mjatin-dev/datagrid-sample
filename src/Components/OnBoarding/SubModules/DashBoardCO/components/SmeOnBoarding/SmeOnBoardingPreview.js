import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import DateRange from "./InputFields/DateRangeInput";
import Checkbox from "./InputFields/CheckboxsInput";
import ShortAnswer from "./InputFields/ShortAnswersInput";
import Attachment from "./InputFields/AttachmentsInput";
import LongAnswer from "./InputFields/LongAnswersInput";
import Dropdowns from "./InputFields/DropdownsInput";
import Radio from "./InputFields/RadioInput";
import Date from "./InputFields/DateInput";
import URLInput from "./InputFields/URLInput";
import PriceInput from "./InputFields/PriceInput";
import PANInput from "./InputFields/PANInput";
import FirstLastNameInput from "./InputFields/FirstLastNameInput";
import PhoneNumber from "./InputFields/PhoneNumber";
import AddressInput from "./InputFields/AddressInput";
import { useForm } from "react-hook-form";

function SmeOnBoardingPreview({ data }) {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const temp = data.map((item, index) => {
      if (item?.form_id){
        return {...item}
      }else{
        return { ...item, order_seq: index + 1, form_id: `preview_ques_${index + 1}` };
      }
    });
    setQuestions(temp);
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});
  const handleOnChange = () => {};
  const onSubmit = (data) => {};
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.smeFormGroup}>
        <div className='row'>
          <div className='col-lg-8'>
            {questions?.map((item, index) => {
              return (
                <div key={index}>
                  {item.type.type === "Short answer" && (
                    <ShortAnswer
                      index={index}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      item={item}
                      form_id={item?.form_id}
                      error={errors}
                      register={register}
                      handleOnChange={(event) => handleOnChange(event, index)}
                    />
                  )}

                  {item.type.type === "Text Field" && (
                    <ShortAnswer
                      index={index}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      item={item}
                      form_id={item?.form_id}
                      error={errors}
                      register={register}
                      handleOnChange={(event) => handleOnChange(event, index)}
                    />
                  )}

                  {item.type.type === "Long answer" && (
                    <LongAnswer
                      index={index}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      item={item}
                      form_id={item?.form_id}
                      error={errors}
                      register={register}
                      handleOnChange={(event) => handleOnChange(event, index)}
                    />
                  )}

                  {item.type.type === "Checkbox" && (
                    <Checkbox
                      index={index}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      item={item}
                      form_id={item?.form_id}
                      error={errors}
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
                      error={errors}
                      register={register}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      handleOnChange={(event) =>
                        handleOnChange(event, index, "Date")
                      }
                    />
                  )}

                  {item.type.type === "Attachment" && (
                    <Attachment
                      index={index}
                      item={item}
                      form_id={item?.form_id}
                      error={errors}
                      register={register}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      handleDeleteFile={(id) => {}}
                      handleFileUpload={(event) => {}}
                    />
                  )}

                  {item.type.type === "Dropdown" && (
                    <Dropdowns
                      index={1}
                      item={item}
                      form_id={item?.form_id}
                      error={errors}
                      register={register}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      handleOnChange={(event) =>
                        handleOnChange(event, index, "dropdown")
                      }
                      options={
                        item?.type?.value?.split(",").map((item) => ({
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
                      error={errors}
                      register={register}
                      index={1}
                      name={item?.form_id}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      handleOnChange={(event) => handleOnChange(event, index)}
                      options={item?.type?.value}
                    />
                  )}
                  {item.type.type === "Date" && (
                    <Date
                      item={item}
                      form_id={item?.form_id}
                      error={errors}
                      register={register}
                      index={1}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
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
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      handleOnChange={(event) => handleOnChange(event, index)}
                    />
                  )}
                  {item.type.type === "Price" && (
                    <PriceInput
                      index={1}
                      item={item}
                      form_id={item?.form_id}
                      error={errors}
                      register={register}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      handleOnChange={(event) => handleOnChange(event, index)}
                    />
                  )}
                  {item.type.type === "Phone Number" && (
                    <PhoneNumber
                      index={1}
                      item={item}
                      form_id={item?.form_id}
                      error={errors}
                      register={register}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      handleOnChange={(event) => handleOnChange(event, index)}
                    />
                  )}
                  {item.type.type === "First / Last Name" && (
                    <FirstLastNameInput
                      index={index}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
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
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      handleOnChange={(event) => handleOnChange(event, index)}
                    />
                  )}
                  {item.type.type === "Address" && (
                    <AddressInput
                      index={1}
                      item={item}
                      form_id={item?.form_id}
                      error={errors}
                      register={register}
                      styleType={item?.type?.options?.style || "Style 01"}
                      label={
                        item?.isRequired ? `${item.question}*` : item?.question
                      }
                      handleOnChange={(event) =>
                        handleOnChange(event, index, "address")
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
}

export default SmeOnBoardingPreview;
