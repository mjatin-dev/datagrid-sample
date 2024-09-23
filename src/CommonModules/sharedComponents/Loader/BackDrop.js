import React from "react";

import Backdrop from "@mui/material/Backdrop";
import Loading from ".";
import Dots from "./Dots";

const BackDrop = ({ isLoading = false }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <Dots />
    </Backdrop>
  );
};

export default BackDrop;
