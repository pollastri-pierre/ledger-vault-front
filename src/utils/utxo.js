// @flow

export const UTXO_PICKING_STRATEGY = {
  MERGE_OUTPUTS: "Lowest UTXO amounts",
  DEEP_OUTPUTS_FIRST: "Highest confirmations",
  OPTIMIZE_SIZE: "Highest UTXO amounts",
};

export type UtxoPickingStrategy = $Keys<typeof UTXO_PICKING_STRATEGY>;
