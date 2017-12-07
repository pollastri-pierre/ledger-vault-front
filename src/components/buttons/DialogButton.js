//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";

// TODO: this probably shouldn't be a <button>, there are cases we would use a <Link> in children instead of a onTouchTap ?
// TODO i kinda prefer "action" instead of "onTouchTap"
// TODO : flowtype instead of proptypes
// TODO : exploding {...rest} on a DOM element is generally a bad practice
// and can accidentally leak things on the DOM (see React doc, pretty sure this is mentioned somewhere)

export default class DialogButton extends Component<*, *> {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.shape({}),
    children: PropTypes.node,
    highlight: PropTypes.bool,
    right: PropTypes.bool,
    disabled: PropTypes.bool,
    onTouchTap: PropTypes.func
  };
  static defaultProps = {
    className: "",
    highlight: false,
    right: false,
    onTouchTap: () => {}
  };

  state = {};
  _unmounted = false;

  onClick = () => {
    this.setState({ pending: true });
    Promise.resolve()
      .then(this.props.onTouchTap)
      .catch(e => e)
      .then(() => {
        if (this._unmounted) return;
        this.setState({ pending: false });
      });
  };

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { highlight, right, onTouchTap, ...other } = this.props;

    return (
      <button
        {...other}
        className={`vlt-dialog-btn ${highlight ? "highlight" : ""} ${this.props
          .className}`}
        style={{
          float: right ? "right" : "left",
          ...this.props.style
        }}
        disabled={
          this.props.disabled ? this.props.disabled : this.state.pending
        }
        onTouchTap={onTouchTap ? this.onClick : null}
      >
        {this.props.children}
      </button>
    );
  }
}
