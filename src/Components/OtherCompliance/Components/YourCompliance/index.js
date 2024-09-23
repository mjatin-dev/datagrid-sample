import React, { useEffect, useState } from "react";
import styles from "../../style.module.scss";
import { IconButton } from "@mui/material";
import { useHistory } from "react-router";
import { MdArrowRight, MdClose, MdSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchYourComplianceChecklistRequest,
  setYourComplianceChecklistDetailsById,
} from "Components/OtherCompliance/redux/actions";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
import NoResultFound from "CommonModules/sharedComponents/NoResultFound";

const YourCompliance = ({ otherComplianceActiveTab }) => {
  const [checklists, setChecklists] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchQuery = useDebounce(searchValue, 500);
  const history = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.otherCompliance?.loading);
  const checklistsResponse = useSelector(
    (state) => state?.otherCompliance?.yourCompliance?.data
  );
  const onSearch = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    setChecklists(checklistsResponse);
  }, [checklistsResponse]);

  useEffect(() => {
    if (checklistsResponse?.length > 0) {
      setChecklists(
        [...checklistsResponse].filter((item) => {
          const data = item?.title?.toLowerCase();
          const query = searchQuery?.toLowerCase();
          return query ? data?.includes(query) : true;
        })
      );
    }
  }, [searchQuery, checklistsResponse]);
  useEffect(() => {
    dispatch(fetchYourComplianceChecklistRequest());
  }, []);
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ height: "60px" }}
      >
        <h4 className="mb-0">{otherComplianceActiveTab?.tabName}</h4>
        <div className="d-flex align-items-center">
          <div
            className={`${
              showSearch ? styles.searchInputContainer : ""
            } mr-3 d-none d-md-flex`}
          >
            {!showSearch && (
              <IconButton
                disableTouchRipple
                onClick={() => setShowSearch(true)}
              >
                <MdSearch className={styles.searchIcon} />
              </IconButton>
            )}
            {showSearch && (
              <>
                <input
                  placeholder="Search..."
                  className={styles.searchInput}
                  type="text"
                  value={searchValue}
                  onChange={onSearch}
                  autoFocus
                />
                <MdSearch className={styles.searchIcon} />
                <IconButton
                  disableTouchRipple={true}
                  onClick={() => {
                    setShowSearch(false);
                    setSearchValue("");
                  }}
                  className={styles.closeSearchIcon}
                >
                  <MdClose />
                </IconButton>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={styles.otherComplianceDataTable}>
        <div
          className={`row no-gutters ${styles.tableHeaderContainer} ${styles.tableRow}`}
        >
          <div className={`col-3 ${styles.tableHeaderColumnTitle}`}>
            Name Of Checklist
          </div>
        </div>
        {loading ? (
          <Dots />
        ) : (
          checklists.map((item) => {
            return (
              <div
                key={`other-compliance--your-compliance--checklist--${item?.title}--${item?.your_compliance_id}`}
                className={`row no-gutters align-items-center ${styles.tableRow} ${styles.tableDataRow}`}
              >
                <div className="col">
                  <p className={styles.dataText}>{item?.title}</p>
                </div>
                <div className="col-1">
                  <IconButton
                    disableTouchRipple
                    disabled={!item?.details?.length}
                    onClick={() => {
                      history.push(`your-compliance/compliance-details`, item);
                      dispatch(setYourComplianceChecklistDetailsById(item));
                    }}
                  >
                    <MdArrowRight />
                  </IconButton>
                </div>
              </div>
            );
          })
        )}
        {!loading && !checklists?.length && (
          <NoResultFound text="No checklist found" />
        )}
      </div>
    </>
  );
};

export default YourCompliance;
