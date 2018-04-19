//@flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";

const styles = {
  common: {
    width: 25
  }
};

type Props = { classes: Object, className?: string, color?: string };
class AddUser extends PureComponent<Props> {
  static defaultProps = {
    color: "#cccccc"
  };
  render() {
    const { classes, className } = this.props;
    return (
      <svg
        viewBox="0 0 31 25.2"
        className={classnames(classes.common, className)}
      >
        <g id="Layer_2" data-name="Layer 2">
          <g id="Line">
            <g id="User">
              <path d="M16.06,15.61a9.84,9.84,0,0,0-3.15-1.2A10.27,10.27,0,0,0,11,14.22a10,10,0,0,0-10,10H21a10,10,0,0,0-.88-4.09" />
              <circle cx="10.98" cy="7.61" r="6.61" />
            </g>
            <g id="Plus">
              <line x1="25.24" y1="10.2" x2="25.24" y2="21.73" />
              <line x1="19.48" y1="15.97" x2="31" y2="15.97" />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default withStyles(styles)(AddUser);
