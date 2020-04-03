// @flow

import React from "react";
import { createPortal } from "react-dom";

import Emulator, { useSoftDevicesState } from "./index";

const weblueContainer = document.createElement("div");
weblueContainer.classList.add("weblue-container");
const weblueRoot = document.body && document.body.appendChild(weblueContainer);

export default () => {
  const { isWeblueOpened } = useSoftDevicesState();
  if (!isWeblueOpened) return null;
  if (!weblueRoot) return null;
  return createPortal(<Emulator />, weblueRoot);
};
