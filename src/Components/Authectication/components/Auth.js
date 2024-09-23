import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";
import { isShowOtherComplianceModule } from "app.config";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const Auth = () => {
  const history = useHistory();
  const {
    isLicenseManager,
    userType,
    isTaskManagementUser,
    isCEApprover,
    userDetails: authInfo,
  } = useGetUserRoles();
  const email = authInfo?.email || authInfo?.EmailID;
  const isMobileVerified = authInfo?.mobileVerified || 0;
  const isSignupDone = authInfo?.signup_done;
  useEffect(() => {
    const { pathname } = history.location;
    if (!(email && isMobileVerified && isSignupDone && userType)) {
      if (pathname.includes("sign-up")) {
        history.replace("/sign-up");
      } else if (!pathname.includes("login")) {
        history.replace("/login");
      }
    } else {
      if (pathname.includes("login") || pathname.includes("sign-up")) {
        if (userType === 3) history.push("/dashboard-view");
        else history.push("/dashboard");
      }
    }
    if (
      email &&
      window.location.href.match(/events$/) &&
      !isLicenseManager &&
      !isCEApprover
    ) {
      history.replace("/dashboard-view");
    } else if (
      email &&
      window.location.href.match(/other-compliance/) &&
      (userType !== 3 || isTaskManagementUser || !isShowOtherComplianceModule)
    ) {
      history.replace("/dashboard-view");
    }
  }, []);
  return <></>;
};

export const getUserType = (roles) => {
  let userType = 0;
  const isLicenseManager = Boolean(
    [...(roles || [])].find((item) => item.User_type_no === 20)
  );
  const isCEApprover = Boolean(
    [...(roles || [])].find((item) => item.User_type_no === 17)
  );
  if (roles?.length > 0) {
    let _rolesList = [...(roles || [])];
    if (isLicenseManager) {
      _rolesList = _rolesList.filter((item) => item.User_type_no !== 20);
    }
    _rolesList = _rolesList
      ?.filter((item) => !item.is_audit && item.hierarchy > 0)
      ?.map((item) => item.hierarchy)
      .sort((a, b) => a - b);
    const highestPriority = _rolesList[0];
    const UserRole = roles.filter(
      (value) => value.hierarchy === highestPriority
    );

    userType = UserRole[0]?.User_type_no || 4;
  }

  return { userType, isLicenseManager, isCEApprover };
};

export const getAuditRole = (roles) => {
  let userType = 0;
  if (roles?.length > 0) {
    let highestPriority = roles
      .filter((item) => {
        if (item.is_audit || item.User_type_no === 3) {
          return item;
        } else {
          return false;
        }
      })
      .map((item) => item?.hierarchy)
      .sort((a, b) => a - b)[0];

    const UserRole = roles.filter(
      (value) => value?.hierarchy === highestPriority
    );
    userType = UserRole[0]?.User_type_no;
  }

  return userType;
};

export default Auth;
