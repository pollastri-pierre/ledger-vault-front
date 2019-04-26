// @flow

import React, { PureComponent } from "react";
import Color from "color";
import styled from "styled-components";

import DateFormat from "components/DateFormat";

import IconClock from "components/icons/Clock";
import IconReceive from "components/icons/Receive";
import IconSend from "components/icons/Send";

import Box from "components/base/Box";
import Text from "components/base/Text";

import type { Transaction } from "data/types";

import colors from "shared/colors";

const rgba = (c: string, a: number) =>
  Color(c)
    .alpha(a)
    .rgb()
    .toString();

const border = p =>
  p.isConfirmed
    ? 0
    : `1px solid ${
        p.type === "RECEIVE" ? colors.green : rgba(colors.lead, 0.2)
      }`;

const Container = styled(Box).attrs({
  bg: p =>
    p.isConfirmed
      ? rgba(p.type === "RECEIVE" ? colors.green : colors.lead, 0.2)
      : "none",
  color: p => (p.type === "RECEIVE" ? colors.green : colors.lead),
  align: "center",
  justify: "center",
})`
  border: ${border};
  border-radius: 50%;
  position: relative;
  height: 24px;
  width: 24px;
`;

const WrapperClock = styled(Box).attrs({
  bg: "white",
  color: "grey",
})`
  border-radius: 50%;
  position: absolute;
  bottom: -4px;
  right: -4px;
  padding: 1px;
`;

class TxType extends PureComponent<{
  isConfirmed: boolean,
  type: string,
}> {
  render() {
    const { isConfirmed, type, ...props } = this.props;

    const content = (
      <Container type={type} isConfirmed={isConfirmed} {...props}>
        {type === "RECEIVE" ? (
          <IconReceive size={12} />
        ) : (
          <IconSend size={12} />
        )}
        {!isConfirmed && (
          <WrapperClock>
            <IconClock size={10} />
          </WrapperClock>
        )}
      </Container>
    );
    return content;
  }
}

const styles = {
  type: {
    textTransform: "capitalize",
  },
};
function TransactionTypeFormatter({ type }: { type: string }) {
  return (
    <Text style={styles.type} bold>
      {type.toLowerCase()}
    </Text>
  );
}

class TxTypeDate extends PureComponent<{
  transaction: Transaction,
}> {
  render() {
    const { transaction } = this.props;

    return (
      <Box horizontal flow={10} align="center" width={250}>
        <TxType
          type={transaction.type}
          isConfirmed={transaction.confirmations > 0}
        />
        <Box color={colors.lead}>
          <TransactionTypeFormatter type={transaction.type} />
          <DateFormat format="ddd D MMM, h:mmA" date={transaction.created_on} />
        </Box>
      </Box>
    );
  }
}

export default TxTypeDate;
