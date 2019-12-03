// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { color, space } from "styled-system";

import { getFontSize, getFontWeight } from "./helpers";

type TextSize = "tiny" | "small" | "normal" | "large" | "header" | null;
type TextFontWeight = "bold" | "semiBold" | null;

export type TextProps = {|
  children?: React$Node,
  size?: TextSize,
  color?: string,
  fontWeight?: TextFontWeight,
  ellipsis?: boolean,
  selectable?: boolean,
  noSelect?: boolean,
  lineHeight?: number,
  uppercase?: boolean,
  noWrap?: boolean,
  textAlign?: string,
  inline?: boolean,
  italic?: boolean,
  "data-test"?: ?string,
  style?: Object,
  i18nKey?: string,
  components?: React$Node,
  values?: { [string]: string | number },
  className?: string,
  overflowWrap?: string,
|};

const TextBase = styled.div`
  ${space};
  ${color};
  display: ${p => (p.inline ? "inline-block" : "block")};
  font-family: "Inter", "Open Sans", "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: ${p => getFontSize(p)}px;
  font-weight: ${p => getFontWeight(p)} !important;
  font-style: ${p => (p.italic ? "italic" : "inherit")};
  line-height: ${p => ("lineHeight" in p ? p.lineHeight : "1.75")};
  text-transform: ${p => (p.uppercase ? "uppercase" : "")};
  white-space: ${p => (p.noWrap ? "nowrap" : "normal")};
  user-select: ${p => (p.noSelect ? "none" : "inherit")};
  text-align: ${p => (p.textAlign ? p.textAlign : "inherit")};
  overflow-wrap: ${p => (p.overflowWrap ? p.overflowWrap : "inherit")};
  ${p =>
    p.selectable
      ? `
    user-select: text;
    cursor: text;
  `
      : ``}
  ${p =>
    p.ellipsis
      ? `
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden
  `
      : ``}
`;

export default function Text(props: TextProps) {
  const { i18nKey, components, values, children } = props;

  const inner = i18nKey ? (
    <Trans i18nKey={i18nKey} components={components} values={values} />
  ) : (
    children
  );

  return <TextBase {...props}>{inner}</TextBase>;
}
