import axiosInstance from "apiServices";
import moment from "moment";
import { call, put, select, takeLatest } from "redux-saga/effects";
import apis from "../apis";
import {
  fetchTasksByFilterFailed,
  fetchTasksByFilterRequest,
  fetchTasksByFilterSuccess,
  fetchTasksFailed,
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTaskDetailFailed,
  fetchTaskDetailSuccess,
  fetchTaskDetailRequest,
  fetchTasksBySearchQuerySuccess,
  fetchTasksBySearchQueryFailed,
  FETCH_TASKS_BY_SEARCH_QUERY_REQUEST,
  setIsPaymentPlanActive,
  CHECK_PAYMENT_PLANT_STATUS,
  FETCH_ANALYTICS_TASKS_REQUEST,
  fetchAnalyticsTasksSuccess,
  fetchAnalyticsTasksFailed,
  fetchDashboardAnalyticsSuccess,
  fetchDashboardAnalyticsFailed,
  FETCH_DASHBOARD_ANALYTICS_REQUEST,
  FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_REQUEST,
  fetchTasksByTeamPerformanceUserSuccess,
  fetchTasksByTeamPerformanceUserFailed,
  fetchDashboardTeamAnalyticsFailed,
  FETCH_DASHBOARD_TEAM_ANALYTICS_REQUEST,
  fetchDashboardTeamAnalyticsSuccess,
  setTaskDetailImpactModal,
  FETCH_IMPACT_DETAILS_BY_TASK,
  setActiveLicenses,
  SET_NOT_APPLICABLE_REQUEST,
  setNotApplicableSuccess,
  setNotApplicableFailed,
  setApplicableSuccess,
  setApplicableFailed,
  SET_APPLICABLE_REQUEST,
} from "./actions";
import { toast } from "react-toastify";

function* fetchTasks({ payload }) {
  try {
    const currentViewByFilter = yield select(
      (state) => state?.DashboardState?.currentViewByFilter
    );
    let result = {};

    result = yield call(apis.getTasks, {
      limit: 6,
      offset: 0,
      ...(currentViewByFilter === "Status"
        ? { key: "All" }
        : { filter: currentViewByFilter }),
    });

    const { data, status } = result;
    if (status === 200 && data && data?.data) {
      yield put(
        fetchTasksSuccess([...(data?.data?.length > 0 ? data?.data : [])])
      );
    } else {
      yield put(fetchTasksFailed());
    }
  } catch (error) {
    yield put(fetchTasksFailed());
  }
}

function* fetchTasksByFilter({ payload }) {
  try {
    const currentViewByFilter = yield select(
      (state) => state?.DashboardState?.currentViewByFilter
    );
    const { data, status } = yield call(apis.getTasks, {
      ...payload,
      ...(currentViewByFilter !== "Status" && {
        filter: currentViewByFilter,
      }),
    });

    if (status === 200 && data && data?.data) {
      const tasksList = [...(data?.data?.tasks || [])];
      if (tasksList?.length > 0) {
        let tasks = yield select((state) => state?.DashboardState?.tasks?.list);
        let tasksIndexToAppend = null;
        let tasksListToAppend =
          tasks?.length > 0 &&
          tasks?.find((item, index) => {
            tasksIndexToAppend = index;
            return (
              item?.keyName === payload?.key || item?.keyId === payload?.key
            );
          })?.tasks;

        if (tasksListToAppend && tasksListToAppend?.length > 0) {
          tasksListToAppend = [
            ...tasksListToAppend,
            ...(tasksList?.length > 0 && payload.offset !== 0 ? tasksList : []),
          ];

          tasks[tasksIndexToAppend].tasks = [...tasksListToAppend];

          yield put(fetchTasksSuccess(tasks));
        }
      }
      yield put(fetchTasksByFilterSuccess(data?.data || {}));
    } else {
      yield put(fetchTasksByFilterFailed());
    }
  } catch (error) {
    yield put(fetchTasksByFilterFailed());
  }
}

function* fetchTaskDetail({ payload }) {
  try {
    const { data, status } = yield call(apis.getTaskDetail, payload);

    if (status === 200 && data && data?.data) {
      yield put(fetchTaskDetailSuccess(data.data));
    } else {
      yield put(fetchTaskDetailFailed());
    }
  } catch (error) {
    yield put(fetchTaskDetailFailed());
  }
}

function* fetchTasksBySearchQuery({ payload }) {
  try {
    const { data, status } = yield call(apis.getTasksBySearchQuery, payload);
    if (status === 200 && data?.data?.count > 0) {
      const { tasks, count } = data.data;
      const previousTasks = yield select(
        (state) => state?.DashboardState?.tasksBySearchQuery?.data?.tasks
      );
      if (payload.offset > 0 && previousTasks?.length > 0) {
        yield put(
          fetchTasksBySearchQuerySuccess({
            count,
            tasks: [
              ...(previousTasks || []),
              ...(tasks?.length > 0 ? tasks : []),
            ],
          })
        );
      } else {
        yield put(fetchTasksBySearchQuerySuccess(data.data));
      }
    } else {
      yield put(fetchTasksBySearchQueryFailed());
    }
  } catch (error) {
    // toast.error('Unable to fetch tasks');
    yield put(fetchTasksBySearchQueryFailed());
  }
}

function* fetchTeamPerformanceUserTasks({ payload }) {
  try {
    const { data, status } = yield call(apis.getTasksByFilter, payload);
    if (status === 200 && data.data) {
      const { tasks, count } = data.data;

      const previousTasks = yield select(
        (state) =>
          state.DashboardState.tasksByTeamPerformanceUser?.data?.tasks || []
      );
      if (payload?.offset > 0 && previousTasks?.length > 0) {
        const taskLsit =
          tasks && tasks.length > 0
            ? tasks.map((ST, i) => {
                ST.TAskIDIndex = i;
                ST.dueDate = moment(ST.dueDate).format("DD MMM YYYY");
                return ST;
              })
            : [];
        yield put(
          fetchTasksByTeamPerformanceUserSuccess({
            count,
            tasks: [
              ...(previousTasks || []),
              ...(taskLsit?.length > 0 ? taskLsit : []),
            ],
          })
        );
      } else {
        // yield put(fetchTasksByTeamPerformanceUserSuccess(data.data));
        const taskLsit =
          tasks && tasks.length > 0
            ? tasks.map((ST, i) => {
                ST.TAskIDIndex = i;
                ST.dueDate = moment(ST.dueDate).format("DD MMM YYYY");
                return ST;
              })
            : [];
        yield put(
          fetchTasksByTeamPerformanceUserSuccess({
            count,
            tasks: taskLsit,
          })
        );
      }
    } else {
      yield put(fetchTasksByTeamPerformanceUserFailed());
    }
  } catch (error) {
    yield put(fetchTasksByTeamPerformanceUserFailed());
  }
}
function* fetchAnalyticsTasks({ payload }) {
  try {
    const { data, status } = yield call(apis.getTasksByFilter, payload);
    if (status === 200 && data?.data) {
      const { tasks, count } = data.data;
      const taskLsit =
        tasks && tasks.length > 0
          ? tasks.map((ST, i) => {
              ST.TAskIDIndex = i;
              ST.dueDate = moment(ST.dueDate).format("DD MMM YYYY");
              return ST;
            })
          : [];
      // console.warn(taskLsit);
      const previousTasks = yield select(
        (state) => state?.DashboardState?.tasksByAnalytics?.data?.tasks
      );
      if (payload.offset > 0 && previousTasks?.length > 0) {
        yield put(
          fetchAnalyticsTasksSuccess({
            count,
            tasks: [
              ...(previousTasks || []),
              ...(taskLsit?.length > 0 ? taskLsit : []),
            ],
          })
        );
      } else {
        yield put(fetchAnalyticsTasksSuccess(data.data));
      }
    } else {
      yield put(fetchAnalyticsTasksFailed());
    }
  } catch (error) {
    // toast.error('Unable to fetch tasks');
    yield put(fetchAnalyticsTasksFailed());
  }
}

function* fetchDashboardTeamAnalyticsData() {
  try {
    const { data, status } = yield axiosInstance.get(
      "compliance.api.teamPerformanceAnalytics"
    );

    if (status === 200 && data?.message?.status) {
      const team_performance_data = data?.message?.team_performance_data || [];
      yield put(fetchDashboardTeamAnalyticsSuccess([...team_performance_data]));
    } else {
      yield put(fetchDashboardTeamAnalyticsFailed());
    }
  } catch (error) {
    yield put(fetchDashboardTeamAnalyticsFailed());
  }
}

function* fetchDashboardAnalyticsData() {
  try {
    const { data, status } = yield axiosInstance.get(
      `compliance.api.dashboardAnalytics`
    );

    if (status === 200 && data.message.status) {
      const companyList = [];

      const {
        // compliant_data,
        // team_performance_data,
        approvalPending,
        completedTask,
        // next7Days,
        // next30Days,
        rejectedTask,
        ccTask,
        notAssigned,
        riskDelay,
        beyond30Days,
        next6Days,
        next8To30Days,
        today,
        all,
      } = data.message;

      // compliant_data.map((companyDetail) => {
      //   let LicenseCodeList = [];
      //   companyDetail.license.map((licenseDetail) => {
      //     LicenseCodeList.push({
      //       name: licenseDetail.name,
      //       status: licenseDetail.status,
      //     });
      //   });
      //   companyList.push({
      //     companyName: companyDetail.company_name,
      //     licenseCodeList: LicenseCodeList,
      //     completed_task: companyDetail.completed_task,
      //     total_task: companyDetail.total_task,
      //   });
      // });

      yield put(
        fetchDashboardAnalyticsSuccess({
          // teamStats: team_performance_data,
          dashboardStats: companyList,
          analyticsData: {
            approvalPending,
            completedTask,
            // next7Days,
            // next30Days,
            ccTask,
            notAssigned,
            riskDelay,
            beyond30Days,
            next6Days,
            next8To30Days,
            rejectedTask,
            today,
            All: all,
          },
        })
      );
    } else {
      yield put(fetchDashboardAnalyticsFailed());
    }
  } catch (error) {
    yield put(fetchDashboardAnalyticsFailed());
  }
}

function* fetchPaymentPlanStatus() {
  try {
    const { data, status } = yield call(apis.getPaymentPlanStatus);
    if (status === 200 && data.message) {
      const next_billing_date = data.message?.next_billing_date;
      const licenses = data?.message?.license_details;
      const activeLicenses = licenses || [];
      const currentDate = moment(new Date()).format("YYYY-MM-DD");
      if (next_billing_date > currentDate) {
        yield put(setIsPaymentPlanActive(true));
      } else {
        yield put(setIsPaymentPlanActive(false));
      }
      yield put(setActiveLicenses(activeLicenses));
    } else {
      yield put(setIsPaymentPlanActive(false));
      yield put(setActiveLicenses([]));
    }
  } catch (error) {
    yield put(setActiveLicenses([]));
    yield put(setIsPaymentPlanActive(false));
  }
}
function* fetchImpactDetailsByTask({ payload }) {
  try {
    const { data, status } = yield call(
      apis.fetchTaskImpact,
      payload.task_name
    );
    if (status === 200 && data?.message?.status) {
      yield put(
        setTaskDetailImpactModal({
          isShow: true,
          data: {
            impact: data?.message?.impact,
            file_details: data?.message?.file_details,
            date: data?.message?.date,
          },
          isLoading: false,
        })
      );
    } else {
      yield put(setTaskDetailImpactModal());
    }
  } catch (error) {
    yield put(setTaskDetailImpactModal());
  }
}
function* markNotApplicable({ payload }) {
  try {
    const { data, status } = yield call(
      apis.setNotApplicableForMe,
      payload.data
    );
    if (status === 200 && data?.message?.status) {
      yield put(setNotApplicableSuccess());
      toast.success(data?.message?.status_response);
      if (payload.taskId) {
        yield put(fetchTaskDetailRequest(payload.taskId));
      }
    } else {
      yield put(setNotApplicableFailed());
      toast.error(data?.message?.status_response);
    }
  } catch (error) {
    yield put(setNotApplicableFailed());
    toast.error("Somthing went wrong!");
  }
}
function* markApplicable({ payload }) {
  try {
    const { data, status } = yield call(apis.setApplicableForMe, payload.data);
    if (status === 200 && data?.message?.status) {
      yield put(setApplicableSuccess());
      toast.success(data?.message?.status_response);
      if (payload.taskId) {
        yield put(fetchTaskDetailRequest(payload.taskId));
      }
    } else {
      yield put(setApplicableFailed());
      toast.error(data?.message?.status_response);
    }
  } catch (error) {
    yield put(setApplicableFailed());
    toast.error("Somthing went wrong!");
  }
}
export default function* dashboardSagas() {
  yield takeLatest(fetchTasksRequest, fetchTasks);
  yield takeLatest(fetchTasksByFilterRequest, fetchTasksByFilter);
  yield takeLatest(fetchTaskDetailRequest, fetchTaskDetail);
  yield takeLatest(
    FETCH_TASKS_BY_SEARCH_QUERY_REQUEST,
    fetchTasksBySearchQuery
  );
  yield takeLatest(CHECK_PAYMENT_PLANT_STATUS, fetchPaymentPlanStatus);
  yield takeLatest(FETCH_ANALYTICS_TASKS_REQUEST, fetchAnalyticsTasks);
  yield takeLatest(
    FETCH_DASHBOARD_ANALYTICS_REQUEST,
    fetchDashboardAnalyticsData
  );
  yield takeLatest(
    FETCH_DASHBOARD_TEAM_ANALYTICS_REQUEST,
    fetchDashboardTeamAnalyticsData
  );
  yield takeLatest(
    FETCH_TASKS_BY_TEAM_PERFORMANCE_USER_REQUEST,
    fetchTeamPerformanceUserTasks
  );
  yield takeLatest(FETCH_IMPACT_DETAILS_BY_TASK, fetchImpactDetailsByTask);
  yield takeLatest(SET_NOT_APPLICABLE_REQUEST, markNotApplicable);
  yield takeLatest(SET_APPLICABLE_REQUEST, markApplicable);
}
