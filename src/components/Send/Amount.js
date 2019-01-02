//@flow
import React, { PureComponent, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";

import type { Account, Unit } from "data/types";
import CounterValue from "components/CounterValue";
import { TextField } from "components";
import { InputFieldMerge, sanitizeValueString, format } from "./helpers";
import type { WalletBridge } from "bridge/types";
import colors from "shared/colors";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import UnitSelect from "components/UnitSelect";

const styles = {
  countervalue: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    lineHeight: 2.42,
    fontSize: 22,
    color: colors.lead,
    marginBottom: 20
  },
  paddedHorizontal: {
    padding: "0 40px"
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

type State = {
  displayValue: string,
  unit: Unit
};

class SendAmount extends PureComponent<Props<*>, State> {
  constructor(props) {
    super(props);

    const { account, bridge, transaction } = props;

    const unit = account.settings.currency_unit;
    const val = format(unit, bridge.getTransactionAmount(account, transaction));

    this.state = {
      unit,
      displayValue: parseFloat(val) > 0 ? val : ""
    };
  }

  onChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { account, onChangeTransaction, bridge, transaction } = this.props;
    const { unit } = this.state;

    const r = sanitizeValueString(unit, e.currentTarget.value);
    const satoshiValue = parseInt(r.value);

    onChangeTransaction(
      bridge.editTransactionAmount(account, transaction, satoshiValue)
    );

    this.setState({ displayValue: r.display });
  };

  onChangeUnit = (index: number) => {
    const { account, bridge, transaction } = this.props;
    const unit = account.currency.units[index];
    const amount = bridge.getTransactionAmount(account, transaction);
    this.setState({ displayValue: format(unit, amount), unit });
  };

  render() {
    const { account, bridge, transaction, classes } = this.props;
    const { displayValue, unit } = this.state;
    return (
      <Fragment>
        <ModalSubTitle>
          <Trans i18nKey="send:details.amount.title" />
        </ModalSubTitle>
        <div className={classes.paddedHorizontal}>
          <InputFieldMerge>
            <UnitSelect
              units={account.currency.units}
              index={account.currency.units.findIndex(
                u => u.code === unit.code
              )}
              onChange={this.onChangeUnit}
            />
            <TextField
              placeholder="0"
              fullWidth
              data-test="operation-creation-amount"
              inputProps={{
                style: { textAlign: "right", fontSize: 22, color: "black" }
              }}
              value={displayValue}
              error={!this.props.amountIsValid}
              onChange={this.onChange}
            />
          </InputFieldMerge>
          <div className={classes.countervalue}>
            <div>USD</div>
            <CounterValue
              value={bridge.getTransactionAmount(account, transaction)}
              from={account.currency.name}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(SendAmount);
