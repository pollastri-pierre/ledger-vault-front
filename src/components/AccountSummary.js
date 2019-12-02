// @flow

import React from "react";

import Box from "components/base/Box";
import Text from "components/base/Text";

import type { Account } from "data/types";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import CryptoCurrencyIcon from "components/CryptoCurrencyIcon";
import colors from "shared/colors";

type Props = {
  account: Account,
};

export default function AccountSummary(props: Props) {
  const { account } = props;
  const currency = getCryptoCurrencyById(account.currency);
  return (
    <Box align="center" horizontal flow={10} ml={5}>
      <CryptoCurrencyIcon
        currency={currency}
        color={currency.color}
        size={24}
      />
      <Box>
        <Text fontWeight="bold">{account.name}</Text>
        <Text size="small" color={colors.steel}>
          {`${currency.name} #${account.id}`}
        </Text>
      </Box>
    </Box>
  );
}
