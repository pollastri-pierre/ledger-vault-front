import React from "react";
import { storiesOf } from "@storybook/react";

import pageDecorator from "stories/pageDecorator";
import Emulator from "components/Emulator";
import { EmulatorProvider } from "components/Emulator/EmulatorContext";

storiesOf("components", module)
  .addDecorator(pageDecorator)
  .add("WeBlue", () => (
    <EmulatorProvider>
      <Emulator />
    </EmulatorProvider>
  ));
