/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import DeviceInteraction from "components/DeviceInteraction";
import network from "network";
import { getPublicKey, authenticate } from "device/interface";
import { U2F_PATH } from "device";

const interactions = [
  {
    needsUserInput: false,
    device: true,
    response: "pubKey",
    action: ({ transport }) => getPublicKey(transport, U2F_PATH)
  },
  {
    needsUserInput: false,
    response: "challenge",
    action: ({ pubKey: { pubKey } }) =>
      network(`/authentication/${pubKey}/challenge`)
  },
  {
    needsUserInput: true,
    device: true,
    response: "authenticate",
    action: ({ transport, challenge }) => authenticate(transport, challenge)
  }
];

storiesOf("other", module).add("DeviceInteraction", () => (
  <DeviceInteraction interactions={interactions} />
));
