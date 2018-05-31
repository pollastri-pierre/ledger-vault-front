//@flow
import React, { Component } from "react";
const className = "modal";

class Modal extends Component<{
  children: *,
  close: Function
}> {
  componentDidMount() {
    document.addEventListener("keydown", this.handle);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handle);
  }

  handle = (e: *) => {
    if (e.keyCode === 27) {
      this.props.close();
    }
  };

  clickHandle = (e: *) => {
    if (!e.target.closest(`.${className}`)) {
      this.props.close("esc");
    }
  };

  render() {
    return (
      <div id="blurdialog" onClick={e => this.clickHandle(e)}>
        <div id="wrapper-modal">
          <div className={className}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default Modal;
