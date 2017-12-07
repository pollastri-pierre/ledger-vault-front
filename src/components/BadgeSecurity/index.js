//@flow
import React, { PureComponent } from "react";

class BadgeSecurity extends PureComponent<{
  icon: string | React$Node,
  label: string,
  value: string | React$Node,
  disabled?: boolean
}> {
  render() {
    const { icon, label, value, disabled } = this.props;
    return (
      <div className={`badge-security ${disabled ? "disabled" : ""}`}>
        <div className="security-icon">{icon}</div>
        <span className="security-title">{label}</span>
        {disabled ? (
          <span className="security-value">disabled</span>
        ) : (
          <span className="security-value">{value}</span>
        )}
      </div>
    );
  }
}

export default BadgeSecurity;
