// @flow

/* eslint-disable import/extensions */
import BigNumber from "bignumber.js/bignumber.js";

import type { Utxo } from "data/types";
import type { BarChartsData } from "./types";

export function groupData(data: Utxo[], granularity: number): BarChartsData[] {
  if (granularity < 1) {
    console.warn("Invalid granularity value");
    granularity = 1;
  }
  if (data.length === 0) {
    return [];
  }

  const allDataValues = data.map(d => d.value);
  const minValue = BigNumber.minimum(...allDataValues);
  const maxValue = BigNumber.maximum(...allDataValues);
  const step = maxValue.minus(minValue).dividedBy(granularity);

  const output = new Array(granularity).fill({ count: 0 }).map((item, i) => ({
    ...item,
    interval: `${minValue.plus(step.multipliedBy(i)).toFixed()}-${minValue
      .plus(step.multipliedBy(i + 1))
      .toFixed()}`,
  }));

  data.forEach(item => {
    const target = BigNumber.maximum(
      0,
      item.value
        .minus(minValue)
        .minus(1)
        .dividedBy(step)
        .integerValue(BigNumber.ROUND_FLOOR),
    );
    output[target].count++;
  });

  return output;
}
