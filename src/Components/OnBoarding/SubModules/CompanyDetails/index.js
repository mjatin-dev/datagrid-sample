/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import countryList from "react-select-country-list";
import "./style.css";
import { withRouter } from "react-router-dom";
import RightImageBg from "../../../../assets/Images/Onboarding/RectangleOnboadign.png";
import comtech from "../../../../assets/Images/CapmTech.png";
import secmark from "../../../../assets/Images/secmark.png";
import plusIcon from "../../../../assets/Icons/plusIcon2.png";
import plusIcon2 from "../../../../assets/Icons/plusIcon3.png";
import grayPlusIcon from "../../../../assets/Icons/grayPlusIcon.png";
import deleteIcon from "../../../../assets/Icons/deleteIcon.png";
import deleteBlack from "../../../../assets/Icons/deleteBlack.png";
import whiteDeleteIcon from "../../../../assets/Icons/whiteDeleteIcon.png";
import { Modal } from "react-responsive-modal";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { actions as companyActions } from "../../redux/actions";
import SideBarInputControl from "../SideBarInputControl";
import api from "../../../../apiServices";
import MobileStepper from "../mobileStepper";
import Licenses from "../../../../CommonModules/sharedComponents/Licenses";
import axiosInstance from "../../../../apiServices";
import Select from "react-select";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import { toast } from "react-toastify";
import Dots from "CommonModules/sharedComponents/Loader/Dots";

function CompanyDetails({ history }) {
  const state = useSelector((state) => state);
  const personalInfo = state?.complianceOfficer?.personalInfo;
  const certificateInfo = state?.complianceOfficer?.cerificateInfo;
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const isLoading = state?.complianceOfficer?.certificateloader;
  const [showEdit, setshowEdit] = useState(true);
  const [fields, setFields] = useState(
    (certificateInfo &&
      certificateInfo?.length > 0 && [...certificateInfo]) || [
      {
        company_name: personalInfo?.company_name,
        company_country: "",
        company_pincode: "",
        company_type: "",
        countShow: false,
        gstin: "",
        licenses: [],
      },
    ]
  );

  // custom style for dropdown
  const customStyle = {
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      minWidth: "180px",
      boxShadow: "none",
      border: "2px solid transparent",
      backgroundColor: "rgba(228, 228, 228, 0.3)",
      borderRadius: "0.25rem",
      height: "40px",
      "&:hover, &:focus": {
        border: "2px solid #7a73ff",
      },
      ...(state.isFocused && { border: "2px solid #7a73ff" }),
    }),
  };

  const [errors, setErrors] = useState([
    {
      companyNameError: "",
      pinCodeError: "",
      companyTypeError: "",
      categoryErr: "",
      countShow: false,
      liecenseCount: null,
      currentIndex: null,
      liecenseData: [],
    },
  ]);
  const [visible, setVisible] = useState(false);
  const [companyTypeoInfo, setCompanyTypeoInfo] = useState([]);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);
  const [isEditIndex, setIsEditIndex] = useState(undefined);
  const options = useMemo(
    () =>
      countryList()
        .getData()
        .filter(
          (item) =>
            item.value !== "AX" &&
            item.value !== "CI" &&
            item.value !== "CD" &&
            item.value !== "LA" &&
            item.value !== "KR" &&
            item.value !== "KW" &&
            item.value !== "KP" &&
            item.value !== "CW"
        ),
    []
  );

  const [listOflist, setListoflist] = useState([]);
  const [chooseLicense, setChooseLicense] = useState(false);

  const companyType =
    state &&
    state?.complianceOfficer &&
    state.complianceOfficer?.companyInfo?.companyLicenseData;

  const Categories =
    state &&
    state?.complianceOfficer &&
    state.complianceOfficer?.companyInfo?.companyLicenseData &&
    state.complianceOfficer?.companyInfo?.companyLicenseData[2] &&
    state.complianceOfficer?.companyInfo?.companyLicenseData[2][0] &&
    state.complianceOfficer?.companyInfo?.companyLicenseData[2][0].Categories;

  const companyName =
    state &&
    state?.complianceOfficer &&
    state.complianceOfficer?.personalInfo &&
    state.complianceOfficer?.personalInfo.companyName;

  const _entityID =
    state &&
    state?.complianceOfficer &&
    state.complianceOfficer?.cerificateInfo &&
    state.complianceOfficer?.cerificateInfo.table &&
    state.complianceOfficer?.cerificateInfo.table &&
    state.complianceOfficer?.cerificateInfo.table[0] &&
    state.complianceOfficer?.cerificateInfo.table[0].entityID;

  const entityID =
    state && state.complianceOfficer && state.complianceOfficer?.entityInfo;
  useEffect(() => {
    getLicenseList();
    dispatch(
      companyActions.companyTypeRequest({
        country: "INDIA",
        category: "",
        eid: "",
      })
    );
    let list = [...fields];
    list[0].companyName = companyName;
  }, []);

  const getLicenseList = async (country) => {
    const list = await axiosInstance.post(
      `/compliance.api.getCountryWiseLicenseList`,
      {
        country: country,
      }
    );

    if (list?.data?.message?.status) {
      setListoflist(list?.data.message.industry_license_list);
    } else {
      setListoflist([]);
    }
  };

  const updateEnityName = (entityName, index) => {
    const payload = {
      company_name: entityName,
    };
    api
      .post("compliance.api.avabilityCheck", payload)
      .then(function (response) {
        // handle success
        if (
          response &&
          response.data &&
          response.data.message.status === true
        ) {
          let list = [...errors];
          list[index].companyNameError = "Company name already exists";
          setErrors(list);
        } else {
          let list = [...errors];
          list[index].companyNameError = "";
          setErrors(list);
        }
      })
      .catch(function (error) {
        if (error) {
        }
      });
  };

  useEffect(() => {
    if (checkCountShowTrue()) {
      const list = [...fields];
      let currentEntityID =
        entityID &&
        entityID[currentSelectedIndex] &&
        entityID[currentSelectedIndex].entityID;
      if (currentEntityID !== undefined && currentEntityID !== "") {
        if (
          list &&
          list[currentSelectedIndex] &&
          list[currentSelectedIndex].category !== ""
        ) {
          list[currentSelectedIndex].entityID = currentEntityID;
          setFields(list);
        }
      }
    }
  }, [_entityID, currentSelectedIndex]);

  useEffect(() => {
    var array = [];
    companyType &&
      companyType?.company_list?.map((item) => {
        array.push({ value: item, label: item });
      });
    setCompanyTypeoInfo(array);

    var array2 = [];
    var mobArray2 = [];

    companyType &&
      companyType?.Industry_list?.map((item) => {
        array2.push({ value: item, label: item });
        if (item.Category !== "" || item.Category) {
          mobArray2.push({ value: item.Category, label: item.Category });
        }
      });
  }, [Categories, companyType]);

  const checkCountShowTrue = () => {
    return fields.some(function (e) {
      return e.countShow === true;
    });
  };

  const pinCodeValidation = async (pincode, index, countryName) => {
    if (
      pincode !== "" &&
      pincode?.length === 6 &&
      countryName !== "" &&
      countryName === "India"
    ) {
      try {
        setIsLoader(true);
        let errorsList = [...errors];
        const { status, data } = await api.post("compliance.api.checkPincode", {
          pincode,
        });
        if (status === 200 && data?.message?.status) {
          errorsList[index].pinCodeError = "";
          setIsLoader(false);
        } else if (status === 200 && !data?.message?.status) {
          errorsList[index].pinCodeError = "Invalid pincode";
          setIsLoader(false);
        }
        setErrors([...errorsList]);
      } catch (error) {
        setIsLoader(false);
      }
    }
  };

  const validateCompanyName = (e, index) => {
    let payload = {
      company_name: e.target.value.trim(),
    };
    if (e.target.value !== "") {
      const companyNameErr = () => {
        let list = [...errors];
        list[index].companyNameError = "";
        setErrors(list);
        if (checkCountShowTrue()) {
          const info = [...fields];
          info &&
            info.length > 0 &&
            info.map((data, key) => {
              if (key === index && data.countShow === true) {
                updateEnityName(
                  fields && fields[currentSelectedIndex].company_name,
                  key
                );
              }
            });
        }
      };

      if (companyName !== payload.company_name) {
        api
          .post("compliance.api.avabilityCheck", {
            company_name: e.target.value,
          })
          .then(function (response) {
            // handle success
            if (response?.data?.message?.status) {
              let list = [...errors];
              list[index].companyNameError = "Company name already exists";
              setErrors(list);
            } else {
              companyNameErr();
            }
          })
          .catch(function (error) {
            if (error) {
            }
          });
      } else {
        companyNameErr();
      }
    }
  };

  const onDeletePress = (index) => {
    let list = [...fields];
    let errorsList = [...errors];
    errorsList.splice(index, 1);
    list.splice(index, 1);
    setFields(list);
    setErrors(errorsList);
    setVisible(false);
  };

  const renderDialogBox = (index) => {
    let currentCompanyName =
      fields && fields[currentSelectedIndex]?.company_name;
    return (
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
        styles={{ width: 373, height: 210, overflow: "hidden" }}
        onOverlayClick={() => setVisible(false)}
      >
        <div className="model-design-delete-company">
          <div className="delete-record-title">Delete company record?</div>
          <div className="delete-desc">
            Are you sure you want to delete the record of &nbsp;
            {currentCompanyName}&nbsp;? All selections will be reset.
          </div>
          <div className="last-two-model-btn">
            <button
              onClick={() => setVisible(false)}
              className="btn cancel-delete"
            >
              CANCEL
            </button>
            <button
              onClick={() => onDeletePress(index)}
              className="btn delete-Record"
            >
              DELETE
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const checkButtonDisabled = () => {
    const list = [...fields];
    let isNext = true;
    const errorsObj = [...errors];
    list &&
      list.map((item, index) => {
        errorsObj &&
          errorsObj.map((error, key) => {
            if (
              item.company_name === "" ||
              item.company_type === "" ||
              error.companyNameError !== "" ||
              error.pinCodeError !== ""
            ) {
              isNext = false;
              return isNext;
            }
          });
      });
    return isNext;
  };

  const checkButtonDisabledColor = (key) => {
    const list = [...fields];
    let isNext = true;
    list &&
      list.map((item, index) => {
        if (index === key) {
          if (
            item.company_name === "" ||
            item.company_type === "" ||
            item.company_country === "" ||
            item.company_pincode === "" ||
            (errors &&
              errors[index] &&
              errors[index].companyNameError !== "") ||
            (errors && errors[index] && errors[index].pinCodeError !== "")
          ) {
            isNext = false;
            return isNext;
          }
        }
      });
    return isNext;
  };

  const onAddLiceseClick = (index) => {
    setCurrentSelectedIndex(index);
    setChooseLicense(!chooseLicense);
  };

  const addLicense = (index, licenseList) => {
    var temp = [...fields];
    temp[index].licenses = licenseList;
    temp[index].countShow = licenseList.length > 0 ? true : false;
    setFields(temp);
    setChooseLicense(false);
  };

  const handleCompanyTypeChange = (value, index, type) => {
    var temp = fields;

    if (type === "companyType") {
      temp[index].company_type = value;
    }
    if (type === "country") {
      getLicenseList(value);

      temp[index].company_country = value;
      if (value !== "India") {
        let errorsList = [...errors];
        temp[index].company_pincode = "";
        errorsList[index].pinCodeError = "";
        setErrors(errorsList);
      }
    }

    if (type === "categoryType") {
      temp[index].business_category = value;
    }
    console.log(temp);
    setFields(temp);
    handelChange("", index, "", "");
  };

  // to Add Another Company
  const AddAnotherCompany = () => {
    const values = [...fields];
    const lastItem = values[values.length - 1];
    if (
      lastItem.company_name &&
      lastItem.company_country &&
      lastItem.company_pincode &&
      lastItem.company_type &&
      lastItem?.licenses?.length > 0
    ) {
      values.push({
        company_name: "",
        company_country: "",
        company_pincode: "",
        company_type: "",
        business_category: "",
        countShow: false,
        gstin: "",
        licenses: [],
      });
      setFields(values);
      const errorInfo = [...errors];
      errorInfo.push({
        companyNameError: "",
        pinCodeError: "",
        companyTypeError: "",
        categoryErr: "",
        countShow: false,
        liecenseCount: null,
        currentIndex: null,
        liecenseData: [],
      });
      setErrors(errorInfo);
    } else {
      toast.error("Please fill all the fields");
    }
  };

  const showHideDropDown = (type, indexDrop, data) => {};

  const addNewCompany = (item, index) => {
    item.license = [];
    return (
      <tr className="focusRemove" key={index}>
        {/* <td className="" style={{ height: "85px" }}> */}
        <td className="">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            // defaultValue={index === 0 ? companyName : item.companyName}
            value={item.company_name}
            autoComplete="off"
            name="company_name"
            maxLength={140}
            onFocus={() => {
              showHideDropDown("companyName", index);
            }}
            onBlur={(e) => validateCompanyName(e, index)}
            onChange={(e) => {
              handelChange(e, index, "", "");
            }}
            style={{ minWidth: "180px" }}
          />
          {errors && errors[index] && errors[index].companyNameError !== "" && (
            <p className="input-error-message" style={{ position: "absolute" }}>
              {errors[index].companyNameError}
            </p>
          )}
        </td>

        <td className="slectCatgory">
          {/* <Searchable
            value={item.company_type}
            className="form-control border-0"
            // placeholder={item.companyType ? item.companyType : "Select Type"} // by default "Search"
            notFoundText="No result found" // by default "No result found"
            options={companyTypeoInfo}
            onSelect={(value) => {
              handleCompanyTypeChange(value, index, "companyType");
            }}
            listMaxHeight={200} //by default 140
          /> */}
          <Select
            styles={customStyle}
            options={companyTypeoInfo}
            value={[
              {
                label: item?.company_type || "select",
                value: item?.company_type || "select",
              },
            ]}
            onChange={(value) => {
              handleCompanyTypeChange(value.label, index, "companyType");
            }}
          />
        </td>

        <td>
          {/* <Searchable
            options={options}
            value={value}
            onSelect={(value) => {
              handleCompanyTypeChange(
                options.find((item) => item.value === value).label,
                index,
                "country"
              );
            }}
          /> */}
          <Select
            styles={customStyle}
            options={options}
            value={[
              {
                label: item?.company_country || "select",
                value:
                  options?.find((item) => item?.label === item?.company_country)
                    ?.value || "select",
              },
            ]}
            onChange={(value) => {
              handleCompanyTypeChange(value.label, index, "country");

              if (item.company_pincode.length === 6) {
                pinCodeValidation(item.company_pincode, index, value.label);
              }
            }}
          />
        </td>
        <td>
          <input
            type="text"
            value={item.company_pincode}
            className="form-control"
            placeholder="Pincode"
            name="company_pincode"
            onChange={(e) => {
              handelChange(e, index, "", "");
            }}
          />
          {errors && errors[index] && errors[index].pinCodeError !== "" && (
            <p className="input-error-message" style={{ position: "absolute" }}>
              {errors[index].pinCodeError}
            </p>
          )}
        </td>
        <td>
          <input
            type="text"
            maxLength={15}
            value={item.gstin}
            className="form-control"
            placeholder="GSTIN"
            name="gstin"
            onChange={(e) => {
              handelChange(e, index, "", "");
            }}
          />
          {errors && errors[index] && errors[index].gstinError !== "" && (
            <p className="input-error-message" style={{ position: "absolute" }}>
              {errors[index].gstinError}
            </p>
          )}
        </td>

        <td>
          {item.countShow === false && (
            <button
              onClick={() => onAddLiceseClick(index)}
              className={
                checkButtonDisabledColor(index)
                  ? " btn add-license "
                  : "btn add-license-disabled"
              }
              disabled={
                fields[index].company_name === "" ||
                fields[index].company_type === "" ||
                errors[index]?.companyNameError !== "" ||
                errors[index]?.pinCodeError !== ""
              }
            >
              add licenses
              <img src={plusIcon} alt="PlusIcon" className="addLicencePlus" />
              <img src={plusIcon2} alt="PlusIcon" className="addLicencePlus2" />
            </button>
          )}
          {item.countShow === true && item.licenses?.length > 0 && (
            <div
              onClick={() => onAddLiceseClick(index)}
              className="license-count-selected"
            >
              {item?.licenses?.length}
            </div>
          )}
        </td>
        {/* {item.countShow === true && index !== 0 && ( */}
        {fields.length > 1 && (
          <td>
            <div
              onClick={() => {
                Object.values(item).find((item) => item !== "") === false
                  ? onDeletePress(index)
                  : setVisible(true);
                setCurrentSelectedIndex(index);
              }}
              className="delete-icon"
            >
              <img src={deleteBlack} alt="delete Icon" />
            </div>
          </td>
        )}
      </tr>
    );
  };

  const redirectToOtpVerification = async () => {
    dispatch(
      companyActions.insertCerificateDetailsRequest({
        fields,
        history,
      })
    );
  };

  const companyChecking = (e, i) => {
    let err = [...errors];
    fields.map((item) => {
      if (item.company_name === e) {
        err[i].companyNameError = "Company name already exists";
      } else {
      }
    });
    setErrors(err);
  };
  const handelChange = (e, i, item, dropDownId) => {
    const values = [...fields];
    if (e === "") {
      setFields(values);
    }
    if (e !== "") {
      const { value, name } = e.target;

      const re = /^(?=.*\S).+$/;
      if (
        e.target.value !== "" &&
        !re.test(e.target.value) &&
        name === "company_name"
      ) {
        validateCompanyName(e, i);
        companyChecking(e.target.value, i);
        return "";
      }
      if (name === "company_pincode") {
        if (values[i][name].length >= 5) {
          pinCodeValidation(e.target.value, i, values[i]["company_country"]);
        }
      }

      values[i][name] = value;
    }
    setFields(values);
  };

  const addEditMobileModel = (item, index) => {
    return (
      <div className="d-block d-sm-none">
        {showEdit && (
          <div className="company-details-mobile">
            <div className="input-box-mobile">
              <input
                type="text"
                className="form-control"
                placeholder="Company Name"
                value={item.company_name}
                autoComplete="off"
                name="company_name"
                onBlur={(e) => validateCompanyName(e, index)}
                onChange={(e) => {
                  handelChange(e, index, "", "");
                }}
              />
              {errors &&
                errors[index] &&
                errors[index].companyNameError !== "" && (
                  <p
                    style={{ marginBottom: "unset" }}
                    className="input-error-message"
                  >
                    {errors[index].companyNameError}
                  </p>
                )}
            </div>
            <div className="input-box-mobile">
              <Select
                aria-placeholder="s"
                styles={customStyle}
                options={companyTypeoInfo}
                placeholder="Select Company Type"
                value={
                  item.company_type && [
                    {
                      label: item?.company_type,
                      value: item?.company_type,
                    },
                  ]
                }
                onChange={(value) => {
                  handleCompanyTypeChange(value.label, index, "companyType");
                }}
              />
            </div>
            <div className="input-box-mobile">
              <Select
                styles={customStyle}
                options={options}
                placeholder="Select Company Country"
                value={
                  item?.company_country && [
                    {
                      label: item?.company_country,
                      value: options?.find(
                        (item) => item?.label === item?.company_country
                      )?.value,
                    },
                  ]
                }
                onChange={(value) => {
                  handleCompanyTypeChange(value.label, index, "country");
                  console.log(item?.pincode);
                  if (item?.pincode.length === 6) {
                    pinCodeValidation(item?.pincode, index, value.label);
                  }
                }}
              />
            </div>
            <div className="input-box-mobile">
              <input
                type="text"
                value={item.company_pincode}
                className="form-control"
                placeholder="Pincode"
                name="company_pincode"
                onChange={(e) => {
                  handelChange(e, index, "", "");
                }}
              />
              {errors && errors[index] && errors[index].pinCodeError !== "" && (
                <p
                  className="input-error-message"
                  style={{ position: "absolute" }}
                >
                  {errors[index].pinCodeError}
                </p>
              )}
            </div>
            <div className="input-box-mobile">
              <input
                type="text"
                value={item.gstin}
                className="form-control"
                placeholder="GSTIN"
                name="gstin"
                onChange={(e) => {
                  handelChange(e, index, "", "");
                }}
              />
              {errors && errors[index] && errors[index].gstinError !== "" && (
                <p
                  className="input-error-message"
                  style={{ position: "absolute" }}
                >
                  {errors[index].gstinError}
                </p>
              )}
            </div>

            {/* <div className="input-box-mobile"></div> */}
            <div className="input-box-mobile">
              {item.countShow ? (
                <div className="flex">
                  <div
                    className="liences-mobile"
                    style={{ marginTop: 10, marginRight: 5 }}
                  >
                    Licenses:
                  </div>
                  <div
                    onClick={() => onAddLiceseClick(index)}
                    className="license-count-selected"
                  >
                    {item?.licenses?.length}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onAddLiceseClick(index)}
                  className={
                    checkButtonDisabledColor(index)
                      ? " btn add-license-mobile "
                      : "btn add-license-mobile-disabled"
                  }
                  disabled={
                    fields[index].company_name === "" ||
                    fields[index].company_type === "" ||
                    (errors &&
                      errors[index] &&
                      errors[index].companyNameError !== "") ||
                    (errors &&
                      errors[index] &&
                      errors[index].pinCodeError !== "")
                  }
                >
                  add licenses
                  {fields[index].company_name === "" ||
                  fields[index].company_type === "" ||
                  (errors &&
                    errors[index] &&
                    errors[index].companyNameError !== "") ? (
                    <img src={grayPlusIcon} alt="grayPlusIcon" />
                  ) : (
                    <img
                      src={plusIcon2}
                      alt="PlusIcon"
                      className="addLicencePlus2"
                    />
                  )}
                </button>
              )}
              {item.countShow && isEditIndex !== undefined && (
                // <div class=".co-personal-grid">
                //   <div class="row align-right">
                <div class="d-flex align-items-center justify-content-end mt-3">
                  <button
                    className={"save-button-mobile-view"}
                    onClick={() => setshowEdit(false)}
                    //disabled = {item.Category!== "" && item.EntityName!=="" && item.coUserID !== undefined && item.EntityTypeID != 0 && item.selectedLicenseArray.length != 0   ? false : true}
                  >
                    Save
                  </button>
                  <div
                    class="cancel-button-mobile-view mt-1"
                    onClick={() => setshowEdit(false)}
                  >
                    Cancel
                  </div>
                </div>
              )}
              {index !== 0 && (
                <div style={{ float: "right", padding: 5 }}>
                  <div
                    className="delete-icon"
                    onClick={() => {
                      setVisible(true);
                      setCurrentSelectedIndex(index);
                    }}
                  >
                    <img
                      className="delete-icon"
                      src={deleteIcon}
                      alt="delete Icon"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  const addNewCompanymobile = (item, index) => {
    if (
      item.company_type === "" ||
      item.business_category === "" ||
      // item.liecenseCount === null ||
      item.countShow === false
    ) {
      return <>{addEditMobileModel(item, index)}</>;
    } else {
      return (
        <>
          <div className="d-block d-sm-none">
            <div className="company-details-filled-mobile">
              <div className="d-flex">
                <div className="col-10 pl-0">
                  <div className="bk-seq-title">{item.company_name}</div>
                </div>
                <div className="col-2 pr-0">
                  <div className="license-count-selected-mobile">
                    {item?.licenses?.length}
                  </div>
                </div>
              </div>
              <div className="d-flex">
                <div className="col-10 pl-0">
                  <div className="firm-name-mobile">{item.company_type}</div>
                  <div className="firm-name-mobile">{item.company_country}</div>
                </div>
                <div className="col-2 pr-0">
                  <div className="edit-delete">
                    <div
                      onClick={() => {
                        if (isEditIndex === undefined) setIsEditIndex(index);
                        setshowEdit(true);
                      }}
                      className="mobile-edit"
                      // onClick={() => setshowEdit(true)}
                    >
                      edit
                    </div>
                    {fields.length > 1 && (
                      <div className="col-6 ml-1">
                        <div
                          className="delete-icon"
                          onClick={() => {
                            setVisible(true);
                            setCurrentSelectedIndex(index);
                          }}
                        >
                          <img
                            className="delete-icon"
                            src={whiteDeleteIcon}
                            alt="delete Icon"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isEditIndex === index && addEditMobileModel(item, index)}
        </>
      );
    }
  };

  return (
    <div className="row get-mobile-company-detail">
      <BackDrop isLoading={isLoader} />
      {visible && renderDialogBox(currentSelectedIndex)}
      <div className="col-3 col-sm-4 col-md-4 col-xl-3 left-fixed">
        <div className="on-boarding">
          {/* <SideBar /> */}
          <SideBarInputControl currentStep={2} />
        </div>
      </div>
      <div className="col-12 padding-right">
        <img
          className="bottom-right-bg"
          src={RightImageBg}
          alt="RightImageBg"
        />
        <div className="get-main-company-detail">
          {!isMobile && (
            <div id="drawerParent" className="">
              <div id="drawerChild" className="sideBarFixed">
                {chooseLicense && (
                  <>
                    <Licenses
                      open={chooseLicense}
                      setChooseLicense={setChooseLicense}
                      addLicense={addLicense}
                      selectedIndex={currentSelectedIndex}
                      listOflist={listOflist}
                    />
                  </>
                )}
              </div>
            </div>
          )}
          {isMobile && (
            <div id="drawerParentMobile" className="">
              <div id="drawerChildMobile" className="sideBarFixedAccount">
                {chooseLicense && (
                  <>
                    <Licenses
                      open={chooseLicense}
                      setChooseLicense={setChooseLicense}
                      addLicense={addLicense}
                      selectedIndex={currentSelectedIndex}
                      listOflist={listOflist}
                    />
                  </>
                )}
              </div>
            </div>
          )}
          <div className="container position-relative">
            <div className="get-started-header">
              <div className="row">
                <div className="col-lg-12">
                  <div className="header_logo">
                    {/* <a href="#" style={{'cursor': 'auto'}}> */}
                    <img
                      src={comtech}
                      alt="COMPLIANCE SUTRA"
                      title="COMPLIANCE SUTRA"
                    />
                    <span className="camp">COMPLIANCE SUTRA</span>
                    {/* </a> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="d-block d-sm-none">
              <MobileStepper currentStep={2} />
            </div>

            <div
              className="company-details"
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p className="company-title">Give us your company details</p>
              <button
                className="btn mb-2 save-details common-button-next"
                style={{
                  background: "#6c5dd3 !important",
                  width: 80,
                  height: 43,
                }}
                onClick={() => history.push("/otpverification-co")}
              >
                Skip
              </button>
            </div>
            <div className="bottom-logo-strip-parent-grid d-block d-sm-none">
              {fields &&
                fields.map((item, index) => addNewCompanymobile(item, index))}
              <button
                style={{ width: "fit-content" }}
                onClick={() => {
                  AddAnotherCompany();
                }}
                className="add-company-link"
              >
                Add another company
              </button>
            </div>

            <div className="bottom-logo-strip-parent-grid table-responsive">
              <table className="companyDetailsGrid table company-details-tbl d-none d-sm-block">
                <caption
                  style={{ width: "fit-content" }}
                  onClick={() => {
                    AddAnotherCompany();
                  }}
                  className="add-company-link"
                >
                  Add another company
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Company Name</th>
                    <th scope="col">Company Type</th>
                    <th scope="col">Country</th>
                    <th scope="col">Pin Code</th>
                    <th scope="col">GSTIN</th>
                    <th scope="col">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {fields?.map((item, index) => addNewCompany(item, index))}
                </tbody>
              </table>
            </div>
            <div className="bottom-logo-strip custom-bottom-alignment">
              <div className="row align-items-center">
                <div className="col-6">
                  {isLoading ? (
                    <Dots />
                  ) : (
                    <>
                      <button
                        disabled={checkButtonDisabled() === true ? false : true}
                        className={
                          checkButtonDisabled() === true
                            ? "btn mb-2 save-details common-button-next"
                            : "btn mb-2 save-details common-button-next-disabled"
                        }
                        onClick={() => {
                          if (certificateInfo?.length > 0) {
                            history.push("/otpverification-co");
                          } else {
                            redirectToOtpVerification();
                          }
                        }}
                        style={{
                          backgroundColor:
                            checkButtonDisabled() === true
                              ? "#6c5dd3"
                              : "#e4e4e4",
                          color: checkButtonDisabled() !== true && "#aeaeae",
                        }}
                      >
                        {certificateInfo?.length > 0 ? "Next" : "Done"}
                      </button>
                    </>
                  )}
                </div>
                <div className="col-6">
                  <div className="col-md-12 col-xs-12 d-none d-sm-block text-right">
                    {/* <a href="#" style={{'cursor': 'auto'}}> */}
                    <span className="powerBy">Powered by</span>
                    <img
                      className="header_logo footer-logo-secmark"
                      src={secmark}
                      alt="SECMARK"
                      title="SECMARK"
                    />
                    {/* </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
}

export default withRouter(CompanyDetails);
