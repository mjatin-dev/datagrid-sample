import { takeEvery, all, fork } from "redux-saga/effects";
import authSagas from "../Components/Authectication/redux/sagas";
import emailVerificationSagas from "../Components/OnBoarding/redux/sagas";
import teamMemberSaga from "../Components/TeamMemberFlow/redux/sagas";
import globalSagas from "../CommonModules/GlobalData/redux/sagas";
import taskReportSaga from "../Components/OnBoarding/SubModules/DashBoardCO/redux/sagas";

import userTypeSagas from "../Components/UserVerification/redux/sagas";
import historySaga from "../Components/HistoryModule/redux/saga";
import updatesSaga from "../Components/Updates/redux/saga";
import calenderViewSaga from "../Components/CalenderView/redux/saga";
import paymentSaga from "../Components/ExpertReviewModule/Redux/saga";
import projectSaga from "../Components/ProjectManagement/redux/sagas";
import newRegulaitonsQuizSaga from "../Components/NewRegulationsQuiz/redux/saga";
import auditSaga from "../Components/Audit/redux/saga";
import dashboardSagas from "../SharedComponents/Dashboard/redux/saga";
import otherComplianceSaga from "Components/OtherCompliance/redux/saga";
import eventsModuleSagas from "Components/Events/redux/saga";

function* watchAndLog() {
  yield takeEvery("*", function* logger(action) {});
}

export default function* root() {
  yield all([
    fork(watchAndLog),
    fork(authSagas),
    fork(emailVerificationSagas),
    fork(teamMemberSaga),
    fork(taskReportSaga),
    fork(globalSagas),
    fork(historySaga),
    fork(updatesSaga),
    fork(calenderViewSaga),
    fork(userTypeSagas),
    fork(paymentSaga),
    fork(projectSaga),
    fork(newRegulaitonsQuizSaga),
    fork(auditSaga),
    fork(dashboardSagas),
    fork(otherComplianceSaga),
    fork(eventsModuleSagas),
  ]);
}
