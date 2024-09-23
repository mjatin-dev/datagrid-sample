import escape from "validator/lib/escape";
export const getSubstring = (str, n = 15) => {
  if (str) {
    return str?.length > n ? str?.substring(0, n) + "..." : str;
  }
  return "";
};

export const sanitizeInput = (string) =>
  escape(string)?.replace(/\s+/g, " ") || "";
export const removeWhiteSpaces = (string) => string?.replace(/\s+/g, " ");
export const removeOnlySpaces = (str) =>
  str && str?.length > 0 ? str?.trim() : "";

export const splitCamelCaseString = (string) =>
  string?.replace(/([a-z])([A-Z])/g, "$1 $2") || string;
export const checkIsInternalTask = (task) => {
  return (
    task.customer === "Internal Task" ||
    task.customerName === "Internal Task" ||
    task.status === "Approved"
  );
};
export const isTaskOwner = (userDetail, currentOpenedTask) => {
  return userDetail.email === currentOpenedTask.taskOwner;
};
export const getTaskStatusMessage = (status, owner = "") => {
  return status === "Approval Pending"
    ? "Mark Completed"
    : status === "Completed"
    ? "Approved"
    : status === "Unassigned" && owner
    ? "Unassigned from"
    : status === "Assigned" && owner
    ? owner === "assign_to"
      ? "Assigned to"
      : owner === "approver"
      ? "Approver"
      : owner === "cc"
      ? "CC"
      : status
    : status === "Reassigned" && owner
    ? owner === "assign_to"
      ? "Reassigned to"
      : owner === "approver"
      ? "Approver reassigned to"
      : owner === "cc"
      ? "CC reassigned to"
      : status
    : status;
};
export const getHighlightedTextBySearchQuery = (searchQuery, value = "") => {
  const regex = (searchQuery && new RegExp(`(${searchQuery})`, "gi")) || "";
  const parts =
    (searchQuery &&
      regex &&
      value?.split(regex)?.map((item) => {
        if (item.toLowerCase() === searchQuery?.toLowerCase()) {
          return (
            <span
              style={{
                fontWeight: "bold",
                color: "black",
                opacity: 1,
                background: "yellow",
              }}
            >
              {item}
            </span>
          );
        }
        return item;
      })) ||
    value;
  return parts;
};
export const isNotEmpty = (value) => {
  return value !== undefined && value !== null && value !== "";
};
export const teamMembersSearch = (usersList, searchQuery) => {
  return searchQuery
    ? usersList.filter((field) => {
        return (
          field?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          field?.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          field?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          field?.mobileNumber?.includes(searchQuery.toLowerCase())
        );
      })
    : usersList;
};

const domParser = new DOMParser();

export const convertHtmlToString = (html) => {
  const doc = domParser.parseFromString(html, "text/html");
  let i = 0;
  const elements = doc.querySelectorAll("body *");
  while (
    !(elements[i]?.innerText || elements[i]?.textContent) &&
    i < elements.length
  )
    i++;
  return elements[i]?.innerText || elements[i]?.textContent;
};
export const isHTML = (str) => /<\/?[a-z][\s\S]*>/i.test(str);
