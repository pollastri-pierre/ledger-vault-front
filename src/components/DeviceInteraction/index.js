// @flow
import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import { withRouter } from "react-router";
import type { MemoryHistory } from "history";
import {
  withDevicePolling,
  genericCanRetryOnError,
} from "@ledgerhq/live-common/lib/hw/deviceAccess";

import { listen } from "@ledgerhq/logs";
import type { RestlayEnvironment } from "restlay/connectData";
import { OutOfDateApp, WebUSBUnsupported, remapError } from "utils/errors";
import DeviceInteractionAnimation from "components/DeviceInteractionAnimation";
import { checkVersion, getU2FPublicKey } from "device/interactions/common";
import { INVALID_DATA, DEVICE_REJECT_ERROR_CODE } from "device";
import { softwareMode } from "device/interface";
import { from } from "rxjs";
import type { GateError } from "data/types";

export type Interaction = {
  needsUserInput?: boolean,
  device?: boolean,
  responseKey: string,
  tooltip?: React$Node,
  action: Object => Promise<*>,
};

export type DeviceError = { statusCode: number };
export type DeviceInteractionError = Error | GateError | DeviceError;
type Props = {
  history: MemoryHistory,
  interactions: Interaction[],
  noCheckVersion?: boolean,
  additionalFields: Object,
  restlay: RestlayEnvironment,
  onSuccess: Object => void,
  onError: (DeviceInteractionError, Object) => void,
  light?: boolean,
};

type State = {
  currentStep: number,
  interaction: Interaction,
};

// always logs apdu for now
listen(log => console.log(`${log.type}: ${log.message ? log.message : ""}`)); // eslint-disable-line no-console

const DO_NOT_RETRY = [INVALID_DATA, DEVICE_REJECT_ERROR_CODE];

class DeviceInteraction extends PureComponent<Props, State> {
  state = {
    currentStep: 0,
    interaction: this.props.interactions[0],
  };

  _unmounted = false;

  static defaultProps = {
    additionalFields: {},
  };

  shouldRetry = e => {
    if (e instanceof OutOfDateApp) return false;
    if (softwareMode()) return false;
    // $FlowFixMe
    return DO_NOT_RETRY.indexOf(e.statusCode) === -1;
  };

  runInteractions = async () => {
    const {
      interactions,
      additionalFields,
      noCheckVersion,
      restlay,
      history,
    } = this.props;

    // always checking app version first unless opt-out by the consumer component
    // always ask for u2f_pubkey to be sure user has opened vault app
    const interactionsWithCheckVersion =
      noCheckVersion || localStorage.getItem("NO_CHECK_VERSION")
        ? [getU2FPublicKey, ...interactions]
        : [getU2FPublicKey, checkVersion, ...interactions];

    const responses = { ...additionalFields, restlay };

    for (let i = 0; i < interactionsWithCheckVersion.length; i++) {
      try {
        this.setState({
          currentStep: i,
          interaction: interactionsWithCheckVersion[i],
        });
        if (interactionsWithCheckVersion[i].device) {
          const ensureAppVault = withDevicePolling("")(
            transport =>
              from(
                interactionsWithCheckVersion[i].action({
                  ...responses,
                  transport,
                }),
              ),
            e =>
              !this._unmounted &&
              this.shouldRetry(e) &&
              genericCanRetryOnError(e),
          );
          responses[
            interactionsWithCheckVersion[i].responseKey
          ] = await ensureAppVault.toPromise();
        } else {
          responses[
            interactionsWithCheckVersion[i].responseKey
          ] = await interactionsWithCheckVersion[i].action(responses);
        }
        if (this._unmounted) return;
      } catch (e) {
        const err = remapError(e);
        if (err instanceof OutOfDateApp || err instanceof WebUSBUnsupported) {
          history.push(`/update-app?redirectTo=${location.pathname}`);
        } else {
          this.props.onError(err, responses);
        }
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

export default connectData(withRouter(DeviceInteraction));
