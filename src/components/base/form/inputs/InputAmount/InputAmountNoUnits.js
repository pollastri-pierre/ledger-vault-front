// @flow

/* ================================================= */
/* ==                                             == */
/* ==         TODO : this component makes         == */
/* ==         absolutely no sense, it's an        == */
/* ==         input but it's taking the           == */
/* ==         bridge and account and tx as        == */
/* ==         prop. this.. ah yes I wrote it.     == */
/* ==                                             == */
/* ==     For now I will just create a new fresh  == */
/* ==     one: InputTokenAmount. Will remove      == */
/* ==     this one later.                         == */
/* ==                                             == */
/* ================================================= */

import React, { PureComponent } from "react";
import { BigNumber } from "bignumber.js";

import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { InputText } from "components/base/form";

import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import { sanitizeValueString } from "utils/strings";

type Props<Transaction> = {
  account: Account,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
  errors: Error[],
  onChangeTransaction: Transaction => void,
};

type State = {
  token: *,
  displayValue: string,
};

const getCurrencyLikeUnit = decimals => ({
  code: "",
  symbol: "",
  magnitude: decimals,
  name: "",
});

class AmountNoUnits extends PureComponent<Props<*>, State> {
  constructor(props: Props<*>) {
    super(props);
    const token = getERC20TokenByContractAddress(
      this.props.account.contract_address,
    );

    const fakeUnit = getCurrencyLikeUnit(token ? token.decimals : 0);

    const val = formatCurrencyUnit(
      fakeUnit,
      props.bridge.getTransactionAmount(props.account, props.transaction),
      { disableRounding: true },
    );
    this.state = {
      token,
      displayValue: parseFloat(val) > 0 ? val : "",
    };
  }

  onChange = (amount: string) => {
    const { account, bridge, transaction } = this.props;
    const { token } = this.state;

    const fakeUnit = getCurrencyLikeUnit(token ? token.decimals : 0);
    const r = sanitizeValueString(fakeUnit, amount);
    const sanitizedValue = BigNumber(r.value);
    this.props.onChangeTransaction(
      bridge.editTransactionAmount(account, transaction, sanitizedValue),
    );
    this.setState({ displayValue: r.display });
  };

  render() {
    const {
      errors,
      onChangeTransaction: _onChangeTransaction,
      ...props
    } = this.props;
    const { token, displayValue } = this.state;
    return (
      <InputText
        value={displayValue}
        align="right"
        onChange={this.onChange}
        placeholder="0"
        data-test="transaction-creation-amount"
        errors={errors}
        renderLeft={<div>{token && token.ticker}</div>}
        {...props}
      />
    );
  }
}

export default AmountNoUnits;
