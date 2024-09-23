import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { createCustomChecklistRequest } from "Components/OtherCompliance/redux/actions";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import { DatePicker } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const initialState = {
  subject: "",
  period: "",
};

const CreateChecklistModal = ({ visible, onClose, checklist_id }) => {
  const [fieldInputs, setFieldInputs] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState(initialState);
  const [isValidate, setIsValidate] = useState(true);
  const dispatch = useDispatch();
  const handleClose = () => {
    onClose();
    setFieldInputs(initialState);
  };
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setFieldInputs({
      ...fieldInputs,
      [name]: removeWhiteSpaces(value),
    });
  };

  const onDataSubmit = () => {
    dispatch(
      createCustomChecklistRequest({
        ...fieldInputs,
        checklist_id,
      })
    );
    handleClose();
  };

  useEffect(() => {
    const errors = {
      ...fieldErrors,
      subject: fieldInputs.subject
        ? !fieldInputs.subject?.match(/[a-zA-Z]/)
          ? "Please enter a valid subject"
          : ""
        : "",
      period: fieldInputs.period
        ? !fieldInputs.period?.match(/[a-zA-Z]/)
          ? "Please enter a valid period"
          : ""
        : "",
    };
    setIsValidate(
      !(fieldInputs.period && fieldInputs.subject) ||
        !fieldInputs.period?.trim() ||
        !fieldInputs.subject?.trim() ||
        errors.subject ||
        errors.period
    );
    setFieldErrors({
      ...errors,
    });
  }, [fieldInputs]);
  return (
    <ProjectManagementModal
      visible={visible}
      onClose={handleClose}
      closeByOuterClick={false}
    >
      <h6>Create Your Checklist</h6>
      <div className="my-4">
        <div className="form-group">
          <label
            htmlFor="your-compliance-checklist-subject"
            className="modal__label required"
          >
            Subject
          </label>
          <input
            name="subject"
            required
            id="your-compliance-checklist-subject"
            type="text"
            maxLength={100}
            value={fieldInputs.subject}
            className="modal-input"
            onChange={handleInputChange}
          />
          {fieldErrors.subject && (
            <p className="input-error-message">{fieldErrors.subject}</p>
          )}
        </div>
        <div className="form-group">
          <label
            htmlFor="your-compliance-checklist-subject"
            className="modal__label required"
          >
            Period
          </label>
          <DatePicker
            picker="month"
            placeholder="Select period"
            className="modal-input"
            format="MMMM YYYY"
            value={
              (fieldInputs.period && moment(fieldInputs.period, "MMMM YYYY")) ||
              null
            }
            onChange={(value, dateString) => {
              setFieldInputs({
                ...fieldInputs,
                period: dateString,
              });
            }}
          />
          {fieldErrors.period && (
            <p className="input-error-message">{fieldErrors.period}</p>
          )}
        </div>
      </div>

      <div className="w-100 d-flex align-items-center justify-content-center">
        <button
          onClick={onDataSubmit}
          disabled={isValidate}
          className={`mx-2 px-4 py-2 project-management__button project-management__button--primary modal-button ${
            isValidate && "project-management__button--disabled"
          }`}
        >
          Submit
        </button>
        <button
          onClick={handleClose}
          className="mx-2 px-4 py-2 project-management__button project-management__button--outlined modal-button"
        >
          Cancel
        </button>
      </div>
    </ProjectManagementModal>
  );
};

export default CreateChecklistModal;
