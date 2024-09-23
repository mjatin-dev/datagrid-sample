import React, { useState } from "react";
import ProjectManagementModal from "../../../ProjectManagement/components/ProjectManagementModal";
import Text from "../Text/Text";
import { useDispatch, useSelector } from "react-redux";
import { setLongTextPoup } from "Components/Audit/redux/actions";

const LongTextPopup = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.AuditReducer?.longTextPopupModal);
  return (
    <>
      <ProjectManagementModal
        visible={data?.isOpen}
        onClose={() =>
          dispatch(
            setLongTextPoup({
              isOpen: false,
              data: "",
              heading: "",
            })
          )
        }
      >
        <div>
          <div>
            <Text
              heading="p"
              variant="stepperMainHeading"
              text={data?.heading}
            />
          </div>
          <p style={{color:"grey",fontSize:"14px" ,paddingTop:"10px"}}>{data?.data}</p>
        </div>
      </ProjectManagementModal>
    </>
  );
};

export default LongTextPopup;
