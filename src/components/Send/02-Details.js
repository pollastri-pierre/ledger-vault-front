//@flow
import React, { PureComponent } from "react";
import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import SendLayout from "./SendLayout";
import Amount from "./Amount";
import Address from "./Address";
import DetailsFooter from "./DetailsFooter";

type Props<Transaction> = {
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
  onChangeTransaction: Transaction => void,
  account: Account,
  restlay: RestlayEnvironment,
  onTabChange: (SyntheticInputEvent<*>, number) => void
};

type State = {
  canNext: boolean,
  amountIsValid: boolean,
  totalSpent: number
};

class SendDetails extends PureComponent<Props<*>, State> {
  state = {
    canNext: false,
    amountIsValid: true,
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
      const amountIsValid = totalSpent < account.balance;
      this.setState({ amountIsValid });

      const canNext = await bridge.checkValidTransaction(
        account,
        transaction,
        restlay
      );
      if (syncId !== this.syncId) return;
      if (this._unmounted) return;
      canNext
        ? this.setState({ totalSpent })
        : this.setState({ totalSpent: 0 });

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
    const { canNext, amountIsValid, totalSpent } = this.state;
    const FeesField = bridge.EditFees;
    return (
      <SendLayout
        content={
          <div>
            <Amount {...this.props} amountIsValid={amountIsValid} />
            <Address {...this.props} />
            {FeesField && (
              <FeesField
                account={account}
                transaction={transaction}
                onChangeTransaction={onChangeTransaction}
                bridge={bridge}
              />
            )}
          </div>
        }
        footer={
          <DetailsFooter
            account={account}
            onChangeTab={this.onChangeTab}
            canNext={canNext}
            totalSpent={totalSpent}
          />
        }
      />
    );
  }
}

export default connectData(SendDetails);
