export const getFileExtensions = (list) => {
  return typeof list === "string"
    ? list
    : typeof list === "object"
    ? list?.length > 0
      ? [...list].map((item) => item.attachment_type).join()
      : ""
    : "";
};

export const getTruncatedString = (value) => {
  return value?.length > 12 ? `${value.slice(0, 12)}...` : value;
};

// Email validation

export const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
