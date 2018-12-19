//@flow
import React, { PureComponent } from "react";
import type { Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import { InputFieldMerge } from "components/Send/helpers";
import FeeSelect from "components/operations/creation/FeeSelect";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import CounterValue from "components/CounterValue";
import colors from "shared/colors";
import { getFees } from "components/Send/helpers";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";

const styles = {
  fieldTitle: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase"
  },
  feesFiat: {
    marginTop: 18,
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
    margin: "15px 0"
  }
};

type Props<Transaction> = {
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  onChange: (*) => void,
  estimatedFees: *,
  restlay: RestlayEnvironment,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>
};

class FeesBitcoinKind extends PureComponent<Props<*>, *> {
  nonce = 0;

  async componentDidUpdate(prevProps: Props<*>) {
    const { account, transaction, restlay, onChange, bridge } = this.props;
    const feesInvalidated =
      transaction.recipient !== prevProps.transaction.recipient ||
      transaction.amount !== prevProps.transaction.amount ||
      transaction.feeLevel !== prevProps.transaction.feeLevel;

    if (feesInvalidated) {
      const feeLevel =
        bridge.getTransactionFeeLevel &&
        bridge.getTransactionFeeLevel(account, transaction);
      const nonce = ++this.nonce;
      const isValid = await bridge.isRecipientValid(
        restlay,
        account.currency,
        transaction.recipient
      );
      if (nonce !== this.nonce) return;
      if (isValid) {
        const operation = {
          fee_level: feeLevel ? feeLevel : "normal",
          amount: transaction.amount || 0,
          recipient: transaction.recipient || ""
        };
        const estimatedFees = await getFees(
          account,
          transaction,
          operation,
          restlay
        );
        if (nonce !== this.nonce) return;
        onChange({ ...transaction, estimatedFees });
      }
    }
  }
  onChangeFee = (feesSelected: Speed) => {
    const { bridge, account, transaction, onChange } = this.props;
    bridge.editTransactionFeeLevel &&
      onChange(
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
          <FeeSelect
            value={feeLevel ? feeLevel : "normal"}
            onChange={this.onChangeFee}
          />
          <div className={classes.currencyValue}>
            <CurrencyAccountValue
              account={account}
              value={transaction.estimatedFees}
            />
          </div>
        </InputFieldMerge>

        <div className={classes.feesFiat}>
          <CounterValue
            value={transaction.estimatedFees || 0}
            from={account.currency.name}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(connectData(FeesBitcoinKind));
