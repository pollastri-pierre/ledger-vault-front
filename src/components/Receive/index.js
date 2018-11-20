//@flow
import React, { Component } from "react";
import type { Account } from "data/types";
import createDevice, { U2F_PATH, U2F_TIMEOUT } from "device";
import ModalLoading from "components/ModalLoading";
import Tabs from "@material-ui/core/Tabs";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import DialogButton from "components/buttons/DialogButton";
import Tab from "@material-ui/core/Tab";
import ReceiveAccounts from "./Accounts";
import ReceiveDevice from "./Device";
import ReceiveAddress from "./Address";
import { withStyles } from "@material-ui/core/styles";
import { CONFIDENTIALITY_PATH, VALIDATION_PATH, MATCHER_SESSION } from "device";

const tabTitles = ["1. Account", "2. Device", "3. Receive"];

const styles = {
  root: {
    width: 445,
    height: 612,
    display: "flex",
    flexDirection: "column"
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
    height: 400,
    overflowY: "auto",
    paddingTop: 40
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
  accounts: Account[],
  close: Function,
  classes: { [_: $Keys<typeof styles>]: string }
};
type State = {
  index: number,
  device: boolean,
  verified: boolean,
  error: boolean,
  selectedAccount: ?Account
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
      selectedAccount: null
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
  onSelectAccount = (selectedAccount: Account) => {
    this.setState(prev => ({
      ...prev,
      index: 1,
      selectedAccount: selectedAccount
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
    const { classes, accounts, close } = this.props;
    const { index, selectedAccount, verified, error } = this.state;
    return (
      <div className={classes.root}>
        <h2 className={classes.title}>Receive Address</h2>
        <Tabs
          indicatorColor="primary"
          className={classes.tabs}
          value={index}
          onChange={this.onTabChange}
        >
          {tabTitles.map((title, i) => (
            <Tab
              key={i}
              label={title}
              disabled={this.isDisabled(i)}
              disableRipple
            />
          ))}
        </Tabs>
        <div className={classes.content}>
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
        </div>
        <div className={classes.footer}>
          <DialogButton right onTouchTap={close}>
            close
          </DialogButton>
        </div>
      </div>
    );
  }
}

export default connectData(withStyles(styles)(Receive), {
  RenderLoading: ModalLoading,
  queries: {
    accounts: AccountsQuery
  }
});