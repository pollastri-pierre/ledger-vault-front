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
    const { label, children, align } = this.props;
    return (
      <div style={{ textAlign: align }}>
        <div>{children}</div>
        <div className="DashboardFieldLabel uppercase">{label}</div>
      </div>
    );
  }
}

export default DashboardField;
