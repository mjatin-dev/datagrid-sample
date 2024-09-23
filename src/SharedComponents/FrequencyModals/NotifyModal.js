/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import "./FrequencyModal.css";
import { toast } from "react-toastify";
import moment from "moment";
import { MdError } from "react-icons/md";

const NotifyModal = ({
  notifyMe,
  setNotifyMe,
  notifyUpdate,
  notifyOn,
  fieldInputs,
}) => {
  const [option, setOption] = useState(
    notifyOn?.length > 0 ? notifyOn[0]?.time : ""
  );
  const [validDays, setValidDays] = useState({
    count: 0,
    key: "days",
  });
  const optionList = ["minutes", "hours", "days", "weeks", "months"];
  const [count, setCount] = useState(0);
  const onSave = () => {
    if (count <= 0) {
      toast.error("Days can't be zero.");
    } else if (option === "") {
      toast.error("Please select any option.");
    } else {
      const payload = { time: count, frequency: option };
      notifyUpdate(payload);
    }
  };
  const handleClose = () => {
    // setCount(0);
    // setOption("");
    setNotifyMe(false);
  };

  useEffect(() => {
    let { start_date, internal_deadline_date, end_date } = fieldInputs;
    start_date = moment(internal_deadline_date || start_date, "YYYY-MM-DD");
    end_date = moment(end_date, "YYYY-MM-DD");

    const diffDays = end_date?.diff(start_date, "days");
    const diffWeeks = end_date?.diff(start_date, "weeks");
    const diffMonths = end_date?.diff(start_date, "months");

    if (diffMonths > 0) {
      setValidDays({
        count: diffMonths,
        key: "months",
      });
    } else if (diffWeeks > 0) {
      setValidDays({
        count: diffWeeks,
        key: "weeks",
      });
    } else if (diffDays > 0) {
      setValidDays({
        count: diffDays,
        key: "days",
      });
    }
  }, [
    fieldInputs.start_date,
    fieldInputs.end_date,
    fieldInputs.internal_deadline_date,
  ]);

  return (
    <Modal
      open={notifyMe}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div>
        {" "}
        <div className="frequencyModal">
          <h4 className="mb-5">Notify me</h4>
          <div className="row">
            <div className="col">
              <input
                className="notify-me-input"
                value={count}
                type="text"
                minLength={1}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/[0-9]/.test(value) || !value) {
                    setCount(event.target.value);
                  }
                }}
              />
              {parseInt(count) > validDays.count && (
                <p className="add-project-err-msg">
                  <MdError />
                  &nbsp; Notify can't be greater than {validDays.count}&nbsp;
                  {validDays.key}
                </p>
              )}
            </div>
            <div className="col notify-me-options">
              {optionList
                .filter((item) => {
                  if (validDays.key === "days") {
                    return item !== "months" && item !== "weeks";
                  } else if (validDays.key === "weeks") {
                    return item !== "months";
                  } else {
                    return item;
                  }
                })
                .map((item) => (
                  <p
                    className={`${item === option ? "notify-active" : ""}`}
                    onClick={() => setOption(item)}
                  >
                    {item}
                  </p>
                ))}
            </div>
          </div>

          <div className="text-right mt-5">
            <button
              className="frequency-submit-btn"
              onClick={onSave}
              disabled={parseInt(count) > validDays.count}
            >
              Save
            </button>
            <button className="frequency-cancel-btn ml-2" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NotifyModal;
