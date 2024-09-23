import { createAction } from "redux-actions";
const SUB_AUDITOR = "AUDIT/SUB_AUDITOR/";

export const subAuditorModuleTypes = {
  FETCH_ASSIGNMENT_LIST: `${SUB_AUDITOR}FETCH_ASSIGNMENT_LIST`,
  SET_ASSIGNMENT_LIST: `${SUB_AUDITOR}SET_ASSIGNMENT_LIST`,

  FETCH_ASSIGNMENT_QUESTIONNARIE: `${SUB_AUDITOR}FETCH_ASSIGNMENT_QUESTIONNARIE`,
  SET_ASSIGNMENT_QUESTIONNARIE: `${SUB_AUDITOR}SET_ASSIGNMENT_QUESTIONNARIE`,

  FETCH_ASSIGNMENT_CHECKLIST: `${SUB_AUDITOR}FETCH_ASSIGNMENT_CHECKLIST`,
  SET_ASSIGNMENT_CHECKLIST: `${SUB_AUDITOR}SET_ASSIGNMENT_CHECKLIST`,

  SET_STATUS_TAB: `${SUB_AUDITOR}SET_STATUS_TAB`,
};

export const subAuditorModuleActions = {
  fetchAssignmentList: createAction(
    subAuditorModuleTypes.FETCH_ASSIGNMENT_LIST
  ),
  setAssignmentList: createAction(subAuditorModuleTypes.SET_ASSIGNMENT_LIST),
  fetchAssignmentQuestionnarie: createAction(
    subAuditorModuleTypes.FETCH_ASSIGNMENT_QUESTIONNARIE
  ),
  setAssignmentQuestionnarie: createAction(
    subAuditorModuleTypes.SET_ASSIGNMENT_QUESTIONNARIE
  ),
  fetchAssignmentChecklist: createAction(
    subAuditorModuleTypes.FETCH_ASSIGNMENT_CHECKLIST
  ),
  setAssignmentChecklist: createAction(
    subAuditorModuleTypes.SET_ASSIGNMENT_CHECKLIST
  ),

  setStatusTab: createAction(subAuditorModuleTypes.SET_STATUS_TAB),
};
