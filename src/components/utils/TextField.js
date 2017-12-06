//@flow
import React from "react";
import MUITextField from "material-ui/TextField";

import "./TextField.css";

function TextField(props) {
  const { className } = props;
  return (
    <MUITextField
      {...props}
      fullWidth
      InputProps={{
        style: { fontSize: "13px", paddingBottom: "5px" }
      }}
      className={`vlt-textfield ${props.className}`}
    />
  );
}

TextField.defaultProps = {
  className: "",
  error: false
};

export default TextField;
