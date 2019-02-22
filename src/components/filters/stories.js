/* eslint-disable react/prop-types */

import React, { Component } from "react";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";

import { genMembers, genAccounts } from "data/mock-entities";

import Box from "components/base/Box";
import { FiltersOperations } from "components/filters";

const members = genMembers(20);
const accounts = genAccounts(10, { members });

const FiltersOperationsWrapped = wrap(
  FiltersOperations,
  `currency=${accounts[0].currency_id}&accounts=${accounts[0].id}`,
  {
    accounts
  }
);

storiesOf("Components/filters", module).add("FilterOperations", () => (
  <FiltersOperationsWrapped />
));

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #eee;
  padding: 40px;
`;

const preStyle = {
  padding: 10,
  borderRadius: 3,
  color: "#555",
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
  minHeight: 52
};

function wrap(Comp, query, additionalProps = {}) {
  class Wrapper extends Component {
    state = {
      query
    };

    handleChange = query => this.setState({ query });

    render() {
      const { query } = this.state;
      return (
        <Container>
          <Box flow={20}>
            <pre style={preStyle}>{query || "<empty>"}</pre>
            <Comp
              width={400}
              query={query}
              onChange={this.handleChange}
              {...additionalProps}
            />
          </Box>
        </Container>
      );
    }
  }
  return Wrapper;
}
