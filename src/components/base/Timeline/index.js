// @flow

// TODO: put back when we use real ids
/* eslint-disable react/no-array-index-key */

import React from "react";
import { MdClear } from "react-icons/md";
import styled, { keyframes } from "styled-components";

import colors, { opacity, lighten } from "shared/colors";
import Button from "components/base/Button";
import Box from "components/base/Box";
import { ReadOnlyProvider, useReadOnly } from "./ReadOnlyContext";

const INDENT_SIZE = 64;
const STOP_PADDING = 8;
const PREPEND_SIZE = 50;
const ROPE_SPACE = 50;
const STROKE = 2;
const STROKE_COLOR = colors.mediumGrey;

const Timeline = ({
  children,
  readOnly,
}: {
  children: React$Node,
  readOnly?: boolean,
}) => (
  <ReadOnlyProvider value={!!readOnly}>
    <TimelineContainer>{children}</TimelineContainer>
  </ReadOnlyProvider>
);

const TimelineContainer = styled.div`
  position: relative;
  margin-bottom: ${p => (p.hasRope ? ROPE_SPACE : 0)}px;
  margin-top: ${p => (p.startsWithLabel ? 32 : 0)}px;
  svg {
    pointer-events: none;
  }
`;

export const Bar = styled.div`
  position: absolute;
  pointer-events: none;
  top: ${p => (p.pos === "bot" ? STOP_PADDING + PREPEND_SIZE / 2 : 0)}px;
  bottom: ${p => (p.pos === "top" ? STOP_PADDING + PREPEND_SIZE / 2 : 0)}px;
  left: ${p =>
    (p.indentation || 0) * INDENT_SIZE + STOP_PADDING + PREPEND_SIZE / 2}px;
  width: ${STROKE}px;
  background: ${STROKE_COLOR};
  z-index: 0;
`;

type BulletVariant = "interactive" | "solid" | "plain";
export type BulletSize = "small" | "normal";

export type BarPos = "full" | "top" | "bot";
export type RopePos = "normal" | "inverted";

type TimelineStopProps = {|
  children: React$Node,
  Icon?: React$ComponentType<*>,
  indentation?: number,
  bulletVariant?: BulletVariant,
  bulletSize?: BulletSize,
  bulletColor?: string,
  bulletContent?: React$Node,
  label?: React$Node, // eslint-disable-line react/no-unused-prop-types
  rope?: RopePos,
  bar?: BarPos,
  onClick?: () => void,
  isDisabled?: boolean,
  pb?: number,
  pt?: number,
  dataType?: string,
|};

const TimelineStop = (props: TimelineStopProps) => {
  const {
    Icon,
    indentation,
    bulletVariant,
    bulletSize,
    bulletContent,
    bulletColor,
    onClick,
    rope,
    bar,
    children,
    isDisabled,
    pb,
    pt,
    dataType,
  } = props;
  const readOnly = useReadOnly();
  return (
    <TimelineStopWrapper withRope={!!rope} pb={pb} pt={pt}>
      <TimelineStopContainer
        isDisabled={isDisabled}
        offsetX={indentation ? indentation * INDENT_SIZE : 0}
        onClick={readOnly ? undefined : onClick}
        data-type={dataType}
      >
        <TimelineStopPrepend>
          <Bullet
            variant={bulletVariant}
            size={bulletSize}
            color={bulletColor}
            isDisabled={isDisabled}
          >
            {Icon && <Icon size={16} />}
            {bulletContent}
          </Bullet>
        </TimelineStopPrepend>
        <TimelineStopContent>{children}</TimelineStopContent>
      </TimelineStopContainer>
      {rope && <Rope indentOffset={0} isInverted={rope === "inverted"} />}
      {bar && <Bar indentation={indentation} pos={bar} />}
    </TimelineStopWrapper>
  );
};

const TimelineLabel = ({
  children,
  offset,
}: {
  children: React$Node,
  offset?: number,
}) => (
  <div style={{ position: "relative" }}>
    <LabelContainer offset={offset}>{children}</LabelContainer>
  </div>
);

const TimelineStopWrapper = styled.div`
  position: relative;
  margin-bottom: ${p => (p.withRope ? ROPE_SPACE : 0)}px;
  padding-bottom: ${p => p.pb || 0}px;
  padding-top: ${p => p.pt || 0}px;
`;

const LabelContainer = styled.div`
  pointer-events: none;
  position: absolute;
  top: -${p => p.offset || 0}px;
  left: 0;
  right: 0;
  padding: 5px 0;
  text-align: right;
  border-top: 1px dashed ${colors.lightGrey};
  color: ${colors.mediumGrey};
`;

type RopeProps = {
  indentOffset: number,
  isInverted: boolean,
};

const Rope = (props: RopeProps) => {
  const { indentOffset, isInverted } = props;

  const debug = false;

  const SVG_PAD = 10;
  const LEFT_HACK = 1;
  const svgWidth = STOP_PADDING + PREPEND_SIZE + INDENT_SIZE + SVG_PAD;
  const svgHeight = STOP_PADDING * 2 + ROPE_SPACE + STROKE * 2 + SVG_PAD * 2;

  const startPoint = [STOP_PADDING + PREPEND_SIZE / 2, 0];

  const endPoint = [STOP_PADDING + PREPEND_SIZE / 2 + INDENT_SIZE, ROPE_SPACE];

  if (isInverted) {
    const swap = startPoint[0];
    startPoint[0] = endPoint[0];
    endPoint[0] = swap;
  }

  const curve1 = [startPoint[0], endPoint[1]];
  const curve2 = [endPoint[0], startPoint[1]];

  return (
    <svg
      style={{
        // outline: "1px solid red",
        zIndex: 0,
        position: "absolute",
        top: "100%",
        left: indentOffset + LEFT_HACK,
        width: svgWidth,
      }}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <path
        d={`
          M ${a(startPoint)}
          C ${a(curve1)} ${a(curve2)} ${a(endPoint)}
        `}
        fill="none"
        stroke={STROKE_COLOR}
        strokeWidth={STROKE}
      />
      {debug && (
        <>
          <ellipse
            rx={2}
            ry={2}
            fill="red"
            cx={startPoint[0]}
            cy={startPoint[1]}
          />
          <ellipse rx={2} ry={2} fill="red" cx={endPoint[0]} cy={endPoint[1]} />
          <ellipse rx={2} ry={2} fill="red" cx={curve1[0]} cy={curve1[1]} />
          <ellipse rx={2} ry={2} fill="red" cx={curve2[0]} cy={curve2[1]} />
        </>
      )}
    </svg>
  );
};

const a = (arr: number[]) => arr.join(", ");

const TimelineStopContainer = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-left: ${p => p.offsetX}px;
  padding: 8px;
  border-radius: 4px;
  border: 1px dashed transparent;
  ${p =>
    p.isDisabled
      ? `
    pointer-events: none;
  `
      : ``}

  ${p =>
    p.onClick
      ? `
    &:hover {
      cursor: pointer;
      background: ${opacity(colors.bLive, 0.05)};
      border-color: ${opacity(colors.bLive, 0.2)};
    }
    &:active {
      cursor: pointer;
      background: ${opacity(colors.bLive, 0.1)};
    }
  `
      : ``}
`;

const TimelineStopPrepend = styled.div`
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const TimelineStopContent = styled.div`
  flex-grow: 1;
  margin-left: 8px;
  min-height: 50px;
  display: flex;
  align-items: center;
`;

const Bullet = styled.div`
  flex-shrink: 0;
  width: ${p => (p.size === "small" ? 40 : 50)}px;
  height: ${p => (p.size === "small" ? 40 : 50)}px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p =>
    p.color
      ? lighten(p.color, 0.7)
      : p.variant === "plain"
      ? "#eff4fe"
      : "white"};
  font-weight: bolder !important;
  font-size: 16px;
  border-radius: 50%;
  border-width: ${p => (p.variant === "interactive" ? 1 : STROKE)}px;
  border-color: ${p =>
    p.isDisabled
      ? colors.mediumGrey
      : p.color
      ? p.color
      : p.variant === "plain" || p.variant === "interactive"
      ? colors.bLive
      : STROKE_COLOR};
  color: ${p =>
    p.isDisabled
      ? colors.mediumGrey
      : p.color
      ? p.color
      : p.variant === "plain" || p.variant === "interactive"
      ? colors.bLive
      : STROKE_COLOR};
  border-style: ${p => (p.variant === "interactive" ? "dashed" : "solid")};
  position: relative;
  z-index: 2;
`;

const shadowStopEnter = keyframes`
 from {
    transform: translateX(-20px);
    opacity: 0;
 }
 to {
    transform: translateX(0);
    opacity: 1;
 }
`;

export const ShadowStopInner = styled.div`
  position: absolute;
  z-index: 3;
  background: white;
  top: 0;
  left: ${PREPEND_SIZE + STOP_PADDING + 8}px;
  right: 0;
  flex-grow: 1;
  border-radius: 4px;
  padding: 20px;
  border: 2px solid ${colors.bLive};
  box-shadow: ${colors.form.shadow.focus};
  animation: 250ms cubic-bezier(0.08, 1.46, 0.48, 1.02) ${shadowStopEnter};
  > * + * {
    margin-top: 20px;
  }
`;

const ShadowStopInnerTitleContainer = styled.div`
  color: ${colors.bLive};
  font-weight: bold;
  background: ${opacity(colors.bLive, 0.1)};
  margin: -20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ShadowStopInnerTitle = ({
  children,
  onClose,
}: {
  children: React$Node,
  onClose: () => void,
}) => (
  <ShadowStopInnerTitleContainer>
    <Box p={16}>{children}</Box>
    <Box p={8}>
      <Button
        type="link"
        variant="info"
        onClick={onClose}
        style={{ paddingLeft: 15, paddingRight: 15 }}
      >
        <MdClear size={16} />
      </Button>
    </Box>
  </ShadowStopInnerTitleContainer>
);

export { TimelineStop, TimelineLabel };
export { default as ActionableStop } from "./ActionableStop";
export { default as EditableStop } from "./EditableStop";
export { default as useClickOther } from "./useClickOther";
export { useReadOnly };
export default Timeline;
