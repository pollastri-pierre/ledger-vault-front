//@flow
import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import type { Account } from "../../datatypes";

// TODO use react-router NavLink so we don't have to pass in pathname !!

function AccountsMenu(props: { accounts: Array<Account>, pathname: string }) {
  const { accounts } = props;
  return (
    <ul className="accounts-menu-list">
      {_.map(accounts, account => {
        const url = `/account/${account.id}`;
        return (
          <li key={account.id}>
            <Link
              className={`${account.currency.name} ${props.pathname.startsWith(
                url
              )
                ? "active"
                : ""}`}
              to={`/account/${account.id}`}
            >
              {account.name}
              <span className="unit">{account.currency.units[0].code}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default AccountsMenu;
