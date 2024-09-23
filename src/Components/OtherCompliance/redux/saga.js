import { toast } from "react-toastify";
import {
  getChecklistForOtherCompliance,
  getLicensesForOtherCompliance,
  createCustomChecklistForOtherCompliance,
  getYourComplianceChecklistForOtherCompliance,
} from "../api";
import {
  createCustomChecklistFailed,
  createCustomChecklistSuccess,
  fetchChecklistFailed,
  fetchChecklistSuccess,
  fetchLicensesFailed,
  fetchLicensesSuccess,
  fetchYourComplianceChecklistFailed,
  fetchYourComplianceChecklistSuccess,
} from "./actions";
import {
  CREATE_CUSTOM_CHECKLIST_REQUEST,
  FETCH_CHECKLIST_REQUEST,
  FETCH_LICENSES_REQUEST,
  FETCH_YOUR_COMPLIANCE_CHECKLIST_REQUEST,
} from "./types";

const { takeLatest, put, call } = require("redux-saga/effects");

function* fetchLicenses({ payload }) {
  try {
    const { data, status } = yield call(getLicensesForOtherCompliance);
    if (status === 200 && data && data?.message && data?.message?.status) {
      const licenses =
        data?.message?.status_response?.length > 0
          ? data?.message?.status_response
          : [];
      yield put(fetchLicensesSuccess(licenses));
    } else {
      yield put(fetchLicensesFailed());
    }
  } catch (error) {
    yield put(fetchLicensesFailed());
  }
}
function* fetchChecklist({ payload }) {
  try {
    const { data, status } = yield call(
      getChecklistForOtherCompliance,
      payload
    );
    if (status === 200 && data && data?.message && data?.message?.status) {
      const checklist_details = data?.message?.status_response;
      yield put(fetchChecklistSuccess(checklist_details || []));
    } else {
      yield put(fetchChecklistFailed());
    }
  } catch (error) {
    yield put(fetchChecklistFailed());
  }
}
function* fetchYourComplianceChecklist({ payload }) {
  try {
    const { data, status } = yield call(
      getYourComplianceChecklistForOtherCompliance
    );
    if (status === 200 && data && data?.message && data?.message?.status) {
      const checklist_details = data?.message?.status_response;
      yield put(fetchYourComplianceChecklistSuccess(checklist_details || []));
    } else {
      yield put(fetchYourComplianceChecklistFailed());
    }
  } catch (error) {
    yield put(fetchYourComplianceChecklistFailed());
  }
}
function* createCustomChecklist({ payload }) {
  try {
    const { data, status } = yield call(
      createCustomChecklistForOtherCompliance,
      payload
    );
    if (status === 200 && data && data?.message && data?.message?.status) {
      toast.success(data?.message?.status_response);
      yield put(createCustomChecklistSuccess());
    } else {
      toast.error(data?.message?.status_response || "Something went wrong!");
      yield put(createCustomChecklistFailed());
    }
  } catch (error) {
    toast.error("Something went wrong!");
    yield put(createCustomChecklistFailed());
  }
}

function* otherComplianceSaga() {
  yield takeLatest(FETCH_LICENSES_REQUEST, fetchLicenses);
  yield takeLatest(FETCH_CHECKLIST_REQUEST, fetchChecklist);
  yield takeLatest(
    FETCH_YOUR_COMPLIANCE_CHECKLIST_REQUEST,
    fetchYourComplianceChecklist
  );
  yield takeLatest(CREATE_CUSTOM_CHECKLIST_REQUEST, createCustomChecklist);
}

export default otherComplianceSaga;
