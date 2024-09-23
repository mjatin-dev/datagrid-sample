import Dots from "CommonModules/sharedComponents/Loader/Dots";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setTaskDetailImpactModal } from "SharedComponents/Dashboard/redux/actions";
import styles from "./styles.module.scss";
import { FileDocumentDetails } from "./File";
import NoResultFound from "CommonModules/sharedComponents/NoResultFound";
const ImpactModal = () => {
  const data = useSelector(
    (state) => state.DashboardState?.taskDetailById?.modals?.data
  );
  const currentOpenedTask = useSelector(
    (state) => state?.DashboardState?.taskDetailById.data
  );
  const isShowImpactDetails = useSelector(
    (state) => state.DashboardState?.taskDetailById?.modals?.isShowImpactDetails
  );
  const isLoading = useSelector(
    (state) => state.DashboardState?.taskDetailById?.modals?.isLoading
  );
  const dispatch = useDispatch();
  const handleClose = () => dispatch(setTaskDetailImpactModal({}));
  return (
    data && (
      <ProjectManagementModal
        visible={isShowImpactDetails}
        onClose={handleClose}
      >
        <h4 style={{ color: "red" }}>Impact</h4>
        {isLoading ? (
          <Dots />
        ) : (
          <>
            {data?.impact && (
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.impact,
                }}
                className={styles.impactContainer}
              ></div>
            )}
            {!data?.impact &&
              (!data?.file_details || data?.file_details?.length === 0) && (
                <NoResultFound text="No impact found" />
              )}
            <div className="w-100">
              {data?.file_details?.map((item) => {
                return (
                  <FileDocumentDetails
                    file={item}
                    currentOpenedTask={currentOpenedTask}
                  />
                );
              })}
            </div>
          </>
        )}
      </ProjectManagementModal>
    )
  );
};
export default ImpactModal;
