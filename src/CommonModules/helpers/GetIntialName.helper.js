export const getInitialName = (name, isSingleChar = false) => {
  const nameArray = name ? name.split(" ") : " ";
  if (!isSingleChar && nameArray.length > 1) {
    return `${nameArray[0].slice(0, 1)}${nameArray[nameArray.length - 1]
      .slice(0, 1)
      .toUpperCase()}`;
  } else {
    return `${nameArray[0].slice(0, 1).toUpperCase()}`;
  }
};

export const getShortStr = (str, length = 8) => {
  return str?.length > length ? str?.substr(0, length) + "..." : str;
};
