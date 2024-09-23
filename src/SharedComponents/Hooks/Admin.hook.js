import { useSelector } from "react-redux";

const useAdminMenu = () => {
	console.log(useSelector((state) => state.adminMenu));
	return useSelector((state) => state.adminMenu);
};

export default useAdminMenu;
