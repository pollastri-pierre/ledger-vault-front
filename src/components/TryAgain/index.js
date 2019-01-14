// @flow
import React, { Component } from "react";
import errorFormatter from "formatters/error";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {
    display: "block",
    textAlign: "center",
    fontSize: 14,
    padding: 40,
    cursor: "pointer",
    "& strong": {
      fontSize: "1.4em"
    },
    "& p.error": {
      opacity: 0.5,
      fontSize: "0.8em"
    }
  },
  pending: {
    opacity: 0.5
  }
};
class TryAgain extends Component<
  {
    action: () => Promise<*> | *,
    error: Error,
    classes: { [$Keys<typeof styles>]: string }
  },
  { pending: boolean }
> {
  state = {
    pending: false
  };

  _unmounted = false;

  componentWillUnmount() {
    this._unmounted = true;
  }

  onclick = (e: Event) => {
    e.preventDefault();
    const { action } = this.props;
    if (this.state.pending) return;
    this.setState({ pending: true });
    Promise.resolve()
      .then(action)
      .catch(e => e)
      .then(() => {
        if (this._unmounted) return;
        this.setState({ pending: false });
      });
  };

  render() {
    const { pending } = this.state;
    const { error, classes } = this.props;
    return (
      <div
        className={cx(classes.base, { [classes.pending]: pending })}
        onClick={this.onclick}
      >
        <p>An error occured.</p>
        <strong>Reload</strong>
        <p className="error">{errorFormatter(error)}</p>
      </div>
    );
  }
}

export default withStyles(styles)(TryAgain);
