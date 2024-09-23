import { createAction } from "redux-actions";
const SUBMIT_ANSWER_MODAL = "SUBMIT_ANSWER_MODAL/";

export const submitAnswerModalTypes = {
  OPEN_MODAL: `${SUBMIT_ANSWER_MODAL}OPEN_MODAL`,
  CLOSE_MODAL: `${SUBMIT_ANSWER_MODAL}CLOSE_MODAL`,
  SUBMIT_DATA_REQUEST: `${SUBMIT_ANSWER_MODAL}SUBMIT_DATA_REQUEST`,
  SUBMIT_DATA_SUCCESS: `${SUBMIT_ANSWER_MODAL}SUBMIT_DATA_SUCCESS`,
  SUBMIT_DATA_FAILED: `${SUBMIT_ANSWER_MODAL}SUBMIT_DATA_FAILED`,
  GET_SUBMITED_ANSWER: `${SUBMIT_ANSWER_MODAL}GET_SUBMITED_ANSWER`,
  SET_SUBMITED_ANSWER: `${SUBMIT_ANSWER_MODAL}SET_SUBMITED_ANSWER`,
  SET_ANSWRS_INPUT: `${SUBMIT_ANSWER_MODAL}SET_ANSWRS_INPUT`,
};

export const submitAnswerModalActions = {
  openModal: createAction(submitAnswerModalTypes.OPEN_MODAL),
  closeModal: createAction(submitAnswerModalTypes.CLOSE_MODAL),
  submitDataRequest: createAction(submitAnswerModalTypes.SUBMIT_DATA_REQUEST),
  submitDataSuccess: createAction(submitAnswerModalTypes.SUBMIT_DATA_SUCCESS),
  submitDataFailed: createAction(submitAnswerModalTypes.SUBMIT_DATA_FAILED),
  getSubmitedAnwer: createAction(submitAnswerModalTypes.GET_SUBMITED_ANSWER),
  setSubmitedAnswer: createAction(submitAnswerModalTypes.SET_SUBMITED_ANSWER),
  setAnswersInput: createAction(submitAnswerModalTypes.SET_ANSWRS_INPUT),
};
