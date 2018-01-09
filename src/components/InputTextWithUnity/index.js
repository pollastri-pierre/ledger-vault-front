//@flow
import React from "react";
import { withStyles } from "material-ui/styles";
import classnames from "classnames";

const styles = {
  base: {
    position: "relative",
    display: "flex",
    "& > label": {
      position: "absolute",
      fontSize: 13,
      top: 11,
      left: 0
    },
    '& input[type="text"]': {
      width: "100%",
      display: "block",
      outline: "none",
      height: 40,
      border: 0,
      fontSize: 13,
      textAlign: "right",
      borderBottom: "1px solid #cccccc",
      marginBottom: 15
    }
  },
  valueLeft: {
    width: "100%"
  },
  unityRight: {
    fontSize: 13,
    color: "#999999",
    display: "block",
    paddingLeft: 5,
    whiteSpace: "nowrap",
    borderBottom: "1px solid #cccccc",
    height: 40,
    cursor: "pointer",
    outline: "none",
    lineHeight: "40px",
    "& strong": {
      fontWeight: "normal",
      color: "black"
    }
  }
};
function InputTextWithUnity(props: {
  children: React$Node | string,
  field: React$Node | string,
  hasError: boolean,
  label: React$Node | string,
  classes: Object
}) {
  const { children, field, hasError, label, classes } = props;
  return (
    <div className={classnames(classes.base, { [classes.error]: hasError })}>
      <label>{label}</label>
      <div className={classes.valueLeft}>{field}</div>
      <div className={classes.unityRight}>{children}</div>
    </div>
  );
}

export default withStyles(styles)(InputTextWithUnity);
