import React, { useState } from "react";
import RadioGroup from "@mui/material/RadioGroup";
import calanderIcon from "assets/Icons/calanderIcon.svg";
import "./FrequencyModal.css";
import { FormControlLabel, Radio } from "@mui/material";
import Select from "react-select";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import moment from "moment";
import { DatePicker } from "antd";
const calanderimg = <img src={calanderIcon} alt="calander" />;
const selectInputStyles = {
  menu: (provided, styles) => ({
    ...provided,
    height: "140px",
    overflow: "auto",
    zIndex: 2,
  }),
  menuList: (provided, styles) => ({
    ...provided,
    height: "140px",
    overflow: "auto",
  }),
};
const monthDays = [
  {
    label: 1,
    value: 1,
  },
  {
    label: 2,
    value: 2,
  },
  {
    label: 3,
    value: 3,
  },
  {
    label: 4,
    value: 4,
  },
  {
    label: 5,
    value: 5,
  },
  {
    label: 6,
    value: 6,
  },
  {
    label: 7,
    value: 7,
  },
  {
    label: 8,
    value: 8,
  },
  {
    label: 9,
    value: 9,
  },
  {
    label: 10,
    value: 10,
  },
  {
    label: 11,
    value: 11,
  },
  {
    label: 12,
    value: 12,
  },
  {
    label: 13,
    value: 13,
  },
  {
    label: 14,
    value: 14,
  },
  {
    label: 15,
    value: 15,
  },
  {
    label: 16,
    value: 16,
  },
  {
    label: 17,
    value: 17,
  },
  {
    label: 18,
    value: 18,
  },
  {
    label: 19,
    value: 19,
  },
  {
    label: 20,
    value: 20,
  },
  {
    label: 21,
    value: 21,
  },
  {
    label: 22,
    value: 22,
  },
  {
    label: 23,
    value: 23,
  },
  {
    label: 24,
    value: 24,
  },
  {
    label: 25,
    value: 25,
  },
  {
    label: 26,
    value: 26,
  },
  {
    label: 27,
    value: 27,
  },
  {
    label: 28,
    value: 28,
  },
  {
    label: 29,
    value: 29,
  },
  {
    label: 30,
    value: 30,
  },
  {
    label: 31,
    value: 31,
  },
];
const DailyModal = ({
  open,
  setOpen,
  frequency,
  setFieldInputs,
  fieldInputs,
}) => {
  const [repeatOnEveryMaxDays, setRepeatOnEveryMaxDays] = useState(null);
  const weeks = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const handleClose = () => setOpen(false);
  return (
    <ProjectManagementModal
      visible={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="">
        <h4 className="mb-5">Set frequency</h4>

        {frequency?.value === "Daily" && (
          <>
            <div className="d-flex justify-space-between align-content-center">
              <div>
                <label className="p-0 frequency-fonts mt-2 required">
                  Repeat if due date is on holiday
                </label>
              </div>
              <div className="ml-4">
                <RadioGroup
                  row
                  aria-label="frequency"
                  name="day_type"
                  label="Repeat on"
                  value={
                    fieldInputs?.repeat_on_holiday
                      ? fieldInputs?.repeat_on_holiday
                      : ""
                  }
                  onChange={(event) => {
                    setFieldInputs({
                      ...fieldInputs,
                      repeat_on_holiday: event.target.value,
                    });
                  }}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="No"
                    value="After"
                  />
                </RadioGroup>
              </div>
            </div>
          </>
        )}
        {frequency?.value === "Weekly" && (
          <>
            {" "}
            <div>
              <label className="p-0 m-0 frequency-fonts required">
                Repeat on every
              </label>
              <div className="frequency-weeks">
                {weeks.map((item) => {
                  return (
                    <span
                      className={`${
                        fieldInputs.weekly_repeat_day === item
                          ? "frequecny-active"
                          : "frequecny-inactive"
                      }`}
                      onClick={() =>
                        setFieldInputs({
                          ...fieldInputs,
                          weekly_repeat_day: item,
                        })
                      }
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {frequency?.value !== "Weekly" && frequency?.value !== "Daily" && (
          <div className="d-flex justify-space-between align-content-center mb-2">
            <label className="p-0 m-0 frequency-fonts required">
              Repeat on every
            </label>
            <div style={{ marginLeft: 10 }}>
              <input
                style={{ width: "52px" }}
                type="text"
                className="modal-input__small"
                value={
                  fieldInputs?.repeat_on_day ? fieldInputs?.repeat_on_day : ""
                }
                pattern="[0-9]"
                onChange={(event) => {
                  const value = parseInt(event.target.value) || null;
                  setFieldInputs({
                    ...fieldInputs,
                    repeat_on_day:
                      (value >= 1 && value <= (repeatOnEveryMaxDays || 31)) ||
                      !value
                        ? value
                        : fieldInputs.repeat_on_day,
                  });
                }}
              />
            </div>
            <div style={{ marginLeft: 10 }}>
              <Select
                placeholder="Months"
                className="frequency-select"
                options={months}
                onChange={(event) => {
                  const month = event.value;
                  const year = new Date().getFullYear();
                  const maxNumberOfDaysInMonth = new Date(
                    year,
                    month,
                    0
                  ).getDate();
                  if (month) {
                    if (maxNumberOfDaysInMonth < 31) {
                      setRepeatOnEveryMaxDays(maxNumberOfDaysInMonth);
                    } else setRepeatOnEveryMaxDays(null);
                  }
                  setFieldInputs({
                    ...fieldInputs,
                    repeat_on_month: month,
                    ...(fieldInputs.repeat_on_day &&
                      fieldInputs.repeat_on_day > maxNumberOfDaysInMonth && {
                        repeat_on_day: maxNumberOfDaysInMonth,
                      }),
                  });
                }}
                styles={selectInputStyles}
                value={months.find(
                  (item) => item.value === fieldInputs?.repeat_on_month
                )}
              />
            </div>
          </div>
        )}

        {frequency?.value !== "Daily" && (
          <div className="d-flex justify-space-between align-content-center">
            <div>
              <label className="p-0 frequency-fonts mt-2">
                Due date on holiday
              </label>
            </div>
            <div className="ml-4">
              <RadioGroup
                row
                aria-label="frequency"
                name="day_type"
                label="Repeat on"
                value={
                  fieldInputs?.repeat_on_holiday
                    ? fieldInputs?.repeat_on_holiday
                    : ""
                }
                onChange={(event) => {
                  setFieldInputs({
                    ...fieldInputs,
                    repeat_on_holiday: event.target.value,
                  });
                }}
              >
                <FormControlLabel
                  value="After"
                  control={<Radio />}
                  label="After"
                />
                <FormControlLabel
                  value="Before"
                  control={<Radio />}
                  label="Before"
                />

                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              </RadioGroup>
            </div>
          </div>
        )}

        <div className="d-flex justify-space-between align-content-center">
          <p className="frequency-fonts">End frequency on</p>
          <div className="ml-4">
            {" "}
            <DatePicker
              format="DD MMMM Y"
              disabledDate={(current) => {
                let customDate = fieldInputs.start_date
                  ? fieldInputs.start_date
                  : moment().format("YYYY-MM-DD");
                return current.isSameOrBefore(customDate);
              }}
              suffixIcon={calanderimg}
              value={
                (fieldInputs?.frequency_end_date &&
                  moment(fieldInputs?.frequency_end_date, "YYYY-MM-DD")) ||
                null
              }
              onChange={(value) =>
                setFieldInputs({
                  ...fieldInputs,
                  frequency_end_date: value?.format("YYYY-MM-DD") || "",
                })
              }
            />
          </div>
        </div>
        <div className="text-right mt-5">
          <button className="frequency-submit-btn" onClick={handleClose}>
            Save
          </button>
          <button className="frequency-cancel-btn ml-2" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </ProjectManagementModal>
  );
};
export const DailyModalForEvents = ({
  open,
  setOpen,
  frequency,
  setFieldInputs,
  fieldInputs,
}) => {
  const weeks = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const handleClose = () => setOpen(false);

  return (
    <ProjectManagementModal
      visible={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="">
        <h4 className="mb-5">Set frequency</h4>

        {frequency?.value === "Daily" && (
          <>
            <div className="d-flex justify-space-between align-content-center">
              <div>
                <label className="p-0 frequency-fonts mt-2 required">
                  Repeat if due date is on holiday
                </label>
              </div>
              <div className="ml-4">
                <RadioGroup
                  row
                  aria-label="frequency"
                  name="day_type"
                  label="Repeat on"
                  value={
                    fieldInputs?.repeat_on_holiday
                      ? fieldInputs?.repeat_on_holiday
                      : ""
                  }
                  onChange={(event) => {
                    setFieldInputs({
                      ...fieldInputs,
                      repeat_on_holiday: event.target.value,
                    });
                  }}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="No"
                    value="After"
                  />
                </RadioGroup>
              </div>
            </div>
          </>
        )}
        {frequency?.value === "Weekly" && (
          <>
            {" "}
            <div>
              <label className="p-0 frequency-fonts mt-2 required">
                Repeat on every
              </label>
              <div className="frequency-weeks">
                {weeks.map((item) => {
                  return (
                    <span
                      className={`${
                        fieldInputs.weekly_repeat_day === item
                          ? "frequecny-active"
                          : "frequecny-inactive"
                      }`}
                      onClick={() =>
                        setFieldInputs({
                          ...fieldInputs,
                          weekly_repeat_day: item,
                        })
                      }
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <p className="p-0 m-0 frequency-fonts">
                Deadline Days After The Start Date
              </p>
              <div style={{ marginLeft: 10 }}>
                <input
                  className="modal-input"
                  pattern="[0-7]"
                  type="text"
                  maxLength={1}
                  value={
                    fieldInputs?.deadline_days_after_the_start_date || null
                  }
                  onChange={(event) => {
                    const value = parseInt(event.target?.value) || null;
                    setFieldInputs({
                      ...fieldInputs,
                      deadline_days_after_the_start_date:
                        (value < 8 && value >= 1) || !value ? value : null,
                    });
                  }}
                />
              </div>
            </div>
          </>
        )}

        {frequency?.value !== "Weekly" && frequency?.value !== "Daily" && (
          <>
            {/* <div className="d-flex justify-space-between align-content-center mb-2">
              <p className="p-0 m-0 frequency-fonts">Repeat on every*</p>
              <div style={{ marginLeft: 10 }}>
                <input
                  className="frequecny-input"
                  value={
                    fieldInputs?.repeat_on_day ? fieldInputs?.repeat_on_day : ""
                  }
                  onChange={(event) => {
                    setFieldInputs({
                      ...fieldInputs,
                      repeat_on_day: event.target.value,
                    });
                  }}
                />
              </div>
              <div style={{ marginLeft: 10 }}>
                <Select
                  placeholder="Months"
                  className="frequency-select"
                  options={months}
                  onChange={(event) => {
                    setFieldInputs({
                      ...fieldInputs,
                      repeat_on_month: event.value,
                    });
                  }}
                  value={months.find(
                    (item) => item.value === fieldInputs?.repeat_on_month
                  )}
                />
              </div>
            </div> */}
            <div className="d-flex align-items-center justify-content-between mb-2">
              <p className="p-0 m-0 frequency-fonts">Due Date of the Month</p>
              <div style={{ marginLeft: 10 }}>
                {/* <input
                  className="modal-input"
                  type="text"
                  maxLength={2}
                  value={fieldInputs?.deadline_day_of_the_month || null}
                  onChange={(event) => {
                    const value = event.target.value
                      ? parseInt(event.target.value)
                      : null;
                    console.log({ value });
                    if (/\b([1-9]|[1-2][0-9]|3[0-1])\b/.test(value) || !value) {
                      // console.log({ value });
                      setFieldInputs({
                        ...fieldInputs,
                        deadline_day_of_the_month: value ? value : "",
                      });
                    }
                  }}
                /> */}
                <Select
                  placeholder="select"
                  className="frequency-select"
                  options={monthDays}
                  onChange={(event) => {
                    setFieldInputs({
                      ...fieldInputs,
                      deadline_day_of_the_month: event.value || null,
                      ...(fieldInputs?.due_date_before > event.value && {
                        due_date_before: null,
                      }),
                    });
                  }}
                  value={
                    fieldInputs.deadline_day_of_the_month
                      ? {
                          label: fieldInputs.deadline_day_of_the_month,
                          value: fieldInputs.deadline_day_of_the_month,
                        }
                      : null
                  }
                  styles={selectInputStyles}
                />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <p className="p-0 m-0 frequency-fonts">Deadline Date Before</p>
              <div style={{ marginLeft: 10 }}>
                <Select
                  placeholder="select"
                  className="frequency-select"
                  options={
                    fieldInputs?.deadline_day_of_the_month
                      ? monthDays.filter(
                          (item) =>
                            item.value <= fieldInputs.deadline_day_of_the_month
                        )
                      : monthDays
                  }
                  onChange={(event) => {
                    setFieldInputs({
                      ...fieldInputs,
                      due_date_before: event.value || null,
                    });
                  }}
                  value={
                    fieldInputs.due_date_before
                      ? {
                          label: fieldInputs.due_date_before,
                          value: fieldInputs.due_date_before,
                        }
                      : null
                  }
                  styles={selectInputStyles}
                />
                {/* <input
                  className="modal-input"
                  pattern="[0-9]"
                  type="number"
                  value={fieldInputs?.due_date_before || null}
                  onChange={(event) => {
                    const value = event.target.value
                      ? parseInt(event.target.value)
                      : null;
                    setFieldInputs({
                      ...fieldInputs,
                      due_date_before:
                        (value >= 0 && value <= 31) || !value
                          ? value
                          : fieldInputs.due_date_before,
                    });
                  }}
                /> */}
              </div>
            </div>
            {frequency?.value !== "Monthly" && (
              <>
                <div className="d-flex align-items-center justify-content-between">
                  <p className="p-0 m-0 frequency-fonts">
                    Extended Deadline Date (Number of months to extended)
                  </p>
                  <div style={{ marginLeft: 10 }}>
                    <Select
                      placeholder="select"
                      className="frequency-select"
                      options={monthDays.filter((item) => item.value <= 12)}
                      onChange={(event) => {
                        setFieldInputs({
                          ...fieldInputs,
                          extend_deadline_date: event.value || null,
                        });
                      }}
                      value={
                        fieldInputs.extend_deadline_date
                          ? {
                              label: fieldInputs.extend_deadline_date,
                              value: fieldInputs.extend_deadline_date,
                            }
                          : null
                      }
                      styles={selectInputStyles}
                    />
                    {/* <input
                      className="modal-input"
                      pattern="[0-9]"
                      type="number"
                      value={fieldInputs?.extend_deadline_date || null}
                      onChange={(event) => {
                        const value = event.target.value
                          ? parseInt(event.target.value)
                          : null;
                        setFieldInputs({
                          ...fieldInputs,
                          extend_deadline_date:
                            (value >= 0 && value <= 12) || !value
                              ? value
                              : fieldInputs.extend_deadline_date,
                        });
                      }}
                    /> */}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {frequency?.value !== "Daily" && (
          <div className="d-flex justify-space-between align-content-center">
            <div>
              <label className="p-0 frequency-fonts mt-2 required">
                Due date on holiday
              </label>
            </div>
            <div className="ml-4">
              <RadioGroup
                row
                aria-label="frequency"
                name="day_type"
                label="Repeat on"
                value={
                  fieldInputs?.repeat_on_holiday
                    ? fieldInputs?.repeat_on_holiday
                    : ""
                }
                onChange={(event) => {
                  setFieldInputs({
                    ...fieldInputs,
                    repeat_on_holiday: event.target.value,
                  });
                }}
              >
                <FormControlLabel
                  value="After"
                  control={<Radio />}
                  label="After"
                />
                <FormControlLabel
                  value="Before"
                  control={<Radio />}
                  label="Before"
                />

                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              </RadioGroup>
            </div>
          </div>
        )}

        {/* <div className="d-flex justify-space-between align-content-center">
          <p className="frequency-fonts">End frequency on*</p>
          <div className="ml-4">
            <DatePicker
              format="DD MMMM Y"
              disabledDate={(current) => {
                let customDate = moment().format("YYYY-MM-DD");
                return current && current < moment(customDate, "YYYY-MM-DD");
              }}
              suffixIcon={calanderimg}
              value={
                (fieldInputs?.frequency_end_date &&
                  moment(fieldInputs?.frequency_end_date, "YYYY-MM-DD")) ||
                null
              }
              onChange={(value) =>
                setFieldInputs({
                  ...fieldInputs,
                  frequency_end_date: value?.format("YYYY-MM-DD") || "",
                })
              }
            />
          </div>
        </div> */}
        <div className="text-right mt-5">
          <button className="frequency-submit-btn" onClick={handleClose}>
            Save
          </button>
          <button className="frequency-cancel-btn ml-2" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </ProjectManagementModal>
  );
};

export default DailyModal;
