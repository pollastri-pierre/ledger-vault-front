// @flow
import React from "react";
import type { Account } from "data/types";
import { Trans } from "react-i18next";
import SelectAccount from "components/SelectAccount";
import Box from "components/base/Box";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";

import ReceiveLayout from "./ReceiveLayout";

const ReceiveAccounts = ({
  accounts,
  selectedAccount,
  onSelect
}: {
  accounts: Account[],
  selectedAccount: ?Account,
  onSelect: (?Account) => void
}) => (
  <ReceiveLayout
    header={
      <ModalSubTitle>
        {<Trans i18nKey="receive:account_subtitle" />}
      </ModalSubTitle>
    }
    content={
      <Box py={20} px={40}>
        <SelectAccount
          accounts={accounts.filter(
            a => a.status === "APPROVED" || a.status === "VIEW_ONLY"
          )}
          value={selectedAccount}
          onChange={onSelect}
          autoFocus
          openMenuOnFocus
        />
      </Box>
    }
    footer={null}
  />
);

export default ReceiveAccounts;
