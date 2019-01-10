//@flow
import React, { Fragment } from "react";
import type { Account } from "data/types";
import {
  getCryptoCurrencyById,
  getERC20TokenByContractAddress
} from "utils/cryptoCurrencies";

type Props = { account: Account };
const AccountUnitCode = ({ account }: Props) => {
  if (account.account_type === "ERC20") {
    return (
      <Fragment>
        {getERC20TokenByContractAddress(account.contract_address).symbol}
      </Fragment>
    );
  } else {
    const curr = getCryptoCurrencyById(account.currency.name);
    const unit = curr.units.reduce(
      (prev, current) => (prev.magnitude > current.magnitude ? prev : current)
    );
    return <Fragment>{unit.code}</Fragment>;
  }
};
export default AccountUnitCode;
