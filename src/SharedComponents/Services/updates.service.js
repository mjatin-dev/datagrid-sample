import axiosInstance from "apiServices";

const path = "compliance.compliance.apis.regulation.regulations";
const detailsPath = "compliance.compliance.apis.regulation.regulationDetail";
const filterPath = "compliance.compliance.apis.regulation.regulationFilters";
const templatePath = "compliance.api.get_task_templates";
const complainceEvents = "compliance.api.getCircularLinkComplianceEvents";

const get = async (payload) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`${path}`, {
        params: payload,
      })
      .then((response) => {
        const { data } = response?.data;
        resolve(data);
      })
      .catch((error) => reject(error));
  });
};

const post = async (payload) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`${path}`, {
        ...payload,
      })
      .then((response) => {
        const { data } = response?.data;
        resolve(data);
      })
      .catch((error) => reject(error));
  });
};
const getDetails = async (name, limit = 20, offset = 0) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`${detailsPath}?name=${name}`)
      .then((response) => {
        const { data } = response?.data;
        resolve(data);
      })
      .catch((error) => reject(error));
  });
};
const getFilter = async (name, limit = 20, offset = 0) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`${filterPath}`)
      .then((response) => {
        const { data } = response?.data;
        resolve(data);
      })
      .catch((error) => reject(error));
  });
};

const getTemplateList = async (name) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`${templatePath}?name=${name}`)
      .then((response) => {
        const { message } = response?.data;
        resolve(message);
      })
      .catch((error) => reject(error));
  });
};

const getComplainceEvent = async (payload) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(`${complainceEvents}`, {
        payload,
      })
      .then((response) => {
        const { data } = response?.data;
        resolve(data);
      })
      .catch((error) => reject(error));
  });
};

export const updateservice = {
  get,
  post,
  getDetails,
  getFilter,
  getTemplateList,
  getComplainceEvent,
};
