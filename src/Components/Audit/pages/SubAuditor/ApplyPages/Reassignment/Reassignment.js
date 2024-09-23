import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import IconButton from "../../../../components/Buttons/IconButton";
import { MdClose } from "react-icons/md";
import Modal from "@mui/material/Modal";
import CreatableSelect from "react-select/creatable";
import Text from "../../../../components/Text/Text";
import { Input } from "../../../../components/Inputs/Input";
import Button from "../../../../components/Buttons/Button";
import BackDrop from "../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import axiosInstance from "../../../../../../apiServices";
import { toast } from "react-toastify";
import { customStyle } from "Components/Audit/assets/reactSelectStyles/styles";

function Reassignment({ onClose, openReassignment }) {

  const [isLoading, setIsLoading] = useState(false);
  const [templateNames,setTemplateNames] =useState([])
  const [assignmentNames,setAssignmentNames] =useState([])
  const [QuestionDetails,setQuestionDetails] =useState([])
  const [reassignment, setReassignment] = useState({
    template_name: "",
    assignment_name: "",
    question_details: "",
    reason_of_re_assignment: "",
  });

  const fetchAssignmentDetails = ()=>{
    try{
      axiosInstance.post("audit.api.getUserWiseAssignment").then(res=>{
        let temp_name =[]
        let assignment_name=[]
        let questions =[]
        res?.data?.message?.data?.map(item=>{
          temp_name.push({
           value: item.audit_template_id,
           label: item.audit_template_name
          });
          assignment_name.push({
            value: item.assignment_id,
            label: item.assignment_name
          })
         item.question_questionnaire_list.map(items=>{
           questions.push({
             value:items.question_id,
             label:item.question_questionnaire
           })
         })
        })
        setTemplateNames(temp_name);
        setAssignmentNames(assignment_name);
        setQuestionDetails(questions)
      })

    }catch(err){

    }
  }
  const onInutChange= (val,str)=>{
      if(val === "Template_Name"){
        setReassignment({
          ...reassignment,
          template_name:str.value
        })
      }else if(val === "Assignment_Name"){
        setReassignment({
          ...reassignment,
          assignment_name:str.value
        })
      }else if(val === "Question_Detail"){
        setReassignment({
          ...reassignment,
          question_details:str.value
        })
      }
      else if(val === "Reason"){
        setReassignment({
          ...reassignment,
          reason_of_re_assignment:str.target.value
        })
      }
  }


  const submitReassignment = ()=>{
       try{
        axiosInstance.post("audit.api.ApplyReassignment",{data:reassignment}).then(res=>{
          if(res?.data?.message?.status){
            toast.success(res?.data?.message?.status_response);
            onClose();
          }
          else{
            toast.error("something went wrong")
          }
        })
       }catch(err){

       }
  }
useEffect(()=>{
  fetchAssignmentDetails();
},[])
  return (
    <>
      <div>
        <Modal
          open={openReassignment}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className={styles.box}>
            <BackDrop isLoading={isLoading} />
            <div className={styles.topLeaveHeading}>
              <Text
                heading="h5"
                text="Apply for Reassignment "
                variant="auditheading"
              />
              <div className={styles.closeLeaveButton}>
                <IconButton
                  icon={<MdClose />}
                  variant="closeButn"
                  onClick={onClose}
                />
              </div>
            </div>

            <div className={styles.inputfields}>
              <div className="p-2">
                <label className={styles.label}>Template Name</label>
                <CreatableSelect 
                styles={customStyle}
                options={templateNames}
                onChange={(value)=>onInutChange("Template_Name",value)}
                 />
              </div>
              <div className="p-2">
                <label className={styles.label}>Assignment Name</label>
                <CreatableSelect 
                styles={customStyle}
                options={assignmentNames}
                onChange={(value)=>onInutChange("Assignment_Name",value)}
                />
              </div>
            </div>
            <div>
              <label className={styles.label}>Question Details</label>
              <CreatableSelect 
              styles={customStyle}
              options={QuestionDetails}
              onChange={(value)=>onInutChange("Question_Detail",value)}
              />
            </div>
            <div>
              <Input
                variant="auditAssignmentInput"
                rows="3"
                labelText="Reason For Leave"
                type="textArea"
                placeholder="Enter Reason"
                onChange={(e)=>onInutChange("Reason",e)}
              />
            </div>
            <div className="d-flex justify-content-center mt-3">
              <div className="p-2">
                <Button description="SUBMIT" variant="submitBtn" onClick={submitReassignment} />
              </div>
              <div className="p-2">
                <Button description="CANCEL" variant="cancelBtn" onClick={onClose} />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Reassignment;
