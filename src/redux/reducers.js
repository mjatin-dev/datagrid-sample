import { combineReducers } from "redux";
import auth from "../Components/Authectication/redux/reducers";
import complianceOfficer from "../Components/OnBoarding/redux/reducers";
import teamMemberFlow from "../Components/TeamMemberFlow/redux/reducers";
import taskReport from "../Components/OnBoarding/SubModules/DashBoardCO/redux/reducers";
import global from "../CommonModules/GlobalData/redux/reducers";

import users from "../Components/UserVerification/redux/reducers";
import adminMenu from "../Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/reducers";
import NotificationRedu from "../Components/OnBoarding/SubModules/DashBoardCO/components/notification/Redux/Reducers/NotificationRedu";
import HistoryReducer from "../Components/HistoryModule/redux/reducers";
import UpdatesReducer from "../Components/Updates/redux/reducers";
import CalenderReducer from "../Components/CalenderView/redux/reducers";
import PaymentReducer from "../Components/ExpertReviewModule/Redux/reducers";
import { addAndEditProjectReducer } from "../Components/ProjectManagement/redux/reducers";
import ProjectManagementReducer from "../Components/ProjectManagement/redux/reducers";
import NewRegulationsQuizReducer from "../Components/NewRegulationsQuiz/redux/reducers";
import AuditReducer from "../Components/Audit/redux/reducers";
import DashboardState from "../SharedComponents/Dashboard/redux/reducers";
import CompanyExistsState from "../SharedComponents/CompanyReducer/reducer";
import otherCompliance from "../Components/OtherCompliance/redux/reducers";
import auditCommonUtilsReducer from './../Components/Audit/redux/commonUtilsReducer';
import smeReducer from "../Components/OnBoarding/SubModules/DashBoardCO/components/SmeOnBoarding/redux/reducers";
import eventsModuleReducer from "Components/Events/redux/reducer";

const createRootReducer = (history) =>
  combineReducers({
    auth,
    complianceOfficer,
    teamMemberFlow,
    taskReport,
    global,
    users,
    adminMenu,
    NotificationRedu,
    HistoryReducer,
    UpdatesReducer,
    CalenderReducer,
    PaymentReducer,
    addAndEditProjectReducer,
    ProjectManagementReducer,
    NewRegulationsQuizReducer,
    AuditReducer,
    DashboardState,
    CompanyExistsState,
    otherCompliance,
    auditCommonUtilsReducer,
    smeReducer,
    eventsModuleReducer,
  });

export default createRootReducer;
