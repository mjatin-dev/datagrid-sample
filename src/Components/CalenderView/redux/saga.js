import { put, call, takeLatest } from "redux-saga/effects";
import apis from "SharedComponents/Dashboard/apis";
import {
  setDayData,
  setLoading,
  setMonthData,
  setSuccess,
  setWeekData,
} from "./actions";
import { GET_DAY, GET_MONTH, GET_WEEK } from "./types";

function* fetchCalenderDayData(action) {
  try {
    yield put(setLoading(true));
    const { StartDate } = action.payload;
    const task_filter = {
      task_filter: { from_date: StartDate, to_date: StartDate },
    };
    const result = yield call(apis.getTasksPost, task_filter);
    const { data } = result;
    if (data && data.data.tasks.length > 0) {
      yield put(setDayData(data.data.tasks));
      yield put(setSuccess(true));
      yield put(setLoading(false));
    } else {
      yield put(setDayData([]));
      yield put(setSuccess(false));
      yield put(setLoading(false));
    }
  } catch (error) {
    yield put(setDayData([]));
    yield put(setSuccess(false));
    yield put(setLoading(false));
  }
}

function* fetchCalenderWeekData(action) {
  try {
    yield put(setLoading(true));
    const { StartDate, EndDate } = action.payload;
    const task_filter = {
      task_filter: { from_date: StartDate, to_date: EndDate },
    };
    const result = yield call(apis.getTasksPost, task_filter);
    const { data } = result;
    if (data && data.data.tasks.length > 0) {
      yield put(setWeekData(data.data.tasks));
      yield put(setSuccess(true));
      yield put(setLoading(false));
    } else {
      yield put(setWeekData([]));
      yield put(setSuccess(false));
      yield put(setLoading(false));
    }
  } catch (error) {
    yield put(setWeekData([]));
    yield put(setSuccess(false));
    yield put(setLoading(false));
  }
}

function* fetchCalenderMonthData(action) {
  try {
    const { StartDate, EndDate } = action.payload;
    yield put(setLoading(true));
    const task_filter = {
      task_filter: { from_date: StartDate, to_date: EndDate },
    };
    const result = yield call(apis.getTasksPost, task_filter);
    const { data } = result;

    if (data && data.data.tasks.length > 0) {
      yield put(setMonthData(data.data.tasks));
      yield put(setSuccess(true));
      yield put(setLoading(false));
    } else {
      yield put(setMonthData([]));
      yield put(setSuccess(false));
      yield put(setLoading(false));
    }
  } catch (error) {
    yield put(setMonthData([]));
    yield put(setSuccess(false));
    yield put(setLoading(false));
  }
}

function* calenderViewSaga() {
  yield takeLatest(GET_DAY, fetchCalenderDayData);
  yield takeLatest(GET_WEEK, fetchCalenderWeekData);
  yield takeLatest(GET_MONTH, fetchCalenderMonthData);
}

export default calenderViewSaga;
