import React, { useEffect, useState } from "react";
import MenuIcon from "../../../../../../../assets/Icons/menuRequirements.svg";
import DeleteIcon from "../../../../../../../assets/Icons/deleteIcon-requirement.svg";
import ArrowDown from "../../../../../../../assets/Icons/ArrowDown.png";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { convertToRaw, EditorState } from "draft-js";

const Attachment = ({ index, setInputs, deleteInputs, data }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const { allowFileTypes, fileSize, maxFiles } = data?.type?.options;
  const [style, setStyle] = useState(
    data?.type?.options?.style ? data?.type?.options?.style : "Style 01"
  );

  const typeOptions = [
    {
      checked: false,
      label: "Document",
      value: "application/msword",
    },
    {
      checked: false,
      label: "Presentation",
      value: "application/vnd.ms-powerpoint",
    },
    {
      checked: false,
      label: "Spreadsheet",
      value: "application/vnd.ms-excel",
    },
    { checked: false, label: "Drawing", value: "image/vnd.dxf" },
    { checked: false, label: "PDF", value: "application/pdf" },
    { checked: false, label: "Image", value: "image/jpeg,image/jpg,image/png" },
    { checked: false, label: "Video", value: "video/mp4" },
    { checked: false, label: "Audio", value: "audio/mpeg,audio/wav" },
  ];
  useEffect(() => {
    if (allowFileTypes) {
      const temp = allowFileTypes?.split(",");
      const resultedArray = typeOptions?.map((item) => {
        return {
          ...item,
          checked: temp?.includes(item.value) ? true : false,
        };
      });
      setFileType(resultedArray);
    } else {
      setFileType(typeOptions);
    }
  }, [allowFileTypes]);

  const [selector, setSelector] = useState("Number");
  const [menu, setMenu] = useState("");
  const [fileType, setFileType] = useState(typeOptions);
  const [open, setOpen] = useState(false);

  const setDescription = (editorState) => {
    const htmlData = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setInputs(htmlData, index, "attachment", "description");
    setEditorState(editorState);
  };

  return (
    <div>
      <p className='short-answer-p'>Attachment</p>

      <div style={{ display: "flex", gap: "10px" }}>
        <div className='select'>
          <div className='selectInputBox' onClick={() => setOpen(!open)}>
            <span className='placeholder-text'>
              {fileType?.length > 0
                ? fileType?.filter((item) => item.checked)?.length > 0
                  ? `${
                      fileType?.filter((item) => item.checked).length
                    } selected`
                  : "Allow only specific file type"
                : " Allow only specific file type"}
            </span>
            <img src={ArrowDown} className='select-arrow' />
          </div>
          {open && (
            <div className='select-optionBox'>
              {fileType?.map((option, subindex) => (
                <div className='option'>
                  <input
                    type='checkbox'
                    value={option.value}
                    checked={option.checked}
                    onChange={(event) => {
                      const temp = [...fileType];
                      temp[subindex].checked = event.target.checked;
                      setFileType(temp);
                      const filter = temp?.filter((item) => item.checked);
                      const value = filter?.map((item) => item.value);

                      setInputs(
                        value?.toString(),
                        index,
                        "attachment",
                        "allowFileTypes"
                      );
                    }}
                  />
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <select
          className='SelectorOption'
          placeholder='Maximum Number of Files'
          value={maxFiles}
          onChange={(event) => {
            setSelector(event.target.value);
            setInputs(
              event.target.value?.toString(),
              index,
              "attachment",
              "maxFiles"
            );
          }}
        >
          <option value=''>Maximum Number of Files</option>
          <option value='1'>1</option>
          <option value='5'>5</option>
          <option value='10'>10</option>
        </select>

        <select
          className='SelectorOption'
          value={fileSize}
          onChange={(event) => {
            setSelector(event.target.value);
            setInputs(
              event.target.value?.toString(),
              index,
              "attachment",
              "fileSize"
            );
          }}
        >
          <option value='Number' selected>
            Maximum file size
          </option>
          <option value='1 MB'>1 MB</option>
          <option value='10 MB'>10 MB</option>
          <option value='100 MB'>100 MB</option>
          <option value='1 GB'>1 GB</option>
          <option value='10 GB'>10 GB</option>
        </select>

        <div className='dropdown'>
          <img
            className='dropdown-toggle'
            type='button'
            id='dropdownMenuButton'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
            src={MenuIcon}
            width={"50px"}
            height={"50px"}
            alt='MenuIcon'
            style={{
              marginLeft: "20px",
            }}
          />
          <div
            className='dropdown-menu sme-menu-items'
            aria-labelledby='dropdownMenuButton'
          >
            <a
              className='menuNewRequirement'
              onClick={() => {
                setMenu("Description");
              }}
              href='#'
            >
              Description
            </a>
            <hr style={{ color: "#EAEAEA" }} />
            <a
              className='menuNewRequirement'
              onClick={() => {
                setMenu("Style");
              }}
              href='#'
            >
              Style
            </a>
          </div>
        </div>

        <img
          src={DeleteIcon}
          width={"50px"}
          height={"50px"}
          alt='DeleteIcon'
          style={{ cursor: "pointer" }}
          onClick={() => deleteInputs(index)}
        />
      </div>

      {menu === "Style" && (
        <div
          style={{
            display: "flex",
            marginTop: "20px",
          }}
        >
          <div className='menuStyle'>
            <div
              style={{
                padding: "10px",
              }}
            >
              <input
                type='radio'
                checked={style === "Style 01"}
                name='radio'
                value='Style 01'
                onChange={(event) => {
                  setInputs(event.target.value, index, "checkbox", "style");
                  setStyle("Style 01");
                }}
              />
              <label className='radioLadel-style'> Style 01 </label>
              <input
                className='requirement-question-input'
                type='text'
                placeholder='Question'
                disabled={true}
              />
            </div>
          </div>

          <div className='menuStyle2'>
            <div
              style={{
                padding: "10px",
              }}
            >
              <input
                type='radio'
                value='Style 02'
                name='radio'
                checked={style === "Style 02"}
                onChange={(event) => {
                  setInputs(event.target.value, index, "checkbox", "style");
                  setStyle("Style 02");
                }}
              />
              <label className='radioLadel-style'>Style 02 </label>

              <span className='d-flex'>
                <label style={{ marginTop: "10px" }}>Question</label>
                <input
                  className='requirement-question-input'
                  type='text'
                  disabled={true}
                />
              </span>
            </div>
          </div>

          <div className='menuStyle'>
            <div
              style={{
                padding: "10px",
              }}
            >
              <input
                type='radio'
                value='Style 03'
                checked={style === "Style 03"}
                name='radio'
                onChange={(event) => {
                  setInputs(event.target.value, index, "checkbox", "style");
                  setStyle("Style 03");
                }}
              />
              <label className='radioLadel-style'>Style 03 </label>

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
                    className='requirement-style03-input'
                    type='text'
                    placeholder='Question'
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {menu === "Description" && (
        <div className='mt-4'>
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

export default Attachment;
