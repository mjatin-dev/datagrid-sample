import React, { useEffect } from "react";
import styles from "../../style.module.scss";
import { IconButton } from "@mui/material";
import { MdArrowRight } from "react-icons/md";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChecklistRequest,
  setChecklistDetailsById,
} from "Components/OtherCompliance/redux/actions";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import NoResultFound from "CommonModules/sharedComponents/NoResultFound";
// const checklists = [
//   {
//     id: 1,
//     name: "BSE Checklist",
//     details: [
//       { key: "Account Opening", value: "Advance Tax" },
//       {
//         key: "Account Closure",
//         value: "Received Stamp on Closure Request form",
//       },
//       { key: "DIS Issuance", value: "Received Stamp" },
//       { key: "Modification", value: "Received Stamp" },
//       { key: "Demat Rejection", value: "RTA Memo" },
//     ],
//   },
//   {
//     id: 2,
//     name: "NSE Checklist",
//     details: [
//       { key: "Account Opening", value: "Advance Tax" },
//       {
//         key: "Account Closure",
//         value: "Received Stamp on Closure Request form",
//       },
//       { key: "DIS Issuance", value: "Received Stamp" },
//       { key: "Modification", value: "Received Stamp" },
//       { key: "Demat Rejection", value: "RTA Memo" },
//     ],
//   },
// ];
const YourChecklist = ({ otherComplianceActiveTab }) => {
  const dispatch = useDispatch();
  const selectedLicenses = useSelector(
    (state) => state?.otherCompliance?.licenses?.selectedLicenses
  );
  const loading = useSelector((state) => state?.otherCompliance?.loading);
  const checklists = useSelector(
    (state) => state?.otherCompliance?.checklist?.data
  );

  const history = useHistory();
  useEffect(() => {
    if (selectedLicenses && selectedLicenses.length > 0) {
      dispatch(fetchChecklistRequest(selectedLicenses));
    }
  }, []);

  return (
    <div>
      <h4 className="mb-0">{otherComplianceActiveTab?.tabName}</h4>
      <div className={styles.otherComplianceDataTable}>
        <div
          className={`row no-gutters ${styles.tableHeaderContainer} ${styles.tableRow}`}
        >
          <div className={`col-3 ${styles.tableHeaderColumnTitle}`}>
            Checklist Type
          </div>
        </div>
        {loading ? (
          <Dots />
        ) : (
          checklists.map((item) => {
            return (
              <div
                key={`other-compliance--checklist--${item.checklist_id}`}
                className={`row no-gutters align-items-center ${styles.tableRow} ${styles.tableDataRow}`}
              >
                <div className="col">
                  <p className={styles.dataText}>{item.license} Checklist</p>
                </div>
                <div className="col-1">
                  <IconButton
                    disableTouchRipple
                    disabled={!item?.details?.length}
                    onClick={() => {
                      history.push(`your-checklist/checklist-details`, item);
                      dispatch(setChecklistDetailsById(item));
                    }}
                  >
                    <MdArrowRight />
                  </IconButton>
                </div>
              </div>
            );
          })
        )}

        {!selectedLicenses?.length && (
          <NoResultFound text="Please choose licenses to see checklist" />
        )}
        {!loading && !checklists?.length && selectedLicenses?.length > 0 && (
          <NoResultFound text="No checklist found" />
        )}
      </div>
    </div>
  );
};

export default YourChecklist;
