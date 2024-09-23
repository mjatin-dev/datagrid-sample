import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
// import styles from "./styles.module.scss";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
const QuestionEditOptionsModal = ({
  isShowChooseEditOptions,
  handleClose,
  handleSave,
  setQuestion,
  questionBackup,
}) => {
  const [selectedOption, setSelectedOption] = useState("this_question");
  useEffect(() => {
    if (isShowChooseEditOptions && setQuestion) {
      setQuestion((prev) => ({
        ...prev,
        question_id:
          selectedOption === "this_question" ? questionBackup.question_id : "",
      }));
    }
  }, [selectedOption, setQuestion, isShowChooseEditOptions]);
  return (
    <ProjectManagementModal
      visible={isShowChooseEditOptions}
      onClose={handleClose}
      //   containerClass={styles.container}
    >
      <h6>Edit Question</h6>
      <FormControl size="small">
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="this_question"
          value={selectedOption}
          name="radio-buttons-group"
          onChange={(e, v) => setSelectedOption(v)}
        >
          <FormControlLabel
            control={<Radio size="small" />}
            sx={{ marginBottom: "0px" }}
            value="this_question"
            label="This question"
          />
          <FormControlLabel
            control={<Radio size="small" />}
            sx={{ marginBottom: "0px" }}
            value="new_question"
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

export default QuestionEditOptionsModal;
