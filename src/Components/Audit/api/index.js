/* eslint-disable import/no-anonymous-default-export */
import axiosInstance from "../../../apiServices/index";

const fetchChecklistFromTemplate = (audit_template_id) =>
  axiosInstance.get("audit.api.GetChecklistAndSectionFromAudit", {
    params: {
      audit_template_id,
    },
  });
const fetchAuditTempateDetails = (audit_template_id) =>
  axiosInstance.get("audit.api.getAuditTemplate", {
    params: {
      audit_template_id,
    },
  });
const fetchQuestionsFromTemplate = (audit_template_id) =>
  axiosInstance.get("audit.api.getQuestionFromAudit", {
    params: { audit_template_id },
  });
const fetchQuestionnarieSectionFromTemplate = (audit_template_id) =>
  axiosInstance.post("audit.api.GetQuestionnaireSection", {
    audit_template_id,
  });
const fetchChecklistSectionFromTemplate = (audit_template_id) =>
  axiosInstance.post("audit.api.GetCheckListSection", {
    audit_template_id,
  });
const fetchQuestionList = (payload) =>
  axiosInstance.get(
    `audit.api.getQuestionReference?audit_template_id=${payload}`
  );

const addMultipleQuestionInTemplate = (payload) =>
  axiosInstance.post("audit.api.AddMultipleQuestionQuestionnaire", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
const addMultipleChecklistInTemplate = (payload) =>
  axiosInstance.post("audit.api.AddMultiChecklist", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
const fetchAuditCategoriesList = () =>
  axiosInstance.get("audit.api.getAuditCatagory");

const updateAuditTemplate = (payload) =>
  axiosInstance.post("audit.api.UpdateAuditTemplate", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
const deleteAuditScopeBasicDetailsFile = (payload) =>
  axiosInstance.post("audit.api.DeleteFile", payload);

const fetchAuditTemplateDashboard = () =>
  axiosInstance.get("audit.api.AuditTemplateDeshBoard");

const deleteAuditTemplate = (audit_template_id) =>
  axiosInstance.post("audit.api.DeleteTemplate", { audit_template_id });

const fetchUsersList = () => axiosInstance.post("audit.api.getUserByRole");
const fetchUsersCurrentWork = (payload) =>
  axiosInstance.post("audit.api.getUserWiseCurrentWork", { user: payload });
const fetchUsersCompletedWork = (payload) =>
  axiosInstance.post("audit.api.getUserWiseCompletedWork", {
    user: payload,
  });
const updateSeverityInCheckList = (payload) =>
  axiosInstance.post("audit.api.UpdateChecklistSeverity", payload);

const addDocsInChecklist = (payload) =>
  axiosInstance.post("audit.api.AddChecklistDoc", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
const addDocsInQuestionnarie = (payload) =>
  axiosInstance.post("audit.api.AddQuestionnaireDoc", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const auditeeMywork = (payload) =>
  axiosInstance.post("audit.api.getTemplateWiseUserWork", payload);
const auditeeMyworkQuestionnarie = (payload) =>
  axiosInstance.post("audit.api.getTemplateWiseUserQuestionnaire", payload);
const auditeeMyworkChecklist = (payload) =>
  axiosInstance.post("audit.api.getTemplateWiseUserCheckList", payload);
const fetchAssignmentList = (status) =>
  axiosInstance.post("audit.api.getAssignmentList", { status });
const fetchAssignmentQuestionnarie = (payload) =>
  axiosInstance.post("audit.api.getAssignmentQuestionare", payload);
const fetchAssignmentChecklist = (payload) =>
  axiosInstance.post("audit.api.getAssignmentChecklist", payload);

const deleteFile = (file_id) =>
  axiosInstance.post("compliance.api.DeleteFile", { file_id });

const deleteChecklistSection = (checklist_section_id) =>
  axiosInstance.post("audit.api.DeleteCheckListSection", {
    checklist_section_id,
  });
const deleteCheckPoint = (check_point_id) =>
  axiosInstance.post("audit.api.DeleteChecklist", { check_point_id });
const deleteQuestionnarieSection = (question_section_id) =>
  axiosInstance.post("audit.api.DeleteQuestionnaireSection", {
    question_section_id,
  });
const deleteQuestionnarieQuestion = (question_id) =>
  axiosInstance.post("audit.api.DeleteQuestionQuestionnaire", { question_id });

const getChecklistFromAssignment = (assignment_id) =>
  axiosInstance.post("audit.api.getChecklistBasedonAssignment", {
    assignment_id,
  });
const getQuestionnarieFromAssignment = (assignment_id) =>
  axiosInstance.post("audit.api.getQuestionsBasedonAssignment", {
    assignment_id,
  });
const getAssignments = () => axiosInstance.get("audit.api.assignmentListView");
const getQuestionnarieAnswer = (questionare_answer_id) =>
  axiosInstance.post("audit.api.getAnswer", { questionare_answer_id });

const markAsComplete = (data) =>
  axiosInstance.post("audit.api.AnswerQuestionnaire", data);

const fetchUsersDetailByEmail = (user) =>
  axiosInstance.post("audit.api.GetUserDetails", { user });
const fetchAssignmentDetails = (assignment_id) =>
  axiosInstance.get("audit.api.AssignmentDetails", {
    params: {
      assignment_id,
    },
  });
export default {
  fetchChecklistFromTemplate,
  fetchAuditTempateDetails,
  fetchQuestionsFromTemplate,
  fetchQuestionnarieSectionFromTemplate,
  fetchChecklistSectionFromTemplate,
  fetchQuestionList,
  addMultipleQuestionInTemplate,
  fetchAuditCategoriesList,
  updateAuditTemplate,
  deleteAuditScopeBasicDetailsFile,
  fetchAuditTemplateDashboard,
  deleteAuditTemplate,
  addMultipleChecklistInTemplate,
  fetchUsersList,
  fetchUsersCurrentWork,
  fetchUsersCompletedWork,
  updateSeverityInCheckList,
  addDocsInChecklist,
  addDocsInQuestionnarie,
  auditeeMywork,
  auditeeMyworkQuestionnarie,
  auditeeMyworkChecklist,
  getQuestionnarieAnswer,

  // Sub-Auditor Assignment List
  fetchAssignmentList,
  fetchAssignmentQuestionnarie,
  fetchAssignmentChecklist,

  // File
  deleteFile,

  // Delete
  deleteChecklistSection,
  deleteCheckPoint,
  deleteQuestionnarieSection,
  deleteQuestionnarieQuestion,

  // Assignments
  getChecklistFromAssignment,
  getQuestionnarieFromAssignment,
  getAssignments,
  fetchAssignmentDetails,

  //markAsComplete
  markAsComplete,

  // User
  fetchUsersDetailByEmail,
};
