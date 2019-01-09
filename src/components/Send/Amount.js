//@flow
import React, { PureComponent, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";

import type { Account } from "data/types";
import CounterValue from "components/CounterValue";
import type { WalletBridge } from "bridge/types";
import colors from "shared/colors";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import InputCurrency from "components/InputCurrency";

const styles = {
  countervalue: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    lineHeight: 2.42,
    fontSize: 22,
    color: colors.lead,
    marginBottom: 10
  },
  paddedHorizontal: {
    padding: "0 40px"
  },
  fiat: {
    fontSize: 20
  }
};

type Props<Transaction> = {
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  onChangeTransaction: Transaction => void,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
  amountIsValid: boolean
};

class SendAmount extends PureComponent<Props<*>> {
  onChange = satoshiValue => {
    const { account, onChangeTransaction, bridge, transaction } = this.props;

    onChangeTransaction(
      bridge.editTransactionAmount(account, transaction, satoshiValue)
    );
  };

  render() {
    const { account, bridge, transaction, classes, amountIsValid } = this.props;
    return (
      <Fragment>
        <ModalSubTitle>
          <Trans i18nKey="send:details.amount.title" />
        </ModalSubTitle>
        <div className={classes.paddedHorizontal}>
          <InputCurrency
            currency={account.currency}
            placeholder="0"
            size="large"
            onChange={this.onChange}
            defaultUnit={account.settings.currency_unit}
            value={bridge.getTransactionAmount(account, transaction)}
            error={!amountIsValid}
            data-test="operation-creation-amount"
          />
          <div className={classes.countervalue}>
            <div className={classes.fiat}>USD</div>
            <div className={classes.fiat}>
              <CounterValue
                value={bridge.getTransactionAmount(account, transaction)}
                from={account.currency.name}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(SendAmount);
