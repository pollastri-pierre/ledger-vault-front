// @flow

import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import qs from "query-string";
import styled from "styled-components";
import type { ObjectParameters } from "query-string";

import colors from "shared/colors";

const Container = styled.div`
  border-bottom: 2px solid ${colors.legacyTranslucentGrey3};
  color: ${colors.legacyViolet};
  font-family: monospace;
  padding: 10px 70px 10px 0;
  white-space: pre-wrap;
  word-break: break-all;
  position: relative;
`;

const Method = styled.span`
  cursor: default;
  user-select: none;
  padding-right: 10px;
  color: ${colors.legacyTranslucentGrey5};
  font-weight: bold;
`;

const Copy = styled.div`
  background: ${colors.legacyTranslucentGrey3};
  user-select: none;
  color: ${colors.legacyDarkGrey6};
  font-size: 10px;
  padding: 5px 10px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
    background: ${colors.legacyLightGrey12};
  }

  &:active {
    background: ${colors.legacyTranslucentGrey2};
  }
`;

type Props = {
  queryParams: ObjectParameters,
  prefix: string,
};

export default ({ queryParams, prefix = "url", ...props }: Props) => {
  const q = qs.stringify(queryParams);
  const url = `/${prefix}${q ? `?${q}` : ""}`;
  return (
    <Container {...props}>
      <Method>GET</Method>
      <CopyToClipboard text={url}>
        <Copy>copy</Copy>
      </CopyToClipboard>
      {url}
    </Container>
  );
};
