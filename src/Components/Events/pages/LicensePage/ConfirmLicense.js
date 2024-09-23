import React from "react";
import "./style.scss";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
const ConfirmLicense = ({
  confirmModal,
  setConfirmModal,
  fields,
  setFields,
  countryValue,
}) => {
  const handleModal = (type) => {
    if (type === "yes") {
      setFields({
        ...fields,
        country: countryValue || "",
      });
    }
    setConfirmModal(false);
  };

  return (
    <div>
      <ProjectManagementModal
        visible={confirmModal}
        onClose={() => setConfirmModal(false)}
        containerClass="position-relative"
      >
        <p className="project-management__text">
          Are you sure, you want to continue with the selected country?
        </p>
        <span className="project-management__text project-management__text--small mb-0 text-danger">
          Note: Country once set cannot be modified.
        </span>
        <div className="d-flex justify-content-between mt-3 project-management__button-container--bottom-fixed">
          <button
            onClick={() => handleModal("yes")}
            className="project-management__button project-management__button--primary"
          >
            Yes
          </button>
          <button
            onClick={() => handleModal("no")}
            className="project-management__button project-management__button--outlined"
          >
            Cancel
          </button>
        </div>
      </ProjectManagementModal>
    </div>
  );
};

export default ConfirmLicense;
