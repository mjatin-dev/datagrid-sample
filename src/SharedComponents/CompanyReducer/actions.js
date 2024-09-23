import { SET_COMPANY_EXISTS } from "./types";

export const setCompanyExists = (payload) => {
  return {
    type: SET_COMPANY_EXISTS,
    payload,
  };
};
