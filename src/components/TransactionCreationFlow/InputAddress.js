// @flow

import React, { PureComponent } from "react";
import type { Account } from "data/types";
import connectData from "restlay/connectData";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";
import { InputText } from "components/base/form";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

type Props<Transaction> = {
  restlay: RestlayEnvironment,
  account: Account,
  onChangeTransaction: Transaction => void,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
};

type State = {
  recipientError: ?Error,
  recipientWarning: ?Error,
};

const initialState = {
  recipientError: null,
  recipientWarning: null,
};

class SendAddress extends PureComponent<Props<*>, State> {
  state = initialState;

  _unmounted = false;

  _nonce = 0;

  componentDidMount() {
    this.validateAddress();
  }

  async componentDidUpdate(prevProps) {
    const { account, transaction, bridge } = this.props;
    const prevRecipient = prevProps.bridge.getTransactionRecipient(
      prevProps.account,
      prevProps.transaction,
    );
    const currentRecipient = bridge.getTransactionRecipient(
      account,
      transaction,
    );
    if (prevRecipient !== currentRecipient) {
      this.validateAddress();
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  async validateAddress() {
    const { account, transaction, bridge, restlay } = this.props;
    const currency = getCryptoCurrencyById(account.currency);
    const recipient = bridge.getTransactionRecipient(account, transaction);
    const nonce = ++this._nonce;
    if (recipient) {
      const recipientError = await bridge.getRecipientError(
        restlay,
        currency,
        recipient,
      );
      const recipientWarning = bridge.getRecipientWarning
        ? await bridge.getRecipientWarning(recipient)
        : null;

      if (nonce !== this._nonce || this._unmounted) return;
      this.setState({ recipientError, recipientWarning });
    } else {
      if (nonce !== this._nonce || this._unmounted) return;
      this.setState(initialState);
    }
  }

  onChange = async (recipient: string) => {
    const { onChangeTransaction, bridge, transaction, account } = this.props;
    onChangeTransaction(
      bridge.editTransactionRecipient(account, transaction, recipient),
    );
  };

  render() {
    const {
      account,
      bridge,
      transaction,
      onChangeTransaction: _onChangeTransaction,
      ...props
    } = this.props;
    const { recipientError, recipientWarning } = this.state;
    return (
      <InputText
        id="address"
        onChange={this.onChange}
        value={bridge.getTransactionRecipient(account, transaction)}
        errors={recipientError ? [recipientError] : null}
        warnings={recipientWarning ? [recipientWarning] : null}
        {...props}
      />
    );
  }
}

export default connectData(SendAddress);
