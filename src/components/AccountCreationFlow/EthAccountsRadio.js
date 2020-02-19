// @flow

import React from "react";
import Radio from "@material-ui/core/Radio";
import { Trans } from "react-i18next";

import SelectAccount from "components/SelectAccount";
import Text from "components/base/Text";
import Box from "components/base/Box";
import type { Account } from "data/types";

export default function EthAccountsRadio({
  onChange,
  account,
  accounts,
}: {
  accounts: Account[],
  account: ?Account,
  onChange: (?Account) => void,
}) {
  const onChooseNull = () => onChange(null);
  const selectFirstIfNotSet = () => {
    if (!account) {
      onChange(accounts[0]);
    }
  };

  return (
    <>
      <Box
        cursor="pointer"
        horizontal
        align="flex-start"
        onClick={selectFirstIfNotSet}
      >
        <Radio color="primary" checked={account !== null} />
        <Box my={15}>
          <Trans i18nKey="newAccount:erc20.selectExisting" />
          <Box mt={10} width={380}>
            <SelectAccount
              accounts={accounts}
              value={account || accounts[0]}
              onChange={onChange}
            />
          </Box>
        </Box>
      </Box>
      <Box cursor="pointer" horizontal align="center" onClick={onChooseNull}>
        <Radio color="primary" checked={account === null} />
        <Text i18nKey="newAccount:erc20.createNew" />
      </Box>
    </>
  );
}
