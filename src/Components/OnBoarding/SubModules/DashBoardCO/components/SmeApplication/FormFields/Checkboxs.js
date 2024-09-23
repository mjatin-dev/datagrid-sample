import React, { useEffect, useState } from "react";
import MenuIcon from "../../../../../../../assets/Icons/menuRequirements.svg";
import DeleteIcon from "../../../../../../../assets/Icons/deleteIcon-requirement.svg";
import "./style.css";
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

function Checkbox({ index, setInputs, deleteInputs, data }) {
  const [menu, setMenu] = useState("");
  const [style, setStyle] = useState(
    data?.type?.options?.style ? data?.type?.options?.style : "Style 01"
  );

  useEffect(() => {
    if (data?.type?.value) {
      const temp = data?.type?.value.split(",");
      setCheckboxes(temp);
    }
    if (data?.type?.options?.responseValidation?.validation) {
      setMenu("Response-validation");
    }
  }, [data]);

  const { validation, number, customError } =
    data?.type?.options?.responseValidation;
  const [checkboxes, setCheckboxes] = useState(["", ""]);
  const [responseValidation, setResponseValidation] = useState({
    validation: validation ? validation : "",
    number: number ? number : 0,
    customError: customError ? customError : "",
  });
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const setValues = (event, checkBoxindex) => {
    const temp = [...checkboxes];
    temp[checkBoxindex] = event.target.value;
    setCheckboxes(temp);
    setInputs(temp, index, "checkbox");
  };

  const setDescription = (editorState) => {
    const htmlData = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setInputs(htmlData, index, "checkbox", "description");
    setEditorState(editorState);
  };
  return (
    <div>
      <p className="short-answer-p">Checkbox</p>

      <div className="sme-checkbox-options">
        {checkboxes?.length > 0 &&
          checkboxes?.map((item, checkBoxindex) => (
            <input
              type="text"
              id="op1"
              placeholder={`option ${checkBoxindex + 1}`}
              className="checkbox-option"
              onChange={(event) => setValues(event, checkBoxindex)}
              value={item}
              maxLength={30}
            />
          ))}
        <div>
          <button
            className="checkbox-button"
            onClick={() => {
              const temp = [...checkboxes];
              temp.push("");
              setCheckboxes(temp);
            }}
          >
            + Add Checkbox
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
              temp = { ...temp, validation: event.target.value };
              setInputs(temp, index, "checkbox", "responseValidation");
            }}
          >
            <option></option>
            <option value="Select at least">Select at least</option>
            <option value="Select at most">Select at most</option>
            <option value="Select exactly">Select exactly</option>
          </select>

          <input
            type="number"
            placeholder="Number"
            className="CustumErrorText-input"
            value={responseValidation.number}
            onChange={(event) => {
              let temp = responseValidation;
              setResponseValidation({
                ...responseValidation,
                number: event.target.value,
              });
              temp = { ...temp, number: event.target.value };
              setInputs(temp, index, "checkbox", "responseValidation");
            }}
          />

          <input
            type="text"
            placeholder="Custom error text"
            className="CustumErrorText-input"
            value={responseValidation.customError}
            onChange={(event) => {
              let temp = responseValidation;
              setResponseValidation({
                ...responseValidation,
                customError: event.target.value,
              });
              temp = { ...temp, customError: event.target.value };
              setInputs(temp, index, "checkbox", "responseValidation");
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

export default Checkbox;
