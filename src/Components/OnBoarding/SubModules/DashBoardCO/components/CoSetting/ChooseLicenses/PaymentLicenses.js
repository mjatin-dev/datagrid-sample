import React, { useEffect, useState } from "react";

import assignIcon1 from "../../../../../../../assets/Icons/assignIcon.png";
import assignIcon3 from "../../../../../../../assets/Icons/assignIcon2.png";
import assignIcon5 from "../../../../../../../assets/Icons/assignIcon3.png";
import assignIcon2 from "../../../../../../../assets/Icons/assignIcon4.png";
import assignIcon4 from "../../../../../../../assets/Icons/assignIcon5.png";
import { MdExpandMore } from "react-icons/md";
import axiosInstance from "../../../../../../../apiServices";

import { BACKEND_BASE_URL } from "../../../../../../../apiServices/baseurl";

import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setPayment,
  setPaymentType,
  setSelectedLicense,
} from "../../../../../../ExpertReviewModule/Redux/actions";
const PaymentLicenses = ({
  fields = [],
  setIsShowFilter,
  setIsUpgradeYourAccountOpen,
}) => {
  const [listOfLicense, setListOfLicense] = useState([]);
  const [selectedListOfLicenses, setSelectedListOfLicenses] = useState([]);
  const [listCompanyList, setListCompnayList] = useState([]);
  const [selectedLicenses, setSelectedLicenses] = useState([]);

  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    getOwnLicense();
  }, []);

  useEffect(() => {
    if (listOfLicense) {
      getListOfSelectedLicenses();
    }
  }, [listOfLicense]);

  const getListOfSelectedLicenses = () => {
    const temp = [...listOfLicense];
    let tempSelectedList = [];
    let selectList = [];
    var licenseList = [];
    const obj = {};

    for (let count = 0; count < temp.length; count++) {
      for (
        let licenseCount = 0;
        licenseCount < temp[count].license.length;
        licenseCount++
      ) {
        if (temp[count].license[licenseCount].selected) {
          selectList.push(temp[count].license[licenseCount]);
          tempSelectedList.push(temp[count].license[licenseCount]);
        }
      }
    }
    setListCompnayList(licenseList);
    setSelectedListOfLicenses(tempSelectedList);
  };

  const chooseImage = (index) => {
    if (index == 0 || index % 5 == 0) {
      return assignIcon1;
    }
    if (index == 1 || index % 5 == 1) {
      return assignIcon2;
    }
    if (index == 2 || index % 5 == 2) {
      return assignIcon3;
    }
    if (index == 3 || index % 5 == 3) {
      return assignIcon4;
    }
    if (index == 4 || index % 5 == 4) {
      return assignIcon5;
    }
  };

  const getAllLicense = (index) => {
    let temp = [...listOfLicense];
    temp[index].show = !temp[index].show;
    setListOfLicense(temp);
  };

  const selectAllLicense = (index) => {
    let temp = [...listOfLicense];
    const selectedList = [];
    temp[index].selected = !temp[index].selected;
    temp[index].show = temp[index].selected;
    for (let counter = 0; counter < temp[index].license.length; counter++) {
      temp[index].license[counter].selected = temp[index].selected;
    }
    setListOfLicense(temp);
  };

  const selectAllSubLicense = (index, Jindex) => {
    let temp = [...listOfLicense];
    temp[index].license[Jindex].selected =
      !temp[index].license[Jindex].selected;
    setListOfLicense(temp);
  };

  const getOwnLicense = async () => {
    const licenseList = await axiosInstance.get(
      `${BACKEND_BASE_URL}compliance.api.getLicenseList`
    );
    if (licenseList) {
      const { message } = licenseList.data;

      const newLicenseList = message?.map((values) => {
        return {
          industry: values.company,
          show: false,
          selected: false,
          company_id: values.company_id,
          license: values.license.map((licenseValue) => {
            return {
              license: licenseValue,
              total_task: 0,
              show: false,
              company_id: values.company_id,
              company: values.company,
              selected:
                fields &&
                fields.length > 0 &&
                fields.selectedLiecenseIdArray.includes(licenseValue)
                  ? true
                  : false,
            };
          }),
        };
      });

      setListOfLicense(newLicenseList);
    }
  };

  const purchaseLicense = async () => {
    const getAmount = await axiosInstance.post(
      `${BACKEND_BASE_URL}compliance.api.getLicenseAmount`,
      {
        license_details: selectedListOfLicenses,
      }
    );
    if (getAmount) {
      const { message } = getAmount.data;

      const obj = {
        monthly: message.monthly,
        annualy: message.annually,
      };
      dispatch(setPayment([obj]));
      dispatch(setSelectedLicense(selectedListOfLicenses));
      dispatch(setPaymentType("main"));
      setIsShowFilter(false);
      setIsUpgradeYourAccountOpen(true);
    }
  };

  return (
    <>
      <div>
        <div className="px-4 choose-license__top">
          <p className="d-none d-md-block h3 mb-3">Choose license you have</p>
          <p className="d-block d-md-none h3 mb-3">Choose license you have</p>
        </div>
        <div className=" py-4 px-4 license-main license-main__bg--dark">
          {listOfLicense &&
            listOfLicense.map((item, index) => {
              return (
                <div>
                  <div>
                    <div className="row mb-3">
                      <div className="col-6">
                        {" "}
                        <span className="mr-2">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onClick={() => selectAllLicense(index)}
                          />
                        </span>
                        <img
                          src={chooseImage(index)}
                          alt="assignIcon"
                          style={
                            chooseImage(index) == assignIcon4
                              ? { height: 44, width: 44 }
                              : {}
                          }
                        />
                        <span className="ml-2 text-license">
                          {item.industry}
                        </span>
                      </div>
                      <div className="col-4 d-flex align-item-center">
                        {" "}
                        <span>{item.license.length} License </span>
                      </div>
                      <div
                        className="col-2"
                        onClick={() => getAllLicense(index)}
                      >
                        <MdExpandMore
                          className={`license__expand-more-button ${
                            item.show && "rotate-180"
                          }`}
                        />
                      </div>
                    </div>

                    {/* sub license */}
                    {item.show &&
                      item.license.map((licenseItem, Jindex) => {
                        return (
                          <div className="ml-4 mb-3">
                            <div className="row">
                              <div className="col-6">
                                {" "}
                                <span className="mr-2">
                                  <input
                                    type="checkbox"
                                    checked={licenseItem.selected}
                                    onClick={() =>
                                      selectAllSubLicense(index, Jindex)
                                    }
                                  />
                                </span>
                                <span className="ml-2 text-license">
                                  {licenseItem.license}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-2">
          <p style={{ color: "#7A73FF" }}>
            {selectedListOfLicenses && selectedListOfLicenses.length} Licenses
          </p>

          <div className="d-flex justify-content-center">
            <button
              className="upgrade-button"
              onClick={() => purchaseLicense()}
            >
              Purchase License
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentLicenses;
