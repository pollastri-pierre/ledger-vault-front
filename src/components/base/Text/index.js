// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { color, space } from "styled-system";

const Text = styled.div`
  ${space};
  ${color};
  display: ${p => (p.inline ? "inline-block" : "block")};
  font-family: "Inter", "Open Sans", "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: ${p =>
    p.header
      ? "18px"
      : p.tiny
      ? "9px"
      : p.small
      ? "11px"
      : p.large
      ? "16px"
      : p.normal
      ? "13px"
      : "inherit"};
  font-weight: ${p =>
    p.bold ? "bold" : p.semiBold ? 600 : "inherit"} !important;
  font-style: ${p => (p.italic ? "italic" : "inherit")};
  line-height: ${p => ("lineHeight" in p ? p.lineHeight : "1.75")};
  text-transform: ${p => (p.uppercase ? "uppercase" : "")};
  white-space: ${p => (p.noWrap ? "nowrap" : "normal")};
  user-select: ${p => (p.select ? "text" : p.noSelect ? "none" : "inherit")};
  text-align: ${p => (p.textAlign ? p.textAlign : "inherit")};
  ${p =>
    p.selectable
      ? `
    user-select: text;
    cursor: text;
  `
      : ``}
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
  values?: { [string]: string | number },
}) => {
  const inner = i18nKey ? (
    <Trans i18nKey={i18nKey} components={components} values={values} />
  ) : (
    children
  );
  return <Text {...props}>{inner}</Text>;
};
