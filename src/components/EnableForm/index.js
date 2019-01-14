// @flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "../form/Checkbox";

const styles = {
  field: {
    outline: "none",
    position: "relative",
    cursor: "pointer",
    marginBottom: "15px",
    "& label": {
      textTransform: "uppercase",
      fontSize: "11px",
      fontWeight: "600"
    }
  },
  checkbox: {
    position: "absolute",
    right: "0",
    top: "-7px"
  },
  disabled: {
    opacity: "0.4",
    pointerEvents: "none"
  }
};

type Props = {
  checked: boolean,
  toggle: Function,
  children: *,
  classes: { [_: $Keys<typeof styles>]: string }
};

class EnableForm extends PureComponent<Props> {
  focusAndToggle = () => {
    // when we enable the form, we put the focus on the first input[type="text"]
    const { checked, toggle } = this.props;

    if (!checked) {
      const inputs = document.querySelectorAll("input[type=text]");
      if (inputs) {
        inputs[0].focus();
      }
    }
    toggle();
  };

  render() {
    const { checked, toggle, children, classes } = this.props;
    return (
      <div>
        <div className={classes.field} onClick={this.focusAndToggle}>
          <label htmlFor="enable-field">Enable</label>
          <Checkbox
            className={classes.checkbox}
            checked={checked}
            handleInputChange={toggle}
            labelFor="enable-field"
          />
        </div>
        <div
          className={classnames(classes.field, {
            [classes.disabled]: !checked
          })}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(EnableForm);
