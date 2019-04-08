// @flow
import React from "react";
import type { Account } from "data/types";
import { Trans } from "react-i18next";
import SelectAccount from "components/SelectAccount";
import { Label } from "components/base/form";

import ReceiveLayout from "./ReceiveLayout";

const ReceiveAccounts = ({
  accounts,
  selectedAccount,
  onSelect,
}: {
  accounts: Account[],
  selectedAccount: ?Account,
  onSelect: (?Account) => void,
}) => (
  <ReceiveLayout
    header={<Label>{<Trans i18nKey="receive:account_subtitle" />}</Label>}
    content={
      <SelectAccount
        accounts={accounts.filter(
          a => a.status === "APPROVED" || a.status === "VIEW_ONLY",
        )}
        value={selectedAccount}
        onChange={onSelect}
        autoFocus
        openMenuOnFocus
      />
    }
    footer={null}
  />
);

export default ReceiveAccounts;
