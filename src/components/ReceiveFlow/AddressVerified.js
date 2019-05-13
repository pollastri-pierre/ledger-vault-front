// @flow

import React, { Component } from "react";

import Box from "components/base/Box";
import Text from "components/base/Text";
import Copy from "components/base/Copy";
import Recover from "components/icons/Recover";

import colors from "shared/colors";

import type { FreshAddress } from "data/types";
import type { ReceiveFlowPayload } from "./types";

type Props = {
  fresh_address: FreshAddress,
  updatePayload: ($Shape<ReceiveFlowPayload>) => void,
};

class AddressVerified extends Component<Props> {
  reVerify = () => {
    const { updatePayload } = this.props;
    updatePayload({ isAddressVerified: false });
  };

  render() {
    const { fresh_address } = this.props;
    return (
      <Box>
        <Copy text={fresh_address.address} />
        <Box mt={40} horizontal justify="space-between">
          <Box align="center" onClick={this.reVerify}>
            <Recover size={16} color={colors.shark} />
            <Text i18nKey="receive:re_verify" />
          </Box>
        </Box>
      </Box>
    );
  }
}

export default AddressVerified;
