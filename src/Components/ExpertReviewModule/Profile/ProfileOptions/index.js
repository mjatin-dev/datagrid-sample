import React from "react";
import "./style.css";
import { FaPowerOff } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { actions as loginActions } from "../../../Authectication/redux/actions";
import { useHistory } from "react-router";
import { clearDashboardAnalytics } from "SharedComponents/Dashboard/redux/actions";

const ProfileOptions = ({ option, selectProfileOption }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onClickLogout = () => {
    dispatch(loginActions.createLogoutAction());
    dispatch(clearDashboardAnalytics());
    history.push("/login");
  };
  return (
    <div className="ER-profile-options">
      <div>
        <h3 style={{ margin: "0" }}>Hi Ramesh,</h3>
        <span>rameshkumar@sechmark.in</span>
      </div>
      <div className="options-container">
        <ul className="options-list">
          <li
            onClick={() => selectProfileOption("edit")}
            className={option === "edit" && "active"}
          >
            Edit Profile Details
          </li>
          <li
            onClick={() => selectProfileOption("notification")}
            className={option === "notification" && "active"}
          >
            Manage Notifications
          </li>
          <li
            onClick={() => selectProfileOption("task")}
            className={option === "task" && "active"}
          >
            Task management
          </li>
          <li
            onClick={() => selectProfileOption("security")}
            className={option === "security" && "active"}
          >
            Manage Security
          </li>
          <li
            onClick={() => selectProfileOption("migration")}
            className={option === "migration" && "active"}
          >
            Migration Requests
          </li>
        </ul>
      </div>
      <div className="LogoutButton">
        <button onClick={onClickLogout}>
          <FaPowerOff style={{ marginRight: "8px" }} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileOptions;
