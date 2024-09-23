import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./style.scss";
import Text from "Components/Audit/components/Text/Text";
import Button from "Components/Audit/components/Buttons/Button";
import calanderIcon from "assets/Icons/calanderIcon.svg";
import { DatePicker } from "antd";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import moment from "moment";
import countryList from "react-select-country-list";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";
import BackDrop from "CommonModules/sharedComponents/Loader/BackDrop";
import ConfirmLicense from "./ConfirmLicense";
import ProjectManagementModal from "Components/ProjectManagement/components/ProjectManagementModal";
import { useGetUserRoles } from "CommonModules/helpers/custom.hooks";
import { setLoading } from "Components/CalenderView/redux/actions";
import { isEqual } from "lodash";
import AddComment from "Components/Events/Components/CommentModal";
import RejectionCommentModal from "Components/Events/Components/AddCircular/RejectionCommentModal";
import { useDispatch, useSelector } from "react-redux";
import { eventsModuleActions } from "Components/Events/redux/actions";

export default function CreateNewLicense({
  handleClose,
  open,
  isAddSubLicene = false,
  isAddParentLicense = false,
  isEdit = false,
  isEditChild = false,
  editdata,
  isFromEventPage = false,
  refreshFn = () => {},
  onAddLicenseSuccessEvent,
  isCreateLicenseForCircular = false,
  onCreatedLicense = () => {},
}) {
  const initialValues = {
    license_name: "",
    activation_date: "",
    display_name: "",
    country: "",
    charges: "0",
    industry_type: "",
  };
  const { isCEApprover } = useGetUserRoles();
  const [fields, setFields] = useState({
    ...initialValues,
  });
  const [fieldsBackup, setFieldsBackup] = useState({ ...initialValues });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const calanderimg = <img src={calanderIcon} alt="calander" />;
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
  const [confirmModal, setConfirmModal] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [isShowCommentModal, setIsShowCommentModal] = useState(false);
  const [indutsryType, setIndustryTypes] = useState([]);
  const isRejectionCommentModalVisible = useSelector(
    (state) => state?.eventsModuleReducer?.rejectionCommentModal?.visible
  );
  const dispatch = useDispatch();
  // const [isDirty, setIsDirty] = useState(false);
  const [currentCountry, setCurrentCountry] = useState("");
  const isDirty = !isEqual(fields, fieldsBackup);
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: "none",
      border: "2px solid #e2e2e2",
      borderRadius: "6px",
      "&:hover, &:focus": {
        border: "2px solid #7a73ff",
      },
      ...(state.isFocused && { border: "2px solid #7a73ff" }),
    }),
  };

  const onFieldsChange = (event) => {
    const { name, value } = event.target;
    setFields({
      ...fields,
      [name]:
        name === "charges"
          ? parseInt(removeWhiteSpaces(value)) || 0
          : removeWhiteSpaces(value),
    });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Validate name field
    if (fields.license_name === "" || fields.license_name === " ") {
      errors.license_name = "License is required";
      isValid = false;
    }
    if (fields.activation_date === "") {
      errors.activation_date = "Activation date is Required";
      isValid = false;
    }
    if (fields.country === "") {
      errors.country = "Country name is required";
      isValid = false;
    }
    if (fields.industry_type === "") {
      errors.industry_type = "Industry type is required";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  // fields.display_name === "" || fields.display_name === " "

  const createEditLicense = (actionEffect = "", actionPayload = null) => {
    setIsLoading(true);
    const commonFields = {
      ...fields,
      display_name:
        fields.display_name === "" || fields.display_name === " "
          ? fields.license_name
          : fields.display_name,
    };

    const addParentLicensePayload = {
      data: {
        ...commonFields,
        parent_license: "",
      },
    };

    const addSubLicensePayload = {
      data: {
        ...commonFields,
        parent_license: editdata?.license_id,
      },
    };

    const editPayload = {
      data: {
        ...commonFields,
      },
    };

    const payload =
      isAddParentLicense || isEdit
        ? addParentLicensePayload
        : isAddSubLicene || isEditChild
        ? addSubLicensePayload
        : editPayload;
    try {
      axiosInstance
        .post("compliance.api.setLicense", payload)
        .then((res) => {
          if (res.status === 200 && res.data.message.status) {
            const pending_license_id = res?.data?.message?.pending_license_id;
            if (actionEffect && actionPayload) {
              if (actionEffect === "Rejected") {
                dispatch(
                  eventsModuleActions.setRejectionCommentModal({
                    visible: true,
                    rejectionDetails: actionPayload,
                    name: "License",
                  })
                );
                setIsLoading(false);
              } else {
                updateLicenseStatus(actionPayload);
              }
            } else {
              toast.success(
                `License ${
                  payload.data?.license_id ? "updated" : "added"
                } successfully!`
              );
              if (isCreateLicenseForCircular) {
                onCreatedLicense({
                  license_name: payload?.data?.license_name,
                  createId: fields?.createId,
                  license_id: pending_license_id,
                });
              }
              handleClose();
              setFields(initialValues);
              setErrors({});
              refreshFn();
              setIsLoading(false);
            }
            if (isFromEventPage && onAddLicenseSuccessEvent) {
              onAddLicenseSuccessEvent(payload?.data?.license_name || "");
            }
          } else {
            setIsLoading(false);
            toast.error(
              res.data.message.status_response || "Something went wrong!"
            );
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("something went wrong");
        });
    } catch (err) {
      setIsLoading(false);
    }
  };

  const getLicenseDetialsForEdit = useCallback(
    (isAddNew = false) => {
      setIsLoading(true);
      let payload = {
        license_id: editdata?.license_id,
        temp_license_id: editdata?.temp_license_id,
      };
      try {
        axiosInstance
          .post("compliance.api.getLicenseDetails", payload)
          .then((res) => {
            setIsLoading(false);

            if (res.status === 200 && Object.keys(res?.data?.message).length) {
              let {
                charges,
                country,
                display_name,
                industry_type,
                license_id,
                parent_license,
                activation_date,
                temp_license_id,
                status,
              } = res?.data?.message;

              setCurrentCountry(country);
              if (!isAddNew) {
                const fieldsValues = {
                  industry_type: industry_type,
                  charges: charges,
                  country: country,
                  display_name: display_name,
                  activation_date: activation_date,
                  parent_license: parent_license,
                  license_name: license_id || parent_license,
                  license_id: license_id,
                  temp_license_id,
                  status,
                };

                setFields({ ...fieldsValues });
                setFieldsBackup({ ...fieldsValues });
              } else {
                setFields({
                  ...fields,
                  country,
                  industry_type,
                });
              }
            }
          })
          .catch((err) => {
            setIsLoading(false);

            console.log(err);
          });
      } catch (err) {
        setIsLoading(false);
      }
    },
    [editdata?.license_id, editdata?.temp_license_id]
  );

  const fetchIndustryList = (value) => {
    try {
      axiosInstance
        .get(`compliance.api.getIndustryList?country=${value}`)
        .then((res) => {
          if (res.status === 200 && res.data.message.industry_list.length) {
            let tempIndustryList = [];
            res?.data?.message?.industry_list?.map((item) => {
              tempIndustryList.push({
                label: item,
                value: item,
              });
            });
            setIndustryTypes(tempIndustryList);
          } else {
            setIndustryTypes([]);
          }
        })
        .catch((err) => {
          toast.error("failed to load Industry list");
        });
    } catch (err) {
      console.log(err);
    }
  };

  const updateLicenseStatus = async (payload) => {
    try {
      // setIsLoading(true);
      const { data, status } = await axiosInstance.post(
        "compliance.api.setLicenseStatus",
        payload
      );

      if (status === 200 && data?.message?.status) {
        toast.success(data?.message?.status_response);
        handleClose();
        setFields(initialValues);
        setErrors({});
        refreshFn();
        setLoading(false);
      } else {
        setIsLoading(false);
        toast.error(data?.message?.status_response);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong while updating the status!");
    }
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      createEditLicense();
    } else {
      toast.error("Please fill required fields");
    }
  };

  const onModalClose = (event, createId = "") => {
    handleClose(createId);
    setErrors({});
    setFields(initialValues);
  };

  useEffect(() => {
    if ((isEdit || isEditChild) && editdata?.license_id) {
      getLicenseDetialsForEdit();
    } else if (isAddSubLicene) {
      getLicenseDetialsForEdit(true);
    } else if (editdata && Object.keys(editdata)?.length) {
      setFields({
        ...initialValues,
        ...editdata,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editdata, isAddParentLicense, isAddSubLicene, isEditChild]);

  // useEffect(() => {
  //   if (isFromEventPage && (editdata?.license_name || editdata.license_id)) {
  //     setFields({
  //       ...fields,
  //       license_name: editdata.license_name || editdata.license_id,
  //     });
  //   }
  // }, [isFromEventPage, editdata]);

  useEffect(() => {
    fetchIndustryList("");
  }, []);
  return (
    <div>
      <ProjectManagementModal
        visible={open}
        onClose={onModalClose}
        closeByOuterClick={false}
        containerClass="create-license__modal-container position-relative"
        isNotCloseable={true}
      >
        <ConfirmLicense
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
          countryValue={countryValue}
          fields={fields}
          setFields={setFields}
        />
        <AddComment
          visible={isShowCommentModal}
          onClose={() => setIsShowCommentModal(false)}
          commentDetails={{
            doctype: "Pending License",
            docname: editdata.temp_license_id,
          }}
        />
        {isRejectionCommentModalVisible && (
          <RejectionCommentModal onReject={updateLicenseStatus} />
        )}
        <BackDrop isLoading={isLoading} />
        <div className="d-flex align-items-center justify-content-between">
          <p className="project-management__header-title mb-0">
            {isAddParentLicense
              ? "Add Parent License"
              : isAddSubLicene
              ? "Add SubLicense"
              : isEdit
              ? "Edit License"
              : isEditChild && "Edit Sub License"}
          </p>
          {isCEApprover &&
            (isEdit || isEditChild) &&
            fields.status !== "Approved" && (
              <div className="d-flex align-items-center justify-content-between">
                <Button
                  onClick={() => {
                    setIsShowCommentModal(true);
                  }}
                  description="Comment"
                />
                <Button
                  onClick={() => {
                    const payload = {
                      temp_license_id: fields.temp_license_id,
                      status: "Approved",
                      comments: "",
                    };
                    if (isDirty) {
                      if (validateForm()) {
                        createEditLicense("Approved", payload);
                      } else {
                        toast.error("Please fill required fields");
                      }
                    } else {
                      updateLicenseStatus(payload);
                    }
                  }}
                  description="Approve"
                  className="mx-2 successButton"
                />
                <Button
                  disabled={editdata?.status === "Rejected"}
                  onClick={() => {
                    const payload = {
                      temp_license_id: fields.temp_license_id,
                      status: "Rejected",
                      comments: "",
                    };
                    if (isDirty) {
                      if (validateForm()) {
                        createEditLicense("Rejected", payload);
                      } else {
                        toast.error("Please fill required fields");
                      }
                    } else {
                      // updateLicenseStatus(payload);
                      dispatch(
                        eventsModuleActions.setRejectionCommentModal({
                          visible: true,
                          rejectionDetails: payload,
                          name: "License",
                        })
                      );
                    }
                  }}
                  description="Reject"
                  className="dangerButton"
                />
              </div>
            )}
        </div>
        {/* <div className="create__licence__modal__heading">
            <div>
              <Text
                heading="h1"
                text={
                  isAddParentLicense
                    ? "Add Parent License"
                    : isAddSubLicene
                    ? "Add SubLicense"
                    : isEdit
                    ? "Edit License"
                    : isEditChild && "Edit Sub License"
                }
                size="medium"
              />
            </div>
            <div className="create__licence__modal__closeBtn">
              <IconButton
                icon={<MdClose />}
                variant="exitBtn"
                size={"large"}
                onClick={onModalClose}
              />
            </div>
          </div> */}
        <div className="row mt-4" style={{ rowGap: "1rem" }}>
          <div className="col-md-6">
            <label className="add-edit-project-labels required">
              Name of The License
            </label>
            <input
              type="text"
              autoFocus
              required
              maxLength={100}
              value={fields.license_name}
              onChange={onFieldsChange}
              className="modal-input"
              name="license_name"
              placeholder="Eg. Mvw"
            />
            {errors.license_name && (
              <Text heading="p" variant="error" text={errors.license_name} />
            )}
          </div>
          <div className="col-md-6">
            <label className="add-edit-project-labels required">
              Activation Date
            </label>
            <DatePicker
              getPopupContainer={(triggerNode) => {
                return triggerNode.parentNode;
              }}
              placeholder="Eg. 3 Feb,2023"
              className="modal-input"
              name="activation_date"
              format="DD MMMM Y"
              disabledDate={(current) => {
                let customDate = moment().format("YYYY-MM-DD");
                return current && current < moment(customDate, "YYYY-MM-DD");
              }}
              suffixIcon={calanderimg}
              value={
                (fields?.activation_date &&
                  moment(fields?.activation_date, "YYYY-MM-DD")) ||
                null
              }
              onChange={(value) =>
                setFields({
                  ...fields,
                  activation_date: value?.format("YYYY-MM-DD") || "",
                })
              }
            />
            {errors.activation_date && (
              <Text heading="p" variant="error" text={errors.activation_date} />
            )}
          </div>
          <div className="col-md-6">
            <label className="add-edit-project-labels">Display Name</label>
            <input
              type="text"
              required
              maxLength={100}
              value={fields.display_name}
              className="modal-input"
              name="display_name"
              onChange={onFieldsChange}
              placeholder="Eg.Mvw"
            />
            {errors.display_name && (
              <Text heading="p" variant="error" text={errors.display_name} />
            )}
          </div>
          <div className="col-md-6">
            <label className="add-edit-project-labels required">
              Applicable In
            </label>

            <Select
              isMulti={false}
              placeholder="Select country"
              styles={customStyles}
              isClearable={true}
              isDisabled={
                isAddSubLicene || isEditChild || isEdit ? true : false
              }
              value={
                options.find(
                  (opt) =>
                    opt.label ===
                    (isAddSubLicene ? currentCountry : fields.country)
                ) || null
              }
              options={options.map((values) => {
                return {
                  value: values.value,
                  label: values.label,
                  isDisabled:
                    isAddSubLicene || isEditChild || isEdit
                      ? values.label === currentCountry
                        ? false
                        : true
                      : false,
                };
              })}
              name="country"
              onChange={(val) => {
                if (val) {
                  if (!isAddSubLicene && !isEditChild && !isEdit) {
                    console.log(val);
                    setCountryValue(val?.label);
                    setConfirmModal(true);
                  } else {
                    setFields({
                      ...fields,
                      country: val?.label || "",
                    });
                  }
                  fetchIndustryList(val?.label);
                } else {
                  setFields({
                    ...fields,
                    country: "",
                  });
                }
              }}
            />
            {errors.country && (
              <Text heading="p" variant="error" text={errors.country} />
            )}
          </div>
          <div className="col-md-6">
            <label className="add-edit-project-labels">Charges</label>
            <input
              type="text"
              required
              maxLength={10}
              className="modal-input"
              name="charges"
              value={fields.charges}
              onChange={(e) => {
                const value = e.target.value;
                if (!value || /(^[0][1-9]+)|([1-9]\d*)$/.test(value)) {
                  onFieldsChange(e);
                }
              }}
              placeholder="Eg. 2000"
            />
          </div>
          <div className="col-md-6">
            <label className="add-edit-project-labels required">
              Industry Type
            </label>
            <CreatableSelect
              isMulti={false}
              placeholder="Industry type"
              isDisabled={isAddSubLicene || isEditChild || isEdit}
              styles={customStyles}
              isValidNewOption={(newStr) => {
                const str = newStr?.trim();
                return str !== "" && str?.length < 100;
              }}
              onCreateOption={(newStr) => {
                setFields({
                  ...fields,
                  industry_type: newStr.trim(),
                });
                setIndustryTypes([
                  ...indutsryType,
                  {
                    value: newStr.trim(),
                    label: newStr.trim(),
                  },
                ]);
              }}
              isClearable={true}
              value={
                indutsryType.find(
                  (opt) => opt.label === fields.industry_type
                ) || null
              }
              name="industry_type"
              onChange={(val) => {
                setFields({
                  ...fields,
                  industry_type: val?.label || "",
                });
              }}
              options={indutsryType}
            />
            {errors.industry_type && (
              <Text heading="p" variant="error" text={errors.industry_type} />
            )}
          </div>
        </div>

        <div className="d-flex justify-content-center project-management__button-container--bottom-fixed">
          <div className="p-2">
            <Button
              description="SUBMIT"
              variant="default"
              onClick={onFormSubmit}
              disabled={!isDirty}
            />
          </div>
          <div className="p-2">
            <Button
              description="CANCEL"
              variant="cancelBtn"
              onClick={(e) => onModalClose(e, fields?.createId)}
            />
          </div>
        </div>
        {/* </div> */}
      </ProjectManagementModal>
    </div>
  );
}
