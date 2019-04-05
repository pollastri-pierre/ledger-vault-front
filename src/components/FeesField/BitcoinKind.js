// @flow
import React, { PureComponent } from "react";
import { BigNumber } from "bignumber.js";
import type { Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import FeeSelect from "components/operations/creation/FeeSelect";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import CounterValue from "components/CounterValue";
import colors from "shared/colors";
import { getFees, InputFieldMerge } from "components/Send/helpers";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Transaction as BitcoinLikeTx } from "bridge/BitcoinBridge";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

const styles = {
  fieldTitle: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase"
  },
  feesFiat: {
    marginTop: 10,
    textAlign: "right",
    color: colors.steel,
    fontWeight: 600,
    fontSize: 11
  },
  currencyValue: {
    flex: 1,
    textAlign: "right",
    paddingBottom: 15,
    borderBottom: "1px solid #eeeeee"
  },
  container: {
    margin: "15px 0",
    padding: "0 40px"
  }
};

type Props<Transaction> = {
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  onChangeTransaction: Transaction => void,
  restlay: RestlayEnvironment,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>
};

class FeesBitcoinKind extends PureComponent<Props<BitcoinLikeTx>> {
  nonce = 0;

  async componentDidUpdate(prevProps: Props<*>) {
    const {
      account,
      transaction,
      restlay,
      onChangeTransaction,
      bridge
    } = this.props;
    const feesInvalidated =
      transaction.recipient !== prevProps.transaction.recipient ||
      !transaction.amount.isEqualTo(prevProps.transaction.amount) ||
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
        transaction.recipient
      );
      if (nonce !== this.nonce) return;
      if (isValid) {
        const operation = {
          fee_level: feeLevel || "normal",
          amount: transaction.amount || BigNumber(0),
          recipient: transaction.recipient || ""
        };
        const estimatedFees = await getFees(
          account,
          transaction,
          operation,
          restlay
        );
        if (nonce !== this.nonce) return;
        onChangeTransaction({
          ...transaction,
          estimatedFees: estimatedFees.fees
        });
      }
    }
  }

  onChangeFee = (feesSelected: Speed) => {
    const { bridge, account, transaction, onChangeTransaction } = this.props;
    bridge.editTransactionFeeLevel &&
      onChangeTransaction(
        bridge.editTransactionFeeLevel(account, transaction, feesSelected)
      );
  };

  render() {
    const { classes, account, transaction, bridge } = this.props;
    const feeLevel =
      bridge.getTransactionFeeLevel &&
      bridge.getTransactionFeeLevel(account, transaction);

    return (
      <div className={classes.container}>
        <div className={classes.fieldTitle}>
          <Trans i18nKey="send:details.fees.title" />
        </div>
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
            value={transaction.estimatedFees || BigNumber(0)}
            from={account.currency_id}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(connectData(FeesBitcoinKind));
