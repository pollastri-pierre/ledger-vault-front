// @flow

import React from "react";
import styled from "styled-components";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/react";

import colors from "shared/colors";
import ERC20TokenIcon from "components/icons/ERC20Token";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import type { Account } from "data/types";

type Props = {|
  account: Account,
  size?: number,
|};

function AccountIcon(props: Props) {
  const { account, size: propSize } = props;

  const size = propSize || 16;

  let icon = null;

  if (account.contract_address) {
    const token = getERC20TokenByContractAddress(account.contract_address);
    if (token) {
      icon = <ERC20TokenIcon size={size} token={token} />;
    }
  } else {
    const currency = getCryptoCurrencyById(account.currency);
    if (currency) {
      const IconCurrency = getCryptoCurrencyIcon(currency);
      if (IconCurrency) {
        icon = <IconCurrency size={size} color={currency.color} />;
      }
    }
  }

  if (!icon) {
    icon = <Placeholder size={size} />;
  }

  return <Container size={size}>{icon}</Container>;
}

const Container = styled.div(
  (p) => `
  width: ${p.size}px;
  height: ${p.size}px;
`,
);

const Placeholder = styled.div(
  (p) => `
  width: ${p.size}px;
  height: ${p.size}px;
  background: ${colors.lightGrey};
  border-radius: 50%;
`,
);

export default AccountIcon;
