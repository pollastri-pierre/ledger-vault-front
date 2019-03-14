// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { color } from "styled-system";

const Text = styled.div`
  ${color};
  display: ${p => (p.inline ? "inline-block" : "block")};
  font-family: "Open Sans", "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: ${p => (p.header ? 18 : p.small ? 11 : p.large ? 16 : 13)}px;
  font-weight: ${p => (p.bold ? "bold" : "inherit")};
  font-style: ${p => (p.italic ? "italic" : "inherit")};
  line-height: ${p => ("lineHeight" in p ? p.lineHeight : "1.75")};
  text-transform: ${p => (p.uppercase ? "uppercase" : "")};
  white-space: ${p => (p.noWrap ? "nowrap" : "normal")};
`;

export default ({
  i18nKey,
  components,
  values,
  children,
  ...props
}: {
  i18nKey?: string,
  components?: React$Node,
  children?: React$Node,
  values?: { [string]: string | number }
}) => {
  const inner = i18nKey ? (
    <Trans i18nKey={i18nKey} components={components} values={values} />
  ) : (
    children
  );
  return <Text {...props}>{inner}</Text>;
};
