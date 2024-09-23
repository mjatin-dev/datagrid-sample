import { getInitialName } from "CommonModules/helpers/GetIntialName.helper";
import { getTaskListItemBackgroundColor } from "CommonModules/helpers/tasks.helper";
import TaskStatusBox from "CommonModules/sharedComponents/TaskStatusBox";
import TaskLicense from "CommonModules/sharedComponents/TaskStatusBox/TaskLicense";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskDetailRequest } from "SharedComponents/Dashboard/redux/actions";
import NoResultFound from "../../../CommonModules/sharedComponents/NoResultFound";
import "./style.css";

const DayView = ({ daysData, userDetails, isRedirect }) => {
  const userEmail = useSelector((state) => state.auth.loginInfo.email);
  const dispatch = useDispatch();
  const getSelectTaskDetails = (task) => {
    dispatch(fetchTaskDetailRequest(task.taskId));
  };

  return (
    <div className="detail-main">
      {daysData && daysData.length > 0 ? (
        daysData.map((day) => {
          return (
            <div
              className="row cursor-pointer px-3 py-3 mt-2"
              onClick={() => {
                if (userDetails && userDetails.UserType !== 6) {
                  getSelectTaskDetails(day);
                }
              }}
              style={{
                pointerEvents: `${
                  userDetails && userDetails.UserType === 6 ? "none" : "auto"
                }`,
                backgroundColor: getTaskListItemBackgroundColor(
                  userEmail,
                  day.assignTo,
                  day.approver
                ),
              }}
            >
              <div className="col-12 col-md-8 row">
                <div className="col-12 col-md-2">
                  <TaskLicense text={day?.licenseDisplay} />
                </div>
                <div className="col-12 col-md-7">
                  <h2 className="my-2 my-md-0 detail-content__heading">
                    {day?.subject}
                  </h2>
                </div>
                <div className="col-3 d-none d-md-block">
                  <TaskStatusBox status={day.status} isTaskListItem />
                </div>
              </div>
              <div className="col-12 col-md-4 row">
                <div className="col-7 truncate">
                  <span title={day?.customerName} className="w-100">
                    {day?.customerName}
                  </span>
                </div>
                {day?.assignedToName && (
                  <div className="col-5">
                    <p
                      title={day?.assignedToName}
                      className="mb-0 d-flex align-items-center"
                    >
                      <span className="circle-dp">
                        {day?.assignedToName &&
                          getInitialName(day?.assignedToName)}
                      </span>{" "}
                      <span className="user-name">{day?.assignedToName}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <NoResultFound text="No tasks for today" />
      )}
    </div>
  );
};

export default DayView;
