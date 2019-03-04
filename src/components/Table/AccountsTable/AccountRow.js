// @flow

import React, { PureComponent } from "react";

import MUITableRow from "@material-ui/core/TableRow";

import type { Account } from "data/types";

import type { TableDefinition } from "../types";
import AccountBodyCell from "./AccountBodyCell";

type AccountRowProps = {
  account: Account,
  onClick: Account => void,
  tableDefinition: TableDefinition
};

const accountRowHover = { cursor: "pointer" };

class AccountRow extends PureComponent<AccountRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.account);
  };

  render() {
    const { account, onClick, tableDefinition } = this.props;

    return (
      <MUITableRow
        key={account.id}
        hover={!!onClick}
        style={onClick ? accountRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        {tableDefinition.map(item => (
          <AccountBodyCell account={account} item={item} key={item.body.prop} />
        ))}
      </MUITableRow>
    );
  }
}

export default AccountRow;
