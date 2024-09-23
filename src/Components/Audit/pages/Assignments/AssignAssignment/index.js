import React from "react";
import { useParams} from "react-router";
import AssignmentAuditTeamDetails from "./assignmentAuditTeamDetails";
import CheckListForm from "./checklistAssign";
import AssignQuestionarie from "./AssignQuestionnaire";

function AssignChecklistAndDetails() {
  const { assign } = useParams();
  return (
    <>
      {assign === "teamDetails" && <AssignmentAuditTeamDetails />}
      {assign === "assignCheckList" && <CheckListForm />}
      {assign === "assignQuestionQuestionarie" && <AssignQuestionarie />}
    </>
  );
}

export default AssignChecklistAndDetails;
