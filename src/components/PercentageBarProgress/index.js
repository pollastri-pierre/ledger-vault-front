//@flow
import React, { PureComponent } from "react";
import "./index.css";

class PercentageBarProgress extends PureComponent<*> {
  props: {
    percentage: number,
    label: *
  };
  render() {
    const { percentage, label } = this.props;

    return (
      <div className="wrapper-percentage">
        {label}
        <div className="percentage-bar">
          <div
            className="percentage-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
}

export default PercentageBarProgress;
