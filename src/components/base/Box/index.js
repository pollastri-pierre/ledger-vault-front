// @flow

import styled from "styled-components";
import { space, color, borderRadius } from "styled-system";

type Props = {
  flow?: number,
  horizontal?: number,
  grow?: boolean,
  position?: "absolute" | "relative",
  align?: "center" | "flex-start" | "flex-end",
  justify?: "stretch" | "center" | "flex-start" | "flex-end",
  inline?: boolean
};

const px = (n: number) => `${n}px`;

const flexDirection = (props: Props) => (props.horizontal ? "row" : "column");
const flexGrow = (props: Props) => (props.grow ? 1 : "initial");
const align = (props: Props) => props.align || "stretch";
const justify = (props: Props) => props.justify || "flex-start";
const position = (props: Props) => props.position || "static";
const displayFlex = (props: Props) => (props.inline ? "inline-flex" : "flex");

const flow = (props: Props) => {
  if (!("flow" in props)) return;
  if (props.horizontal) {
    return `
      > * + * {
        margin-left: ${px(props.flow || 0)};
      }
    `;
  }
  return `
    > * + * {
      margin-top: ${px(props.flow || 0)};
    }
  `;
};

export default styled.div`
  display: ${displayFlex};
  flex-direction: ${flexDirection};
  flex-grow: ${flexGrow};
  align-items: ${align};
  justify-content: ${justify};

  position: ${position};

  ${borderRadius};
  ${color};
  ${space};
  ${flow};
`;
