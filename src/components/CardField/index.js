//@flow
import React, { Component } from "react";
import "./index.css";

class CardField extends Component<*> {
  props: {
    label: *,
    children: *,
    align?: string,
    className?: string
  };
  render() {
    const { label, children, align, className } = this.props;
    return (
      <div
        className={"CardField " + (className || "")}
        style={{ textAlign: align }}
      >
        <div className="value">{children}</div>
        <div className="label">{label}</div>
      </div>
    );
  }
}

export default CardField;
