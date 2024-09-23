import { call, put, takeLatest, select } from "redux-saga/effects";
import api from "../api";
import {
  GET_USERS_LIST_REQUEST,
  GET_PROJECT_MANAGEMENT_DATA_REQUEST,
  SET_PROJECT_DETAIL,
  ADD_UPDATE_TASKLIST_REQUEST,
  ADD_UPDATE_MILESTONE_REQUEST,
  ADD_UPDATE_TASK_REQUEST,
  getProjectDataSuccess,
  getProjectDataFailed,
  addUpdateTaskListFailed,
  addUpdateTaskListSuccess,
  getProjectDataRequest,
  addUpdateMilestoneFailed,
  addUpdateMilestoneSuccess,
  getUsersListSuccess,
  getUsersListFailed,
  GET_INDIVIDUAL_TASKS_REQUEST,
  getIndividualTasksSuccess,
  getIndividualTasksFailed,
  getIndividualTasksRequest,
  deactivateSuccess,
  deactivateFailed,
  DEACTIVATE_REQUEST,
  GET_TRASH_PROJECTS_REQUEST,
  GET_TRASH_MILESTONE_REQUEST,
  GET_TRASH_TASKS_REQUEST,
  getTrashMilestoneSuccess,
  getTrashMilestoneFailed,
  getTrashProjectSuccess,
  getTrashProjectFailed,
  getTrashTasksSuccess,
  getTrashTasksFailed,
  getTrashProjectRequest,
  getTrashMilestoneRequest,
  getTrashTasksRequest,
  deleteFromTrashSuccess,
  deleteFromTrashFailed,
  DELETE_FROM_TRASH_REQUEST,
  RESTORE_FROM_TRASH_REQUEST,
  restoreFromTrashFailed,
  restoreFromTrashSuccess,
  GET_TRASH_TASKS_LIST_REQUEST,
  getTrashTaskListSuccess,
  getTrashTaskListFailed,
  getTrashTaskListRequest,
  setCreateProjectLoader,
  setCreateTaskLoader,
} from "./actions";
import { toast } from "react-toastify";
import { actions as adminMenu } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import {
  fetchDashboardAnalyticsRequest,
  fetchTaskDetailRequest,
  clearTaskDetail,
  fetchDashboardTeamAnalyticsRequest,
  setCurrentActiveTab,
  setCurrentDashboardTab,
} from "SharedComponents/Dashboard/redux/actions";
import { isShowProjectModule } from "app.config";
import { getAnalyticsFilterByDate } from "CommonModules/helpers/tasks.helper";
import { history } from "App";

function* createProject(action) {
  try {
    yield put(setCreateProjectLoader(true));
    const { data } = yield call(api.getPostProject, action.payload);
    if (data.message.status === true) {
      toast.success(
        `Project ${
          action.payload.project_id ? "updated" : "added"
        } successfully`,
        {
          toastId: new Date().getTime(),
        }
      );
      yield put(getProjectDataRequest());
      yield put(setCreateProjectLoader(false));
    } else {
      toast.success(data?.message?.status_response, {
        toastId: new Date().getTime(),
      });
      yield put(setCreateProjectLoader(false));
    }
  } catch (error) {
    toast.warning("something went wrong. Please try again.");
    yield put(setCreateProjectLoader(false));
  }
}

function* getProjectData(action) {
  try {
    const { status, data } = yield call(api.getProjectData);
    if (status && status === 200 && data && data.message) {
      yield put(getProjectDataSuccess(data.message));
    } else {
      yield put(getProjectDataFailed());
    }
  } catch (error) {
    yield put(getProjectDataFailed());
  }
}

function* addAndUpdateTaskListData({ payload }) {
  try {
    const { status, data } = yield call(api.addAndUpdateTaskListData, payload);
    if (status === 200 && data && data?.message && data?.message?.status) {
      toast.success(
        `Tasklist ${payload?.task_list_id ? "updated" : "added"} successfully`
      );
      yield put(addUpdateTaskListSuccess());
      yield put(getProjectDataRequest());
    } else {
      toast.success(data?.message?.status_response, {
        toastId: new Date().getTime(),
      });
      yield put(addUpdateTaskListFailed());
    }
  } catch (error) {
    toast.error("Something went wrong. Please try again!");
    yield put(addUpdateTaskListFailed());
  }
}

function* addAndUpdateMilestoneData({ payload }) {
  try {
    const { status, data } = yield call(api.addAndUpdateMilestoneData, payload);
    if (status === 200 && data && data?.message && data?.message?.status) {
      toast.success(
        `Milestone ${payload.milestone_id ? "updated" : "added"} successfully!`
      );
      yield put(addUpdateMilestoneSuccess());
      yield put(getProjectDataRequest());
    } else {
      toast.error(
        data?.message?.status_response ||
          "Something went wrong. Please try again."
      );
      yield put(addUpdateMilestoneFailed());
    }
  } catch (error) {
    toast.error("Something went wrong. Please try again!");
    yield put(addUpdateMilestoneFailed());
  }
}

function* getUsersList() {
  try {
    const { status, data } = yield call(api.getRegisteredUserList);
    if (status === 200 && data && data?.message && data?.message?.length > 0) {
      const users = [...data?.message].map((item) => ({
        label: item.full_name,
        value: item.email,
        user_type: item?.user_type || [],
      }));
      yield put(getUsersListSuccess(users || []));
    } else {
      yield put(getUsersListFailed([]));
    }
  } catch (error) {
    yield put(getUsersListFailed([]));
  }
}

function* addAndUpdateTask({ payload }) {
  console.log(payload);
  try {
    yield put(setCreateTaskLoader(true));
    const { status, data } = yield call(
      api.addAndUpdateTaskData,
      payload?.formData
    );
    if (status === 200 && data && data.message && data.message.status) {
      toast.success(data?.message?.status_reonspse, {
        toastId: new Date().getTime(),
      });
      toast.success(
        `Task ${
          payload?.formData?.get("task_id") ? "updated" : "added"
        } successfully`,
        {
          toastId: new Date().getTime(),
        }
      );
      const currentAdminMenu = yield select(
        (state) => state.adminMenu.currentMenu
      );
      const currentDashBoardTab = yield select(
        (state) => state.DashboardState.currentDashboardTab
      );
      const userEmail = yield select((state) => state?.auth?.loginInfo?.email);
      const analyticsData = yield select(
        (state) => state.DashboardState?.dashboardAnalytics?.analyticsData
      );

      const task_id =
        payload?.formData?.get("task_id") || data?.message?.taskId;
      const end_date = payload?.formData?.get("end_date");
      let assign_to =
        JSON.parse(payload?.formData?.get("isEdit")) && !task_id
          ? JSON.parse(payload?.formData?.get("assign_to"))
          : payload?.formData?.get("assign_to");
      const is_assign_to_array = typeof assign_to === "object";
      const is_multiple_assign_to = is_assign_to_array && assign_to?.length > 1;
      const _takeActionTabFilter = getAnalyticsFilterByDate(end_date);
      if (currentAdminMenu === "dashboard") {
        yield put(fetchDashboardAnalyticsRequest());
        yield put(fetchDashboardTeamAnalyticsRequest());
        yield put(
          adminMenu.setTakeActionTab({
            filter: _takeActionTabFilter,
            key: !is_multiple_assign_to
              ? (
                  is_assign_to_array
                    ? userEmail === assign_to[0]
                    : userEmail === assign_to
                )
                ? "assignedToMe"
                : "assignedToOthers"
              : "all",
            data: analyticsData[_takeActionTabFilter],
          })
        );
      }
      if (currentAdminMenu === "project-management") {
        if (isShowProjectModule) yield put(getProjectDataRequest());
        yield put(getIndividualTasksRequest());
      }
      yield put(fetchTaskDetailRequest(task_id));
      if (currentAdminMenu !== "dashboard" && currentAdminMenu !== "taskList") {
        history.push({
          pathname: "/dashboard-view",
          state: { handleBack: true, taskId: task_id },
        });
      }
      if (currentDashBoardTab === "Audit") {
        yield put(setCurrentDashboardTab("Tasks"));
      }
      yield put(setCreateTaskLoader(false));
    } else {
      toast.error(data?.message?.status_response);
      yield put(setCreateTaskLoader(false));
    }
  } catch (error) {
    toast.error("Something went wrong! Please try again.");
    yield put(setCreateTaskLoader(false));
  }
}

function* getInidividualTasks() {
  try {
    const { status, data } = yield call(api.getIndividualTasks);
    if (status === 200 && data && data?.message && data?.message?.status) {
      const tasks_list = data?.message?.task_data;
      yield put(getIndividualTasksSuccess(tasks_list));
    } else {
      yield put(getIndividualTasksFailed([]));
    }
  } catch (error) {
    yield put(getIndividualTasksFailed([]));
  }
}

function* deactivateRequestHandler({ payload }) {
  let requestEndpoint = null,
    requestPayload = {};
  switch (payload?.modalName) {
    case "Project":
      requestEndpoint = api.deactivateProject;
      requestPayload = {
        project_id: payload?.id,
      };
      break;
    case "TaskList":
      requestEndpoint = api.deactivateTasklist;
      requestPayload = {
        task_list_id: payload?.id,
      };
      break;
    case "Milestone":
      requestEndpoint = api.deactivateMilestone;
      requestPayload = {
        milestone_id: payload?.id,
      };
      break;
    case "Task":
      requestEndpoint = api.deactivateTask;
      requestPayload = {
        task_id: payload?.id,
        ...(payload.recurring_task && {
          recurring_task: payload.recurring_task,
        }),
      };
      break;
    default:
      requestEndpoint = api.deactivateTask;
      requestPayload = {
        task_id: payload?.id,
      };
      return null;
  }
  try {
    const { status, data } = yield call(requestEndpoint, requestPayload);
    if (status === 200 && data && data?.message && data?.message?.status) {
      toast.success(data?.message?.status_response);
      yield put(deactivateSuccess());
      const currentAdminMenu = yield select(
        (state) => state.adminMenu.currentMenu
      );
      const currentActiveTab = yield select(
        (state) => state.DashboardState.currentActiveTab
      );
      if (currentAdminMenu === "dashboard") {
        yield put(fetchDashboardAnalyticsRequest());
        yield put(clearTaskDetail());
      }
      if (currentAdminMenu === "project-management") {
        if (isShowProjectModule) yield put(getProjectDataRequest());
        yield put(getIndividualTasksRequest());
      }
      if (currentActiveTab === "Calendar") {
        yield put(clearTaskDetail());
        yield put(setCurrentActiveTab("Calendar"));
      }
    } else {
      toast.error(data?.message?.status_response);
      yield put(deactivateFailed(data?.message?.status_response));
    }
  } catch (error) {
    toast.error("Something went wrong. Please try again");
    yield put(deactivateFailed("Something went wrong. Please try again"));
  }
}

function* getTashProjects({ payload }) {
  try {
    const { status, data } = yield call(api.getTashProjectsList, payload);
    if (status === 200 && data && data.message && data.message.status) {
      // toast.success(data?.message?.status_response);
      yield put(getTrashProjectSuccess(data?.message?.milestone_data));
    } else {
      // toast.error(data?.message?.status_response);
      yield put(getTrashProjectFailed());
    }
  } catch (error) {
    // toast.error("Something went wrong. Please try again.");
    yield put(getTrashProjectFailed());
  }
}
function* getTashMilestone({ payload }) {
  try {
    const { status, data } = yield call(api.getTrashMilestoneList, payload);
    if (status === 200 && data && data.message && data.message.status) {
      // toast.success(data?.message?.status_response);
      yield put(getTrashMilestoneSuccess(data?.message?.milestone_data));
    } else {
      // toast.error(data?.message?.status_response);
      yield put(getTrashMilestoneFailed());
    }
  } catch (error) {
    // toast.error("Something went wrong. Please try again.");
    yield put(getTrashMilestoneFailed());
  }
}
function* getTashTasks({ payload }) {
  try {
    const { status, data } = yield call(api.getTrashTasksList, payload);
    if (status === 200 && data && data.message && data.message.status) {
      // toast.success(data?.message?.status_response);
      yield put(getTrashTasksSuccess(data?.message?.task_data));
    } else {
      // toast.error(data?.message?.status_response);
      yield put(getTrashTasksFailed());
    }
  } catch (error) {
    // toast.error("Something went wrong. Please try again.");
    yield put(getTrashTasksFailed());
  }
}

function* getTrashTaskList({ payload }) {
  try {
    const { status, data } = yield call(api.getTrashTaskList, payload);
    if (status === 200 && data && data.message && data.message.status) {
      // toast.success(data?.message?.status_response);
      yield put(getTrashTaskListSuccess(data?.message?.task_list_data));
    } else {
      // toast.error(data?.message?.status_response);
      yield put(getTrashTaskListFailed());
    }
  } catch (error) {
    // toast.error("Something went wrong. Please try again.");
    yield put(getTrashTaskListFailed());
  }
}

function* deleteFromTrash({ payload }) {
  let apiEndpoint;
  switch (payload?.type) {
    case "project":
      apiEndpoint = api.deleteProject;
      break;
    case "milestone":
      apiEndpoint = api.deleteMilestone;
      break;
    case "tasklist":
      apiEndpoint = api.deleteTaskList;
      break;
    case "task":
      apiEndpoint = api.deleteTask;
      break;
    default:
      apiEndpoint = api.deleteProject;
      break;
  }
  let type = payload?.type;
  delete payload.type;
  try {
    const { status, data } = yield call(apiEndpoint, payload);
    if (status === 200 && data && data.message && data.message.status) {
      toast.success(data?.message?.status_response);
      yield put(deleteFromTrashSuccess());
      if (type === "project") {
        yield put(getTrashProjectRequest());
      } else if (type === "milestone") {
        yield put(getTrashMilestoneRequest());
      } else if (type === "task") {
        yield put(getTrashTasksRequest());
      } else if (type === "tasklist") {
        yield put(getTrashTaskListRequest());
      }
    } else {
      toast.error(data?.message?.status_response);
      yield put(deleteFromTrashFailed());
    }
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
    yield put(deleteFromTrashFailed());
  }
}

function* restoreFromTrash({ payload }) {
  let apiEndpoint;
  switch (payload?.type) {
    case "project":
      apiEndpoint = api.restoreProject;
      break;
    case "milestone":
      apiEndpoint = api.restoreMilestone;
      break;
    case "tasklist":
      apiEndpoint = api.restoreTaskList;
      break;
    case "task":
      apiEndpoint = api.restoreTask;
      break;
    default:
      apiEndpoint = api.restoreProject;
      break;
  }
  let type = payload?.type;
  delete payload.type;
  try {
    const { status, data } = yield call(apiEndpoint, payload);

    if (status === 200 && data && data.message && data.message.status) {
      toast.success(data?.message?.status_response);
      yield put(restoreFromTrashSuccess());
      if (type === "project") {
        yield put(getTrashProjectRequest());
      } else if (type === "milestone") {
        yield put(getTrashMilestoneRequest());
      } else if (type === "task") {
        yield put(getTrashTasksRequest());
      } else if (type === "tasklist") {
        yield put(getTrashTaskListRequest());
      }
    } else {
      toast.error(data?.message?.status_response);
      yield put(restoreFromTrashFailed());
    }
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
    yield put(restoreFromTrashFailed());
  }
}

function* projectSaga() {
  yield takeLatest(SET_PROJECT_DETAIL, createProject);
  yield takeLatest(GET_PROJECT_MANAGEMENT_DATA_REQUEST, getProjectData);
  yield takeLatest(ADD_UPDATE_TASKLIST_REQUEST, addAndUpdateTaskListData);
  yield takeLatest(ADD_UPDATE_MILESTONE_REQUEST, addAndUpdateMilestoneData);
  yield takeLatest(GET_USERS_LIST_REQUEST, getUsersList);
  yield takeLatest(ADD_UPDATE_TASK_REQUEST, addAndUpdateTask);
  yield takeLatest(GET_INDIVIDUAL_TASKS_REQUEST, getInidividualTasks);
  yield takeLatest(DEACTIVATE_REQUEST, deactivateRequestHandler);
  yield takeLatest(GET_TRASH_PROJECTS_REQUEST, getTashProjects);
  yield takeLatest(GET_TRASH_MILESTONE_REQUEST, getTashMilestone);
  yield takeLatest(GET_TRASH_TASKS_REQUEST, getTashTasks);
  yield takeLatest(GET_TRASH_TASKS_LIST_REQUEST, getTrashTaskList);
  yield takeLatest(DELETE_FROM_TRASH_REQUEST, deleteFromTrash);
  yield takeLatest(RESTORE_FROM_TRASH_REQUEST, restoreFromTrash);
}

export default projectSaga;
