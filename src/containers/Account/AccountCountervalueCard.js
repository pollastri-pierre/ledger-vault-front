// @flow
import { withStyles } from "@material-ui/core/styles";
import CounterValue from "components/CounterValue";
import React, { Component } from "react";
import { Trans } from "react-i18next";
import Card from "components/legacy/Card";
import CardField from "components/CardField";
import Text from "components/base/Text";
import type { Account } from "data/types";

const styles = {
  card: {
    marginLeft: 10,
    width: "50%",
  },
};

type Props = {
  account: Account,
  reloading: boolean,
  classes: Object,
};

class AccountCountervalueCard extends Component<Props> {
  render() {
    const { account, reloading, classes } = this.props;
    const ERC20Token = account.account_type === "ERC20";
    return (
      <Card
        className={classes.card}
        reloading={reloading}
        title={<Trans i18nKey="accountView:countervalue" />}
      >
        <CardField>
          <CounterValue
            value={account.balance}
            from={account.currency_id}
            disableCountervalue={ERC20Token}
          />
          {ERC20Token && (
            <Text>
              <Trans i18nKey="accountView:erc20NoCountervalue" />
            </Text>
          )}
        </CardField>
      </Card>
    );
  }
}

export default withStyles(styles)(AccountCountervalueCard);
