import { IconButton, Modal } from "@mui/material";
import React, { useState } from "react";
import "./style.css";
import { MdClose } from "react-icons/md";
import moment from "moment";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AutoGrowInput from "Components/Audit/components/Inputs/AutoGrowInput";
import { Input } from "Components/Audit/components/Inputs/Input";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { Grammarly, GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";

function Suggestions({ open, close }) {
  const [topic, setTopic] = useState("");
  const demoClientId = "client_R6LcVmecB7xPvwZnPnB5Zd";
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  const userEmailId = useSelector((state) => state?.auth?.loginInfo?.email);
  const handleClose = () => {
    setTopic("");
    setDescription("");
    close();
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      let trimedTopic = topic.trim();
      let trimedDescription = description.trim();
      const response = await axiosInstance.post(
        "compliance.api.FeedbackDataUpdate",
        {
          user: userEmailId,
          topic: trimedTopic,
          remark: false,
          date: currentDate,
          description: trimedDescription,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message.Message);
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
        <Grammarly clientId={demoClientId}>
        <div className="suggestionBox">
          <div className="suggestionHeading">
            <div className="headingText">Suggestions</div>
            <div className="closeBtn">
              <IconButton disableTouchRipple={true} onClick={handleClose}>
                <MdClose />
              </IconButton>
            </div>
          </div>
          <div className="suggestionTopic">
            <Input
              maxLength={100}
              value={topic}
              onChange={(e) => {
                setTopic(removeWhiteSpaces(e.target.value));
              }}
              variant="auditAssignmentInput"
              autofocus={true}
              labelText="Topic"
              labelVariant="labelSmall"
              className="mr-0"
              required={true}
            />
          </div>
          <div className="suggestionDescription">
          <GrammarlyEditorPlugin>
            <AutoGrowInput
              value={description}
              onChange={(e) =>
                setDescription(removeWhiteSpaces(e.target.value))
              }
              variant="auditAssignmentInput"
              labelText="Description"
              labelVariant="labelSmall"
              required={true}
              maxLength={1000}
            />
            </GrammarlyEditorPlugin>
          </div>
          <div className="suggestion__bts">
            {isLoading ? (
              <Dots />
            ) : (
              <button
                disabled={
                  description === "" ||
                  topic === "" ||
                  description === " " ||
                  topic === " "
                    ? true
                    : false
                }
                onClick={handleSubmit}
                style={{
                  opacity:
                    description === "" ||
                    topic === "" ||
                    description === " " ||
                    topic === " "
                      ? "0.3"
                      : "",
                }}
                className="subbmitButton"
              >
                Submit
              </button>
            )}
            <button className="suggestion__cancel__btn" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
        </Grammarly>
      </Modal>
    </>
  );
}

export default Suggestions;
