//@flow
import React, { Fragment } from "react";
import MenuList from "@material-ui/core/MenuList";
import { hasPending, isMemberOfAccount } from "utils/operations";
import AccountMenuItem from "./AccountMenuItem";
import ModalSubTitle from "./ModalSubTitle";
import Disabled from "components/Disabled";
import type { Account, Operation, Member } from "data/types";

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
      {accounts.map(account => {
        return (
          <Disabled
            key={account.id}
            disabled={
              account.balance <= 0 ||
              hasPending(account, pendingOperations) ||
              !isMemberOfAccount(account, me)
            }
          >
            <AccountMenuItem
              onSelect={onSelect}
              account={account}
              selected={(selectedAccount && selectedAccount.id) === account.id}
            />
          </Disabled>
        );
      })}
    </MenuList>
  </Fragment>
);

export default OperationCreationAccounts;
