// @flow
import React from "react";

import Spinner from "components/base/Spinner";

function CardLoading() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: "-20px",
        marginTop: "-20px",
      }}
    >
      <Spinner />
    </div>
  );
}

export default CardLoading;
