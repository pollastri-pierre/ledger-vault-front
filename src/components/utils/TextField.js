//@flow
import React from "react";
import MUITextField from "material-ui/TextField";

type Props = {
  placeholder?: string,
  value?: string,
  inputProps?: Object,
  error?: boolean,
  onChange?: (e: Object) => void,
  style?: Object,
  autofocus?: boolean,
  fullWidth?: boolean,
  inputStyle?: Object
};
function TextField(props: Props) {
  const { inputProps, ...rest } = props;
  return (
    <MUITextField
      {...rest}
      InputProps={{
        style: { fontSize: "13px", paddingBottom: "5px" },
        inputProps: props.inputProps
      }}
    />
  );
}

export default TextField;
