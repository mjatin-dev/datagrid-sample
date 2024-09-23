import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import "./style.css";
const AddressInput = (props) => {
  const {
    pinCodeCheck,
    label,
    error,
    styleType,
    register,
    form_id,
    handleOnChange,
    index,
  } = props;
  const [state, setState] = useState({
    streetAddress: "",
    streetAddressLine2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
  });
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

  switch (styleType) {
    case "Style 01":
      return (
        <div style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ margin: 0 }}>
            {label}
          </p>
          <div className="style1-input-div-address">
            <div className="span-col">
              <input
                type="text"
                placeholder="Street Address"
                value={state.streetAddress}
                {...register(`${form_id}-streetAddress`, {
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, streetAddress: e.target.value };
                    setState({ ...state, streetAddress: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
                className="short-answer-input"
                style={{ width: "100%", marginRight: "10px" }}
              />

              <p className="sme-error">
                {error?.[`${form_id}-streetAddress`]?.message}
              </p>
            </div>
            <div className="span-col">
              <input
                type="text"
                placeholder="Street Address Line 2"
                className="short-answer-input"
                style={{ width: "100%" }}
                value={state.streetAddressLine2}
                {...register(`${form_id}-streetAddressLine2`, {
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, streetAddressLine2: e.target.value };
                    setState({ ...state, streetAddressLine2: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
              />

              <p className="sme-error">
                {error?.[`${form_id}-streetAddressLine2`]?.message}
              </p>
            </div>
            <div>
              <input
                type="text"
                placeholder="City"
                className="short-answer-input"
                style={{ width: "100%" }}
                value={state.city}
                {...register(`${form_id}-city`, {
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, city: e.target.value };
                    setState({ ...state, city: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
              />

              <p className="sme-error">{error?.[`${form_id}-city`]?.message}</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Region"
                className="short-answer-input"
                style={{ width: "100%" }}
                value={state.region}
                {...register(`${form_id}-region`, {
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, region: e.target.value };
                    setState({ ...state, region: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
              />

              <p className="sme-error">
                {error?.[`${form_id}-region`]?.message}
              </p>
            </div>
            <div>
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Country"
                options={options}
                {...register(`${form_id}-country`, {})}
                onChange={(e) => {
                  let temp = { ...state };
                  let countryvalue = countryList().getLabel(e.value) || e.value;
                  temp = { ...temp, country: countryvalue };
                  setState({ ...state, country: countryvalue });
                  handleOnChange(temp, index);
                }}
              />

              <p className="sme-error">
                {error?.[`${form_id}-country`]?.message}
              </p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Postal / Zip Code"
                className="short-answer-input"
                style={{ width: "100%" }}
                value={state.postalCode}
                {...register(`${form_id}-postalCode`, {
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, postalCode: e.target.value };
                    setState({ ...state, postalCode: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
                onBlur={(event) => {
                  if (state?.country === "India") {
                    pinCodeCheck(event.target.value);
                  }
                }}
              />

              <p className="sme-error">
                {error?.[`${form_id}-postalCode`]?.message}
              </p>
            </div>
          </div>
        </div>
      );
    case "Style 02":
      return (
        <div className="sme-style2-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ margin: 0 }}>
            {label}
          </p>
          <div className="style2-input-div">
            <div className="style1-input-div-address">
              <div className="span-col">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={state.streetAddress}
                  {...register(`${form_id}-streetAddress`, {
                    onChange: (e) => {
                      let temp = { ...state };
                      temp = { ...temp, streetAddress: e.target.value };
                      setState({ ...state, streetAddress: e.target.value });
                      handleOnChange(temp, index);
                    },
                  })}
                  className="short-answer-input"
                  style={{ width: "100%", marginRight: "10px" }}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-streetAddress`]?.message}
                </p>
              </div>
              <div className="span-col">
                <input
                  type="text"
                  placeholder="Street Address Line 2"
                  className="short-answer-input"
                  style={{ width: "100%" }}
                  value={state.streetAddressLine2}
                  {...register(`${form_id}-streetAddressLine2`, {
                    onChange: (e) => {
                      let temp = { ...state };
                      temp = { ...temp, streetAddressLine2: e.target.value };
                      setState({
                        ...state,
                        streetAddressLine2: e.target.value,
                      });
                      handleOnChange(temp, index);
                    },
                  })}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-streetAddressLine2`]?.message}
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="City"
                  className="short-answer-input"
                  style={{ width: "100%" }}
                  value={state.city}
                  {...register(`${form_id}-city`, {
                    onChange: (e) => {
                      let temp = { ...state };
                      temp = { ...temp, city: e.target.value };
                      setState({ ...state, city: e.target.value });
                      handleOnChange(temp, index);
                    },
                  })}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-city`]?.message}
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Region"
                  className="short-answer-input"
                  style={{ width: "100%" }}
                  value={state.region}
                  {...register(`${form_id}-region`, {
                    onChange: (e) => {
                      let temp = { ...state };
                      temp = { ...temp, region: e.target.value };
                      setState({ ...state, region: e.target.value });
                      handleOnChange(temp, index);
                    },
                  })}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-region`]?.message}
                </p>
              </div>

              <div>
                <Select
                  style={{
                    width: "100%",
                  }}
                  placeholder="Country"
                  options={options}
                  {...register(`${form_id}-country`, {})}
                  onChange={(e) => {
                    let temp = { ...state };
                    let countryvalue =
                      countryList().getLabel(e.value) || e.value;
                    temp = { ...temp, country: countryvalue };
                    setState({ ...state, country: countryvalue });
                    handleOnChange(temp, index);
                  }}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-country`]?.message}
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Postal / Zip Code"
                  className="short-answer-input"
                  style={{ width: "100%" }}
                  value={state.postalCode}
                  {...register(`${form_id}-postalCode`, {
                    onChange: (e) => {
                      let temp = { ...state };
                      temp = { ...temp, postalCode: e.target.value };
                      setState({ ...state, postalCode: e.target.value });
                      handleOnChange(temp, index);
                    },
                  })}
                  onBlur={(event) => {
                    if (state?.country === "India") {
                      pinCodeCheck(event.target.value);
                    }
                  }}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-postalCode`]?.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    case "Style 03":
      return (
        <div className="sme-style3-div" style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2">{label}</p>
          <div className="style2-input-div">
            <div className="style1-input-div-address">
              <div className="span-col">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={state.streetAddress}
                  {...register(`${form_id}-streetAddress`, {
                    onChange: (e) => {
                      let temp = { ...state };
                      temp = { ...temp, streetAddress: e.target.value };
                      setState({ ...state, streetAddress: e.target.value });
                      handleOnChange(temp, index);
                    },
                  })}
                  className="short-answer-input"
                  style={{ width: "100%", marginRight: "10px" }}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-streetAddress`]?.message}
                </p>
              </div>
              <div className="span-col">
                <input
                  type="text"
                  placeholder="Street Address Line 2"
                  className="short-answer-input"
                  style={{ width: "100%" }}
                  value={state.streetAddressLine2}
                  {...register(`${form_id}-streetAddressLine2`, {
                    onChange: (e) => {
                      let temp = { ...state };
                      temp = { ...temp, streetAddressLine2: e.target.value };
                      setState({
                        ...state,
                        streetAddressLine2: e.target.value,
                      });
                      handleOnChange(temp, index);
                    },
                  })}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-streetAddressLine2`]?.message}
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="City"
                  className="short-answer-input"
                  style={{ width: "100%" }}
                  value={state.city}
                  {...register(`${form_id}-city`, {
                    onChange: (e) => {
                      let temp = { ...state };
                      temp = { ...temp, city: e.target.value };
                      setState({ ...state, city: e.target.value });
                      handleOnChange(temp, index);
                    },
                  })}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-city`]?.message}
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Region"
                  className="short-answer-input"
                  style={{ width: "100%" }}
                  value={state.region}
                  {...register(`${form_id}-region`, {
                    onChange: (e) => {
                      let temp = { ...state };
                      temp = { ...temp, region: e.target.value };
                      setState({ ...state, region: e.target.value });
                      handleOnChange(temp, index);
                    },
                  })}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-region`]?.message}
                </p>
              </div>

              <div>
                <Select
                  style={{
                    width: "100%",
                  }}
                  placeholder="Country"
                  options={options}
                  {...register(`${form_id}-country`, {})}
                  onChange={(e) => {
                    let temp = { ...state };
                    let countryvalue =
                      countryList().getLabel(e.value) || e.value;
                    temp = { ...temp, country: countryvalue };
                    setState({ ...state, country: countryvalue });
                    handleOnChange(temp, index);
                  }}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-country`]?.message}
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Postal / Zip Code"
                  className="short-answer-input"
                  style={{ width: "100%" }}
                  value={state.postalCode}
                  {...register(`${form_id}-postalCode`, {
                    onChange: (e) => {
                      let temp = { ...state };
                      temp = { ...temp, postalCode: e.target.value };
                      setState({ ...state, postalCode: e.target.value });
                      handleOnChange(temp, index);
                    },
                  })}
                  onBlur={(event) => {
                    if (state?.country === "India") {
                      pinCodeCheck(event.target.value);
                    }
                  }}
                />

                <p className="sme-error">
                  {error?.[`${form_id}-postalCode`]?.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div style={{ marginBottom: "20px" }}>
          <p className="short-answer-p-style2" style={{ margin: 0 }}>
            {label}
          </p>
          <div className="style1-input-div-address">
            <div className="span-col">
              <input
                type="text"
                placeholder="Street Address"
                value={state.streetAddress}
                {...register(`${form_id}-streetAddress`, {
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, streetAddress: e.target.value };
                    setState({ ...state, streetAddress: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
                className="short-answer-input"
                style={{ width: "100%", marginRight: "10px" }}
              />

              <p className="sme-error">
                {error?.[`${form_id}-streetAddress`]?.message}
              </p>
            </div>
            <div className="span-col">
              <input
                type="text"
                placeholder="Street Address Line 2"
                className="short-answer-input"
                style={{ width: "100%" }}
                value={state.streetAddressLine2}
                {...register(`${form_id}-streetAddressLine2`, {
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, streetAddressLine2: e.target.value };
                    setState({ ...state, streetAddressLine2: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
              />

              <p className="sme-error">
                {error?.[`${form_id}-streetAddressLine2`]?.message}
              </p>
            </div>
            <div>
              <input
                type="text"
                placeholder="City"
                className="short-answer-input"
                style={{ width: "100%" }}
                value={state.city}
                {...register(`${form_id}-city`, {
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, city: e.target.value };
                    setState({ ...state, city: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
              />

              <p className="sme-error">{error?.[`${form_id}-city`]?.message}</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Region"
                className="short-answer-input"
                style={{ width: "100%" }}
                value={state.region}
                {...register(`${form_id}-region`, {
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, region: e.target.value };
                    setState({ ...state, region: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
              />

              <p className="sme-error">
                {error?.[`${form_id}-region`]?.message}
              </p>
            </div>

            <div>
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Country"
                options={options}
                {...register(`${form_id}-country`, {})}
                onChange={(e) => {
                  let temp = { ...state };
                  let countryvalue = countryList().getLabel(e.value) || e.value;
                  temp = { ...temp, country: countryvalue };
                  setState({ ...state, country: countryvalue });
                  handleOnChange(temp, index);
                }}
              />

              <p className="sme-error">
                {error?.[`${form_id}-country`]?.message}
              </p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Postal / Zip Code"
                className="short-answer-input"
                style={{ width: "100%" }}
                value={state.postalCode}
                {...register(`${form_id}-postalCode`, {
                  onChange: (e) => {
                    let temp = { ...state };
                    temp = { ...temp, postalCode: e.target.value };
                    setState({ ...state, postalCode: e.target.value });
                    handleOnChange(temp, index);
                  },
                })}
                onBlur={(event) => {
                  if (state?.country === "India") {
                    pinCodeCheck(event.target.value);
                  }
                }}
              />

              <p className="sme-error">
                {error?.[`${form_id}-postalCode`]?.message}
              </p>
            </div>
          </div>
        </div>
      );
  }
};

export default AddressInput;
