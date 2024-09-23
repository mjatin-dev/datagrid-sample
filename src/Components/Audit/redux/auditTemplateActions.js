import { createAction } from "redux-actions";

const AUDIT_TEMPLATE = "AUDIT_TEMPLATE/";

export const auditTemplateTypes = {
  GET_AUDIT_TEMPLATES_LIST: `${AUDIT_TEMPLATE}GET_AUDIT_TEMPLATES_LIST`,
  SET_AUDIT_TEMPLATES_LIST: `${AUDIT_TEMPLATE}SET_AUDIT_TEMPLATES_LIST`,

  DELETE_AUDIT_TEMPLATE: `${AUDIT_TEMPLATE}DELETE_AUDIT_TEMPLATE`,

  GET_TEMPLATE_QUESTIONNARIE_LIST: `${AUDIT_TEMPLATE}GET_TEMPLATE_QUESTIONNARIE_LIST`,
  SET_TEMPLATE_QUESTIONNARIE_LIST: `${AUDIT_TEMPLATE}SET_TEMPLATE_QUESTIONNARIE_LIST`,
  CLEAR_TEMPLATE_QUESTIONNARIE_LIST: `${AUDIT_TEMPLATE}CLEAR_TEMPLATE_QUESTIONNARIE_LIST`,

  GET_TEMPLATE_CHECKPOINTS_LIST: `${AUDIT_TEMPLATE}GET_TEMPLATE_CHECKPOINTS_LIST`,
  SET_TEMPLATE_CHECKPOINTS_LIST: `${AUDIT_TEMPLATE}SET_TEMPLATE_CHECKPOINTS_LIST`,
  CLEAR_TEMPLATE_CHECKPOINTS_LIST: `${AUDIT_TEMPLATE}CELAR_TEMPLATE_CHECKPOINTS_LIST`,
};

export const auditTemplateActions = {
  getAuditTemplatesList: createAction(
    auditTemplateTypes.GET_AUDIT_TEMPLATES_LIST
  ),
  setAuditTemplatesList: createAction(
    auditTemplateTypes.SET_AUDIT_TEMPLATES_LIST
  ),
  deleteAuditTemplate: createAction(auditTemplateTypes.DELETE_AUDIT_TEMPLATE),

  getAuditTemplatesQuestionnarieList: createAction(
    auditTemplateTypes.GET_TEMPLATE_QUESTIONNARIE_LIST
  ),
  setAuditTemplatesQuestionnarieList: createAction(
    auditTemplateTypes.SET_TEMPLATE_QUESTIONNARIE_LIST
  ),
  clearAuditTemplatesQuestionnarieList: createAction(
    auditTemplateTypes.CLEAR_TEMPLATE_QUESTIONNARIE_LIST
  ),

  getAuditTemplatesCheckpointList: createAction(
    auditTemplateTypes.GET_TEMPLATE_CHECKPOINTS_LIST
  ),
  setAuditTemplatesCheckpointList: createAction(
    auditTemplateTypes.SET_TEMPLATE_CHECKPOINTS_LIST
  ),
  clearAuditTemplatesCheckpointList: createAction(
    auditTemplateTypes.CLEAR_TEMPLATE_CHECKPOINTS_LIST
  ),
};
