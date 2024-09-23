const { default: api } = require("Components/Audit/api");

const fetchUsersDetailById = async (user) => {
  try {
    const res = await api.fetchUsersDetailByEmail(user);
    const status = res.status;
    const data = res.data;
    if (status === 200 && data?.message?.status) {
      return data.message?.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export { fetchUsersDetailById };
