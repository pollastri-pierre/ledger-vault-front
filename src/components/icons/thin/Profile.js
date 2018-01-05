//@flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";

const styles = {
  base: {
    width: "15px"
  }
};

type Props = {
  color: string,
  classes: Object,
  className?: string
};

class Profile extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor"
  };

  render() {
    const { color, classes, className, ...props } = this.props;
    const style = {
      fill: "none",
      stroke: color,
      strokeMiterlimit: "10",
      strokeWidth: "2px"
    };

    return (
      <svg
        viewBox="0 0 27.8 32"
        {...props}
        className={classnames(classes.base, className)}
      >
        <path
          d="M13.9,18.1A12.9,12.9,0,0,0,1,31H26.8A12.9,12.9,0,0,0,13.9,18.1Z"
          style={style}
        />
        <circle cx="13.9" cy="9.55" r="8.55" style={style} />
      </svg>
    );
  }
}
export default withStyles(styles)(Profile);
