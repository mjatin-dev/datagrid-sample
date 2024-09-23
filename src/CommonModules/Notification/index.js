import { useEffect } from "react";
import { getToken } from "../../firebaseConfig/firebaseInit";

const Notifications = (props) => {
  localStorage.setItem("deviceToken", "");
  useEffect(() => {
    let data;
    async function tokenFunc() {
      data = await getToken();
      if (data) {
        localStorage.setItem("deviceToken", data);
      }
      return data;
    }
    tokenFunc();
  }, []);
  return <></>;
};
export default Notifications;
