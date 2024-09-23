/* eslint-disable react-hooks/exhaustive-deps */
import "./style.css";
import React, { useState } from "react";
import assignIconCircle from "../../assets/Icons/assignIconCircle.png";
import plusIcon from "../../assets/Icons/plusIcon3.png";
import { useOuterClick } from "Components/OnBoarding/SubModules/DashBoardCO/components/CoSetting/CoCompany/utils";
import axiosInstance from "apiServices";
import { toast } from "react-toastify";
import greenCheck from "../../assets/Icons/greenCheck.png";
import redCheck from "../../assets/Icons/redCheck.png";
const DepartmentDialog = ({
  addSelectedDepartment,
  selectedDepartment,
  setSelectedDepartment,
  isEdit = false,
  addNewDepartment,
  edit,
}) => {
  const [DepartmentList, setDepartmentList] = useState([]);
  const [currentDropDown, setCurrentDropDown] = useState("");
  const [departmentInfo, setDepartmentInfo] = useState(false);

  const dialogRef = useOuterClick((e) => {
    if (
      (currentDropDown !== "open" && !e.target.id.includes("addBtn")) ||
      (currentDropDown === "open" && e.target.id === "")
    ) {
      setCurrentDropDown("");
      setSelectedDepartment("");
    }
  });

  const fetchDepList = async () => {
    try {
      const { data } = await axiosInstance.get(`compliance.api.getUserGroup`);
      if (data) {
        setDepartmentList(data.message.data);
      } else {
        toast.error("No data Found");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleCloseDialog = () => {
    setCurrentDropDown("");
    setDepartmentInfo(true);
  };

  const handleOpenDialog = () => {
    setSelectedDepartment("");
    if (currentDropDown === "open") {
      setCurrentDropDown("");
    } else {
      setCurrentDropDown("open");
      fetchDepList();
    }
  };
  const handleKeyDownOnInput = (e) => {
    const { value } = e.target;
    if (e.key === "Enter") {
      if (
        DepartmentList &&
        DepartmentList?.length > 0 &&
        DepartmentList.find((el) => el === value)
      ) {
      } else {
        addSelectedDepartment(value);
      }
    }
  };

  const handleSearchUser = () => {
    if (selectedDepartment === "") {
      setDepartmentList([...(DepartmentList || [])]);
    }
    const tempSearchResults = [...(DepartmentList || [])].filter((item) => {
      if (item.toLowerCase().includes(selectedDepartment.toLowerCase())) {
        return true;
      }
      return false;
    });

    setDepartmentList([...tempSearchResults]);
  };

  const handleAssignDepartment = (item) => {
    handleCloseDialog();
    setDepartmentInfo(true);
    setSelectedDepartment(item);
  };

  const addNew = () => addNewDepartment();

  return (
    <>
      <div className="holding-list-bold-title AssinTo">
        <div className="col-9 pl-0">
          {departmentInfo ? (
            <div className="depsrtment-info">
              <div style={{ paddingLeft: "10px" }}>{selectedDepartment}</div>

              <div>
                {isEdit && (
                  <img
                    style={{ cursor: "pointer", marginLeft: 10 }}
                    className="check-Icon-circle"
                    src={greenCheck}
                    alt="check Icon"
                    onClick={addNew}
                  />
                )}
                <img
                  style={{ cursor: "pointer" }}
                  className="check-Icon-circle"
                  src={redCheck}
                  alt="check Icon"
                  onClick={() => {
                    setDepartmentInfo(false);
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              className="add-department"
              id="addBtn"
              style={{
                cursor: "pointer",
                width: "fit-content",
              }}
              onClick={() => {
                handleOpenDialog();
              }}
            >
              <img src={assignIconCircle} alt="department Circle Purple" />
              Add
            </div>
          )}

          {currentDropDown === "open" && (
            <div
              ref={dialogRef}
              className="bottom-tool-tip"
              style={{ display: "block" }}
            >
              <div
                className="shadow-tooltip"
                style={{
                  minHeight: "113px",
                  maxHeight: "auto",
                  height: "auto",
                }}
              >
                <div className="">
                  <div className="tool-tip-head">
                    <div className="add-Email border-bottom">
                      <div class="enter-department-div">
                        <input
                          type="text"
                          class="enter-department"
                          placeholder="Enter Department"
                          value={selectedDepartment}
                          onKeyPress={(e) => handleKeyDownOnInput(e)}
                          onChange={(e) => {
                            handleSearchUser();
                            setSelectedDepartment(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="email-list-box"
                    style={{
                      paddingBottom: "15px",
                      maxHeight: "115px",
                      height: "auto",
                    }}
                  >
                    {DepartmentList && DepartmentList.length > 0 ? (
                      DepartmentList.map((item, index) => (
                        <div
                          className="email-list-row"
                          key={index}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleAssignDepartment(item)}
                        >
                          <span className="name-of-emailer">
                            {item ? item : ""}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span
                        className="last-email-box email-list-row"
                        style={{
                          textAlign: "center",
                          opacity: "inherit",
                        }}
                        onClick={handleCloseDialog}
                      >
                        {/* No records Available */}
                        {selectedDepartment !== "" && (
                          <div className="dropbox-add-line">
                            <img src={plusIcon} alt="account Circle Purple" />
                            {selectedDepartment !== "" &&
                              `Add '${selectedDepartment}' Group`}
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DepartmentDialog;
