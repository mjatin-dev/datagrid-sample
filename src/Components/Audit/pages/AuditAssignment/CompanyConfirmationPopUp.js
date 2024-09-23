import React from "react";
import Modal from "@mui/material/Modal";
import styles from "./style.module.scss";
import { MdClose } from "react-icons/md";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import Button from "Components/Audit/components/Buttons/Button";
import Text from "Components/Audit/components/Text/Text";

export default function CompanyConfirmationPopUp({
  handleClose,
  open,
  setValues,
  values,
  setCompanyList,
  companyList,
  eventVlaue,
  errors,
  setErrors,
}) {
  const onConfirm = () => {
    if (
      eventVlaue?.length < 2 ||
      eventVlaue?.length === 0 ||
      eventVlaue === " "
    ) {
      setErrors({
        ...errors,
        company_name: "Must be minimum 2 char",
      });
    } else {
      setValues({
        ...values,
        company_name: eventVlaue,
      });
      setErrors({
        ...errors,
        company_name: "",
      });

      setCompanyList([
        ...companyList,
        {
          label: eventVlaue,
          value: eventVlaue,
        },
      ]);
    }

    handleClose();
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.box}>
          <div className={styles.closeBtn}>
            <IconButton
              icon={<MdClose />}
              variant="exitBtn"
              onClick={handleClose}
            />
          </div>
          <Text
            heading="h1"
            text={`Are You Sure you want to Create this company "${eventVlaue}"`}
            size="medium"
          />
          <div className="d-flex justify-content-center mt-3">
            <div className="p-2">
              <Button
                description="Confirm"
                variant="submitBtn"
                onClick={onConfirm}
              />
            </div>
            <div className="p-2">
              <Button
                description="CANCEL"
                variant="cancelBtn"
                onClick={handleClose}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
