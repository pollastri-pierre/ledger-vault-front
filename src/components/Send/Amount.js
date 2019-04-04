// @flow
import React, { PureComponent, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";

import type { Account } from "data/types";
import CounterValue from "components/CounterValue";
import type { WalletBridge } from "bridge/types";
import colors from "shared/colors";
import ModalSubTitle from "components/transactions/creation/ModalSubTitle";
import InputCurrency from "components/InputCurrency";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import AmountNoUnits from "./AmountNoUnits";

const styles = {
  countervalue: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    lineHeight: 2.42,
    fontSize: 22,
    color: colors.lead,
  },
  fiat: {
    fontSize: 20,
  },
};

type Props<Transaction> = {
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  onChangeTransaction: Transaction => void,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
  amountIsValid: boolean,
};

class SendAmount extends PureComponent<Props<*>> {
  onChange = satoshiValue => {
    const { account, onChangeTransaction, bridge, transaction } = this.props;

    onChangeTransaction(
      bridge.editTransactionAmount(account, transaction, satoshiValue),
    );
  };

  render() {
    const {
      account,
      bridge,
      transaction,
      classes,
      amountIsValid,
      onChangeTransaction,
    } = this.props;

    const currency = getCryptoCurrencyById(account.currency);

    return (
      <div>
        <ModalSubTitle noPadding>
          <Trans i18nKey="send:details.amount.title" />
        </ModalSubTitle>
        <div>
          {account.account_type === "ERC20" ? (
            <AmountNoUnits
              account={account}
              bridge={bridge}
              transaction={transaction}
              amountIsValid={amountIsValid}
              onChangeTransaction={onChangeTransaction}
            />
          ) : (
            <Fragment>
              <InputCurrency
                currency={currency}
                placeholder="0"
                size="large"
                onChange={this.onChange}
                defaultUnit={account.settings.currency_unit}
                value={bridge.getTransactionAmount(account, transaction)}
                error={!amountIsValid}
                data-test="transaction-creation-amount"
              />
              <div className={classes.countervalue}>
                <div className={classes.fiat}>USD</div>
                <div className={classes.fiat}>
                  <CounterValue
                    value={bridge.getTransactionAmount(account, transaction)}
                    from={account.currency}
                  />
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SendAmount);
