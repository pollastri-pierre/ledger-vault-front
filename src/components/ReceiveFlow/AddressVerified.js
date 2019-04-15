// @flow

import React, { Component } from "react";

import Box from "components/base/Box";
import Text from "components/base/Text";
import { FaThumbsUp } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Copy from "components/icons/Copy";
import Recover from "components/icons/Recover";

import colors from "shared/colors";

import type { FreshAddress } from "data/types";
import type { ReceiveFlowPayload } from "./types";

type Props = {
  fresh_address: FreshAddress,
  updatePayload: ($Shape<ReceiveFlowPayload>) => void,
};
type State = {
  copied: boolean,
};

class AddressVerified extends Component<Props, State> {
  state = {
    copied: false,
  };

  componentWillUnmount() {
    if (this._timeout) clearTimeout(this._timeout);
  }

  onCopy = () => {
    this.setState({ copied: true });
    this._timeout = setTimeout(() => this.setState({ copied: false }), 1e3);
  };

  reVerify = () => {
    const { updatePayload } = this.props;
    updatePayload({ isAddressVerified: false });
  };

  _timeout: ?TimeoutID = null;

  render() {
    const { fresh_address } = this.props;
    const { copied } = this.state;
    return (
      <Box>
        <Box
          style={styles.hash}
          p={10}
          bg={colors.cream}
          align="center"
          horizontal
          justify="center"
          flow={15}
        >
          <FaThumbsUp size={16} color={colors.green} />
          {copied ? (
            <Text i18nKey="receive:address_copied" />
          ) : (
            <Text>{fresh_address.address}</Text>
          )}
        </Box>
        <Box mt={40} horizontal justify="space-between">
          <Box jujstify="center" align="center" onClick={this.reVerify}>
            <Recover size={16} color={colors.shark} />
            <Text i18nKey="receive:re_verify" />
          </Box>
          <CopyToClipboard text={fresh_address.address} onCopy={this.onCopy}>
            <Box jujstify="center" align="center">
              <Copy color={colors.shark} size={16} />
              <Text i18nKey="receive:copy" />
            </Box>
          </CopyToClipboard>
        </Box>
      </Box>
    );
  }
}

export default AddressVerified;

const styles = {
  hash: {
    border: `1px dashed ${colors.green}`,
    outline: "none",
    borderRadius: 4,
    width: 350,
  },
};
