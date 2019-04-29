/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import Status from "components/Status";
import Box from "components/base/Box";

const statuses = ["ABORTED", "ACTIVE", "PENDING_APPROVAL", "VIEW_ONLY"];

storiesOf("components", module).add("Status", () => (
  <Box flow={10}>
    {statuses.map(status => (
      <Box key={status} horizontal>
        <Status status={status} />
      </Box>
    ))}
  </Box>
));
