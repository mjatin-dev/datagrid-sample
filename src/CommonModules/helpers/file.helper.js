import axiosInstance from "apiServices";
import { mimeTypes } from "Components/Audit/constants/DateTypes/fileType";
import { toast } from "react-toastify";
import apis from "../../Components/OnBoarding/SubModules/DashBoardCO/api";
import constant, {
  MAX_FILE_UPLOAD_LIMIT,
} from "CommonModules/sharedComponents/constants/constant";
export const onFileDownload = async (file_id) => {
  try {
    const { data, status } = await apis.getFileContent(file_id);
    if (status === 200 && data?.message?.status) {
      const { encoded_string, file_name } = data?.message;
      const url = `data:application/${file_name
        .split(".")
        .pop()};base64,${encoded_string}`;
      const hiddenElement = document.createElement("a");
      hiddenElement.href = url;
      hiddenElement.download = file_name;
      hiddenElement.click();
    }
  } catch (error) {}
};

export const base64ToBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const fileDownload = async (file_id, type = "download") => {
  axiosInstance
    .post("compliance.api.GetFileContent", { file_id })
    .then((res) => {
      if (res?.status === 200) {
        const fileExtension =
          res?.data?.message?.file_name?.split(".")?.pop() || "";
        const mimeType =
          mimeTypes.find((item) => item.fileExtension === "." + fileExtension)
            ?.fileMimeType || `applicaiton/${fileExtension}`;
        const url = `data:${mimeType};base64,${res?.data.message.encoded_string}`;
        const hiddenElement = document.createElement("a");
        if (type === "download") {
          hiddenElement.href = url;
          hiddenElement.download = res?.data.message.file_name;
        } else {
          const blob = base64ToBlob(
            res.data?.message?.encoded_string,
            mimeType
          );

          const blobURl = URL.createObjectURL(blob);
          hiddenElement.href = blobURl;
          hiddenElement.target = "_blank";
          hiddenElement.rel = "noreferrer";
          if (fileExtension === "xlsx") {
            hiddenElement.download = res?.data.message.file_name;
          }
        }
        hiddenElement.click();
      } else {
        toast.error("Unable to get this file.");
      }
    })
    .catch((err) => {
      toast.error("Unable to preview this file.");
    });
};
export const onDropRejection = (fileRejections) => {
  let isTooManyFiles = false;
  fileRejections?.forEach((item) => {
    const isFileTooLarge = Boolean(
      item?.errors?.find((e) => e?.code === "file-too-large")
    );
    const tooManyFilesErrorFound = Boolean(
      item?.errors?.find((e) => e?.code === "too-many-files")
    );
    if (isFileTooLarge) {
      toast.error(`${item?.file?.name} is greater than 10mb limit.`);
    }
    if (tooManyFilesErrorFound) {
      isTooManyFiles = true;
    }
  });
  if (isTooManyFiles) {
    toast.error(constant.errorMessage.maxFilesErrorMessage);
  }
};
export const getMaxFilesAndGenerateError = (files) => {
  if (files?.length > MAX_FILE_UPLOAD_LIMIT) {
    toast.error(constant?.errorMessage.maxFilesErrorMessage);
  }
  return files?.filter((item, index) => index < MAX_FILE_UPLOAD_LIMIT) || [];
};
