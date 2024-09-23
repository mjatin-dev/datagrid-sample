import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import SideBarInputControl from "../LeftSideBar";
import Cobg from "../../../../../../assets/Images/Onboarding/co-bg.png";
import RighSideGrid from "./SubModules/RightSideNotification";
import { withRouter } from "react-router-dom";
import { actions as adminMenuActions } from "../../MenuRedux/actions";
import Auth from "../../../../../Authectication/components/Auth";
function Notification({ history }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  useEffect(() => {
    if (
      window.location.href.includes("notifications") &&
      state.adminMenu.currentMenu !== "notifications"
    ) {
      dispatch(adminMenuActions.setCurrentMenu("notifications"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="row co-dashboard">
      <Auth />
      <div className=" left-fixed ">
        <div className="on-boarding">
          <SideBarInputControl />
        </div>
      </div>
      <div className="col-12 ">
        <img className="right-bg" src={Cobg} alt="" />
        <RighSideGrid />
      </div>
    </div>
  );
}

export default withRouter(Notification);
