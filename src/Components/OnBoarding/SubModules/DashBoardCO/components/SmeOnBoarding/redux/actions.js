import { SET_PREVIEW, SET_QUESTIONS } from "./types";

export const setPreviewQuestions = (payload) => {
  return {
    type: SET_QUESTIONS,
    payload,
  };
};
export const setPreview = (payload) => {
  return {
    type: SET_PREVIEW,
    payload,
  };
};
