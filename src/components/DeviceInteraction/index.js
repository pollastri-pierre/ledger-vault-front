// @flow

import React, { PureComponent } from "react";
import DeviceInteractionAnimation from "components/DeviceInteractionAnimation";
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import type { CurrentActionType } from "components/DeviceInteractionAnimation";

export type Interaction = {
  needsUserInput?: boolean,
  device?: boolean,
  responseKey: string,
  action: Object => Promise<*>
};

type Props = {
  interactions: Interaction[],
  additionnalFields: Object,
  onSuccess: Object => void,
  onError: Error => void
};

type State = {
  currentStep: number,
  currentActionType: CurrentActionType,
  needsAction: boolean
};

class DeviceInteraction extends PureComponent<Props, State> {
  state = {
    currentStep: 0,
    needsAction: false,
    currentActionType: this.props.interactions[0].device ? "device" : "server"
  };

  static defaultProps = {
    additionnalFields: {}
  };

  async componentDidMount() {
    const { interactions, additionnalFields } = this.props;
    const responses = { ...additionnalFields };
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
          needsAction: interactions[i].needsUserInput,
          currentStep: i,
          currentActionType: interactions[i].device ? "device" : "server"
        });
        responses[interactions[i].responseKey] = await interactions[i].action(
          responses
        );
      } catch (e) {
        console.error(e);
        this.props.onError(e);
        return;
      }
    }

    this.props.onSuccess(responses);
  }

  render() {
    const { interactions } = this.props;
    const { currentStep, needsAction, currentActionType } = this.state;
    return (
      <DeviceInteractionAnimation
        numberSteps={interactions.length}
        currentStep={currentStep}
        needsAction={needsAction}
        currentActionType={currentActionType}
      />
    );
  }
}

export default DeviceInteraction;
