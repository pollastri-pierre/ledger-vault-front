// @flow

import React, { useState, useRef, useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import styled from "styled-components";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { FaCopy } from "react-icons/fa";

import Text from "components/base/Text";

import colors from "shared/colors";

type Props = {
  text: string,
  children?: React$Node,
};

export default function Copy(props: Props) {
  const { text, children } = props;
  const [copied, setCopied] = useState(false);
  const isUnmounted = useRef();

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => {
      if (isUnmounted.current) return;
      setCopied(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  return (
    <Container>
      <Text data-test="Copy_value" style={textStyles}>
        {children || text}
      </Text>
      <Tooltip title={copied ? "Copied!" : "Copy"} placement="right">
        <CopyToClipboard data-test="Copy" text={text} onCopy={onCopy}>
          <IconContainer>
            <FaCopy />
          </IconContainer>
        </CopyToClipboard>
      </Tooltip>
    </Container>
  );
}

const textStyles = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  padding: 5,
  userSelect: "text",
  whiteSpace: "nowrap",
};

const Container = styled.div`
  display: flex;
  background: ${colors.form.bg};
  border: 1px solid ${colors.legacyLightGrey1};
  border-radius: 4px;
  padding: 2px;
  cursor: text;
`;

const IconContainer = styled.div`
  cursor: pointer;
  width: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  color: ${colors.spinner};
  transition: 100ms ease background-color;
  &:hover {
    background: ${colors.legacyLightGrey10};
    color: ${colors.legacyDarkGrey5};
  }
  &:active {
    background: ${colors.legacyLightGrey9};
    color: ${colors.legacyDarkGrey5};
  }
`;
