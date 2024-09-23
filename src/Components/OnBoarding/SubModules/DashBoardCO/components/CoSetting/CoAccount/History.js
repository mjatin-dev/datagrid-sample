import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { FaRegClock } from "react-icons/fa";
import axiosInstance from "../../../../../../../apiServices";
import { BACKEND_BASE_URL } from "../../../../../../../apiServices/baseurl";
import { toast } from "react-toastify";
import moment from "moment";
import { FcDownload } from "react-icons/fc";
import {
  setPayment,
  setPaymentType,
  setSelectedLicense,
} from "../../../../../../ExpertReviewModule/Redux/actions";

import { useDispatch } from "react-redux";

const HistoryList = ({
  setIsUpgradeYourAccountOpen,
  setIsLoading,
  setShowHistory,
}) => {
  const [historyList, setHisotryList] = useState([]);
  const [detail, setDetail] = useState();
  const downloadAnchor = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const getData = await axiosInstance.get(
        `${BACKEND_BASE_URL}compliance.api.getPaymentHistory`
      );
      if (getData) {
        const { message } = getData.data;
        if (message.data.length > 0) {
          setHisotryList(message.data);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const downloadInvoice = async (item) => {
    const getInvoice = await axiosInstance.post(
      `${BACKEND_BASE_URL}compliance.api.downloadSalesInvoice`,
      { name: item }
    );
    if (getInvoice) {
      const { message } = getInvoice.data;
      if (message) {
        console.log(message.encoded_string);
        setDetail({
          encoded_string: message.encoded_string,
          file_name: message.file_name,
        });

        downloadAnchor.current.click();
      }
    }
  };

  const purchaseLicense = async (item) => {
    const licenses = [
      {
        license: item.license,
        company_id: item.company_id,
        company: item.company_name,
      },
    ];

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
    setShowHistory(false);
    setIsLoading(false);
  };
  return (
    <>
      <h3>History</h3>
      <div className="d-flex history mt-4">
        <table className="license-table">
          <thead>
            <th>Company</th>
            <th>License</th>
            <th align="center">Plan</th>
            {/* <th align="center">No of Users</th> */}
            <th>Start Date</th>
            <th>End Date</th>
            <th>Fees</th>
            <th align="right">Renew Plan</th>
            <th>Download</th>
          </thead>
          <tbody className="mt-5">
            {historyList.length > 0 ? (
              historyList.map((item) => (
                <tr>
                  <td>{item.company_name}</td>
                  <td>
                    {item.license || "-"}{" "}
                    <span style={{ color: "#7A73FF" }}></span>
                  </td>
                  <td align="center"> {item.subscription_type}</td>
                  {/* <td align="center">10</td> */}
                  <td> {moment(item.start_date).format("DD MMM YYYY")}</td>
                  <td> {moment(item.end_date).format("DD MMM YYYY")}</td>
                  <td>{item.amount || 0}</td>
                  <td align="center">
                    {item.is_renewable === 1 ? (
                      <div
                        style={{
                          backgroundColor: "#7A73FF",
                          width: "25px",
                          height: "25px",
                          borderRadius: "6px",
                        }}
                      >
                        <FaRegClock
                          color="#fff"
                          style={{ cursor: "pointer" }}
                          onClick={() => purchaseLicense(item)}
                        />
                      </div>
                    ) : (
                      "--"
                    )}
                  </td>
                  <td align="center">
                    <button
                      onClick={() => downloadInvoice(item.sales_invoice)}
                      style={{
                        border: "none",
                        borderRadius: "6px",
                      }}
                    >
                      <FcDownload color="#fff" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <span>No History Found</span>
            )}
          </tbody>
        </table>
        <a
          style={{ display: "none" }}
          href={`data:application/${
            detail && detail?.file_name.split(".").pop()
          };base64,${detail?.file_name && detail?.encoded_string}`}
          className="download-file"
          download={detail && detail?.file_name}
          target="_blank"
          rel="noreferrer"
          ref={downloadAnchor}
        >
          Download File
        </a>
      </div>
    </>
  );
};

export default HistoryList;
