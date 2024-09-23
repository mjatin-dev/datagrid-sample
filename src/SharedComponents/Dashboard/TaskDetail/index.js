import React from "react";
import TaskData from "./TaskData";
import styles from "./styles.module.scss";
import NewTaskModel from "Components/ProjectManagement/components/AddNewTask/TaskModel";
import { useDispatch, useSelector } from "react-redux";
import { clearTaskModalState } from "Components/ProjectManagement/redux/actions";
const TaskDetail = () => {
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );
  const dispatch = useDispatch();
  return (
    <>
      <NewTaskModel
        showTask={modalsStatus?.taskModal?.isVisible}
        onClose={() => dispatch(clearTaskModalState())}
        isEdit={modalsStatus?.taskModal?.isEdit}
        editData={modalsStatus?.taskModal?.editData}
      />
      <div className={`d-flex w-100 ${styles.taskDetailContainer}`}>
        <TaskData />
      </div>
    </>
  );
};

export default TaskDetail;
