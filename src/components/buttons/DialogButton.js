//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import colors from "shared/colors";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";

// TODO: this probably shouldn't be a <button>, there are cases we would use a <Link> in children instead of a onTouchTap ?
// TODO i kinda prefer "action" instead of "onTouchTap"
// TODO : flowtype instead of proptypes
// TODO : exploding {...rest} on a DOM element is generally a bad practice
// and can accidentally leak things on the DOM (see React doc, pretty sure this is mentioned somewhere)

const styles = {
  base: {
    border: "0",
    background: "none",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    color: colors.lead,
    cursor: "pointer",
    padding: "0",
    margin: "0",
    position: "relative",
    lineHeight: "1em",
    paddingBottom: "40px",
    transition: "opacity 500ms ease",
    float: "left",
    outline: "none",
    "& a": {
      textDecoration: "none",
      color: colors.lead
    },
    "&:hover:after": {
      content: '""',
      display: "block",
      backgroundColor: colors.lead,
      width: "100%",
      height: "5px",
      marginTop: "35px",
      position: "absolute"
    }
  },
  abort: {
    color: colors.grenade,
    "&:hover:after": {
      backgroundColor: colors.grenade
    }
  },
  highlight: {
    color: colors.ocean,
    "&:hover:after": {
      backgroundColor: colors.ocean
    }
  },
  right: {
    float: "right"
  },
  disabled: {
    opacity: "0.3",
    cursor: "default",
    "&:hover:after": {
      height: 0
    }
  }
};
class DialogButton extends Component<*, *> {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.shape({}),
    children: PropTypes.node,
    highlight: PropTypes.bool,
    right: PropTypes.bool,
    disabled: PropTypes.bool,
    classes: PropTypes.object,
    abort: PropTypes.bool,
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
    const {
      highlight,
      className,
      right,
      onTouchTap,
      classes,
      abort
    } = this.props;

    return (
      <button
        data-test="dialog-button"
        className={classnames(
          classes.base,
          {
            [classes.highlight]: highlight,
            [classes.right]: right,
            [classes.abort]: abort,
            [classes.disabled]: this.props.disabled || this.state.pending
          },
          className
        )}
        disabled={
          this.props.disabled ? this.props.disabled : this.state.pending
        }
        onClick={onTouchTap ? this.onClick : null}
      >
        {this.props.children}
      </button>
    );
  }
}

export default withStyles(styles)(DialogButton);
