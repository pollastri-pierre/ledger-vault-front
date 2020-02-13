import React from "react";
import Spinner from "components/base/Spinner";
import { storiesOf } from "@storybook/react";
import { select } from "@storybook/addon-knobs";

const label = "Size";
const options = ["big", "normal", "small"];
storiesOf("components", module).add("Spinner", () => {
  return <Spinner size={select(label, options, "normal")} />;
});
