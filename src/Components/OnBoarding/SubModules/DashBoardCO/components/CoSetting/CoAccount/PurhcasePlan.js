import React, { useState, useEffect } from "react";
import "./style.css";

import UpgradeYourAccount from "../../../../../../PaymentModule/UpgradeYourAccount";
import PaymentLicenses from "../ChooseLicenses/PaymentLicenses";
import HistoryList from "./History";
import axiosInstance from "../../../../../../../apiServices";
import { BACKEND_BASE_URL } from "../../../../../../../apiServices/baseurl";
import {
  setPayment,
  setPaymentType,
  setSelectedLicense,
} from "../../../../../../ExpertReviewModule/Redux/actions";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { MdPermContactCalendar } from "react-icons/md";
import { AiTwotoneEdit } from "react-icons/ai";

import BackDrop from "../../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import CancelSubscriptionModal from "../../../../../../../CommonModules/sharedComponents/Modal/CancelSubsriptionModal";
import moment from "moment";
import AddUserModal from "../../../../../../../CommonModules/sharedComponents/Modal/AddUserModal";
import { toast } from "react-toastify";
import LicenseHistory from "./LicenseHistory";
import { setIsPaymentPlanActive } from "SharedComponents/Dashboard/redux/actions";

function PurhcasePlan() {
  const [isUpgradeYourAccountOpen, setIsUpgradeYourAccountOpen] =
    useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [activePlan, setActivePlan] = useState("monthly");
  const [paymentResponse, setPaymentResponse] = useState({});
  const [subscription, setSubscription] = useState(false);
  const [isPlanExist, setIsPlanExist] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [addUserCount, setAddUserCount] = useState(0);
  const [ownLicense, setOwnLicense] = useState([]);

  const [editLicense, setEditLicense] = useState(false);
  const [enableExpertReview, setEnableExpertReview] = useState(false);

  const [list, setList] = useState(false);
  const [licenseDetail, setLicenseDetail] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getPaymentDetails();
  }, [isUpgradeYourAccountOpen]);

  useEffect(() => {
    getOwnLicense();
  }, []);

  const getOwnLicense = async (isPurchase = false) => {
    setIsLoading(true);
    const licenseList = await axiosInstance.get(
      `${BACKEND_BASE_URL}compliance.api.getLicenseList`
    );
    if (licenseList) {
      const { message } = licenseList.data;
      let tempSelectedList = [];

      const newLicenseList = message?.map((values) => {
        return {
          license: values.license.map((licenseValue) => {
            tempSelectedList.push({
              license: licenseValue,
              total_task: 0,
              show: false,
              company_id: values.company_id,
              company: values.company,
              isExpert: false,
            });
          }),
        };
      });
      setOwnLicense(tempSelectedList);
      !isPurchase && setIsLoading(false);
      isPurchase && purchaseLicense(tempSelectedList);
    } else {
      setIsLoading(false);
    }
  };

  const purchaseLicense = async (licenses) => {
    const getAmount = await axiosInstance.post(
      `${BACKEND_BASE_URL}compliance.api.getLicenseAmount`,
      {
        license_details: licenses,
      }
    );
    if (getAmount) {
      const { message } = getAmount.data;
      const obj = {
        monthly: message.monthly,
        annualy: message.annually,
      };
      dispatch(setPayment([obj]));
      dispatch(setSelectedLicense(licenses));
      dispatch(setPaymentType("main"));
      setIsUpgradeYourAccountOpen(true);
    }
    setIsLoading(false);
  };

  const getPaymentDetails = async () => {
    try {
      const paymentDetail = await axiosInstance.get(
        `${BACKEND_BASE_URL}compliance.api.getPaymentDetails`
      );
      if (paymentDetail.data) {
        const { message } = paymentDetail.data;
        setActivePlan(message.payment_status);
        setPaymentResponse(message);
        const currentDate = moment(new Date()).format("YYYY-MM-DD");

        if (message.next_billing_date > currentDate) {
          setIsPlanExist(true);
          dispatch(setIsPaymentPlanActive(true));

          setLicenseDetail(message.license_details);
        } else {
          setIsPlanExist(false);
          dispatch(setIsPaymentPlanActive(false));
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const closeModal = () => {
    setSubscription(false);
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  });

  useEffect(() => {
    if (enableExpertReview) {
      setIsShowFilter(true);
    }
  }, [enableExpertReview]);

  const pay = async () => {
    setIsLoading(true);
    const getOrderId = await axiosInstance.post(
      `${BACKEND_BASE_URL}compliance.api.createOrder`
    );
    if (getOrderId) {
      const { message } = getOrderId.data;
      setIsLoading(false);
      const options = {
        key: "rzp_test_LgEXXqR3sPSgQX",
        currency: "INR",
        amount: 10,
        name: "License Payment",
        // description: "Test Wallet Transaction",
        // image: "http://localhost:1337/logo.png",
        order_id: message.order_id,
        handler: function (response) {
          const payload = {
            so_id: message.id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          saveOrderDetails(payload);
        },
        error: function (error) {
          console.log(error);
        },
        prefill: {
          name: "Jatin Mehta",
          email: "jatinm@trakiot.in",
          contact: "9877262909",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }
  };

  async function saveOrderDetails(payload) {
    const saveOrder = await axiosInstance.post(
      `${BACKEND_BASE_URL}compliance.api.paymentSuccess`,
      payload
    );
    if (saveOrder) {
      const { message } = saveOrder.data;
      if (message.success) {
        toast.success(message.success_message);
      }
    }
  }

  return (
    <>
      <Modal
        visible={isShowFilter}
        width={1000}
        footer={null}
        //onOk={this.handleOk}
        onCancel={() => setIsShowFilter(false)}
      >
        <div className="">
          <PaymentLicenses
            setIsShowFilter={setIsShowFilter}
            setIsUpgradeYourAccountOpen={setIsUpgradeYourAccountOpen}
          />
        </div>
      </Modal>

      <Modal
        visible={showHistory}
        width={1000}
        footer={null}
        //onOk={this.handleOk}
        onCancel={() => setShowHistory(false)}
      >
        <div className="">
          <HistoryList
            setIsUpgradeYourAccountOpen={setIsUpgradeYourAccountOpen}
            setIsLoading={setIsLoading}
            setShowHistory={setShowHistory}
          />
        </div>
      </Modal>

      {subscription && <CancelSubscriptionModal closeModal={closeModal} />}

      {addUser && (
        <AddUserModal
          addUserCount={addUserCount}
          setAddUserCount={setAddUserCount}
          setAddUser={setAddUser}
          setIsUpgradeYourAccountOpen={setIsUpgradeYourAccountOpen}
        />
      )}

      <Modal
        visible={list}
        width={1000}
        footer={null}
        //onOk={this.handleOk}
        onCancel={() => setList(false)}
      >
        <div className="">
          <LicenseHistory list={licenseDetail} />
        </div>
      </Modal>

      <div className="co-account ">
        <BackDrop isLoading={loading} />

        {!isUpgradeYourAccountOpen ? (
          <>
            <div className="d-flex">
              {/* <div className="col-10 col-md-10 col-xl-9 col-sm-8 pl-0">
                <div className="personal-mgt-title">Account</div>
              </div> */}
              {/* <div className="col-2 col-md-2 col-xl-3 col-sm-4">
                <button className="deactivate-account">
                  Deactivate Account
                </button>
              </div> */}
            </div>

            {/* <div class="border-header d-none d-sm-block"></div> */}
            <div className="payment-container w-100">
              <div className="d-flex payment-plan-header">
                <div
                  className="col-9 col-md-9 col-xl-9 payment-plan">
                  <p>Payment</p>

                  {!isPlanExist && (
                    <a
                      href="javascript:void(0)"
                      className="history-anchor"
                      onClick={() => setShowHistory(true)}
                    >
                      History
                    </a>
                  )}
                </div>
             
                  <div className="col-10 col-md-10 col-xl-3">
                    <button onClick={() => getOwnLicense(true)}>
                     {isPlanExist? "Renew Now" : "Upgrade Now"} 
                    </button>
                  </div>
           
              </div>
              <div className="d-flex flex-column flex-md-row payment-plan-body">
                <div className="col-12 col-md-6 ">
                  <div className="d-flex justify-content-between paymentDetail">
                    <p>Payment Type</p>
                    <div className="paymentOption" style={{display:"flex"}}>
                      {" "}
                      <button
                        className={`${
                          activePlan === "monthly" ? "active" : "deactive"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        className={`${
                          activePlan === "annually" ? "active" : "deactive"
                        }`}
                      >
                        Annual
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <p>Next Billing Date</p>
                    <span>
                      {moment(paymentResponse?.next_billing_date).format(
                        "DD MMM YYYY"
                      )}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <p>Payment Method</p>
                    <span>{paymentResponse?.payment_method}</span>
                  </div>
                </div>

                <div className="col-12 col-md-6 ">
                  <div className="d-flex justify-content-between">
                    <p>Number Of Users</p>
                    <span>
                      {paymentResponse?.no_of_users || 0}/
                      {paymentResponse?.total_users || 0}{" "}
                      {isPlanExist && (
                        <MdPermContactCalendar
                          color="#7a73ff"
                          fontSize={25}
                          className=" edit-icon"
                          title="Add Users"
                          onClick={() => setAddUser(true)}
                        />
                      )}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>Your Licenses</p>

                    <div>
                      <span>
                        {paymentResponse?.license}{" "}
                        <AiTwotoneEdit
                          className="edit-icon"
                          color="#7a73ff"
                          title="Edit License"
                          onClick={() => setList(true)}
                        />
                      </span>
                    </div>
                  </div>

                  {isPlanExist && (
                    <div className="d-flex justify-content-between">
                      <p></p>
                      <a
                        href="javascript:void(0)"
                        className="history-anchor"
                        onClick={() => setShowHistory(true)}
                      >
                        History
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="license-container">
              <div className="d-flex license-plan-header">
                <div className="col-10 col-md-10 col-xl-9 license-plan">
                  <div className="d-flex">
                    <div>
                      <p>ComplianceSutra Expert License Review (8)</p>
                    </div>
                    <div className="ml-4 mt-1">
                      <label className="switch" id="weekly">
                        <input
                          htmlFor="weekly"
                          id="weeklySetting"
                          type="checkbox"
                          value={enableExpertReview}
                          onClick={() =>
                            setEnableExpertReview(!enableExpertReview)
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <div></div>
                </div>
                <div className="col-3 col-md-3 col-xl-3">
                  <button onClick={() => setIsShowFilter(true)}>
                    Add License
                  </button>
                </div>
              </div>
              <div className="border-class">
                <div class="border-header d-none d-sm-block"></div>
              </div>
              <div className="d-flex license-plan-body">
                <table className="license-table">
                  <thead>
                    <th>Services</th>
                    <th>Licenses</th>
                    <th>Due Date</th>
                    <th align="center"> Enable/Disable</th>
                  </thead>
                  <tbody className="mt-5">
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>PMS : Portfolio Manager</td>
                      <td>GST</td>
                      <td>12-02-2022</td>
                      <td align="center">
                        {" "}
                        <div className="">
                          <label className="switch" id="weekly">
                            <input
                              htmlFor="weekly"
                              id="weeklySetting"
                              type="checkbox"
                              checked={false}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </>
        ) : (
          <UpgradeYourAccount
            setIsUpgradeYourAccountOpen={setIsUpgradeYourAccountOpen}
            isUpgradeYourAccountOpen={isUpgradeYourAccountOpen}
            setIsShowFilter={setIsShowFilter}
            isShowFilter
          />
        )}
      </div>
    </>
  );
}
export default PurhcasePlan;
