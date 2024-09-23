import React, { useEffect, useState } from "react";
const FirstLastNameInput = (props) => {
  const [state, setState] = useState({});

  const {
    item,
    label,
    error,
    styleType,
    register,
    form_id,
    handleOnChange,
    index,
  } = props;

  const [newValidation, setNewValidation] = useState({});

  const validation = () => {
    const required = {};
    if (item?.isRequired) {
      required.required = "Field is required";
    }
    if (item?.type?.options?.responseValidation) {
      switch (item?.type?.options?.responseValidation?.option) {
        case "Maximum character count":
          required.maxLength = {
            value: parseInt(item?.type?.options?.responseValidation?.number),
            message:
              item?.type?.options?.responseValidation?.customError ||
              "Too Long!",
          };
          break;

        case "Minimum character count":
          required.minLength = {
            value: parseInt(item?.type?.options?.number),
            message:
              item?.type?.options?.responseValidation?.customError ||
              "Too Short!",
          };
          break;
        case "Contains":
          required.pattern = {
            value: new RegExp(
              `\\b${item?.type?.options?.responseValidation?.number}\\b`,
              "i"
            ),
            message:
              item?.type?.options?.responseValidation?.customError ||
              `Must contain the word '${item?.type?.options?.responseValidation?.number}'.`,
          };
          break;
        case "Doesn’t contains":
          required.pattern = {
            value: new RegExp(
              `^(?!.*\\b${item?.type?.options?.responseValidation?.number}\\b).*$`
            ),
            message:
              item?.type?.options?.responseValidation?.customError ||
              `Doesn’t contain the word '${item?.type?.options?.responseValidation?.number}'.`,
          };
          break;
        case "Matches":
          required.pattern = {
            value: new RegExp(
              `^${item?.type?.options?.responseValidation?.number}$`
            ),
            message:
              item?.type?.options?.responseValidation?.customError ||
              `Must contain the word '${item?.type?.options?.responseValidation?.number}'.`,
          };
          break;
        case "Doesn’t matches":
          required.pattern = {
            value: new RegExp(
              `^(?!.*${item?.type?.options?.responseValidation?.number}).*$`
            ),
            message:
              item?.type?.options?.responseValidation?.customError ||
              `Doesn’t contain the word '${item?.type?.options?.responseValidation?.number}'.`,
          };
          break;
        default:
          break;
      }
    }

    setNewValidation(required);
  };

  useEffect(() => {
    validation();
  }, []);
  const validateInput = (value) => {
      if (value && value.trim() === "") {
        return "Input can't be just empty space";
      }    
    return true;
  };
  switch (styleType) {
    case "Style 01":
      return (
        <div style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2' style={{ margin: 0 }}>
            {label}
          </p>
          <div className='style1-input-div' style={{ width: "100%" }}>
            <input
              type='text'
              placeholder='First'
              className='short-answer-input'
              style={{ width: "100%", marginRight: "10px" }}
              {...register(form_id, {
                ...newValidation,
                validate: validateInput,

                onChange: (e) => {
                  let temp = { ...state };
                  temp = { ...temp, firstName: e.target.value };
                  setState({ ...state, firstName: e.target.value });
                  handleOnChange(temp, index);
                },
              })}
            />
            <input
              type='text'
              placeholder='Last'
              className='short-answer-input'
              style={{ width: "100%" }}
              {...register(`${form_id}-lastname`, {
                ...newValidation,
                validate: validateInput,
                onChange: (e) => {
                  let temp = { ...state };
                  temp = { ...temp, lastName: e.target.value };
                  setState({ ...state, lastName: e.target.value });
                  handleOnChange(temp, index);
                },
              })}
            />
          </div>
          {(error?.[form_id] || error?.[`${form_id}-lastname`]) && (
            <p className='sme-error'>
              {error?.[form_id]?.message ||
                error?.[`${form_id}-lastname`]?.message}
            </p>
          )}
        </div>
      );
    case "Style 02":
      return (
        <div className='sme-style2-div' style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2' style={{ margin: 0 }}>
            {label}
          </p>
          <div className='style2-input-div'>
            <div className='style1-input-div' style={{ width: "100%" }}>
              <input
                type='text'
                placeholder='First'
                className='short-answer-input'
                style={{ width: "100%", marginRight: "10px" }}
                {...register(form_id, {
                  ...newValidation,
                  validate: validateInput,
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, firstName: e.target.value };
                    setState({ ...state, firstName: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
              />
              <input
                type='text'
                placeholder='Last'
                className='short-answer-input'
                style={{ width: "100%" }}
                {...register(`${form_id}-lastname`, {
                  ...newValidation,
                  validate: validateInput,
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, lastName: e.target.value };
                    setState({ ...state, lastName: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
              />
            </div>
          </div>
          {(error?.[form_id] || error?.[`${form_id}-lastname`]) && (
            <p className='sme-error'>
              {error?.[form_id]?.message ||
                error?.[`${form_id}-lastname`]?.message}
            </p>
          )}
        </div>
      );
    case "Style 03":
      return (
        <div className='sme-style3-div' style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2'>{label}</p>
          <div className='style2-input-div'>
            <div className='style1-input-div' style={{ width: "100%" }}>
              <input
                type='text'
                placeholder='First'
                className='short-answer-input'
                style={{ width: "100%", marginRight: "10px" }}
                {...register(form_id, {
                  ...newValidation,
                  validate: validateInput,
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, firstName: e.target.value };
                    setState({ ...state, firstName: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
              />
              <input
                type='text'
                placeholder='Last'
                className='short-answer-input'
                style={{ width: "100%" }}
                {...register(`${form_id}-lastname`, {
                  ...newValidation,
                  validate: validateInput,
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, lastName: e.target.value };
                    setState({ ...state, lastName: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
              />
            </div>
          </div>
          {(error?.[form_id] || error?.[`${form_id}-lastname`]) && (
            <p className='sme-error'>
              {error?.[form_id]?.message ||
                error?.[`${form_id}-lastname`]?.message}
            </p>
          )}
        </div>
      );
    default:
      return (
        <div style={{ marginBottom: "20px" }}>
          <p className='short-answer-p-style2' style={{ margin: 0 }}>
            {label}
          </p>
          <div className='style1-input-div' style={{ width: "100%" }}>
            <input
              type='text'
              placeholder='First'
              className='short-answer-input'
              style={{ width: "100%", marginRight: "10px" }}
              {...register(form_id, {
                ...newValidation,
                validate: validateInput,
                onChange: (e) => {
                  let temp = { ...state };
                  temp = { ...temp, firstName: e.target.value };
                  setState({ ...state, firstName: e.target.value });
                  handleOnChange(temp, index);
                },
              })}
            />
            <input
              type='text'
              placeholder='Last'
              className='short-answer-input'
              style={{ width: "100%" }}
              {...register(`${form_id}-lastname`, {
                ...newValidation,
                validate: validateInput,
                onChange: (e) => {
                  let temp = { ...state };
                  temp = { ...temp, lastName: e.target.value };
                  setState({ ...state, lastName: e.target.value });
                  handleOnChange(temp, index);
                },
              })}
            />
          </div>
          {(error?.[form_id] || error?.[`${form_id}-lastname`]) && (
            <p className='sme-error'>
              {error?.[form_id]?.message ||
                error?.[`${form_id}-lastname`]?.message}
            </p>
          )}
        </div>
      );
  }
};

export default FirstLastNameInput;
