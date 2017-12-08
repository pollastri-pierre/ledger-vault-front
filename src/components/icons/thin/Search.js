//@flow
import React, { PureComponent } from "react";

class Search extends PureComponent<*> {
  static defaultProps = {
    color: "#000"
  };
  render() {
    const { color, ...props } = this.props;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 23.31 31.5"
        {...props}
      >
        <title>search</title>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Line">
            <line
              style={{ fill: "none", stroke: color, strokeWidth: 2 }}
              x1="22.44"
              y1="31"
              x2="15.79"
              y2="19.49"
            />
            <circle
              style={{ fill: "none", stroke: color, strokeWidth: 2 }}
              cx="10.82"
              cy="10.82"
              r="9.82"
            />
          </g>
        </g>
      </svg>
    );
  }
}

export default Search;
