import { createAction } from "redux-actions";

const CREATE_UPDATE_AUDIT_TEMPLATE = "CREATE_UPDATE_AUDIT_TEMPLATE/";
export const createUpdateAuditTemplateTypes = {
  SET_STEPPER: `${CREATE_UPDATE_AUDIT_TEMPLATE}SET_STEPPER`,

  SET_LOADING: `${CREATE_UPDATE_AUDIT_TEMPLATE}SET_LOADING`,

  SET_AUDIT_CATEGORIES_LIST: `${CREATE_UPDATE_AUDIT_TEMPLATE}SET_AUDIT_CATEGORIES_LIST`,
  GET_AUDIT_CATEGORIES_LIST: `${CREATE_UPDATE_AUDIT_TEMPLATE}GET_AUDIT_CATEGORIES_LIST`,

  SET_AUDIT_SCOPE_BASIC_DETAILS: `${CREATE_UPDATE_AUDIT_TEMPLATE}SET_AUDIT_SCOPE_BASIC_DETAILS`,
  GET_AUDIT_SCOPE_BASIC_DETAILS: `${CREATE_UPDATE_AUDIT_TEMPLATE}GET_AUDIT_SCOPE_BASIC_DETAILS`,
  POST_AUDIT_SCOPE_BASIC_DETAILS: `${CREATE_UPDATE_AUDIT_TEMPLATE}POST_AUDIT_SCOPE_BASIC_DETAILS`,
  CLEAR_AUDIT_SCOPE_BASIC_DETAILS: `${CREATE_UPDATE_AUDIT_TEMPLATE}CLEAR_AUDIT_SCOPE_BASIC_DETAILS`,
  POST_AUDIT_SCOPE_BASIC_DETAILS_FILES: `${CREATE_UPDATE_AUDIT_TEMPLATE}POST_AUDIT_SCOPE_BASIC_DETAILS_FILES`,
  DELETE_AUDIT_SCOPE_BASIC_DETAILS_FILES: `${CREATE_UPDATE_AUDIT_TEMPLATE}DELETE_AUDIT_SCOPE_BASIC_DETAILS_FILES`,

  SET_QUESTIONNARIE_DETAILS: `${CREATE_UPDATE_AUDIT_TEMPLATE}SET_QUESTIONNARIE_DETAILS`,
  GET_QUESTIONNARIE_DETAILS: `${CREATE_UPDATE_AUDIT_TEMPLATE}GET_QUESTIONNARIE_DETAILS`,
  CLEAR_QUESTIONNARIE_DETAILS: `${CREATE_UPDATE_AUDIT_TEMPLATE}CLEAR_QUESTIONNARIE_DETAILS`,

  SET_CHECKLIST_DETAILS: `${CREATE_UPDATE_AUDIT_TEMPLATE}SET_CHECKLIST_DETAILS`,
  GET_CHECKLIST_DETAILS: `${CREATE_UPDATE_AUDIT_TEMPLATE}GET_CHECKLIST_DETAILS`,
  CLEAR_CHECKLIST_DETAILS: `${CREATE_UPDATE_AUDIT_TEMPLATE}CLEAR_CHECKLIST_DETAILS`,

  CLEAR_ALL_STATE: `${CREATE_UPDATE_AUDIT_TEMPLATE}CLEAR_ALL_STATE`,
};

// Actions
export const createUpdateAuditTemplateActions = {
  setStepper: createAction(createUpdateAuditTemplateTypes.SET_STEPPER),

  setLoading: createAction(createUpdateAuditTemplateTypes.SET_LOADING),

  //  Audit Categories List
  setAuditCategoriesList: createAction(
    createUpdateAuditTemplateTypes.SET_AUDIT_CATEGORIES_LIST
  ),
  getAuditCategoriesList: createAction(
    createUpdateAuditTemplateTypes.GET_AUDIT_CATEGORIES_LIST
  ),

  // Create Template - Basic Details
  setAuditScopeBasicDetails: createAction(
    createUpdateAuditTemplateTypes.SET_AUDIT_SCOPE_BASIC_DETAILS
  ),
  getAuditScopeBasicDetails: createAction(
    createUpdateAuditTemplateTypes.GET_AUDIT_SCOPE_BASIC_DETAILS
  ),
  clearAuditScopeBasicDetails: createAction(
    createUpdateAuditTemplateTypes.CLEAR_AUDIT_SCOPE_BASIC_DETAILS
  ),
  postAuditScopeBasicDetails: createAction(
    createUpdateAuditTemplateTypes.POST_AUDIT_SCOPE_BASIC_DETAILS
  ),
  postAuditScopeBasicDetailsFiles: createAction(
    createUpdateAuditTemplateTypes.POST_AUDIT_SCOPE_BASIC_DETAILS_FILES
  ),
  deleteAuditScopeBasicDetailsFiles: createAction(
    createUpdateAuditTemplateTypes.DELETE_AUDIT_SCOPE_BASIC_DETAILS_FILES
  ),

  // Create Template - Questionnarie Details
  setQuestionnarieDetails: createAction(
    createUpdateAuditTemplateTypes.SET_QUESTIONNARIE_DETAILS
  ),
  getQuestionnarieDetails: createAction(
    createUpdateAuditTemplateTypes.GET_QUESTIONNARIE_DETAILS
  ),
  clearQuestionnarieDetails: createAction(
    createUpdateAuditTemplateTypes.CLEAR_QUESTIONNARIE_DETAILS
  ),

  // Create Template - Checklist Details
  setChecklistDetails: createAction(
    createUpdateAuditTemplateTypes.SET_CHECKLIST_DETAILS
  ),
  getChecklistDetails: createAction(
    createUpdateAuditTemplateTypes.GET_CHECKLIST_DETAILS
  ),
  clearChecklistDetails: createAction(
    createUpdateAuditTemplateTypes.CLEAR_CHECKLIST_DETAILS
  ),

  // Create All Create Template Stepper State
  clearAllState: createAction(createUpdateAuditTemplateTypes.CLEAR_ALL_STATE),
};
