import React, { useEffect, useState } from "react";
import styles from "../../style.module.scss";
import Button from "Components/Audit/components/Buttons/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLicensesRequest,
  updateSelectedLicenses,
} from "Components/OtherCompliance/redux/actions";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { useHistory } from "react-router";
import NoResultFound from "CommonModules/sharedComponents/NoResultFound";
const YourLicenses = ({ otherComplianceActiveTab }) => {
  const dispatch = useDispatch();
  const [selectedLicenses, setSelectedLicenses] = useState([]);
  const licenses = useSelector(
    (state) => state?.otherCompliance?.licenses?.data
  );
  const savedSelectedLicenses = useSelector(
    (state) => state?.otherCompliance?.licenses?.selectedLicenses
  );
  const history = useHistory();
  const isLoading = useSelector((state) => state?.otherCompliance?.loading);

  useEffect(() => {
    dispatch(fetchLicensesRequest());
  }, []);

  useEffect(() => {
    if (!selectedLicenses.length && savedSelectedLicenses?.length > 0) {
      setSelectedLicenses(savedSelectedLicenses);
    }
  }, [savedSelectedLicenses]);
  return (
    <div>
      <h4 className="mb-0">{otherComplianceActiveTab?.tabName}</h4>
      <div className={styles.otherComplianceDataTable}>
        <div
          className={`row no-gutters ${styles.tableHeaderContainer} ${styles.tableRow}`}
        >
          <div className={`col-3 ${styles.tableHeaderColumnTitle}`}>
            License Type
          </div>
        </div>
        {isLoading ? (
          <Dots />
        ) : (
          <>
            <div className={` ${styles.tableRow} ${styles.licenseListGrid}`}>
              {licenses.map((data, index) => {
                const licenseName = data.license;
                return (
                  <div
                    className={`d-flex align-items-center justify-content-between ${styles.licenseCheckboxContainer}`}
                  >
                    <label
                      className="mb-0"
                      htmlFor={`other-compliance-license-${index}-${licenseName}`}
                    >
                      {licenseName}
                    </label>
                    <input
                      id={`other-compliance-license-${index}-${licenseName}`}
                      type="checkbox"
                      checked={selectedLicenses.includes(licenseName)}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          setSelectedLicenses(
                            [...selectedLicenses].filter(
                              (license) => license !== licenseName
                            )
                          );
                        } else {
                          setSelectedLicenses([
                            ...selectedLicenses,
                            licenseName,
                          ]);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {licenses?.length > 0 && (
              <div className="w-100 d-flex align-items-center justify-content-center">
                <Button
                  description="Submit"
                  disabled={!selectedLicenses?.length}
                  onClick={() => {
                    dispatch(updateSelectedLicenses(selectedLicenses));
                    history.push(history.location.pathname + "your-checklist");
                  }}
                />
              </div>
            )}
          </>
        )}

        {!isLoading && !licenses?.length && (
          <NoResultFound text="No license type found" />
        )}
      </div>
    </div>
  );
};

export default YourLicenses;
