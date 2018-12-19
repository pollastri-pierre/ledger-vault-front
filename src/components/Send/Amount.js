//@flow
import React, { PureComponent, Fragment } from "react";
import type { Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";
import CounterValue from "components/CounterValue";
import { TextField } from "components";
import { InputFieldMerge, sanitizeValueString, format } from "./helpers";
import type { WalletBridge } from "bridge/types";
import colors from "shared/colors";

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
  unit: {
    paddingBottom: 10
  },
  fieldTitle: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase"
  }
};

type Props<Transaction> = {
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  onChangeTransaction: (*) => void,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
  amountIsValid: boolean
};
type State = {
  displayValue: string
};

class SendAmount extends PureComponent<Props<*>, State> {
  constructor(props) {
    super(props);

    const { account, bridge, transaction } = props;
    const val = format(
      account.settings.currency_unit,
      bridge.getTransactionAmount(account, transaction)
    );
    this.state = {
      displayValue: parseFloat(val) > 0 ? val : ""
    };
  }

  onChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { account, onChangeTransaction, bridge, transaction } = this.props;

    const r = sanitizeValueString(
      account.settings.currency_unit,
      e.currentTarget.value
    );
    const satoshiValue = parseInt(r.value);

    onChangeTransaction(
      bridge.editTransactionAmount(account, transaction, satoshiValue)
    );
    this.setState({ displayValue: r.display });
  };
  render() {
    const { account, bridge, transaction, classes } = this.props;
    const { displayValue } = this.state;
    return (
      <Fragment>
        <span className={classes.fieldTitle}>
          <Trans i18nKey="send:details.amount.title" />
        </span>
        <InputFieldMerge>
          <div className={classes.unit}>
            {account.settings.currency_unit.code}
          </div>
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
          <div>
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
