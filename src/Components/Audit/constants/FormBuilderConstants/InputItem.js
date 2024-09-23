import { v4 as uuidv4 } from "uuid";
export const inputItem = [
  {
    name: "Date Range",
    id: uuidv4(),
    label: "isDateRange",
    valueType: "date-range",
  },
  // { name: "Dropdown", id: uuidv4(), label: "", valueType: "Select" },
  // { name: "Radiobox", id: uuidv4(), label: "isRadio", valueType: "Radio" },
  {
    name: "Checkbox",
    id: uuidv4(),
    label: "isCheckbox",
    valueType: "checkbox",
  },
  {
    name: "Text Field",
    id: uuidv4(),
    label: "isRequirement",
    valueType: "text-field",
  },
  // { name: "Answer", id: uuidv4(), label: "", valueType: "answer" },
  { name: "Radio", id: uuidv4(), label: "isRadio", valueType: "radio" },
  {
    name: "Attachment",
    id: uuidv4(),
    label: "isAttached",
    valueType: "attachment",
  },
  {
    name: "Date",
    id: uuidv4(),
    label: "isDate",
    valueType: "date",
  },
];
