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
    <MUITextField
      {...rest}
      className={`vlt-textfield ${props.className}`}
      fullWidth={props.fullWidth}
      style={{
        fontSize: "inherit",
        height: "initial",
        lineHeight: "initial",
        ...props.style
      }}
      inputStyle={{
        fontSize: "inherit",
        color: fontColor,
        ...props.inputStyle
      }}
      underlineFocusStyle={{
        borderBottom: `1px solid ${underlineColor}`,
        bottom: 0,
        ...props.underlineFocusStyle
      }}
      underlineStyle={{
        borderColor: "#eeeeee",
        bottom: 0,
        ...props.underlineStyle
      }}
      hintStyle={{
        fontSize: "inherit",
        bottom: "initial",
        ...props.hintStyle
      }}
      errorStyle={{
        color: "#ea2e49",
        ...props.errorStyle
      }}
    />
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
