// @flow

import React, { useState, useRef } from "react";
import { FaUsb, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { findDOMNode } from "react-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Button from "components/base/Button";
import Spinner from "components/base/Spinner";
import Box from "components/base/Box";
import Text from "components/base/Text";

const FORCE_WEB_USB = localStorage.getItem("FORCE_WEB_USB") === "1";

export default function TransportChooser() {
  const [isLoading, setLoading] = useState(false);
  const [isOpened, setOpened] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const btnRef = useRef(null);

  const toggle = () => {
    // $FlowFixMe
    setAnchor(findDOMNode(btnRef.current)); // eslint-disable-line react/no-find-dom-node
    setOpened(!isOpened);
  };

  const choose = transportType => () => {
    const value = transportType === "webusb" ? "1" : "0";
    localStorage.setItem("FORCE_WEB_USB", value);
    toggle();
    setLoading(true);
    // wait to allow animation to start
    setTimeout(() => {
      document.location.reload();
    }, 200);
  };

  if (isLoading) {
    return (
      <Box mr={10} mt={10}>
        <Spinner />
      </Box>
    );
  }

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
          <span>{FORCE_WEB_USB ? "WebUSB" : "U2F"}</span>
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
            <Text normal>U2F</Text>
          </Box>
        </MenuItem>
        <MenuItem onClick={choose("webusb")}>
          <Text normal>WebUSB</Text>
        </MenuItem>
      </Menu>
    </Box>
  );
}
