// @flow

import React, { Component } from "react";
import styled from "styled-components";

import Search from "components/icons/thin/Search";

// legacy style. needs to be dropped as well.
const Container = styled.div`
  // /!\
  //
  // TODO: DROP THIS ASAP
  //

  display: flex;
  align-items: center;
  margin-bottom: 20px;

  & > div {
    flex: 1;
    margin-left: 30px;
    font-size: 11px;
    color: #767676;

    & > h3 {
      marginbottom: 8px;
      font-size: 11px;
      font-weight: 600;
      color: black;
    }
  }
`;

class SearchFiltersCardHeader extends Component<*> {
  render() {
    return (
      <Container>
        <Search width={24} height={32} color="#ccc" />
        <div>
          <h3>FILTERS</h3>
          <span>Find operations</span>
        </div>
      </Container>
    );
  }
}

export default SearchFiltersCardHeader;
