// @flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import colors from "shared/colors";
import type { Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import DataTable from "components/DataTable";
import AccountName from "components/AccountName";
import DateFormat from "components/DateFormat";
import AccountStatus from "components/AccountStatus";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Text from "components/base/Text";

type Cell = {
  account: Account
};
class DateColumn extends Component<Cell> {
  render() {
    const { account } = this.props;
    return (
      <span>
        <DateFormat format="ddd D MMM, h:mmA" date={account.created_on} />
      </span>
    );
  }
}

class AccountColumn extends Component<Cell> {
  render() {
    const { account } = this.props;
    return account ? <AccountName account={account} /> : null;
  }
}

class StatusColumn extends Component<Cell> {
  render() {
    const { account } = this.props;
    return (
      <Text uppercase>
        <AccountStatus account={account} />
      </Text>
    );
  }
}

class AmountColumn extends Component<Cell> {
  render() {
    const { account } = this.props;
    return (
      <CurrencyAccountValue
        account={account}
        value={account.balance}
        erc20Format={account.account_type === "ERC20"}
      />
    );
  }
}

const COLS = [
  {
    className: "date",
    title: "date",
    Cell: DateColumn
  },
  {
    className: "account",
    title: "account",
    Cell: AccountColumn
  },
  {
    className: "status",
    title: "status",
    Cell: StatusColumn
  },
  {
    className: "amount",
    title: "balance",
    Cell: AmountColumn
  }
];

const styles = {
  tr: {
    margin: "0",
    padding: "0",
    "&:before": {
      background: colors.ocean,
      content: "''",
      height: "26px",
      width: "0px",
      position: "absolute",
      left: "0",
      marginTop: "6px"
    },
    "&:hover:before": {
      width: "5px",
      transition: "width 200ms ease"
    }
  },
  unknown: {
    opacity: 0.4,
    cursor: "default !important"
  }
};

class RowT extends Component<{
  cell: Cell,
  children: React$Node,
  classes: { [_: $Keys<typeof styles>]: string },
  openAccount: number => void
}> {
  open = () => {
    this.props.openAccount(this.props.cell.account.id);
  };

  render() {
    const { children, classes } = this.props;
    return (
      <tr
        style={{ cursor: "pointer" }}
        className={classes.tr}
        onClick={this.open}
      >
        {children}
      </tr>
    );
  }
}

const Row = withStyles(styles)(RowT);

type Props = {
  accounts: Array<Account>,
  columnIds: Array<string>,
  history: Object
};
class DataTableAccount extends Component<Props, *> {
  state = {
    columns: COLS.filter(c => this.props.columnIds.includes(c.className))
  };

  openAccount = (id: string) => {
    const orgaName = location.pathname.split("/")[1];
    this.props.history.push(`/${orgaName}/account/${id}`);
  };

  renderRow = (props: *) => <Row {...props} openAccount={this.openAccount} />;

  render() {
    const { columns } = this.state;
    const { accounts } = this.props;
    const data = accounts.map(a => ({ account: a }));

    return <DataTable data={data} columns={columns} Row={this.renderRow} />;
  }
}

export default withRouter(DataTableAccount);
