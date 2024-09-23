import React from "react";
import Modal from "@mui/material/Modal";
import { MdClose } from "react-icons/md";
import IconButton from "Components/Audit/components/Buttons/IconButton";
import Button from "Components/Audit/components/Buttons/Button";
import Text from "Components/Audit/components/Text/Text";

export default function UnAssignConfirmation({
  setOpenConfirmation,
  openConfirmation,
  assignTasks,
  currentOpenedTask,
  userKey,
}) {
  return (
    <div>
      <Modal
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="confirmationBox">
          <div className="closeBtn">
            <IconButton
              icon={<MdClose />}
              variant="exitBtn"
              onClick={() => setOpenConfirmation(false)}
            />
          </div>
          <Text
            heading="h1"
            text={`Are you sure you want unassign ${
              userKey === "assign_to"
                ? currentOpenedTask?.assignedToName
                : userKey === "approver"
                ? currentOpenedTask?.approverName
                : currentOpenedTask?.ccName
            }?`}
            size="medium"
          />
          <div className="d-flex justify-content-center mt-3">
            <div className="p-2">
              <Button
                description="Yes"
                variant="submitBtn"
                onClick={() => {
                  assignTasks();
                  setOpenConfirmation(false);
                }}
              />
            </div>
            <div className="p-2">
              <Button
                description="No"
                variant="cancelBtn"
                onClick={() => setOpenConfirmation(false)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
