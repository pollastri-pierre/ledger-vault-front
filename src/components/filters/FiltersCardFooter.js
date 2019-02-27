// @flow

import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import styled from "styled-components";

import Box from "components/base/Box";

type Props = {
  onClear: () => void
};

const ClearButton = styled(Button).attrs({
  color: "secondary"
})`
  && {
    font-size: 11px;
    background-color: rgba(245, 0, 87, 0.08);
  }
`;

class FiltersCardFooter extends PureComponent<Props> {
  render() {
    const { onClear } = this.props;
    return (
      <Box align="flex-end" p={20}>
        <ClearButton onClick={onClear}>Clear filters</ClearButton>
      </Box>
    );
  }
}

export default FiltersCardFooter;
