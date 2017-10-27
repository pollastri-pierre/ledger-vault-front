//@flow
import React, { Component } from 'react';
import "./DashboardField.css";

class DashboardField extends Component<*> {
  props: {
    label: *,
    children: *,
    align?: string
  };
  render() {
    const { label, children, align, ...rest } = this.props;
    return (
      <div style={{ textAlign: align }} {...rest}>
        <div className="DashboardNumber">{children}</div>
        <div className="DashboardFieldLabel uppercase">{label}</div>
      </div>
    );
  }
}

export default DashboardField;
