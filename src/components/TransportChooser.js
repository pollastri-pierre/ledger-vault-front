// @flow

import React, { useState } from "react";
import { FaCaretDown, FaCaretUp, FaUsb } from "react-icons/fa";

import Box from "components/base/Box";
import Button from "components/base/Button";
import {
  Menu,
  MenuButtonStyle,
  MenuListStyle,
  MenuItemStyle,
} from "components/base/Menu";
import { getPreferredTransport, setPreferredTransport } from "device/transport";
import { useSoftDevicesDispatch } from "components/SoftDevices";

const ENABLE_WEBLUE =
  window.config.ENABLE_WEBLUE || localStorage.getItem("ENABLE_WEBLUE") === "1";

const ENABLE_SOFTWARE =
  window.config.ENABLE_SOFTWARE ||
  localStorage.getItem("ENABLE_SOFTWARE") === "1";

export default function TransportChooser() {
  const [transport, setTransport] = useState(getPreferredTransport());
  const dispatch = useSoftDevicesDispatch();

  const choose = transportType => () => {
    setPreferredTransport(transportType);
    setTransport(transportType);
    if (transportType === "weblue") {
      dispatch({ type: "OPEN_WEBLUE" });
    } else if (transportType === "software") {
      dispatch({ type: "OPEN_SOFTWARE" });
    } else {
      dispatch({ type: "SET_HARDWARE_MODE" });
    }
  };

  // cf https://ledgerhq.atlassian.net/browse/VFE-214
  if (window.config.ONLY_WEBLUE) {
    return null;
  }

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButtonStyle>
            <Button tabIndex={-1} size="small" type="link" variant="primary">
              <Box horizontal align="center" flow={5}>
                <FaUsb />
                <span>
                  {transport === "webusb"
                    ? "WebUSB"
                    : transport === "weblue"
                    ? "WeBlue"
                    : transport === "u2f"
                    ? "U2F"
                    : transport === "software"
                    ? "Software"
                    : ""}
                </span>
                {isOpen ? <FaCaretUp /> : <FaCaretDown />}
              </Box>
            </Button>
          </MenuButtonStyle>
          <MenuListStyle>
            <MenuItemStyle onSelect={choose("u2f")}>U2F</MenuItemStyle>
            <MenuItemStyle onSelect={choose("webusb")}>WebUSB</MenuItemStyle>
            {ENABLE_WEBLUE && (
              <MenuItemStyle onSelect={choose("weblue")}>WeBlue</MenuItemStyle>
            )}
            {ENABLE_SOFTWARE && (
              <MenuItemStyle onSelect={choose("software")}>
                Software
              </MenuItemStyle>
            )}
          </MenuListStyle>
        </>
      )}
    </Menu>
  );
}
