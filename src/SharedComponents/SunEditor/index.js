import React from "react";
import SunEditorReact from "suneditor-react";
// Import Sun Editor's CSS File
import "suneditor/dist/css/suneditor.min.css";
const SunEditor = ({
  height = "480px",
  onChange = () => {},
  value = "",
  defaultValue = "",
  hideToolbar = false,
  readOnly = false,
}) => {
  const editableContainer =
    readOnly &&
    document.querySelector(".sun-editor .se-wrapper .se-wrapper-wysiwyg");

  if (editableContainer) editableContainer.contentEditable = "false";
  return (
    <SunEditorReact
      defaultValue={defaultValue}
      hideToolbar={hideToolbar}
      readOnly={readOnly}
      setContents={value}
      setOptions={{
        height: height,
        buttonList: [
          ["undo", "redo"],
          ["font", "fontSize", "formatBlock"],
          ["paragraphStyle", "blockquote"],
          ["bold", "underline", "italic", "strike", "subscript", "superscript"],
          ["fontColor", "hiliteColor", "textStyle"],
          ["removeFormat"],
          //   "/", // Line break
          ["outdent", "indent"],
          ["align", "horizontalRule", "list", "lineHeight"],
          ["table", "link", "image", "video", "audio" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
          /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
          //  ['fullScreen', 'showBlocks', 'codeView'],
          ["preview", "print"],
          //  ['save', 'template'],
        ],
      }}
      onChange={onChange}
    />
  );
};

export default SunEditor;
