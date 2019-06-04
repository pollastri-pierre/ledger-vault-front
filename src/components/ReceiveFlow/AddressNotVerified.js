// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";

import { verifyAddressFlow } from "device/interactions/hsmFlows";

import VaultButton from "components/base/Button";
import Box from "components/base/Box";
import Text from "components/base/Text";
import DeviceInteraction from "components/DeviceInteraction";
import { FaRegEye, FaHandPaper } from "react-icons/fa";
import InfoBox from "components/base/InfoBox";
import colors from "shared/colors";

import type { FreshAddress } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import type { ReceiveFlowPayload } from "./types";

type Props = {
  fresh_address: FreshAddress,
  payload: ReceiveFlowPayload,
  updatePayload: ($Shape<ReceiveFlowPayload>) => void,
  restlay: RestlayEnvironment,
};

type State = {
  verifificationInProgress: boolean,
};
class AddressNotVerified extends Component<Props, State> {
  state = {
    verifificationInProgress: false,
  };

  onSuccess = () => {
    const { updatePayload } = this.props;
    updatePayload({ isAddressVerified: true });
  };

  onError = () => {
    const { updatePayload } = this.props;
    updatePayload({ isAddressVerified: false });
  };

  verifyInProgress = () => {
    this.setState({ verifificationInProgress: true });
  };

  render() {
    const { fresh_address, payload, restlay } = this.props;
    const { selectedAccount } = payload;
    const { verifificationInProgress } = this.state;
    return (
      <Box flow={35}>
        <Box
          style={styles.hash}
          p={10}
          align="center"
          horizontal
          justify="center"
          flow={15}
        >
          <FaHandPaper size={16} color={colors.grenade} />
          <Text>{fresh_address.address}</Text>
        </Box>
        {verifificationInProgress && selectedAccount ? (
          <Box align="center">
            <DeviceInteraction
              interactions={verifyAddressFlow}
              additionalFields={{
                accountId: selectedAccount.id,
                fresh_address,
                restlay,
              }}
              onSuccess={this.onSuccess}
              onError={this.onError}
            />
          </Box>
        ) : (
          <Box horizontal flow={15}>
            <InfoBox
              type="warning"
              withIcon
              Footer={
                <VaultButton
                  type="submit"
                  variant="filled"
                  size="small"
                  IconLeft={FaRegEye}
                  onClick={this.verifyInProgress}
                >
                  <Trans i18nKey="receive:verify" />
                </VaultButton>
              }
            >
              <Text small i18nKey="receive:verify_on_device" />
            </InfoBox>
          </Box>
        )}
      </Box>
    );
  }
}

export default connectData(AddressNotVerified);

const styles = {
  hash: {
    border: `1px dashed ${colors.grenade}`,
    outline: "none",
    borderRadius: 4,
    alignSelf: "center",
  },
};
