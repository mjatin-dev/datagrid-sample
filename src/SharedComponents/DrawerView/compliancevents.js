import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, IconButton } from "@mui/material";
import {
  DataGrid,
  Column,
  SearchPanel,
  Selection,
  Export,
  Toolbar,
  GroupPanel,
  Grouping,
  FilterRow,
  Item,
  HeaderFilter,
} from "devextreme-react/data-grid";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";
import { MdInfo } from "react-icons/md";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import NoResultFound from "CommonModules/sharedComponents/NoResultFound";
import { FileDocumentDetails } from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/File";
import styles from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/styles.module.scss";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ComplianceEvents({ open, setOpenModal, circularName, data }) {
  const [isShowImpactDetails, setIsShowImpactDetails] = useState(false);

  const [impactData, setImpactData] = useState({
    impact: "",
    impactFileDetails: [],
  });

  const handleClose = () => setIsShowImpactDetails(false);

  const RenderImpact = (ev) => {
    const getImpactDetails = (data) => {
      setImpactData({
        ...impactData,
        impact: data?.impact,
        impactFileDetails: data?.impactFileDetails,
      });
      setIsShowImpactDetails(true);
    };

    return ev.value ? (
      <IconButton
        size="small"
        title="Impact"
        onClick={(e) => {
          console.log(e.target);
          e.stopPropagation();
          getImpactDetails(ev?.row?.data);
        }}
        style={{ marginTop: "-0.5rem" }}
      >
        <MdInfo style={{ color: "#7a73ff" }} />
      </IconButton>
    ) : (
      ""
    );
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpenModal(false)}
        style={{ zIndex: "500" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ProjectManagementModal
            visible={isShowImpactDetails}
            onClose={handleClose}
          >
            <h4 style={{ color: "red" }}>Impact</h4>
            {impactData?.impact && (
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.impact,
                }}
                className={styles.impactContainer}
              ></div>
            )}
            {!impactData?.impact &&
              (!impactData?.impactFileDetails ||
                impactData?.impactFileDetails?.length === 0) && (
                <NoResultFound text="No impact found" />
              )}
            <div className="w-100">
              {impactData?.impactFileDetails?.map((item) => {
                return <FileDocumentDetails file={item} />;
              })}
            </div>
          </ProjectManagementModal>

          <DataGrid
            id="dataGrid"
            dataSource={data.length > 0 ? data : []}
            columnAutoWidth={true}
            allowColumnReordering={true}
            paging={{ pageSize: 6 }}
            showColumnLines={false}
            showBorders={false}
            showRowLines={false}
            wordWrapEnabled={true}
            width="100%"
            allowFiltering={false}
            scrolling={{
              columnRenderingMode: "standard",
              mode: "standard",
              preloadEnabled: false,
              renderAsync: undefined,
              rowRenderingMode: "virtual",
              scrollByContent: true,
              scrollByThumb: false,
              showScrollbar: "onHover",
              useNative: "auto",
            }}
          >
            <Column
              dataField="name_of_the_subtask"
              caption="Name of compliance event"
            />
            <Column dataField="against_license" caption="License" />
            <Column dataField="frequency" caption="Frequency" />
            <Column
              dataField="impact"
              caption="Impact"
              dataType="string"
              allowSorting={false}
              cellRender={RenderImpact}
              allowFiltering={false}
            />
            <Column dataField="risk_rating" caption="Risk Rating" />

            <Grouping contextMenuEnabled={true} />
            <GroupPanel visible={true} allowColumnDragging={true} />
            <HeaderFilter visible={true} filter allowSearch={true} />
          </DataGrid>
        </Box>
      </Modal>
    </>
  );
}

export default ComplianceEvents;
