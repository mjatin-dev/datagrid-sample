export const CreateMultipleAssignmentColumns = Array(1)
  .fill(0)
  .map((value, index) => {
    return {
      templateName: "",
      templateID: "",
      assignmentName: "",
      startDate: null,
      branchManagerName: "",
      manager_auditee_email: "",
      auditorName: "",
      auditor_email: "",
      auditeeInchargeName: "",
      sub_auditee_email: "",
      branchCode: "",
      location: "",
      isDisable: false,
      id: index,
      dateErr:""
    };
  });

export const excelSchema = {
  "TEMPLATE NAME": {
    prop: "template_name",
    type: String,
    required: false,
  },
  "START DATE": {
    prop: "start_date",
    type: Date,
    required: true,
  },
  "AUDIT NAME": {
    prop: "assignment_name",
    type: String,
    required: false,
  },
  "MANAGER AUDITEE EMAIL": {
    prop: "manager_auditee_email",
    type: String,
    required: true,
  },
  "MANAGER AUDITEE NAME": {
    prop: "manager_auditee_name",
    type: String,
    required: true,
  },
  "AUDITOR EMAIL": {
    prop: "auditor_email",
    type: String,
    required: true,
  },
  "AUDITOR NAME": {
    prop: "auditor_name",
    type: String,
    required: true,
  },
  "SUB AUDITEE EMAIL": {
    prop: "sub_auditee_email",
    type: String,
    required: true,
  },
  "SUB AUDITEE NAME": {
    prop: "sub_auditee_name",
    type: String,
    required: true,
  },
  "COMPANY": {
    prop: "company",
    type: String,
    required: true,
  },
  "BRANCH CODE": {
    prop: "branchCode",
    type: String,
    required: true,
  },
  "LOCATION": {
    prop: "branch_location",
    type: String,
    required: true,
  },
};
