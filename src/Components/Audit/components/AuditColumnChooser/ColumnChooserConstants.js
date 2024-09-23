export const dashboardAuditcolumns = {
  company_name: "Company Name",
  audit_category: "Audit Scope",
  assignment_name: "Assignment Name",
  audit_template_name: "Template Name",
  start_date: "Start Date",
  assigned_by: "Assign By",
  question_count: "Questionnaire",
  checklist_count: "Checkpoint",
};

export const dashboardSubAuditorcolumns = {
  company_name: "Company Name",
  audit_category: "Audit Scope",
  assignment_name: "Assignment Name",
  audit_template_name: "Template Name",
  start_date: "Start Date",
  assigned_by: "Assign By",
  checklist_count: "Checkoint",
};

export const dashboardSubAuditeecolumns = {
  company_name: "Company Name",
  audit_category: "Audit Scope",
  assignment_name: "Assignment Name",
  audit_template_name: "Template Name",
  start_date: "Start date",
  assigned_by: "Assign By",
  question_count: "Questionnaire",
};

export const dashboardQuestionColumns = {
  assignment_name: "Assignment Name",
  questionnaire_section: "Section name",
  question: "Questions",
  reference_document:"Reference",
  assigned_to_email: "Assigned To",
  attachment_type: "Required Docs",
  submitted_doc: "Submitted Docs",
  Add_Docs: "Add docs",
  mark_as_complete: "Mark As Complete",
  Answers: "Answers",
  Comments: "Comments",
  start_date: "Strat Date",
  to_be_completed: "End Date",
};
export const dashboardChecklistColumns = {
  assignment_name: "Assignment Name",
  checklist_section: "Section Name",
  check_point: "CheckPoints",
  assigned_to: "Assign To",
  documents_relied_upon: "Docs Relied Upon",
  attachment_format: "Required Docs",
  submitted_doc: "Auditor Annexure",
  checkpoint_reference_list:"Reg Reference",
  submitted_doc_by_auditee: "Submitted By Auditee",
  status: "Status",
  severity: "Severity",
  Add_Docs: "Add Docs",
  Comments: "Comments",
  start_date: "Start Date",
  to_be_completed: "End Date",
  penalty: "Penalty",
};

export const templateListView = {
  audit_template_name: "Template Name",
  created_on: "Created On",
  audit_category: "Audit Type",
  total_question: "Questionnaire",
  total_checklist: "Checkpoints",
  edit: "Edit",
  create_assignment: "Create Assignment",
};

export const standardTemplateListView = {
  audit_template_name: "Template Name",
  created_on: "Created On",
  audit_category: "Audit Type",
  total_question: "Questionnaire",
  total_checklist: "Checkpoints",
  assign: "Assign",
  create: "Create",
};

export const templateListViewQuestions = {
  questionnaire_section: "Section Name",
  question: "Question",
  duration_of_completion: "Duration",
  attachment_type: "Required Doc",
};
export const templateListViewCheckList = {
  checklist_section: "Section Name",
  check_point: "Checkpoint",
  attachment_format: "Required Type",
  duration_of_completion: "Duration",
  documents_relied_upon: "Docs Relied Upon",
  severity: "Severity",
  how_to_verify: "How To Verify",
  penalty: "Penalty",
};

export const assignmentListView = {
  customer_name:"Company Name",
  audit_name:"Assignment Name",
  audit_template_name:"Template Name",
  start_date:"Start date",
  audit_category:"Audit Scope",
  questionnaire:"Questionnaire",
  checkpoints:"Checkpoints",
  edit:"Edit"
};

export const assignmentListViewQuestions = {
  questionnaire_section:"Section Name",
  question:"Questions",
  start_date:"Start Date",
  to_be_completed:"End Date",
  assigned_to_email:"Assign To",
  attachment_type:"Required Docs",
  submitted_doc:"Submitted Docs",
  reference_document:"Reference",
  answers:"Answers"
};

export const assignemnetListViewCheckList = {
  checklist_section:"Section Name",
  how_to_verify:"How to verify",
  check_point:"Checkpoints",
  start_date:"Start Date",
  to_be_completed:"End Date",
  assigned_by:"Assign By",
  attachment_format:"Required Doc",
  submitted_docs:"Submited Docs",
  checkpoint_reference_list:"Reg Reference",
  documents_relied_upon:"Docs relied upon",
  severity:"Severity",
  penalty:"Penalty",
  status:"Status"
};

export const companyListView = {
  company_name:"Company Name",
  register_id:"Registration No",
  company_type:"Company Category",
  phone_no:"Contact No",
  email_id:"Email Id",
  branch_count:"Branches",
  edit:"Edit",
  delete:"Delete",
}

export const branchListView = {
  branch_location:"Branch Name",
  manager_name:"Manager Name",
  manager_phone_no:"Manager No",
  manager_emailid:"Email Id",
  edit:"Edit",
  delete:"Delete"
}