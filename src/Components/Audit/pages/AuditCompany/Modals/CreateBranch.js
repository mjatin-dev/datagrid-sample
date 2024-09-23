/* eslint-disable default-case */
import React, { useState, useEffect, useMemo } from "react";
import Modal from "@mui/material/Modal";
import styles from "./style.module.scss";
import { Input } from "../../../components/Inputs/Input.jsx";
import { MdClose } from "react-icons/md";
import IconButton from "../../../components/Buttons/IconButton";
import Button from "../../../components/Buttons/Button";
import CreatableSelect from "react-select/creatable";
import axiosInstance from "../../../../../apiServices";
import countryList from "react-select-country-list";
import { setBranchDetails } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import BackDrop from "../../../../../CommonModules/sharedComponents/Loader/BackDrop";
import { customStyle } from "Components/Audit/assets/reactSelectStyles/styles";
import { removeWhiteSpaces } from "CommonModules/helpers/string.helpers";
import { validEmailRegex } from "Components/Audit/components/Helpers/string.helpers";

const initialstate = {
  branch_docname: null,
  branch_location: "",
  branch_country: "",
  branch_pincode: "",
  branch_code: "",
  company_name: "",
  manager_name: "",
  manager_emailid: "",
  manager_phone_no: "",
  address_line1: "",
  address_line2: "",
  state: "",
  city: "",
};

const initialError = {
  branchLocationErr: "",
  branchCountryErr: "",
  branchPinCodeErr: "",
  companyNameErr: "",
  managerNameErr: "",
  phoneNoErr: "",
  emailIdErr: "",
};
export default function CreateCompany({ handleClose, open, data }) {

  const state = useSelector((state) => state);
  const [branchData, setBranchData] = useState(initialstate);
  const place = "Please Select";
  const [error, setError] = useState(initialError);
  const [companyListData, setCompanyListData] = useState([]);

  const dispatch = useDispatch();

  //variable function to get country list
  const options = useMemo(() => countryList().getData(), []);

  const [isLoading, setIsLoading] = useState(false);

  //form validate function
  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  //function to get Existing company list
  const companyList = () => {
    try {
      axiosInstance.get("audit.api.getCompanyDetails").then((res) => {
        if (res?.data?.message?.company_list) {
          const arr = [];
          res?.data?.message?.company_list.map((items) => {
            arr.push({
              label: items.Company_name,
              value: items.company_id,
            });
          });
          setCompanyListData(arr);
        }
      });
    } catch (err) {}
  };

  //function to validate pincode
  const pinCodeCheck = (pinCode) => {
    if (pinCode.length > 6 || pinCode.length < 6) {
      setError({
        ...error,
        branchPinCodeErr: "Invalid Pincode",
        branchCountryErr: "",
      });
    } else if (pinCode.length === 6) {
      setIsLoading(true);
      try {
        axiosInstance
          .post("audit.api.CheckPincode", {
            pincode: pinCode,
          })
          .then((res) => {
            if (res?.data?.message?.status) {
              setBranchData({
                ...branchData,
                branch_pincode: pinCode,
                state: res?.data?.message?.state,
                city: res?.data?.message?.city,
                branch_country: res?.data?.message?.country,
              });
              setError({
                ...error,
                branchPinCodeErr: "",
                branchCountryErr: "",
              });
              setIsLoading(false);
            } else {
              setError({
                ...error,
                branchPinCodeErr: "Invalid Pincode",
                branchCountryErr: "",
              });
              setIsLoading(false);
            }
          });
      } catch (err) {
        setIsLoading(false);
      }
    }
  };

  // function to set input fileds values
  const dataFields = (event) => {
    const { name, value } = event.target;
    // if (name === "branch_pincode") {
    //   pinCodeCheck(value);
    // }
    switch (name) {
      case "manager_emailid":
        setError({
          ...error,
          emailIdErr: validEmailRegex.test(value) ? "" : "Email is not valid",
        });
        break;
      case "manager_phone_no":
        setError({
          ...error,
          phoneNoErr: value.length === 10 ? "" : "mobile must be 10 digit",
        });
        break;
    }
    if (name === "branch_pincode") {
      if (branchData.branch_country === "") {
        setError({
          ...error,
          branchCountryErr: "please select country",
        });
      } else if (branchData.branch_country === "India") {
        pinCodeCheck(value);
        setBranchData({
          ...branchData,
          branch_pincode: value,
        });
      } else if (
        branchData.branch_country !== "India" &&
        branchData.branch_country !== ""
      ) {
        setBranchData({
          ...branchData,
          branch_pincode: value,
        });
      }
    } else {
      setBranchData({
        ...branchData,
        [name]: removeWhiteSpaces(value),
      });
    }
  };

  //company change dropdown function
  const companyChange = (event) => {
    setBranchData({
      ...branchData,
      company_name: event.label,
    });
  };

  //Country change dropdown function
  const countryChange = (e) => {
    let countryvalue = countryList().getLabel(e.value) || e.value;
    if (countryvalue.length > 0) {
      setError({
        ...error,
        branchCountryErr: "",
      });
    }
    if (countryvalue === "India") {
      pinCodeCheck(branchData.branch_pincode);
      setBranchData({
        ...branchData,
        branch_country: countryvalue,
      });
    } else {
      setError({
        ...error,
        branchPinCodeErr: "",
        branchCountryErr: "",
      });
    }
    setBranchData({
      ...branchData,
      branch_country: countryvalue,
    });
  };

  // function to sumit data and to create branch
  const onSubmitData = () => {
    setIsLoading(true);
    if (validateForm(error)) {
      try {
        axiosInstance.post("audit.api.CreateBranch", branchData).then((res) => {
          if (res?.data?.message?.status) {
            handleClose();
            dispatch(setBranchDetails(branchData));
            toast.success(res?.data?.message?.status_response);
            setIsLoading(false);
            setBranchData({
              ...initialstate,
            });
          } else {
            toast.error(
              res?.data?.message?.status_response || "something went wrong"
            );
            setIsLoading(false);
          }
        });
      } catch (err) {
        toast.error("Something went Wrong", err);
        setIsLoading(false);
      }
    } else {
      toast.error("please correct and fill required detials");
      setIsLoading(false);
    }
  };


  const requiredFields = [
    "branch_location",
    "branch_country",
    "branch_pincode",
    "branch_code",
    "company_name",
    "manager_name",
    "manager_emailid",
    "manager_phone_no",
    "address_line1",
    "state",
    "city",
  ];

  const isFormValid = requiredFields.every(
    (fieldName) =>
    branchData[fieldName] !== "" &&
    branchData[fieldName] !== " " &&
    branchData[fieldName] !== null
  );

  // to call company List function
  useEffect(() => {
    companyList();
  }, [state?.AuditReducer?.CompanyData,state?.AuditReducer?.deleteCompany]);

  // to set edit data
  useEffect(() => {
    if (data && Object.keys(data)?.length > 0) {
      setBranchData({
        ...data,
      });
    }
  }, [data, state?.AuditReducer?.editState]);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setBranchData({
            ...initialstate,
          });
          setError({
            ...initialError,
          });
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.box}>
          <BackDrop isLoading={isLoading} />
          <div className={styles.closeBtn}>
            <IconButton
              icon={<MdClose />}
              variant="exitBtn"
              onClick={() => {
                setBranchData({
                  ...initialstate,
                });
                setError({
                  ...initialError,
                });
                handleClose();
              }}
            />
          </div>
          <div className={styles.inputfields}>
            <div className="p-2">
              <label className={`${styles.label} ${styles.required}`}>
                Company Name
              </label>
              <CreatableSelect
                styles={customStyle}
                options={companyListData}
                placeholder={"type to search"}
                onChange={companyChange}
                value={{
                  label:
                    branchData?.company_name?.length === 0
                      ? place
                      : branchData?.company_name,
                  value:
                    branchData?.company_name?.length === 0
                      ? place
                      : branchData?.company_name,
                }}
              />
            </div>
            <div className="p-2">
              <Input
                labelText="Location"
                type="text"
                required={true}
                placeholder="Enter "
                variant="createCompanyInputs"
                name="branch_location"
                value={branchData?.branch_location}
                onChange={dataFields}
              />
            </div>
          </div>
          <div className={styles.inputfields}>
            <div className="p-2">
              <Input
                labelText="Branch Code"
                type="text"
                required={true}
                placeholder="Enter"
                variant="createCompanyInputs"
                name="branch_code"
                value={branchData?.branch_code}
                onChange={dataFields}
              />
            </div>
            <div className="p-2">
              <Input
                labelText="Address Line1"
                type="text"
                required={true}
                placeholder="Enter "
                variant="createCompanyInputs"
                name="address_line1"
                value={branchData?.address_line1}
                onChange={dataFields}
              />
            </div>
          </div>
          <div className={styles.inputfields}>
            <div className="p-2">
              <Input
                labelText="Address Line2"
                type="text"
                placeholder="Enter "
                variant="createCompanyInputs"
                name="address_line2"
                value={branchData?.address_line2}
                onChange={dataFields}
              />
            </div>
            <div className="p-2">
              <label className={styles.label}>Country</label>
              <CreatableSelect
                styles={customStyle}
                options={options}
                value={{
                  label:
                    branchData?.branch_country?.length === 0
                      ? place
                      : branchData?.branch_country,
                  value:
                    branchData?.branch_country?.length === 0
                      ? place
                      : branchData?.branch_country,
                }}
                onChange={(e) => countryChange(e)}
              />
              {error?.branchCountryErr !== "" && (
                <p className={styles.errors}>{error?.branchCountryErr}</p>
              )}
            </div>
          </div>
          <div className={styles.inputfields}>
            <div className="p-2">
              <Input
                labelText="Pincode"
                type="text"
                maxLength={branchData?.branch_country === "India" ? 6 : 12}
                required={true}
                placeholder="Enter"
                variant="createCompanyInputs"
                name="branch_pincode"
                value={branchData?.branch_pincode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value || /(^[0][1-9]+)|([1-9]\d*)$/.test(value)) {
                    dataFields(e);
                  }
                }}
              />
              {error?.branchPinCodeErr !== "" && (
                <p className={styles.errors}>{error?.branchPinCodeErr}</p>
              )}
            </div>
            <div className="p-2">
              <Input
                labelText="State"
                required={true}
                type="text"
                placeholder="Enter"
                variant="createCompanyInputs"
                name="state"
                value={branchData?.state}
                onChange={dataFields}
              />
            </div>
          </div>
          <div className={styles.inputfields}>
            <div className="p-2">
              <Input
                labelText="City"
                required={true}
                type="text"
                placeholder="Enter"
                variant="createCompanyInputs"
                name="city"
                value={branchData?.city}
                onChange={dataFields}
              />
            </div>
            <div className="p-2">
              <Input
                labelText="Branch Manager"
                type="text"
                required={true}
                placeholder="enter name"
                variant="createCompanyInputs"
                name="manager_name"
                value={branchData?.manager_name}
                onChange={dataFields}
              />
            </div>
          </div>
          <div className={styles.inputfields}>
            <div className="p-2">
              <Input
                labelText="Email Id"
                required={true}
                type="text"
                placeholder="email"
                variant="createCompanyInputs"
                name="manager_emailid"
                value={branchData?.manager_emailid}
                onChange={dataFields}
              />
              {error?.emailIdErr !== "" && (
                <p className={styles.errors}>{error?.emailIdErr}</p>
              )}
            </div>
            <div className="p-2">
              <Input
                labelText="Mobile No"
                required={true}
                type="text"
                placeholder="mobile no"
                variant="createCompanyInputs"
                maxLength={10}
                name="manager_phone_no"
                value={branchData?.manager_phone_no}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value || /(^[0][1-9]+)|([1-9]\d*)$/.test(value)) {
                    dataFields(e);
                  }
                }}
              />
              {error?.phoneNoErr !== "" && (
                <p className={styles.errors}>{error?.phoneNoErr}</p>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-center mt-3">
            <div className="p-2">
              <Button
                description="SUBMIT"
                variant="submitBtn"
                disabled={!isFormValid}
                onClick={onSubmitData}
              />
            </div>
            <div className="p-2">
              <Button
                description="CANCEL"
                variant="cancelBtn"
                onClick={() => {
                  setBranchData({
                    ...initialstate,
                  });
                  setError({
                    ...initialError,
                  });
                  handleClose();
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
