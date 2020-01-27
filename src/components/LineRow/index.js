// @flow

import React, { useState } from "react";
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import colors from "shared/colors";
import InfoCircle from "components/icons/InfoCircle";
import Box from "components/base/Box";
import Text from "components/base/Text";

export const BoxLined = styled(Box)`
  & + & {
    border-top: 1px solid ${colors.argile};
  }
`;
type CollapsibleState = "collapsed" | "open" | null;

type LineRowProps = {
  label: React$Node,
  children?: React$Node | string,
  tooltipInfoMessage?: React$Node,
  vertical?: boolean,
  noOverflowHidden?: boolean,
  collapsibleState?: CollapsibleState,
  collapsibleChildren?: React$Node,
};

const iconDown = <FaChevronDown size={12} color={colors.lightGrey} />;
const iconUp = <FaChevronUp size={12} color={colors.lightGrey} />;

export default function LineRow(props: LineRowProps) {
  const {
    label,
    children,
    tooltipInfoMessage,
    vertical,
    noOverflowHidden,
    collapsibleState,
    collapsibleChildren,
  } = props;
  const [isCollapsibleContentVisible, setCollapsibleContent] = useState(
    collapsibleState !== "collapsed",
  );
  const toggleCollapsibleContent = () => {
    return setCollapsibleContent(!isCollapsibleContentVisible);
  };

  return (
    <>
      <BoxLined
        horizontal={!vertical}
        align={!vertical ? "center" : "left"}
        justify="space-between"
        py={15}
        flow={!vertical ? 50 : 10}
      >
        <Box flow={5} horizontal align="center">
          <Text size="small" uppercase fontWeight="bold" noWrap>
            {label}
          </Text>
          {tooltipInfoMessage && (
            <Tooltip title={tooltipInfoMessage} placement="right">
              <InfoCircle size={10} color={colors.lead} />
            </Tooltip>
          )}
        </Box>
        {children && (
          <Box
            ellipsis={!noOverflowHidden}
            onClick={collapsibleState ? toggleCollapsibleContent : null}
            horizontal
            align="center"
            flow={10}
            style={
              (vertical ? { ...styles.value, textAlign: "left" } : styles.value,
              {
                cursor: collapsibleState ? "pointer" : "auto",
                display: "flex",
              })
            }
          >
            {children}
            {collapsibleState
              ? isCollapsibleContentVisible
                ? iconUp
                : iconDown
              : null}
          </Box>
        )}
      </BoxLined>
      {isCollapsibleContentVisible && collapsibleChildren && (
        <Box style={{ wordBreak: "break-word" }}>{collapsibleChildren}</Box>
      )}
    </>
  );
}

const styles = {
  value: {
    userSelect: "text",
    textAlign: "right",
  },
};
