// @flow

import React from "react";
import { createPortal } from "react-dom";

import Emulator, { useEmulatorState } from "./index";

const weblueContainer = document.createElement("div");
weblueContainer.classList.add("weblue-container");
const weblueRoot = document.body && document.body.appendChild(weblueContainer);

export default () => {
  const { isOpened } = useEmulatorState();
  if (!isOpened) return null;
  if (!weblueRoot) return null;
  return createPortal(<Emulator />, weblueRoot);
};
