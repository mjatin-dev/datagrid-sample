import { useSelector } from "react-redux";
const useAccount = () => {
  return useSelector((state) => state.auth.loginInfo);
};
export default useAccount;
