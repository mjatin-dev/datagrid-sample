import React, { useCallback, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import backgroundImage from "../../assets/Images/Onboarding/co-bg.png";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setProjectModalState,
  setTaskModalState,
} from "Components/ProjectManagement/redux/actions";
import { isShowProjectModule } from "app.config";
import { MdAdd } from "react-icons/md";
const Container = ({
  children,
  variant = "main" || "container" || "content",
  className,
  isShowAddTaskButton = false,
  ...rest
}) => {
  const [isSpeedDialMenuOpen, setIsSpeedDialMenuOpen] = useState(false);
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );
  const currentDashboardTab = useSelector(
    (state) => state?.DashboardState.currentDashboardTab
  );
  const currentAdminMenu = useSelector(
    (state) => state?.adminMenu?.currentMenu
  );
  const dispatch = useDispatch();
  const addTaskHandler = useCallback(
    (flag) =>
      dispatch(
        setTaskModalState({
          ...modalsStatus?.taskModal,
          isVisible: flag,
        })
      ),
    [modalsStatus.taskModal, isShowAddTaskButton]
  );

  const addProjectHandler = useCallback(
    (flag) =>
      dispatch(
        setProjectModalState({
          ...modalsStatus?.projectModal,
          isVisible: flag,
        })
      ),
    [modalsStatus.projectModal]
  );

  const speedDialActions = useMemo(
    () => [
      ...(isShowProjectModule
        ? [
            {
              icon: <MdAdd />,
              name: "Add Project",
              onClick: () => addProjectHandler(true),
            },
          ]
        : []),
      {
        icon: <MdAdd />,
        name: "Add Task",
        onClick: () => addTaskHandler(true),
      },
    ],
    [addTaskHandler, addProjectHandler]
  );
  return (
    <div
      className={`${styles[variant]} ${className || ""} ${
        variant === "content" ? "position-relative" : ""
      }`}
      {...rest}
    >
      {variant === "main" && (
        <img
          src={backgroundImage}
          alt="background-csutra"
          className={`${styles.backgroundImage} d-none d-md-block`}
        />
      )}
      {children}
      {variant === "content" &&
        isShowAddTaskButton &&
        (currentAdminMenu === "dashboard"
          ? currentDashboardTab === "Tasks"
          : true) &&
        (isShowProjectModule ? (
          <SpeedDial
            ariaLabel="Add"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
            open={isSpeedDialMenuOpen}
            onClose={() => setIsSpeedDialMenuOpen(false)}
            onOpen={() => setIsSpeedDialMenuOpen(true)}
          >
            {speedDialActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={action.onClick}
              />
            ))}
          </SpeedDial>
        ) : (
          <SpeedDial
            ariaLabel="Add"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
            open={isSpeedDialMenuOpen}
            title="Add Task"
            onClick={() => addTaskHandler(true)}
            // onClose={() => setIsSpeedDialMenuOpen(false)}
            // onOpen={() => setIsSpeedDialMenuOpen(true)}
          ></SpeedDial>
        ))}
    </div>
  );
};

export default Container;
