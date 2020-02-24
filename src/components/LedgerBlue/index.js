// @flow

import React, { useContext, createContext } from "react";
import styled from "styled-components";

import blue from "assets/img/blue.svg";

type LedgerBlueSize = "normal" | "small";

type LedgerBlueProps = {
  children?: React$Node,
  size: LedgerBlueSize,
};

type LedgerBlueContextProps = {
  size: LedgerBlueSize,
};

const SIZE_DIMENSION = {
  small: {
    height: 200,
    width: 177,
  },
  normal: {
    height: 600,
    width: 477,
  },
};

const LedgerBlueContext: React$Context<LedgerBlueContextProps> = createContext({
  size: "small",
});

export const useLedgerBlueUI = () => useContext(LedgerBlueContext);

export default ({ size, children }: LedgerBlueProps) => (
  <LedgerBlue
    height={SIZE_DIMENSION[size].height}
    width={SIZE_DIMENSION[size].width}
  >
    <LedgerBlueContext.Provider value={{ size }}>
      <ChildrenContainer size={size}>{children}</ChildrenContainer>
    </LedgerBlueContext.Provider>
  </LedgerBlue>
);

const LedgerBlue = styled.div(
  p => `
  background-image: url(${blue});
  background-repeat: no-repeat;
  background-size: ${p.width}px ${p.height}px;
  width: ${p.width}px;
  height: ${p.height}px;
`,
);
const ChildrenContainer = styled.div`
  padding: ${p =>
    p.size === "normal" ? "80px 80px 75px 75px" : "28px 38px 28px 35px"};
  height: 100%;
`;
