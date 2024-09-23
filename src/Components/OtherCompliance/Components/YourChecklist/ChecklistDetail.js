import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory } from "react-router";
import styles from "../../style.module.scss";
import Button from "Components/Audit/components/Buttons/Button";
import CreateChecklistModal from "./CreateChecklist";
import ReferenceModal from "./ReferenceModal";
import { useDispatch, useSelector } from "react-redux";
import { setChecklistDetailsById } from "Components/OtherCompliance/redux/actions";
const ChecklistDetail = () => {
  const [references, setReferences] = useState([]);
  const [isShowAddChecklistModal, setIsShowAddChecklistModal] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const checklistData = useSelector(
    (state) => state?.otherCompliance?.checklist?.checklistDetailsById
  );

  useEffect(() => {
    if (!checklistData) history.goBack();
  }, []);

  return (
    <>
      <ReferenceModal
        visible={references.length > 0}
        onClose={() => setReferences([])}
        data={references}
      />
      <CreateChecklistModal
        visible={isShowAddChecklistModal}
        onClose={() => setIsShowAddChecklistModal(false)}
        checklist_id={checklistData.checklist_id}
      />
      <div className="d-flex align-items-center">
        <IconButton
          className="mr-1"
          onClick={() => {
            dispatch(setChecklistDetailsById({}));
            history.goBack();
          }}
        >
          <MdKeyboardArrowLeft color="#000" />
        </IconButton>
        <h4 className="mb-0">{checklistData.license} Checklist</h4>
      </div>
      <div className="d-flex align-items-center justify-content-end">
        <Button
          onClick={() => setIsShowAddChecklistModal(true)}
          description="+ Create Your Checklist"
          variant="stroke"
          size=""
        />
      </div>
      <div className={styles.otherComplianceDataTable}>
        <div
          className={`row no-gutters ${styles.tableHeaderContainer} ${styles.tableRow}`}
        >
          <div className={`col-4 ${styles.tableHeaderColumnTitle}`}>
            Section Name
          </div>
          <div className={`col-6 ${styles.tableHeaderColumnTitle}`}>
            Checkpoint
          </div>
          <div className={`col-2 ${styles.tableHeaderColumnTitle}`}>
            Reference
          </div>
        </div>
        {checklistData?.details?.map((item, index) => {
          return (
            <div
              key={`other-compliance--checklist-details--${checklistData.checklist_id}--${index}`}
              className={`row no-gutters align-items-center ${styles.tableRow} ${styles.tableDataRow}`}
            >
              <div className="col-4">
                <p className={styles.dataText}>{item?.heading}</p>
              </div>
              <div className="col-6">
                <p className={styles.dataText}>{item?.checkpoint}</p>
              </div>
              <div className="col-2">
                {item?.reference_details?.length > 0 && (
                  <Button
                    size=""
                    className={styles.button}
                    disabled={!item?.reference_details?.length}
                    onClick={() => setReferences(item?.reference_details || [])}
                    description="View"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ChecklistDetail;
