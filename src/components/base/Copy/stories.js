import React from "react";
import { storiesOf } from "@storybook/react";

import Copy from "components/base/Copy";

storiesOf("components/base", module).add("Copy", () => (
  <div style={{ width: 200 }}>
    <Copy text="1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX" />
  </div>
));
