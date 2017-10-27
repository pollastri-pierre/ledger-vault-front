//@flow
import React, { PureComponent } from 'react';
import './index.css';

class PercentageBarProgress extends PureComponent<*> {
  props: {
    percentage: number,
  };
  render() {
    const { percentage } = this.props;

    return (
      <div className="percentage-bar">
        <div
          className="percentage-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
}

export default PercentageBarProgress;
