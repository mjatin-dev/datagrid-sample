import React, { useEffect, useState } from "react";
import Text from "../../components/Text/Text";
import Button from "../../components/Buttons/Button";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { clearAssignmentDetails, clearAssignmentId, setAssignmentDetail } from "../../redux/actions";
import axiosInstance from "../../../../apiServices";
import { useHistory } from "react-router";
import { formatedDate } from "Components/Audit/constants/CommonFunction";

function ReviewDetails({ back, stepper }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const id = state.AuditReducer?.assignmentId;
  const history = useHistory();
  const [data, setData] = useState({});
  
  useEffect(() => {
    if (id) {
      fetchAllDetails(id);
    }
  }, [id]);

  const fetchAllDetails = async () => {
    const apiResponse = await axiosInstance.get(`audit.api.AssignmentDetails`, {
      params: {
        assignment_id: id,
      },
    });
    if (apiResponse?.data?.message?.status === true) {
      setData(apiResponse?.data?.message?.data);
      dispatch(setAssignmentDetail(apiResponse?.data?.message?.data));
    }
  };

  return (
    <>
      <div className={styles.reviewDetailsHeadingContainer}>
        <Text
          heading="p"
          text="audit details"
          variant="stepperSubHeading"
        />
        <Button
          variant="stroke"
          description="Edit"
          size="none"
          onClick={() => back(2)}
        />
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="audit template" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.audit_template_name || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text
            heading="p"
            text="assignment name"
            variant="smallTableHeading"
          />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.audit_name || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="company's name" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.company_name || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="Audit scope" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.audit_scope || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="audit deadline" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={
              `${formatedDate(data?.start_date)}(${data?.duration_of_completion} Days from start date)` ||
              "-"
            }
            variant="smallTableHeading"
          />
        </div>
      </div>

      {/* Auditor's Details  */}

      <div className={styles.reviewDetailsHeadingContainer}>
        <Text heading="p" text="Auditor Details" variant="stepperSubHeading" />
        <Button
          variant="stroke"
          description="Edit"
          size="none"
          onClick={() => back(2)}
        />
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="Firm Name" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.auditor_firm_name || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="Auditor's name" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.auditor_name || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="Email Id" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.auditor_email_id || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="Designation" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.designation || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>

      {/* Branch Details */}
      <div className={styles.reviewDetailsHeadingContainer}>
        <Text heading="p" text="Branch Details" variant="stepperSubHeading" />
        <Button
          variant="stroke"
          description="Edit"
          size="none"
          onClick={() => back(3)}
        />
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="address" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={`${data?.address_title} ,${data?.address_line1}` || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="pincode" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.pincode || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="State" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.state || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="city" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.city || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="Auditee Name" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.branch_auditee_incharge || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      <div className={styles.dataRow}>
        <div className={styles.keyBox}>
          <Text heading="p" text="Auditee Email" variant="smallTableHeading" />
        </div>
        <div className={styles.valueBox}>
          <Text
            heading="p"
            text={data?.auditee_incharge_email || "-"}
            variant="smallTableHeading"
          />
        </div>
      </div>
      {data?.audit_team_details?.length > 0 && (
        <div className={styles.reviewDetailsHeadingContainer}>
          <Text
            heading="p"
            text="SubAuditee Team Details"
            variant="stepperSubHeading"
          />
        </div>
      )}

      {data?.audit_team_details?.map((item, index) => (
        <div key={index + item?.team_member}>
          <div className={styles.dataRow}>
            <div className={styles.keyBox}>
              <Text
                heading="p"
                text="SubAuditee Name"
                variant="smallTableHeading"
              />
            </div>
            <div className={styles.valueBox}>
              <Text
                heading="p"
                text={item?.team_member || "-"}
                variant="smallTableHeading"
              />
            </div>
          </div>
          <div className={styles.dataRow}>
            <div className={styles.keyBox}>
              <Text
                heading="p"
                text="SubAuditee Mobile"
                variant="smallTableHeading"
              />
            </div>
            <div className={styles.valueBox}>
              <Text
                heading="p"
                text={item?.country_code + item?.mobile_no || "-"}
                variant="smallTableHeading"
              />
            </div>
          </div>
          <div className={styles.dataRow}>
            <div className={styles.keyBox}>
              <Text
                heading="p"
                text="SubAuditee Email"
                variant="smallTableHeading"
              />
            </div>
            <div className={styles.valueBox}>
              <Text
                heading="p"
                text={item?.team_member_email || "-"}
                variant="smallTableHeading"
              />
            </div>
          </div>
          <div className={styles.dataRow}>
            <div className={styles.keyBox}>
              <Text
                heading="p"
                text="SubAuditee Designation"
                variant="smallTableHeading"
              />
            </div>
            <div className={styles.valueBox}>
              <Text
                heading="p"
                text={item?.designation || "-"}
                variant="smallTableHeading"
              />
            </div>
          </div>
        </div>
      ))}
      <div className="mt-4">
        <Button
          description="Done"
          size="small"
          variant="default"
          onClick={() => {
            history.push("/audit/assignments");
            dispatch(clearAssignmentDetails({}));
            dispatch(clearAssignmentId());
          }}
        />
      </div>
    </>
  );
}

export default ReviewDetails;
