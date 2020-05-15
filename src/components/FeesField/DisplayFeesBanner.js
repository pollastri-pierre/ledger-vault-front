// @flow

import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronDown } from "react-icons/fa";

import Spinner from "components/base/Spinner";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import CounterValue from "components/CounterValue";
import Box from "components/base/Box";
import { Label } from "components/base/form";

import type { WalletBridge } from "bridge/types";
import type { Account } from "data/types";

type Props<T> = {|
  bridge: WalletBridge<T>,
  transaction: T,
  account: Account,
  isFetching: boolean,
  DisplayFees?: React$ComponentType<{| transaction: T |}>,
|};

const DisplayFeesBanner = <T>(props: Props<T>) => {
  const { bridge, transaction, account, isFetching, DisplayFees } = props;
  const [isCollapsed, setCollapsed] = useState(true);

  const estimatedFees = bridge.getEstimatedFees(transaction);
  const toggle = () => setCollapsed(!isCollapsed);

  const isCollapsible = !!DisplayFees;
  const isInteractive = !!estimatedFees && isCollapsible && !isFetching;
  const onClick = isInteractive ? toggle : undefined;

  return (
    <Container
      isCollapsible={isCollapsible}
      isCollapsed={isCollapsed}
      isInteractive={isInteractive}
      onClick={onClick}
    >
      <Box horizontal align="center" justify="space-between">
        <Label noPadding>Max fees</Label>
        <Box>
          {isFetching ? (
            <Box horizontal align="center" justify="center" flow={8}>
              <span>Estimating fees...</span>
              <Spinner />
            </Box>
          ) : estimatedFees ? (
            <Box horizontal align="center" flow={8}>
              <span>
                {"~ "}
                <CounterValue fromAccount={account} value={estimatedFees} />
              </span>
              <strong>
                <CurrencyAccountValue account={account} value={estimatedFees} />
              </strong>
              {isCollapsible && (
                <FaChevronDown
                  style={{
                    opacity: 0.6,
                    transition:
                      "400ms cubic-bezier(.51,-0.53,.35,1.52) transform",
                    transform: `rotate(${isCollapsed ? 0 : "-180"}deg)`,
                  }}
                />
              )}
            </Box>
          ) : (
            "N/A"
          )}
        </Box>
      </Box>
      {DisplayFees && !isCollapsed && (
        <DisplayFeesContainer>
          <DisplayFees transaction={transaction} />
        </DisplayFeesContainer>
      )}
    </Container>
  );
};

const Container = styled.div((p) => {
  const { isInteractive } = p;

  const hoverStyle = `
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.07);
  `;

  return `
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 12px;

  > * + * {
    margin-top: 8px;
  }

  &:hover {
    ${isInteractive ? hoverStyle : ""}
  }

  // not very ouf but redesign incoming
  ${Label} {
    color: rgba(0, 0, 0, 0.5);
  }
`;
});

const DisplayFeesContainer = styled.div`
  border-left: 3px solid rgba(0, 0, 0, 0.1);
  padding: 0 8px;
`;

export default DisplayFeesBanner;
