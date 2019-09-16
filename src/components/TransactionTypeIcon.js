// @flow

import React from "react";
import styled from "styled-components";

import type { TransactionType } from "data/types";

const ReceiveIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <path
      fill="currentColor"
      d="M8.75 10.44l2.72-2.72a.75.75 0 0 1 1.06 1.06l-3.896 3.897A.765.765 0 0 1 8 13c-.267 0-.5-.13-.633-.323L3.47 8.78a.75.75 0 0 1 1.06-1.06l2.72 2.72V1.193C7.25.811 7.586.5 8 .5s.75.31.75.694v9.245zm-5.833 4.81c-.369 0-.667-.336-.667-.75s.298-.75.667-.75h10.666c.369 0 .667.336.667.75s-.298.75-.667.75H2.917z"
    />
  </svg>
);

const SendIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <path
      fill="currentColor"
      d="M7.25 3.06L4.53 5.78a.75.75 0 0 1-1.06-1.06L7.366.823A.765.765 0 0 1 8 .5c.267 0 .5.13.633.323L12.53 4.72a.75.75 0 0 1-1.06 1.06L8.75 3.06v9.246c0 .383-.336.694-.75.694s-.75-.31-.75-.694V3.06zM2.917 15.25c-.369 0-.667-.336-.667-.75s.298-.75.667-.75h10.666c.369 0 .667.336.667.75s-.298.75-.667.75H2.917z"
    />
  </svg>
);

type Props = {
  type: TransactionType,
  size?: number,
};

type OpTypeInnerProps = {
  type: TransactionType,
  size: number,
};

const TransactionTypeInnerIcon = ({ type, size }: OpTypeInnerProps) =>
  type === "SEND" ? (
    <SendIcon size={size} />
  ) : type === "RECEIVE" ? (
    <ReceiveIcon size={size} />
  ) : null;

const Circle = styled.div`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  border-radius: 50%;
  color: ${p => (p.type === "RECEIVE" ? p.theme.colors.green : "inherit")};
  background: ${p =>
    p.type === "RECEIVE"
      ? p.theme.colors.translucentGreen
      : p.theme.colors.translucentGrey};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export default function TransactionTypeIcon({ type, size = 24 }: Props) {
  const inner = <TransactionTypeInnerIcon size={size - 10} type={type} />;
  return (
    <Circle size={size} type={type}>
      {inner}
    </Circle>
  );
}
