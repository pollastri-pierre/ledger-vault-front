// @flow

import React, { useState } from "react";
import { BigNumber } from "bignumber.js";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import { storiesOf } from "@storybook/react";

import { InputAmount } from "components/base/form";
import Box from "components/base/Box";

const bitcoin: CryptoCurrency = getCryptoCurrencyById("bitcoin");

storiesOf("other", module).add("InputAmount", () => {
  return <Wrapper currency={bitcoin} />;
});

function Wrapper() {
  const [value, setValue] = useState(BigNumber(5e8));
  const onChange = value => setValue(value);
  return (
    <Box width={400}>
      <InputAmount currency={bitcoin} value={value} onChange={onChange} />
    </Box>
  );
}
