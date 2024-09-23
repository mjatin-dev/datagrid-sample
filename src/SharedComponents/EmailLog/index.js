import React, { useEffect, useState } from "react";
import "./style.css";
import styles from "Components/Notifications/styles.module.scss";
import { DatePicker } from "antd";
import moment from "moment";
import { IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";
import axiosInstance from "apiServices";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { toast } from "react-toastify";

function EmailLog({ handleClose, fetchUpdateDetails }) {
  const [state, setState] = useState({
    isLoading: false,
    startDate: "",
    endDate: "",
    emailLogs: [],
    updateDetails: [],
    isDrawerOpen: false,
  });

  const setFromDate = (dateString) => {
    const { endDate } = state;
    const selectedDate = moment(dateString).format("YYYY-MM-DD");
    const currentDate = moment(endDate).format("YYYY-MM-DD");
    if (dateString && endDate && selectedDate > currentDate) {
      toast.error("Start Date Can't be greater than end date");
    } else if (dateString) {
      setState({
        ...state,
        startDate: moment(dateString).format("YYYY-MM-DD"),
      });
    } else {
      setState({
        ...state,
        startDate: "",
      });
    }
  };
  const setToDate = (dateString) => {
    const { startDate } = state;
    const selectedDate = moment(dateString).format("YYYY-MM-DD");
    const currentDate = moment().format("YYYY-MM-DD");

    const startedDate = moment(startDate).format("YYYY-MM-DD");

    if (startDate !== "" && dateString && selectedDate > currentDate) {
      toast.error("End Date Can't be greater than current date");
    } else if (dateString && startDate !== "" && selectedDate < startedDate) {
      toast.error("End Date Can't be less than start date");
    } else if (dateString) {
      setState({ ...state, endDate: moment(dateString).format("YYYY-MM-DD") });
    } else {
      setState({ ...state, endDate: "" });
    }
  };
  useEffect(() => {
    if (
      state.startDate !== "" &&
      state.startDate !== "Invalid date" &&
      state.endDate !== "" &&
      state.endDate !== "Invalid date"
    ) {
      fetchEmailLogs();
    }
  }, [state.startDate, state.endDate]);

  const fetchEmailLogs = async () => {
    setState({ ...state, isLoading: true });
    try {
      const { data } = await axiosInstance.post(
        `compliance.api.getRegulationEmailLog`,
        {
          from_date: state.startDate,
          to_date: state.endDate,
        }
      );

      if (data.message.length > 0) {
        setState({ ...state, emailLogs: [...data.message], isLoading: false });
      } else {
        setState({ ...state, emailLogs: [], isLoading: false });
      }
    } catch (error) {
      setState({ ...state, isLoading: false });
    }
  };

  const openDrawer = (name) => {
    fetchUpdateDetails(name);
  };

  return (
    <div className="e-log-container">
      <div className="emaiLogHeader">
        <h1 className="emailLogtTitle mb-0">Email Log</h1>
        <div className={styles.closeBtn}>
          <div className="crossBtn">
            <IconButton disableTouchRipple={true} onClick={handleClose}>
              <MdClose />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="calander">
        <div className="calander-start">
          <label className="label-text">Start Date</label>
          <DatePicker
            format="DD MMM YYYY"
            name={"startDate"}
            className={"date-picker start-date"}
            placeholder="Select Date"
            onChange={setFromDate}
          />
        </div>
        <div className="calander-end">
          <label className="label-text">End Date</label>
          <DatePicker
            format="DD MMM YYYY"
            name={"endDate"}
            placeholder="Select Date"
            className={"date-picker end-date "}
            onChange={setToDate}
          />
        </div>
      </div>
      {state.isLoading ? (
        <Dots />
      ) : state.startDate === "" || state.endDate === "" ? (
        <div>
          <p className="text-muted mb-0">
            Please choose dates to get email logs.
          </p>
        </div>
      ) : (
        <div className="logs-table">
          <ul className="logs-header">
            <li>Group</li>
            <li>Email</li>
            <li className="logs-subject">Subject</li>
            <li>Mail</li>
            <li>Status</li>
            <li>Creator</li>
            <li>Email Date</li>
          </ul>
          {state?.emailLogs?.length > 0 ? (
            state.emailLogs.map((item) => {
              return (
                <ul className="logs-data">
                  <li>{item.group ? item.group : "-"}</li>
                  <li>{item.full_name ? item.full_name : item.email}</li>
                  <li className="subject-data">{item.subject}</li>
                  <li>
                    <a
                      className="view-all-mail"
                      onClick={() => openDrawer(item.circular_id)}
                    >
                      View Mail
                    </a>
                  </li>
                  <li style={{ textTransform: "capitalize" }}>{item.status}</li>
                  <li>Admin</li>
                  <li>
                    {moment(item.mail_time).format("DD MMM YYYY, hh:mm A")}
                  </li>
                </ul>
              );
            })
          ) : (
            <p className="text-muted text-center mb-0">No logs found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default EmailLog;
