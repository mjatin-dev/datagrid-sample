import {
  CLEAR_LICENSE,
  EXPERT_SELECTED_LICENSE,
  GET_PAYMENT_DETAIL,
  IS_PAYMENT_DONE,
  MAIN_SELECTED_LICENSE,
  MAKE_PAYMENT,
  SET_PAYMENT_DETAIL,
  SET_PAYMENT_TYPE,
  SET_PLAN,
  SET_PLAN_MAIN,
  SET_SELECTED_LICENSE,
  SET_SUCCESS,
  SET_USER_COUNT,
} from "./types";

export const getPayment = (payload) => {
  return {
    type: GET_PAYMENT_DETAIL,
    payload,
  };
};

export const setPayment = (payload) => {
  return {
    type: SET_PAYMENT_DETAIL,
    payload,
  };
};

export const setSuccess = (payload) => {
  return {
    type: SET_SUCCESS,
    payload,
  };
};

export const paymentDone = (payload) => {
  return {
    type: IS_PAYMENT_DONE,
    payload,
  };
};

export const makePayment = (payload) => {
  return {
    type: MAKE_PAYMENT,
    payload,
  };
};

export const expertReviewSelectedLicense = (payload) => {
  return {
    type: EXPERT_SELECTED_LICENSE,
    payload,
  };
};

export const setPlan = (payload) => {
  return {
    type: SET_PLAN,
    payload,
  };
};

export const mainSelectedLicense = (payload) => {
  return {
    type: MAIN_SELECTED_LICENSE,
    payload,
  };
};

export const setPlanMain = (payload) => {
  return {
    type: SET_PLAN_MAIN,
    payload,
  };
};

export const clearLicense = () => {
  return {
    type: CLEAR_LICENSE,
  };
};

export const setSelectedLicense = (payload) => {
  return {
    type: SET_SELECTED_LICENSE,
    payload,
  };
};

export const setPaymentType = (payload) => {
  return {
    type: SET_PAYMENT_TYPE,
    payload,
  };
};

export const setUserCount = (payload) => {
  return {
    type: SET_USER_COUNT,
    payload,
  };
};
