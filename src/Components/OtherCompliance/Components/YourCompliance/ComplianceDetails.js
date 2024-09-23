import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import styles from "../../style.module.scss";
import { MdCheck, MdClose, MdEdit, MdKeyboardArrowLeft } from "react-icons/md";
import { Input } from "CommonModules/sharedComponents/Inputs";
import { toast } from "react-toastify";
import { updateYourComplianceChecklistCheckpointForOtherCompliance } from "Components/OtherCompliance/api";
import Button from "Components/Audit/components/Buttons/Button";
import ReferenceModal from "../YourChecklist/ReferenceModal";
import { complianceStatusOptions } from "CommonModules/sharedComponents/constants/constant";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { useDispatch, useSelector } from "react-redux";
import { setYourComplianceChecklistDetailsById } from "Components/OtherCompliance/redux/actions";

const ComplianceDetails = () => {
  const [references, setReferences] = useState([]);
  const [isShowAddRemarkInput, setIsShowAddRemarkInput] = useState(false);
  const [remark, setRemark] = useState("");

  const [complianceDetails, setComplianceDetails] = useState(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state?.otherCompliance?.yourCompliance?.checklistDetailsById
  );

  const onComplianceStatusChange = async (e, serial_number) => {
    const selectedOption = e.target.value || null;
    setIsStatusUpdating(true);
    try {
      const { data, status } =
        await updateYourComplianceChecklistCheckpointForOtherCompliance({
          your_compliance_id: complianceDetails.your_compliance_id,
          serial_number,
          status: selectedOption,
        });

      if (status === 200 && data?.message?.status) {
        toast.success(data?.message?.status_response);
        dispatch(
          setYourComplianceChecklistDetailsById({
            ...complianceDetails,
            details: [...(complianceDetails?.details || [])].map((item) => ({
              ...item,
              ...(serial_number === item?.serial_number && {
                status: selectedOption,
              }),
            })),
          })
        );
      } else {
        toast.error(data?.message?.status_response);
      }
      setIsStatusUpdating(false);
    } catch (error) {
      toast.error("Something went wrong!");
      setIsStatusUpdating(false);
    }
  };
  const onRemarkSubmit = async (serial_number) => {
    setIsStatusUpdating(true);
    try {
      const { data, status } =
        await updateYourComplianceChecklistCheckpointForOtherCompliance({
          your_compliance_id: complianceDetails.your_compliance_id,
          serial_number,
          remark,
        });

      if (status === 200 && data?.message?.status) {
        toast.success(data?.message?.status_response);
        dispatch(
          setYourComplianceChecklistDetailsById({
            ...complianceDetails,
            details: [...(complianceDetails?.details || [])].map((item) => ({
              ...item,
              ...(serial_number === item?.serial_number && {
                remark,
              }),
            })),
          })
        );
        setIsShowAddRemarkInput(null);
        setRemark("");
      } else {
        toast.error(data?.message?.status_response);
      }
      setIsStatusUpdating(false);
    } catch (error) {
      toast.error("Something went wrong!");
      setIsStatusUpdating(false);
    }
  };

  useEffect(() => {
    if (!data) history.goBack();
  }, []);

  useEffect(() => {
    if (data) {
      setComplianceDetails(data);
    }

    return () => setComplianceDetails(null);
  }, [data]);

  return (
    <>
      <ReferenceModal
        visible={references.length > 0}
        onClose={() => setReferences([])}
        data={references}
      />
      <div className="d-flex align-items-center">
        <IconButton
          className="mr-1"
          onClick={() => {
            dispatch(setYourComplianceChecklistDetailsById({}));
            history.goBack();
          }}
        >
          <MdKeyboardArrowLeft color="#000" />
        </IconButton>
        <h4 className="mb-0">{complianceDetails?.title}</h4>
      </div>
      <div className={styles.otherComplianceDataTable}>
        <div
          className={`row no-gutters ${styles.tableHeaderContainer} ${styles.tableRow}`}
        >
          <div className={`col-2 ${styles.tableHeaderColumnTitle}`}>
            Section Name
          </div>
          <div className={`col-3 ${styles.tableHeaderColumnTitle}`}>
            Checkpoint
          </div>
          <div className={`col-3 ${styles.tableHeaderColumnTitle}`}>
            Compliances Status
          </div>
          <div className={`col-2 ${styles.tableHeaderColumnTitle}`}>
            Reference
          </div>
          <div className={`col-2 ${styles.tableHeaderColumnTitle}`}>Remark</div>
        </div>
        {complianceDetails &&
          complianceDetails?.details?.map((item, index) => {
            return (
              <div
                key={`other-compliance--checklist-details--${
                  complianceDetails?.title
                }--${item?.serial_number || index}`}
                className={`row no-gutters align-items-center ${styles.tableRow} ${styles.tableDataRow}`}
              >
                <div className="col-2">
                  <p className={styles.dataText}>{item?.heading}</p>
                </div>
                <div className="col-3">
                  <p className={styles.dataText}>{item?.checkpoint}</p>
                </div>

                <div className="col-3">
                  <Input
                    type="select"
                    placeholder="Status"
                    disabled={isStatusUpdating}
                    value={item?.status}
                    className={styles.complianceStatusInput}
                    variant="auditAssignmentInputOutlined"
                    onChange={(e) =>
                      onComplianceStatusChange(e, item?.serial_number)
                    }
                    valueForDropDown={complianceStatusOptions}
                  />
                </div>
                <div className="col-2">
                  {item?.reference_details?.length > 0 && (
                    <Button
                      size=""
                      className={styles.button}
                      disabled={!item?.reference_details?.length}
                      description="View"
                      onClick={() =>
                        setReferences(item?.reference_details || [])
                      }
                    />
                  )}
                </div>
                <div className="col-2">
                  {!item.remark &&
                  isShowAddRemarkInput !== item.serial_number ? (
                    <Button
                      size=""
                      className={styles.button}
                      description="Add"
                      onClick={() =>
                        setIsShowAddRemarkInput(item.serial_number)
                      }
                    />
                  ) : isShowAddRemarkInput !== item.serial_number ? (
                    <div className="d-flex align-items-center justify-content-between">
                      <p
                        title={item?.remark}
                        className={`${styles.dataText} truncate`}
                      >
                        {item?.remark}
                      </p>
                      <IconButton disableRipple>
                        <MdEdit
                          color="#7a73ff"
                          className={styles.smallIconButton}
                          onClick={() => {
                            setIsShowAddRemarkInput(item.serial_number);
                            setRemark(item?.remark);
                          }}
                        />
                      </IconButton>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center">
                      <Input
                        isLabel={false}
                        type="text"
                        value={remark}
                        maxLength={100}
                        onChange={(e) =>
                          setRemark(removeWhiteSpaces(e.target.value))
                        }
                        variant="auditAssignmentInput"
                        className={styles.tableInput}
                      />
                      <div className="d-flex justify-content-end">
                        <IconButton
                          disableRipple
                          disabled={
                            !remark || remark === " " || remark === item?.remark
                          }
                          onClick={() => onRemarkSubmit(item.serial_number)}
                        >
                          <MdCheck
                            color="#7a73ff"
                            className={styles.smallIconButton}
                          />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setIsShowAddRemarkInput(null);
                            setRemark("");
                          }}
                          disableRipple
                        >
                          <MdClose className={styles.smallIconButton} />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ComplianceDetails;
