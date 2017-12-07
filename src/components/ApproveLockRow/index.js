//@flow
import React, { PureComponent } from "react";

class ApproveLockRow extends PureComponent<{
  icon: string | React$Node,
  name: string | React$Node,
  value: string | React$Node,
  unactive?: boolean,
  state?: string | React$Node
}> {
  render() {
    const { icon, name, value, state, unactive } = this.props;

    const currentState = unactive ? "unactive" : state;

    return (
      <div className={`approve-lock-row ${unactive ? "unactive" : ""}`}>
        <div className="approve-lock-icon">{icon}</div>
        <span className="approve-lock-name">{name}</span>
        <span className="approve-lock-value">{value}</span>
        <span className="approve-lock-state">{currentState}</span>
      </div>
    );
  }
}

export default ApproveLockRow;
