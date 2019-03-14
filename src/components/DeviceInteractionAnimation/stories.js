/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import Device from "components/DeviceInteractionAnimation";
import Box from "components/base/Box";
import { delay } from "utils/promise";
import Text from "components/base/Text";

const deviceInteraction = {
  needsUserInput: false,
  device: true,
  responseKey: "u2f_key",
  tooltip: <Text small i18nKey="common:plug_device" />,
  action: async () => {
    await delay(1000);
    return Promise.resolve();
  }
};
const deviceInteractionInteractive = {
  needsUserInput: true,
  device: true,
  responseKey: "authenticate",
  tooltip: <Text small i18nKey="common:approve_device" />,
  action: async () => {
    await delay(1000);
    return Promise.resolve();
  }
};
const serverInteraction = {
  responseKey: "server",
  action: async () => {
    await delay(1000);
    return Promise.resolve();
  }
};

storiesOf("other", module).add("DeviceInteractionAnimation", () => (
  <Box flow={80}>
    <Box>
      <Text>Initial state</Text>
      <Device interaction={deviceInteraction} numberSteps={3} />
    </Box>
    <Box>
      <Text>Waiting for server</Text>
      <Device numberSteps={5} currentStep={2} interaction={serverInteraction} />
    </Box>
    <Box>
      <Text>Needs user input:</Text>
      <Device
        numberSteps={5}
        currentStep={4}
        interaction={deviceInteractionInteractive}
      />
    </Box>
    <Box>
      <Text>Error state</Text>
      <Device
        numberSteps={5}
        currentStep={3}
        interaction={serverInteraction}
        error
      />
    </Box>
  </Box>
));
