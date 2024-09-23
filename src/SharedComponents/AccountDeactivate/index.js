import { IconButton, Modal } from "@mui/material";
import React, { useState } from "react";
import "./style.css";
import { MdClose } from "react-icons/md";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";
import AutoGrowInput from "Components/Audit/components/Inputs/AutoGrowInput";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import {
  removeWhiteSpaces,
  sanitizeInput,
} from "CommonModules/helpers/string.helpers";

function DeactivateAccount({ open, close }) {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const handleClose = () => {
    setDescription("");
    close();
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      let des = description.trim();
      const response = await axiosInstance.post(
        "/compliance.api.DeactivateRequest",
        {
          reason: des,
        }
      );

      if (response.status === 200) {
        if (response.data.message.status) {
          toast.success(response.data.message.status_response);
        } else {
          toast.error(response.data.message.status_response);
        }

        handleClose();
        setIsLoading(false);
      } else {
        toast.error(response.data.message.Message);
        setIsLoading(false);
        handleClose();
      }
    } catch (error) {
      setIsLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="DeactivateBox">
          <div className="DeactivateHeading">
            <div className="headingText">Deactivate Account</div>
            <div className="closeBtn">
              <IconButton disableTouchRipple={true} onClick={handleClose}>
                <MdClose />
              </IconButton>
            </div>
          </div>
          <div className="DeactivateDescription">
            <AutoGrowInput
              autoFocus={true}
              value={description}
              onChange={(e) =>
                setDescription(removeWhiteSpaces(e.target?.value))
              }
              variant="auditAssignmentInput"
              labelText="Reason"
              labelVariant="labelSmall"
              required={true}
              maxLength="250"
              style={{ width: "350px", height: "70px !important" }}
            />
          </div>
          <div className="deactivateTask__modal__btns">
            {isLoading ? (
              <Dots />
            ) : (
              <button
                disabled={
                  description === "" || description === " " ? true : false
                }
                onClick={handleSubmit}
                style={{
                  opacity:
                    description === "" || description === " " ? "0.3" : "",
                }}
                className="subbmitButton"
              >
                Submit
              </button>
            )}
            <button
              className="deactivateTask__cancel__btn"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeactivateAccount;
