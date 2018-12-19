//@flow
import React, { PureComponent } from "react";
import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import DialogButton from "components/buttons/DialogButton";
import SendLayout from "./SendLayout";
import Amount from "./Amount";
import Address from "./Address";

type Props<Transaction> = {
  transaction: Transaction,
  bridge: ?WalletBridge<Transaction>,
  onChangeTransaction: (*) => void,
  account: ?Account,
  restlay: *,
  onTabChange: (SyntheticInputEvent<*>, number) => void
};
type State = {
  canNext: boolean,
  amountIsValid: boolean
};

class SendDetails extends PureComponent<Props<*>, State> {
  state = {
    canNext: false,
    amountIsValid: true
  };
  componentDidMount() {
    this.resync();
  }
  componentDidUpdate(nextProps: Props<*>) {
    if (
      nextProps.account !== this.props.account ||
      nextProps.transaction !== this.props.transaction
    ) {
      this.resync();
    }
  }

  syncId = 0;

  async resync() {
    const { account, bridge, transaction, restlay } = this.props;
    const syncId = ++this.syncId;

    if (!account || !transaction || !bridge) {
      this.setState({ canNext: false });
      return;
    }

    try {
      const totalSpent = await bridge.getTotalSpent(account, transaction);
      const amountIsValid = totalSpent < account.balance;
      this.setState({ amountIsValid });
      if (syncId !== this.syncId) return;
      const isRecipientValid = await bridge.isRecipientValid(
        restlay,
        account.currency,
        bridge.getTransactionRecipient(account, transaction)
      );
      if (syncId !== this.syncId) return;
      const canNext =
        transaction.amount > 0 &&
        isRecipientValid &&
        amountIsValid &&
        transaction.estimatedFees;
      this.setState({ canNext });
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
    const { canNext, amountIsValid } = this.state;
    const FeesField = bridge && bridge.EditFees;
    return (
      <SendLayout
        header={null}
        content={
          <div>
            <Amount {...this.props} amountIsValid={amountIsValid} />
            <Address {...this.props} />
            {FeesField && (
              <FeesField
                account={account}
                transaction={transaction}
                onChangeTransaction={onChangeTransaction}
              />
            )}
          </div>
        }
        footer={
          <DialogButton
            highlight
            right
            disabled={!canNext}
            onTouchTap={this.onChangeTab}
          >
            <Trans i18nKey="common:continue" />
          </DialogButton>
        }
      />
    );
  }
}

export default connectData(SendDetails);
