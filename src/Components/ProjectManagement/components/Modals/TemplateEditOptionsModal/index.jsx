import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import ProjectManagementModal from "../../ProjectManagementModal";
import styles from "./styles.module.scss";
const TemplateEditOptionsModal = ({
  isShowChooseEditOptions,
  handleClose,
  handleSave,
  setFieldInputs,
  fieldBackup
}) => {
  const [selectedOption, setSelectedOption] = useState("this_template");
  useEffect(() => {
    if (isShowChooseEditOptions && setFieldInputs) {
      setFieldInputs((prev) => ({ ...prev, name: selectedOption === "this_template" ? fieldBackup.name : "" }));
    }
  }, [selectedOption, setFieldInputs, isShowChooseEditOptions]);
  return (
    <ProjectManagementModal
      visible={isShowChooseEditOptions}
      onClose={handleClose}
      containerClass={styles.container}
    >
      <h6>
        Edit template
      </h6>
      <FormControl size="small">
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="this_template"
          value={selectedOption}
          name="radio-buttons-group"
          onChange={(e, v) => setSelectedOption(v)}
        >
          <FormControlLabel
            control={<Radio size="small" />}
            sx={{ marginBottom: "0px" }}
            value="this_template"
            label="This template"
          />
          <FormControlLabel
            control={<Radio size="small" />}
            sx={{ marginBottom: "0px" }}
            value="new_template"
            label="Create new one"
          />
          {/* {isShowChooseDeleteOptions &&
            selectedOption === "this_and_following_events" && (
              <FormHelperText sx={{ marginTop: 0, color: "red" }}>
                No tasks for this compliance event will be created in the future
              </FormHelperText>
            )} */}
          {/* <FormControlLabel
            control={<Radio size="small" />}
            sx={{ marginBottom: "0px" }}
            value="all_events"
            label="All events"
          /> */}
          {/* {isShowChooseDeleteOptions && selectedOption === "all_events" && (
            <FormHelperText sx={{ color: "red" }}>
              No tasks for this compliance event will be created in the future
            </FormHelperText>
          )} */}
        </RadioGroup>
      </FormControl>
      <div className="d-flex justify-content-end mt-2 align-items-center project-management__button-container--bottom-fixed">
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

export default TemplateEditOptionsModal;
