// @flow

import React from "react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import Copy from "components/base/Copy";
import styled from "styled-components";
import type { Address } from "data/types";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";

type Props = {
  address: Address,
  customBg?: string,
};

const AddressDisplay = ({ address, customBg }: Props) => (
  <Container history={history} title={address.address}>
    <Box horizontal align="center" justify="space-between">
      <Box horizontal align="center" flow={5}>
        <div style={{ marginTop: 2 }}>
          <Icon currency={address.currency} />
        </div>
        <Text fontWeight="semiBold" ellipsis>
          {address.name}
        </Text>
      </Box>
    </Box>
    <Copy text={address.address} compact customBg={customBg} />
  </Container>
);

const Icon = ({ currency }: { currency: string }) => {
  const curr = getCryptoCurrencyById(currency);
  if (!curr) return false;
  const IconCurrency = curr ? getCryptoCurrencyIcon(curr) : null;
  if (!IconCurrency) return false;
  return (
    <Box>
      <IconCurrency size={10} color={curr.color} />
    </Box>
  );
};

const Container = styled(Box).attrs({
  horizontal: true,
  grow: 1,
  justify: "space-between",
  align: "center",
  flow: 5,
})``;

export default AddressDisplay;
