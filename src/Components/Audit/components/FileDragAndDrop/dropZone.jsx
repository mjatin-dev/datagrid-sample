import React from "react";
import styles from "./style.module.scss";
import Dropzone from "react-dropzone";
import fileUploadIcon from "../../assets/icons/fileUploadIcon.png";
import Text from "../Text/Text";
import { fileType } from "./fileType";
import { onDropRejection } from "CommonModules/helpers/file.helper";
function DropZone({
  uploadFile,
  labelText = "Drag and Drop your files here",
  variant = "default",
  image = "img",
}) {
  return (
    <>
      <div className={styles.container}>
        <Text
          heading="label"
          variant="label_variant"
          size="small"
          text={labelText}
        />
        <div className={styles[variant]}>
          <div className={styles[image]}>
            <Dropzone
              onDropRejected={onDropRejection}
              multiple={true}
              maxSize={10485760}
            //  accept={fileType}
              onDrop={(event) => uploadFile(event)}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps({
                    className: "dropzone",
                  })}
                >
                  <div>
                    <input {...getInputProps()} />
                  </div>
                  <img src={fileUploadIcon} alt="File Upload icon" />
                  <div>Drag and drop your files here</div>
                  <div className={styles.uploadFileText}>Upload files</div>
                </div>
              )}
            </Dropzone>
          </div>
        </div>
      </div>
    </>
  );
}

export default DropZone;
