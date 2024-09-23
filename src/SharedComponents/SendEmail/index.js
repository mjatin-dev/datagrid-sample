/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style.css";

import styles from "Components/Notifications/styles.module.scss";
import { MdClose } from "react-icons/md";
import axiosInstance from "apiServices";

import NoResultFound from "CommonModules/sharedComponents/NoResultFound";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import validator from "validator";
import { IconButton } from "@mui/material";
const customStyle = {
  control: (styles) => ({
    ...styles,
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    minWidth: "300px",
  }),
};

function SendEmail({ handleClose, selectedId, getLogs }) {
  const [state, setState] = useState({
    userList: [],
    depList: [],
    checkedList: [],
    isLoading: true,
    addUser: false,
  });

  const [newEmail, setNewEmail] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setState({
      ...state,
      isLoading: true,
    });

    const response = await Promise.all([fetchDepList(), fetchUserList()]);
    setState({
      ...state,
      depList: response[0].map((item) => ({ ...item, isChecked: false })),
      userList: response[1].map((item) => ({ ...item, isChecked: false })),
      isLoading: false,
    });
  };

  const fetchDepList = async () => {
    try {
      const { data } = await axiosInstance.get(`compliance.api.getUserGroup`);
      if (data) {
        const response = data.message.data.map((item) => ({
          name: item,
          isChecked: false,
        }));
        return response;
      } else {
        return [];
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchUserList = async () => {
    try {
      const { data } = await axiosInstance.get(`compliance.api.getUserList`, {
        params: {
          isFromAssignPage: true,
        },
      });
      if (data) {
        const response = data.message.map((item) => ({
          ...item,
          isChecked: false,
        }));
        return response;
      } else {
        return [];
      }
    } catch (error) {}
  };

  const handleSelectAll = (event, type) => {
    const tempArray = type === "userList" ? state.userList : state.depList;
    const updateTempArray = tempArray.map((item) => ({
      ...item,
      isChecked: event.target.checked,
    }));
    setState({ ...state, [type]: updateTempArray });
  };

  const handleChange = (index, type) => {
    const tempArray = type === "userList" ? state.userList : state.depList;
    tempArray[index].isChecked = !tempArray[index].isChecked;
    setState({ ...state, [type]: tempArray });
  };

  const handleSendMail = async () => {
    const { userList, depList } = state;

    const checkedUserList = userList
      .filter((item) => item.isChecked)
      .map((item) => item.email);

    const checkedDepList = depList
      .filter((item) => item.isChecked)
      .map((item) => item.name);

    if (newEmail.length > 0) {
      const values = newEmail.map((item) => item.value);
      checkedUserList.push(...values);
    }

    if (checkedUserList.length === 0 && checkedDepList.length === 0) {
      toast.error("Please select at least one department or user");
    } else {
      try {
        const response = await axiosInstance.post(
          `compliance.api.sendRegulationsMail`,
          {
            groups: checkedDepList,
            users: checkedUserList,
            circulars: selectedId,
          }
        );
        if (response.status === 200 && response?.data?.message?.success) {
          toast.success("Email has been sent successfully");
          handleClose();
        } else {
          toast.error(
            response?.data?.message?.status_response || "Something went wrong"
          );
        }
      } catch (error) {}
    }
  };

  const onChangeHandle = (event) => {
    setNewEmail(event);
  };

  return (
    <div className="sendEmailContainer">
      <div className={styles.closeBtn}>
        <div className="closeBtn mb-3">
          <IconButton disableTouchRipple={true} onClick={handleClose}>
            <MdClose />
          </IconButton>
        </div>
      </div>
      <div className="box">
        <div className="depBox">
          <p className="depTitle">Group</p>
          {state?.depList?.length > 0 ? (
            <>
              <div className="depListItem">
                <input
                  checked={
                    state.depList.filter((item) => item.isChecked).length ===
                    state.depList.length
                  }
                  className="checkBox"
                  onClick={(event) => {
                    handleSelectAll(event, "depList");
                  }}
                  type="checkbox"
                />
                {state.depList.length ===
                state.depList.filter((item) => item.isChecked).length ? (
                  <p className="text">Unselect All</p>
                ) : (
                  <p className="text">Select All</p>
                )}
              </div>
              <div className="depList">
                {state.depList.map((item, index) => {
                  return (
                    <div className="depListItem">
                      <input
                        checked={item.isChecked}
                        className="checkBox"
                        type="checkbox"
                        onChange={() => {
                          handleChange(index, "depList");
                        }}
                      />
                      <p className="text">{item.name}</p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : state?.depList?.length === 0 && !state?.isLoading ? (
            <NoResultFound text="No group found" />
          ) : state?.isLoading ? (
            <Dots />
          ) : null}
        </div>
        <div className="userBox">
          <div className="userHeader">
            <p className="userTitle">User</p>

            <div className="emailContainer">
              <CreatableSelect
                options={state.userList.map((item) => ({
                  value: item.email,
                  label: item.full_name,
                }))}
                onChange={(e) => {
                  onChangeHandle(e);
                }}
                placeholder="Select User"
                isMulti
                styles={customStyle}
                isValidNewOption={(inputStr) => {
                  return validator.isEmail(inputStr);
                }}
              />
            </div>
          </div>

          {state?.userList?.length > 0 ? (
            <>
              <div className="userListItem">
                <input
                  checked={
                    state.userList.filter((item) => item.isChecked).length ===
                    state.userList.length
                  }
                  className="checkBox"
                  onChange={(event) => {
                    handleSelectAll(event, "userList");
                  }}
                  type="checkbox"
                />
                {state.userList.length ===
                state.userList.filter((item) => item.isChecked).length ? (
                  <p className="text">Unselect All</p>
                ) : (
                  <p className="text">Select All</p>
                )}
              </div>
              <div className="userList">
                {state.userList.map((item, index) => {
                  return (
                    <div className="userListItem">
                      <input
                        checked={item.isChecked}
                        className="checkBox"
                        type="checkbox"
                        onChange={() => {
                          handleChange(index, "userList");
                        }}
                      />
                      <p className="text">{item.full_name}</p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : state?.userList?.length === 0 && !state?.isLoading ? (
            <NoResultFound text="No group found" />
          ) : state?.isLoading ? (
            <Dots />
          ) : null}
        </div>
      </div>
      <div className="sendBtns">
        <button onClick={handleSendMail} className="sendMailBtn">
          Send Mail
        </button>
        <button className="viewBtn" onClick={getLogs}>
          View
        </button>
      </div>
    </div>
  );
}

export default SendEmail;
