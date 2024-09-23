import React, { useEffect, useState } from "react";
import "./style.css";
import ProjectManagementModal from "../../ProjectManagementModal";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { addUpdateTaskListRequest } from "../../../redux/actions";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
// Initial State
const initialState = {
  milestone_id: null,
  project_id: null,
  title: "",
  task_list_id: null,
};
const initialErr = {
  isValidate: true,
  titleErr: "",
};
function AddEditTaskList({ visible, onClose, isEdit, editData }) {
  const [fieldValues, setFieldValues] = useState(editData || initialState);
  const [validateField, setvalidateField] = useState(initialErr);
  const dispatch = useDispatch();
  const milestone_list = useSelector(
    (state) =>
      state?.ProjectManagementReducer?.modalsStatus?.taskListModal
        ?.milestonesList
  );

  const onChangeOfFields = (e) => {
    // if (/^[a-zA-Z0-9 ]{0,180}$/.test(e.target.value)) {
    setFieldValues({
      ...fieldValues,
      title: removeWhiteSpaces(e.target.value),
    });
    setvalidateField({
      ...validateField,
      isValidate: false,
      titleErr: "",
    });
    // }
  };

  const onDataSubmit = () => {
    if (fieldValues.title === "" || fieldValues.title === " ") {
      setvalidateField({
        ...validateField,
        isValidate: true,
        titleErr: "please enter task",
      });
    } else {
      setvalidateField({
        ...validateField,
        isValidate: false,
        titleErr: "",
      });
      dispatch(addUpdateTaskListRequest(fieldValues));
      onClose();
    }
  };
  useEffect(() => {
    setFieldValues({ ...editData });
  }, [editData]);
  return (
    <ProjectManagementModal
      visible={visible}
      onClose={() => {
        setFieldValues(initialState);
        onClose();
      }}
    >
      <div className="milestone-modal__container d-flex align-items-center flex-column justify-content-center">
        <p className="modal__heading">Task List</p>
        <div className="form-group">
          <label className="modal__label required">Task List</label>
          <input
            type="text"
            maxLength={100}
            className="modal-input"
            value={fieldValues.title}
            onChange={onChangeOfFields}
          />
          {validateField.titleErr !== "" && (
            <p className="task-err-msg mt-2 mb-3">{validateField.titleErr}</p>
          )}
        </div>
        <div className="form-group w-100">
          <label className="modal__label">Milestone</label>
          <Select
            options={milestone_list || []}
            defaultValue={
              [...milestone_list].filter(
                (item) => item?.value?.milestone_id === editData?.milestone_id
              )[0]
            }
            onChange={(option) => {
              const value = option?.value;
              setFieldValues({
                ...fieldValues,
                milestone_id: value?.milestone_id,
                ...(!value?.project_id && { project_id: value?.project_id }),
              });
            }}
            isDisabled={
              !isEdit &&
              fieldValues?.milestone_id &&
              [...milestone_list].filter(
                (item) => item?.value?.milestone_id === editData?.milestone_id
              )[0]?.value?.milestone_id
            }
          />
        </div>
        <div className="mt-4 w-100 d-flex align-items-center justify-content-center">
          <button
            onClick={onDataSubmit}
            className="mx-2 px-4 py-2 project-management__button project-management__button--primary modal-button"
          >
            Submit
          </button>
          <button
            onClick={() => {
              setFieldValues(initialState);
              setvalidateField(initialErr);
              onClose();
            }}
            className="mx-2 px-4 py-2 project-management__button project-management__button--outlined modal-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </ProjectManagementModal>
  );
}

export default AddEditTaskList;
