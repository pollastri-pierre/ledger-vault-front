// @flow

import React from "react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import styled from "styled-components";
import { MdClose, MdAdd } from "react-icons/md";
import type { Address } from "data/types";
import Box from "components/base/Box";
import colors, { opacity } from "shared/colors";
import Text from "components/base/Text";
import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";

export type HistoryType = "ADD" | "REMOVE";

type Props = {
  address: Address,
  history?: ?HistoryType,
};

const SIZE = 10;
const iconByHistory = {
  ADD: <MdAdd size={SIZE} color="green" />,
  REMOVE: <MdClose size={SIZE} color="red" />,
};
const AddressDisplay = ({ address, history }: Props) => (
  <Container history={history}>
    <Box horizontal justify="space-between">
      <Box horizontal align="center" flow={5}>
        <Icon currency={address.currency} />
        <Text fontWeight="semiBold" ellipsis>
          {address.name}
        </Text>
      </Box>
      {history && <Box>{iconByHistory[history]}</Box>}
    </Box>
    <Text style={styles.address}>{address.address}</Text>
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

const Container = styled(Box).attrs({ flow: 5, p: 5 })`
  display: inline-block;
  border: ${p =>
    p.history ? styles[p.history].border : `1px solid ${colors.mediumGrey}`};
  background: ${p =>
    p.history ? styles[p.history].background : colors.translucentGrey};
`;

const styles = {
  REMOVE: {
    border: `1px solid ${colors.grenade}`,
    background: opacity(colors.grenade, 0.1),
  },
  ADD: {
    border: `1px solid ${colors.green}`,
    background: opacity(colors.green, 0.1),
  },
  address: {
    fontSize: 10,
    fontFamily: "monospace",
    padding: 4,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
};

export default AddressDisplay;
