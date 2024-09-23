/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { checkIsInternalTask } from "./string.helpers";
import { checkTaskOwner } from "./tasks.helper";
import moment from "moment";

function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

function useWindowDimensions() {
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
const useGetTaskPermissions = () => {
  const [hasWorkPermissionOnTask, setHasWorkPermissionOnTask] = useState(false);
  const [hasEditPermissionOnTask, setHasEditPermissionOnTask] = useState(false);
  let {
    data: currentOpenedTask,
    isPaymentPlanActive,
    activeLicenses,
  } = useSelector((state) => state?.DashboardState?.taskDetailById);
  const currentActiveLicense =
    activeLicenses &&
    activeLicenses?.find(
      (item) =>
        item?.license === currentOpenedTask?.license &&
        item?.company_id === currentOpenedTask?.customer
    );
  isPaymentPlanActive =
    currentOpenedTask.taskName && currentOpenedTask.license !== "Task"
      ? Boolean(currentActiveLicense)
      : false;
  const currentTaskLicenseSubscriptionEndDate =
    (currentActiveLicense && currentActiveLicense?.subscription_end_date) ||
    null;

  const userDetails = useSelector((state) => state?.auth?.loginInfo || {});
  const userEmail = userDetails?.email;
  const userType = userDetails.UserType;

  useEffect(() => {
    // Check if the task is internal or licenced
    // If it is not internal task then check payment plan and user role in that task
    const workPermission = !checkIsInternalTask(currentOpenedTask)
      ? currentTaskLicenseSubscriptionEndDate &&
        moment(currentOpenedTask.deadlineDate, "YYYY-MM-DD").isSameOrBefore(
          currentTaskLicenseSubscriptionEndDate
        ) &&
        !(currentOpenedTask.cc ? currentOpenedTask.cc === userEmail : false)
      : !(currentOpenedTask.cc ? currentOpenedTask.cc === userEmail : false);
    setHasWorkPermissionOnTask(workPermission);

    setHasEditPermissionOnTask(
      workPermission && checkTaskOwner(currentOpenedTask, userEmail, userType)
    );
  }, [currentOpenedTask, isPaymentPlanActive, activeLicenses]);

  return {
    hasWorkPermissionOnTask,
    hasEditPermissionOnTask,
    isPaymentPlanActive,
    currentTaskLicenseSubscriptionEndDate,
  };
};

const useGetUserRoles = () => {
  const userDetails = useSelector((state) => state?.auth?.loginInfo);
  const userType = userDetails.UserType;
  const isLicenseManager = userDetails.isLicenseManager;
  const isCompanyExists = useSelector(
    (state) => state?.CompanyExistsState?.isCompanyExists
  );
  const isCEApprover = userDetails.isCEApprover;

  const isTaskManagementUser = !isCompanyExists && !isLicenseManager;

  return {
    userType,
    isLicenseManager,
    isCompanyExists,
    isTaskManagementUser,
    userDetails,
    isCEApprover,
  };
};

export {
  useDebounce,
  useWindowDimensions,
  useGetTaskPermissions,
  useGetUserRoles,
};
