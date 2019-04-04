// @flow
import React, { PureComponent } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import { getAccountTitle } from "utils/accounts";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import colors from "shared/colors";

import CurrencyIndex from "components/CurrencyIndex";
import CounterValue from "components/CounterValue";
import Text from "components/Text";
import CurrencyAccountValue from "components/CurrencyAccountValue";

import type { Account } from "data/types";

const styles = {
  accountItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "normal",
    fontWeight: "normal",
    fontSize: 13,
    height: 64,
    padding: "5px 40px",
    "&:not(:last-child) > :last-child": {
      borderBottom: "solid 1px #eee"
    }
  },
  accountTop: {
    color: colors.black,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "6px 0"
  },
  accountBottom: {
    color: colors.steel,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "6px 0"
  },
  accountName: {},
  accountBalance: {
    fontWeight: 600
  },
  accountCurrency: {
    fontWeight: 600,
    fontSize: 10,
    textTransform: "uppercase"
  },
  accountCountervalue: {}
};

const DEFAULT_COLOR = colors.black;

class AccountMenuItem extends PureComponent<{
  selected: boolean,
  account: Account,
  onSelect: Account => void,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  onClick = () => this.props.onSelect(this.props.account);

  render() {
    const { account, selected, classes } = this.props;
    const erc20Format = account.account_type === "ERC20";
    const color = erc20Format
      ? DEFAULT_COLOR
      : getCryptoCurrencyById(account.currency_id).color;
    const token = erc20Format
      ? getERC20TokenByContractAddress(account.contract_address)
      : null;

    return (
      <MenuItem
        className={classes.accountItem}
        style={{ color }}
        button
        disableRipple
        selected={selected}
        onClick={this.onClick}
        key={account.id}
      >
        <div className={classes.accountTop}>
          <span className={classes.accountName}>
            {getAccountTitle(account)}
          </span>
          <span className={classes.accountBalance}>
            <CurrencyAccountValue
              account={account}
              value={account.balance}
              erc20Format={erc20Format}
            />
          </span>
        </div>
        <div className={classes.accountBottom}>
          {token ? (
            <Text>{token.name}</Text>
          ) : (
            <CurrencyIndex
              currency={account.currency_id}
              index={account.index}
            />
          )}
          <span className={classes.accountCountervalue}>
            <CounterValue value={account.balance} fromAccount={account} />
          </span>
        </div>
      </MenuItem>
    );
  }
}
export default withStyles(styles)(AccountMenuItem);
