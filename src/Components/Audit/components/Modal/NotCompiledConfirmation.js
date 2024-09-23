import React from "react";
import Modal from "@mui/material/Modal";
import styles from "./style.module.scss";
import { MdClose } from "react-icons/md";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import Button from "Components/Audit/components/Buttons/Button";
import Text from "Components/Audit/components/Text/Text";
import { CompliedNotCompliedFunction } from "Components/Audit/constants/CommonFunction";

export default function NotCompliedConfirmation({
  handleClose,
  open,
  data,
  onSubmitFunction,
}) {
   const onConfirm = () => {
    const { check_point_id, assignment_id } = data?.data;
    CompliedNotCompliedFunction("Not Complied", assignment_id, check_point_id,onSubmitFunction);
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
            text={`Are you sure you don't want to attach any Document?`}
            size="medium"
          />
          <div className="d-flex justify-content-center mt-3">
            <div className="p-2">
              <Button
                description="Yes"
                variant="submitBtn"
                onClick={onConfirm}
              />
            </div>
            <div className="p-2">
              <Button
                description="No"
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
