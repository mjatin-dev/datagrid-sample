import axiosInstance from "apiServices";

export const getLicenseAndSublicenseList = async () =>
  axiosInstance.get("compliance.api.getLicenseListForManager");
export const getSubLicenseListForManager = async () =>
  axiosInstance.get("compliance.api.getSubLicenseListForManager");
export const getCircularList = async (payload) =>
  axiosInstance.post("compliance.api.getCircularList", payload);
export const getSignleCircularDetails = async (payload) =>
  axiosInstance.post("compliance.api.getSingleCircularDetails", payload);
export const setCircularDetails = (payload) =>
  axiosInstance.post("compliance.api.setCircular", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const setCircularStatus = (payload) =>
  axiosInstance.post("compliance.api.setCircularStatus", payload);
export const getApprovedLicenses = async (payload) =>
  axiosInstance.post("compliance.api.GetApprovedLicenseList", payload);
export const getApprovedComplianceEvents = async (payload) =>
  axiosInstance.post("compliance.api.GetApprovedCEList", payload);
export const getIssuerList = async () =>
  axiosInstance.get("compliance.api.GetIssuerList");
export const getTopicList = async () =>
  axiosInstance.get("compliance.api.GetTopicList");
export const getTemplateList = async (payload) =>
  axiosInstance.post("compliance.api.GetTaskTemplateList", payload);
export const getQuestionList = async (payload) =>
  axiosInstance.post("compliance.api.GetQuestionlist", payload);
export const setCircularQuestion = async (payload) =>
  axiosInstance.post("compliance.api.CreateQuestion", payload);
export const getTaskTemplateDetails = async (templateId) =>
  await axiosInstance.get("compliance.api.GetTaskTemplateDetails", {
    params: {
      template_name: templateId,
    },
  });
export const getSingleQuestion = async (question_id) =>
  await axiosInstance.get("compliance.api.GetSingleQuestion", {
    params: {
      question_id,
    },
  });
export const getRegisteredSMEUsers = async () =>
  axiosInstance.get("compliance.api.GetSMEList");
