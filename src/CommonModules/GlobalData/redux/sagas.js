import { call, put, takeLatest } from "redux-saga/effects";
import { actions, types } from "./actions";
import api from "../api";

const countryCodeListReq = function* countryCodeListReq({ payload }) {
  try {
    const { data, status } = yield call(api.loginAccount, payload);
    if (status === 200) {
      yield put(actions.countryCodeRequetsSuccess({ countryCode: data }));
    } else {
    }
  } catch (err) {}
};

export default function* sagas() {
  yield takeLatest(types.COUNTRYCODE_LIST_REQUEST, countryCodeListReq);
}
