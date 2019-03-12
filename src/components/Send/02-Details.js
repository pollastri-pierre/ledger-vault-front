// @flow

import React, { PureComponent, Fragment } from "react";

import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import { ModalFooter } from "components/base/Modal";
import Box from "components/base/Box";
import Amount from "./Amount";
import Address from "./Address";
import DetailsFooter from "./DetailsFooter";

type Props<Transaction> = {
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
  onChangeTransaction: Transaction => void,
  account: Account,
  accounts: Account[],
  restlay: RestlayEnvironment,
  onTabChange: (SyntheticInputEvent<*>, number) => void
};

type State = {
  canNext: boolean,
  amountIsValid: boolean,
  totalSpent: number,
  feeIsValid: boolean
};

class SendDetails extends PureComponent<Props<*>, State> {
  state = {
    canNext: false,
    amountIsValid: true,
    feeIsValid: true,
    totalSpent: 0
  };

  componentDidMount() {
    this.resync();
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  componentDidUpdate(nextProps: Props<*>) {
    if (
      nextProps.account !== this.props.account ||
      nextProps.transaction !== this.props.transaction
    ) {
      this.resync();
    }
  }

  _unmounted = false;

  syncId = 0;

  async feeIsValid() {
    const { account, accounts, transaction, bridge } = this.props;
    if (account.account_type === "ERC20") {
      const parentETH = accounts.find(a => a.id === account.parent_id);
      const feeIsValid =
        parentETH &&
        bridge.checkValidFee &&
        (await bridge.checkValidFee(account, transaction, parentETH));
      return feeIsValid;
    }
    return true;
  }

  async resync() {
    const { account, bridge, transaction, restlay } = this.props;
    const syncId = ++this.syncId;

    if (!account || !transaction || !bridge) {
      this.setState({ canNext: false });
      return;
    }

    try {
      const totalSpent = await bridge.getTotalSpent(account, transaction);
      if (syncId !== this.syncId) return;
      // NOTE: this causes inability to send max equal to balance
      // (relevant for tokens since fees are coming from the parent)
      const amountIsValid = totalSpent < account.balance;
      this.setState({ amountIsValid });
      const txIsValid = await bridge.checkValidTransaction(
        account,
        transaction,
        restlay
      );
      const feeIsValid = await this.feeIsValid();
      if (syncId !== this.syncId) return;
      if (this._unmounted) return;
      const canNext = txIsValid && feeIsValid;

      canNext
        ? this.setState({ totalSpent })
        : this.setState({ totalSpent: 0 });

      this.setState({ canNext, feeIsValid });
    } catch (err) {
      this.setState({
        canNext: false
      });
    }
  }

  onChangeTab = e => {
    // TODO: re-evaluate this tabIndex system
    this.props.onTabChange(e, 2);
  };

  render() {
    const { transaction, account, onChangeTransaction, bridge } = this.props;
    const { canNext, amountIsValid, totalSpent, feeIsValid } = this.state;
    const FeesField = bridge.EditFees;
    return (
      <Fragment>
        <Box flow={30}>
          <Amount {...this.props} amountIsValid={amountIsValid} />
          <Address {...this.props} />
          {FeesField && (
            <FeesField
              account={account}
              transaction={transaction}
              onChangeTransaction={onChangeTransaction}
              bridge={bridge}
              feeIsValid={feeIsValid}
            />
          )}
        </Box>

        <ModalFooter justify="space-between" align="flex-start">
          <DetailsFooter
            account={account}
            onChangeTab={this.onChangeTab}
            canNext={canNext}
            totalSpent={totalSpent}
          />
        </ModalFooter>
      </Fragment>
    );
  }
}

export default connectData(SendDetails, {
  queries: {
    accounts: AccountsQuery
  }
});
