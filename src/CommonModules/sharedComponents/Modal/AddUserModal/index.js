import React, { useEffect, useState } from "react";
import { HiMinusSm, HiPlus } from "react-icons/hi";
import { AiOutlineInfo } from "react-icons/ai";
import cross from "../../../../assets/Icons/closeIcon1.png";

import "./style.css";
import axiosInstance from "../../../../apiServices";
import { BACKEND_BASE_URL } from "../../../../apiServices/baseurl";
import { toast } from "react-toastify";
import {
  setPayment,
  setPaymentType,
  setUserCount,
} from "../../../../Components/ExpertReviewModule/Redux/actions";
import { useDispatch } from "react-redux";

function AddUserModal({
  setAddUserCount,
  addUserCount,
  setAddUser,
  setIsUpgradeYourAccountOpen,
}) {
  const [batchSize, setBatchSize] = useState(0);
  const [batchAmount, setBatchAmount] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    getUserBatchAmount();
  }, []);

  const getUserBatchAmount = async () => {
    try {
      const getUserBatchAmount = await axiosInstance.get(
        `${BACKEND_BASE_URL}compliance.api.getUserBatchSize`
      );
      if (getUserBatchAmount) {
        const { message } = getUserBatchAmount.data;
        setBatchSize(message.batch_size);
        setBatchAmount(message.monthly.amount);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const purchaseUser = async () => {
    try {
      if (addUserCount !== 0) {
        const getAmount = await axiosInstance.post(
          `${BACKEND_BASE_URL}compliance.api.getLicenseAmount`,
          {
            users: addUserCount,
          }
        );
        if (getAmount) {
          const { message } = getAmount.data;
          const obj = {
            monthly: message.monthly,
            annualy: message.annually,
          };
          dispatch(setPayment([obj]));

          setAddUser(false);
          setIsUpgradeYourAccountOpen(true);
          dispatch(setPaymentType("user"));
          dispatch(setUserCount(addUserCount));
        }
      } else {
        toast.error("Please add user");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-main">
        <div className="modal-content">
          <div className="modal-body-container">
            <div className="header">
              <h3>Add User</h3>
              <img src={cross} alt="" onClick={() => setAddUser(false)} />
            </div>
            <div className="select-section">
              <button className="info-button">
                <AiOutlineInfo />
              </button>
              <span className="select-user">
                you can only select users in a batch of {batchSize}
              </span>
            </div>
            <div className="counter-buttons">
              <button
                className="counter"
                onClick={() => setAddUserCount((prev) => prev - 5)}
              >
                <HiMinusSm />
              </button>
              <h2 className="counter-count">
                {addUserCount < 0 ? 0 : addUserCount}
              </h2>
              <button
                className="counter"
                onClick={() => setAddUserCount((prev) => prev + 5)}
              >
                <HiPlus />
              </button>
            </div>

            <div className="account-info">
              <div>
                <span>Amount to pay</span>
                <h3>₹{batchAmount * addUserCount}</h3>
              </div>
              <button className="procced-buy" onClick={purchaseUser}>
                Procceed to buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;
