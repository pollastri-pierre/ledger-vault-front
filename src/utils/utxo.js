// @flow

export const UTXO_PICKING_STRATEGY = {
  MERGE_OUTPUTS: "Merge outputs",
  DEEP_OUTPUTS_FIRST: "Deep outputs first",
  OPTIMIZE_SIZE: "Optimize size",
};

export type UtxoPickingStrategy = $Keys<typeof UTXO_PICKING_STRATEGY>;
