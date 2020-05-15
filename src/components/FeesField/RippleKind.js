// @flow

import React, { useMemo } from "react";
import { BigNumber } from "bignumber.js";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import connectData from "restlay/connectData";
import Box from "components/base/Box";
import { InputAmount } from "components/base/form";

import type { RestlayEnvironment } from "restlay/connectData";
import type { EditProps } from "bridge/types";
import type { Transaction as RippleTransaction } from "bridge/RippleBridge";

import type {
  EstimateXRPFeesCommonPayload,
  EstimateXRPFeesPayload,
} from "bridge/fees.types";

import GenericFeesField from "./GenericFeesField";

type Props = {|
  ...EditProps<RippleTransaction>,
  restlay: RestlayEnvironment,
|};

// let's hard extract the gwei unit because it's used to display gas price
const rippleCurrency = getCryptoCurrencyById("ripple");
const dropUnit = rippleCurrency.units.find((u) => u.code === "drop");

// this will never happen, it's just to make Flow happy
if (!dropUnit) {
  throw new Error(`Can't find drop`);
}

const FeesRippleKind = (props: Props) => (
  <GenericFeesField
    {...props}
    estimateFeesPayload={useRippleFeePayload(props.transaction)}
    patchFromSuccess={patchFromSuccess}
    patchFromError={patchFromError}
    shouldFetchFees={shouldFetchFees}
    EditFees={EditFees}
  />
);

const shouldFetchFees = (transaction: RippleTransaction) => {
  return transaction.fees.fees_level !== "custom";
};

const EditFees = ({
  transaction,
  onChangeTransaction,
}: EditProps<RippleTransaction>) => {
  const { fees } = transaction;
  const handleChange = (fees) => {
    onChangeTransaction({
      ...transaction,
      fees: { ...transaction.fees, fees_level: "custom", fees },
      estimatedFees: fees,
    });
  };
  return (
    <Box align="flex-end">
      <InputAmount
        width={300}
        currency={rippleCurrency}
        initialUnit={dropUnit}
        unitLeft
        value={fees.fees || BigNumber(0)}
        onChange={handleChange}
        hideCV
        autoFocus
      />
    </Box>
  );
};

const useRippleFeePayload = (transaction) =>
  useMemo((): EstimateXRPFeesPayload => {
    const fees = transaction.fees;

    const common: EstimateXRPFeesCommonPayload = {
      amount: transaction.amount,
      recipient: transaction.recipient,
    };

    if (fees.fees_level === "custom") {
      return { fees_level: fees.fees_level, ...common, fees: fees.fees };
    }

    return { fees_level: fees.fees_level, ...common };
  }, [transaction.amount, transaction.recipient, transaction.fees]);

const patchFromSuccess = (estimatedFees) => ({
  estimatedFees: estimatedFees.fees,
  error: null,
});

const patchFromError = (error) => ({ error, estimatedFees: null });

export default connectData(FeesRippleKind);
