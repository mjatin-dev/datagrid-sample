import React, { useState, useEffect, useMemo } from "react";
import Modal from "@mui/material/Modal";
import styles from "./style.module.scss";
import { MdClose } from "react-icons/md";
import IconButton from "../../../../components/Buttons/IconButton";
import Button from "../../../../components/Buttons/Button";
import axiosInstance from "../../../../../../apiServices";
import { setEditState } from "../../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Text from "../../../../components/Text/Text";

export default function DeleteConfirmation({ handleClose, open, data }) {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const state = useSelector((state) => state);
  
  const deleteUser = () => {
    try {
      axiosInstance
        .post("audit.api.DeleteUser", { email: userData?.email })
        .then((res) => {
          if (res?.data?.message?.status) {
            toast.success(res?.data?.message?.status_response);
            handleClose();
            dispatch(setEditState(!state?.AuditReducer?.editState));
          } else {
            toast.warning(res?.data?.message?.status_response);
          }
        });
    } catch (err) {}
  };

  // to set edit data
  useEffect(() => {
    setUserData({
      ...data,
    });
  }, [data]);

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
            text={`Do you want to delete ${userData.first_name} User`}
            size="medium"
          />
          <div className="d-flex justify-content-center mt-3">
            <div className="p-2">
              <Button
                description="Delete"
                variant="deleteBtn"
                onClick={deleteUser}
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
