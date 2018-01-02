//@flow
import { withStyles } from "material-ui/styles";
import React, { PureComponent } from "react";

const styles = {
  common: {
    height: "11px",
    width: "9px"
  },
  black: {
    fill: "black"
  }
};

type Props = {
  color: string,
  classes: Object
};

class Home extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor"
  };

  render() {
    const { color, classes, ...props } = this.props;
    return (
      <svg viewBox="0 0 30 25.31" className={classes.common} {...props}>
        <path
          fill={color}
          d="M15,0,0,15.94H3.75v9.37h8V16.85h6.58v8.46h8V15.94H30Z"
        />
      </svg>
    );
  }
}
export default withStyles(styles)(Home);
