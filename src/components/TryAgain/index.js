//@flow
import React, { Component } from "react";
import errorFormatter from "../../formatters/error";

class TryAgain extends Component<
  {
    action: () => Promise<*> | *,
    error: Error
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
    const { error } = this.props;
    return (
      <div
        className={["TryAgain", pending ? "pending" : ""].join(" ")}
        onClick={this.onclick}
      >
        <p>An error occured.</p>
        <strong>Reload</strong>
        <p className="error">{errorFormatter(error)}</p>
      </div>
    );
  }
}

export default TryAgain;
