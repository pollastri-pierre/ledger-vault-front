// @flow

import React, { useMemo } from "react";
import { BigNumber } from "bignumber.js";

import connectData from "restlay/connectData";

import type { RestlayEnvironment } from "restlay/connectData";
import type { EditProps } from "bridge/types";
import type { Transaction as BitcoinTransaction } from "bridge/BitcoinBridge";

import type {
  EstimateBTCFeesPayload,
  EstimateBTCFeesCommonPayload,
} from "bridge/fees.types";

import GenericFeesField from "./GenericFeesField";

type Props = {|
  ...EditProps<BitcoinTransaction>,
  restlay: RestlayEnvironment,
|};

const FeesBitcoinKind = (props: Props) => (
  <GenericFeesField
    {...props}
    estimateFeesPayload={useBitcoinFeePayload(props.transaction)}
    patchFromSuccess={patchFromSuccess}
    patchFromError={patchFromError}
  />
);

const patchFromSuccess = (estimatedFees, transaction) => {
  const patch: $Shape<BitcoinTransaction> = {
    estimatedFees: estimatedFees.fees,
    estimatedMaxAmount: estimatedFees.max_amount,
    fees_per_byte: estimatedFees.fees_per_byte,
    error: null,
  };

  // See VFE-161
  //
  // In *some cases* of UTXOs consolidation, the front calculate a certain
  // amount based on UTXOs but the backend-sent max_amount is lower than
  // this, because of fees (sometimes.. it's OK). So in this case, we reset
  // the amount to max_amount, because the tx is created with UTXOs amount
  // anyway, so we don't really care about the amount.
  //
  const shouldResetToMax = shouldResetAmountToMax(
    transaction.expectedNbUTXOs,
    transaction.amount,
    estimatedFees,
  );

  if (shouldResetToMax) {
    Object.assign(patch, { amount: estimatedFees.max_amount });
  }

  return patch;
};

const patchFromError = error => ({
  error,
  estimatedFees: null,
  estimatedMaxAmount: null,
});

const useBitcoinFeePayload = transaction =>
  useMemo((): EstimateBTCFeesPayload => {
    // cannot destructure because eslint react-hooks is lost
    const amount = transaction.amount;
    const recipient = transaction.recipient;
    const fees = transaction.fees;
    const expectedNbUTXOs = transaction.expectedNbUTXOs;
    const utxoPickingStrategy = transaction.utxoPickingStrategy;

    const common: EstimateBTCFeesCommonPayload = {
      amount,
      recipient,
    };

    if (expectedNbUTXOs) {
      // FIXME `utxo` is misleading name
      Object.assign(common, {
        utxo: expectedNbUTXOs,
      });
    }

    if (utxoPickingStrategy) {
      Object.assign(common, {
        utxo_picking_strategy: utxoPickingStrategy,
      });
    }

    if (fees.fees_level === "custom") {
      return {
        fees_level: fees.fees_level,
        fees_per_byte: BigNumber(0),
        ...common,
      };
    }

    return { fees_level: fees.fees_level, ...common };
  }, [
    transaction.amount,
    transaction.recipient,
    transaction.fees,
    transaction.expectedNbUTXOs,
    transaction.utxoPickingStrategy,
  ]);

function shouldResetAmountToMax(expectedNbUTXOs, amount, estimatedFees) {
  const isUTXOBasedFees = !!expectedNbUTXOs;
  const isAmountTooHigh = amount.isGreaterThan(estimatedFees.max_amount);
  return isUTXOBasedFees && isAmountTooHigh;
}

export default connectData(FeesBitcoinKind);
