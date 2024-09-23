import React, { useEffect, useState } from "react";
import MenuIcon from "../../../../../../../assets/Icons/menuRequirements.svg";
import DeleteIcon from "../../../../../../../assets/Icons/deleteIcon-requirement.svg";
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { useDebounce } from "CommonModules/helpers/custom.hooks";

const TextField = ({ index, setInputs, deleteInputs, data }) => {
  const [selector, setSelector] = useState("Number");
  const [menu, setMenu] = useState("");
  const [textField, setTextField] = useState("");
  const { validation, option, number, customError } =
    data?.type?.options?.responseValidation;
  const [responseValidation, setResponseValidation] = useState({
    validation: validation ? validation : "",
    option: option ? option : "",
    number: number ? number : 0,
    customError: customError ? customError : "",
  });
  useEffect(() => {
    if (data?.type?.options?.responseValidation?.validation) {
      setMenu("Response-validation");
    }
  }, [data]);
  const [style, setStyle] = useState(
    data?.type?.options?.style ? data?.type?.options?.style : "Style 01"
  );

  const debouncedQuery = useDebounce(responseValidation, 500);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const setDescription = (editorState) => {
    const htmlData = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setInputs(htmlData, index, "textfield", "description");
    setEditorState(editorState);
  };

  const setValues = (event) => {
    setTextField(event.target.value);
    setInputs(event.target.value, index, "textfield");
  };

  return (
    <div>
      <p className="short-answer-p">Text Field</p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="text"
          placeholder="Text Field"
          className="short-answer-input"
          style={{ width: "80%" }}
          onChange={(event) => setValues(event)}
          disabled={true}
        />

        <div className="dropdown">
          <img
            className="dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            src={MenuIcon}
            width={"50px"}
            height={"50px"}
            alt="MenuIcon"
            style={{
              marginLeft: "20px",
            }}
          />
          <div
            className="dropdown-menu sme-menu-items"
            aria-labelledby="dropdownMenuButton"
          >
            <a
              className="menuNewRequirement"
              onClick={() => {
                setMenu("Description");
              }}
              href="#"
            >
              Description
            </a>
            <hr style={{ color: "#EAEAEA" }} />

            <a
              className="menuNewRequirement"
              onClick={() => {
                setMenu("Response-validation");
              }}
              href="#"
            >
              Response validation
            </a>
            <hr style={{ color: "#EAEAEA" }} />

            <a
              className="menuNewRequirement"
              onClick={() => {
                setMenu("Style");
              }}
              href="#"
            >
              Style
            </a>
          </div>
        </div>

        <img
          src={DeleteIcon}
          width={"50px"}
          height={"50px"}
          alt="DeleteIcon"
          style={{ cursor: "pointer" }}
          onClick={() => deleteInputs(index)}
        />
      </div>

      {menu === "Response-validation" && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <select
            className="SelectorOption"
            value={responseValidation.validation}
            onChange={(event) => {
              let temp = responseValidation;

              setResponseValidation({
                ...responseValidation,
                validation: event.target.value,
              });

              temp = {
                ...temp,
                validation: event.target.value,
              };
              setInputs(temp, index, "textfield", "responseValidation");
            }}
          >
            <option></option>
            <option value="Length">Length</option>
            <option value="Regular expression">Regular expression</option>
          </select>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginLeft: "15px",
            }}
          >
            {responseValidation.validation === "Length" && (
              <select
                className="SelectorOption"
                value={responseValidation.option}
                onChange={(event) => {
                  let temp = responseValidation;

                  setResponseValidation({
                    ...responseValidation,
                    option: event.target.value,
                  });

                  temp = {
                    ...temp,
                    option: event.target.value,
                  };

                  setInputs(temp, index, "textfield", "responseValidation");
                }}
              >
                <option></option>
                <option value="Maximum character count">
                  Maximum character count
                </option>
                <option value="Minimum character count">
                  Minimum character count
                </option>
              </select>
            )}

            {responseValidation.validation === "Regular expression" && (
              <select
                className="SelectorOption"
                value={responseValidation.option}
                onChange={(event) => {
                  let temp = responseValidation;

                  setResponseValidation({
                    ...responseValidation,
                    option: event.target.value,
                  });

                  temp = {
                    ...temp,
                    option: event.target.value,
                  };

                  setInputs(temp, index, "textfield", "responseValidation");
                }}
              >
                <option></option>
                <option value="Contains">Contains</option>
                <option value="Doesn’t contains">Doesn’t contains</option>
                <option value="Matches">Matches</option>
                <option value="Doesn’t matches">Doesn’t matches</option>
              </select>
            )}

            <input
              type="text"
              placeholder="Number"
              value={responseValidation.number}
              className="patternInputDiv"
              onChange={(event) => {
                let temp = responseValidation;

                setResponseValidation({
                  ...responseValidation,
                  number: event.target.value,
                });

                temp = {
                  ...temp,
                  number: event.target.value,
                };

                setInputs(temp, index, "textfield", "responseValidation");
              }}
            />
          </div>

          <input
            type="text"
            placeholder="Custom error text"
            className="CustumErrorText-input"
            value={responseValidation.customError}
            onChange={(event) => {
              setResponseValidation({
                ...responseValidation,
                customError: event.target.value,
              });

              setTimeout(() => {
                setInputs(
                  {
                    ...responseValidation,
                    customError: event.target.value,
                  },
                  index,
                  "price",
                  "responseValidation"
                );
              }, 500);
            }}
          />
          <img
            src={DeleteIcon}
            width={"50px"}
            height={"50px"}
            alt="DeleteIcon"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setResponseValidation({
                ...responseValidation,
                validation: "",
                number: 0,
                customError: "",
              });
              setInputs({}, index, "textfield", "responseValidation");
            }}
          />
        </div>
      )}

      {menu === "Style" && (
        <div
          style={{
            display: "flex",
            marginTop: "20px",
          }}
        >
          <div className="menuStyle">
            <div
              style={{
                padding: "10px",
              }}
            >
              <input
                type="radio"
                checked={style === "Style 01"}
                name="radio"
                value="Style 01"
                onChange={(event) => {
                  setInputs(event.target.value, index, "checkbox", "style");
                  setStyle("Style 01");
                }}
              />
              <label className="radioLadel-style"> Style 01 </label>
              <input
                className="requirement-question-input"
                type="text"
                placeholder="Question"
                disabled={true}
              />
            </div>
          </div>

          <div className="menuStyle2">
            <div
              style={{
                padding: "10px",
              }}
            >
              <input
                type="radio"
                value="Style 02"
                name="radio"
                checked={style === "Style 02"}
                onChange={(event) => {
                  setInputs(event.target.value, index, "checkbox", "style");
                  setStyle("Style 02");
                }}
              />
              <label className="radioLadel-style">Style 02 </label>

              <span className="d-flex">
                <label style={{ marginTop: "10px" }}>Question</label>
                <input
                  className="requirement-question-input"
                  type="text"
                  disabled={true}
                />
              </span>
            </div>
          </div>

          <div className="menuStyle">
            <div
              style={{
                padding: "10px",
              }}
            >
              <input
                type="radio"
                value="Style 03"
                checked={style === "Style 03"}
                name="radio"
                onChange={(event) => {
                  setInputs(event.target.value, index, "checkbox", "style");
                  setStyle("Style 03");
                }}
              />
              <label className="radioLadel-style">Style 03 </label>

              <div
                style={{
                  borderRadius: "10px",
                  border: "1px solid #E2E2E2",
                  backgroundColor: "white",
                }}
              >
                <div style={{ padding: "5px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      margin: "0px",
                      fontWeight: "400",
                    }}
                  >
                    Question
                  </p>
                  <input
                    className="requirement-style03-input"
                    type="text"
                    placeholder="Question"
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {menu === "Description" && (
        <div className="mt-4">
          {" "}
          <Editor
            editorState={editorState}
            onEditorStateChange={(editorState) => {
              setDescription(editorState);
            }}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "fontFamily",
                "list",
                "textAlign",
                "link",
                "remove",
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TextField;
