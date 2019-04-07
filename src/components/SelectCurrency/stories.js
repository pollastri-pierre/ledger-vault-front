/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";

import SelectCurrency from "components/SelectCurrency";

const noOptionsMessage = () => "No options";

storiesOf("selects", module).add("SelectCurrency", () => (
  <div style={{ width: 300 }}>
    <SelectCurrency
      autoFocus
      openMenuOnFocus
      placeholder={text("placeholder", "Placeholder")}
      value={null}
      onChange={action("onChange")}
      noOptionsMessage={noOptionsMessage}
    />
  </div>
));
