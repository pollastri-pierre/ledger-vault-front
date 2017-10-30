import React, { Component } from "react";
import PropTypes from "prop-types";

const classename = "modal";

class Modal extends Component {
  constructor(props) {
    super(props);

    this.handle = this.handle.bind(this);
    this.clickHandle = this.clickHandle.bind(this);
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handle);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handle);
  }

  handle(e) {
    this.props.close();
  }

  clickHandle(e) {
    if (!e.target.closest(`.${classename}`)) {
      this.props.close("esc");
    }
  }

  render() {
    return (
      <div id="blurdialog" onClick={e => this.clickHandle(e)}>
        <div id="wrapper-modal">
          <div className={classename}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  close: PropTypes.func.isRequired
};

export default Modal;
