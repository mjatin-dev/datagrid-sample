export const getFileValidationErrorMessage = (acceptedTypes) => {
  const isMultipleTypes = acceptedTypes && acceptedTypes?.length > 0;
  return `You have uploaded an invalid file type. Upload file with ${
    isMultipleTypes ? "one of the " : ""
  } ${acceptedTypes?.length > 0 && acceptedTypes?.join(", ")} type${
    isMultipleTypes ? "s" : ""
  }`;
};
