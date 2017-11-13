//@flow
import React, { PureComponent } from "react";
import "./index.css";

class InfoModal extends PureComponent<*> {
  props: {
    children: *,
    className: *
  };
  render() {
    const { children, className, ...rest } = this.props;

    return (
      <div className={`info-modal ${className}`} {...rest}>
        {children}
      </div>
    );
  }
}

export default InfoModal;
