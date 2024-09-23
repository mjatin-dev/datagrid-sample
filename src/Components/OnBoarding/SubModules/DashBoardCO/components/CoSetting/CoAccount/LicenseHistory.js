import React from "react";
import "./style.css";
import moment from "moment";

const LicenseHistory = ({ list }) => {
  return (
    <>
      <h3>Subscription Status</h3>
      <div className="d-flex history mt-4">
        <table className="license-table">
          <thead>
            <th>Company</th>
            <th>License</th>
            <th style={{ textAlign: "center" }}>Subscription ends</th>
            {/* <th>Download invoice </th> */}
          </thead>
          <tbody className="mt-5">
            {list.length > 0 ? (
              list.map((item) => (
                <tr>
                  <td>{item.company}</td>
                  <td>{item.license}</td>

                  <td align="center">
                    {" "}
                    {moment(item.subscription_end_date).format("DD MMM YYYY")}
                  </td>
                  {/* <td>
                    <Link to="/invoice">Download</Link>
                  </td> */}
                </tr>
              ))
            ) : (
              <span>No List Found</span>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LicenseHistory;
