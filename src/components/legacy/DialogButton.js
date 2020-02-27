// @flow
import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import colors from "shared/colors";

class DialogButton extends Component<*, *> {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.shape({}),
    children: PropTypes.node,
    highlight: PropTypes.bool,
    right: PropTypes.bool,
    disabled: PropTypes.bool,
    abort: PropTypes.bool,
    onTouchTap: PropTypes.func,
  };

  static defaultProps = {
    className: "",
    highlight: false,
    right: false,
    onTouchTap: () => {},
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
    const { highlight, className, right, onTouchTap, abort } = this.props;
    const disabled = this.props.disabled || this.state.pending;

    return (
      <DialogButtonContainer
        data-test="dialog-button"
        className={className}
        highlight={highlight}
        right={right}
        abort={abort}
        disabled={disabled}
        onClick={onTouchTap ? this.onClick : null}
      >
        {this.props.children}
      </DialogButtonContainer>
    );
  }
}

const DialogButtonContainer = styled.button`
  border: 0;
  background: none;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${p =>
    p.abort ? colors.grenade : p.highlight ? colors.ocean : colors.lead};
  padding: 0;
  margin: 0;
  position: relative;
  line-height: 1em;
  padding-bottom: 40px;
  transition: opacity 500ms ease;
  opacity: ${p => (p.disabled ? 0.3 : 1)};
  cursor: ${p => (p.disabled ? "default" : "pointer")};
  float: ${p => (p.right ? "right" : "left")};
  outline: none;
  & a {
    text-decoration: none;
    color: ${colors.lead};
  }
  &:hover:after {
    content: "";
    display: block;
    background-color: ${p =>
      p.abort ? colors.grenade : p.highlight ? colors.ocean : colors.lead};
    width: 100%;
    height: ${p => (p.disabled ? 0 : "5px")};
    margin-top: 35px;
    position: absolute;
  }
`;

export default DialogButton;
