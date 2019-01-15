// @flow
import React from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

const styles = () => ({
  textFieldInput: {
    textAlign: "right"
  }
});

type Props = {
  classes: { textFieldInput: { textAlign: string } },
  name: string,
  value: string,
  hasError: boolean,
  onChange: Function
};

function SettingsTextField(props: Props) {
  const { classes, name, value, hasError, onChange } = props;

  return (
    <TextField
      InputProps={{
        disableUnderline: true,
        classes: {
          input: classes.textFieldInput
        }
      }}
      name={name}
      value={value}
      error={hasError}
      onChange={onChange}
    />
  );
}

export default withStyles(styles)(SettingsTextField);
