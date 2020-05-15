// @flow

import React, { useState, useRef } from "react";
import { storiesOf } from "@storybook/react";

import Box from "components/base/Box";
import { InputText } from "components/base/form";
import ConvertEIP55 from "components/ConvertEIP55";

const MOCK_ADDR_NO_CHECKSUM = "0x5ed8cee6b63b1c6afce3ad7c92f4fd7e1b8fad9f";

storiesOf("components", module).add("ConvertEIP55", () => <Wrapper />);

const EmptyState = () => (
  <Box p={10} align="center" justify="center">
    Address is EIP55 :)
  </Box>
);

const Wrapper = () => {
  const inputRef = useRef();
  const [address, setAddress] = useState(MOCK_ADDR_NO_CHECKSUM);
  const focus = () => inputRef.current && inputRef.current.focus();
  const reset = () => {
    setAddress(MOCK_ADDR_NO_CHECKSUM);
    focus();
  };
  const handleChange = (value) => {
    setAddress(value);
    focus();
  };
  return (
    <Box flow={20} width={500}>
      <Box flow={10}>
        <button onClick={reset}>{"use a non-eip55 address"}</button>
        <InputText inputRef={inputRef} value={address} onChange={setAddress} />
      </Box>
      <ConvertEIP55
        value={address}
        onChange={handleChange}
        EmptyState={EmptyState}
      />
    </Box>
  );
};
