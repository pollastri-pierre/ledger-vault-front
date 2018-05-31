//@flow
import React, { Fragment } from "react";
import MenuList from "@material-ui/core/MenuList";
import { hasPending } from "utils/operations";
import AccountMenuItem from "./AccountMenuItem";
import ModalSubTitle from "./ModalSubTitle";
import Disabled from "components/Disabled";
import type { Account, Operation } from "data/types";

const OperationCreationAccounts = ({
  accounts,
  selectedAccount,
  pendingOperations,
  onSelect
}: {
  accounts: Account[],
  selectedAccount: ?Account,
  onSelect: Account => void,
  pendingOperations: Operation[]
}) => (
  <Fragment>
    <ModalSubTitle>Account to debit</ModalSubTitle>
    <MenuList>
      {accounts.map(account => {
        return (
          <Disabled
            key={account.id}
            disabled={
              account.balance <= 0 || hasPending(account, pendingOperations)
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
