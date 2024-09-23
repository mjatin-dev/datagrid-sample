import { captionize } from "Components/OnBoarding/SubModules/DashBoardCO/components/DashBoardView/component/AnalyticsList/CustomColumnChooser";

/* eslint-disable import/no-anonymous-default-export */
export const MAX_FILE_UPLOAD_LIMIT = 10;
export default {
  companyEntityId: "C",
  licenseEntityId: "I",
  historyEntityId: "H",
  flag: "1",
  errorMessage: {
    maxFilesErrorMessage: `Maximum ${MAX_FILE_UPLOAD_LIMIT} files are allowed`,
    errorDueToGreaterDate:
      "Date cannot be later than current date. Please change the selected date.",
    errorDueToRange:
      "Range Cannot be more than 1 year. Please change the selected date.",
    errorDueToReverseDate: "Date should be after ",

    errorDueToMoreThanOneYearDateFromToday:
      "Date should be less than 1 year from today's date.",
    errorDueToBeforeDate: "Date should not be prior to today's date.",
    errorDueToPriorDate: "Date should not be prior to date of registration.",
    errorDueToPreviousDate: "Date should be after today's date.",
  },
  filterFlag: "A",
  status: "status",
  license: "license",
  company: "company",
  team: "team",
  ReAssignFilterTypes: {
    migrateAllTasksInDateRange: "MIGRATE_ALL_TASKS_IN_DATE_RANGE",
    migrateAllTasksOfParticularDate: "MIGRATE_ALL_TASKS_OF_PARTICULAR_DATE",
    migrateAllTasksForever: "MIGRATE_ALL_TASKS_FOREVER",
  },
  ReAssignFlags: ["0", "1", "2"],
  ReAssignMessages: {
    individualTaskSuccess: "Task successfully re-assigned to ",
    success: "Tasks successfully re-assigned to ",
    error: "An error occured! Please try again.",
  },
  maxFileSizeWarnning: "(Maximum file size allowed is 10mb)",
  NumberOfItemsHelp: 3,
  Weeks: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  weekDays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  ExpertUser: "8",
  ExpertReviewerBaseUrl: "/expert-review",
  MigrateTaskMessages: {
    success: "Migration Request has been submitted successfully!",
    MembershipDetails: {
      recommendedText: "RECOMMENDED",
      plans: [
        {
          id: 1,
          name: "Monthly",
          users: 5,
          isRecommended: false,
          isDefaultSelected: false,
        },
        {
          id: 2,
          name: "Annual",
          users: 10,
          isRecommended: true,
          isDefaultSelected: true,
        },
      ],
    },
  },

  expertReview: "exp",
  complianceOfficer: "compl",
  day: "day",
  month: "month",
  week: "week",
  increment: "increment",
  decrement: "decrement",
  list: "list",
  calender: "calender",
  board: "board",
  notification_types: [
    {
      value: "All Notifications",
      label: "All Notifications",
    },
    {
      value: "accepted",
      label: "Accepted",
    },
    {
      value: "Approved",
      label: "Approved",
    },
    {
      value: "Assigned",
      label: "Assigned",
    },
    {
      value: "close-by-owner",
      label: "Close By Owner",
    },
    {
      value: "Approval Pending",
      label: "Completed By User",
    },
    {
      value: "migrated",
      label: "Migrated",
    },
    {
      value: "Rejected",
      label: "Request Rejected",
    },

    {
      value: "sent-to-expert-approval",
      label: "Sent To SecMark For Approval",
    },
    {
      value: "Task",
      label: "Tasks",
    },
    {
      value: "Circular",
      label: "Updates",
    },
  ],
};
export const complianceStatusOptions = [
  {
    label: "Complied",
    value: "complied",
  },
  {
    label: "Not-Complied",
    value: "not-complied",
  },
  {
    label: "Not-Applicable",
    value: "not-applicable",
  },
];
export const dashboardColumns = {
  subject: "TaskName",
  customerName: "CompanyName",
  status: "Status",
  licenseDisplay: "license",
  assignedToName: "assignedTo",
  frequency: "frequency",
  due_date: "Internal Deadline",
  impactFlag: "impact",
  riskRating: "Risk Rating",
  deadline_date: "Due Date",
};

export const columnsListForExport = Object.keys(dashboardColumns).map(
  (key) => ({
    key,
    header: captionize(key),
    outlineLevel: 1,
    width: 20,
  })
);
export const filterObjkey = {
  subject: "subject",
  licenseDisplay: "license",
  assignedToName: "assign_to",
  customerName: "company",
  due_date: "due_date",
  status: "status",
  frequency: "frequency",
  riskRating: "riskRating",
  deadline_date: "deadline_date",
};

export const selectInputCustomStyles = {
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  control: (provided, state) => ({
    ...provided,
    boxShadow: "none",
    border: "2px solid #e2e2e2",
    borderRadius: "6px",
    "&:hover, &:focus": {
      border: "2px solid #7a73ff",
    },
    ...(state.isFocused && { border: "2px solid #7a73ff" }),
  }),
};
export const DASHBOARD_SEARCH_KEY = "dashboard-analytics-search-query";
