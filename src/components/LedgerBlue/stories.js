/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { boolean, select } from "@storybook/addon-knobs";

import LedgerBlue from "components/LedgerBlue";
import {
  LedgerManager,
  Processing,
  OsUpdater,
  DashBoard,
  UpdateFirmware,
} from "components/LedgerBlue/screens";

const label = "Size";
const options = ["normal", "small"];

storiesOf("LedgerBlue", module)
  .add("Ledger Manager", () => (
    <LedgerBlue size={select(label, options, "small")}>
      <LedgerManager displayFullText={boolean("displayFullText", false)} />
    </LedgerBlue>
  ))
  .add("OS Updater", () => (
    <LedgerBlue size={select(label, options, "small")}>
      <OsUpdater displayFullText={boolean("displayFullText", false)} />
    </LedgerBlue>
  ))
  .add("Processing", () => (
    <LedgerBlue size={select(label, options, "small")}>
      <Processing displayFullText={boolean("displayFullText", false)} />
    </LedgerBlue>
  ))
  .add("DashBoard", () => (
    <LedgerBlue size={select(label, options, "small")}>
      <DashBoard displayFullText={boolean("displayFullText", false)} />
    </LedgerBlue>
  ))
  .add("UpdateFirmware", () => (
    <LedgerBlue size={select(label, options, "small")}>
      <UpdateFirmware displayFullText={boolean("displayFullText", false)} />
    </LedgerBlue>
  ));
