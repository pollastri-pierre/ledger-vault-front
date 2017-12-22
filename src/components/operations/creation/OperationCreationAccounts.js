//@flow
import React from "react";
import { MenuList } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import AccountMenuItem from "./AccountMenuItem";
import type { Account } from "../../../data/types";

const styles = {
  tabTitle: {
    padding: "0 40px",
    marginBottom: 20,
    fontSize: 12,
    fontWeight: 600,
    color: "black",
    textTransform: "uppercase"
  }
};

function OperationCreationAccounts(props: {
  accounts: Account[],
  selectedAccount: ?Account,
  onSelect: Account => void,
  classes: { [_: $Keys<typeof styles>]: string }
}) {
  const { accounts, selectedAccount, onSelect, classes } = props;

  return (
    <div>
      <div className={classes.tabTitle}>Account to debit</div>
      <MenuList>
        {accounts.map(account => (
          <AccountMenuItem
            key={account.id}
            onSelect={onSelect}
            account={account}
            selected={selectedAccount && selectedAccount.id === account.id}
          />
        ))}
      </MenuList>
    </div>
  );
}

export default withStyles(styles)(OperationCreationAccounts);
