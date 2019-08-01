// @flow
import React, { PureComponent } from "react";
import connectData from "restlay/connectData";

import { listen } from "@ledgerhq/logs";
import type { RestlayEnvironment } from "restlay/connectData";
import DeviceInteractionAnimation from "components/DeviceInteractionAnimation";
import { checkVersion } from "device/interactions/common";
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import type { GateError } from "data/types";

export type Interaction = {
  needsUserInput?: boolean,
  device?: boolean,
  responseKey: string,
  tooltip?: React$Node,
  action: Object => Promise<*>,
};

export type DeviceError = { statusCode: number };
type Props = {
  interactions: Interaction[],
  noCheckVersion?: boolean,
  additionalFields: Object,
  restlay: RestlayEnvironment,
  onSuccess: Object => void,
  onError: (Error | GateError | DeviceError) => void,
  light?: boolean,
};

type State = {
  currentStep: number,
  interaction: Interaction,
};

// always logs apdu for now
listen(log => console.log(`${log.type}: ${log.message ? log.message : ""}`)); // eslint-disable-line no-console

class DeviceInteraction extends PureComponent<Props, State> {
  state = {
    currentStep: 0,
    interaction: this.props.interactions[0],
  };

  _unmounted = false;

  static defaultProps = {
    additionalFields: {},
  };

  runInteractions = async () => {
    const {
      interactions,
      additionalFields,
      noCheckVersion,
      restlay,
    } = this.props;

    // always checking app version first unless opt-out by the consumer component
    const interactionsWithCheckVersion =
      noCheckVersion || localStorage.getItem("NO_CHECK_VERSION")
        ? interactions
        : [checkVersion, ...interactions];

    const responses = { ...additionalFields, restlay };
    if (
      window.FORCE_HARDWARE ||
      (process.env.NODE_ENV !== "e2e" &&
        !window.config.SOFTWARE_DEVICE &&
        localStorage.getItem("SOFTWARE_DEVICE") !== "1")
    ) {
      // $FlowFixMe
      const transport = await LedgerTransportU2F.create();
      transport.setScrambleKey("v1+");
      transport.setUnwrap(true);
      transport.setExchangeTimeout(360000);
      responses.transport = transport;
    }
    for (let i = 0; i < interactionsWithCheckVersion.length; i++) {
      try {
        this.setState({
          currentStep: i,
          interaction: interactionsWithCheckVersion[i],
        });
        responses[
          interactionsWithCheckVersion[i].responseKey
        ] = await interactionsWithCheckVersion[i].action(responses);
        if (this._unmounted) return;
      } catch (e) {
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
    const { interactions, light } = this.props;
    const { currentStep, interaction } = this.state;
    return (
      <DeviceInteractionAnimation
        light={light}
        interaction={interaction}
        numberSteps={interactions.length}
        currentStep={currentStep}
      />
    );
  }
}

export default connectData(DeviceInteraction);
