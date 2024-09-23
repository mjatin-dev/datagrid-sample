import {
  ADD_NEW_SECTION,
  GET_QUESTION_LIST,
  SET_QUESTION_LIST,
  SET_SECTION_NAME,
  SET_TEMPLATE_ID,
  SET_AUDIT_ASSIGNMENT_BASIC_DETAILS,
  SET_ASSIGNMENT_ID,
  SET_AUDIT_ADDRESS_DETAILS,
  GET_AUDIT_ADDRESS_DETAILS,
  SET_AUDIT_QUASTIONARIE_DETAILS,
  SET_COMPANY_DATA,
  SET_BRANCH_DATA,
  SET_DELETE_COMPANY,
  SET_DELETE_BRANCH,
  SET_EDIT_STATE,
  SET_ASSIGNMENT_DETAIL,
  ASSIGNMENT_GET_ASSIGNMENT_CHECKPOINTS,
  ASSIGNMENT_GET_ASSIGNMENT_LIST,
  ASSIGNMENT_GET_ASSIGNMENT_QUESTIONNARIE,
  ASSIGNMENT_SET_ASSIGNMENT_CHECKPOINTS,
  ASSIGNMENT_SET_ASSIGNMENT_LIST,
  ASSIGNMENT_SET_ASSIGNMENT_QUESTIONNARIE,
  MARK_AS_COMPLETE_MODAL_ISCLOSE,
  MARK_AS_COMPLETE_MODAL_ISOPEN,
  MARK_AS_COMPLETE_SET_DATA,
  CURRENT_OPENED_ASSIGNMENT_NAME,
  CLEAR_ASSIGNMNET_DETAIL,
  CLEAR_ASSIGNMENT_ID,
  SET_LONG_TEXT_POPUP,
} from "./types";

export const setSectionName = (payload) => {
  return {
    type: SET_SECTION_NAME,
    payload,
  };
};

export const getQuestionList = (payload) => {
  return {
    type: GET_QUESTION_LIST,
    payload,
  };
};

export const setQuestionList = (payload) => {
  return {
    type: SET_QUESTION_LIST,
    payload,
  };
};

export const addSectionName = (payload) => {
  return {
    type: ADD_NEW_SECTION,
    payload,
  };
};

export const setTemplateId = (payload) => {
  return {
    type: SET_TEMPLATE_ID,
    payload,
  };
};

export const setAuditAssignmentDetails = (payload) => {
  return {
    type: SET_AUDIT_ASSIGNMENT_BASIC_DETAILS,
    payload,
  };
};

export const setAssignmentId = (payload) => {
  return {
    type: SET_ASSIGNMENT_ID,
    payload,
  };
};

export const clearAssignmentId = (payload) =>{
  return {
    type: CLEAR_ASSIGNMENT_ID,
    payload,
  };
}

export const setAuditAddressDetails = (payload) => {
  return {
    type: SET_AUDIT_ADDRESS_DETAILS,
    payload,
  };
};

export const setAuditQuastionarieDetails = (payload) => {
  return {
    type: SET_AUDIT_QUASTIONARIE_DETAILS,
    payload,
  };
};

export const setCompanyDetails = (payload) => {
  return {
    type: SET_COMPANY_DATA,
    payload,
  };
};

export const setBranchDetails = (payload) => {
  return {
    type: SET_BRANCH_DATA,
    payload,
  };
};

export const setDeleteCompany = (payload) => {
  return {
    type: SET_DELETE_COMPANY,
    payload,
  };
};

export const setDeleteBranch = (payload) => {
  return {
    type: SET_DELETE_BRANCH,
    payload,
  };
};

export const setEditState = (payload) => {
  return {
    type: SET_EDIT_STATE,
    payload,
  };
};

export const setAssignmentDetail = (payload) => {
  return {
    type: SET_ASSIGNMENT_DETAIL,
    payload: payload,
  };
};

export const clearAssignmentDetails = (payload={})=>{
  return {
    type : CLEAR_ASSIGNMNET_DETAIL,
    payload: payload
  }
}

export const getAssignmentList = (payload) => ({
  type: ASSIGNMENT_GET_ASSIGNMENT_LIST,
  payload,
});
export const getAssignmentQuestionnarie = (payload) => ({
  type: ASSIGNMENT_GET_ASSIGNMENT_QUESTIONNARIE,
  payload,
});
export const getAssignmentCheckpoints = (payload) => ({
  type: ASSIGNMENT_GET_ASSIGNMENT_CHECKPOINTS,
  payload,
});

export const setAssignmentList = (payload) => ({
  type: ASSIGNMENT_SET_ASSIGNMENT_LIST,
  payload,
});
export const setAssignmentQuestionnarie = (payload) => ({
  type: ASSIGNMENT_SET_ASSIGNMENT_QUESTIONNARIE,
  payload,
});
export const setAssignmentCheckpoints = (payload) => ({
  type: ASSIGNMENT_SET_ASSIGNMENT_CHECKPOINTS,
  payload,
});

export const setMarkAsCompleteModalOpen = (payload) => ({
  type: MARK_AS_COMPLETE_MODAL_ISOPEN,
  payload,
});

export const setMarkAsCompleteModalClose = (payload) => ({
  type: MARK_AS_COMPLETE_MODAL_ISCLOSE,
  payload,
});

export const setMarkAsCompleteData = (payload) => ({
  type: MARK_AS_COMPLETE_SET_DATA,
  payload,
});


export const setCurrentAssignmentName = (payload) => ({
  type: CURRENT_OPENED_ASSIGNMENT_NAME,
  payload,
})


export const setLongTextPoup = (payload)=>({
  type : SET_LONG_TEXT_POPUP,
  payload
})