import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./style.css";
import { KeyboardArrowUp } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";

const Licenses = ({
  open,
  setChooseLicense,
  licenseDetail,
  addLicense,
  selectedIndex,
  listOflist,
  setSelectedIndex,
}) => {
  const [list, setList] = useState([]);
  const [licenseCount, setLicenseCount] = useState(0);

  // To set The License List Initially
  useEffect(() => {
    setLicenseCount(listOflist.length);
    const responseList = listOflist?.map((item) => {
      return {
        business_category: item.industry,
        show: false,
        licenses: item.license.map((license) => {
          return {
            license: license.name,
            show: false,
            selected: checkLicense(item.industry, license.name),
            subLicense:
              license.sublicense.length > 0
                ? license.sublicense.map((sublic) => {
                    return {
                      license: sublic.name,
                      show: false,
                      selected: checkLicense(item.industry, sublic.name),
                    };
                  })
                : [],
          };
        }),
      };
    });

    setList(responseList);
  }, []);

  // To set The Total Selected License Count
  useEffect(() => {
    const temp = [...list];
    let licenses = [];
    temp.map((items) => {
      items.licenses.map((LItem) => {
        if (LItem.selected && LItem.subLicense.length === 0) {
          licenses.push(LItem.license);
        }
        LItem.subLicense.map((SItem) => {
          if (SItem.selected) {
            licenses.push(SItem.license);
          }
        });
      });
    });
    setLicenseCount(licenses.length);
  }, [list]);

  // const checkIndustry = (industry) => {
  //   if (licenseDetail?.length > 0) {
  //     const industryList = [
  //       ...new Set(licenseDetail.map((item) => item.industry_type)),
  //     ];

  //     if (industryList.includes(industry)) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // };

  //Function to check if the license is Selected or not
  const checkLicense = (industry, license) => {
    if (licenseDetail?.length > 0) {
      const licenseList = licenseDetail.filter(
        (item) => item.industry_type === industry && item.license === license
      );

      if (licenseList.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  // Function For Expand View (To View Particular industry License)
  const handleSelectLicense = (index) => {
    const temp = [...list];
    const result = temp.map((item, key) => {
      return {
        ...item,
        show: key === index && !item.show,
      };
    });

    setList(result);
  };

  // Function For Expand View for SubLicense (To View Particular License subLicense)
  const handleSelectSubLicense = (index) => {
    const temp = [...list];
    const result = temp.map((item, key) => {
      return {
        ...item,
        licenses: item.licenses.map((license, keys) => {
          return {
            ...license,
            show: keys === index && !license.show,
          };
        }),
      };
    });
    setList(result);
  };

  // Function to Change CheckBox Values of license
  const handleCheckboxLicense = (index, childIndex) => {
    const temp = [...list];
    temp[index].licenses[childIndex].selected =
      !temp[index].licenses[childIndex].selected;

    // to select Sublicense when parent checkBox is True or false all SubLicense Will Change accordingly
    if (temp[index].licenses[childIndex].subLicense.length > 0) {
      temp[index].licenses[childIndex].subLicense = temp[index].licenses[
        childIndex
      ].subLicense.map((item) => {
        return {
          ...item,
          selected: !item.selected,
        };
      });

      // to select Sublicense when parent checkBox is True all SubLicense Will be True
      if (temp[index].licenses[childIndex].selected === true) {
        temp[index].licenses[childIndex].subLicense = temp[index].licenses[
          childIndex
        ].subLicense.map((item) => {
          return {
            ...item,
            selected: true,
          };
        });
      }
    }
    setList(temp);
  };

  const handleSubCheckBox = (index, childIndex, subIndex) => {
    const temp = [...list];
    temp[index].licenses[childIndex].subLicense[subIndex].selected =
      !temp[index].licenses[childIndex].subLicense[subIndex].selected;
    const allSeletedLength = temp[index].licenses[childIndex].subLicense.filter(
      (item) => item.selected
    ).length;
    const subLicenseLength = temp[index].licenses[childIndex].subLicense.length;

    // if any of sublicense is not selected parent checkbox will be false if all selected then true
    if (allSeletedLength === subLicenseLength) {
      temp[index].licenses[childIndex].selected = true;
    } else {
      temp[index].licenses[childIndex].selected = false;
    }
    setList(temp);
  };

  const setLicense = () => {
    const temp = [...list];
    let licenses = [];

    temp.map((items) => {
      items.licenses.map((LItem) => {
        if (LItem.selected) {
          licenses.push(LItem.license);
        }
        LItem.subLicense.map((SItem) => {
          if (SItem.selected) {
            licenses.push(SItem.license);
          }
        });
      });
    });
    addLicense(selectedIndex, licenses);
    setChooseLicense(false);
    setLicenseCount(licenses.length);
  };

  useEffect(() => {
    const container = document.querySelector(".license-box-rows");
    const licenseElements = document.querySelectorAll(".columns-license");
    if (licenseElements?.length > 0 && container) {
      const containerRects = container.getBoundingClientRect();

      licenseElements.forEach((element) => {
        const elementRects = element.getBoundingClientRect();
        const rightOffset = containerRects.right - elementRects.right - 24;

        if (rightOffset <= 0) {
          element.style.right = "0px";
          element.style.left = "auto";
        } else {
          element.style.left = "0px";
        }
      });
    }
  }, [listOflist, list]);

  return (
    <Modal open={open}>
      <div className="license-box-container">
        <div className="license-box-content">
          <div className="license-box-detail">
            <div className="license-box-detail-title py-3">
              <h4 className="mb-0">Choose License</h4>
              <IconButton
                disableTouchRipple={true}
                onClick={() => {
                  setChooseLicense(false);
                  setSelectedIndex && setSelectedIndex(undefined);
                }}
              >
                <MdClose />
              </IconButton>
              {/* <CloseIcon style={{ cursor: "pointer" }} /> */}
            </div>

            {list.length === 0 && (
              <p className="h6 px-4 my-2" style={{ color: "red" }}>
                There is no licenses, please choose another country.
              </p>
            )}

            {list.length > 0 && licenseCount === 0 ? (
              <p className="h6 px-4 my-2">
                *First Select any company license and then click “ADD LICENSE”
                to add .
              </p>
            ) : (
              list.length > 0 && (
                <p className="h6 px-4 my-2">
                  Selected Licenses: {licenseCount}
                </p>
              )
            )}

            <div className="license-box-rows pt-2">
              {list && list.length > 0 ? (
                list.map((item, index) => {
                  let totalSubLicenseCount = 0;
                  let selectedSubLicenseCount = 0;
                  let licensesLength = 0;
                  let sublicencelength = 0;
                  const selectedLicenses = item.licenses.filter((items) => {
                    if (items.subLicense && items.subLicense.length > 0) {
                      sublicencelength = items.subLicense.length;
                      totalSubLicenseCount =
                        totalSubLicenseCount + items.subLicense.length;
                      selectedSubLicenseCount =
                        selectedSubLicenseCount +
                        items.subLicense.filter(
                          (subLicense) => subLicense.selected
                        ).length;
                    }
                    if (items.subLicense.length === 0) {
                      licensesLength = licensesLength + 1;
                      return items.selected;
                    }
                  }).length;
                  return (
                    <div
                      key={`license-dropdown-${item.business_category}-${index}-key`}
                      className="position-relative"
                    >
                      <div
                        className={`${
                          !item.show ? "columns" : "columns-active"
                        } cursor-pointer`}
                        onClick={() => {
                          handleSelectLicense(index);
                        }}
                      >
                        <div className="d-flex justify-content-between w-100 align-items-center">
                          <p className="business___Category__text__alignment mt-3">
                            {item.business_category || "--"}
                          </p>
                          {(selectedLicenses > 0 ||
                            selectedSubLicenseCount > 0) && (
                            <p className="mt-3 ml-auto">
                              ({selectedLicenses + selectedSubLicenseCount}/
                              {licensesLength + totalSubLicenseCount})
                            </p>
                          )}
                          {!item.show ? (
                            <KeyboardArrowDownIcon className="svg-active" />
                          ) : (
                            <KeyboardArrowUp className="svg-active" />
                          )}
                        </div>
                      </div>

                      <div
                        className={
                          !item.show
                            ? "columns-deactive-license"
                            : "columns-license"
                        }
                      >
                        {item?.licenses && item.licenses.length > 0 ? (
                          item.licenses.map((licenseList, childIndex) => {
                            const subLicenceLen =
                              licenseList?.subLicense.length;
                            const selectedSubLicenses =
                              licenseList?.subLicense.filter(
                                (subLicList) => subLicList?.selected
                              ).length || 0;
                            return (
                              <div className="d-flex flex-wrap flex-column mr-2 mb-2">
                                <div className="d-flex align-items-baseline mr-2">
                                  {subLicenceLen === 0 && (
                                    <>
                                      <input
                                        id={`license-parent-${licenseList.license}-${childIndex}`}
                                        type="checkbox"
                                        className="mr-2 ml-2"
                                        onClick={() =>
                                          handleCheckboxLicense(
                                            index,
                                            childIndex
                                          )
                                        }
                                        defaultChecked={
                                          licenseList.selected || null
                                        }
                                      />
                                      <label
                                        htmlFor={
                                          subLicenceLen === 0 &&
                                          `license-parent-${licenseList.license}-${childIndex}`
                                        }
                                        className={`mb-0 fit-content license_lable cursor-pointer ${
                                          subLicenceLen !== 0 && "ml-2"
                                        }`}
                                      >
                                        {licenseList.license}
                                      </label>
                                    </>
                                  )}
                                  {subLicenceLen > 0 && (
                                    <span
                                      className={`mb-0 fit-content license_lable cursor-pointer ${
                                        subLicenceLen !== 0 && "ml-2"
                                      }`}
                                    >
                                      {licenseList.license}
                                    </span>
                                  )}
                                  <div className="d-flex flex-wrap">
                                    {licenseList?.subLicense &&
                                      licenseList.subLicense.length > 0 && (
                                        <>
                                          <div className="d-flex align-items-center ml-2">
                                            ({selectedSubLicenses}/
                                            {licenseList?.subLicense.length})
                                          </div>
                                          <IconButton
                                            disableTouchRipple
                                            onClick={() => {
                                              handleSelectSubLicense(
                                                childIndex
                                              );
                                            }}
                                            size="small"
                                          >
                                            {!licenseList?.show ? (
                                              <KeyboardArrowDownIcon className="svg-active" />
                                            ) : (
                                              <KeyboardArrowUp className="svg-active" />
                                            )}
                                          </IconButton>
                                        </>
                                      )}
                                  </div>
                                </div>
                                <div
                                  className={
                                    !licenseList.show
                                      ? "columns-deactive-license"
                                      : "columns-subLicense"
                                  }
                                >
                                  {licenseList?.subLicense.map(
                                    (subLicItem, ind) => {
                                      const id = `license-child-${subLicItem.license}-${ind}`;
                                      return (
                                        <div key={id + "key"}>
                                          <input
                                            // disabled={!subLicItem.enable}
                                            id={id}
                                            type="checkbox"
                                            className="mr-2 ml-2"
                                            onClick={() => {
                                              // if (subLicItem.enable) {
                                              handleSubCheckBox(
                                                index,
                                                childIndex,
                                                ind
                                              );
                                              // }
                                            }}
                                            defaultChecked={subLicItem.selected}
                                          />
                                          <label
                                            htmlFor={id}
                                            className="cursor-pointer mb-0 fit-content license_lable"
                                          >
                                            {subLicItem.license}
                                          </label>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <span className="mt-2">No licenses</span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="license-add-button text-center mt-3">
            <button onClick={setLicense}>Add license</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Licenses;
