import React, { useState, useEffect } from "react";
import MenuIcon from "../../../../../../../assets/Icons/menuRequirements.svg";
import DeleteIcon from "../../../../../../../assets/Icons/deleteIcon-requirement.svg";
import { DatePicker, TimePicker } from "antd";
import CalanderIcon from "../../../../../../../assets/Icons/calendar.png";
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

const Date = ({ index, setInputs, deleteInputs, data }) => {
  const [menu, setMenu] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  useEffect(() => {
    if (data?.type?.options?.includeTime) {
      setMenu("IncludeTime");
    }
  }, [data]);
     const [style, setStyle] = useState(
       data?.type?.options?.style ? data?.type?.options?.style : "Style 01"
     );
     const setDescription = (editorState) => {
       const htmlData = draftToHtml(
         convertToRaw(editorState.getCurrentContent())
       );
       setInputs(htmlData, index, "date", "description");
       setEditorState(editorState);
     };

     const onChange = (date, dateString) => {
       setInputs(dateString, index, "date");
     };
     const onTimeChange = (date, dateString) => {
       setInputs(dateString, index, "date", "time");
     };

     return (
       <div>
         <p className='short-answer-p'>Date</p>

         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
           <DatePicker
             style={{
               width: "453px",
               height: "50px",
               borderRadius: "10px",
             }}
             disabled
             onChange={onChange}
             picker='day, month'
             placeholder='Day, month'
           />
           {menu === "IncludeTime" && (
             <TimePicker
               disabled
               placeholder='Time'
               style={{
                 width: "453px",
                 height: "50px",
                 borderRadius: "10px",
               }}
               onChange={onTimeChange}
             />
           )}

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
                   setInputs(true, index, "date", "time");
                   setMenu("IncludeTime");
                 }}
                 href='#'
               >
                 Include Time
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

export default Date;
