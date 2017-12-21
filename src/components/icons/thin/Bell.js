//@flow
<<<<<<< HEAD
import React from "react";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";

const styles = {
  common: {
    height: "13px",
    width: "16px"
  },
  white: {
    fill: "white"
  }
};
function Bell({ classes, type }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28.77 32"
      className={classnames(classes.common, classes[type])}
    >
      <title>bell</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Line">
          <path
            id="Bell"
            d="M23.51,20.05V12.76A9.12,9.12,0,0,0,17,4a2.59,2.59,0,0,0,0-.4,2.61,2.61,0,1,0-5.22,0,2.59,2.59,0,0,0,0,.4,9.12,9.12,0,0,0-6.55,8.75v7.29l-3.65,7.3h8.3a4.56,4.56,0,0,0,8.94,0h8.3Z"
          />
        </g>
      </g>
    </svg>
  );
}

export default withStyles(styles)(Bell);
=======
import React, { PureComponent } from "react";

type Props = { color: string };

export default class Bell extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor"
  };

  render() {
    const { color, ...props } = this.props;
    const style = {
      fill: "none",
      stroke: color,
      strokeMiterlimit: "10",
      strokeWidth: "2px"
    };

    return (
      <svg viewBox="0 0 28.77 32" {...props}>
        <path
          style={style}
          d="M23.51,20.05V12.76A9.12,9.12,0,0,0,17,4a2.59,2.59,0,0,0,0-.4,2.61,2.61,0,1,0-5.22,0,2.59,2.59,0,0,0,0,.4,9.12,9.12,0,0,0-6.55,8.75v7.29l-3.65,7.3h8.3a4.56,4.56,0,0,0,8.94,0h8.3Z"
        />
      </svg>
    );
  }
}
>>>>>>> develop
