import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../CommonModules/GlobalData/api";
import {
  setCompanyList,
  setHistoryList,
  setLicenseList,
  setLoading,
  setSuccess,
} from "./actions";
import { GET_COMPANY_LIST, GET_HISTORY_LIST, GET_LICENSE_LIST } from "./types";

function* fetchCompanyList(action) {
  try {
    const { data } = yield call(api.getTaskReport);
    if (data.message.status) {
      yield put(setCompanyList(data.message.company_details_list));
    } else {
    }
  } catch (error) {
    console.log(error.message);
  }
}

function* fetchLicenseList(action) {
  try {
    if (action.payload) {
      const list = action.payload.map((item, index) => {
        return {
          LicenseCode: item,
          LicenseID: index,
          selected: item.selected,
        };
      });
      yield put(setLicenseList(list));
    } else {
    }
  } catch (error) {
    console.log(error.message);
  }
}

function* fetchHistoryList(action) {
  try {
    yield put(setLoading({ isLoading: true }));
    const { data } = yield call(api.getHisotry, action.payload);

    if (data.message.status) {
      yield put(setHistoryList(data.message.compliance_history_details));
      yield put(setSuccess(true));
      yield put(setLoading({ isLoading: false }));
    } else {
      toast.error(data.message.status_response);
      yield put(setHistoryList([]));
      yield put(setSuccess(true));
      yield put(setLoading({ isLoading: false }));
    }
  } catch (error) {
    yield put(setHistoryList([]));
    yield put(setSuccess(true));
    yield put(setLoading({ isLoading: false }));
  }
}

function* historySaga() {
  yield takeLatest(GET_COMPANY_LIST, fetchCompanyList);
  yield takeLatest(GET_LICENSE_LIST, fetchLicenseList);
  yield takeLatest(GET_HISTORY_LIST, fetchHistoryList);
}

export default historySaga;
