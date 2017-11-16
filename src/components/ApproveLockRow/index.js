//@flow
import React, { PureComponent } from "react";
import "./index.css";

class ApproveLockRow extends PureComponent<*> {
  props: {
    icon: *,
    name: string,
    value: *,
    unactive?: boolean,
    state?: *
  };

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
