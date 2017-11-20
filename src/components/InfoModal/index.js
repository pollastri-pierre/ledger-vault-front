//@flow
import React, { PureComponent } from "react";
import "./index.css";

class InfoModal extends PureComponent<{
  children: React$Node | string,
  className?: string
}> {
  render() {
    const { children, className, ...rest } = this.props;

    return (
      <div className={`info-modal ${className || ""}`} {...rest}>
        {children}
      </div>
    );
  }
}

export default InfoModal;
