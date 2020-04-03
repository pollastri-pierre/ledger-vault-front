import React from "react";
import { storiesOf } from "@storybook/react";

import pageDecorator from "stories/pageDecorator";
import Emulator from "components/SoftDevices";
import { SoftDevicesProvider } from "components/SoftDevices/SoftDevicesContext";

storiesOf("components", module)
  .addDecorator(pageDecorator)
  .add("WeBlue", () => (
    <SoftDevicesProvider>
      <Emulator />
    </SoftDevicesProvider>
  ));
