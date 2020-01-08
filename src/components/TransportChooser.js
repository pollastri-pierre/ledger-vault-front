// @flow

import React, { useState, useRef } from "react";
import { FaUsb, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { findDOMNode } from "react-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Button from "components/base/Button";
import Box from "components/base/Box";
import Text from "components/base/Text";

import { getPreferredTransport, setPreferredTransport } from "device";

export default function TransportChooser() {
  const [transport, setTransport] = useState(getPreferredTransport());
  const [isOpened, setOpened] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const btnRef = useRef(null);

  const toggle = () => {
    // $FlowFixMe
    setAnchor(findDOMNode(btnRef.current)); // eslint-disable-line react/no-find-dom-node
    setOpened(!isOpened);
  };

  const choose = transportType => () => {
    setPreferredTransport(transportType);
    setTransport(transportType);
    toggle();
  };

  return (
    <Box position="relative">
      <Button
        size="small"
        type="link"
        variant="primary"
        onClick={toggle}
        ref={btnRef}
      >
        <Box horizontal align="center" flow={5}>
          <FaUsb />
          <span>{transport === "webusb" ? "WebUSB" : "U2F"}</span>
          {isOpened ? <FaCaretUp /> : <FaCaretDown />}
        </Box>
      </Button>
      <Menu
        id="transport-chooser"
        anchorEl={anchor}
        disableAutoFocusItem
        open={isOpened}
        onClose={toggle}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={choose("u2f")}>
          <Box>
            <Text size="normal">U2F</Text>
          </Box>
        </MenuItem>
        <MenuItem onClick={choose("webusb")}>
          <Text size="normal">WebUSB</Text>
        </MenuItem>
      </Menu>
    </Box>
  );
}
