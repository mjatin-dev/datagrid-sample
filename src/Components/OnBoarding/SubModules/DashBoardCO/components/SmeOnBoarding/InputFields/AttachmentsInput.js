import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import { UploadOutlined, DeleteFilled } from "@ant-design/icons";
import { Button, message } from "antd";
const Attachment = (prop) => {
  const {
    form_id,
    handleFileUpload,
    item,
    label,
    error,
    styleType,
    handleDeleteFile,
  } = prop;

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const allowedTypes = item?.type?.options?.allowFileTypes?.split(",");

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const requiredSize = item?.type?.options?.fileSize;
    const validFiles = newFiles.filter((file) => {
      const isValidType = allowedTypes
        ? allowedTypes?.includes(file.type)
        : true;
      if (!isValidType) {
        message.error(
          `File type is not allowed. Allowed types: ${allowedTypes}`
        );
      }
      let isValidSize = false;
      switch (requiredSize) {
        case "1 MB":
          isValidSize = file.size <= 1024 * 1024;
          break;
        case "10 MB":
          isValidSize = file.size <= 10 * 1024 * 1024;
          break;
        case "100 MB":
          isValidSize = file.size <= 100 * 1024 * 1024;
          break;
        case "1 GB":
          isValidSize = file.size <= 1024 * 1024 * 1024;
          break;
        case "10 GB":
          isValidSize = file.size <= 10 * 1024 * 1024 * 1024;
          break;
        default:
          isValidSize = true; // No size limit specified
          break;
      }
      if (!isValidSize) {
        message.error(`Image must be smaller than ${requiredSize}!`);
      }

      return isValidType && isValidSize;
    });

    // Limit the number of files to be uploaded
    const maxFiles = item?.type?.options?.maxFiles
      ? parseInt(item?.type?.options?.maxFiles)
      : 1;
    if (selectedFiles.length + validFiles.length > maxFiles) {
      message.error(`You can upload a maximum of ${maxFiles} files.`);
      return;
    }
    if (validFiles.length > 0) {
      const tempFiles = [...selectedFiles, ...validFiles];

      setSelectedFiles(tempFiles);
      handleFileUpload(tempFiles);
    }
  };
  const handleUploadButtonClick = () => {
    // Open the file input when the upload button is clicked
    fileInputRef.current.click();
  };
  const handleDelete = (file, index) => {
    handleDeleteFile(file?.file_id);

    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };
  switch (styleType) {
    case "Style 01":
      return (
        <div className="sme-style1-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className="style2-input-div-checkbox">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept={allowedTypes}
                onChange={handleFileChange}
              />
              <Button
                icon={<UploadOutlined />}
                onClick={handleUploadButtonClick}
              >
                Select File
              </Button>
              <div className="file-list">
                {item?.file_details &&
                  item?.file_details?.map((file, index) => (
                    <div key={index} className="file-item">
                      <span style={{ marginRight: "10px" }}>
                        {file?.file_name}
                      </span>

                      <DeleteFilled onClick={() => handleDelete(file, index)} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {error?.[form_id] && (
            <p className="sme-error">{error[form_id]?.message}</p>
          )}
        </div>
      );
    case "Style 02":
      return (
        <div className="sme-style2-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ margin: 0 }}>
            {label}
          </p>
          <div className="style2-input-div">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept={allowedTypes}
                onChange={handleFileChange}
              />
              <Button
                icon={<UploadOutlined />}
                onClick={handleUploadButtonClick}
              >
                Select File
              </Button>
              <div className="file-list">
                {item?.file_details &&
                  item?.file_details?.map((file, index) => (
                    <div key={index} className="file-item">
                      <span style={{ marginRight: "10px" }}>
                        {file?.file_name}
                      </span>
                      <DeleteFilled onClick={() => handleDelete(file, index)} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {error?.[form_id] && (
            <p className="sme-error">{error[form_id]?.message}</p>
          )}
        </div>
      );
    case "Style 03":
      return (
        <div className="sme-style3-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2">{label}</p>
          <div className="style2-input-div">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept={allowedTypes}
                onChange={handleFileChange}
              />
              <Button
                icon={<UploadOutlined />}
                onClick={handleUploadButtonClick}
              >
                Select File
              </Button>
              <div className="file-list">
                {item?.file_details &&
                  typeof item?.file_details == "object" &&
                  item?.file_details?.map((file, index) => (
                    <div key={index} className="file-item">
                      <span style={{ marginRight: "10px" }}>
                        {file?.file_name}
                      </span>
                      <DeleteFilled onClick={() => handleDelete(file, index)} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {error?.[form_id] && (
            <p className="sme-error">{error[form_id]?.message}</p>
          )}
        </div>
      );
    default:
      return (
        <div className="sme-style1-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ marginBottom: "10px" }}>
            {label}
          </p>
          <div className="style2-input-div-checkbox">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept={allowedTypes}
                onChange={handleFileChange}
              />
              <Button
                icon={<UploadOutlined />}
                onClick={handleUploadButtonClick}
              >
                Select File
              </Button>
              <div className="file-list">
                {item?.file_details &&
                  typeof item?.file_details == "object" &&
                  item?.file_details?.map((file, index) => (
                    <div key={index} className="file-item">
                      <span style={{ marginRight: "10px" }}>
                        {file?.file_name}
                      </span>
                      <DeleteFilled onClick={() => handleDelete(file, index)} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {error?.[form_id] && (
            <p className="sme-error">{error[form_id]?.message}</p>
          )}
        </div>
      );
  }
};

export default Attachment;
