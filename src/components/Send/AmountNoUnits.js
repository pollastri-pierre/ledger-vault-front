// @flow
import React, { PureComponent } from "react";
import { BigNumber } from "bignumber.js";
import { withStyles } from "@material-ui/core/styles";

import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import InputField from "components/InputField";

import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import { sanitizeValueString } from "./helpers";

const styles = {
  container: {
    marginBottom: 20
  }
};

type Props<Transaction> = {
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
  amountIsValid: boolean,
  onChangeTransaction: Transaction => void
};

type State = {
  token: *,
  displayValue: string
};

const getCurrencyLikeUnit = decimals => ({
  code: "",
  symbol: "",
  magnitude: decimals,
  name: ""
});

class AmountNoUnits extends PureComponent<Props<*>, State> {
  constructor(props) {
    super(props);
    const token = getERC20TokenByContractAddress(
      this.props.account.contract_address
    );

    const fakeUnit = getCurrencyLikeUnit(token ? token.decimals : 0);

    const val = formatCurrencyUnit(
      fakeUnit,
      props.bridge.getTransactionAmount(props.account, props.transaction)
    );
    this.state = {
      token,
      displayValue: parseFloat(val) > 0 ? val : ""
    };
  }

  onChange = amount => {
    const { account, bridge, transaction } = this.props;
    const { token } = this.state;

    const fakeUnit = getCurrencyLikeUnit(token ? token.decimals : 0);
    const r = sanitizeValueString(fakeUnit, amount);
    const sanitizedValue = BigNumber(r.value);
    this.props.onChangeTransaction(
      bridge.editTransactionAmount(account, transaction, sanitizedValue)
    );
    this.setState({ displayValue: r.display });
  };

  render() {
    const { classes, amountIsValid } = this.props;
    const { token, displayValue } = this.state;
    return (
      <div className={classes.container}>
        <InputField
          value={displayValue}
          autoFocus
          textAlign="right"
          onChange={this.onChange}
          placeholder="0"
          fullWidth
          data-test="operation-creation-amount"
          error={!amountIsValid}
          renderLeft={<div>{token && token.ticker}</div>}
        />
      </div>
    );
  }
}

export default withStyles(styles)(AmountNoUnits);
