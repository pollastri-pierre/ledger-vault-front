import { storiesOf } from "@storybook/react";
import React from "react";
import noop from "lodash/noop";
import { FaPen } from "react-icons/fa";

import Tooltip from "components/base/Tooltip";
import Button from "components/base/Button";

storiesOf("Tooltip", module).add("on button", () => (
  <div style={{ width: 100 }}>
    <Tooltip content="Edit">
      <Button onClick={noop}>
        <FaPen />
      </Button>
    </Tooltip>
  </div>
));
