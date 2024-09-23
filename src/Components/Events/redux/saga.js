import { takeLatest, call, put, select } from "redux-saga/effects";
import { getCircularList, setCircularDetails, setCircularStatus } from "../api";
import {
  eventsModuleTypes as types,
  eventsModuleActions as actions,
} from "./actions";
import { toast } from "react-toastify";

const fetchCirculars = function* () {
  try {
    const userDetails = yield select((state) => state?.auth?.loginInfo);
    const selectedUserEmail = yield select(
      (state) => state?.eventsModuleReducer?.selectedUser?.email
    );

    const { data, status } = yield call(getCircularList, {
      email_id: selectedUserEmail || userDetails.email,
    });
    if (status === 200 && data?.message?.status) {
      yield put(
        actions.fetchCircularsSuccess(data?.message?.circular_list || [])
      );
    } else {
      yield put(actions.fetchCircularsFailed([]));
    }
  } catch (error) {
    yield put(actions.fetchCircularsFailed([]));
  }
};

const addUpdateCircular = function* ({ payload }) {
  try {
    const { data, status } = yield call(setCircularDetails, payload?.data);
    if (status === 200 && data?.message?.status) {
      if (payload?.dataForStatusUpdate) {
        if (payload?.dataForStatusUpdate?.status === "Rejected") {
          yield put(actions.addUpdateCircularFailed());
          yield put(
            actions.setRejectionCommentModal({
              visible: true,
              rejectionDetails: payload.dataForStatusUpdate,
              name: payload.name,
            })
          );
        } else {
          yield put(
            actions.setCircularStatusRequest(payload.dataForStatusUpdate)
          );
        }
      } else {
        toast.success(data?.message?.status_response);
        yield put(actions.addUpdateCircularSuccess());
      }
    } else {
      toast.error(data?.message?.status_response);
      yield put(actions.addUpdateCircularFailed());
    }
  } catch (error) {
    toast.error("Something went wrong!");
    yield put(actions.addUpdateCircularFailed());
  }
};
const setCircularStatusRequest = function* ({ payload }) {
  try {
    const { data, status } = yield call(setCircularStatus, payload);
    if (status === 200 && data?.message?.status) {
      toast.success(data?.message?.status_response);
      if (payload.status === "Rejected") {
        yield put(
          actions.setRejectionCommentModal({
            visible: false,
            rejectionDetails: null,
            name: "",
          })
        );
      }
      yield put(actions.setCircularStatusSuccess());
    } else {
      toast.error(data?.message?.status_response);
      yield put(actions.setCircularStatusFailed());
    }
  } catch (error) {
    yield put(actions.setCircularStatusFailed());
  }
};

export default function* eventsModuleSagas() {
  yield takeLatest(types.FETCH_CIRCULARS_REQUEST, fetchCirculars);
  yield takeLatest(types.ADD_UPDATE_CIRCULAR_REQUEST, addUpdateCircular);
  yield takeLatest(types.SET_CIRCULAR_STATUS_REQUEST, setCircularStatusRequest);
}
