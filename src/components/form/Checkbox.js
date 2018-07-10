//@flow

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import classnames from "classnames";

const styles = {
  base: {
    width: "26px",
    height: "2px",
    background: colors.mouse,
    margin: "20px auto",
    position: "relative",
    display: "inline-block",
    verticalAlign: "middle",
    "& span": {
      display: "inline-block",
      width: "26px",
      height: "2px",
      background: colors.mouse,
      position: "absolute",
      left: "0",
      transition: "all 100ms ease"
    },
    "& label": {
      width: "26px",
      height: "14px",
      position: "absolute",
      left: "0",
      top: "-7px",
      cursor: "pointer",
      "&:before": {
        content: '""',
        display: "block",
        width: "14px",
        height: "14px",
        position: "absolute",
        top: "1px",
        left: "-1px",
        background: colors.mouse,
        borderRadius: "50%",
        transition: "all 100ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        boxShadow: "0 2.5px 2.5px 0 rgba(0, 0, 0, 0.05) "
      }
    },
    "& input[type=checkbox]": {
      visibility: "hidden",
      "&:checked + label:before": {
        left: "13px",
        background: colors.ocean
      },
      "&:checked + label + span": {
        background: colors.ocean
      }
    }
  }
};

type Props = {
  labelFor: string,
  checked: boolean,
  handleInputChange?: (checked: boolean) => void,
  className: string,
  classes: { [_: $Keys<typeof styles>]: string }
};

function Checkbox(props: Props) {
  const { labelFor, checked, handleInputChange, classes, className } = props;

  return (
    <div
      className={classnames(classes.base, className)}
      onClick={
        handleInputChange
          ? (e: *) => {
              e.preventDefault();
              e.stopPropagation();
              handleInputChange(e.target.checked);
            }
          : null
      }
    >
      <input type="checkbox" id={labelFor} checked={checked} />
      <label htmlFor={labelFor} />
      <span />
    </div>
  );
}

Checkbox.defaultProps = {
  checked: false
};

export default withStyles(styles)(Checkbox);
