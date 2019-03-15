// @flow
import React from "react";
import colors from "shared/colors";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {
    position: "relative",
  },
  textFieldInput: {
    textAlign: "right",
  },
  underline: {
    "&:before": {
      display: "none",
    },
    "&:after": {
      top: 34,
    },
  },
  error: {
    position: "absolute",
    textAlign: "center",
    bottom: -60,
    color: "white",
    borderRadius: 5,
    padding: 5,
    background: colors.grenade,
  },
};

type Props = {
  classes: { [$Keys<typeof styles>]: string },
  name: string,
  errorMessage: string,
  placeholder: string,
  value: string,
  error: boolean,
  onChange: Function,
};

function UpdateTextField(props: Props) {
  const {
    classes,
    name,
    errorMessage,
    value,
    placeholder,
    error,
    onChange,
    ...otherProps
  } = props;

  return (
    <div className={classes.base}>
      <TextField
        autoComplete="off"
        InputProps={{
          classes: {
            input: classes.textFieldInput,
            underline: classes.underline,
          },
        }}
        name={name}
        placeholder={placeholder}
        value={value}
        error={error}
        onChange={onChange}
        {...otherProps}
      />
      {error && <div className={classes.error}>{errorMessage}</div>}
    </div>
  );
}

export default withStyles(styles)(UpdateTextField);
