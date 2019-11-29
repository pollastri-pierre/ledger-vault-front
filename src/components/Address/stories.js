import React from "react";
import { storiesOf } from "@storybook/react";
import { genAddresses } from "data/mock-entities";

import Address from "components/Address";

const grid = {
  display: "grid",
  gridGap: 8,
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr) )",
};
const addresses = genAddresses(20);
storiesOf("components", module).add("Address", () => (
  <div style={grid}>
    <Address address={addresses[1]} history="ADD" />
    <Address address={addresses[2]} history="ADD" />
    <Address address={addresses[3]} history="ADD" />
    <Address address={addresses[4]} history="REMOVE" />
    <Address address={addresses[5]} history="REMOVE" />
    <Address address={addresses[6]} history="REMOVE" />
    <Address address={addresses[7]} />
    <Address address={addresses[8]} history="ADD" />
    <Address address={addresses[9]} />
    <Address address={addresses[10]} />
  </div>
));
