//@flow
import React, { Component } from "react";
import ArrowDown from "../icons/ArrowDown";

class SecurityRow extends Component<{
  icon: React$Node | string,
  label: string,
  disabled?: boolean,
  onClick: Function,
  children: React$Node | string
}> {
  render() {
    const { children, icon, label, disabled, onClick } = this.props;
    return (
      <div
        className={`security-scheme-row ${disabled ? "disabled" : ""}`}
        onClick={disabled ? null : onClick}
      >
        {icon}
        <div className="security-label">{label}</div>
        <div className="security-value">{children}</div>
        <ArrowDown className="security-arrow-right" />
      </div>
    );
  }
}

export default SecurityRow;
