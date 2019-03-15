// @flow
import React, { Component } from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { translate } from "react-i18next";

import type { Account } from "data/types";

import createDevice, { U2F_PATH, U2F_TIMEOUT } from "device";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";

import ModalLoading from "components/ModalLoading";
import { ModalBody, ModalHeader, ModalTitle } from "components/base/Modal";

import ReceiveAccounts from "./Accounts";
import ReceiveDevice from "./Device";
import ReceiveAddress from "./Address";

const tabTitles = ["1. Account", "2. Device", "3. Receive"];

type Props = {
  accounts: Account[],
  close: Function,
};

type State = {
  index: number,
  device: boolean,
  verified: boolean,
  error: boolean,
  selectedAccount: ?Account,
};

let _isMounted = false;

class Receive extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      device: false,
      error: true,
      verified: false,
      selectedAccount: null,
    };
  }

  componentDidMount() {
    _isMounted = true;
  }

  componentDidUpdate() {
    if (this.state.selectedAccount && this.state.index === 1) {
      this.isOnVaultApp();
    }
  }

  componentWillUnmount() {
    _isMounted = false;
  }

  onTabChange = (e, index: number) => {
    this.setState({ index });
  };

  checkAgain = () => {
    this.setState({ verified: false, error: false, device: false, index: 1 });
  };

  onSelectAccount = (selectedAccount: ?Account) => {
    this.setState(prev => ({
      ...prev,
      index: 1,
      selectedAccount,
    }));
  };

  isDisabled = (i: number) => {
    switch (i) {
      case 0:
        return false;
      case 1:
        return this.state.selectedAccount === null;
      case 2:
        return (
          this.state.selectedAccount === null || this.state.device === false
        );
    }
  };

  // we just peform a getPubKey to know if user has opened the app
  isOnVaultApp = async () => {
    const { selectedAccount } = this.state;
    if (_isMounted && selectedAccount) {
      try {
        const device = await createDevice();
        await device.getPublicKey(U2F_PATH, false);
        this.setState({ device: true, index: 2 });
      } catch (error) {
        console.error(error);
        if (error && error.id === U2F_TIMEOUT) {
          this.isOnVaultApp();
        }
      }
    }
  };

  render() {
    const { accounts, close } = this.props;
    const { index, selectedAccount, verified, error } = this.state;
    return (
      <ModalBody height={615} onClose={close}>
        <ModalHeader>
          <ModalTitle>Receive Address</ModalTitle>
          <Tabs
            indicatorColor="primary"
            value={index}
            onChange={this.onTabChange}
          >
            {tabTitles.map((title, i) => (
              <Tab
                key={i} // eslint-disable-line react/no-array-index-key
                label={title}
                disabled={this.isDisabled(i)}
                disableRipple
              />
            ))}
          </Tabs>
        </ModalHeader>

        {index === 0 && (
          <ReceiveAccounts
            accounts={accounts}
            onSelect={this.onSelectAccount}
            selectedAccount={selectedAccount}
          />
        )}
        {index === 1 && <ReceiveDevice />}
        {index === 2 && (
          <ReceiveAddress
            verified={verified}
            error={error}
            account={selectedAccount}
            checkAgain={this.checkAgain}
          />
        )}
      </ModalBody>
    );
  }
}

export default connectData(translate()(Receive), {
  RenderLoading: ModalLoading,
  queries: {
    accounts: AccountsQuery,
  },
});
