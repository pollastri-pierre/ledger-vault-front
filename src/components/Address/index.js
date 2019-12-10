// @flow

import React from "react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import styled from "styled-components";
import type { Address } from "data/types";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";

type Props = {
  address: Address,
};

const AddressDisplay = ({ address }: Props) => (
  <Container history={history} title={address.address}>
    <Box horizontal justify="space-between">
      <Box horizontal align="center" flow={5}>
        <Icon currency={address.currency} />
        <Text fontWeight="semiBold">{address.name}</Text>
      </Box>
    </Box>
    <Text style={styles.address} ellipsis>
      {address.address}
    </Text>
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

const Container = styled(Box).attrs({ flow: 5, p: 5, pb: 8 })`
  border-radius: 4px;
  border: 1px solid #eeeeeeb8;
  background: white;
`;

const styles = {
  address: {
    fontSize: 10,
    borderRadius: 4,
    fontFamily: "monospace",
    padding: 4,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
};

export default AddressDisplay;
