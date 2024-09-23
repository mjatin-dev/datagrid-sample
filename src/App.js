import React from "react";
import { Route, Router } from "react-router-dom";
import AppRouter from "./router";
import "react-toastify/dist/ReactToastify.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import DisplayNotification from "./CommonModules/Notification/Display";
import Notifications from "./CommonModules/Notification";
import { useDispatch, useSelector } from "react-redux";
import "devextreme/dist/css/dx.light.css";
import { ErrorBoundary } from "react-error-boundary";
import Suggestions from "SharedComponents/Suggestions";
import { setSuggestionShow } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import LogoutModal from "SharedComponents/LogoutModal";
import { createBrowserHistory } from "history";
import NewTaskModel from "Components/ProjectManagement/components/AddNewTask/TaskModel";
import {
  clearProjectModalState,
  clearTaskModalState,
} from "Components/ProjectManagement/redux/actions";
import AddProject from "Components/ProjectManagement/components/AddandEditProject/AddProjectModal";
import currentEnvironment, {
  environments,
  isShowProjectModule,
} from "app.config";
export const history = createBrowserHistory();
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      {currentEnvironment !== environments.production && (
        <pre>{error.message}</pre>
      )}
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  const dispatch = useDispatch();
  const isShowSuggestion = useSelector(
    (state) => state.adminMenu.isShowSuggestion
  );
  const taskModal = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus?.taskModal
  );
  const projectModal = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus?.projectModal
  );
  library.add(faEye, faEyeSlash);

  return (
    <>
      <Suggestions
        open={isShowSuggestion}
        close={() => {
          dispatch(setSuggestionShow(false));
        }}
      />
      <NewTaskModel
        showTask={taskModal?.isVisible}
        onClose={() => dispatch(clearTaskModalState())}
        isEdit={taskModal?.isEdit}
        editData={taskModal?.editData}
      />
      {isShowProjectModule && (
        <AddProject
          show={projectModal?.isVisible}
          onClose={() => dispatch(clearProjectModalState())}
          isEdit={projectModal?.isEdit}
          editData={projectModal?.editData}
        />
      )}
      <Router history={history}>
        <LogoutModal />
        <Notifications />
        <DisplayNotification />
        <Route component={AppRouter} />
      </Router>
    </>
  );
}

export default App;
