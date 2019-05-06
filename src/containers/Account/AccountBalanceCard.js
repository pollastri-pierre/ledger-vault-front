// @flow

import React, { Component } from "react";
import type { MemoryHistory } from "history";
import { withRouter } from "react-router";
import { Trans } from "react-i18next";

import CurrencyAccountValue from "components/CurrencyAccountValue";
import colors from "shared/colors";
import CounterValue from "components/CounterValue";
import Card from "components/base/Card";
import Button from "components/base/Button";
import Text from "components/base/Text";
import Box from "components/base/Box";
import IconSend from "components/icons/Send";
import IconReceive from "components/icons/Receive";
import { Label } from "components/base/form";
import type { Account } from "data/types";

const SendIcon = () => <IconSend size={11} />;
const ReceiveIcon = () => <IconReceive size={11} />;

type Props = {
  account: Account,
  history: MemoryHistory,
};

class AccountBalanceCard extends Component<Props> {
  onReceive = () => {
    const { history, account } = this.props;
    history.push(`${account.id}/receive/${account.id}`);
  };

  onSend = () => {
    const { history, account } = this.props;
    history.push(`${account.id}/send/${account.id}`);
  };

  render() {
    const { account } = this.props;
    const isERC20Token = account.account_type === "ERC20";
    return (
      <Card>
        <Label>
          <Trans i18nKey="accountView:balance" />
        </Label>
        <Box flow={20}>
          <Box horizontal flow={10} align="center">
            <Text bold header>
              <CurrencyAccountValue
                account={account}
                value={account.balance}
                erc20Format={account.account_type === "ERC20"}
              />
            </Text>
            <Text small>
              <CounterValue
                value={account.balance}
                fromAccount={account}
                renderNA={
                  isERC20Token ? (
                    <Text>
                      <Trans i18nKey="accountView:erc20NoCountervalue" />
                    </Text>
                  ) : null
                }
              />
            </Text>
          </Box>
          <Box horizontal align="center" flow={10}>
            <Button
              variant="filled"
              customColor={colors.ocean}
              size="tiny"
              IconLeft={ReceiveIcon}
              onClick={this.onReceive}
            >
              Receive
            </Button>
            <Button
              variant="filled"
              customColor={colors.ocean}
              size="tiny"
              IconLeft={SendIcon}
              onClick={this.onSend}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Card>
    );
  }
}

export default withRouter(AccountBalanceCard);
