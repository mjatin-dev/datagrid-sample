import axiosInstance from "apiServices";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
const {
  getFileValidationErrorMessage,
} = require("Components/Audit/constants/Errors");

const useFileUpload = () => {
  const [isFileUploadInProgress, setIsLoading] = useState(false);
  const uploadFile = useCallback(async (event, apiPathOrFunction, payload) => {
    setIsLoading(true);
    const { files, accept } = event.target;
    const fileExtension = files[0].name
      ? "." + files[0]?.name?.split(".").pop()
      : null;
    const acceptedFormats = accept ? accept.split(",") : null;
    const maxFileSize = 10 * 1024 * 1024;

    console.log(files, acceptedFormats, fileExtension, payload);
    if (files && files?.length > 0 && Object.keys(payload)?.length > 0) {
      if (
        acceptedFormats
          ? acceptedFormats?.length > 0 &&
            acceptedFormats?.includes(fileExtension)
          : !acceptedFormats
      ) {
        const fileSize = files[0]?.size;
        if (fileSize > maxFileSize) {
          toast.error("File size exceeds the maximum limit of 10 MB");
          setIsLoading(false);
          return false;
        }
        const formData = new FormData();
        Object.keys(payload).forEach((key) => {
          formData.append(key, payload[key]);
        });
        formData.append("submited_doc", files[0]);

        try {
          const { data, status } =
            typeof apiPathOrFunction === "string"
              ? await axiosInstance.post(apiPathOrFunction, formData)
              : await apiPathOrFunction?.(formData);
          if (status === 200 && data?.message?.status) {
            toast.success(data.message.status_response);
            setIsLoading(false);

            return true;
          } else {
            toast.error(
              data?.message?.status_response || "Something went wrong...."
            );
            setIsLoading(false);

            return false;
          }
        } catch (error) {
          toast.error("Something went wrong.....");
          setIsLoading(false);

          return false;
        }
      } else {
        toast.error(getFileValidationErrorMessage(acceptedFormats));
        setIsLoading(false);

        return false;
      }
    }
    setIsLoading(false);
    return false;
  }, []);

  return [isFileUploadInProgress, uploadFile];
};

export default useFileUpload;
