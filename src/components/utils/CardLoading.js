//@flow
import React from "react";
import CircularProgress from "material-ui/Progress/CircularProgress";

function CardLoading() {
  return (
    <div>
      <CircularProgress
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: "-20px",
          marginTop: "-20px"
        }}
      />
    </div>
  );
}

export default CardLoading;
