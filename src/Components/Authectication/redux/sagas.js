import { call, put, takeLatest } from "redux-saga/effects";
import { actions, types } from "./actions";
import api from "../api";
import { toast } from "react-toastify";
import { actions as onBoardingActions } from "../../OnBoarding/redux/actions";
// import { createBrowserHistory } from "history";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../../apiServices/baseurl";
import { getAuditRole, getUserType } from "../components/Auth";
import { actions as adminMenuActions } from "../../OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import {
  clearDashboardAnalytics,
  clearTaskDetail,
} from "SharedComponents/Dashboard/redux/actions";
import { clearState } from "Components/CalenderView/redux/actions";
import { clearFilter } from "Components/Updates/redux/actions";
import { history } from "App";
import { setCompanyExists } from "SharedComponents/CompanyReducer/actions";
import { emptyCancelTokens } from "apiServices/utils";

// const history = createBrowserHistory();

const loginReq = function* loginReq({ payload }) {
  try {
    const { data, status } = yield call(api.loginAccount, payload);
    const { message } = data;
    if (message.status && status === 200) {
      const { UserType, signup_done, details, route, page, auth_token } =
        message;
      localStorage.setItem("basicToken", auth_token);
      if (data) {
        const deviceToken = localStorage.getItem("deviceToken");

        axios.post(
          `${BACKEND_BASE_URL}compliance.api.setFCMToken`,
          { token: deviceToken },
          {
            headers: { Authorization: `Bearer ${auth_token}` },
          }
        );

        let { userType, isLicenseManager, isCEApprover } =
          getUserType(UserType);
        let auditUserType = getAuditRole(UserType);
        localStorage.setItem("userType", userType);
        message.UserType = userType;
        message.full_name = data.full_name;

        yield put(setCompanyExists(message.company_exists));
        yield put(
          actions.signInRequestSuccess({
            loginSuccess: false,
            data: {
              ...message,
              auditUserType: auditUserType,
              isLicenseManager: isLicenseManager,
              isCEApprover,
            },
          })
        );
        if (signup_done) {
          payload?.history?.push("/dashboard-view");
          yield put(adminMenuActions.setDashboardTab("List"));
          yield put(adminMenuActions.setDashboardViewType("status"));
          // yield put(adminMenuActions.setTakeActionTab(""));
          yield put(clearDashboardAnalytics());
        } else {
          if (route && details && page) {
            if (message.mobileVerified === 0 && page === "otpverification-co") {
              payload.history.replace({
                pathname: "/otpverification-co",
                state: {
                  mobile_number: message.Mobile,
                  token: message.token,
                  type: "mobile-validation",
                },
              });
            } else if (page === "company details") {
              yield put(
                onBoardingActions.insUpdateDeletAPIRequestSuccess({
                  ...details,
                  email: message?.email,
                  full_name: message?.full_name,
                  token: message?.token,
                  mobile_number: message?.Mobile,
                })
              );
              payload.history?.replace(route);
            } else {
              payload.history?.replace(route);
            }
          }
        }
      }
    } else {
      toast.error("Invalid username and password !!!");
      yield put(actions.signInRequestFailed({ loginSuccess: false }));
    }
  } catch (err) {
    console.log(err);
    toast.error(
      err?.response?.data?.message?.status_response || "something went wrong"
    );
    yield put(actions.signInRequestFailed({ loginSuccess: false }));
  }
};
const updatePasswordReq = function* updatePasswordReq({ payload }) {
  try {
    const { status, data } = yield call(api.updatePassword, payload);
    if (
      status === 200 &&
      data &&
      data.message &&
      data.message.status === true
    ) {
      yield put(actions.updatePasswordRequestSuccess({ resetPassword: true }));
      toast.success("Password changed successfully");
      payload.history.push("/login");
    } else {
      if (data && data.message && data.message.status === "Fail") {
        toast.error(
          data.message.status_response ||
            "Something went wrong! Please try again"
        );
      }
      yield put(actions.updatePasswordRequestFailed({ resetPassword: false }));
    }
  } catch (err) {
    toast.error("Something went wrong. Please try again");
    yield put(actions.updatePasswordRequestFailed({ resetPassword: false }));
  }
};

const logoutRequest = function* ({ payload }) {
  const deviceToken = localStorage.getItem("deviceToken");
  yield put(adminMenuActions.setCurrentMenu("dashboard"));
  yield put(adminMenuActions.setActiveTabInSetting("personal"));
  yield put(clearDashboardAnalytics());
  yield put(adminMenuActions.setTakeActionTab(""));
  yield put(adminMenuActions.setCurrentBoardViewTaskId(null));
  yield put(adminMenuActions.setCurrentCalendarViewTaskId(null));
  yield put(clearTaskDetail());
  yield put(clearState());
  yield put(clearFilter());
  yield put(clearDashboardAnalytics());
  localStorage.removeItem("company_exists");
  localStorage.removeItem("dashboard-analytics-search-query");
  emptyCancelTokens();
  if (deviceToken) {
    yield put(actions.removeFcmToken(deviceToken));
  }
  history.replace({
    pathname: "/login",
  });
};
const getUserRoles = function* getUserRoles() {
  try {
    const resp = yield call(api.getUserRolesAPI);
    if (resp.status === 200) {
      const payload = (resp.data.message || []).map((y) => {
        return {
          label: y.role,
          value: y.role,
        };
      });
      yield put(actions.getUserRolesSuccess(payload));
    }
  } catch (err) {
    yield put(actions.userByRoleRequestFailed([]));
  }
};

const removeFcmTokenRequest = function* ({ payload }) {
  try {
    yield call(api.removeFCMToken, { token: payload });
  } catch (error) {}
};

export default function* sagas() {
  yield takeLatest(types.SIGN_IN_REQUEST, loginReq);
  yield takeLatest(types.UPDATE_PASSWORD_REQUEST, updatePasswordReq);
  yield takeLatest(types.GET_USER_ROLES_REQUEST, getUserRoles);
  yield takeLatest(types.LOGOUT_REQUEST, logoutRequest);
  yield takeLatest(types.REMOVE_FCM_TOKEN_REQUEST, removeFcmTokenRequest);
}
