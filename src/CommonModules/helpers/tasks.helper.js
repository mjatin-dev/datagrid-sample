/* eslint-disable array-callback-return */
import moment from "moment";
import { taskListItemBackgroundColors } from "SharedComponents/Constants";
import { checkIsInternalTask, isNotEmpty } from "./string.helpers";
import { filterObjkey } from "CommonModules/sharedComponents/constants/constant";
import CustomStore from "devextreme/data/custom_store";
import apis from "SharedComponents/Dashboard/apis";
const sortByDate = (data) =>
  data.sort((a, b) => {
    if (a.due_date && b.due_date) {
      return (
        new Date(a.due_date || a.deadline_date) -
        new Date(b.due_date || b.deadline_date)
      );
    }
    return false;
  });
// Get Data by Company
const getDataByCompany = (data) => {
  try {
    const temp = [...data];
    return temp.map((data) => {
      let tasks = [];
      const licenseAndTaskList = [...data.licenseAndTaskList];

      licenseAndTaskList.forEach((item) => {
        tasks = [...tasks, ...item.taskList];
      });
      return {
        status: data.companyName,
        company_name: data.companyName,
        company_id: data.company_id,
        tasks: sortByDate([...new Set(tasks)]),
      };
    });
  } catch (err) {
    console.log(err.message);
  }
};
const getAllTasks = (task_details) => {
  let tasks = [];
  [...task_details].forEach((data) => {
    const licenseAndTaskList = [...data.licenseAndTaskList];
    licenseAndTaskList.forEach((item) => {
      tasks = [...tasks, ...item.taskList];
    });
  });
  tasks = [...tasks].map((task) => {
    const deadline_date = task.deadline_date || task.due_date;
    const userType = localStorage.getItem("userType");

    if (
      task.status === "Approval Pending" &&
      new Date(deadline_date) < new Date() &&
      userType === "4" &&
      task.customer_name !== "Internal Task"
    ) {
      return { ...task, status: "Approved" };
    }
    return task;
  });
  return sortByDate(tasks);
};
// get Data by Status
const getDataByStatus = (task_details) => {
  let tasks = getAllTasks(task_details);
  const userType = localStorage.getItem("userType");
  const getDataByStatus = [];
  const status = ["Overdue", "Take Action", "Upcoming", "Completed"];
  status.forEach((filter) => {
    let tasksByStatus = [];
    const todayDate = moment(new Date(), "YYYY-MM-DD");
    switch (filter) {
      case "Overdue":
        tasksByStatus = [...tasks].filter((task) => {
          const task_deadline_date = task?.deadline_date || task?.due_date;
          if (task.status !== "Approved") {
            if (
              !(
                new Date(task_deadline_date) < new Date() &&
                task.status === "Approval Pending" &&
                userType === "4"
              )
            ) {
              const taskDueDate = moment(
                task.due_date || task.deadline_date,
                "YYYY-MM-DD"
              );
              const diffrenceInDays = taskDueDate.diff(todayDate, "days");
              if (diffrenceInDays < 0) {
                return task;
              }
            }
          }
        });
        break;
      case "Upcoming":
        tasksByStatus = [...tasks].filter((task) => {
          const task_deadline_date = task?.deadline_date || task?.due_date;
          if (task.status !== "Approved") {
            if (
              !(
                new Date(task_deadline_date) < new Date() &&
                task.status === "Approval Pending" &&
                userType === "4"
              )
            ) {
              const taskDueDate = moment(
                task.due_date || task.deadline_date,
                "YYYY-MM-DD"
              );
              const diffrenceInDays = taskDueDate.diff(todayDate, "days");
              if (diffrenceInDays > 0 && diffrenceInDays >= 7) {
                return task;
              }
            }
          }
        });
        break;
      case "Take Action":
        tasksByStatus = [...tasks].filter((task) => {
          const due_date = task?.due_date || task?.deadline_date;
          const taskDueDate = moment(due_date, "YYYY-MM-DD");
          const diffrenceInDays = taskDueDate.diff(todayDate, "days");
          if (task.status !== "Approved") {
            if (
              !(
                diffrenceInDays < 0 &&
                task.status === "Approval Pending" &&
                userType === "4"
              )
            ) {
              if (diffrenceInDays >= 0 && diffrenceInDays <= 7) {
                return task;
              }
            }
          }
        });
        break;
      case "Completed":
        tasksByStatus = [...tasks].filter((task) => {
          const due_date = task.deadline_date || task.due_date;
          const taskDueDate = moment(due_date, "YYYY-MM-DD");
          const diffrenceInDays = taskDueDate.diff(todayDate, "days");
          if (task.status === "Approved") {
            return task;
          }
          if (
            task.status === "Approval Pending" &&
            diffrenceInDays < 0 &&
            userType === "4"
          ) {
            return task;
          }
        });
        break;
      default:
        return;
    }
    getDataByStatus.push({
      status: filter,
      tasks: sortByDate(tasksByStatus),
    });
  });
  return getDataByStatus.filter((item) => item.tasks.length > 0);
};

// Get Data by licenses
const getDataByLicenses = (task_details) => {
  const dataByLicense = [];
  const tasks = getAllTasks(task_details);
  const licenses = [...new Set([...tasks].map((item) => item.license))];
  licenses.forEach((license) => {
    dataByLicense.push({
      status: license,
      license,
      tasks: sortByDate([...tasks].filter((item) => item.license === license)),
    });
  });
  return dataByLicense;
};

const getDataByTeam = (task_details) => {
  const dataByTeam = [];
  const tasks = getAllTasks(task_details);
  const teamMembers = [
    ...new Set([...tasks].map((item) => item.assign_to_name)),
  ];
  teamMembers.forEach((team) => {
    dataByTeam.push({
      status: team,
      assign_to_name: team,
      tasks: [...tasks].filter((item) => item.assign_to_name === team),
    });
  });
  return sortByDate(
    dataByTeam.map((item) => {
      if (item.assign_to_name === null && item.status === null) {
        item.status = "Not Assigned";
      }
      return item;
    })
  );
};

const getUserListByUserType = (userList, userType) => {
  return [...userList].filter((element) => {
    if (element.user_type.length > 0) {
      const isTeamMember =
        userType === 5
          ? element.user_type.find(
              (type) =>
                type.user_type_no === userType || type.user_type_no === 3
            )
          : true;
      return isTeamMember && element;
    }
    return null;
  });
};

export const getTaskListItemBackgroundColor = (userEmail, assignTo) => {
  return assignTo === userEmail
    ? taskListItemBackgroundColors.taskIncoming
    : assignTo
    ? taskListItemBackgroundColors.taskOutgoing
    : taskListItemBackgroundColors.taskNotAssigned;
};

const getAnalyticsFilterByDate = (date, time = "") => {
  const validationDateFormat = "YYYY-MM-DD";
  const end_date = date;

  const today = moment().format(validationDateFormat);
  const next_6_day_date = moment().add(7, "days").format(validationDateFormat);
  const next_8_day_date = moment().add(8, "days").format(validationDateFormat);
  const next_30_day_date = moment()
    .add(30, "days")
    .format(validationDateFormat);
  if (moment(end_date).isBefore(today)) {
    return "riskDelay";
  } else if (moment(today).isSame(end_date)) {
    return "today";
  } else if (
    moment(today).isBefore(end_date) &&
    moment(next_6_day_date).isSameOrAfter(end_date)
  ) {
    return "next6Days";
  } else if (
    moment(next_8_day_date).isSameOrBefore(end_date) &&
    moment(next_30_day_date).isSameOrAfter(end_date)
  ) {
    return "next8To30Days";
  } else if (moment(next_30_day_date).isBefore(end_date)) {
    return "beyond30Days";
  } else {
    return "All";
  }
};

const checkTaskOwner = (currentOpenedTask, userEmail, userType = 4) => {
  return (
    currentOpenedTask &&
    (userType === 4
      ? currentOpenedTask.status !== "Approval Pending" &&
        currentOpenedTask?.status !== "Approved"
      : currentOpenedTask.status !== "Approved") &&
    (currentOpenedTask.customerName === "Internal Task"
      ? currentOpenedTask?.taskOwner === userEmail
      : userType === 3)
  );
};

const checkIsAssignToMeDisabled = (
  role,
  userEmail,
  assign_to,
  approver,
  cc
) => {
  let isDisabled = false;
  switch (role) {
    case "assign_to":
      isDisabled =
        (approver && approver === userEmail) || (cc && cc === userEmail);
      break;
    case "approver":
      isDisabled =
        (assign_to && assign_to === userEmail) || (cc && cc === userEmail);
      break;
    case "cc":
      isDisabled =
        (approver && approver === userEmail) ||
        (assign_to && assign_to === userEmail);
      break;
    default:
      isDisabled = false;
      break;
  }
  return isDisabled;
};

const filterUsersListFor = (
  role,
  usersList,
  assign_to,
  approver,
  cc,
  userEmail = "",
  currentOpenedTask = null,
  isEdit = false
) => {
  let filteredUsers = [];
  const isNewTask = !isEdit;
  switch (role) {
    case "assign_to":
      filteredUsers = [...(usersList || [])].filter((item) => {
        const isExistsInApprover =
          approver &&
          [...(typeof approver === "string" ? [approver] : approver)].find(
            (user) => (user?.value || user) === (item?.value || item.email)
          );
        const isExistsInCC =
          cc &&
          [...(typeof cc === "string" ? [cc] : cc)].find(
            (user) => (user?.value || user) === (item?.value || item?.email)
          );
        return !isExistsInApprover && !isExistsInCC;
      });
      break;
    case "approver":
      filteredUsers = [...(usersList || [])].filter((item) => {
        const isExistsInAssignTo =
          assign_to &&
          [...(typeof assign_to === "string" ? [assign_to] : assign_to)].find(
            (user) => (user?.value || user) === (item?.value || item?.email)
          );
        const isExistsInCC =
          cc &&
          [...(typeof cc === "string" ? [cc] : cc)].find(
            (user) => (user?.value || user) === (item?.value || item?.email)
          );
        return !isExistsInAssignTo && !isExistsInCC;
      });
      break;
    case "cc":
      filteredUsers = [...(usersList || [])].filter((item) => {
        const isExistsInAssignTo =
          assign_to &&
          [...(typeof assign_to === "string" ? [assign_to] : assign_to)].find(
            (user) => (user?.value || user) === (item?.value || item?.email)
          );
        const isExistsInApprover =
          approver &&
          [...(typeof approver === "string" ? [approver] : approver)].find(
            (user) => (user?.value || user) === (item?.value || item?.email)
          );

        const isTaskOwnerOrComplianceOfficer = isNewTask
          ? userEmail && userEmail === (item?.value || item.email)
          : currentOpenedTask?.customer === "Internal Task"
          ? currentOpenedTask?.taskOwner === (item?.value || item?.email)
          : item?.user_type?.find((type) => type?.user_type_no === 3);
        return (
          !isExistsInAssignTo &&
          !isExistsInApprover &&
          !isTaskOwnerOrComplianceOfficer
        );
      });
      break;
    default:
      return [];
  }
  return filteredUsers;
};

export const CheckBulkApprovalPending = (currentOpenedTask, userDetails) => {
  return Boolean(
    currentOpenedTask &&
      currentOpenedTask.status === "Approval Pending" &&
      (currentOpenedTask.customerName === "Internal Task"
        ? userDetails.email === currentOpenedTask.approver ||
          userDetails.email === currentOpenedTask.taskOwner
        : userDetails.UserType === 3 ||
          userDetails.email === currentOpenedTask.approver) &&
      currentOpenedTask &&
      (currentOpenedTask.cc ? currentOpenedTask.cc !== userDetails.email : true)
  );
};
export const bulkMarkCompleteValidate = (
  currentOpenedTask,
  userDetails,
  currentTaskLicenseSubscriptionEndDate
) => {
  if (
    userDetails.UserType !== 3 &&
    userDetails.email === currentOpenedTask?.cc
  ) {
    return false;
  }

  let daedlineDate =
    currentOpenedTask?.deadlineDate || currentOpenedTask?.dueDate;

  return currentOpenedTask &&
    (currentOpenedTask?.status === "Assigned" ||
      currentOpenedTask?.status === "Not Assigned" ||
      currentOpenedTask?.status === "Rejected") &&
    (currentOpenedTask?.license !== "Task"
      ? currentTaskLicenseSubscriptionEndDate &&
        moment(daedlineDate, "YYYY-MM-DD").isSameOrBefore(
          currentTaskLicenseSubscriptionEndDate
        )
      : true) &&
    (currentOpenedTask.customerName === "Internal Task"
      ? userDetails.email === currentOpenedTask.approver ||
        userDetails.email === currentOpenedTask.taskOwner ||
        currentOpenedTask.assignTo === userDetails.email
      : userDetails.UserType === 3 ||
        userDetails.email === currentOpenedTask.approver ||
        userDetails.UserType === 4 ||
        userDetails.UserType === 5) &&
    (currentOpenedTask.cc ? currentOpenedTask.cc !== userDetails.email : true)
    ? true
    : false;
};

const checkBulkApprover = (
  activeLicenses,
  currentOpenedTask,
  userDetails,
  assign_user
) => {
  const selectedUser = assign_user?.email || assign_user;
  const assign_to = currentOpenedTask?.assignTo;
  const cc = currentOpenedTask?.cc;
  const approver = currentOpenedTask?.approver;

  if (approver === selectedUser) {
    return false;
  }
  const isExistsInAssignTo =
    assign_to &&
    Boolean(
      [...(typeof assign_to === "string" ? [assign_to] : assign_to)].find(
        (user) => (user?.value || user) === selectedUser
      )
    );
  const isExistsInCC =
    cc &&
    Boolean(
      [...(typeof cc === "string" ? [cc] : cc)].find(
        (user) => (user?.value || user) === selectedUser
      )
    );

  return !isExistsInAssignTo && !isExistsInCC;
};
const checkBulkActionAssginCC = (
  currentOpenedTask,
  userDetails,
  assign_user
) => {
  let selectedUser = assign_user?.email || assign_user;
  let approver = currentOpenedTask?.approver;
  let assign_to = currentOpenedTask?.assignTo;
  if (selectedUser === approver || selectedUser === assign_to) {
    return false;
  }

  const isExistsInAssignTo = Boolean(
    assign_to &&
      [...(typeof assign_to === "string" ? [assign_to] : assign_to)].find(
        (user) => (user?.value || user) === selectedUser
      )
  );
  const isExistsInApprover = Boolean(
    approver &&
      [...(typeof approver === "string" ? [approver] : approver)].find(
        (user) => (user?.value || user) === selectedUser
      )
  );
  const isTaskOwnerOrComplianceOfficer =
    currentOpenedTask?.customerName === "Internal Task"
      ? currentOpenedTask?.taskOwner === selectedUser
      : assign_user?.user_type?.find((type) => type?.user_type_no === 3);

  return (
    !isExistsInAssignTo &&
    !isExistsInApprover &&
    !isTaskOwnerOrComplianceOfficer
  );
};

export const CheckWorkPermission = (
  activeLicenses,
  currentOpenedTask,
  userDetails,
  verify_type = false,
  assign_user = {}
) => {
  // Licence Task CO cannot be in CC
  // Internal Task Task owner cannot be in CC
  // For Testing internal Task task.customer === "Internal Task" || task.customerName === "Internal Task"
  if (verify_type === 1) {
    let checkAssign = checkBulkActionAssginCC(
      currentOpenedTask,
      userDetails,
      assign_user
    );
    if (!checkAssign) {
      return {
        workPermission: false,
        editPermission: false,
        isPaymentPlanActive: false,
      };
    }
  }

  // checkBulkApprover
  if (verify_type === 2) {
    let checkApprover = checkBulkApprover(
      activeLicenses,
      currentOpenedTask,
      userDetails,
      assign_user
    );
    if (!checkApprover) {
      return {
        workPermission: false,
        editPermission: false,
        isPaymentPlanActive: false,
      };
    }
  }

  // assignee
  if (verify_type === 3) {
    let uEmail = assign_user?.email || assign_user;
    if (
      currentOpenedTask.assignTo === uEmail ||
      currentOpenedTask.approver === uEmail ||
      currentOpenedTask.cc === uEmail
    ) {
      return {
        workPermission: false,
        editPermission: false,
        isPaymentPlanActive: false,
      };
    }
  }

  const currentActiveLicense =
    activeLicenses &&
    activeLicenses?.find(
      (item) =>
        item?.license === currentOpenedTask?.license &&
        item?.company_id === currentOpenedTask?.customer
    );
  let isPaymentPlanActive =
    currentOpenedTask.subject && currentOpenedTask.license !== "Task"
      ? Boolean(currentActiveLicense)
      : true;
  const currentTaskLicenseSubscriptionEndDate =
    (currentActiveLicense && currentActiveLicense?.subscription_end_date) ||
    null;
  const userEmail = userDetails?.email;
  const userType = userDetails.UserType;
  //  Edit Date
  let deadLineData =
    currentOpenedTask?.deadlineDate || currentOpenedTask?.dueDate;
  const workPermission = !checkIsInternalTask(currentOpenedTask)
    ? currentTaskLicenseSubscriptionEndDate &&
      moment(deadLineData, "YYYY-MM-DD").isSameOrBefore(
        currentTaskLicenseSubscriptionEndDate
      ) &&
      !(currentOpenedTask.cc ? currentOpenedTask.cc === userEmail : false)
    : !(currentOpenedTask.cc ? currentOpenedTask.cc === userEmail : false);
  const editPermission =
    workPermission && checkTaskOwner(currentOpenedTask, userEmail, userType);

  return {
    workPermission: workPermission,
    editPermission: editPermission,
    isPaymentPlanActive: isPaymentPlanActive,
  };
};

export const extractFiltersFromLoadOptions = (
  filtersData = [],
  individual_filter_list,
  sendObj,
  isNotIncluded = false
) => {
  if (filtersData === "and") isNotIncluded = false;
  if (filtersData[1] === "=" || filtersData[1] === "<>") {
    individual_filter_list[filtersData[0]]?.push(filtersData[2]);
    if (filtersData[1] === "<>" || isNotIncluded)
      individual_filter_list[
        "is_not_included_" + filterObjkey[filtersData[0]]
      ] = true;
  } else if (filtersData[1] === "contains") {
    sendObj.inside_filter_search = [
      { selector: filterObjkey[filtersData[0]], contain: filtersData[2] },
    ];
  } else {
    filtersData.forEach((lp) => {
      if (!isNotIncluded) isNotIncluded = lp === "!";
      if (Array.isArray(lp)) {
        extractFiltersFromLoadOptions(
          lp,
          individual_filter_list,
          sendObj,
          isNotIncluded
        );
      }
    });
  }
};

const createCustomDataGridStore = (
  takeActionActiveTab,
  skipReff,
  setTblCount,
  teamPerformanceUser = null,
  searchQuery = ""
) => {
  return new CustomStore({
    key: "taskId",
    load: async (loadOptions) => {
      let is_exporting =
        loadOptions?.isLoadingAll || !loadOptions?.take ? true : false;
      let sendObj = {
        key: teamPerformanceUser
          ? teamPerformanceUser?.user_id
          : takeActionActiveTab?.key,
        filter: teamPerformanceUser
          ? "Team"
          : takeActionActiveTab?.filter === "completedTask"
          ? "completed"
          : takeActionActiveTab.filter,
        search: searchQuery || "",
        search_filter: {
          subject: "",
          license: "",
          assign_to: "",
          company: "",
          due_date: "",
          status: "",
          frequency: "",
          riskRating: "",
          deadline_date: "",
        },
        inside_filter_search: [],
        get_all: is_exporting ? 1 : 0,
      };

      let is_filter_listing = false;
      let individual_filter_list = {
        subject: [],
        licenseDisplay: [],
        assignedToName: [],
        customerName: [],
        due_date: [],
        status: [],
        frequency: [],
        riskRating: [],
        deadline_date: [],
      };
      [
        "skip",
        "take",
        // "requireTotalCount",
        "requireGroupCount",
        "sort",
        "filter",
        "totalSummary",
        "group",
        "groupSummary",
      ].forEach((i) => {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          if (i === "filter") {
            extractFiltersFromLoadOptions(
              loadOptions[i],
              individual_filter_list,
              sendObj
            );
          } else if (
            i === "sort" &&
            loadOptions[i] &&
            loadOptions[i].length > 0
          ) {
            sendObj[i] = [...loadOptions[i]].map((item) => ({
              ...item,
              selector: filterObjkey[item?.selector],
            }));
          } else {
            sendObj[i] = loadOptions[i];
            if (i === "group" && isNotEmpty(loadOptions[i])) {
              let gpArray = [];
              loadOptions[i].forEach((Gitm) => {
                let obj = {
                  ...Gitm,
                  selector: filterObjkey[Gitm.selector],
                };
                gpArray?.push(obj);
              });
              sendObj[i] = gpArray;
              is_filter_listing = true;
            }
          }
        }
      });
      if (is_filter_listing) {
        // sendObj.take = lopadOptoi;
        sendObj.get_all = 1;
      }
      if (skipReff.current === 1) {
        sendObj.skip = 0;
        skipReff.current = 0;
      } else {
        sendObj.skip = loadOptions.skip;
      }
      Object.keys(individual_filter_list).map((item) => {
        if (
          !individual_filter_list[item] ||
          individual_filter_list[item]?.length === 0
        ) {
          return false;
        }
        if (typeof individual_filter_list[item] === "object") {
          if (
            filterObjkey[item] === "due_date" ||
            filterObjkey[item] === "deadline_date"
          ) {
            let ddArr =
              individual_filter_list[item]?.length < 2
                ? moment(individual_filter_list[item][0]).format("YYYY-MM-DD")
                : individual_filter_list[item]
                    .map((DD) => moment(DD).format("YYYY-MM-DD"))
                    .join("~>");
            sendObj.search_filter[filterObjkey[item]] = ddArr;
          } else {
            sendObj.search_filter[filterObjkey[item]] =
              individual_filter_list[item].join("~>");
          }
        } else {
          sendObj.search_filter[item] = individual_filter_list[item];
        }
      });
      let resultObj = {
        data: [],
        totalCount: 0,
        summary: 0,
        groupCount: 0,
      };
      let resultResponse = await apis.getDevExDataListing(sendObj);
      if (is_filter_listing) {
        let FilterObj = [];
        resultResponse?.data?.data?.task_filter_options.forEach((item) => {
          // if (item) {
          FilterObj?.push({ count: 0, items: null, key: item || "blank" });
          // }
        });
        const groupingData = [...FilterObj].slice(
          loadOptions.skip,
          FilterObj.length - loadOptions.skip > loadOptions.take
            ? loadOptions.take + loadOptions.skip
            : FilterObj.length
        );
        resultObj.totalCount = FilterObj.length;
        resultObj.data = groupingData;
        return resultObj;
      }
      resultObj.data = resultResponse?.data?.data?.tasks || [];
      resultObj.totalCount = resultResponse?.data?.data?.count || 0;
      setTblCount(resultObj.totalCount);
      return resultObj;
    },
  });
};

export {
  getDataByStatus,
  getDataByLicenses,
  getDataByCompany,
  getDataByTeam,
  getAllTasks,
  getUserListByUserType,
  getAnalyticsFilterByDate,
  checkTaskOwner,
  filterUsersListFor,
  checkIsAssignToMeDisabled,
  createCustomDataGridStore,
};
