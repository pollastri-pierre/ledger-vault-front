//@flow
import React, { Fragment } from "react";
import type { Account } from "data/types";
import MenuList from "@material-ui/core/MenuList";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import AccountMenuItem from "components/operations/creation/AccountMenuItem";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";

const ReceiveAccounts = ({
  accounts,
  t,
  selectedAccount,
  onSelect
}: {
  accounts: Account[],
  t: Translate,
  selectedAccount: ?Account,
  onSelect: Account => void
}) => (
  <Fragment>
    <ModalSubTitle>{t("receive:account_subtitle")}</ModalSubTitle>
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
  </Fragment>
);

export default translate()(ReceiveAccounts);
