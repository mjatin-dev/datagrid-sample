import React, { useEffect, useRef, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import licenseIcon from "assets/Icons/licenseIcon.svg";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./style.scss";
import CreateNewLicense from "./CreateNewLicense";
import { FaEdit } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import RenameLicense from "./RenameLicense";
import axiosInstance from "apiServices";
import Dots from "CommonModules/sharedComponents/Loader/Dots";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";
import LicenseListForApprover from "./LicenseListForApprover";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import { eventsModuleActions } from "Components/Events/redux/actions";
import CommentIcon from "assets/Icons/UserText.png";
const LicenseList = ({
  licenseModal,
  setLicenseModal,
  modalEditState,
  setModalEditState,
}) => {
  const initialEditValues = {
    isAddSubLicene: false,
    isAddParentLicense: false,
    isEdit: false,
    isEditChild: false,
    isRename: false,
  };
  const dispatch = useDispatch();
  const { userDetails } = useGetUserRoles();
  const [renameModal, setRenameModal] = useState(false);
  // const [licenseModal, setLicenseModal] = useState(false);
  // const [modalEditState, setModalEditState] = useState(initialEditValues);
  const { isCEApprover } = useGetUserRoles();
  const [editData, setEditData] = useState({});
  const [licenseData, setLicenseData] = useState([]);
  const [licenseListForApprover, setLicenseListForApprover] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMainIndex, setMainCurrentIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const containerRef = useRef();
  const userTypeNo = useSelector((state) => state?.auth?.loginInfo?.UserType);

  const scrollableHeight = useScrollableHeight(containerRef, 64, [
    licenseData,
    licenseListForApprover,
  ]);

  const selectedUserEmail =
    useSelector((state) => state?.eventsModuleReducer?.selectedUser?.email) ||
    userDetails.email;
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const fetchLicenseList = () => {
    setIsLoading(true);

    try {
      if (!isCEApprover) {
        axiosInstance
          .post("compliance.api.getLicenseListForManager", {
            email_id: selectedUserEmail,
          })
          .then((res) => {
            setIsLoading(false);

            if (res.status === 200 && res.data.message.status) {
              let industryData = [];
              res?.data?.message?.industry_license_list.map((item, index) => {
                let tempLicenseData = [];
                item?.license.map((licenseItem, index) => {
                  tempLicenseData.push({
                    ...licenseItem,
                    DropDownExpanded: false,
                    menueExpanded: false,
                  });
                });
                industryData.push({
                  DropDownExpanded: false,
                  menueExpanded: false,
                  industry: item.industry,
                  license: tempLicenseData,
                });
              });

              setLicenseData(industryData);
            }
          })
          .catch((err) => {
            setIsLoading(false);
          });
      }
    } catch (err) {
      setIsLoading(false);
    }
  };
  const fetchLicenseListForCEApprover = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.post(
        "compliance.api.GetSingleLicenseList",
        {
          email_id: selectedUserEmail,
        }
      );
      if (status === 200 && data.message?.status) {
        setIsLoading(false);
        setLicenseListForApprover(data?.message?.license_list || []);
      } else {
        setIsLoading(false);
        setLicenseListForApprover([]);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleClose = (event, type, data) => {
    if (event?.stopPropagation) {
      event.stopPropagation();
    }

    setAnchorEl(null);
    if (type === "addChild") {
      setModalEditState({
        ...modalEditState,
        isAddSubLicene: true,
      });
      setLicenseModal(true);
      setEditData(data);
    } else if (type === "edit") {
      setModalEditState({
        ...modalEditState,
        isEdit: true,
      });
      setLicenseModal(true);
      setEditData(data);
    } else if (type === "rename") {
      setRenameModal(true);
      setModalEditState({
        ...modalEditState,
        isRename: true,
      });
      setEditData(data);
    }
  };

  const onHandleExpandOpen = (e, item, mainIndex, index) => {
    e.stopPropagation();
    let TempFaqData = [...licenseData];

    TempFaqData[mainIndex].license.map((item, Eindex) => {
      if (Eindex === index) {
        TempFaqData[mainIndex].license[Eindex].DropDownExpanded = true;
      } else {
        TempFaqData[mainIndex].license[Eindex].DropDownExpanded = false;
      }
    });

    setLicenseData(TempFaqData);
  };

  const onHandleExpandMainOpen = (e, item, index) => {
    e.stopPropagation();
    setMainCurrentIndex(index);
    let TempFaqData = [...licenseData];
    TempFaqData.map((item, Eindex) => {
      if (Eindex === index) {
        TempFaqData[Eindex].DropDownExpanded = true;
      } else {
        TempFaqData[Eindex].DropDownExpanded = false;
      }
    });
    setLicenseData(TempFaqData);
  };

  const onHandleExpandClose = (e, item, mainIndex, index) => {
    // e.stopPropagation();
    let TempFaqData = [...licenseData];

    TempFaqData[mainIndex].license.map((item, Eindex) => {
      TempFaqData[mainIndex].license[Eindex].DropDownExpanded = false;
    });
    setLicenseData(TempFaqData);
  };

  const onHandleExpandMainClose = (e, item, index) => {
    // e.stopPropagation();
    let TempFaqData = [...licenseData];
    TempFaqData[index].DropDownExpanded = false;
    setLicenseData(TempFaqData);
  };
  const onChildItemsOperations = (type, data) => {
    if (type === "edit") {
      setModalEditState({
        ...modalEditState,
        isEditChild: true,
      });
      setLicenseModal(true);
      setEditData(data);
    } else if (type === "rename") {
      setRenameModal(true);
      setModalEditState({
        ...modalEditState,
        isRename: true,
      });
      setEditData(data);
    }
  };

  const modalStateReset = () => {
    setLicenseModal(false);
    setRenameModal(false);
    setModalEditState(initialEditValues);
    setEditData({});
  };

  useEffect(() => {
    if (isCEApprover) {
      fetchLicenseListForCEApprover();
    } else {
      fetchLicenseList();
    }
  }, []);
  return (
    <div>
      {/* <BackDrop isLoading={isLoading} /> */}
      <RenameLicense
        open={renameModal}
        handleClose={modalStateReset}
        editdata={editData}
        isRename={modalEditState.isRename}
        refreshFn={fetchLicenseList}
      />
      <CreateNewLicense
        open={licenseModal}
        isAddSubLicene={modalEditState.isAddSubLicene}
        isAddParentLicense={modalEditState.isAddParentLicense}
        isEdit={modalEditState.isEdit}
        isEditChild={modalEditState.isEditChild}
        editdata={editData}
        refreshFn={
          isCEApprover ? fetchLicenseListForCEApprover : fetchLicenseList
        }
        handleClose={modalStateReset}
      />
      <div
        ref={containerRef}
        className="compliance__license__tab mt-3"
        style={{ height: scrollableHeight, overflowY: "auto" }}
      >
        {isLoading ? (
          <Dots />
        ) : isCEApprover ? (
          <LicenseListForApprover
            onChildItemsOperations={onChildItemsOperations}
            onParentItemsOperations={handleClose}
            fetchList={fetchLicenseListForCEApprover}
            list={licenseListForApprover}
            setList={setLicenseListForApprover}
          />
        ) : (
          licenseData.map((industry, industryIndex) => {
            return (
              <Accordion
                expanded={industry.DropDownExpanded}
                key={industryIndex}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        if (industry?.license?.length > 0) {
                          industry.DropDownExpanded
                            ? onHandleExpandMainClose(
                                e,
                                industry,
                                industryIndex
                              )
                            : onHandleExpandMainOpen(
                                e,
                                industry,
                                industryIndex
                              );
                        }
                      }}
                    />
                  }
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography
                    className="truncate"
                    sx={{ width: "80%", flexShrink: 0 }}
                    title={industry.industry}
                  >
                    {industry.industry}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {industry?.license?.map((item, index) => (
                    <Accordion expanded={item.DropDownExpanded} key={index}>
                      <AccordionSummary
                        expandIcon={
                          item?.sublicense?.length > 0 && (
                            <ExpandMoreIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                if (item?.sublicense?.length > 0) {
                                  item.DropDownExpanded
                                    ? onHandleExpandClose(
                                        e,
                                        item,
                                        industryIndex,
                                        index
                                      )
                                    : onHandleExpandOpen(
                                        e,
                                        item,
                                        industryIndex,
                                        index
                                      );
                                }
                              }}
                            />
                          )
                        }
                        aria-controls={`panel1bh-content_${index}`}
                        id={`panel1bh-header_${index}`}
                      >
                        <Typography sx={{ flex: 1 }}>
                          <img
                            src={licenseIcon}
                            style={{ marginRight: "10px" }}
                            alt="license"
                          />
                          {item?.license_id}
                        </Typography>
                        <Typography sx={{ width: "20%", flexShrink: 0 }}>
                          {item?.status}
                        </Typography>
                        <IconButton
                          onClick={() => {
                            dispatch(
                              eventsModuleActions.setCommentModal({
                                visible: true,
                                commentDetails: {
                                  doctype: "Pending License",
                                  docname: item.temp_license_id,
                                },
                              })
                            );
                          }}
                        >
                          <img src={CommentIcon} alt="comment" />
                        </IconButton>
                        <span
                          style={{
                            zIndex: 10,
                          }}
                          className="d-flex align-items-center justify-content-center mr-4"
                          onClick={(e) => {
                            setCurrentIndex(index);
                            handleClick(e);
                          }}
                        >
                          <Button
                            id={`basic-button${index}`}
                            aria-controls={
                              open ? `basic-menu${index}` : undefined
                            }
                            aria-haspopup="true"
                            sx={{ minWidth: "0px" }}
                          >
                            <MoreVertIcon />
                          </Button>
                          <Menu
                            id={`basic-menu${index}`}
                            keepMounted
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": `basic-button${index}`,
                            }}
                            className="create_license__menue__list"
                          >
                            <MenuItem
                              disableTouchRipple
                              onClick={(event) => {
                                handleClose(
                                  event,
                                  "edit",
                                  licenseData[currentMainIndex].license[
                                    currentIndex
                                  ]
                                );
                              }}
                            >
                              <FaEdit />
                              Edit
                            </MenuItem>
                            <MenuItem
                              disableTouchRipple
                              onClick={(event) => {
                                if (
                                  licenseData[currentMainIndex]?.license[
                                    currentIndex
                                  ]?.status === "Approved"
                                ) {
                                  handleClose(event, "addChild", {
                                    ...licenseData[currentMainIndex].license[
                                      currentIndex
                                    ],
                                    industry: industry?.industry,
                                  });
                                } else {
                                  event.stopPropagation();
                                  setAnchorEl(null);
                                  toast.error(
                                    "Child License cannot be created unless the parent license is approved. Contact SecMark Admin for the further assistance"
                                  );
                                }
                              }}
                            >
                              <MdAddCircleOutline />
                              Add child
                            </MenuItem>
                            {/* <MenuItem
                    onClick={(event) =>
                      handleClose(event, "rename", licenseData[currentIndex])
                    }
                  >
                    <BsPencil />
                    Rename
                  </MenuItem> */}
                            {/* <MenuItem onClick={(event) => handleClose(event, "delete")}>
                    <MdOutlineDeleteOutline />
                    Delete
                  </MenuItem> */}
                          </Menu>
                        </span>
                        {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
                      </AccordionSummary>
                      {item?.sublicense?.length > 0 && (
                        <AccordionDetails onClick={(e) => e.stopPropagation()}>
                          <ul className="license__tab__subLicense">
                            {item?.sublicense?.map((title, i) => (
                              <li key={i}>
                                <span
                                  className="truncate"
                                  style={{ width: "70%" }}
                                  title={title.license_display}
                                >
                                  {title.license_display}
                                </span>
                                <span className="truncate" title={title.status}>
                                  {title.status}
                                </span>
                                {title?.temp_license_id && (
                                  <IconButton
                                    onClick={() => {
                                      dispatch(
                                        eventsModuleActions.setCommentModal({
                                          visible: true,
                                          commentDetails: {
                                            doctype: "Pending License",
                                            docname: title.temp_license_id,
                                          },
                                        })
                                      );
                                    }}
                                  >
                                    <img src={CommentIcon} alt="comment" />
                                  </IconButton>
                                )}
                                <div className="license__tab__subLicense__btns">
                                  <button
                                    title="edit"
                                    onClick={() => {
                                      onChildItemsOperations("edit", title);
                                    }}
                                  >
                                    <FaEdit />
                                  </button>
                                  {/* <button
                          title="rename"
                          onClick={() => {
                            onChildItemsOperations("rename", i, title);
                          }}
                        >
                          <BsPencil />
                        </button> */}
                                  {/* <button title="delete">
                        <MdOutlineDeleteOutline />
                      </button> */}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </AccordionDetails>
                      )}
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </div>
    </div>
  );
};
export default LicenseList;
