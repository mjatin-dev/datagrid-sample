import { IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory } from "react-router";
import dashboardStyles from "SharedComponents/Dashboard/styles.module.scss";
import EventPage from "../../EventPage";
import { useDispatch, useSelector } from "react-redux";
import { eventsModuleActions } from "Components/Events/redux/actions";
const DataByRegisteredSME = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector(
    (state) => state?.eventsModuleReducer?.selectedUser
  );
  const history = useHistory();
  const isShowCircularModal = useSelector(
    (state) => state?.eventsModuleReducer?.circular?.modalState?.isVisible
  );
  useEffect(() => {
    const state = history?.location?.state || null;
    if (state && Object.keys(state).length > 0) {
      dispatch(eventsModuleActions.setSelectedUser(state));
    } else {
      history.goBack();
    }
  }, [history]);

  return (
    <div>
      {!isShowCircularModal && (
        <div
          className={`${dashboardStyles.dashboardHeaderContainer} justify-content-start justify-content-md-between m-0 mb-2 px-0`}
        >
          <div className="d-flex align-items-center w-75">
            <IconButton
              color="inherit"
              onClick={() => {
                dispatch(eventsModuleActions.setSelectedUser(null));
                history.goBack();
              }}
              disableTouchRipple
              size="medium"
              className="mr-2"
            >
              <MdKeyboardArrowLeft />
            </IconButton>
            <p
              className={`${dashboardStyles.dashboardHeaderTitle} ${dashboardStyles.dashboardHeaderTitleActive} truncate `}
              title={selectedUser?.full_name}
            >
              Registered SME - {selectedUser?.full_name}
            </p>
          </div>
        </div>
      )}
      <EventPage />
    </div>
  );
};

export default DataByRegisteredSME;
