import { SET_QUESTIONS, SET_PREVIEW } from "./types";
const initailState = {
  questions: [],
  preview: false,
};

const smeReducer = (state = initailState, { type, payload }) => {
  switch (type) {
    case SET_QUESTIONS:
      return { ...state, questions: payload };
    case SET_PREVIEW:
      return { ...state, preview: payload };

    default:
      return state;
  }
};

export default smeReducer;
