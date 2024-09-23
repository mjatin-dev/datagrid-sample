import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import IconButton from "../../../../components/Buttons/IconButton";
import { MdClose } from "react-icons/md";
import Modal from "@mui/material/Modal";
import Text from "../../../../components/Text/Text";
import { DatePicker } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Button from "../../../../components/Buttons/Button";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import CreatableSelect from "react-select/creatable";
import moment from "moment";
import axiosInstance from "../../../../../../apiServices";
import { toast } from "react-toastify";

const initialState={
  day_type: "",
  from_date: "",
  to_date: "",
  reason_of_leave: "",
}
function Leave({ closeLeave, onClose, open }) {
  const [managerNameList, setMangerNameList] = useState([]);
  const [state, setState] = useState(initialState);
  const [approvalDetails,setApprovalDetails]=useState([])


  //Function to get managerList 
  const managerList = async () => {
    try {
      const response = await axiosInstance.get(
        "audit.api.getUserApplyForLeave"
      );
      if (response?.data?.message?.status) {
        const arr = [];
        let data = response?.data?.message?.data;
        data.map((item) => {
          arr.push({
            label: item.name,
            value: item.email,
          });
        });
        setMangerNameList(arr);
      }
    } catch (err) {}
  };

  //function to change input field value
  const handleUser = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setState({ ...state, [name]: value });
  };

  //function to change Inform to approver list 
  const approvalChange = (handleChnage) => {
    let arr = [];
    handleChnage?.map((item) => {
      arr.push({ approver: item.value });
    });
    setApprovalDetails([...arr]);
  };


  //function to submit data 
  const applyForLeave = () => {
    const formData =new  FormData();
    for (const key in state) {
      formData.append(key, state[key]);
    }
    formData.append("approval_details",JSON.stringify(approvalDetails))
    try {
      axiosInstance
        .post("audit.api.ApplyLeave",formData)
        .then((res) => {
          if (res.data.message.status) {
            toast.success(res?.data?.message?.status_response);
            onClose();
            setState(initialState);
          }
        });
    } catch (err) {}
  };

  useEffect(() => {
    managerList();
  }, []);
  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={styles.box}>
            <div className={styles.topLeaveHeading}>
              <Text
                heading="h5"
                text="Apply for Leave "
                variant="auditheading"
              />
              <div className={styles.closeLeaveButton}>
                <IconButton
                  icon={<MdClose />}
                  variant="closeButn"
                  onClick={onClose}
                />
              </div>
              {/* <div className={styles.topHeading}>
                <Text
                  heading="h5"
                  text="You have 7.5 and 1 optional leave in your account "
                  variant="notice"
                />
              </div> */}
            </div>
            <div className={styles.dayType}>
              <Text heading="h5" text="Day Type" variant="auditheading" />
            </div>
            <RadioGroup
              row
              aria-label="frequency"
              value={state?.day_type}
              name="day_type"
              onChange={handleUser}
            >
              <FormControlLabel
                value="Full Day"
                control={<Radio />}
                label="Full Day"
              />
              <FormControlLabel
                value="Half Day"
                control={<Radio />}
                label="First Half Day"
              />
            </RadioGroup>
            <div className={styles.dateText}>
              <Text heading="h5" text="From" variant="from" />
            </div>
            <div className={styles.dateToText}>
              <Text heading="h5" text="To" variant="to" />
            </div>
            <div className={styles.date}>
              <div className="col-sm-8 col-lg-3">
                <DatePicker
                  name="from_date"
                  placeholder="Select Date"
                  value={
                    (state?.from_date &&
                      moment(state?.from_date, "YYYY-MM-DD")) ||
                    null
                  }
                  onChange={(value) =>
                    setState({
                      ...state,
                      from_date: value?.format("YYYY-MM-DD") || "",
                    })
                  }
                  className={styles.edit_input}
                  format="DD MMM YYYY"
                  getPopupContainer={(triggerNode) => {
                    return triggerNode.parentNode;
                  }}
                />
              </div>
            </div>

            <div className={styles.dateFirst}>
              <DatePicker
                name="to_date"
                value={
                  (state?.to_date && moment(state?.to_date, "YYYY-MM-DD")) ||
                  null
                }
                onChange={(value) =>
                  setState({
                    ...state,
                    to_date: value?.format("YYYY-MM-DD") || "",
                  })
                }
                className={styles.edit_first_input}
                format="DD MMM YYYY"
                placeholder="Select Date"
                getPopupContainer={(triggerNode) => {
                  return triggerNode.parentNode;
                }}
              />
            </div>
            <div className={styles.add_inform_name}>
              <Text heading="h5" text="I want to inform" variant="" />
              <CreatableSelect
                isMulti
                name="approval_details"
                options={managerNameList}
                // value={{
                //   label: user?.approval_details || "",
                //   value: user?.approval_details || "",
                // }}
                onChange={approvalChange}
              />
            </div>
            <div className={styles.reson_leave}>
              <Text heading="h5" text="Reson of Leave" variant="" />
              <TextArea
                placeholder="Type here"
                name="reason_of_leave"
                value={state.reason_of_leave}
                onChange={handleUser}
              />
            </div>
            <div className="d-flex justify-content-center mt-2">
              <div className="p-2">
                <Button
                  description="APPLY"
                  variant="submitBtn"
                  onClick={applyForLeave}
                />
              </div>
              <div className="p-2">
                <Button
                  description="CANCEL"
                  variant="cancelBtn"
                  onClick={onClose}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
export default Leave;
