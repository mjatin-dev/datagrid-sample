import React, { useState, useEffect } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useSelector } from "react-redux";
import closeBlack from "../../../assets/Icons/closeBlack.png";
import AddUserModal from "../../../CommonModules/sharedComponents/Modal/AddUserModal";
import "./style.css";

import { AiTwotoneEdit } from "react-icons/ai";
import axiosInstance from "../../../apiServices";
import { BACKEND_BASE_URL, razorpay_key } from "../../../apiServices/baseurl";
import BackDrop from "../../../CommonModules/sharedComponents/Loader/BackDrop";
import { toast, ToastContainer } from "react-toastify";
import { Modal } from "antd";
import Select from "react-select";
import EditLicense from "../../OnBoarding/SubModules/DashBoardCO/components/CoSetting/ChooseLicenses/EditLicenses";
import CreatableSelect from "react-select/creatable";

const UpgradeYourAccount = ({
  handleClose,
  isSliderCheck,
  setIsUpgradeYourAccountOpen,
  isUpgradeYourAccountOpen,
}) => {
  const state = useSelector((state) => state);
  const [addUser, setAddUser] = useState(false);
  const [addUserCount, setAddUserCount] = useState(0);

  const [activePlan, setActivePlan] = useState("monthly");
  const [choosedPlan, setChoosedPlan] = useState({});

  const [planDetail, setPlanDetail] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);

  const [paymentType, setPaymentType] = useState("");
  const [userCount, setUserCount] = useState(0);

  const [choosedLicense, setChoosedLicense] = useState([]);

  const [gstNo, setGstNo] = useState("");
  const [gstList, setGstList] = useState([]);
  const [couponCode, setCouponCode] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponDetail, setCouponDetail] = useState({
    discount_percentage: "",
    discount_amount: 0,
    final_amount: "",
    taxes_and_charges: 0,
    total_amount: 0,
  });
  const totalAmount = state?.PaymentReducer?.expertReviewLicenseDetail?.plan;

  useEffect(() => {
    const selectedLicense = state?.PaymentReducer?.paymentDetail;
    const licenses = state?.PaymentReducer?.selectedLicense;
    const paymentType = state?.PaymentReducer.paymentType;
    const count = state?.PaymentReducer.userCount;

    const { monthly } =
      selectedLicense && selectedLicense?.length > 0 && selectedLicense[0];
    setChoosedPlan(monthly);
    setPlanDetail(selectedLicense[0]);
    setPaymentType(paymentType);
    setUserCount(count);
    setChoosedLicense(licenses);
  }, [state?.PaymentReducer]);

  useEffect(() => {
    getCompanyList();
    fetchCouponCode();
  }, []);

  const getCompanyList = async () => {
    const listResponse = await axiosInstance.get(
      `${BACKEND_BASE_URL}compliance.api.getCompanyList`
    );
    if (listResponse) {
      const { message } = listResponse.data;

      const list = message.map((item) => {
        return {
          value: item.company_id,
          label: item.company_list,
        };
      });

      setGstList(list);
    }
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

  const changePlan = (type) => {
    const { monthly, annualy } = planDetail;
    if (type === "monthly") {
      setChoosedPlan(monthly);
    } else {
      setChoosedPlan(annualy);
    }

    setCouponDetail({
      discount_percentage: 0,
      discount_amount: 0,
      final_amount: "",
      taxes_and_charges: 0,
    });
    setAppliedCoupon("");

    setActivePlan(type);
  };

  const pay = async () => {
    try {
      let getOrderId;

      if (gstNo === "") {
        toast.error("Please select company for invoice.");
      } else {
        if (paymentType === "main") {
          setIsLoading(true);
          getOrderId = await axiosInstance.post(
            `${BACKEND_BASE_URL}compliance.api.createOrder`,
            {
              license_details: choosedLicense,
              order_type: activePlan,
              invoice_company: gstNo?.value,
              amount: choosedPlan?.amount,
              coupon_code: appliedCoupon.value,
            }
          );
        } else {
          getOrderId = await axiosInstance.post(
            `${BACKEND_BASE_URL}compliance.api.createOrder`,
            {
              users: userCount,
              order_type: activePlan,
              invoice_company: gstNo.value,
              coupon_code: appliedCoupon.value,
            }
          );
        }

        if (getOrderId) {
          const { message } = getOrderId.data;
          setIsLoading(false);
          if (choosedPlan?.amount <= 0) {
            const payload = {
              so_id: message.id,
              razorpay_order_id: "",
              razorpay_payment_id: "",
              razorpay_signature: "",
            };

            setIsLoading(true);
            saveOrderDetails(payload);
          } else {
            const options = {
              key: razorpay_key,
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

                setIsLoading(true);
                saveOrderDetails(payload);
              },
              error: function (error) {
                console.log(error);
                setIsLoading(false);
              },
              prefill: {
                name: message.name,
                email: message.email,
                contact: message.mobile_no,
              },
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
          }
        } else {
          setIsLoading(false);
          toast.error("Something went wrong!!");
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
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
        setTimeout(() => {
          toast.success(message.success_message);
          setIsUpgradeYourAccountOpen(false);
          setIsLoading(false);
        }, 3000);
      } else {
        setIsLoading(false);
      }
    }
  }

  const fetchCouponCode = async () => {
    const data = await axiosInstance.get(`/compliance.api.getCouponCode`);
    if (data) {
      const coupons = data.data.message;
      setCouponCode(coupons);
    }
  };

  const handleApplyCoupon = async () => {
    const response = await axiosInstance.post(
      "/compliance.api.getDiscountAmount",
      {
        coupon: appliedCoupon.value,
        amount: choosedPlan?.amount,
      }
    );
    if (response.status === 200 && response?.data?.message?.status) {
      setCouponDetail(response?.data?.message?.data);
    } else {
      toast.error(
        response?.data?.message?.status_response || "Expired or Invalid Coupon"
      );
    }
  };

  const customStyle = {
    control: (styles) => ({
      ...styles,
      width: "150px",
      height: "30px",
      borderRadius: "10px",
      minWidth: "150px",
    }),
  };

  return (
    <>
      <ToastContainer />
      <Modal
        visible={isEdit}
        width={1000}
        footer={null}
        //onOk={this.handleOk}
        onCancel={() => setEdit(false)}
      >
        <div className="">
          <EditLicense
            setEdit={setEdit}
            setIsUpgradeYourAccountOpen={setIsUpgradeYourAccountOpen}
            setCouponDetail={setCouponDetail}
            setAppliedCoupon={setAppliedCoupon}
          />
        </div>
      </Modal>
      <div className="upgrade-your-account">
        <BackDrop isLoading={loading} />
        {addUser && (
          <AddUserModal
            setAddUser={setAddUser}
            setAddUserCount={setAddUserCount}
          />
        )}
        <div className="d-flex">
          <div className="col-10 col-sm-12 col-md-12 col-xl-12 pl-0">
            <div className="personal-mgt-title">
              <span
                className="arrow-left cursor-pointer"
                onClick={() =>
                  setIsUpgradeYourAccountOpen(!isUpgradeYourAccountOpen)
                }
              >
                <BiLeftArrowAlt />
              </span>
              Upgrade Your Account
            </div>
          </div>
          <div className="col-2 col-sm-12 col-md-12 col-xl-12 d-block d-sm-none">
            <img
              className="close-icon-personal"
              src={closeBlack}
              alt="close Black"
              onClick={() => {
                handleClose(false);
              }}
            />
          </div>
        </div>
        <div class="border-header d-none d-sm-block"></div>
        <div className="d-flex justify-content-center">
          <div className="payment-option">
            {" "}
            <button
              className={`${activePlan === "monthly" ? "active" : "deactive"}`}
              onClick={() => changePlan("monthly")}
            >
              Monthly
            </button>
            <button
              className={`${activePlan === "annualy" ? "active" : "deactive"}`}
              onClick={() => changePlan("annualy")}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div className="col-md-10 scroll-section pr-5">
            <div>
              <div className="channel-div">
                <div className="row pl-0">
                  <div className="col-12 plans-container d-flex justify-content-center"></div>
                </div>

                {/* {paymentType === "main" && (
                  <div className="payment-total mt-3 d-flex">
                    <div className="col-6 col-md-6 d-flex justify-content-between">
                      <div className="know-more">
                        <p className="p-0 m-0">Enable Expert Review</p>
                        <span>Know more</span>
                      </div>

                      <div className="mt-2 ml-1">
                        <label class="switch" id="licenses">
                          <input
                            htmlFor="licenses"
                            id="licenseSetting"
                            type="checkbox"
                            checked={isSliderCheck ? true : false}
                            onClick={() => onSliderChange()}
                          />
                          <span class="slider round"></span>
                        </label>
                      </div>
                    </div>
                    <div className="col-6 col-md-6 d-flex justify-content-between">
                      <div style={{ borderRight: "2px solid #E2E2E2" }}></div>
                      <div className="know-more">
                        <p className="p-0 m-0">User Access</p>
                        <span className="p-0 m-0">Know more</span>
                      </div>

                      <div>
                        <span>10 Users</span>
                        <MdPermContactCalendar color="#7a73ff" fontSize={20} />
                      </div>
                    </div>
                  </div>
                )} */}
              </div>

              <div className="payment-total">
                {paymentType === "main" && (
                  <div className="payment-detail-plan mt-4">
                    <div className="edit-container d-flex flex-column flex-md-row">
                      <h2 className="payment-type">
                        Licences({choosedLicense?.length})
                      </h2>

                      <AiTwotoneEdit
                        className="mt-1 ml-3 edit-icon"
                        onClick={() => {
                          setEdit(true);
                        }}
                        color="#7a73ff"
                        title="Edit License"
                      />
                    </div>
                    <h2 className="payment-trail">₹ {choosedPlan?.amount}</h2>
                  </div>
                )}

                <div className="payment-detail-plan">
                  <div className="discount">
                    <h2 className="payment-type">
                      Discount (
                      {couponDetail?.discount_percentage
                        ? couponDetail?.discount_percentage
                        : 0}
                      %)
                    </h2>
                    <div className=" addCoupon">
                      <CreatableSelect
                        options={couponCode.map((item) => ({
                          value: item,
                          label: item,
                        }))}
                        value={appliedCoupon}
                        placeholder="Coupon"
                        isClearable
                        styles={customStyle}
                        onChange={(e) => {
                          if (e) {
                            setAppliedCoupon(e);
                          } else {
                            setCouponDetail({
                              discount_percentage: "",
                              discount_amount: 0,
                              final_amount: "",
                            });
                            setAppliedCoupon("");
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="applyCouponBtn"
                    >
                      Apply
                    </button>
                  </div>

                  <h2 className="payment-trail">
                    ₹{" "}
                    {couponDetail?.discount_amount
                      ? couponDetail?.discount_amount
                      : 0}
                  </h2>
                </div>

                <div className="payment-detail-plan">
                  <h2 className="payment-type">Net Amount</h2>
                  <h2 className="payment-trail">
                    ₹ {choosedPlan?.amount - couponDetail?.discount_amount}
                  </h2>
                </div>

                <div className="payment-detail-plan">
                  <h2 className="payment-type">Taxes</h2>
                  <h2 className="payment-trail">
                    ₹
                    {couponDetail.taxes_and_charges
                      ? couponDetail.taxes_and_charges
                      : choosedPlan.taxes_and_charges}
                  </h2>
                </div>

                {paymentType === "main" && (
                  <>
                    <div className="payment-detail-plan">
                      <div className="">
                        <p className="highlighted mb-0">
                          {choosedPlan.trial_user === 0
                            ? "Free"
                            : choosedPlan.trial_user}{" "}
                          Users{" "}
                          <small className="unselected">
                            (You get {choosedPlan.trial_user} free users)
                          </small>
                        </p>
                      </div>
                      <h2 className="payment-trail green">
                        {choosedPlan.trial_user === 0
                          ? "Free"
                          : `₹${addUserCount * 1000}`}
                      </h2>
                    </div>
                    <div className="payment-detail-plan mb-2">
                      <div className="acc-div">
                        <div className="licences-toggle d-flex align-items-center">
                          <p className="highlighted mb-0 d-inline d-md-block">
                            Expert Review
                          </p>
                        </div>
                        {/* <button className="edit-button m-0">KNOW MORE</button> */}
                      </div>
                      <h2 className="payment-trail">
                        {isSliderCheck ? totalAmount?.TotalAmt : "N/A"}
                      </h2>
                    </div>
                  </>
                )}

                <div className="payment-detail-plan">
                  <div className="">
                    <p className="highlighted mb-0 d-inline d-md-block">
                      Select Company for Invoice
                      <span style={{ color: "red" }}>*</span>
                    </p>
                  </div>
                  <div style={{ width: "200px" }}>
                    <Select options={gstList} onChange={(e) => setGstNo(e)} />
                  </div>
                </div>

                <div
                  className="payment-detail-plan"
                  style={{ borderBottom: "0.5px dashed #000000" }}
                ></div>

                <div
                  className="payment-detail-plan mt-2"
                  style={{ borderBottom: "2px solid dashed" }}
                >
                  <p className="highlighted mb-0">Total Amount</p>
                  <h4>
                    ₹
                    {choosedPlan.amount +
                      (couponDetail.taxes_and_charges
                        ? couponDetail.taxes_and_charges
                        : choosedPlan.taxes_and_charges) -
                      couponDetail.discount_amount}
                  </h4>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center mt-3">
              <button className="upgrade-button " onClick={() => pay()}>
                proceed to payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpgradeYourAccount;
