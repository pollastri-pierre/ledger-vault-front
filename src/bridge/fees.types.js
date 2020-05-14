// @flow

import type { BigNumber } from "bignumber.js";

import type { UtxoPickingStrategy } from "utils/utxo";

export type FeesLevelPredefined = "slow" | "normal" | "fast";
export type FeesLevelCustom = "custom";

export type FeesLevel = FeesLevelPredefined | FeesLevelCustom;

type FeesPredefined = {|
  fees_level: FeesLevelPredefined,
|};

type BTCFeesCustom = {|
  fees_level: FeesLevelCustom,
  fees_per_byte: BigNumber,
|};

export type BTCFees = FeesPredefined | BTCFeesCustom;

export type EstimateBTCFeesCommonPayload = {|
  amount: BigNumber,
  recipient: string,
  // FIXME `utxo` is misleading name
  utxo?: number,
  utxo_picking_strategy?: UtxoPickingStrategy,
|};

export type EstimateBTCFeesPredefinedPayload = {|
  ...EstimateBTCFeesCommonPayload,
  ...FeesPredefined,
|};

export type EstimateBTCFeesCustomPayload = {|
  ...EstimateBTCFeesCommonPayload,
  ...BTCFeesCustom,
|};

export type EstimateBTCFeesPayload =
  | EstimateBTCFeesPredefinedPayload
  | EstimateBTCFeesCustomPayload;

export type EstimateBTCFeesResponse = {|
  type: "EstimateBTCFeesResponse",
  fees: BigNumber,
  max_amount: BigNumber,
|};

type ETHFeesCustom = {|
  fees_level: FeesLevelCustom,
  gas_price: BigNumber | null,
  gas_limit: BigNumber | null,
|};

export type ETHFees = ETHFeesCustom | FeesPredefined;

export type EstimateETHFeesCommonPayload = {|
  recipient: string,
  amount: BigNumber,
|};

type EstimateETHFeesPredefinedPayload = {|
  ...EstimateETHFeesCommonPayload,
  ...FeesPredefined,
|};

type EstimateETHFeesCustomPayload = {|
  ...EstimateETHFeesCommonPayload,
  ...ETHFeesCustom,
|};

export type EstimateETHFeesPayload =
  | EstimateETHFeesPredefinedPayload
  | EstimateETHFeesCustomPayload;

export type EstimateETHFeesResponse = {|
  fees: BigNumber,
  gas_limit: BigNumber,
  gas_price: BigNumber,
|};

type XRPFeesCustom = {|
  fees_level: FeesLevelCustom,
  fees: BigNumber,
|};

export type XRPFees = FeesPredefined | XRPFeesCustom;

export type EstimateXRPFeesCommonPayload = {|
  amount: BigNumber,
  recipient: string,
|};

export type EstimateXRPFeesPredefinedPayload = {|
  ...EstimateXRPFeesCommonPayload,
  ...XRPFees,
|};

export type EstimateXRPFeesCustomPayload = {|
  ...EstimateXRPFeesCommonPayload,
  ...XRPFees,
|};

export type EstimateXRPFeesPayload =
  | EstimateXRPFeesPredefinedPayload
  | EstimateXRPFeesCustomPayload;

export type EstimateXRPFeesResponse = {|
  fees: BigNumber,
|};

export type EstimateFeesPayload =
  | EstimateBTCFeesPayload
  | EstimateETHFeesPayload
  | EstimateXRPFeesPayload;
