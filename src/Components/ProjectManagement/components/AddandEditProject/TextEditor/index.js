import React, { useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "./style.css";
import { projectToolbarConfig } from "CommonModules/Utils/text-editor-toolbar-config";
function TextEditor({
  values,
  setValues,
  editValue,
  readOnly = false,
  valueKey,
  toolbar = null,
  editorClassName = "",
}) {
  const [editorState, setEditorState] = React.useState(() => {
    EditorState.createEmpty();
  });

  const handleChange = (rawDraftContentState) => {
    const data = draftToHtml(
      convertToRaw(rawDraftContentState.getCurrentContent())
    );
    setValues({
      ...values,
      [valueKey]: data,
    });
  };
  useEffect(() => {
    if (editValue) {
      const blocksFromHTML = convertFromHTML(editValue);
      const content = ContentState.createFromBlockArray(blocksFromHTML);
      const e_status = EditorState.createWithContent(content);
      setEditorState(e_status);
    }
  }, [editValue]);
  return (
    <div>
      <Editor
        readOnly={readOnly}
        editorClassName={`add-project-editor-box ${editorClassName}`}
        toolbarClassName="add-project-text-editor"
        wrapperClassName="add-project-tex-editor-wrapper"
        editorState={editorState}
        onEditorStateChange={(editorState) => {
          setEditorState(editorState);
          handleChange(editorState);
        }}
        toolbar={toolbar || projectToolbarConfig}
      />
    </div>
  );
}

export default TextEditor;
