const { default: axiosInstance } = require("apiServices");

const getLicensesForOtherCompliance = () =>
  axiosInstance.post("compliance.api.getLicensesForOtherCompliance");
const getChecklistForOtherCompliance = (payload) =>
  axiosInstance.post("compliance.api.getChecklistForOtherCompliance", {
    license_list: payload,
  });
const getYourComplianceChecklistForOtherCompliance = () =>
  axiosInstance.post("compliance.api.getYourComplianceChecklist");
const getChecklistDetailsForOtherCompliance = (payload) =>
  axiosInstance.post("compliance.api.getChecklistForOtherCompliance", {
    checklist_id: payload,
  });
const createCustomChecklistForOtherCompliance = (payload) =>
  axiosInstance.post(
    "compliance.api.createCustomChecklistForOtherCompliance",
    payload
  );
const updateYourComplianceChecklistCheckpointForOtherCompliance = (payload) =>
  axiosInstance.post(
    "compliance.api.updateYourComplianceChecklistForOtherCompliance",
    payload
  );

export {
  getLicensesForOtherCompliance,
  getChecklistDetailsForOtherCompliance,
  getChecklistForOtherCompliance,
  createCustomChecklistForOtherCompliance,
  getYourComplianceChecklistForOtherCompliance,
  updateYourComplianceChecklistCheckpointForOtherCompliance,
};
