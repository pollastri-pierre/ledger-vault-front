/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import Device from "components/DeviceInteractionAnimation";
import Box from "components/base/Box";
import Text from "components/base/Text";

storiesOf("other", module).add("DeviceInteractionAnimation", () => (
  <Box flow={20}>
    <Box>
      <Text>Initial state</Text>
      <Device currentActionType="device" />
    </Box>
    <Box>
      <Text>Waiting for server</Text>
      <Device numberSteps={5} currentStep={2} currentActionType="server" />
    </Box>
    <Box>
      <Text>Needs user input:</Text>
      <Device
        numberSteps={5}
        currentStep={4}
        currentActionType="device"
        needsAction
      />
    </Box>
    <Box>
      <Text>Error state</Text>
      <Device
        numberSteps={5}
        currentStep={3}
        currentActionType="device"
        needsAction
        error
      />
    </Box>
  </Box>
));
