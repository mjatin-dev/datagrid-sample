import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./style.module.scss";

export default function CommonModal({
  handleOpen,
  handleClose,
  open,
  setOpen,
  child,
  data
}) {
  //   const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.box}>
          <div>create company</div>
        </div>
      </Modal>
    </div>
  );
}
