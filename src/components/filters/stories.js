/* eslint-disable react/prop-types */

import React, { Component } from "react";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";

import Box from "components/base/Box";
import { FiltersOperations } from "components/filters";

const FiltersOperationsWrapped = wrap(FiltersOperations, "currency=bitcoin");

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
  border: "1px solid rgba(0, 0, 0, 0.05)"
};

function wrap(Comp, query) {
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
            <Comp width={400} query={query} onChange={this.handleChange} />
          </Box>
        </Container>
      );
    }
  }
  return Wrapper;
}
