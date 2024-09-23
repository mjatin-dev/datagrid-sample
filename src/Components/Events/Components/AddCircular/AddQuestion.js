import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import TextEditor from "Components/ProjectManagement/components/AddandEditProject/TextEditor";
import textEditorToolbarConfig from "CommonModules/Utils/text-editor-toolbar-config";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import FrappeStackInput from "CommonModules/sharedComponents/Inputs/FrappeInputs/FrappeStackInput";
import { toast } from "react-toastify";
import { setCircularQuestion } from "Components/Events/api";
import QuestionEditOptionsModal from "./QuestionEditOptionsModal";
import { isEqual } from "lodash";

const AddQuestion = ({ visible, onClose, editData, onQuestionCreated }) => {
  const [question, setQuestion] = useState({});
  const [questionBackup, setQuestionBackup] = useState({});
  const [isShowEditOptions, setIsShowEditOptions] = useState(false);
  const [optionEditIndex, setOptionEditIndex] = useState(null);
  const scrollableDiv = useRef();
  const scrollableHeight = useScrollableHeight(scrollableDiv, 140, []);
  const isQuestionUpdated = !isEqual(question, questionBackup);
  const handleSetOptions = (values) => {
    setQuestion({ ...question, options: values });
  };
  const handleClose = (createId = "") => {
    setQuestion({});
    setOptionEditIndex(null);
    setQuestionBackup({});
    setIsShowEditOptions(false);
    onClose(!questionBackup.question_id && createId);
  };

  const createQuestionPayload = () => {
    const _options = [...question.options]
      .filter((item) => item.value)
      .map((item) => ({ option: item.value, is_correct: item.selected }));
    return {
      // ...question,
      question: question.question,
      options: _options,
      ...(question.question_id && { question_id: question.question_id }),
    };
  };

  const handleSaveQuestion = async () => {
    const payload = createQuestionPayload();
    try {
      const { data, status } = await setCircularQuestion(payload);
      if (status === 200 && data?.message?.status) {
        toast.success(data?.message?.status_response);
        const question_id = data?.message?.question_id;
        if (question_id)
          onQuestionCreated({
            question: question.question,
            createId: question.createId,
            question_id,
          });
      } else {
        toast.error(data?.message?.status_response);
      }
    } catch (error) {
      toast.error("Something went wrong!!");
    }
  };

  useEffect(() => {
    if (visible && editData && Object?.keys(editData)?.length > 0) {
      setQuestion(editData);
      setQuestionBackup(JSON.parse(JSON.stringify(editData)));
    }
  }, [editData, visible]);
  return (
    <ProjectManagementModal
      containerClass={styles.addQuestionModalContainer}
      visible={visible}
      onClose={() => handleClose(question.createId)}
      closeByOuterClick={false}
    >
      <QuestionEditOptionsModal
        isShowChooseEditOptions={isShowEditOptions}
        setQuestion={setQuestion}
        questionBackup={questionBackup}
        handleClose={() => setIsShowEditOptions(false)}
        handleSave={() => handleSaveQuestion(question)}
      />
      <p className="project-management__header-title">Add Question</p>
      <div
        ref={scrollableDiv}
        style={{ height: scrollableHeight, overflow: "hidden auto" }}
        className="pr-2"
      >
        <div className="row">
          <div className="col-12">
            <label className="add-edit-project-labels">Question</label>
            <TextEditor
              values={question}
              setValues={setQuestion}
              readOnly={false}
              valueKey="question"
              editValue={editData?.question || ""}
              toolbar={textEditorToolbarConfig}
              editorClassName={styles.editorClassName}
            />
          </div>
          <div className="col-12 mt-3">
            <label className="add-edit-project-labels">Options</label>
            <FrappeStackInput
              name="options"
              title="Option"
              handleEdit={() => {}}
              setEditIndex={setOptionEditIndex}
              isSelectionEnabled
              editInside
              editIndex={optionEditIndex}
              selectionLabel="Select Right Answer"
              // selectionIndex={question?.rightAnswerId}
              values={question?.options}
              setValues={handleSetOptions}
              handleOptionSelection={(value, index) => {
                const _tempQuestionOptions = question.options;
                _tempQuestionOptions[index].selected = value;
                setQuestion({
                  ...question,
                  options: _tempQuestionOptions,
                });
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`${styles.modalActionsButtonContainer} justify-content-between d-flex align-items-center`}
      >
        <button
          onClick={() => {
            handleClose(question.createId);
          }}
          className="project-management__button project-management__button--outlined"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (question.question_id) {
              setIsShowEditOptions(true);
            } else {
              handleSaveQuestion(question);
            }
          }}
          disabled={
            !question.question ||
            !question?.options?.length ||
            !question?.options?.filter((item) => item.selected)?.length ||
            !isQuestionUpdated
          }
          className="project-management__button project-management__button--primary"
        >
          Save
        </button>
      </div>
    </ProjectManagementModal>
  );
};

export default AddQuestion;
