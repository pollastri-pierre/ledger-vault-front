/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import SpinnerAccounts from "components/spinners/SpinnerAccounts";
import SpinnerCard from "components/spinners/SpinnerCard";

storiesOf("Components/spinners", module)
  .add("SpinnerAccounts", () => <SpinnerAccounts />)
  .add("SpinnerCard", () => <SpinnerCard />);
