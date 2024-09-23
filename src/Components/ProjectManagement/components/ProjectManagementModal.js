import { IconButton } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { MdClose } from "react-icons/md";
// import { useOuterClick } from "../../OnBording/SubModules/DashBoardCO/components/RightSideGrid/outerClick";
const ProjectManagementModal = ({
  visible,
  onClose,
  children,
  isNotCloseable,
  wrapperClass,
  containerClass,
  closeButtonClass,
  closeByOuterClick = true,
  title=""
}) => {
  const escPressListener = useCallback((event) => {
    if (event.keyCode === 27) {
      onClose();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escPressListener);

    return () => document.removeEventListener("keydown", escPressListener);
  }, [escPressListener]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [visible]);
  return visible ? (
    <div
      onClick={closeByOuterClick ? onClose : () => {}}
      className={`project-management__modal-wrapper ${wrapperClass || ""}`}
      style={{
        ...(!visible && {
          zIndex: -1,
          opacity: 0,
          pointerEvents: "none",
          display: "none",
          height: "0",
          width: "0",
        }),
      }}
    >
      <div
        className={`project-management__small-modal ${containerClass || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title}
        {!isNotCloseable && (
          <div
            className={`project-management__modal-close-btn ${
              closeButtonClass || ""
            }`}
          >
            <IconButton disableTouchRipple={true} onClick={onClose}>
              <MdClose />
            </IconButton>
          </div>
        )}

        {children}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ProjectManagementModal;
