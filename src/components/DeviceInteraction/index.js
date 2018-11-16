//@flow
import React, { Component } from "react";
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import createDevice from "device";

export type App = "B0L0S" | "v1+";

type State = {
  app: ?App,
  error: boolean
};

type Props = { children: * };

let intervalId;
class DeviceInteraction extends Component<Props, State> {
  state: State = {
    app: null,
    error: false,
    response: null
  };
  interval = null;
  _unmounted = false;

  getCurrentlyOpenApplication = async () => {
    if (!this._unmounted) {
      try {
        const device = await createDevice("\0", false);
        const scrambleKey = await device.getScrambleKey();
        if (!this._unmounted) {
          this.setState(prevState => ({ ...prevState, app: scrambleKey }));
        }
      } catch (error) {
        if (!this._unmounted) {
          if (error && error.id === U2F_TIMEOUT) {
            // timeout we retry
            this.getCurrentlyOpenApplication();
          }
          this.setState(prevState => ({
            ...prevState,
            app: null,
            error: true
          }));
        }
      }
    }
  };

  componentWillUnmount() {
    this._unmounted = true;
  }

  async componentDidMount() {
    this.getCurrentlyOpenApplication();
  }

  render() {
    return <div>{this.props.children(this.state)}</div>;
  }
}

export default DeviceInteraction;
