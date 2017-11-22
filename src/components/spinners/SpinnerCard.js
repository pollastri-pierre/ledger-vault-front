// @flow
import React from "react";
import CircularProgress from "material-ui/CircularProgress";

const SpinnerCard = () => {
  return (
    <CircularProgress
      size={30}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: "-15px",
        marginTop: "-15px"
      }}
    />
  );
};

export default SpinnerCard;
