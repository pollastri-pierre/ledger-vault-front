//@flow
import React, { Fragment } from "react";
import { MenuList } from "material-ui/Menu";
import AccountMenuItem from "./AccountMenuItem";
import ModalSubTitle from "./ModalSubTitle";
import type { Account } from "../../../data/types";

const OperationCreationAccounts = ({
  accounts,
  selectedAccount,
  onSelect
}: {
  accounts: Account[],
  selectedAccount: ?Account,
  onSelect: Account => void
}) => (
  <Fragment>
    <ModalSubTitle>Account to debit</ModalSubTitle>
    <MenuList>
      {accounts.map(account => (
        <AccountMenuItem
          key={account.id}
          onSelect={onSelect}
          account={account}
          selected={(selectedAccount && selectedAccount.id) === account.id}
        />
      ))}
    </MenuList>
  </Fragment>
);

export default OperationCreationAccounts;
