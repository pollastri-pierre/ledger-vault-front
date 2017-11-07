//@flow
import React, { Component } from "react";
import "./index.css";
import ArrowDown from "../icons/ArrowDown";

class SecurityRow extends Component<*> {
  constructor() {
    super();
    this.callback = this.callback.bind(this);
  }
  props: {
    icon: *,
    label: string,
    disabled?: boolean,
    onClick?: Function,
    children: *
  };

  callback() {
    if (!this.props.disabled) {
      this.props.onClick();
    }
  }

  render() {
    const { children, icon, label, disabled, onClick } = this.props;
    return (
      <div
        className={`security-scheme-row ${disabled ? "disabled" : ""}`}
        onClick={this.callback}
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
