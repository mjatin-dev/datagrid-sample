/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Container from "SharedComponents/Containers";
import RegisteredSME from "./pages/AdminPages/RegisteredSME/";
import ApplicationFormSME from "./pages/AdminPages/ApplicationFormSME";
import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";
import { Switch, Route } from "react-router-dom";
import DataByRegisteredSME from "./pages/AdminPages/RegisteredSME/DataByRegisteredSME";
import EventPage from "./pages/EventPage";
import AddComment from "./Components/CommentModal";
import { useDispatch, useSelector } from "react-redux";
import { isShowSmeModule } from "app.config";
import HeaderTabsForEventPage from "./Components/HeaderTabs";
import { eventsModuleActions } from "./redux/actions";
const adminTabsForEvents = [
  "SME Application Form",
  "Registered SME",
  "Template",
];
const path = "/events";
const Events = () => {
  // const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const [activeBtn, setActiveBtn] = useState(adminTabsForEvents[1]);
  const { isCEApprover, isLicenseManager, userDetails } = useGetUserRoles();
  const commentsModal = useSelector(
    (state) => state?.eventsModuleReducer?.commentsModal
  );

  useEffect(() => {
    if (isLicenseManager && !isCEApprover)
      dispatch(eventsModuleActions.setSelectedUser(userDetails.email));
  }, []);
  return (
    <Container variant="main">
      <Container variant="container">
        <Container variant="content">
          {commentsModal?.visible && (
            <AddComment
              visible={commentsModal?.visible}
              commentDetails={commentsModal?.commentDetails}
            />
          )}

          <Switch>
            <Route exact path={path}>
              {isShowSmeModule && isCEApprover && (
                <>
                  {/* <div className="d-flex align-items-center justify-content-between event__header-container mt-2">
                    <div className="d-none d-md-block compliance__license__events_tabs px-0">
                      {adminTabsForEvents.map((tab) => {
                        return (
                          <button
                            className={`${
                              activeBtn === tab ? "active" : "inactive"
                            }`}
                            onClick={() => setActiveBtn(tab)}
                          >
                            {tab}
                          </button>
                        );
                      })}
                    </div>
                  </div> */}
                  <HeaderTabsForEventPage defaultTabIndex={1} />
                  {activeBtn === adminTabsForEvents[0] && (
                    <ApplicationFormSME />
                  )}
                  {activeBtn === adminTabsForEvents[1] && <RegisteredSME />}
                </>
              )}
              {isLicenseManager && !isCEApprover && <EventPage />}
            </Route>
            <Route exact path={`${path}/registered-sme`}>
              <DataByRegisteredSME />
            </Route>
          </Switch>
        </Container>
      </Container>
    </Container>
  );
};
export default Events;
