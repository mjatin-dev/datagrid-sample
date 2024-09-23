import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

const TemplateDescriptionTextEditor = ({ data, setData, isReadOnly }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const blocksFromHTML = convertFromHTML(data);
    const content = ContentState.createFromBlockArray(blocksFromHTML);
    const e_status = EditorState.createWithContent(content);
    setEditorState(e_status);
  }, [data]);
  return (
    <>
      <Editor
        editorState={editorState}
        editorClassName={styles.editorClass}
        wrapperClassName={styles.wrapperClass}
        {...(isReadOnly
          ? { readOnly: true, toolbarHidden: true }
          : {
              onBlur: () =>
                setData(
                  draftToHtml(convertToRaw(editorState.getCurrentContent()))
                ),
              toolbar: {
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
              },
              onEditorStateChange: (editorState) => setEditorState(editorState),
            })}
      />
    </>
  );
};

export default TemplateDescriptionTextEditor;
