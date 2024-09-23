import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Popup, { ToolbarItem, Position } from "devextreme-react/popup";
import List from "devextreme-react/list";
import { toast } from "react-toastify";
import { dashboardColumns } from "CommonModules/sharedComponents/constants/constant";

export default function CustomColumnChooser(props) {
  const {
    container,
    button,
    visible,
    columns,
    onHiding,
    onApply,
    SaveDefaultColview,
  } = props;

  const listRef = useRef(null);

  const onPopupHiding = useCallback(() => {
    onHiding();
  }, [onHiding]);

  const columnsList = useMemo(() => {
    return columns?.map((column) => ({
      ...column,
      key: captionize(column.dataField),
    }));
  }, [columns]);

  const [selectedItems, setSelectedItems] = useState(
    columns
      ?.filter((column) => column.is_visible)
      ?.map((column) => captionize(column.dataField))
  );

  useEffect(() => {
    setSelectedItems(
      columns
        ?.filter((column) => column.is_visible)
        ?.map((column) => captionize(column.dataField))
    );
  }, [columns, setSelectedItems]);

  const onSelectionChanged = useCallback(
    (e) => {
      setSelectedItems(
        e.component.option("selectedItems").map((item) => item.key)
      );
      const _selectedItems =
        listRef.current.instance
          .option("selectedItems")
          ?.map((item) => item.key) || [];
      const updatedColumns = [];
      columns.forEach((col) => {
        updatedColumns.push({
          ...col,
          is_visible:
            _selectedItems?.length > 0
              ? _selectedItems?.includes(captionize(col.dataField))
              : false,
        });
      });

      onApply(updatedColumns);
    },
    [setSelectedItems, columns, onApply]
  );

  const applyButtonOptions = useMemo(() => {
    return {
      text: "Save as Default View",
      onClick: () => {
        const _selectedItems =
          listRef.current.instance
            .option("selectedItems")
            ?.map((item) => item.key) || [];
        if (_selectedItems.length === 0) {
          toast.error("Please select any column");
          return "";
        }

        let changes = [];
        columns.forEach((column) => {
          var isSelected = _selectedItems.includes(
            captionize(column.dataField)
          );
          changes.push({
            ...column,
            is_visible: isSelected,
          });
        });
        onApply(changes);
        onHiding();
        SaveDefaultColview();
      },
    };
  }, [listRef, columns, onApply, SaveDefaultColview, onHiding]);

  const cancelButtonOptions = useMemo(() => {
    return {
      text: "Close",
      onClick: () => {
        setSelectedItems(
          columns
            .filter((column) => column.is_visible)
            .map((column) => captionize(column.dataField))
        );
        onHiding();
      },
    };
  }, [columns, onHiding, setSelectedItems]);

  return (
    <Popup
      container={container}
      title="Column Chooser"
      width={350}
      height={380}
      style={{ transform: "translate(1220px, -221px)" }}
      resizeEnabled={false}
      shading={false}
      showCloseButton={false}
      dragEnabled={false}
      closeOnOutsideClick={true}
      visible={visible}
      onHiding={onPopupHiding}
      id="custom-column-chooser"
    >
      <Position
        at="right middle"
        my="right top"
        of={`${container} ${button}`}
      />

      <List
        ref={listRef}
        keyExpr="key"
        items={columnsList}
        searchEnabled={false}
        displayExpr="key"
        selectionMode="all"
        showSelectionControls={true}
        // selectedItems={selectedItems}
        selectedItemKeys={selectedItems}
        onSelectionChanged={onSelectionChanged}
      />

      <ToolbarItem
        widget="dxButton"
        location="after"
        toolbar="bottom"
        options={applyButtonOptions}
      />

      <ToolbarItem
        widget="dxButton"
        location="after"
        toolbar="bottom"
        options={cancelButtonOptions}
      />
    </Popup>
  );
}

const DIGIT_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function captionize(name) {
  name = dashboardColumns[name];
  const captionList = [];
  let i;
  let char;
  let isPrevCharNewWord = false;
  let isNewWord = false;

  for (i = 0; i < name?.length; i++) {
    char = name.charAt(i);
    isNewWord =
      (char === char.toUpperCase() &&
        char !== "-" &&
        char !== ")" &&
        char !== "/") ||
      char in DIGIT_CHARS;
    if (char === "_" || char === ".") {
      char = " ";
      isNewWord = true;
    } else if (i === 0) {
      char = char.toUpperCase();
      isNewWord = true;
    } else if (!isPrevCharNewWord && isNewWord) {
      if (captionList.length > 0) {
        captionList.push(" ");
      }
    }
    captionList.push(char);
    isPrevCharNewWord = isNewWord;
  }
  return captionList.join("");
}
