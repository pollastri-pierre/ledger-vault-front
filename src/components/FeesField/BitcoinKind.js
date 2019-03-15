// @flow

import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";

import type { Account } from "data/types";
import connectData from "restlay/connectData";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import colors from "shared/colors";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Transaction as BitcoinLikeTx } from "bridge/BitcoinBridge";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";

import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import FeeSelect from "components/operations/creation/FeeSelect";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import CounterValue from "components/CounterValue";
import { getFees, InputFieldMerge } from "components/Send/helpers";

const styles = {
  feesFiat: {
    marginTop: 10,
    textAlign: "right",
    color: colors.steel,
    fontWeight: 600,
    fontSize: 11,
  },
  currencyValue: {
    flex: 1,
    textAlign: "right",
    paddingBottom: 15,
    borderBottom: "1px solid #eeeeee",
  },
};

type Props<Transaction> = {
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  onChangeTransaction: Transaction => void,
  restlay: RestlayEnvironment,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
};

class FeesBitcoinKind extends PureComponent<Props<BitcoinLikeTx>> {
  nonce = 0;

  async componentDidUpdate(prevProps: Props<*>) {
    const {
      account,
      transaction,
      restlay,
      onChangeTransaction,
      bridge,
    } = this.props;
    const feesInvalidated =
      transaction.recipient !== prevProps.transaction.recipient ||
      transaction.amount !== prevProps.transaction.amount ||
      transaction.feeLevel !== prevProps.transaction.feeLevel;

    if (feesInvalidated) {
      const feeLevel =
        bridge.getTransactionFeeLevel &&
        bridge.getTransactionFeeLevel(account, transaction);
      const nonce = ++this.nonce;
      const currency = getCryptoCurrencyById(account.currency_id);
      const isValid = await bridge.isRecipientValid(
        restlay,
        currency,
        transaction.recipient,
      );
      if (nonce !== this.nonce) return;
      if (isValid) {
        const operation = {
          fee_level: feeLevel || "normal",
          amount: transaction.amount || 0,
          recipient: transaction.recipient || "",
        };
        const estimatedFees = await getFees(
          account,
          transaction,
          operation,
          restlay,
        );
        if (nonce !== this.nonce) return;
        onChangeTransaction({
          ...transaction,
          estimatedFees: estimatedFees.fees,
        });
      }
    }
  }

  onChangeFee = (feesSelected: Speed) => {
    const { bridge, account, transaction, onChangeTransaction } = this.props;
    bridge.editTransactionFeeLevel &&
      onChangeTransaction(
        bridge.editTransactionFeeLevel(account, transaction, feesSelected),
      );
  };

  render() {
    const { classes, account, transaction, bridge } = this.props;
    const feeLevel =
      bridge.getTransactionFeeLevel &&
      bridge.getTransactionFeeLevel(account, transaction);

    return (
      <div>
        <ModalSubTitle noPadding>
          <Trans i18nKey="send:details.fees.title" />
        </ModalSubTitle>
        <InputFieldMerge>
          <FeeSelect value={feeLevel || "normal"} onChange={this.onChangeFee} />
          {transaction.estimatedFees !== null && (
            <div className={classes.currencyValue}>
              <CurrencyAccountValue
                account={account}
                // $FlowFixMe
                value={transaction.estimatedFees}
              />
            </div>
          )}
        </InputFieldMerge>

        <div className={classes.feesFiat}>
          <CounterValue
            value={transaction.estimatedFees || 0}
            from={account.currency_id}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(connectData(FeesBitcoinKind));
