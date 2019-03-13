/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import DeviceInteraction from "components/DeviceInteraction";
import { delay } from "utils/promise";

import RestlayProvider from "restlay/RestlayProvider";

const mockNetwork = async () => {};

const interactions = [
  {
    needsUserInput: false,
    device: true,
    responseKey: "pubKey",
    action: async () => {
      await delay(1e3);
      return { pubKey: { pubKey: 5 } };
    }
  },
  {
    needsUserInput: false,
    responseKey: "challenge",
    action: async () => {
      await delay(1e3);
      return { challenge: "abcde" };
    }
  },
  {
    needsUserInput: true,
    device: true,
    response: "authenticate",
    action: () => Promise.resolve(true)
  }
];

storiesOf("other", module).add("DeviceInteraction", () => (
  <RestlayProvider network={mockNetwork}>
    <DeviceInteraction
      interactions={interactions}
      onSuccess={action("onSuccess")}
    />
  </RestlayProvider>
));
