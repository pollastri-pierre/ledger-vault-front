// @flow

import React, { useMemo } from "react";
import { BigNumber } from "bignumber.js";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import connectData from "restlay/connectData";
import { Label, InputAmount, InputNumber } from "components/base/form";
import Box from "components/base/Box";
import FakeInputContainer from "components/base/FakeInputContainer";
import CurrencyUnitValue from "components/CurrencyUnitValue";

import type { RestlayEnvironment } from "restlay/connectData";
import type { EditProps } from "bridge/types";
import type { Transaction as EthereumTransaction } from "bridge/EthereumBridge";

import type {
  EstimateETHFeesCommonPayload,
  EstimateETHFeesPayload,
} from "bridge/fees.types";

import GenericFeesField from "./GenericFeesField";

// let's hard extract the gwei unit because it's used to display gas price
const ethereumCurrency = getCryptoCurrencyById("ethereum");
const gweiUnit = ethereumCurrency.units.find((u) => u.code === "Gwei");

// this will never happen, it's just to make Flow happy
if (!gweiUnit) {
  throw new Error(`Can't find gwei`);
}

type Props = {|
  ...EditProps<EthereumTransaction>,
  restlay: RestlayEnvironment,
|};

const FeesEthereumKind = (props: Props) => (
  <GenericFeesField
    {...props}
    estimateFeesPayload={useEthereumFeePayload(props.transaction)}
    shouldFetchFees={shouldFetchFees}
    patchFromSuccess={patchFromSuccess}
    patchFromError={patchFromError}
    DisplayFees={DisplayFees}
    EditFees={EditFees}
  />
);

const shouldFetchFees = (transaction: EthereumTransaction) => {
  // allow fetching fees for custom IF gas_limit is not fetched yet
  return (
    transaction.fees.fees_level !== "custom" || !transaction.fees.gas_limit
  );
};

const DisplayFees = ({ transaction }: { transaction: EthereumTransaction }) => (
  <Box flow={8}>
    <Box horizontal align="center" justify="space-between">
      <Label noPadding>Gas price</Label>
      <div>
        {transaction.gasPrice ? (
          <CurrencyUnitValue unit={gweiUnit} value={transaction.gasPrice} />
        ) : (
          "-"
        )}
      </div>
    </Box>
    <Box horizontal align="center" justify="space-between">
      <Label noPadding>Gas limit</Label>
      <div>{transaction.gasLimit ? transaction.gasLimit.toFixed() : "-"}</div>
    </Box>
  </Box>
);

const EditFees = ({
  transaction,
  onChangeTransaction,
}: EditProps<EthereumTransaction>) => {
  const { fees } = transaction;

  const handleChangeGasPrice = (gasPrice) =>
    onChangeTransaction({
      ...transaction,
      fees: { ...fees, gas_price: gasPrice },
      gasPrice,
    });

  const handleChangeGasLimit = (gasLimit: number) =>
    onChangeTransaction({
      ...transaction,
      fees: { ...fees, gas_limit: BigNumber(gasLimit) },
      gasLimit: BigNumber(gasLimit),
    });

  if (fees.gas_price === undefined || fees.gas_limit === undefined) return null;

  return (
    <Box horizontal flow={8}>
      <Box flex={1}>
        <Box>
          <Label>Gas price (GWEI)</Label>
          {fees.gas_price ? (
            <InputAmount
              width="auto"
              currency={ethereumCurrency}
              unit={gweiUnit}
              value={fees.gas_price}
              onChange={handleChangeGasPrice}
              hideCV
              hideUnit
              autoFocus
            />
          ) : (
            <DisabledInput />
          )}
        </Box>
      </Box>
      <Box flex={1}>
        <Label>Gas limit</Label>
        {fees.gas_limit ? (
          <InputNumber
            value={fees.gas_limit.toNumber()}
            onChange={handleChangeGasLimit}
          />
        ) : (
          <DisabledInput />
        )}
      </Box>
    </Box>
  );
};

const DisabledInput = () => (
  <FakeInputContainer style={{ background: "hsl(0, 0%, 95%)" }}>
    {"-"}
  </FakeInputContainer>
);

const useEthereumFeePayload = (transaction) =>
  useMemo((): EstimateETHFeesPayload => {
    const fees = transaction.fees;

    const common: EstimateETHFeesCommonPayload = {
      amount: transaction.amount,
      recipient: transaction.recipient,
    };

    if (fees.fees_level === "custom") {
      return {
        ...common,
        ...fees,
        gas_limit: fees.gas_limit || BigNumber(1),
      };
    }

    return { ...common, fees_level: fees.fees_level };
  }, [transaction.amount, transaction.recipient, transaction.fees]);

const patchFromSuccess = (estimatedFees, transaction) => {
  const common = {
    gasPrice: estimatedFees.gas_price,
    gasLimit: estimatedFees.gas_limit,
    error: null,
  };

  const fees = transaction.fees;

  // handle the edge-case when the user selected custom *before* estimating
  if (fees.fees_level === "custom") {
    return {
      ...common,
      fees: {
        ...fees,
        gas_price: estimatedFees.gas_price,
        gas_limit: estimatedFees.gas_limit,
      },
    };
  }

  return common;
};

const patchFromError = (error, transaction) => {
  const { fees } = transaction;

  // if we have an error on fetching the fees while being on custom, we
  // put 0 on everything so user is not blocked, and we don't store error
  if (fees.fees_level === "custom") {
    return {
      error: null,
      gasPrice: BigNumber(0),
      gasLimit: BigNumber(0),
      fees: {
        ...fees,
        gas_price: BigNumber(0),
        gas_limit: BigNumber(0),
      },
    };
  }
  return { error, gasPrice: null, gasLimit: null };
};

export default connectData(FeesEthereumKind);
