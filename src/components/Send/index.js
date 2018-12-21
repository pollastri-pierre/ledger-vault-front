//@flow
import React, { Component } from "react";
import type { Account } from "data/types";
import ModalLoading from "components/ModalLoading";
import Tabs from "@material-ui/core/Tabs";
import { withStyles } from "@material-ui/core/styles";
import { translate } from "react-i18next";
import connectData from "restlay/connectData";
import Tab from "@material-ui/core/Tab";
import DeviceAuthenticate from "components/DeviceAuthenticate";
import type { WalletBridge } from "bridge/types";
import SendAccount from "./01-Account";
import SendDetails from "./02-Details";
import SendLabel from "./03-Label";
import SendConfirmation from "./04-Confirmation";
import HeaderRightClose from "components/HeaderRightClose";
import type { RestlayEnvironment } from "restlay/connectData";

import { getBridgeForCurrency } from "bridge";

const tabTitles = ["1. Account", "2. Details", "3. Label", "4. Confirmation"];

const styles = {
  root: {
    width: 445,
    display: "flex",
    flexDirection: "column",
    height: 612
  },
  title: {
    fontSize: 18,
    fontWeight: 400,
    color: "black",
    margin: 0,
    padding: 40,
    paddingBottom: 20
  },
  tabs: {
    margin: "0 40px",
    zIndex: 2
  },
  content: {
    overflowY: "auto",
    paddingTop: 40,
    display: "flex",
    flexDirection: "column",
    height: "100vh"
  },
  footer: {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "100%",
    padding: "0 40px"
  }
};
type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  close: () => void,
  restlay: RestlayEnvironment
};

type State<Transaction> = {
  tabsIndex: number,
  device: boolean,
  transaction: ?Transaction,
  account: ?Account,
  bridge: ?WalletBridge<Transaction>
};

class Send extends Component<Props, State<*>> {
  constructor(props) {
    super(props);

    this.state = {
      tabsIndex: 0,
      account: null,
      transaction: null,
      device: false,
      bridge: null
    };
  }

  onTabChange = (e, tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  selectAccount = (account: Account) => {
    const bridge = account ? getBridgeForCurrency(account.currency) : null;
    const transaction = bridge ? bridge.createTransaction(account) : null;

    this.setState({
      bridge,
      transaction,
      account,
      tabsIndex: 1
    });
  };
  onChangeTransaction = transaction => {
    this.setState({ transaction });
  };

  confirmTx = () => {
    this.setState({ device: !this.state.device });
  };

  createOperation = async operation_id => {
    const { restlay, close } = this.props;
    const { account, transaction, bridge } = this.state;
    if (account && transaction && bridge) {
      if (transaction.amount && transaction.recipient) {
        await bridge.composeAndBroadcast(
          operation_id,
          restlay,
          account,
          transaction
        );
        close();
      }
    }
  };

  render() {
    const { classes, close } = this.props;
    const { tabsIndex, account, transaction, bridge, device } = this.state;
    // TODO: would be nice to find a more elegant solution to disable tabs
    const disabledTabs = [
      false, // tab 0
      account === null, // tab 1
      !transaction ||
        (transaction && !transaction.amount) ||
        (transaction && !transaction.recipient), // tab 2
      !transaction || (transaction && !transaction.estimatedFees) // tab 3
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
      <div className={classes.root}>
        <h2 className={classes.title}>New Operation</h2>
        <HeaderRightClose close={close} />
        <Tabs
          indicatorColor="primary"
          className={classes.tabs}
          value={tabsIndex}
          onChange={this.onTabChange}
        >
          {tabTitles.map((title, i) => (
            <Tab
              key={i}
              label={title}
              disableRipple
              disabled={disabledTabs[i]}
            />
          ))}
        </Tabs>
        <div className={classes.content}>
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
        </div>
      </div>
    );
  }
}

export default connectData(withStyles(styles)(translate()(Send)), {
  RenderLoading: ModalLoading
});
