import React from "react";
import { storiesOf } from "@storybook/react";
import { BigNumber } from "bignumber.js";
import { number } from "@storybook/addon-knobs";

import BarCharts from "components/BarCharts";

const data = [
  { value: BigNumber(3) },
  { value: BigNumber(12) },
  { value: BigNumber(40) },
  { value: BigNumber(104) },
  { value: BigNumber(400) },
];

storiesOf("components", module).add("BarCharts", () => (
  <BarCharts data={data} granularity={number("granularity", 4)} height={300} />
));
