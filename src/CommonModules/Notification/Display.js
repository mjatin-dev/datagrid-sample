// import { onMessageListener } from "firebaseConfig/firebaseInit";
import { ToastContainer, toast } from "react-toastify";
import styles from "./styles.module.scss";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "Components/OnBoarding/SubModules/DashBoardCO/MenuRedux/actions";
import {
  fetchDashboardAnalyticsRequest,
  fetchDashboardTeamAnalyticsRequest,
  fetchTaskDetailRequest,
} from "SharedComponents/Dashboard/redux/actions";
import { useEffect } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
const DisplayNotification = () => {
  const messaging = getMessaging();
  onMessage(messaging, (payload) => {
    const data = payload.notification;
    const { type, id, sub_type } = payload.data;
    toast.info(
      <CustomNotificaitonToast
        title={data.title}
        body={data.body}
        type={type}
        sub_type={sub_type}
        id={id}
      />,
      {
        toastId: payload.messageId,
      }
    );
  });

  return (
    <ToastContainer
      autoClose={5000}
      closeOnClick={false}
      draggable={false}
      hideProgressBar={true}
    />
  );
};

export default DisplayNotification;

const CustomNotificaitonToast = ({ title, body, type, id, sub_type }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const analyticsData = useSelector(
    (state) => state.DashboardState?.dashboardAnalytics?.analyticsData
  );

  useEffect(() => {
    if (type === "Task") {
      if (sub_type === "Reassigned" || sub_type === "Assigned") {
        dispatch(fetchDashboardAnalyticsRequest());
        dispatch(fetchDashboardTeamAnalyticsRequest());
      }
    }
  }, [type, sub_type]);

  const redirection = (type) => {
    if (type === "BulkTask") {
      dispatch(actions.setCurrentMenu("notifications"));
      history.push("/notifications");
    } else if (type === "Task") {
      dispatch(actions.setCurrentMenu("dashboard"));
      dispatch(fetchTaskDetailRequest(id));
      history.push("/dashboard-view");
    } else if (type === "Circular") {
      dispatch(actions.setCurrentMenu("updates"));
      history.push("/updates", {
        circular_id: id,
      });
    } else if (type === "OverDueTask") {
      if (
        analyticsData?.riskDelay &&
        Object.keys(analyticsData?.riskDelay)?.length > 0
      ) {
        dispatch(actions.setCurrentMenu("dashboard"));
        history.push("/dashboard-view");
        dispatch(
          actions.setTakeActionTab({
            filter: "riskDelay",
            key: "all",
            data: analyticsData?.riskDelay,
          })
        );
      }
    } else if (type === "TodayDue") {
      if (
        analyticsData?.today &&
        Object.keys(analyticsData?.today)?.length > 0
      ) {
        dispatch(actions.setCurrentMenu("dashboard"));
        history.push("/dashboard-view");
        dispatch(
          actions.setTakeActionTab({
            filter: "today",
            key: "all",
            data: analyticsData?.today,
          })
        );
      }
    } else if (type === "Next6DaysDue") {
      if (
        analyticsData?.next6Days &&
        Object?.keys(analyticsData?.next6Days).length > 0
      ) {
        dispatch(actions.setCurrentMenu("dashboard"));
        history.push("/dashboard-view");
        dispatch(
          actions.setTakeActionTab({
            filter: "next6Days",
            key: "all",
            data: analyticsData?.next6Days,
          })
        );
      }
    }
  };
  return (
    <div onClick={() => redirection(type)}>
      <h6>{title}</h6>
      <p className={`${styles.notificationText}`}>{body}</p>
    </div>
  );
};
