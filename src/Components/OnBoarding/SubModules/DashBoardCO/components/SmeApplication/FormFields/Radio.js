import React, { useState, useEffect } from "react";
import MenuIcon from "../../../../../../../assets/Icons/menuRequirements.svg";
import DeleteIcon from "../../../../../../../assets/Icons/deleteIcon-requirement.svg";
import "./style.css";
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

function Radio({ index, setInputs, deleteInputs, data }) {
  const [selector, setSelector] = useState("Number");
  const [menu, setMenu] = useState("");
  const [radios, setRadios] = useState(["", ""]);
  const { validation, number, customError } =
    data?.type?.options?.responseValidation;
  const [style, setStyle] = useState(
    data?.type?.options?.style ? data?.type?.options?.style : "Style 01"
  );
  useEffect(() => {
    if (data?.type?.options?.responseValidation?.validation) {
      setMenu("Response-validation");
    }
  }, [data]);
  const [responseValidation, setResponseValidation] = useState({
    validation: validation ? validation : "",
    number: number ? number : 0,
    customError: customError ? customError : "",
  });
  useEffect(() => {
    if (data?.type?.value) {
      const temp = data?.type?.value.split(",");
      setRadios(temp);
    }
  }, [data]);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const setValues = (event, checkBoxindex) => {
    const temp = [...radios];
    temp[checkBoxindex] = event.target.value;
    setRadios(temp);
    setInputs(temp, index, "radio");
  };

  const setDescription = (editorState) => {
    const htmlData = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setInputs(htmlData, index, "radio", "description");
    setEditorState(editorState);
  };

  return (
    <div>
      <p className="short-answer-p">Radio</p>

      <div className="sme-checkbox-options">
        {radios?.length > 0 &&
          radios?.map((item, radioIndex) => (
            <input
              type="text"
              id="op1"
              placeholder={`option ${radioIndex + 1}`}
              className="checkbox-option"
              onChange={(event) => setValues(event, radioIndex)}
              value={item}
              maxLength={30}
            />
          ))}
        <div>
          <button
            className="checkbox-button"
            onClick={() => {
              const temp = [...radios];
              temp.push("");
              setRadios(temp);
            }}
          >
            + Add Radio
          </button>
        </div>

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
            >
              Description
            </a>
            <hr style={{ color: "#EAEAEA" }} />

            <a
              className="menuNewRequirement"
              onClick={() => {
                setMenu("Response-validation");
              }}
            >
              Response validation
            </a>
            <hr style={{ color: "#EAEAEA" }} />

            <a
              className="menuNewRequirement"
              onClick={() => {
                setMenu("Style");
              }}
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
            gap: "10px",
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
              setInputs(temp, index, "radio", "responseValidation");
            }}
          >
            <option value="Continue to next section" selected>
              Continue to next section
            </option>
            <option value="Go to section 1">Go to section 1</option>
            <option value="Submit form">Submit form</option>
          </select>

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
              setInputs({}, index, "checkbox", "responseValidation");
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
}

export default Radio;
