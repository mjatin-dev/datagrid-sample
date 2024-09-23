import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import "./style.scss";
import { MdClose } from "react-icons/md";
import Text from "Components/Audit/components/Text/Text";
import Button from "Components/Audit/components/Buttons/Button";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";

export default function RenameLicense({
  handleClose,
  open,
  editdata,
  isRename,
  refreshFn,
}) {
  const initialValues = {
    license_name: "",
    license_id: "",
  };
  const [fields, setFields] = useState(initialValues);
  const [isLoading, setIsloading] = useState(false);
  const [errors, setErrors] = useState({});

  const onFieldsChange = (event) => {
    const { name, value } = event.target;
    setFields({ ...fields, [name]: removeWhiteSpaces(value) });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;
    // Validate name field
    if (fields.license_name === "" || fields.license_name === " ") {
      errors.license_name = "License name required";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  const renameLicense = () => {
    setIsloading(true);
    let payload = {
      license_id: fields.license_id,
      new_name: fields.license_name,
    };
    try {
      axiosInstance
        .post("compliance.api.renameLicense", payload)
        .then((res) => {
          if (res.status === 200 && res?.data?.message?.success) {
            setIsloading(false);
            refreshFn();
            onModalClose();
          } else {
            setIsloading(false);
            toast.warning(res?.data?.message?.status_response);
          }
        })
        .catch((err) => {
          setIsloading(false);
          console.log(err);
        });
    } catch (err) {
      setIsloading(false);

      console.log(err);
    }
  };
  const onFormSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      renameLicense();
    } else {
      console.log("Please fill required fields");
    }
  };

  const onModalClose = () => {
    handleClose();
    setErrors({});
    setFields(initialValues);
  };

  useEffect(() => {
    if (isRename) {
      setFields({
        license_name: editdata?.license_id,
        license_id: editdata?.license_id,
      });
    }
  }, [isRename]);
  return (
    <div>
      <Modal
        open={open}
        onClose={onModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="create__licence__modal">
          <BackDrop isLoading={isLoading} />
          <div className="create__licence__modal__heading">
            <div>
              <Text heading="h1" text={"Rename License"} size="medium" />
            </div>
            <div className="create__licence__modal__closeBtn">
              <IconButton
                icon={<MdClose />}
                variant="exitBtn"
                size={"large"}
                onClick={onModalClose}
              />
            </div>
          </div>
          <div className="create__licence__fields">
            <div className="row">
              <div className="col-md-12">
                <label>Name of The License</label>
                <input
                  type="text"
                  id="firstField"
                  autoFocus
                  required
                  maxLength={100}
                  value={fields.license_name}
                  onChange={onFieldsChange}
                  className="create__licence__input__fields"
                  name="license_name"
                  placeholder="Eg. Mvw"
                />
                {errors.license_name && (
                  <Text
                    heading="p"
                    variant="error"
                    text={errors.license_name}
                  />
                )}
              </div>
            </div>

            <div className="d-flex justify-content-center mt-3">
              <div className="p-2">
                <Button
                  description="Rename"
                  variant="default"
                  onClick={onFormSubmit}
                />
              </div>
              <div className="p-2">
                <Button
                  description="Cancel"
                  variant="cancelBtn"
                  onClick={onModalClose}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
