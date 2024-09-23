import React,{useState} from "react";
import Button from "../../components/Buttons/Button";
import styles from "./style.module.scss";
import NoResultFound from "../../../../CommonModules/sharedComponents/NoResultFound";
import axiosInstance from "../../../../apiServices";
import { toast } from "react-toastify";
import { useHistory } from "react-router";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import { getTruncatedString } from "Components/Audit/components/Helpers/string.helpers";
const MultipleAssignmentDetail = ({
  setMultipleAssignmentStep,
  multiAssignmentList,
}) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const submit = async () => {
    setIsLoading(true);
    const assignmentList = multiAssignmentList.map((items) => {
      return {
        templateID: items.templateID,
        branch_code: items.branchCode,
        assignmentName: items.assignmentName,
        startDate: items.startDate,
        auditor_email_id: items.auditor_email,
        auditor_name:items.auditor_name,
        auditee_manager_id: items.manager_auditee_email,
        manager_auditee_name:items.manager_auditee_name,
        sub_auditee_id: items.sub_auditee_email,
        sub_auditee_name:items.sub_auditee_name,
        location: items.location,
        company_name: items.company,
      };
    });

    const formData = new FormData();
    formData.append("data", JSON.stringify(assignmentList));
    const sendData = await axiosInstance.post(
      "audit.api.CreateMultipleAssignment",
      formData
    );

    if (sendData?.data?.message?.status === true) {
      toast.success("Assignments has been created");
      history.push("/audit/assignments");
      setIsLoading(false);
    } else {
      toast.error(sendData?.data?.message?.status_response);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <BackDrop isLoading={isLoading} />
      <table className={styles.multipleAssignmentDetail}>
        <thead>
          <th>SrNo.</th>
          <th>Template Name</th>
          <th>Audit Name</th>
          <th>Manager Auditee Name</th>
          <th>Head Auditor Name</th>
          <th>SubAuditee Name</th>
          <th>Company</th>
          <th>Branch Code</th>
          <th>Location Name</th>
        </thead>
        <tbody>
          {multiAssignmentList && multiAssignmentList?.length > 0 ? (
            multiAssignmentList.map((item,index) => {
              return (
                <tr key={index}>
                  <td className="pl-4">{item.id + 1}</td>
                  <td>{item.templateName}</td>
                  <td>{item.assignmentName}</td>
                  <td title={item.manager_auditee_email}>{getTruncatedString(item.manager_auditee_name)}</td>
                  <td title={item.auditor_email}>{getTruncatedString(item.auditor_name)}</td>
                  <td title={item.sub_auditee_email}>{getTruncatedString(item.sub_auditee_name)}</td>
                  <td>{item.company}</td>
                  <td>{item.branchCode}</td>
                  <td>{item.location}</td>
                </tr>
              );
            })
          ) : (
            <NoResultFound text="No assignment found" />
          )}
        </tbody>
      </table>

      <div className="d-flex mt-5">
        <div>
          <Button
            description="cancel"
            size="largeNoBackground"
            onClick={() => setMultipleAssignmentStep(0)}
          />
        </div>
        <div className="ml-5">
          <Button description="creation" size="large" onClick={submit} />
        </div>
      </div>
    </div>
  );
};

export default MultipleAssignmentDetail;
