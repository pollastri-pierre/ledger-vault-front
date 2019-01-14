import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const SpinnerAccounts = () => (
  <CircularProgress
    size={25}
    style={{
      position: "absolute",
      top: "50px",
      left: "40px"
    }}
  />
);

export default SpinnerAccounts;
