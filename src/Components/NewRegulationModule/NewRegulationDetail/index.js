import React from "react";
import { Link } from "react-router-dom";

import closeIcon from "../../../assets/Icons/closeIcon.png";
import { useRouteMatch } from "react-router";
import moment from "moment";
import { onFileDownload } from "../../../CommonModules/helpers/file.helper";
const NewRegulationDetail = ({
  isShowRegulationDetail,
  changeShowRegulationDetail,
  newRegulationDetail,
}) => {
  const detail = newRegulationDetail;
  const { path } = useRouteMatch();
  return (
    <div
      className={`filter-popup detail-popup ${
        isShowRegulationDetail && "popup-open"
      }`}
      style={{
        boxShadow: isShowRegulationDetail
          ? "1px 1px 9999px 9999px rgba(0,0,0,0.7)"
          : "none",
      }}
    >
      <div className="container">
        <img
          src={closeIcon}
          alt="close-icon"
          onClick={changeShowRegulationDetail}
          style={{
            position: "absolute",
            top: "21px",
            left: "-21px",
            cursor: "pointer",
          }}
        />
        <h3 className="mb-2">{detail?.title}</h3>
        <div className="w-100 d-flex justify-content-start mb-4">
          <span className="license-code">{detail?.circular_number}</span>
          <span className="date ml-3">
            {detail?.date_issued &&
              moment(detail?.date_issued).format("DD MMM YYYY")}
          </span>
        </div>
        <div className="detail-popup-main-content">
          <div
            dangerouslySetInnerHTML={{
              __html: detail?.description,
            }}
          ></div>
          <p>
            {/* For issuer link:{" "} */}
            <a
              href={detail?.circular_link}
              className="download-file"
              target="blank"
            >
              Issuer Link
            </a>
          </p>
        </div>

        <div className="detail-popup-main-footer">
          <p>Tags:</p>
          <div className="detail-popup-main-footer-labels">
            <div className="tags">
              <div className="tag-buttons flex-grow-1">
                {detail?.tags &&
                  detail?.tags.map((item) => (
                    <button className="tags-button">{item}</button>
                  ))}
              </div>
              <div className="mt-3">
                {detail?.file_details?.length > 0 && (
                  <button
                    onClick={() =>
                      onFileDownload(detail?.file_details[0].file_id)
                    }
                    className="download-file"
                  >
                    Download File
                  </button>
                )}
                {detail?.quiz && (
                  <Link
                    to={{
                      pathname: path + "/quiz",
                      state: {
                        circular_no: detail?.name,
                      },
                    }}
                    className="download-file ml-3"
                  >
                    Quiz
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRegulationDetail;
