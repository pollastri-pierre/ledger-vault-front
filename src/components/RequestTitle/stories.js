/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import Box from "components/base/Box";
import RequestTitle from "components/RequestTitle";

storiesOf("components", module).add("RequestTitle", () => (
  <Box flow={10} p={10}>
    <RequestTitle type="CREATE_GROUP" entityTitle="APAC" />
    <RequestTitle type="REVOKE_GROUP" />
    <RequestTitle type="EDIT_GROUP" />
  </Box>
));
