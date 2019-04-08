/* eslint-disable react/prop-types */

import React from "react";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";
import { FaUser } from "react-icons/fa";

import { genAccounts, genUsers } from "data/mock-entities";
import { InputText } from "components/base/form";
import SelectAccount from "components/SelectAccount";
import Box from "components/base/Box";

const users = genUsers(20);
const accounts = genAccounts(10, { users });

const Row = styled(Box).attrs({
  horizontal: true,
  flow: 20,
})`
  min-height: 60px;
`;

const InputTextUncontrolled = uncontrollable(InputText, "", {
  placeholder: "Enter an account name, e.g: Banking",
  IconLeft: FaUser,
  autoFocus: true,
});

storiesOf("form", module)
  .add("InputText", () => (
    <Box p={0} flow={40}>
      <Row>
        <Box width={100}>Normal</Box>
        <Box width={300}>
          <InputText placeholder="Enter a value" />
        </Box>
      </Row>

      <Row>
        <Box width={100}>IconLeft</Box>
        <Box width={300}>
          <InputText placeholder="Enter a value" IconLeft={FaUser} />
        </Box>
      </Row>

      <Row pb={70}>
        <Box width={100}>With errors</Box>
        <Box width={300}>
          <InputText
            placeholder="Enter a value"
            errors={[
              new Error("Account already exists"),
              new Error("Unknown characters"),
            ]}
          />
        </Box>
      </Row>

      <Row>
        <Box width={100}>With warnings</Box>
        <Box width={300}>
          <InputText
            placeholder="Enter a value"
            warnings={[new Error("Unrealistic name, come on.")]}
          />
        </Box>
      </Row>
    </Box>
  ))
  .add("collection", () => (
    <Box horizontal flow={10}>
      <Box width={250}>
        <SelectAccount accounts={accounts} onChange={() => {}} />
      </Box>
      <Box grow>
        <InputTextUncontrolled />
      </Box>
    </Box>
  ));

function uncontrollable(Comp, value, props) {
  class Wrapper extends React.Component {
    state = {
      value,
    };

    handleChange = value => this.setState({ value });

    render() {
      const { value } = this.state;
      return <Comp value={value} onChange={this.handleChange} {...props} />;
    }
  }
  return Wrapper;
}
