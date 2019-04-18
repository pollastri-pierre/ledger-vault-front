// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import connectData from "restlay/connectData";
import FreshAddressesQuery from "api/queries/FreshAddressesQuery";

import { ModalFooterButton, ModalClose } from "components/base/Modal";

import Text from "components/base/Text";
import Box from "components/base/Box";

import colors from "shared/colors";

import type { RestlayEnvironment } from "restlay/connectData";
import type { Account } from "data/types";
import ReceiveFlowAccounts from "./ope-Accounts";
import Address from "./ope-Address";

const title = "Receive Assets";

type Props = {
  close: () => void,
  restlay: RestlayEnvironment,
};

type State = {
  selectedAccount: ?Account,
  displayQRcode: boolean,
  fresh_address: ?Object,
  verifificationInProgress: boolean,
  verified: boolean,
};

const initialState = {
  selectedAccount: null,
  displayQRcode: false,
  fresh_address: null,
  verifificationInProgress: false,
  verified: false,
};
class ReceiveFlow extends PureComponent<Props, State> {
  state: State = initialState;

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.displayQRcode !== this.state.displayQRcode &&
      this.state.displayQRcode
    ) {
      this.fetchFreshAddresses();
    }
  }

  fetchFreshAddresses = async () => {
    const { restlay } = this.props;
    const { selectedAccount } = this.state;
    if (selectedAccount) {
      const fresh_addresses = await restlay.fetchQuery(
        new FreshAddressesQuery({
          accountId: selectedAccount.id,
        }),
      );
      this.updateState({ fresh_address: fresh_addresses[0] });
    }
  };

  updateState = (patch: $Shape<State>) => this.setState({ ...patch });

  reInit = () => {
    this.setState(initialState);
  };

  render() {
    const { close } = this.props;
    const {
      selectedAccount,
      fresh_address,
      verifificationInProgress,
      verified,
    } = this.state;
    return (
      <Box
        width={700}
        style={styles.container}
        position="relative"
        {...this.props}
      >
        {close && <ModalClose onClick={close} />}
        <Box bg="#f5f5f5" style={styles.header} p={40} flow={10}>
          <Box horizontal align="center" flow={10}>
            <Text large color="#aaa">
              {title}
            </Text>
          </Box>
        </Box>
        <Box grow p={40} pb={0} style={styles.content}>
          <ReceiveFlowAccounts
            selectedAccount={selectedAccount}
            updateState={this.updateState}
            reInit={this.reInit}
          />
          {fresh_address && selectedAccount && (
            <Address
              fresh_address={fresh_address}
              verified={verified}
              verifificationInProgress={verifificationInProgress}
              selectedAccount={selectedAccount}
              updateState={this.updateState}
            />
          )}
        </Box>
        {verified && (
          <Box horizontal px={10} position="relative" style={styles.footer}>
            <FooterButton onClick={close} right color={colors.lead}>
              Done
            </FooterButton>
            <FooterButton onClick={this.reInit} left color={colors.ocean}>
              Receive Again
            </FooterButton>
          </Box>
        )}
      </Box>
    );
  }
}

export default connectData(ReceiveFlow);

const FooterButton = styled(ModalFooterButton)`
  position: absolute;
  left: ${p => (p.left ? "15px" : "auto")};
  right: ${p => (p.right ? "15px" : "auto")};
`;

const styles = {
  container: {
    minHeight: 600,
  },
  header: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    userSelect: "none",
  },
  footer: {
    height: 60,
  },
  content: {
    userSelect: "none",
  },
  qrCodeContainer: {
    backgroundColor: colors.translucentGrenade,
  },
};
