// @flow

import styled from "styled-components";
import {
  space,
  color,
  borderRadius,
  width,
  height,
  flex,
  flexWrap,
  alignSelf,
} from "styled-system";

type Props = {
  flow?: number,
  horizontal?: number,
  grow?: boolean,
  position?: "absolute" | "relative",
  align?: "center" | "flex-start" | "flex-end",
  justify?: "stretch" | "center" | "flex-start" | "flex-end",
  inline?: boolean,
  overflow?: string,
};

export const px = (n: number) => `${n}px`;

const flexDirection = (props: Props) => (props.horizontal ? "row" : "column");
const flexGrow = (props: Props) => (props.grow ? 1 : "initial");
const align = (props: Props) => props.align || "stretch";
const justify = (props: Props) => props.justify || "flex-start";
const position = (props: Props) => props.position || "static";
const displayFlex = (props: Props) => (props.inline ? "inline-flex" : "flex");
const flexShrink = (props: Props) => ("noShrink" in props ? 0 : 1);
const overflow = (props: Props) =>
  "overflow" in props ? props.overflow : "unset";
const ellipsis = (props: Props) => {
  if (!("ellipsis" in props)) return "";
  return `
    overflow: hidden;
    text-overflow: ellipsis;
  `;
};

const flow = (props: Props) => {
  if (!("flow" in props)) return;
  if (props.horizontal) {
    return `
      > * + * {
        margin-left: ${px(props.flow || 0)} !important;
      }
    `;
  }
  return `
    > * + * {
      margin-top: ${px(props.flow || 0)} !important;
    }
  `;
};

export default styled.div`
  display: ${displayFlex};
  flex-direction: ${flexDirection};
  flex-grow: ${flexGrow};
  flex-shrink: ${flexShrink};
  align-items: ${align};
  justify-content: ${justify};
  overflow: ${overflow};

  position: ${position};

  ${borderRadius};
  ${flex};
  ${alignSelf};
  ${flexWrap};
  ${color};
  ${space};
  ${flow};
  ${width};
  ${height};
  ${ellipsis};
`;
