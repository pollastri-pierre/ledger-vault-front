// @flow

import React from "react";
import { storiesOf } from "@storybook/react";

import { Toast } from "components/base/Toast";
import Box from "components/base/Box";
import pageDecorator from "stories/pageDecorator";

storiesOf("components/Toast", module)
  .addDecorator(pageDecorator)
  .add("types", () => (
    <Box flow={20}>
      <Toast type="info">soaentuhaos</Toast>
      <Toast type="success">soaentuhaos</Toast>
      <Toast type="warning">
        I am a super useful and informative message that pops nicely.
      </Toast>
      <Toast type="error">
        I am a super useful and informative message that pops nicely.
      </Toast>
    </Box>
  ));
