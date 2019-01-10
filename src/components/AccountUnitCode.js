//@flow

import type { Account } from "data/types";
import {
  getCryptoCurrencyById,
  getERC20TokenByContractAddress
} from "utils/cryptoCurrencies";

type Props = { account: Account };
const AccountUnitCode = ({ account }: Props) => {
  if (account.account_type === "ERC20") {
    const token = getERC20TokenByContractAddress(account.contract_address);
    if (!token) return null;
    return token.symbol;
  } else {
    const curr = getCryptoCurrencyById(account.currency.name);
    const unit = curr.units.reduce(
      (prev, current) => (prev.magnitude > current.magnitude ? prev : current)
    );
    return unit.code;
  }
};
export default AccountUnitCode;
