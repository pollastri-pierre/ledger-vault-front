//@flow
import React from "react";
import { NavLink } from "react-router-dom";
import type { Account } from "../../datatypes";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";

// FIXME i don't know how to set currency.color because style is currently in a ::before

function AccountsMenu({ accounts }: { accounts: Array<Account> }) {
  return (
    <ul className="accounts-menu-list">
      {accounts.map(account => (
        <li key={account.id}>
          <NavLink to={`/account/${account.id}`}>
            {account.name}
            <span className="unit">{account.currency.units[0].code}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default connectData(AccountsMenu, {
  api: {
    accounts: api.accounts
  }
});
