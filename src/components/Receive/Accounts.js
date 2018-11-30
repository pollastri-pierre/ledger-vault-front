//@flow
import React from "react";
import type { Account } from "data/types";
import MenuList from "@material-ui/core/MenuList";
import { Trans } from "react-i18next";
import AccountMenuItem from "components/operations/creation/AccountMenuItem";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";

import ReceiveLayout from "./ReceiveLayout";

const ReceiveAccounts = ({
  accounts,
  selectedAccount,
  onSelect
}: {
  accounts: Account[],
  selectedAccount: ?Account,
  onSelect: Account => void
}) => (
  <ReceiveLayout
    header={
      <ModalSubTitle>
        {<Trans i18nKey="receive:account_subtitle" />}
      </ModalSubTitle>
    }
    content={
      <MenuList>
        {accounts.filter(a => a.status === "APPROVED").map((account, i) => {
          return (
            <AccountMenuItem
              onSelect={onSelect}
              key={i}
              account={account}
              selected={(selectedAccount && selectedAccount.id) === account.id}
            />
          );
        })}
      </MenuList>
    }
    footer={null}
  />
);

export default ReceiveAccounts;
