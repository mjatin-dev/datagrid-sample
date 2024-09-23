import axiosInstance from "apiServices";
import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import { getTaskStatusMessage } from "CommonModules/helpers/string.helpers";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTaskDetailLogModal } from "SharedComponents/Dashboard/redux/actions";
import useScrollHeight from "SharedComponents/Hooks/useScrollHeight";
import styles from "./styles.module.scss";
const Logs = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const mainContainerRef = useRef();
  const dispatch = useDispatch();
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById?.data
  );
  const h = useScrollHeight(mainContainerRef, 0, [
    activityLogs,
    currentOpenedTask,
    isLoading,
  ]);
  const getActivityLogsData = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.post(
        "compliance.api.getActivityLogs",
        {
          task_name: currentOpenedTask.taskName,
        }
      );

      if (status === 200 && data.message.status) {
        const activity_logs = data.message.activity_logs;
        if (activity_logs && activity_logs.length > 0) {
          setActivityLogs(activity_logs);
          setIsLoading(false);
        } else {
          setActivityLogs([]);
          setIsLoading(false);
        }
      } else {
        setActivityLogs([]);
        setIsLoading(false);
      }
    } catch (error) {
      setActivityLogs([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getActivityLogsData();
  }, []);
  return isLoading ? (
    <Dots />
  ) : (
    <div
      ref={mainContainerRef}
      className={`${styles.fileListContainerGrid} container-fluid h-100 px-0`}
    >
      <div className={styles.fileListColumnContainer}>
        {activityLogs &&
          activityLogs?.length > 0 &&
          activityLogs.slice(0, Math.floor(h / 40)).map((item) => {
            return (
              <LogItem
                onClick={() =>
                  dispatch(
                    setTaskDetailLogModal({
                      isShow: true,
                      data: item,
                    })
                  )
                }
                item={item}
              />
            );
          })}
        {activityLogs.length === 0 && (
          <p className="text-muted">No logs found</p>
        )}
      </div>
      <div
        className={styles.fileListColumnContainer}
        style={{
          maxHeight: h + "px",
          overflowY: "auto",
        }}
      >
        {activityLogs &&
          activityLogs?.length > 0 &&
          activityLogs.slice(Math.floor(h / 40)).map((item) => {
            return (
              <LogItem
                item={item}
                onClick={() =>
                  dispatch(
                    setTaskDetailLogModal({
                      isShow: true,
                      data: item,
                    })
                  )
                }
              />
            );
          })}
      </div>
    </div>
  );
};

export default Logs;

const LogItem = ({ item, onClick = () => {} }) => {
  const displayUser =
    item?.status !== "Assigned" &&
    item?.status !== "Reassigned" &&
    item?.status !== "Unassigned"
      ? item?.user_name
      : item?.assign_name;
  return (
    <div
      onClick={onClick}
      className="container-fluid cursor-pointer"
      style={{ height: "40px" }}
    >
      <div className="row no-gutters align-items-center">
        <div className="col-1">
          <div
            title={item?.added_by}
            className={`${styles.nameInitials} initial-name__container`}
          >
            <span className="initial-name">{getInitialName(displayUser)}</span>
          </div>
        </div>
        <div className="col-7">
          <p className="mb-0 pl-3 holding-list-bold-title truncate">
            {getTaskStatusMessage(item.status, item.owner)}
            &nbsp;
            <strong title={displayUser}>{displayUser}</strong>
          </p>
        </div>

        {item.timestamp && (
          <div className="col-4">
            <p className="days-ago mb-0 pl-3">
              {moment(item.timestamp).format("DD MMM YYYY hh:mm A")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const LogContentModal = () => {
  const data = useSelector(
    (state) => state.DashboardState?.taskDetailById?.modals?.data
  );
  const isShowLogDetails = useSelector(
    (state) => state.DashboardState?.taskDetailById?.modals?.isShowLogDetails
  );
  const displayUser =
    data?.status !== "Assigned" && data?.status !== "Reassigned"
      ? data?.user_name
      : data?.assign_name;
  const dispatch = useDispatch();
  const handleClose = () => dispatch(setTaskDetailLogModal());
  return (
    data && (
      <ProjectManagementModal visible={isShowLogDetails} onClose={handleClose}>
        <div>
          <div className="d-flex align-items-center mb-3">
            <div className={`initial-name__container mr-2`}>
              <span className="initial-name">
                {getInitialName(displayUser)}
              </span>
            </div>
            <p className={`mb-0 ${styles.nameText}`}>{displayUser}</p>
          </div>
          <p className="mb-0 holding-list-bold-title">
            {data.status !== "Assigned" &&
            data.status !== "Reassigned" &&
            data?.status !== "Unassigned" ? (
              <>{`Task ${getTaskStatusMessage(data.status)} by`}</>
            ) : data?.status === "Unassigned" ? (
              <>
                <strong title={data.assign_to}>{data.assign_name}</strong>
                &nbsp;
                {`has been ${data.status} from ${
                  data.owner === "unassign"
                    ? "Assignee"
                    : data.owner === "unassign_approver"
                    ? "Approver"
                    : data.owner === "unassign_cc"
                    ? "CC"
                    : ""
                } by`}
              </>
            ) : (
              <>
                <strong title={data.assign_to}>{data.assign_name}</strong>
                &nbsp;
                {`has been ${data.status} as ${
                  data.owner === "assign_to"
                    ? "Team Member"
                    : data.owner === "approver"
                    ? "Approver"
                    : data.owner === "cc"
                    ? "CC"
                    : ""
                } by`}
              </>
            )}
            &nbsp;
            <strong title={data.user}>{data.user_name}</strong>
            &nbsp; on&nbsp;
            {moment(data.timestamp).format("DD MMM YYYY hh:mm A")}
          </p>
        </div>
      </ProjectManagementModal>
    )
  );
};
