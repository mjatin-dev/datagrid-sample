import React, { useEffect, useState } from "react";
import { Box, IconButton, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  DataGrid,
  Column,
  GroupPanel,
  Grouping,
  HeaderFilter,
} from "devextreme-react/data-grid";
import { MdInfo } from "react-icons/md";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import NoResultFound from "CommonModules/sharedComponents/NoResultFound";
import { FileDocumentDetails } from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/File";
import styles from "SharedComponents/Dashboard/TaskDetail/TaskDetailTabs/styles.module.scss";
import { useSelector } from "react-redux";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import axiosInstance from "apiServices";
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import { toast } from "react-toastify";

const dummyData = [
  {
    task_name: "Task 1",
    license_name: "License A",
    company_name: "Company X",
    frequency: "Weekly",
    impact: "High",
    risk_rating: "Low",
    applicable: true,
  },
  {
    task_name: "Task 2",
    license_name: "License B",
    company_name: "Company Y",
    frequency: "Monthly",
    impact: "Medium",
    risk_rating: "Medium",
    applicable: false,
  },
  {
    task_name: "Task 3",
    license_name: "License C",
    company_name: "Company Z",
    frequency: "Daily",
    impact: "Low",
    risk_rating: "High",
    applicable: true,
  },
  {
    task_name: "Task 4",
    license_name: "License D",
    company_name: "Company W",
    frequency: "Quarterly",
    impact: "High",
    risk_rating: "Low",
    applicable: true,
  },
];

function CoNotApplicableTasks() {
  const [isShowImpactDetails, setIsShowImpactDetails] = useState(false);
  const state = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [confirmApplicable, setConfirmApplicable] = useState(false);
  const [impactData, setImpactData] = useState({
    impact: "",
    impactFileDetails: [],
  });
  const [taskData, setTaskData] = useState({
    project: "",
    compliance_event: "",
  });
  useEffect(() => {
    getSettingData();
    setIsLoading(true);
  }, []);
  const getSettingData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${BACKEND_BASE_URL}compliance.api.getNotApplicableComplianceEvents`
      );
      const { status_response, status } = response?.data?.message;
      if (status && status_response?.length > 0) {
        setEvents(status_response);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const makeApplicable = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `${BACKEND_BASE_URL}compliance.api.ReApplicableTask`,
        taskData
      );
      const { status_response, status } = response?.data?.message;
      if (status) {
        toast.success(status_response);
        getSettingData();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    setIsShowImpactDetails(false);
  };
  const RenderImpact = (ev) => {
    const getImpactDetails = (data) => {
      setImpactData({
        ...impactData,
        impact: data?.impact,
        impactFileDetails: data?.impact_file_details,
      });
      setIsShowImpactDetails(true);
    };

    return ev.value ? (
      <IconButton
        size="small"
        title="Impact"
        onClick={(e) => {
          e.stopPropagation();
          getImpactDetails(ev?.row?.data);
        }}
        style={{ marginTop: "-0.5rem" }}
      >
        <MdInfo style={{ color: "#7a73ff" }} />
      </IconButton>
    ) : (
      "-"
    );
  };
  const ApplicableBtn = (ev) => {
    return ev.value === 0 ? (
      <Button
        sx={{ color: "rgb(122, 115, 255)" }}
        onClick={(e) => {
          setTaskData({
            ...taskData,
            project: ev?.row?.data?.project_id,
            compliance_event: ev?.row?.data?.compliance_event,
          });
          setConfirmApplicable(true);
          e.stopPropagation();
        }}
        style={{ marginTop: "-0.5rem" }}
      >
        Mark Applicable
      </Button>
    ) : (
      ""
    );
  };
  return (
    <>
      <BackDrop isLoading={isLoading} />
      <Box>
        <ProjectManagementModal
          visible={isShowImpactDetails}
          onClose={handleClose}
        >
          <h4 style={{ color: "red" }}>Impact</h4>
          {impactData?.impact && (
            <div
              dangerouslySetInnerHTML={{
                __html: impactData?.impact,
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
        <Dialog
          open={confirmApplicable}
          onClose={() => setConfirmApplicable(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Mark Applicable</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to mark the task as Applicable?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              sx={{ color: "rgb(122, 115, 255)" }}
              onClick={() => setConfirmApplicable(false)}
            >
              Cancel
            </Button>
            <Button
              sx={{ background: "rgb(122, 115, 255)" }}
              variant="contained"
              onClick={() => {
                makeApplicable();
                setConfirmApplicable(false);
              }}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <DataGrid
          id="dataGrid"
          dataSource={events}
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
          <Column dataField="subject" caption="Task Name" />
          <Column dataField="license_display" caption="License Name" />
          <Column dataField="company_name" caption="Company Name" />
          <Column dataField="frequency" caption="Frequency" />
          <Column
            dataField="impact_flag"
            caption="Impact"
            dataType="string"
            allowSorting={false}
            cellRender={RenderImpact}
            allowFiltering={false}
          />
          <Column dataField="risk_rating" caption="Risk Rating" />
          <Column
            alignment="left"
            dataField="applicable_flag"
            caption="Applicable"
            allowFiltering={false}
            allowSorting={false}
            cellRender={ApplicableBtn}
          />
          <Grouping contextMenuEnabled={true} />
          <GroupPanel visible={true} allowColumnDragging={true} />
          <HeaderFilter visible={true} filter allowSearch={true} />
        </DataGrid>
      </Box>
    </>
  );
}

export default CoNotApplicableTasks;
