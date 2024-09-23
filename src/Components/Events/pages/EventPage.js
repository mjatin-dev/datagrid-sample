import React, { lazy, useState, Suspense, useCallback, useEffect } from "react";
import "./styles.scss";
import EventList from "./EventList";
import LicenceList from "./LicensePage/LicenseList";
// import AddComplianceEvent from "../Components/AddComplianceEvent";
import axiosInstance from "apiServices";
import moment from "moment";
// import dashboardStyles from "SharedComponents/Dashboard/styles.module.scss";
import { MdAdd } from "react-icons/md";
import { Button } from "@mui/material";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import CircularList from "./CircularPage";
import AddCircular from "../Components/AddCircular";
import { useDispatch, useSelector } from "react-redux";
import { eventsModuleActions } from "../redux/actions";
import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";
const AddComplianceEvent = lazy(() =>
  import("../Components/AddComplianceEvent")
);

const initialEditValues = {
  isAddSubLicene: false,
  isAddParentLicense: false,
  isEdit: false,
  isEditChild: false,
  isRename: false,
};
const eventsPageTabs = ["Compliance Events", "License", "Circulars"];
const EventPage = () => {
  const [isShowAddComplianceEventModal, setIsShowAddComplianceEventModal] =
    useState(false);
  const [isShowTabsPages, setIsShowTabsPages] = useState(true);
  // const [isShowAddCircularPage, setIsShowAddCircularPage] = useState(false);
  const circularModalState = useSelector(
    (state) => state?.eventsModuleReducer?.circular?.modalState
  );
  const dispatch = useDispatch();
  const userTypeNo = useSelector((state) => state?.auth?.loginInfo?.UserType);
  const [editComplianceEvent, setEditComplianceEvent] = useState({});
  const [licenseModal, setLicenseModal] = useState(false);
  const [modalEditState, setModalEditState] = useState(initialEditValues);
  const [activeBtn, setActiveBtn] = useState(eventsPageTabs[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [complianceEvents, setComplianceEvents] = useState([]);
  const { userDetails, isLicenseManager, isCEApprover } = useGetUserRoles();
  const selectedUserEmail =
    useSelector((state) => state?.eventsModuleReducer?.selectedUser?.email) ||
    userDetails.email;
  const openModal = useCallback(() => {
    setLicenseModal(true);
    setModalEditState({
      ...modalEditState,
      isAddParentLicense: true,
    });
  }, [modalEditState]);
  const handleCloseAddCircular = useCallback(() => {
    dispatch(
      eventsModuleActions.setModalState({
        isVisible: false,
        data: {},
      })
    );
    setIsShowTabsPages(true);
  }, []);
  const fetchComplianceEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const { status, data } = await axiosInstance.post(
        "compliance.api.getComplianceEvents",
        { email_id: selectedUserEmail }
      );
      if (status === 200 && data?.message && data?.message?.length) {
        const _list = [...data?.message].map((item) => {
          return {
            ...item,
            disable_repeat: item.disable_repeat === 1 ? "De-active" : "Active",
            licenseString: item?.license?.join(",") || "",
            end_date: item.end_date
              ? moment(item.end_date, "YYYY-MM-DD").format("DD MMM YYYY")
              : "",
            start_date: item.start_date
              ? moment(item.start_date, "YYYY-MM-DD").format("DD MMM YYYY")
              : "",
            deactivation_date: item?.deactivation_date
              ? moment(item.deactivation_date, "YYYY-MM-DD").format(
                  "DD MMM YYYY"
                )
              : "",
          };
        });
        setComplianceEvents(_list);
        setIsLoading(false);
      } else {
        setComplianceEvents([]);
        setIsLoading(false);
      }
    } catch (error) {}
    setIsLoading(false);
  }, []);

  const handleEditComplianceEvent = useCallback((editData) => {
    setIsShowAddComplianceEventModal(true);
    setEditComplianceEvent(editData);
  }, []);

  const handleCloseComplianceEventModal = useCallback(() => {
    setIsShowAddComplianceEventModal(false);
    setEditComplianceEvent({});
  }, []);

  useEffect(() => {
    if (circularModalState?.isVisible && activeBtn !== "Circulars") {
      handleCloseAddCircular();
    }
  }, [circularModalState.isVisible, activeBtn]);
  return !circularModalState.isVisible ? (
    <>
      <Suspense fallback={<BackDrop isLoading />}>
        {isShowAddComplianceEventModal && (
          <AddComplianceEvent
            showTask={isShowAddComplianceEventModal}
            onClose={handleCloseComplianceEventModal}
            onSuccessEvent={fetchComplianceEvents}
            isEdit={
              editComplianceEvent && Object.keys(editComplianceEvent).length > 0
            }
            editData={{
              license_list: [...(editComplianceEvent?.license || [])].map(
                (item) => ({ label: item, value: item })
              ),
              activate_the_subtask:
                editComplianceEvent?.activate_sub_task_on || "",
              name_of_the_subtask:
                editComplianceEvent?.name_of_the_subtask || "",
              start_date: editComplianceEvent?.start_date
                ? moment(editComplianceEvent?.start_date, "DD MMM YYYY").format(
                    "YYYY-MM-DD"
                  )
                : "",
              end_date: editComplianceEvent?.end_date
                ? moment(editComplianceEvent?.end_date, "DD MMM YYYY").format(
                    "YYYY-MM-DD"
                  )
                : "",
              frequency: editComplianceEvent?.frequency
                ? {
                    label: editComplianceEvent?.frequency,
                    value: editComplianceEvent?.frequency,
                  }
                : null,
              weekly_repeat_day: editComplianceEvent?.weekly_repeat_day || "",
              repeat_on_day: editComplianceEvent?.repeat_on_day || "",
              file_details: editComplianceEvent?.file_details || [],
              description: editComplianceEvent?.description || "",
              end_time: editComplianceEvent?.end_time || "",
              // internal_deadline_day: ["Weekly", "Daily"].includes(
              //   editComplianceEvent.frequency
              // )
              //   ? editComplianceEvent.deadline_days_after_the_start_date
              //   : editComplianceEvent.due_date_before || 0,
              // internal_deadline_date: "",
              repeat_on_holiday: editComplianceEvent?.repeat_on_holiday || "",
              // repeat_on_every: editComplianceEvent.repeat_on_every || "",
              frequency_end_date: editComplianceEvent?.end_date
                ? moment(editComplianceEvent?.end_date, "DD-MM-YYYY").format(
                    "YYYY-MM-DD"
                  )
                : "",
              repeat_on_month: editComplianceEvent?.repeat_on_month || "",
              impact: editComplianceEvent?.impact || "",
              impactFileDetails: editComplianceEvent?.impactFileDetails || [],
              circulars: editComplianceEvent?.circulars || [],
              compliance_event_id:
                editComplianceEvent?.compliance_event_id || "",
              disable_repeat: editComplianceEvent?.disable_repeat || 0,
              deadline_day_of_the_month:
                editComplianceEvent?.deadline_day_of_the_month || 0,
              deadline_days_after_the_start_date:
                editComplianceEvent?.deadline_days_after_the_start_date || 0,
              extend_deadline_date:
                editComplianceEvent?.extend_deadline_date || 0,
              due_date_before: editComplianceEvent?.due_date_before || 0,
              riskRating: editComplianceEvent?.riskRating || "Low",
              status: editComplianceEvent?.status || null,
              temp_compliance_id:
                editComplianceEvent?.temp_compliance_id || null,
            }}
          />
        )}
      </Suspense>
      {/* <div
        className={`${dashboardStyles.dashboardHeaderContainer} justify-content-start justify-content-md-between m-0 mb-2 px-0`}
      >
        <p
          className={`${dashboardStyles.dashboardHeaderTitle} ${dashboardStyles.dashboardHeaderTitleActive}`}
        >
          License compliance events
        </p>
      </div> */}
      <div className="d-flex align-items-center justify-content-between event__header-container mt-2">
        <div className="d-none d-md-block compliance__license__events_tabs px-0">
          {eventsPageTabs.map((tab) => {
            return (
              <button
                className={`${activeBtn === tab ? "active" : "inactive"}`}
                onClick={() => setActiveBtn(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
        {activeBtn === "Compliance Events" &&
          !isCEApprover &&
          isLicenseManager && (
            <Button
              sx={{ color: "#6c5dd3" }}
              disableTouchRipple
              variant="text"
              onClick={() => setIsShowAddComplianceEventModal(true)}
            >
              <MdAdd />
              &nbsp;Add Compliance Event
            </Button>
          )}
        {activeBtn === "License" && !isCEApprover && isLicenseManager && (
          <Button
            variant="text"
            onClick={openModal}
            sx={{ color: "#6c5dd3" }}
            disableTouchRipple
          >
            <MdAdd />
            &nbsp;Add New License
          </Button>
        )}
        {activeBtn === "Circulars" && !isCEApprover && isLicenseManager && (
          <Button
            variant="text"
            onClick={() => {
              setIsShowTabsPages(false);
              dispatch(
                eventsModuleActions.setModalState({
                  isVisible: true,
                  data: {},
                })
              );
            }}
            sx={{ color: "#6c5dd3" }}
            disableTouchRipple
          >
            <MdAdd />
            &nbsp;Add Circular
          </Button>
        )}
      </div>
      <div>
        {activeBtn === "Compliance Events" && (
          <EventList
            setIsShowAddComplianceEventModal={setIsShowAddComplianceEventModal}
            complianceEvents={complianceEvents}
            fetchComplianceEvents={fetchComplianceEvents}
            handleEditComplianceEvent={handleEditComplianceEvent}
            isLoading={isLoading}
          />
        )}
        {activeBtn === "License" && (
          <LicenceList
            licenseModal={licenseModal}
            setLicenseModal={setLicenseModal}
            modalEditState={modalEditState}
            setModalEditState={setModalEditState}
          />
        )}
        {activeBtn === "Circulars" && <CircularList />}
      </div>
    </>
  ) : (
    <>
      {activeBtn === "Circulars" && circularModalState?.isVisible && (
        <AddCircular
          handleCloseAddCircular={handleCloseAddCircular}
          editData={circularModalState.data}
        />
      )}
    </>
  );
};
export default EventPage;
