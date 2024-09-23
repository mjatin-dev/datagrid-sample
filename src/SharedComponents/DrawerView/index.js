import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import Select from "react-select";
import { useRouteMatch } from "react-router";
import moment from "moment";
import { fileDownload } from "CommonModules/helpers/file.helper";
import { IconButton } from "@mui/material";
import { MdArrowDropDown, MdClose, MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "apiServices";
import { BACKEND_BASE_URL } from "apiServices/baseurl";
import { setTaskModalState } from "Components/ProjectManagement/redux/actions";
import ComplianceEvents from "./compliancevents";
import { toast } from "react-toastify";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
const SunEditor = lazy(() => import("SharedComponents/SunEditor"));

const customStyles = {
  control: (provided) => ({
    ...provided,
    boxShadow: "none",
    backgroundColor: "#6c5dd3",
    border: "none",
    height: "33px",
    borderRadius: "4px",
    "&:hover, &:focus": {
      border: "none",
    },
    width: "224px",
    minHeight: "33px",
    marginRight: "10px",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    width: "0px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#fff",
    fontSize: "12px",
    fontWeight: "500",
    fontStyle: "normal",
  }),
};
const DrawerView = ({
  isShowUpdatesDetail,
  changeShowUpdateDetail,
  newUpdateDetail,
  handleSendCircularFromDrawer,
  templateList,
}) => {
  const { path } = useRouteMatch();
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchComplainceEvent();
  }, [isShowUpdatesDetail]);

  const UserType = useSelector((state) => state.auth.loginInfo.UserType);
  const handleChange = (event) => {
    if (event) {
      getTemplateDetails(event.value);
    }
  };
  const dispatch = useDispatch();
  const modalsStatus = useSelector(
    (state) => state?.ProjectManagementReducer?.modalsStatus
  );

  const getTemplateDetails = async (templateName) => {
    const taskDetail = await axiosInstance(
      `${BACKEND_BASE_URL}compliance.api.GetTaskTemplateDetails?template_name=${templateName}`
    );
    const { data } = taskDetail;
    const { task_template_details } = data.message;

    dispatch(
      setTaskModalState({
        ...modalsStatus?.taskModal,
        loader: false,
        isVisible: true,
        isEdit: false,
        isUpdate: true,
        editData: {
          ...modalsStatus?.taskModal?.editData,

          task_id: "",
          milestone_id: task_template_details[0]?.milestoneId || null,
          project_id: task_template_details[0]?.project || null,
          subject: task_template_details[0]?.task_name || "",
          task_list_id: task_template_details[0]?.taskListId || null,
          start_date: task_template_details[0]?.start_date || null,
          end_date: task_template_details[0]?.end_date || null,
          frequency: {
            value: task_template_details[0]?.frequency
              ? task_template_details[0]?.frequency
              : "",
            label: task_template_details[0]?.frequency
              ? task_template_details[0]?.frequency
              : "",
          },
          frequency_end_date: task_template_details[0]?.task_due_date || null,
          assign_to: task_template_details[0]?.assignTo || null,
          cc: task_template_details[0]?.cc || null,
          approver: task_template_details[0]?.approver || null,
          description: task_template_details[0]?.description || "",
          comments: task_template_details[0]?.task_comments || "",
          repeat_on_holiday: task_template_details[0]?.repeatOnHoliday || "",
          repeat_on_day: task_template_details[0]?.repeatOnDay || "",
          weekly_repeat_day: task_template_details[0]?.weeklyRepeatDay || "",
          repeat_on_month: task_template_details[0]?.repeatOnMonth || "",
          end_time: task_template_details[0]?.end_time || null,
          file_details: task_template_details[0]?.fileDetails || [],
          notify_on: task_template_details[0]?.notifyOn || [],
          internal_deadline_date:
            task_template_details[0]?.internal_deadline_date || null,
          internal_deadline_day:
            task_template_details[0]?.internal_deadline || 0,

          impact: task_template_details[0]?.impact || "",
          impactFileDetails: task_template_details[0]?.impactFileDetails || [],
          circulars: [],
          circularsList: task_template_details[0]?.circular
            ? task_template_details[0]?.circular.map((item) => ({
                ...item,
                title: item.title_for_the_circular,
              }))
            : [],
          riskRating: {
            value: task_template_details[0]?.riskRating
              ? task_template_details[0]?.riskRating
              : "",
            label: task_template_details[0]?.riskRating
              ? task_template_details[0]?.riskRating
              : "",
          },
        },
      })
    );
  };

  const fetchComplainceEvent = async () => {
    if (newUpdateDetail.name) {
      const result = await axiosInstance.post(
        "compliance.api.getCircularLinkComplianceEvents",
        {
          circular: newUpdateDetail.name,
        }
      );
      if (result.status === 200) {
        if (result?.data?.message?.status_reponse?.length > 0) {
          setData(result?.data?.message?.status_reponse);
        } else {
          setData([]);
        }
      } else {
        toast.error("Something went wrong");
        setData([]);
      }
    }
  };

  return (
    <div
      className={
        isShowUpdatesDetail
          ? `${styles.drawer}  ${
              isShowUpdatesDetail && "popup-open"
            } d-flex flex-column`
          : `filter-popup detail-popup ${
              isShowUpdatesDetail && "popup-open"
            } d-flex flex-column`
      }
      style={{
        boxShadow: isShowUpdatesDetail
          ? "1px 1px 9999px 9999px rgba(0,0,0,0.7)"
          : "none",
      }}
    >
      <ComplianceEvents
        open={openModal}
        setOpenModal={setOpenModal}
        circularName={newUpdateDetail.name}
        data={data}
      />
      <div
        style={{
          height: "70%",
          padding: "60px 60px",
          overflowY: "auto",
        }}
        className="w-100"
      >
        <IconButton
          style={{
            position: "absolute",
            top: "25px",
            left: "30px",
          }}
          // title="Send this circular"
          onClick={changeShowUpdateDetail}
          disableTouchRipple={true}
        >
          <MdClose />
        </IconButton>
        {UserType === 3 && (
          <IconButton
            onClick={(e) => {
              handleSendCircularFromDrawer();
              changeShowUpdateDetail(e, false);
            }}
            style={{
              position: "absolute",
              top: "50%",
              right: "1.5rem",
              transform: "translateY(-50%)",
            }}
          >
            <MdEmail color="#7a73ff" />
          </IconButton>
        )}
        <h3 className="mb-2">{newUpdateDetail?.title}</h3>
        <div className="w-100 d-flex justify-content-between mb-4">
          <div>
            {" "}
            <span className="license-code">
              {newUpdateDetail?.circularNumber}
            </span>
            <span className="date ml-3">
              {newUpdateDetail?.dateIssued &&
                moment(newUpdateDetail?.dateIssued).format("DD MMM YYYY")}
            </span>
          </div>

          {newUpdateDetail?.implementation_date && (
            <div>
              {" "}
              <span className="date ml-3">
                Implementation date :
                {moment(newUpdateDetail?.implementation_date).format(
                  "DD MMM YYYY"
                )}
              </span>
            </div>
          )}
        </div>
        <div id="updates-content-view" className="detail-popup-main-content ">
          {/* <div
            dangerouslySetInnerHTML={{
              __html: newUpdateDetail?.description,
            }}
          ></div> */}

          <Suspense fallback={<BackDrop isLoading />}>
            {newUpdateDetail?.description && (
              <SunEditor
                value={newUpdateDetail?.description}
                hideToolbar={true}
                readOnly={true}
              />
            )}
          </Suspense>
        </div>

        <div className="detail-popup-main-footers">
          <div className="detail-popup-main-footers-labels">
            <div className="tags">
              <div
                className="tag-buttons"
                style={{ marginLeft: "-5px", flex: 0.5 }}
              >
                {newUpdateDetail?.tags &&
                  newUpdateDetail?.tags
                    ?.filter((item) => item)
                    ?.map((item) => (
                      <button className="tags-button">{item}</button>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-100" style={{ padding: "30px 40px" }}>
        <div className="d-flex align-items-center" style={{ flexWrap: "wrap" }}>
          {templateList?.length > 0 && (
            <div>
              <Select
                isMulti={false}
                placeholder="Create your compliance event"
                styles={customStyles}
                isClearable={true}
                isSearchable={false}
                components={{
                  DropdownIndicator,
                }}
                onChange={(event) => handleChange(event)}
                options={templateList}
              />
            </div>
          )}
          <div className="mb-0 cursor-pointer mt-2">
            <a
              href={newUpdateDetail?.circularLink}
              className="download-file"
              target="blank"
            >
              Issuer Link
            </a>
          </div>
          {newUpdateDetail?.fileDetails &&
            newUpdateDetail?.fileDetails?.length > 0 && (
              <div
                className="mb-0 cursor-pointer mt-2"
                onClick={() => {
                  if (newUpdateDetail?.fileDetails?.length > 0) {
                    newUpdateDetail?.fileDetails.forEach((file) => {
                      fileDownload(file.fileId);
                    });
                  }
                }}
              >
                <a className="download-file">Download File</a>
              </div>
            )}
          {newUpdateDetail?.quiz && (
            <Link
              to={{
                pathname: path + "/quiz",
                state: {
                  circular_no: newUpdateDetail?.name,
                },
              }}
              onClick={(e) => changeShowUpdateDetail(e, false)}
            >
              <a className="download-file">Quiz</a>
            </Link>
          )}

          <div className="mb-0 cursor-pointer mt-2">
            <a
              className="download-file"
              onClick={() => {
                dispatch(
                  setTaskModalState({
                    ...modalsStatus?.taskModal,
                    isVisible: true,
                    isUpdate: true,
                    editData: {
                      circulars: newUpdateDetail?.circuler_details
                        ? [newUpdateDetail?.circuler_details]
                        : [],
                      circularsList: newUpdateDetail?.topic_wise_circuler_lst
                        ? newUpdateDetail?.topic_wise_circuler_lst
                        : [],
                      task_id: "",
                      milestone_id: null,
                      project_id: null,
                      subject: "",
                      task_list_id: null,
                      start_date: null,
                      end_date: null,
                      frequency: "",
                      frequency_end_date: null,
                      assign_to: null,
                      cc: null,
                      approver: null,
                      description: "",
                      comments: "",
                      repeat_on_holiday: "",
                      repeat_on_day: "",
                      weekly_repeat_day: "",
                      repeat_on_month: "",
                      end_time: null,
                      file_details: [],
                      notify_on: [],
                      internal_deadline_date: null,
                      internal_deadline_day: 0,

                      impact: "",
                      impactFileDetails: [],

                      riskRating: "",
                    },
                  })
                );
              }}
            >
              Create your own task
            </a>{" "}
          </div>

          {data?.length !== 0 && (
            <div className="mb-0 cursor-pointer mt-2">
              <a className="download-file" onClick={() => setOpenModal(true)}>
                Compliance Events
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DropdownIndicator = ({ children, ...props }) => {
  return (
    <div
      className="d-flex align-items-center jusitfy-content-start w-100"
      style={{ marginLeft: "-4px" }}
    >
      <MdArrowDropDown
        className={`${styles.dropdownArrow} ${
          props.isFocused ? styles.dropdownArrowOpen : ""
        }`}
      />
    </div>
  );
};

export default DrawerView;
