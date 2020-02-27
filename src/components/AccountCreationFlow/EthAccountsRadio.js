// @flow

import React from "react";
import { Trans } from "react-i18next";

import { Radio } from "components/base/form";
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
    <Box flow={20}>
      <Box
        cursor="pointer"
        horizontal
        align="flex-start"
        onClick={selectFirstIfNotSet}
        flow={15}
      >
        <Radio checked={account !== null} />
        <Box style={{ paddingTop: 2 }}>
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
      <Box
        cursor="pointer"
        horizontal
        align="flex-start"
        onClick={onChooseNull}
        flow={15}
      >
        <Radio checked={account === null} />
        <Text style={{ paddingTop: 2 }} i18nKey="newAccount:erc20.createNew" />
      </Box>
    </Box>
  );
}
