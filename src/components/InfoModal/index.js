//@flow
import React, { PureComponent } from "react";
import "./index.css";

class InfoModal extends PureComponent<*> {
  props: {
    children: *
  };
  render() {
    const { children } = this.props;

    return <div className="info-modal">{children}</div>;
  }
}

export default InfoModal;
