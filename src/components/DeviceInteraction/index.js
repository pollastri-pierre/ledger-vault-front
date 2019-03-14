// @flow
import React, { PureComponent } from "react";
import type { RestlayEnvironment } from "restlay/connectData";
import DeviceInteractionAnimation from "components/DeviceInteractionAnimation";
import connectData from "restlay/connectData";
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import type { GateError } from "data/types";

export type Interaction = {
  needsUserInput?: boolean,
  device?: boolean,
  responseKey: string,
  tooltip?: React$Node,
  action: Object => Promise<*>
};

type Props = {
  interactions: Interaction[],
  additionalFields: Object,
  restlay: RestlayEnvironment,
  onSuccess: Object => void,
  onError: (Error | GateError) => void
};

type State = {
  currentStep: number,
  interaction: Interaction
};

class DeviceInteraction extends PureComponent<Props, State> {
  state = {
    currentStep: 0,
    interaction: this.props.interactions[0]
  };

  _unmounted = false;

  static defaultProps = {
    additionalFields: {}
  };

  runInteractions = async () => {
    const { interactions, additionalFields, restlay } = this.props;
    const responses = { ...additionalFields, restlay };
    if (process.env.NODE_ENV !== "e2e" && !window.config.SOFTWARE_DEVICE) {
      // $FlowFixMe
      const transport = await LedgerTransportU2F.create();
      transport.setScrambleKey("v1+");
      transport.setUnwrap(true);
      transport.setDebugMode(true);
      responses.transport = transport;
    }
    for (let i = 0; i < interactions.length; i++) {
      try {
        this.setState({
          currentStep: i,
          interaction: interactions[i]
        });
        responses[interactions[i].responseKey] = await interactions[i].action(
          responses
        );
        if (this._unmounted) return;
      } catch (e) {
        console.error(e);
        this.props.onError(e);
        return;
      }
    }

    this.props.onSuccess(responses);
  };

  componentDidMount() {
    this.runInteractions();
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { interactions } = this.props;
    const { currentStep, interaction } = this.state;
    return (
      <DeviceInteractionAnimation
        interaction={interaction}
        numberSteps={interactions.length}
        currentStep={currentStep}
      />
    );
  }
}

export default connectData(DeviceInteraction);
