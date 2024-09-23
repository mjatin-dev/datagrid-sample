import api from "../../../apiServices";

const insertUpdateUserRequets = (payload) =>
  api.post("compliance.api.signUp", payload);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  insertUpdateUserRequets,
};
