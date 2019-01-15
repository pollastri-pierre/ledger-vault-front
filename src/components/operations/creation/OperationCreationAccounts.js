// @flow
import React, { Fragment } from "react";
import { isAccountOutdated, isAccountBeingUpdated } from "utils/accounts";
import MenuList from "@material-ui/core/MenuList";
import { hasPending, isMemberOfAccount } from "utils/operations";
import Disabled from "components/Disabled";
import type { Account, Operation, Member } from "data/types";
import AccountMenuItem from "./AccountMenuItem";
import ModalSubTitle from "./ModalSubTitle";

const OperationCreationAccounts = ({
  accounts,
  selectedAccount,
  me,
  pendingOperations,
  onSelect
}: {
  accounts: Account[],
  selectedAccount: ?Account,
  me: Member,
  onSelect: Account => void,
  pendingOperations: Operation[]
}) => (
  <Fragment>
    <ModalSubTitle>Account to debit</ModalSubTitle>
    <MenuList data-test="operation-creation-accounts">
      {accounts.filter(a => a.status === "APPROVED").map(account => (
        <Disabled
          key={account.id}
          disabled={
            account.balance <= 0 ||
            hasPending(account, pendingOperations) ||
            !isMemberOfAccount(account, me) ||
            isAccountOutdated(account) ||
            isAccountBeingUpdated(account)
          }
        >
          <AccountMenuItem
            onSelect={onSelect}
            account={account}
            selected={(selectedAccount && selectedAccount.id) === account.id}
          />
        </Disabled>
      ))}
    </MenuList>
  </Fragment>
);

export default OperationCreationAccounts;
