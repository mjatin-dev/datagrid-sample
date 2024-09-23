const { createAction } = require("redux-actions");
const {
  FETCH_LICENSES_REQUEST,
  FETCH_LICENSES_FAILED,
  FETCH_LICENSES_SUCCESS,
  UPDATE_SELECTED_LICENSES,
  FETCH_CHECKLIST_REQUEST,
  FETCH_CHECKLIST_SUCCESS,
  FETCH_CHECKLIST_FAILED,
  CREATE_CUSTOM_CHECKLIST_REQUEST,
  CREATE_CUSTOM_CHECKLIST_FAILED,
  CREATE_CUSTOM_CHECKLIST_SUCCESS,
  FETCH_YOUR_COMPLIANCE_CHECKLIST_REQUEST,
  FETCH_YOUR_COMPLIANCE_CHECKLIST_SUCCESS,
  FETCH_YOUR_COMPLIANCE_CHECKLIST_FAILED,
  SET_CHECKLIST_DETAILS,
  SET_YOUR_COMPLIANCE_CHECKLIST_DETAILS,
} = require("./types");

const fetchLicensesRequest = createAction(FETCH_LICENSES_REQUEST);
const fetchLicensesSuccess = createAction(FETCH_LICENSES_SUCCESS);
const fetchLicensesFailed = createAction(FETCH_LICENSES_FAILED);

const fetchChecklistRequest = createAction(FETCH_CHECKLIST_REQUEST);
const fetchChecklistSuccess = createAction(FETCH_CHECKLIST_SUCCESS);
const fetchChecklistFailed = createAction(FETCH_CHECKLIST_FAILED);

const fetchYourComplianceChecklistRequest = createAction(
  FETCH_YOUR_COMPLIANCE_CHECKLIST_REQUEST
);
const fetchYourComplianceChecklistSuccess = createAction(
  FETCH_YOUR_COMPLIANCE_CHECKLIST_SUCCESS
);
const fetchYourComplianceChecklistFailed = createAction(
  FETCH_YOUR_COMPLIANCE_CHECKLIST_FAILED
);
const setChecklistDetailsById = createAction(SET_CHECKLIST_DETAILS);
const setYourComplianceChecklistDetailsById = createAction(
  SET_YOUR_COMPLIANCE_CHECKLIST_DETAILS
);

const updateSelectedLicenses = createAction(UPDATE_SELECTED_LICENSES);

const createCustomChecklistRequest = createAction(
  CREATE_CUSTOM_CHECKLIST_REQUEST
);
const createCustomChecklistSuccess = createAction(
  CREATE_CUSTOM_CHECKLIST_SUCCESS
);
const createCustomChecklistFailed = createAction(
  CREATE_CUSTOM_CHECKLIST_FAILED
);

export {
  fetchLicensesFailed,
  fetchLicensesRequest,
  fetchLicensesSuccess,
  updateSelectedLicenses,
  fetchChecklistFailed,
  fetchChecklistRequest,
  fetchChecklistSuccess,
  createCustomChecklistRequest,
  createCustomChecklistSuccess,
  createCustomChecklistFailed,
  fetchYourComplianceChecklistFailed,
  fetchYourComplianceChecklistSuccess,
  fetchYourComplianceChecklistRequest,
  setYourComplianceChecklistDetailsById,
  setChecklistDetailsById,
};
