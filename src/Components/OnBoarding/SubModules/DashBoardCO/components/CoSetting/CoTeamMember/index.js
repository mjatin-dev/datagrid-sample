/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import ReAssignTasksModal from "../../../../../../ReAssignTasks";
import redCheck from "../../../../../../../assets/Icons/redCheck.png";
import greenCheck from "../../../../../../../assets/Icons/greenCheck.png";
import closeBlack from "../../../../../../../assets/Icons/closeBlack.png";
import changeRoleClose from "../../../../../../../assets/Icons/changeRoleClose.png";
import dropDownIcon from "../../../../../../../assets/Icons/dropDownIcon.png";
import threeDots from "../../../../../../../assets/Icons/threeDots.PNG";
import closeIconGray from "../../../../../../../assets/Icons/closeIconGray.png";
import searchIcon from "../../../../../../../assets/Icons/searchIcon.png";
import { useDispatch, useSelector } from "react-redux";
import { useOuterClick } from "../../RightSideGrid/outerClick";
import { Modal } from "react-responsive-modal";
import Dropdown from "react-dropdown";
import { toast } from "react-toastify";
import { actions as coActions } from "../../../redux/actions";

import "react-responsive-modal/styles.css";
import { isEmail } from "../../../../AssignTask/utils";
import axiosInstance from "../../../../../../../apiServices";
import { BACKEND_BASE_URL } from "../../../../../../../apiServices/baseurl";
import Searchable from "react-searchable-dropdown";
import BackDrop from "../../../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { actions as signInSignUpActions } from "../../../../../../Authectication/redux/actions";

import apiServices from "../../../api/index";
import { getUserLlistByUserType } from "../../RightSideGrid";
import {
  removeWhiteSpaces,
  teamMembersSearch,
} from "../../../../../../../CommonModules/helpers/string.helpers";
import { MdAdd, MdClose, MdSearch } from "react-icons/md";
import { isEmpty, isEqual } from "lodash";
import { Button, IconButton } from "@mui/material";
import MultiSelectInput from "Components/Audit/components/MultiSelectInput";
import { MoreVert } from "@mui/icons-material";
import useScrollableHeight from "SharedComponents/Hooks/useScrollableHieght";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import NoResultFound from "CommonModules/sharedComponents/NoResultFound";
import { useDebounce } from "CommonModules/helpers/custom.hooks";
const { getUsersByRole } = apiServices;
var _ = require("lodash");

function CoManagment({ handleClose }) {
  const [departmentList, setDepartmentList] = useState([]);
  const filterOptions = [
    { value: "0", label: "None" },
    { value: "4", label: "Team Members" },
    { value: "5", label: "Approvers" },
    { value: "3", label: "CO" },
    { value: "az", label: "A > Z" },
    { value: "za", label: "Z > A" },
  ];
  const scrollableListRef = useRef();
  const listScrollHeight = useScrollableHeight(scrollableListRef, 48, []);
  const [showCompanyData, setShowCompanyData] = useState({
    isShowModal: false,
    companyList: [],
    index: null,
    item: null,
    selectedCompany: null,
  });
  const dispatch = useDispatch();
  const [addNew, setAddNew] = useState(false);
  const state = useSelector((state) => state);
  const { userRoles } = useSelector((state) => state.auth);
  let defaultOption = userRoles[0];

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [alreadyExist, setAlreadyExist] = useState(false);

  const auth = state && state.auth;
  const userDetails = auth && auth.loginInfo;
  const [searchText, setSearchText] = useState("");
  const searchQuery = useDebounce(searchText, 500);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputTeamMember, setInputTeamMember] = useState({
    full_name: "",
    email: "",
    role: [],
  });
  const [isValidate, setIsValidate] = useState(false);

  const [teamMemberData, setMemberData] = useState([]);
  const [user, setUser] = useState("");

  const [fields, setFields] = useState([
    {
      first_name: "",
      last_name: "",
      full_name: "",
      designation: "",
      email: "",
      mobile_no: "",
      countrycode: "",
      group: [],
    },
  ]);

  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);

  const [filterOption, setFilterOption] = useState("");

  const [visible, setVisible] = useState(false);
  const [openPopupIndex, setOpenPopupIndex] = useState("");
  const [deleteMemeberIndex, setDeleteMemberIndex] = useState("");
  const [fieldArray, setFieldsArray] = useState([
    {
      id: "",
      index: 0,
      initialsName: "",
      full_name: "",
      role: "",
      UserType: "",
      roleDropDown: "",
      email: "",
      mobileNuber: "",
      showAcceptDelectIcon: false,
    },
  ]);

  const [currentRow, setCurrentRow] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [currentUserDetail, setCurrentUserDetail] = useState({});

  const [fieldArrayBackup, setFieldsArrayBackup] = useState([
    {
      id: "",
      index: 0,
      initialsName: "",
      full_name: "",
      role: "",
      UserType: "",
      roleDropDown: "",
      email: "",
      mobileNuber: "",
      showAcceptDelectIcon: false,
    },
  ]);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const innerRef = useOuterClick((e) => {
    if (openPopupIndex !== "") setOpenPopupIndex("");
  });

  const [isShowReAssignModal, setIsShowReAssignModal] = useState(false);
  const [isShowReAssignModalMobile, setIsShowReAssignModalMobile] =
    useState(false);
  const [reAssignUserType, setReAssignUserType] = useState(null);
  const [reAssignUserId, setReAssignUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const emailAddress =
    state?.auth?.loginInfo?.EmailID || state?.auth?.loginInfo?.email;
  const companyList = state.taskReport?.companyTypeInfo?.CompanyInfo;
  useEffect(() => {
    dispatch(signInSignUpActions.getUserRolesRequest());
    dispatch(coActions.getCompanyTypeRequest());
  }, []);

  useEffect(() => {
    if (companyList && companyList?.length > 0) {
      const _tempList = companyList.map((item) => ({
        label: item.company_name,
        value: item.company_docname,
      }));
      setShowCompanyData({ ...showCompanyData, companyList: _tempList });
    }
  }, [companyList]);

  useEffect(() => {
    getSettingData();
    setFilterOption(filterOptions[0]);
    setIsLoading(true);
  }, []);
  const getUserGroup = () =>
    axiosInstance
      .get(`compliance.api.getUserGroup`)
      .then((res) => {
        if (res?.data?.message?.data) {
          let _tempDepartmentList = res?.data?.message?.data || [];
          _tempDepartmentList = [..._tempDepartmentList].map((item) => ({
            label: item,
            value: item,
          }));
          setDepartmentList([..._tempDepartmentList]);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  useEffect(() => {
    getUserGroup();
  }, []);

  const getSettingData = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        `${BACKEND_BASE_URL}compliance.api.getUserList`,
        {
          params: {
            isFromAssignPage: false,
          },
        }
      );
      if (status === 200 && data?.message?.length > 0) {
        if (typeof data?.message === "object") {
          setMemberData(data?.message);
        } else {
          setMemberData([]);
        }
        setIsLoading(false);
        getUserGroup();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const onChangeRoleClick = (type, item, index) => {
    if (isEmpty(item.id)) {
      if (type === "desktop") {
        changeRole(index);
        setOpenPopupIndex("");
      } else if (type === "mobile") {
        changeRoleMobile(item, index);
        setOpenPopupIndex("");
      }
    }
  };
  const mobileFilterRef = useOuterClick((e) => {
    if (showMobileFilter === true) {
      setShowMobileFilter(false);
    }
  });

  const changeRoleMobile = (item, index) => {
    const drawerParent = document.getElementById("drawerParent");
    const drawerChild = document.getElementById("drawerChild");
    if (drawerParent) {
      drawerParent.classList.add("overlayChangeRole");
      drawerChild.style.bottom = "0%";
    }
    setCurrentRow(item);
  };
  const closeChangeRole = () => {
    const drawerParent = document.getElementById("drawerParent");
    const drawerChild = document.getElementById("drawerChild");
    if (drawerParent) {
      drawerParent.classList.remove("overlayChangeRole");
      drawerChild.style.bottom = "-100%";
    }
    setCurrentRow([]);
  };

  const getInitials = (name) => {
    const nameArray = name ? name.split(" ") : " ";
    if (nameArray.length > 1) {
      return `${nameArray[0].slice(0, 1)}${nameArray[nameArray.length - 1]
        .slice(0, 1)
        .toUpperCase()}`;
    } else {
      return `${nameArray[0].slice(0, 2).toUpperCase()}`;
    }
  };

  const editItem = (index) => {
    const temp = [...fields];
    temp[index].isEdit = !temp[index].isEdit;
    if (temp[index].isEdit) {
      temp[index].updatedGroup = temp[index].group;
    } else {
      temp[index].updatedGroup = [];
    }
    setFields(temp);
    setOpenPopupIndex("");
  };
  useEffect(() => {
    let fieldArray = [];
    if (teamMemberData && teamMemberData.length > 0) {
      teamMemberData.map((item, index) => {
        let obj = {
          id: index,
          index: index,
          full_name: item.full_name,
          initialsName: getInitials(
            item.full_name && item.full_name.toUpperCase()
          ),
          role: item.user_type.map((types) => types.role).toString(),
          roleDropDown: "",
          UserType: item.user_type
            .map((types) => types.user_type_no)
            .toString(),
          email: item.email,
          mobileNumber: item.mobile_no,
          showAcceptDelectIcon: false,
          group: item.groups,
          isEdit: false,
        };

        fieldArray.push(obj);
      });
      setFields(fieldArray);
      setFieldsArray(fieldArray);
      setFieldsArrayBackup(fieldArray);
    }
  }, [teamMemberData]);

  const onDeletePress = (index) => {
    setOpenPopupIndex("");
    const payload = {
      email: fields[index].email,
    };
    axiosInstance
      .post(`${BACKEND_BASE_URL}compliance.api.deactivateUser`, payload)
      .then(function (response) {
        if (response && response.data && response.data.message.status) {
          getSettingData();
          toast.success("Deleted records sucessfully");
          setDeleteMemberIndex("");
        } else {
          toast.error(
            response?.data?.message?.status_response ||
              "Something went wrong !!!"
          );
          setVisible(false);
          setOpenPopupIndex("");
          setDeleteMemberIndex("");
        }
      })
      .catch(function (error) {
        setDeleteMemberIndex("");
      });
  };

  const _createDelectActionModal = (index) => {
    // setOpenPopupIndex("");
    return (
      <div className="deletemodal">
        <Modal
          blockScroll={false}
          classNames={{
            overlayAnimationIn: "",
            overlayAnimationOut: "",
            modalAnimationIn: "",
            modalAnimationOut: "",
            modal: "customModal",
          }}
          open={visible}
          center={true}
          showCloseIcon={false}
          onClose={() => setVisible(false)}
          //modalId="governance"
          styles={{ width: 373, height: 210, overflow: "hidden" }}
          onOverlayClick={() => setVisible(false)}
        >
          <div className="model-design-delete-company big-height">
            <div className="delete-record-title">Delete team member?</div>
            <div className="delete-desc">
              Are you sure you want to delete the record of &nbsp;team
              member&nbsp;? All assigned tasks will be deleted. You will have to
              re-assign those tasks to other members.
            </div>

            <div className="last-two-model-btn" style={{ marginTop: 20 }}>
              <button
                onClick={() =>
                  getMembers(currentUserDetail.role, currentUserDetail.email)
                }
                className="btn cancel-delete"
              >
                Reassign Task
              </button>
              <button
                onClick={() => {
                  setVisible(false);
                  setOpenPopupIndex("");
                  setDeleteMemberIndex("");
                }}
                className="btn cancel-delete"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeletePress(deleteMemeberIndex);
                  setDeleteMemberIndex("");
                }}
                className="btn delete-Record"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  };
  const handleSearchInputChange = (e) => {
    setSearchText(removeWhiteSpaces(e.target.value));
  };

  const onClickSearchMobileIcon = () => {
    const element = document.getElementById("searchBox");
    if (element) {
      element.classList.remove("searchBoxMobile");
    }
    const filterArray = [...fieldArray];
    if (isSearchOpenMobile) {
      setFields(filterArray);
      setIsSearchOpenMobile(false);
    } else {
      setIsSearchOpenMobile(true);
    }

    setSearchText("");
  };
  const onClickSearchIcon = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(true);
    }
    setSearchText("");
  };

  const _filterBy = (filterOption, mobileFilter) => {
    let data = [];
    if (mobileFilter === undefined) {
      setFilterOption(filterOption);
      if (filterOption.value === "za") {
        data = _.values(fieldArray).sort((a, b) =>
          b.full_name.localeCompare(a.full_name)
        );
        setFields(data);
      } else if (filterOption.value === "az") {
        data = _.values(fieldArray).sort((a, b) =>
          a.full_name.localeCompare(b.full_name)
        );
        setFields(data);
      } else if (filterOption.value === "0") {
        const list = [...fieldArrayBackup];
        setFields(list);
      } else if (filterOption.value === "3") {
        data = fieldArray.filter(function (item) {
          return item.UserType.includes(parseInt(filterOption.value));
        });
        setFields(data);
      } else if (filterOption.value === "4") {
        data = fieldArray.filter(function (item) {
          return item.UserType.includes(parseInt(filterOption.value));
        });
        setFields(data);
      } else if (filterOption.value === "5") {
        data = fieldArray.filter(function (item) {
          return item.UserType.includes(parseInt(filterOption.value));
        });
        setFields(data);
      }
    } else {
      setShowMobileFilter(false);
      if (filterOption === "za") {
        data = _.values(fieldArray).sort((a, b) =>
          b.full_name.localeCompare(a.full_name)
        );
        setFields(data);
      } else if (filterOption === "az") {
        data = _.values(fieldArray).sort((a, b) =>
          a.full_name.localeCompare(b.full_name)
        );
        setFields(data);
      } else if (filterOption === "0") {
        const list = [...fieldArrayBackup];
        setFields(list);
      } else if (filterOption === "3") {
        data = fieldArray.filter(function (item) {
          return item.UserType === parseInt(filterOption);
        });
        setFields(data);
      } else if (filterOption === "4") {
        data = fieldArray.filter(function (item) {
          return item.UserType === parseInt(filterOption);
        });
        setFields(data);
      } else if (filterOption === "5") {
        data = fieldArray.filter(function (item) {
          return item.UserType === parseInt(filterOption);
        });
        setFields(data);
      }
    }
  };

  const openPopup = (index) => {
    setOpenPopupIndex(index);
  };
  const changeRole = (key) => {
    setOpenPopupIndex("");
    const list = [...fields];
    list[key].showAcceptDelectIcon = true;
    setFields(list);
  };

  const onConfirmChangeRole = (data, key, dropDown, selectedCompany) => {
    let role;
    const { email, full_name } = data;
    if (dropDown) {
      role = dropDown;
    } else if (key !== null || key !== undefined) {
      role = fields[key].roleDropDown.label;
    }
    if (role && email) {
      const payload = {
        data: {
          role_list: [
            {
              name: email,
              roles: [role],
              ...(selectedCompany && { company: selectedCompany.value }),
            },
          ],
        },
      };
      try {
        setIsLoading(true);
        axiosInstance
          .post("compliance.api.setUserRoles", payload)
          .then(function (response) {
            if (response?.data && response?.data?.message?.status) {
              toast.success(
                `${full_name || "User"}'s role changed sucessfully`
              );
              getSettingData();
              if (selectedCompany) {
                setShowCompanyData({
                  ...showCompanyData,
                  item: null,
                  index: null,
                  selectedCompany: null,
                  isShowModal: false,
                });
              }
              setIsLoading(false);
            } else {
              toast.error(
                response?.data?.message?.status_response ||
                  "Something went wrong !!!"
              );
              setIsLoading(false);
            }
          })
          .catch(function (error) {
            setIsLoading(false);
          });
      } catch (error) {
        setIsLoading(false);
        toast.error("Something went wrong!");
      }
    } else {
      toast.error("Please select valid role.");
    }
  };

  const cancelCheckIcon = (key) => {
    const list = [...fields];
    list[key].showAcceptDelectIcon = false;
    setFields(list);
  };
  const onChangeRoleDropDown = (data, key) => {
    defaultOption = data;
    onClickRoleDropDown(data, key);
  };

  const onClickRoleDropDown = (data, index) => {
    const list = [...fields];
    list[index].roleDropDown = data;
    setFields(list);
  };

  const handleChangeInputBoxRole = (value) => {
    const newValue = value.map((types) => {
      return {
        role: userRoles.filter((role) => role.value === types)[0].label,
      };
    });
    setInputTeamMember({ ...inputTeamMember, role: newValue });
  };

  const handleChangeRoleMobile = (value) => {
    const newValue = userRoles.find(
      (element) => element.value === value
    )?.label;

    setInputTeamMember({ ...inputTeamMember, role: newValue });
    onConfirmChangeRole(currentRow, openPopupIndex, newValue);
    closeChangeRole();
  };
  const handleDepartmentChange = (value, index, isNewUser = false) => {
    let tempFields = [...(fields || [])];
    if (!isNewUser)
      tempFields[index].updatedGroup = value.map((item) => item.value);
    else if (isNewUser)
      inputTeamMember.updatedGroup = value.map((item) => item.value);
    setFields([...(tempFields || [])]);
  };

  const handleDepartmentInputChange = (value, index, isNewUser = false) => {
    const newValue =
      [...(value || [])].filter((item) => item.__isNew__)[0] || null;

    if (
      newValue &&
      newValue.value &&
      removeWhiteSpaces(newValue.value) !== " "
    ) {
      // validaiton
      const previousValues =
        [...(value || [])].filter((item) => !item.__isNew__) || [];
      const updatedValue = removeWhiteSpaces(newValue.value);
      handleDepartmentChange(
        [
          ...previousValues,
          {
            label: updatedValue,
            value: updatedValue,
          },
        ],
        index,
        isNewUser
      );
    } else {
      handleDepartmentChange(value, index, isNewUser);
    }
  };

  const setUserDepartment = async (index) => {
    const group = fields[index].group;
    const updatedGroup = fields[index].updatedGroup || [];
    const against_user = fields[index].email;
    if (!isEqual(updatedGroup, group)) {
      setIsLoading(true);
      try {
        const { status } = await axiosInstance.post(
          `compliance.api.setUserGroup`,
          {
            against_user,
            group: updatedGroup || [],
          }
        );

        if (status === 200) {
          toast.success("Group updated successfully!");
        }
      } catch (error) {}
      getSettingData();
    }
    setFilterOption(filterOptions[0]);
    editItem(index);
  };
  const onChangeHandler = (name) => (e) => {
    setIsValidEmail(true);
    setAlreadyExist(false);
    const { name } = e.target;
    if (name === "full_name") {
      const re = /^[a-zA-Z ]{0,56}$/;
      if (e.target.value && !re.test(e.target.value)) {
        return;
      }
    }
    if (name === "email") {
      onValidateEmail(e);
    }
    setInputTeamMember({
      ...inputTeamMember,
      [name]: removeWhiteSpaces(e.target.value),
    });
  };

  const onValidateEmail = async (e) => {
    if (isEmail(e.target.value)) {
      let email = e.target.value;

      let emailAssign = teamMemberData.find((item) => item.EmailID === email);

      if (emailAssign === undefined) {
        setAlreadyExist(false);
        let payload = {
          email: e.target.value,
        };
        await axiosInstance
          .post(`${BACKEND_BASE_URL}compliance.api.avabilityCheck`, payload)
          .then(function (response) {
            if (response && response.data && response.data.message.status) {
              setIsValidEmail(false);
            } else {
              setIsValidEmail(true);
            }
          })
          .catch(function (error) {
            if (error) {
            }
          });
      } else {
        setAlreadyExist(true);
      }
    }
  };
  const checkButtonDisabled = () => {
    let isNext = true;
    if (
      inputTeamMember.full_name === "" ||
      inputTeamMember.full_name === " " ||
      inputTeamMember.email === "" ||
      !isEmail(inputTeamMember.email) ||
      (inputTeamMember.role && inputTeamMember.role.length === 0)
    ) {
      isNext = false;
      return isNext;
    }
    return isNext;
  };
  const onAddNewMemberMobile = () => {
    const drawerParent = document.getElementById("drawerParentAddNew");
    const drawerChild = document.getElementById("drawerChildAddNew");
    if (drawerParent) {
      drawerParent.classList.add("overlayAccount");
      drawerChild.style.bottom = "0%";
    }
  };

  const closeMemberMobilePOP = () => {
    const drawerParent = document.getElementById("drawerParentAddNew");
    const drawerChild = document.getElementById("drawerChildAddNew");
    if (drawerParent) {
      drawerParent.classList.remove("overlayAccount");
      drawerChild.style.bottom = "-100%";
    }
  };
  const MoreDetails = (item) => {
    setCurrentRow(item);
    const drawerParent = document.getElementById("moreDetailsParent");
    const drawerChild = document.getElementById("moreDetailsChild");
    if (drawerParent) {
      drawerParent.classList.add("overlayMoreDetails");
      drawerChild.style.bottom = "0%";
    }
  };

  const closeMoreDetails = () => {
    const drawerParent = document.getElementById("moreDetailsParent");
    const drawerChild = document.getElementById("moreDetailsChild");
    if (drawerParent) {
      drawerParent.classList.remove("overlayMoreDetails");
      drawerChild.style.bottom = "-100%";
    }
    setCurrentRow([]);
  };

  const serachOpenMobile = () => {
    setIsSearchOpenMobile(true);
    const element = document.getElementById("searchBox");
    if (element) {
      element.classList.add("searchBoxMobile");
    }
  };
  const onsubmit = (str) => {
    let _userRole = inputTeamMember.role;
    if (
      inputTeamMember.full_name === "" ||
      inputTeamMember.email === "" ||
      !isEmail(inputTeamMember.email) ||
      _userRole.length === 0 ||
      !isValidEmail
    ) {
      setIsValidate(true);
      return "";
    } else {
      setIsValidate(false);
    }
    const details = {
      first_name: inputTeamMember.full_name,
      last_name: null,
      group: inputTeamMember.group || inputTeamMember.updatedGroup || [],
      full_name: inputTeamMember.full_name,
      designation: null,
      email: inputTeamMember.email,
      mobile_no: null,
      countrycode: null,
      user_type: _userRole,
    };

    if (_userRole) {
      setIsLoading(true);
      axiosInstance
        .post(`${BACKEND_BASE_URL}compliance.api.setUser`, { details })
        .then(function (response) {
          if (response && response.data.message) {
            if (response.data.message.status === false) {
              toast.error(
                response?.data?.message?.status_response ||
                  "Something went wrong !!!"
              );
              setIsLoading(false);
            } else {
              setIsLoading(false);
              addSelectedDepartment();
              toast.success("The invitation has been sent through email");
              setTimeout(() => {
                setAddNew(false);
                setInputTeamMember({
                  full_name: "",
                  email: "",
                  role: [],
                });
              }, 800);
              getSettingData();
              if (str && str === "mobile") {
                closeMemberMobilePOP();
              }
            }
          } else {
            setIsLoading(false);
            toast.error("Something went wrong !!!");
          }
        })
        .catch(function (error) {
          if (error) {
            setIsLoading(false);
          }
        });
    } else {
      toast.error("Please select role");
    }
  };

  const getMembers = (role, user) => {
    getUsersByRole()
      .then((response) => {
        const { data } = response;
        const { message } = data;
        if (message && message?.length !== 0) {
          const roles = role?.split(",");
          setUser(user);
          setMemberList(
            getUserLlistByUserType(
              message,
              roles?.includes("Compliance Officer")
                ? 3
                : roles?.includes("Approver")
                ? 5
                : roles?.includes("Team Member")
                ? 4
                : ""
            ).filter((item) => item.email !== user)
          );
          setIsShowReAssignModal(true);
          setOpenPopupIndex("");
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const addSelectedDepartment = async () => {
    try {
      const { status } = await axiosInstance.post(
        `compliance.api.setUserGroup`,
        {
          against_user: inputTeamMember.email,
          group: inputTeamMember?.updatedGroup || [],
        }
      );

      if (status === 200) {
        getSettingData();
      }
    } catch (error) {}
  };

  return (
    <>
      <ProjectManagementModal
        visible={showCompanyData.isShowModal}
        // isNotCloseable
        onClose={() =>
          setShowCompanyData({
            ...showCompanyData,
            isShowModal: false,
            index: null,
            item: null,
            selectedCompany: null,
          })
        }
      >
        <h4>Select Company</h4>
        <MultiSelectInput
          multiple={false}
          options={showCompanyData.companyList}
          value={showCompanyData.selectedCompany || null}
          onChange={(data) =>
            setShowCompanyData({ ...showCompanyData, selectedCompany: data })
          }
        />
        <div className="d-flex align-items-center justify-content-end mt-4">
          <Button
            variant="contained"
            disabled={!showCompanyData.selectedCompany}
            size="small"
            onClick={() =>
              onConfirmChangeRole(
                showCompanyData.item,
                showCompanyData.index,
                null,
                showCompanyData.selectedCompany
              )
            }
          >
            Confirm
          </Button>
        </div>
      </ProjectManagementModal>
      <div className="co-team-member mt-4">
        <BackDrop isLoading={isLoading} />
        <ReAssignTasksModal
          recallMemberList={getSettingData}
          openModal={isShowReAssignModal}
          setShowModal={setIsShowReAssignModal}
          userType={reAssignUserType}
          userId={reAssignUserId}
          memberList={memberList}
          user={user}
          handleDeleteMember={
            deleteMemeberIndex && (() => onDeletePress(deleteMemeberIndex))
          }
        />
        <ReAssignTasksModal
          recallMemberList={getSettingData}
          openModal={isShowReAssignModalMobile}
          setShowModal={setIsShowReAssignModalMobile}
          userType={reAssignUserType}
          userId={reAssignUserId}
          memberList={memberList}
          user={user}
          handleDeleteMember={
            deleteMemeberIndex && (() => onDeletePress(deleteMemeberIndex))
          }
        />
        {visible &&
          deleteMemeberIndex !== "" &&
          _createDelectActionModal(deleteMemeberIndex)}
        <div className="d-none d-md-block">
          <div className="d-flex mb-3 align-items-center">
            <div className="personal-mgt-title"></div>
            <div className="right__sight__filter">
              <span className="filter-text">Filter By:</span>
              <Dropdown
                onChange={(value) => _filterBy(value)}
                arrowClosed={<span className="arrow-closed" />}
                arrowOpen={<span className="arrow-open" />}
                options={filterOptions}
                value={filterOption}
                placeholder="Select an option"
              />
            </div>

            {isSearchOpen && (
              <div className="right-search-bar searchBox">
                <div className="input-group form-group">
                  {searchText.length > 0 ? (
                    <input
                      className="form-control setPlaceHolder textwithoutFocus"
                      type="text"
                      placeholder="Search by Full name, email-Id and Mobile No"
                      value={searchText}
                      onChange={(e) => handleSearchInputChange(e)}
                      autoFocus
                    />
                  ) : (
                    <input
                      className="form-control setPlaceHolder"
                      type="text"
                      placeholder="Search by Full name, email-Id and Mobile No"
                      value={searchText}
                      onChange={(e) => handleSearchInputChange(e)}
                      autoFocus
                    />
                  )}

                  <img
                    className="IconGray"
                    src={searchIcon}
                    alt="team Search Icon"
                  />
                  <IconButton
                    disableTouchRipple={false}
                    onClick={() => onClickSearchIcon()}
                    className="input-group-append"
                  >
                    <MdClose />
                  </IconButton>
                  {/* <span className="input-group-append">

                    <button
                      onClick={() => onClickSearchIcon()}
                      type="button"
                    >
                      <img src={closeIconGray} alt="team Search Icon" />
                    </button>
                  </span> */}
                </div>
              </div>
            )}
            {!isSearchOpen && (
              <div className="right-search-bar">
                <IconButton
                  disableTouchRipple={true}
                  onClick={() => onClickSearchIcon()}
                >
                  <MdSearch style={{ color: "#000" }} />
                </IconButton>
                {userDetails && userDetails.UserType !== 6 && (
                  <div
                    onClick={() => {
                      setAddNew(true);
                    }}
                    className="add-new-plus mr-2 cursor-pointer"
                  >
                    Add New +
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Work on this */}
        <div className="">
          <div className="d-block d-md-none">
            <div className="mobile-py">
              <div className="d-flex position-relative">
                <div className="col-10 col-sm-12 col-md-12 col-xl-12 pl-0">
                  <div className="personal-mgt-title">Team Members</div>
                </div>
                <div className="col-2 col-sm-12 col-md-12 col-xl-12 d-block d-md-none">
                  <img
                    className="close-icon-personal"
                    src={closeBlack}
                    onClick={() => {
                      handleClose(true);
                    }}
                    alt="close Black"
                  />
                </div>
              </div>
            </div>
            <div className="scroll-personal-grid position-relative">
              <div className="d-flex position-relative">
                <div className="col-4 col-sm-2 col-md-2 col-xl-2 pl-0">
                  {userDetails && userDetails.UserType !== 6 ? (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => onAddNewMemberMobile(true)}
                      className="add-new-plus"
                    >
                      Add New +
                    </div>
                  ) : (
                    <div
                      className="add-new-plus"
                      style={{ height: "20px", cursor: "auto" }}
                    ></div>
                  )}
                </div>
                <div className="col-8 col-sm-12 col-md-12 col-xl-12 pl-0">
                  {!isSearchOpenMobile && (
                    <div className="">
                      <img
                        onClick={() => setShowMobileFilter(true)}
                        className="dropDownIcon"
                        src={dropDownIcon}
                        alt="close Black"
                      />
                      {showMobileFilter && !isSearchOpenMobile && (
                        <div ref={mobileFilterRef}>
                          {" "}
                          <div className="dropDown-tooltip">
                            <div
                              onClick={() => _filterBy("0", "mobileFilter")}
                              className="change-role"
                            >
                              None
                            </div>
                            <div
                              onClick={() => _filterBy("4", "mobileFilter")}
                              className="change-role"
                            >
                              Team Member
                            </div>
                            <div
                              onClick={() => _filterBy("5", "mobileFilter")}
                              className="change-role"
                            >
                              Approver
                            </div>
                            <div
                              onClick={() => _filterBy("3", "mobileFilter")}
                              className="change-role"
                            >
                              CO
                            </div>
                            <div
                              onClick={() => _filterBy("az", "mobileFilter")}
                              className="change-role"
                            >{`A > Z`}</div>
                            <div
                              onClick={() => _filterBy("za", "mobileFilter")}
                              className="change-role"
                            >
                              {`Z < A`}{" "}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div id="searchBox" className="right-search-bar searchBox">
                    <div className="input-group form-group">
                      <img
                        onClick={() => serachOpenMobile()}
                        className="IconGray"
                        src={searchIcon}
                        alt="team Search Icon"
                      />

                      {isSearchOpenMobile && (
                        <div className="searchBox">
                          <div className="input-group form-group">
                            {searchText.length > 0 ? (
                              <input
                                className="form-control setPlaceHolder placeHold textwithoutFocus"
                                type="text"
                                placeholder="Search by Full name, email-Id and Mobile No"
                                value={searchText}
                                onChange={(e) => handleSearchInputChange(e)}
                              />
                            ) : (
                              <input
                                className="form-control setPlaceHolder placeHold"
                                type="text"
                                placeholder="Search by Full name, email-Id and Mobile No"
                                value={searchText}
                                onChange={(e) => handleSearchInputChange(e)}
                              />
                            )}
                            <span className="input-group-append">
                              <button
                                className="btn border-start-0 border-top-0 border-bottom-0 border-0 ms-n5"
                                type="button"
                              >
                                <img
                                  style={{ cursor: "pointer" }}
                                  onClick={() => onClickSearchMobileIcon()}
                                  src={closeIconGray}
                                  alt="team Search Icon"
                                />
                              </button>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 pl-0 pr-0">
                <div className="line-after-heaing"></div>
              </div>
              {fields &&
                fields.length > 0 &&
                teamMembersSearch(fields, searchQuery).map((item, index) => {
                  return (
                    <div className="team-member-list">
                      <div className="d-flex">
                        <div className="left-side-circleName">
                          <div className="col-12 pl-0">
                            <div className="holding-list-bold-title-background d-flex align-items-center truncate">
                              <span className="circle-dp">
                                {getInitials(item.full_name)}
                              </span>{" "}
                              {item.full_name}{" "}
                            </div>
                          </div>
                        </div>
                        <div className="left-side-circleName">
                          <div className="col-10 pl-0">
                            <div className="roleEmailText">
                              {item.designation}
                            </div>
                          </div>
                          <div className="col-2 pl-0">
                            {item.showAcceptDelectIcon === false &&
                              teamMemberData &&
                              teamMemberData.length > 0 && (
                                <img
                                  className="three-dot"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setReAssignUserType(
                                      fieldArray.filter(
                                        (users) => users.id === item.id
                                      )[0].UserType
                                    );
                                    setReAssignUserId(item.id);
                                    if (openPopupIndex !== "") {
                                      setOpenPopupIndex("");
                                    } else {
                                      openPopup(index);
                                    }
                                  }}
                                  src={threeDots}
                                  alt="three Dots Icon"
                                />
                              )}

                            {openPopupIndex !== "" &&
                              openPopupIndex === index && (
                                <div
                                  ref={innerRef}
                                  className="three-dot-tooltip"
                                  style={{
                                    height: `${
                                      userDetails && userDetails.UserType === 6
                                        ? "44px"
                                        : "177px"
                                    }`,
                                  }}
                                >
                                  <div
                                    className="change-role"
                                    onClick={() => {
                                      MoreDetails(item);
                                      setOpenPopupIndex("");
                                    }}
                                  >
                                    More Details
                                  </div>
                                  {userDetails &&
                                    userDetails.UserType !== 6 && (
                                      <>
                                        <div
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            onChangeRoleClick(
                                              "mobile",
                                              item,
                                              index
                                            );
                                            // changeRoleMobile(item, index);
                                            // setOpenPopupIndex("");
                                          }}
                                          className="change-role"
                                        >
                                          Change Role
                                        </div>
                                        <div
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            setIsShowReAssignModalMobile(true);
                                            setOpenPopupIndex("");
                                          }}
                                          className="change-role"
                                        >
                                          Re-Assign
                                        </div>
                                        {emailAddress !== item.email && (
                                          <div
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                              setVisible(true);
                                              setDeleteMemberIndex(index);
                                              setOpenPopupIndex("");
                                            }}
                                            className="delete-member"
                                          >
                                            Delete Member
                                          </div>
                                        )}
                                      </>
                                    )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="bottom-line"></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div id="moreDetailsParent" className="">
          <div id="moreDetailsChild" className="bottomBarFixedMoreDetails">
            <div className="change-role-mobile">
              {" "}
              <img
                style={{ cursor: "pointer" }}
                onClick={() => closeMoreDetails()}
                className=""
                src={changeRoleClose}
                alt="close Black"
              />{" "}
              More Details
            </div>
            {currentRow && Object.keys(currentRow).length > 0 && (
              <div>
                <div className="d-flex row">
                  <div className="col-2">
                    <span className="role-text">Email:</span>
                  </div>
                  <div className="col-10 pl-0">
                    <span className="user-email-right-mobile">
                      {currentRow && currentRow.email && currentRow.email}
                    </span>
                  </div>
                </div>
                <div className="d-flex row">
                  <div className="col-2">
                    <span className="role-text">Mobile:</span>
                  </div>
                  <div className="col-10 pl-0">
                    <span className="user-email-right-mobile">
                      {currentRow &&
                        currentRow.mobileNuber &&
                        currentRow.mobileNuber}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div id="drawerParent" className="">
          <div id="drawerChild" className="bottomBarFixedChangeRole">
            <div className="change-role-mobile">
              {" "}
              <img
                style={{ cursor: "pointer" }}
                onClick={() => closeChangeRole()}
                className=""
                src={changeRoleClose}
                alt="close Black"
              />{" "}
              Change Role
            </div>
            <div className="d-flex row">
              <div className="col-2">
                <span className="role-text">Role</span>
              </div>
              <div className="col-10 pl-0">
                <Searchable
                  className=""
                  placeholder="Select Role"
                  notFoundText="No result found"
                  listMaxHeight={200}
                  options={userRoles}
                  onSelect={(value) => handleChangeRoleMobile(value)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <div className="border-header"></div> */}
        <div id="drawerParentAddNew" className="">
          <div id="drawerChildAddNew" className="sideBarFixedAccount">
            <div className="change-role-mobile">
              <img
                style={{ cursor: "pointer" }}
                onClick={() => closeMemberMobilePOP()}
                className=""
                src={changeRoleClose}
                alt="close Black"
              />{" "}
              Add New{" "}
            </div>
            {/* <span onClick={() => closeMemberMobilePOP()}>close</span> */}
            <div className="col-12 pl-0 pr-0">
              <div className="form-group">
                <label className="label-mobile">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={inputTeamMember.full_name}
                  onChange={onChangeHandler("full_name")}
                  className="form-control countryCode-sucess"
                  placeholder="Full Name"
                />
                {isValidate &&
                  (inputTeamMember.full_name === "" ||
                    inputTeamMember.full_name === " ") && (
                    <p className="input-error-message">
                      Member name is required
                    </p>
                  )}
              </div>
              <div className="form-group">
                <label className="label-mobile">Email-Id</label>
                <input
                  type="text"
                  name="email"
                  value={inputTeamMember.email}
                  onChange={onChangeHandler("email")}
                  onBlur={(e) => onValidateEmail(e)}
                  className="form-control countryCode-sucess full-btn-tabel"
                  placeholder="Enter email"
                />
                {inputTeamMember.email !== "" &&
                  !isEmail(inputTeamMember.email) && (
                    <p className="input-error-message">Email is Invalid</p>
                  )}

                {inputTeamMember.email !== "" && alreadyExist === true ? (
                  <p className="input-error-message absPosition">
                    Email already assigned to another role
                  </p>
                ) : (
                  inputTeamMember.email !== "" &&
                  !isValidEmail && (
                    <p className="input-error-message absPosition">
                      Email is already exists
                    </p>
                  )
                )}
              </div>
              <div className="form-group">
                <label className="label-mobile">Role</label>

                <Searchable
                  className=""
                  placeholder="Select Role"
                  notFoundText="No result found"
                  listMaxHeight={200}
                  multiple={true}
                  options={userRoles}
                  onSelect={(value) => handleChangeRoleMobile(value)}
                />
              </div>
            </div>
            <div className="row aligncenter last-two-btn">
              <div className="col-12 col-sm-12 col-md-12 col-xl-12 flex pl-0">
                <button
                  disabled={
                    checkButtonDisabled() !== true ||
                    alreadyExist === true ||
                    isValidEmail === false
                      ? true
                      : false
                  }
                  onClick={() => onsubmit("mobile")}
                  className={
                    checkButtonDisabled() !== true ||
                    alreadyExist === true ||
                    isValidEmail === false
                      ? "btn save-details common-button-disabled btn-width  "
                      : "btn save-details btn invite-blue-btn btn-width"
                  }
                >
                  Invite
                </button>
                <div
                  onClick={() => {
                    closeMemberMobilePOP();
                    setInputTeamMember({
                      full_name: "",
                      email: "",
                      role: [],
                    });
                  }}
                  className="discard-label-link"
                >
                  Cancel
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ height: listScrollHeight, borderRadius: "10px" }}
          ref={scrollableListRef}
          className="scroll-personal-grid d-none d-md-block position-relative"
        >
          <table className="table co-company-details-tbl table_legenda">
            <thead>
              <tr className="teamMember__table__header">
                <th className="tw-30" clscope="col">
                  Full Name
                </th>
                <th className="tw-30" clscope="col">
                  Group
                </th>
                <th className="tw-20" scope="col">
                  {" "}
                  Role{" "}
                </th>
                <th className="tw-30" scope="col">
                  Email-ID
                </th>
                <th className="tw-15" scope="col">
                  Mobile No.
                </th>
                <th className="tw-8" scope="col">
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody>
              {addNew && (
                <tr className="focusRemove" style={{ height: "93px" }}>
                  <td>
                    <div className="form-group mb-0">
                      <input
                        type="text"
                        autoFocus
                        name="full_name"
                        value={inputTeamMember.full_name}
                        onChange={onChangeHandler("full_name")}
                        className="form-control countryCode-sucess full-btn-tabel"
                        placeholder="Full name"
                      />
                      {inputTeamMember.full_name === " " && (
                        <p className="input-error-message absPosition">
                          Member name is required
                        </p>
                      )}
                    </div>
                  </td>
                  {/* <td>
                  <DepartmentDialog
                    addSelectedDepartment={addSelectedDepartment}
                    selectedDepartment={selectedDepartment}
                    setSelectedDepartment={setSelectedDepartment}
                  />
                </td> */}
                  <td>
                    <div className="form-group mb-0">
                      <MultiSelectInput
                        customStyles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "#f6f9fb",
                            border: "none",
                            borderRadius: "4px",
                          }),
                        }}
                        isValidNewOption={(inputString) =>
                          inputString &&
                          removeWhiteSpaces(inputString) !== " " &&
                          inputString.length >= 2 &&
                          inputString.length <= 25
                        }
                        isLableVisible={false}
                        value={[
                          ...(inputTeamMember?.updatedGroup ||
                            inputTeamMember?.group ||
                            []),
                        ].map((item) => ({
                          label: item,
                          value: item,
                        }))}
                        options={departmentList}
                        onChange={(value) =>
                          handleDepartmentInputChange(value, 0, true)
                        }
                        isCreateable={true}
                      />
                    </div>
                  </td>
                  <td>
                    <Searchable
                      className="teamMember__searchable__dropDown"
                      placeholder="Select Role"
                      notFoundText="No result found"
                      listMaxHeight={200}
                      multiple={true}
                      options={userRoles}
                      onSelect={(value) => handleChangeInputBoxRole(value)}
                    />
                  </td>

                  <td>
                    <div className="form-group mb-0">
                      <input
                        type="text"
                        name="email"
                        value={inputTeamMember.email}
                        onChange={onChangeHandler("email")}
                        onBlur={(e) => onValidateEmail(e)}
                        className="form-control countryCode-sucess full-btn-tabel"
                        placeholder="Enter email"
                      />
                      {inputTeamMember.email !== "" &&
                        !isEmail(inputTeamMember.email) && (
                          <p className="input-error-message absPosition">
                            Email is Invalid
                          </p>
                        )}

                      {inputTeamMember.email !== "" && alreadyExist === true ? (
                        <p className="input-error-message absPosition">
                          Email already assigned to another role
                        </p>
                      ) : (
                        inputTeamMember.email !== "" &&
                        !isValidEmail && (
                          <p className="input-error-message absPosition">
                            Email is already exists
                          </p>
                        )
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      disabled={
                        checkButtonDisabled() !== true ||
                        alreadyExist === true ||
                        isValidEmail === false
                          ? true
                          : false
                      }
                      onClick={() => onsubmit()}
                      className={
                        checkButtonDisabled() !== true ||
                        alreadyExist === true ||
                        isValidEmail === false
                          ? "btn save-details common-button-disabled btn-width"
                          : " btn save-details common-button btn-width "
                      }
                    >
                      Invite
                    </button>
                  </td>
                  <td>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setAddNew(false);
                        setInputTeamMember({
                          full_name: "",
                          email: "",
                          role: [],
                        });
                      }}
                      className="cancelLink"
                    >
                      Cancel
                    </div>
                  </td>
                </tr>
              )}
              {fields?.length > 0 &&
                teamMembersSearch(fields, searchQuery).map((item, index) => {
                  return (
                    <tr className="focusRemove">
                      {item && item.full_name !== "" && (
                        <td>
                          <div className="holding-list-bold-title-background d-flex align-items-center">
                            <span className="circle-dp">
                              {item.initialsName}
                            </span>
                            <div className="nameCirle"> {item.full_name} </div>
                          </div>
                        </td>
                      )}
                      {item.email && (
                        <td>
                          {(item?.group && item?.group?.length > 0) ||
                          item.isEdit ? (
                            !item.isEdit ? (
                              <p className="roleEmailText">
                                {[...item.group].join(", ")}
                              </p>
                            ) : (
                              <>
                                <MultiSelectInput
                                  customStyles={{
                                    control: (provided, state) => ({
                                      ...provided,
                                      backgroundColor: "#f6f9fb",
                                      border: "none",
                                      borderRadius: "4px",
                                    }),
                                  }}
                                  isValidNewOption={(inputString) =>
                                    inputString &&
                                    removeWhiteSpaces(inputString) !== " " &&
                                    inputString.length >= 2 &&
                                    inputString.length <= 25
                                  }
                                  value={[
                                    ...(item?.updatedGroup ||
                                      item?.group ||
                                      []),
                                  ]
                                    ?.filter((item) => item)
                                    ?.map((item) => ({
                                      label: item,
                                      value: item,
                                    }))}
                                  options={departmentList}
                                  onChange={(value) =>
                                    handleDepartmentInputChange(value, index)
                                  }
                                  isCreateable={true}
                                />
                              </>
                            )
                          ) : (
                            <Button
                              sx={{
                                color: "#6c5dd3",
                                textTransform: "capitalize",
                                fontSize: "12px",
                                display: "contents",
                              }}
                              disableTouchRipple={true}
                              onClick={() => editItem(index)}
                            >
                              <MdAdd />
                              &nbsp; Add Group
                            </Button>
                          )}
                        </td>
                      )}

                      {/* {item?.group && item?.group?.length > 0 ? (
                      <>
                        {!item.isEdit ? (
                          <td>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <div>{item?.group.toString()}</div>
                              <MdModeEdit
                                style={{ cursor: "pointer", marginLeft: 10 }}
                                className="check-Icon-circle"
                                alt="edit button"
                                onClick={() => {
                                  editItem(index);
                                }}
                              />
                            </div>
                          </td>
                        ) : (
                          <td>
                            <DepartmentDialog
                              addSelectedDepartment={addSelectedDepartment}
                              selectedDepartment={selectedDepartment}
                              setSelectedDepartment={setSelectedDepartment}
                              isEdit={true}
                              addNewDepartment={() => {
                                addNewDepartment(item.email, index);
                                setEdit(false);
                              }}
                            />
                          </td>
                        )}
                      </>
                    ) : (
                      <td>
                        <DepartmentDialog
                          addSelectedDepartment={addSelectedDepartment}
                          selectedDepartment={selectedDepartment}
                          setSelectedDepartment={setSelectedDepartment}
                          isEdit={true}
                          addNewDepartment={() =>
                            addNewDepartment(item.email, index)
                          }
                        />
                      </td>
                    )} */}

                      {item.showAcceptDelectIcon === false && (
                        <td>
                          <div className="roleEmailText">{item.role}</div>
                        </td>
                      )}
                      {item.showAcceptDelectIcon === true && (
                        <td>
                          <Dropdown
                            onChange={(value) =>
                              onChangeRoleDropDown(value, index)
                            }
                            arrowClosed={<span className="arrow-closed" />}
                            arrowOpen={<span className="arrow-open" />}
                            options={userRoles}
                            value={fields && fields[index].roleDropDown.value}
                            defaultValue={defaultOption}
                            placeholder="Select an option"
                          />
                        </td>
                      )}

                      <td className="dropList">
                        <div className="roleEmailText">{item.email}</div>
                      </td>
                      <td>
                        <div className="contact-team"> {item.mobileNumber}</div>
                      </td>
                      {(item.isEdit
                        ? !item?.isEdit
                        : item.showAcceptDelectIcon
                        ? !item.showAcceptDelectIcon
                        : true) &&
                        teamMemberData &&
                        teamMemberData.length > 0 &&
                        userDetails &&
                        userDetails.UserType !== 6 && (
                          <td className="pl-0">
                            {/* <div
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setReAssignUserType(
                                fieldArray.filter(
                                  (users) => users.id === item.id
                                )[0].UserType
                              );
                              setReAssignUserId(item.id);
                              if (openPopupIndex !== "") {
                                setOpenPopupIndex("");
                              } else {
                                openPopup(index);
                              }
                            }}
                            className="aaaa float-right"
                          >
                            <img
                              className="three-dot"
                              src={threeDots}
                              alt="three Dots Icon"
                            />
                          </div> */}
                            <IconButton
                              onClick={(e) => {
                                const contextClientRects =
                                  e.currentTarget.getClientRects()[0];

                                const bottomPosition =
                                  document.body.clientHeight -
                                  contextClientRects.bottom;
                                if (
                                  bottomPosition < 210 &&
                                  bottomPosition > 0
                                ) {
                                  scrollableListRef.current.scrollTo({
                                    top:
                                      scrollableListRef.current?.scrollTop +
                                      (bottomPosition > 180 ? 40 : 160) +
                                      bottomPosition,
                                    behavior: "smooth",
                                  });
                                }
                                setReAssignUserType(
                                  fieldArray.filter(
                                    (users) => users.id === item.id
                                  )[0].UserType
                                );
                                setReAssignUserId(item.id);
                                if (openPopupIndex !== "") {
                                  setOpenPopupIndex("");
                                } else {
                                  openPopup(index);
                                }
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                            {/* {openPopupIndex !== "" && openPopupIndex === index && ( */}
                            <div
                              className={`last-td ${
                                openPopupIndex !== "" &&
                                openPopupIndex === index
                                  ? "last-td__open"
                                  : ""
                              }`}
                              ref={innerRef}
                            >
                              <div className="three-dot-tooltip">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    onChangeRoleClick("desktop", item, index);
                                  }}
                                  className="change-role"
                                >
                                  Change Role
                                </div>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => editItem(index)}
                                  className="change-role"
                                >
                                  Edit Group
                                </div>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    getMembers(item.role, item.email);
                                  }}
                                  className="change-role"
                                >
                                  Re-Assign Tasks
                                </div>
                                {emailAddress !== item.email && (
                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setCurrentUserDetail({
                                        role: item.role,
                                        email: item.email,
                                      });
                                      setVisible(true);
                                      setDeleteMemberIndex(index);
                                      setOpenPopupIndex("");
                                    }}
                                    className="delete-member"
                                  >
                                    Delete Member
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* )} */}
                          </td>
                        )}
                      {(item.showAcceptDelectIcon === true || item?.isEdit) && (
                        <td className="d-flex border-0">
                          <img
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (item.showAcceptDelectIcon) {
                                // selectCompanyModal

                                const { email, roleDropDown } = item;
                                if (email && roleDropDown?.value) {
                                  if (
                                    roleDropDown?.value === "Compliance Officer"
                                  ) {
                                    setShowCompanyData({
                                      ...showCompanyData,
                                      isShowModal: true,
                                      index,
                                      item,
                                    });
                                  } else {
                                    onConfirmChangeRole(item, index);
                                  }
                                } else {
                                  toast.error("Please select a role");
                                }
                              } else if (item?.isEdit) {
                                setUserDepartment(index);
                              }
                            }}
                            className="check-Icon-circle"
                            src={greenCheck}
                            alt="check Icon"
                          />
                          <img
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (item.showAcceptDelectIcon) {
                                cancelCheckIcon(index);
                              } else if (item?.isEdit) {
                                editItem(index);
                              }
                            }}
                            className="delete-Icon-check"
                            src={redCheck}
                            alt="delete Icon"
                          />
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {fields?.length === 0 && <NoResultFound text="No Members Found" />}
        </div>
      </div>
    </>
  );
}

export default CoManagment;
