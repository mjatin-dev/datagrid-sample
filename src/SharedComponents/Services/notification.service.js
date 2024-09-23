import axiosInstance from "apiServices";

const path = "compliance.compliance.apis.notification.notification";

const get = async (limit = 20, offset = 0, filter = "All", search) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(
        `${path}?limit=${limit}&offset=${offset}&filter=${filter}&search=${search}`
      )
      .then((response) => {
        const { data, status } = response?.data;
        resolve({ ...data, status });
      })
      .catch((error) => reject(error));
  });
};

export const notificationservice = { get };
