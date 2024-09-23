import React from "react";
import styles from "./style.module.scss";
import Modal from "@mui/material/Modal";
import Text from "../Text/Text";
import Button from "../Buttons/Button";
import { useSelector, useDispatch } from "react-redux";
import {
  setMarkAsCompleteModalClose,
  setMarkAsCompleteData,
} from "../../redux/actions";
function MarkAsComplete() {
  const { isOpen, status, questionId, assignmentId, heading } = useSelector(
    (state) => state?.AuditReducer?.markAsCompleteModal
  );
  const dispatch = useDispatch();

  const setModalClose = () => {
    dispatch(setMarkAsCompleteModalClose());
  };

  const submitFunction = () => {
    const formData = new FormData();
    formData.append("assignment_id", assignmentId);
    formData.append("question_id", questionId);
    formData.append("complied", status);
    dispatch(setMarkAsCompleteData(formData));
  };
  return (
    <>
      <div>
        <Modal
          open={isOpen}
          onClose={setModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={styles.box}>
            <div className={styles.topLeaveHeading}>
              <Text heading="h5" text={heading} variant="auditheading" />
            </div>

            <div className="d-flex justify-content-center mt-2">
              <div className="p-2">
                <Button
                  description="Yes"
                  variant="submitBtn"
                  onClick={submitFunction}
                />
              </div>
              <div className="p-2">
                <Button
                  description="No"
                  variant="cancelBtn"
                  onClick={setModalClose}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
export default MarkAsComplete;
