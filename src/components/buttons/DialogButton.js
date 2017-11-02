//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";

import "./DialogButton.css";

const neverEnding: Promise<any> = new Promise(() => {});

export default class DialogButton extends Component {
  constructor() {
    super();
    this.state = {};
    this.onClick = this.onClick.bind(this);
  }

  _unmounted = false;

  onClick() {
    this.setState({ pending: true });
    Promise.resolve()
      .then(this.props.onTouchTap)
      .then(() => {
        !this._unmounted ? this.setState({ pending: false }) : false;
      });
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { highlight, right, ...other } = this.props;

    return (
      <button
        {...other}
        className={`vlt-dialog-btn ${highlight ? "highlight" : ""} ${this.props
          .className}`}
        style={{
          float: right ? "right" : "left",
          ...this.props.style
        }}
        disabled={this.state.pending}
        onTouchTap={this.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

DialogButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape({}),
  children: PropTypes.node,
  highlight: PropTypes.bool,
  right: PropTypes.bool,
  onTouchTap: PropTypes.func
};

DialogButton.defaultProps = {
  className: "",
  style: {},
  children: "",
  highlight: false,
  right: false,
  onTouchTap: () => {}
};
