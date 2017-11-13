//@flow
import React, { PureComponent } from "react";
import "./index.css";

class BadgeSecurity extends PureComponent<*> {
  props: {
    icon: string | React$Element<*>,
    label: string,
    value: string | React$Element<*>,
    disabled: boolean
  };

  render() {
    const { icon, label, value, disabled } = this.props;
    return (
      <div className={`badge-security ${disabled ? "disabled" : ""}`}>
        <div className="security-icon">{icon}</div>
        <span className="security-title">{label}</span>
        <span className="security-value">{value}</span>
      </div>
    );
  }
}

export default BadgeSecurity;
