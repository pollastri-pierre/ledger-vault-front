// @flow

import React, { Component } from "react";
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";

import colors from "shared/colors";
import InfoCircle from "components/icons/InfoCircle";
import Box from "components/base/Box";
import Text from "components/base/Text";

const BoxLined = styled(Box)`
  & + & {
    border-top: 1px solid ${colors.argile};
  }
`;

class LineRow extends Component<{
  label: React$Node,
  children?: React$Node | string,
  tooltipInfoMessage?: React$Node,
}> {
  render() {
    const { label, children, tooltipInfoMessage } = this.props;
    return (
      <BoxLined
        horizontal
        align="center"
        justify="space-between"
        py={15}
        flow={50}
      >
        <Box flow={5} horizontal align="center">
          <Text small uppercase bold noWrap>
            {label}
          </Text>
          {tooltipInfoMessage && (
            <Tooltip title={tooltipInfoMessage} placement="right">
              <InfoCircle size={10} color={colors.lead} />
            </Tooltip>
          )}
        </Box>
        {children && <Box ellipsis>{children}</Box>}
      </BoxLined>
    );
  }
}

export default LineRow;
