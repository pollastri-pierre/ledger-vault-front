// @flow

import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import { FaTimesCircle } from "react-icons/fa";

import colors from "shared/colors";

import Box from "components/base/Box";
import Text from "components/base/Text";

type Props = {
  title: string,
  nbResults?: number,
  onClear?: () => void
};

class FiltersCardHeader extends PureComponent<Props> {
  render() {
    const { title, nbResults, onClear } = this.props;
    const showNbResults = typeof nbResults === "number";
    return (
      <Box horizontal align="flex-start" flow={20}>
        <Box grow>
          <Text header color={colors.shark}>
            {title}
          </Text>
          <Text small color={colors.mediumGrey}>
            {showNbResults ? `${nbResults || 0} result(s) found` : "Loading..."}
          </Text>
        </Box>
        {onClear && (
          <ClearButton onClick={onClear}>
            <FaTimesCircle style={{ marginRight: 5 }} />
            Clear filters
          </ClearButton>
        )}
      </Box>
    );
  }
}

const ClearButton = styled(Button).attrs({
  color: "secondary"
})`
  && {
    padding: 10px;
    min-height: 0;
    font-size: 11px;
    background-color: rgba(245, 0, 87, 0.05);
    &:hover {
      background-color: rgba(245, 0, 87, 0.08);
    }
  }
`;

export default FiltersCardHeader;
