import React from "react";
import { storiesOf } from "@storybook/react";
import { boolean } from "@storybook/addon-knobs";

import UpdateDevice from "components/UpdateDevice";

import pageDecorator from "stories/pageDecorator";

storiesOf("components", module)
  .addDecorator(pageDecorator)
  .add("Updater", () => <Wrapper />);

export const Wrapper = () => {
  const isDevice = boolean("with device", true);
  return <UpdateDevice isDemoMode={!isDevice} key={isDevice.toString()} />;
};
