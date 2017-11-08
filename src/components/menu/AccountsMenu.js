//@flow
import React from "react";
import { NavLink } from "react-router-dom";
import type { Account } from "../../datatypes";
import connectData from "../../restlay/connectData";
import * as api from "../../data/api-spec";

function AccountsMenu({ accounts }: { accounts: Array<Account> }) {
  return (
    <ul className="accounts-menu-list">
      {accounts.map(account => (
        <li style={{ color: account.currency.color }} key={account.id}>
          <NavLink to={`/account/${account.id}`}>
            <span>{account.name}</span>
            <span className="unit">{account.currency.units[0].code}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default connectData(AccountsMenu, {
  queries: {
    accounts: api.accounts
  }
});
