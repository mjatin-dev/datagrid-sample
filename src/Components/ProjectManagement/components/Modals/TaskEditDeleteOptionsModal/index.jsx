import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import ProjectManagementModal from "../../ProjectManagementModal";
import styles from "./styles.module.scss";
const TaskEditDeleteOptionsModal = ({
  isShowChooseEditOptions,
  isShowChooseDeleteOptions,
  handleClose,
  handleSave,
  handleDelete,
  setFieldInputs,
}) => {
  const [selectedOption, setSelectedOption] = useState("this_event");
  useEffect(() => {
    if (isShowChooseEditOptions && setFieldInputs) {
      setFieldInputs((prev) => ({ ...prev, recurring_task: selectedOption }));
    }
  }, [selectedOption, setFieldInputs, isShowChooseEditOptions]);
  return (
    <ProjectManagementModal
      visible={isShowChooseEditOptions || isShowChooseDeleteOptions}
      onClose={handleClose}
      containerClass={styles.container}
    >
      <h6>
        {isShowChooseEditOptions
          ? "Edit"
          : isShowChooseDeleteOptions && "Delete"}
        &nbsp;recurring tasks
      </h6>
      <FormControl size="small">
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="this_event"
          value={selectedOption}
          name="radio-buttons-group"
          onChange={(e, v) => setSelectedOption(v)}
        >
          <FormControlLabel
            control={<Radio size="small" />}
            sx={{ marginBottom: "0px" }}
            value="this_event"
            label="This event"
          />
          <FormControlLabel
            control={<Radio size="small" />}
            sx={{ marginBottom: "0px" }}
            value="this_and_following_events"
            label="This and following events"
          />
          {isShowChooseDeleteOptions &&
            selectedOption === "this_and_following_events" && (
              <FormHelperText sx={{ marginTop: 0, color: "red" }}>
                No tasks for this compliance event will be created in the future
              </FormHelperText>
            )}
          <FormControlLabel
            control={<Radio size="small" />}
            sx={{ marginBottom: "0px" }}
            value="all_events"
            label="All events"
          />
          {isShowChooseDeleteOptions && selectedOption === "all_events" && (
            <FormHelperText sx={{ color: "red" }}>
              No tasks for this compliance event will be created in the future
            </FormHelperText>
          )}
        </RadioGroup>
      </FormControl>
      <div className="d-flex justify-content-end mt-2 align-items-center">
        {isShowChooseDeleteOptions && handleDelete && (
          <button
            onClick={() => {
              handleDelete(selectedOption);
              handleClose();
            }}
            className="project-management__button project-management__button--primary mr-3"
          >
            Delete
          </button>
        )}
        {isShowChooseEditOptions && handleSave && (
          <button
            onClick={() => {
              handleSave();
              handleClose();
            }}
            className="project-management__button project-management__button--primary mr-3"
          >
            Save
          </button>
        )}
        <button
          className="project-management__button project-management__button--outlined"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </ProjectManagementModal>
  );
};

export default TaskEditDeleteOptionsModal;
