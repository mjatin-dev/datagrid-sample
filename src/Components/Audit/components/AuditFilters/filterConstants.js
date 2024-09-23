export const auditDashBoardObjKey = {
  company_name: "company_name",
  audit_category: "audit_category",
  assignment_name: "assignment_name",
  audit_template_name: "audit_template_name",
  start_date: "start_date",
  assigned_by: "assigned_by",
  question_count:"question_count",
  checklist_count:"checklist_count",
};

export let dashboard_assignment_search_filter_list = {
  company_name: "",
  audit_category: "",
  assignment_name: "",
  audit_template_name: "",
  start_date: "",
  assigned_by: "",
  question_count:"",
  checklist_count:"",
};

export let dashboard_assignment_indivisual_filter_list = {
  company_name: [],
  audit_category: [],
  assignment_name: [],
  audit_template_name: [],
  start_date: [],
  assigned_by: [],
  question_count:[],
  checklist_count:[],
};

export const auditDashboardQuestionObjKey = {
  assignment_name: "assignment_name",
  questionnaire_section: "questionnaire_section",
  question: "question",
  assigned_to_email: "assigned_to_email",
  mark_as_complete: "mark_as_complete",
  start_date: "start_date",
  to_be_completed: "to_be_completed",
};

export let dashboard_assignment_question_search_filter_list = {
  assignment_name: "",
  questionnaire_section: "",
  question: "",
  assigned_to_email: "",
  mark_as_complete: "",
  start_date: "",
  to_be_completed: "",
};

export let dashboar_assignment_question_indivisual_filter_list = {
  assignment_name: [],
  questionnaire_section: [],
  question: [],
  assigned_to_email: [],
  mark_as_complete: [],
  start_date: [],
  to_be_completed: [],
};

export const auditDashboardChecklistObjKey = {
  assignment_name: "assignment_name",
  checklist_section: "checklist_section",
  check_point: "check_point",
  assigned_to: "assigned_to",
  submitted_doc_by_auditee: "submitted_doc_by_auditee",
  documents_relied_upon: "documents_relied_upon",
  status: "status",
  severity: "severity",
  start_date: "start_date",
  to_be_completed: "to_be_completed",
};

export let dashboard_assignment_checklist_search_filter_list = {
  assignment_name: "",
  checklist_section: "",
  check_point: "",
  assigned_to: "",
  submitted_doc_by_auditee: "",
  documents_relied_upon: "",
  status: "",
  severity: "",
  start_date: "",
  to_be_completed: "",
};

export let dashboar_assignment_checklist_indivisual_filter_list = {
  assignment_name: [],
  checklist_section: [],
  check_point: [],
  assigned_to: [],
  submitted_doc_by_auditee: [],
  documents_relied_upon: [],
  status: [],
  severity: [],
  start_date: [],
  to_be_completed: [],
};


//Template list filters
export const auditTemplatelistObjKey = {
  audit_template_name: "audit_template_name",
  audit_category: "audit_category",
  created_on: "created_on",
};

export let template_list_search_filter_list = {
  audit_template_name: "",
  audit_category: "",
  created_on: "",
};

export let template_list_indivisual_filter_list = {
  audit_template_name: [],
  audit_category: [],
  created_on: [],
};

// template questions filters
export const auditTemplateQuestionlistObjKey = {
  questionnaire_section: "questionnaire_section",
  question: "question",
  duration_of_completion: "duration_of_completion",
};

export let template_question_list_search_filter_list = {
  questionnaire_section: "",
  question: "",
  duration_of_completion: "",
};

export let template_question_list_indivisual_filter_list = {
  questionnaire_section: [],
  question: [],
  duration_of_completion: [],
};

//template checklist filters
export const auditTemplateChecklistlistObjKey = {
  checklist_section: "checklist_section",
  check_point: "check_point",
  duration_of_completion: "duration_of_completion",
  documents_relied_upon:"documents_relied_upon",
  severity: "severity",
};

export let template_checklist_list_search_filter_list = {
  checklist_section: "",
  check_point: "",
  duration_of_completion: "",
  documents_relied_upon:"",
  severity: "",
};

export let template_checklist_list_indivisual_filter_list = {
  checklist_section: [],
  check_point: [],
  duration_of_completion: [],
  documents_relied_upon:[],
  severity: [],
};

//audit assignemnt filters
export const auditAssignmentlistObjKey = {
  customer_name: "customer_name",
  audit_name: "audit_name",
  audit_template_name: "audit_template_name",
  start_date: "start_date",
  audit_category: "audit_category",
};

export let assignment_list_search_filter_list = {
  customer_name: "",
  audit_name: "",
  audit_template_name: "",
  start_date: "",
  audit_category: "",
};

export let assignment_list_indivisual_filter_list = {
  customer_name: [],
  audit_name: [],
  audit_template_name: [],
  start_date: [],
  audit_category: [],
};

//audit assignemnt Questions filters
export const auditAssignmenQuestiontlistObjKey = {
  questionnaire_section: "questionnaire_section",
  question: "question",
  start_date: "start_date",
  to_be_completed: "to_be_completed",
  assigned_to_email: "assigned_to_email",
};

export let assignment_question_list_search_filter_list = {
  questionnaire_section: "",
  question: "",
  start_date: "",
  to_be_completed: "",
  assigned_to_email: "",
};

export let assignment_question_list_indivisual_filter_list = {
  questionnaire_section: [],
  question: [],
  start_date: [],
  to_be_completed: [],
  assigned_to_email: [],
};

//audit assignemnt checklist filters
export const auditAssignmentchecklistlistObjKey = {
  checklist_section: "checklist_section",
  check_point: "check_point",
  start_date: "start_date",
  to_be_completed: "to_be_completed",
  documents_relied_upon:"documents_relied_upon",
  assigned_by: "assigned_by",
  severity: "severity",
  status: "status",
};

export let assignment_checklist_list_search_filter_list = {
  checklist_section: "",
  check_point: "",
  start_date: "",
  to_be_completed: "",
  documents_relied_upon:"",
  assigned_by: "",
  severity: "",
  status: "",
};

export let assignment_checklist_list_indivisual_filter_list = {
  checklist_section: [],
  check_point: [],
  start_date: [],
  to_be_completed: [],
  documents_relied_upon:[],
  assigned_by: [],
  severity: [],
  status: [],
};

//audit company filters
export const auditCompanylistObjKey = {
  company_name: "company_name",
  register_id: "register_id",
  company_type: "company_type",
  phone_no: "phone_no",
  email_id: "email_id",
};

export let company_list_search_filter_list = {
  company_name: "",
  register_id: "",
  company_type: "",
  phone_no: "",
  email_id: "",
};

export let company__list_indivisual_filter_list = {
  company_name: [],
  register_id: [],
  company_type: [],
  phone_no: [],
  email_id: [],
};

//audit branch filters
export const auditBranchlistObjKey = {
  branch_location: "branch_location",
  manager_name: "manager_name",
  manager_phone_no: "manager_phone_no",
  manager_emailid: "manager_emailid",
};

export let branch_list_search_filter_list = {
  branch_location: "",
  manager_name: "",
  manager_phone_no: "",
  manager_emailid: "",
};

export let branch_list_indivisual_filter_list = {
  branch_location: [],
  manager_name: [],
  manager_phone_no: [],
  manager_emailid: [],
};
