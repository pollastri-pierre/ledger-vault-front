//@flow
import React from "react";
import MUITextField from "material-ui/TextField";

import "./TextField.css";

function TextField(props: {
  className: string,
  fullWidth: boolean,
  style: Object,
  inputStyle: Object,
  underlineFocusStyle: Object,
  underlineStyle: Object,
  hintStyle: Object,
  errorStyle: Object,
  errorText: string | boolean,
  hasError: boolean
}) {
  const { hasError, ...rest } = props;

  if (!rest.errorText && hasError) {
    rest.errorText = " ";
  }

  const underlineColor = rest.errorText ? "#ea2e49" : "#cccccc";
  const fontColor = rest.errorText ? "#ea2e49" : "inherit";

  return (
    <MUITextField {...rest} className={`vlt-textfield ${props.className}`} />
  );
}

TextField.defaultProps = {
  className: "",
  fullWidth: true,
  style: {},
  inputStyle: {},
  underlineFocusStyle: {},
  underlineStyle: {},
  hintStyle: {},
  errorStyle: {},
  errorText: false,
  hasError: false
};

export default TextField;
