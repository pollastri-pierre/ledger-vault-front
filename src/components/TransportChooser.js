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
import { getPreferredTransport, setPreferredTransport } from "device";
import { useEmulatorDispatch } from "components/Emulator";

const ENABLE_WEBLUE =
  window.config.ENABLE_WEBLUE || localStorage.getItem("ENABLE_WEBLUE") === "1";

export default function TransportChooser() {
  const [transport, setTransport] = useState(getPreferredTransport());
  const dispatch = useEmulatorDispatch();

  const choose = transportType => () => {
    setPreferredTransport(transportType);
    setTransport(transportType);
    if (transportType === "weblue") {
      dispatch({ type: "OPEN" });
    } else {
      dispatch({ type: "CLOSE" });
    }
  };

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
          </MenuListStyle>
        </>
      )}
    </Menu>
  );
}
