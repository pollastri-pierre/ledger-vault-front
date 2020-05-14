// @flow

import React from "react";
import { BigNumber } from "bignumber.js";
import { IoMdHelpBuoy } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";

import Button from "components/base/Button";
import VaultLink from "components/VaultLink";
import HelpLink from "components/HelpLink";
import Text from "components/base/Text";
import Box from "components/base/Box";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import type { Account } from "data/types";

type Props = {
  onReset: () => void,
  amount: BigNumber,
  account: Account,
};

const UTXOsErrorModal = (props: Props) => {
  const { onReset, amount, account } = props;
  return (
    <Box p={30} flow={20} align="center" justify="center" width={400}>
      <Box>
        <FaInfoCircle size={36} color="black" />
      </Box>
      <Box>
        <p>
          To create a transaction over{" "}
          <strong>
            <CurrencyAccountValue account={account} value={amount} />
          </strong>
          , you must first consolidate the UTXOs in the{" "}
          <strong>{account.name}</strong> account.
        </p>
      </Box>
      <Box align="center" justify="center" horizontal flow={5}>
        <IoMdHelpBuoy size={20} />{" "}
        <Text fontWeight="semiBold">
          <HelpLink subLink="/Content/transactions/tx_consolidate.html">
            Learn more on UTXO consolidation
          </HelpLink>
        </Text>
      </Box>
      <Box horizontal flow={20} pt={20}>
        <Button type="outline" onClick={onReset}>
          Change amount
        </Button>
        <Button type="filled">
          <VaultLink withRole to={`/dashboard/consolidate/${account.id}`}>
            Consolidate
          </VaultLink>
        </Button>
      </Box>
    </Box>
  );
};

export default UTXOsErrorModal;
