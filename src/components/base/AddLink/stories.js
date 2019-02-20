/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import AddLink from "components/base/AddLink";
import Text from "components/base/Text";

storiesOf("Components", module).add("AddLink", () => (
  <AddLink>
    <Text>add member</Text>
  </AddLink>
));
