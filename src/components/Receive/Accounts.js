// @flow
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
      <MenuList data-test="receive-accounts">
        {accounts
          .filter(a => a.status === "APPROVED" || a.status === "VIEW_ONLY")
          .map((account, i) => (
            <AccountMenuItem
              onSelect={onSelect}
              key={i} // eslint-disable-line react/no-array-index-key
              account={account}
              selected={(selectedAccount && selectedAccount.id) === account.id}
            />
          ))}
      </MenuList>
    }
    footer={null}
  />
);

export default ReceiveAccounts;
