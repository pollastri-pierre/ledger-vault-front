//@flow
import React, { PureComponent } from "react";

class PercentageBarProgress extends PureComponent<{
  percentage: number,
  label: string | React$Node
}> {
  render() {
    const { percentage, label } = this.props;

    return (
      <div className="wrapper-percentage">
        {label}
        <div className="percentage-bar">
          <div
            className="percentage-bar-fill"
            style={{ width: `${100 * percentage}%` }}
          />
        </div>
      </div>
    );
  }
}

export default PercentageBarProgress;
