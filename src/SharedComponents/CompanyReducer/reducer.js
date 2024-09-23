import { SET_COMPANY_EXISTS } from "./types";
const initialState = {
  isCompanyExists: false,
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_COMPANY_EXISTS:
      return { ...state, isCompanyExists: payload };

    default:
      return state;
  }
};

export default reducer;
