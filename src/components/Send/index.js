// @flow
import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { translate } from "react-i18next";

import type { Account } from "data/types";
import connectData from "restlay/connectData";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";
import { getBridgeForCurrency } from "bridge";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";

import DeviceAuthenticate from "components/DeviceAuthenticate";
import { ModalBody, ModalHeader, ModalTitle } from "components/base/Modal";
import ModalLoading from "components/ModalLoading";

import SendAccount from "./01-Account";
import SendDetails from "./02-Details";
import SendLabel from "./03-Label";
import SendConfirmation from "./04-Confirmation";

const tabTitles = ["1. Account", "2. Details", "3. Label", "4. Confirmation"];

type Props = {
  close: () => void,
  restlay: RestlayEnvironment,
};

type State<Transaction> = {
  tabsIndex: number,
  device: boolean,
  transaction: ?Transaction,
  account: ?Account,
  bridge: ?WalletBridge<Transaction>,
};

class Send extends Component<Props, State<*>> {
  constructor(props) {
    super(props);

    this.state = {
      tabsIndex: 0,
      account: null,
      transaction: null,
      device: false,
      bridge: null,
    };
  }

  onTabChange = (e, tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  selectAccount = (account: ?Account) => {
    if (!account) {
      this.setState({
        bridge: null,
        transaction: null,
        account: null,
        tabsIndex: 0,
      });
      return;
    }
    const currency = getCryptoCurrencyById(account.currency);
    const bridge = account ? getBridgeForCurrency(currency) : null;
    const transaction = bridge ? bridge.createTransaction(account) : null;

    this.setState({
      bridge,
      transaction,
      account,
      tabsIndex: 1,
    });
  };

  onChangeTransaction = transaction => {
    this.setState({ transaction });
  };

  confirmTx = () => {
    this.setState(state => ({ device: !state.device }));
  };

  createOperation = async transaction_id => {
    const { restlay, close } = this.props;
    const { account, transaction, bridge } = this.state;
    if (account && transaction && bridge) {
      if (transaction.amount && transaction.recipient) {
        await bridge.composeAndBroadcast(
          transaction_id,
          restlay,
          account,
          transaction,
        );
        close();
      }
    }
  };

  render() {
    const { close } = this.props;
    const { tabsIndex, account, transaction, bridge, device } = this.state;
    // TODO: would be nice to find a more elegant solution to disable tabs
    const disabledTabs = [
      false, // tab 0
      account === null, // tab 1
      !transaction ||
        (transaction && !transaction.amount) ||
        (transaction && !transaction.recipient), // tab 2
      !transaction || (transaction && !transaction.estimatedFees), // tab 3
    ];

    if (device) {
      return (
        <DeviceAuthenticate
          cancel={this.confirmTx}
          callback={this.createOperation}
          type="operations"
          account_id={account && account.id}
        />
      );
    }

    return (
      <ModalBody height={650} onClose={close}>
        <ModalHeader>
          <ModalTitle>New Operation</ModalTitle>
          <Tabs
            indicatorColor="primary"
            value={tabsIndex}
            onChange={this.onTabChange}
          >
            {tabTitles.map((title, i) => (
              <Tab
                key={i} // eslint-disable-line react/no-array-index-key
                label={title}
                disableRipple
                disabled={disabledTabs[i]}
              />
            ))}
          </Tabs>
        </ModalHeader>

        {tabsIndex === 0 && (
          <SendAccount
            onTabChange={this.onTabChange}
            selectAccount={this.selectAccount}
            account={account}
          />
        )}

        {tabsIndex === 1 && (
          <SendDetails
            bridge={bridge}
            transaction={transaction}
            account={account}
            onChangeTransaction={this.onChangeTransaction}
            onTabChange={this.onTabChange}
          />
        )}

        {tabsIndex === 2 && (
          <SendLabel
            bridge={bridge}
            transaction={transaction}
            account={account}
            onChangeTransaction={this.onChangeTransaction}
            onTabChange={this.onTabChange}
          />
        )}

        {tabsIndex === 3 && (
          <SendConfirmation
            bridge={bridge}
            transaction={transaction}
            account={account}
            onChangeTransaction={this.onChangeTransaction}
            confirmTx={this.confirmTx}
          />
        )}
      </ModalBody>
    );
  }
}

const RenderLoading = () => <ModalLoading height={650} />;

export default connectData(translate()(Send), {
  RenderLoading,
});
