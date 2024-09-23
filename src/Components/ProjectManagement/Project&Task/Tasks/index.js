import NoResultFound from "CommonModules/sharedComponents/NoResultFound";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackDrop from "../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { DesktopTask, ProjectSubTask } from "../../ProjectDesktop";
import { getIndividualTasksRequest } from "../../redux/actions";
import "./style.css";
const Tasks = ({ searchQuery }) => {
  const [tasksList, setTasksList] = useState([]);
  const isLoading = useSelector(
    (state) => state?.ProjectManagementReducer?.projectManagementData?.isLoading
  );
  const usersList = useSelector(
    (state) => state?.ProjectManagementReducer?.usersList
  );
  const isError = useSelector(
    (state) => state?.ProjectManagementReducer?.projectManagementData?.isError
  );
  const individualTasksList = useSelector(
    (state) =>
      state?.ProjectManagementReducer?.projectManagementData?.individualTasks
  );

  useEffect(() => {
    const _taskList = [
      ...(searchQuery
        ? [...individualTasksList].filter((item) => {
            const _searchQuery = searchQuery?.toLowerCase();

            const assign_to_name = [...(usersList || [])]
              .find((el) => el.value === item.assign_to)
              ?.label?.toLowerCase();
            const task_owner_name = [...(usersList || [])]
              .find((el) => el.value === item.task_owner)
              ?.label?.toLowerCase();
            return (
              item.task_subject?.toLowerCase()?.includes(_searchQuery) ||
              item.assign_to?.toLowerCase()?.includes(_searchQuery) ||
              assign_to_name?.includes(_searchQuery) ||
              item.assigned_by?.toLowerCase()?.includes(_searchQuery) ||
              item.task_owner?.toLowerCase()?.includes(_searchQuery) ||
              task_owner_name?.includes(_searchQuery)
            );
          })
        : individualTasksList),
    ];
    setTasksList([..._taskList]);
  }, [individualTasksList, searchQuery, usersList]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getIndividualTasksRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BackDrop isLoading={isLoading} />
      <div className="project-tasks-list__container mt-md-2 p-0 pl-md-2">
        {!isLoading &&
          !isError &&
          tasksList &&
          tasksList.length > 0 &&
          tasksList.map((task, index) => {
            return (
              <React.Fragment key={`task-${task.task_id || index}-container`}>
                <DesktopTask data={task} />
                <ProjectSubTask data={task} />
              </React.Fragment>
            );
          })}
        {!isLoading && tasksList?.length === 0 && (
          <NoResultFound text={`No Tasks Found`} />
        )}
      </div>
    </>
  );
};

export default Tasks;
