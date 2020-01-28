// @flow

/* eslint-disable import/extensions */
// FIXME for no reason jest can't handle normal import, so forced
// to import like this:
import BigNumber from "bignumber.js/bignumber.js";
/* eslint-enable import/extensions */

import { groupData } from "./helpers";

describe("BarCharts helpers", () => {
  it("should return empty if empty data", () => {
    const granularity = 4;
    const data = [];
    const result = groupData(data, granularity);
    const expected = [];
    expect(result).toEqual(expected);
  });

  it("should group basic data", () => {
    const granularity = 4;
    const data = [
      { value: BigNumber(3) },
      { value: BigNumber(12) },
      { value: BigNumber(43) },
    ];
    const result = groupData(data, granularity);
    const expected = [
      { count: 2, interval: "3-13" },
      { count: 0, interval: "13-23" },
      { count: 0, interval: "23-33" },
      { count: 1, interval: "33-43" },
    ];
    expect(result).toEqual(expected);
  });

  it("should group data with big gap", () => {
    const granularity = 4;
    const data = [
      { value: BigNumber(3) },
      { value: BigNumber(12) },
      { value: BigNumber(40) },
      { value: BigNumber(104) },
      { value: BigNumber(400) },
    ];
    const result = groupData(data, granularity);
    const expected = [
      { count: 3, interval: "3-102.25" },
      { count: 1, interval: "102.25-201.5" },
      { count: 0, interval: "201.5-300.75" },
      { count: 1, interval: "300.75-400" },
    ];
    expect(result).toEqual(expected);
  });
});
