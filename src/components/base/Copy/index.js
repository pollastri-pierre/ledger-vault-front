// @flow

import React, { useState, useRef, useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import styled from "styled-components";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { FaCopy } from "react-icons/fa";

import Text from "components/base/Text";

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
      <Text style={textStyles}>{children || text}</Text>
      <Tooltip title={copied ? "Copied!" : "Copy"} placement="right">
        <CopyToClipboard text={text} onCopy={onCopy}>
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
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;
`;

const IconContainer = styled.div`
  width: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  color: hsl(0, 0%, 60%);
  transition: 150ms ease background-color;
  &:hover {
    background: hsl(0, 0%, 95%);
    color: hsl(0, 0%, 40%);
  }
  &:active {
    background: hsl(0, 0%, 90%);
    color: hsl(0, 0%, 40%);
  }
`;
