import api from "../../../apiServices";

const insertUpdateAPIRequest = (payload) =>
  api.post("/api/ins_upd_del_User", payload);
const sendOTP = (payload) =>
  api.post("api/sendmsgwithverificationcode", payload);
const availabilityCheck = (payload) =>
  api.post("/api/availabilityCheck", payload);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  insertUpdateAPIRequest,
  sendOTP,
  availabilityCheck,
};
