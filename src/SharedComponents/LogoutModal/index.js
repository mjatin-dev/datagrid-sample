import { setIsShowLogoutModal } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import React from "react";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { actions as loginActions } from "Components/Authectication/redux/actions";
import { withRouter } from "react-router";
const LogoutModal = ({ history }) => {
  const isShowLogoutModal = useSelector(
    (state) => state.adminMenu.isShowLogoutModal || false
  );
  const dispatch = useDispatch();
  const onClose = () => dispatch(setIsShowLogoutModal(false));
  const onLogoutClick = () => {
    dispatch(loginActions.createLogoutAction(history));
    dispatch(setIsShowLogoutModal(false));
  };

  return (
    <ProjectManagementModal visible={isShowLogoutModal} onClose={onClose}>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="modal-image modal-image--red-background">
          <MdOutlinePowerSettingsNew
            style={{ fontSize: "1.5rem", color: "red" }}
          />
        </div>
        <p className="modal-message my-3">Are you sure you want to logout?</p>
        <div
          style={{
            width: "80%",
            margin: "auto",
          }}
          className="mt-4 d-flex align-items-center justify-content-between"
        >
          <button
            style={{
              width: "40%",
            }}
            className="project-management__button project-management__button--primary"
            onClick={onLogoutClick}
          >
            Yes
          </button>
          <button
            style={{
              width: "40%",
            }}
            onClick={onClose}
            className="project-management__button project-management__button--outlined"
          >
            Cancel
          </button>
        </div>
      </div>
    </ProjectManagementModal>
  );
};
export default withRouter(LogoutModal);
