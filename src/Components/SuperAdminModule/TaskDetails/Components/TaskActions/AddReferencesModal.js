import React, { useEffect } from "react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import Modal from "../../../../../CommonModules/sharedComponents/Modal";
import fileUploadIcon from "../../../../../assets/Icons/fileUploadIcon.png";
import { MdAddCircle, MdLink, MdInsertDriveFile } from "react-icons/md";
import isURL from "validator/lib/isURL";
import "./style.css";
import { onDropRejection } from "CommonModules/helpers/file.helper";
const AddReferencesModal = ({ isOpen, setIsOpen }) => {
  const [linkInput, setLinkInput] = useState("");
  const [linksList, setLinksList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const handleLinkAddMore = () => {
    console.log("handlelinkaddmoreclicked");
    if (linkInput !== "" && isURL(linkInput)) {
      setLinksList([...linksList, linkInput]);
      setLinkInput("");
    }
  };
  const handleUploadFile = (file) => {
    const _fileList = (fileList && fileList[0] && fileList[0].Files) || [];
    let isAlreadyPresent = false;
    let filesArray = [];
    file.forEach((file) => {
      isAlreadyPresent = _fileList.some(
        (element) => element.FileName === file.name
      );
      if (!isAlreadyPresent) {
        filesArray.push(file);
      } else {
        toast.error(`File ${file.name} is already exists.`);
        return;
      }
    });
    setFileList(filesArray);
  };
  const handleClose = () => {
    if (isOpen) {
      setIsOpen(false);
      setLinkInput("");
      setLinksList([]);
      setFileList([]);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h4 className="mb-0 add-references__heading mb-3">Send an attachment</h4>
      <div className="add-references__input-item my-2">
        <p className="task-data__field-value add-references__input-label">
          Add a link here
        </p>
        <input
          type="text"
          className="form-control comment__input"
          placeholder="Type or Paste a URL here"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
        />
        {linkInput !== "" && !isURL(linkInput) && (
          <small
            style={{
              color: "red",
              fontSize: "8px",
            }}
          >
            Please enter valid URL
          </small>
        )}
        <div className="add-references__attached-links">
          {linksList.length > 0 &&
            linksList.map((item) => (
              <div className="add-references__attached-links-item my-2 d-flex align-items-center">
                <MdLink />
                <p className="add-references__attached-link mb-0 mx-1 task-data__field-value">
                  {item}
                </p>
              </div>
            ))}
        </div>
        <button
          className="add-references__add-more mt-2"
          onClick={handleLinkAddMore}
          disabled={!linkInput !== "" && !isURL(linkInput)}
        >
          add more <MdAddCircle />
        </button>
      </div>
      <div className="add-references__input-item mt-4 mb-2">
        <p className="task-data__field-value add-references__input-label">
          Add a file here
        </p>
        <Dropzone
          onDropRejected={onDropRejection}
          multiple={true}
          maxSize={10485760}
          accept=".png,.jpg,
      application/pdf,application/rtf,application/msword,image/bmp,
      application/vnd.ms-excel,image/tiff,image/tif,image/jpeg,
      application/ms-excel,
      .tiff,.pdf,.doc,.docx,
      .XLS,.xlsx,.CSV,.zip,.rar,.txt,.S0001,.T0001"
          onDrop={(acceptedFiles) => handleUploadFile(acceptedFiles)}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: "add-references__dropzone" })}>
              <input {...getInputProps()} />
              <img src={fileUploadIcon} alt="file-upload-icon" className="" />
              <p className="add-references__dropzone-title">
                Drag and drop your files here or{" "}
                <span className="add-references__dropzone-title--blue">
                  Upload files
                </span>
              </p>
            </div>
          )}
        </Dropzone>
        {fileList.length > 0 &&
          fileList.map((item) => {
            const { name } = item;
            return (
              <div className="add-references__attached-links-item my-2 d-flex align-items-center">
                <MdInsertDriveFile />
                <p className="add-references__attached-link mb-0 mx-1 task-data__field-value">
                  {name}
                </p>
              </div>
            );
          })}
      </div>
      <div className="add-references__input-title mt-5 mb-2">
        <button className="add-references__button">add attachment</button>
        <button
          className="add-references__button add-references__button-stroke"
          onClick={handleClose}
        >
          cancel
        </button>
      </div>
    </Modal>
  );
};

export default AddReferencesModal;
