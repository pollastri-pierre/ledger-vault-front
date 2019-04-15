// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";

import { verifyAddressFlow } from "device/interactions/verifyAddressFlow";

import VaultButton from "components/base/Button";
import Box from "components/base/Box";
import Text from "components/base/Text";
import DeviceInteraction from "components/DeviceInteraction";
import { FaCheck, FaHandPaper } from "react-icons/fa";
import InfoBox from "components/base/InfoBox";
import colors from "shared/colors";

import type { FreshAddress } from "data/types";
import type { ReceiveFlowPayload } from "./types";

type Props = {
  fresh_address: FreshAddress,
  payload: ReceiveFlowPayload,
  updatePayload: ($Shape<ReceiveFlowPayload>) => void,
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
    const { fresh_address, payload } = this.props;
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
        {verifificationInProgress ? (
          <Box align="center">
            <DeviceInteraction
              interactions={verifyAddressFlow}
              additionalFields={{
                accountId: selectedAccount.id,
                fresh_address,
              }}
              onSuccess={this.onSuccess}
              onError={this.onError}
            />
          </Box>
        ) : (
          <Box horizontal flow={15}>
            <InfoBox type="warning" withIcon>
              <Text small i18nKey="receive:verify_on_device" />
            </InfoBox>
            <Box style={{ alignSelf: "center" }}>
              <VaultButton
                type="submit"
                size="small"
                IconLeft={FaCheck}
                onClick={this.verifyInProgress}
              >
                <Trans i18nKey="receive:verify" />
              </VaultButton>
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}

export default AddressNotVerified;

const styles = {
  hash: {
    border: `1px dashed ${colors.grenade}`,
    outline: "none",
    borderRadius: 4,
    alignSelf: "center",
  },
};
