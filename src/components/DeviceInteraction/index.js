// @flow
import React, { PureComponent } from "react";
import type { RestlayEnvironment } from "restlay/connectData";
import DeviceInteractionAnimation from "components/DeviceInteractionAnimation";
import connectData from "restlay/connectData";
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import type { CurrentActionType } from "components/DeviceInteractionAnimation";
import type { GateError } from "data/types";

export type Interaction = {
  needsUserInput?: boolean,
  device?: boolean,
  responseKey: string,
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
  currentActionType: CurrentActionType,
  needsUserInput: boolean
};

class DeviceInteraction extends PureComponent<Props, State> {
  state = {
    currentStep: 0,
    needsUserInput: false,
    currentActionType: this.props.interactions[0].device ? "device" : "server"
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
          needsUserInput: interactions[i].needsUserInput,
          currentStep: i,
          currentActionType: interactions[i].device ? "device" : "server"
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
    const { currentStep, needsUserInput, currentActionType } = this.state;
    return (
      <DeviceInteractionAnimation
        numberSteps={interactions.length}
        currentStep={currentStep}
        needsUserInput={needsUserInput}
        currentActionType={currentActionType}
      />
    );
  }
}

export default connectData(DeviceInteraction);
