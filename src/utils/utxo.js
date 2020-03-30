// @flow

export const UTXO_PICKING_STRATEGY = {
  MERGE_OUTPUTS: "Merge output",
  DEEP_OUTPUTS_FIRST: "Deepest first",
  OPTIMIZE_SIZE: "Optimize size",
};

export type UtxoPickingStrategy = $Keys<typeof UTXO_PICKING_STRATEGY>;
